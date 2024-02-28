<template>
  <div>
    <q-dialog v-model="depositDialog" @update:modelValue="handleDialog">
      <div>
        <div class="recharge-container">
          <div class="deposit-container">
            <div class="fz-20 fw-b mb-4">Deposit</div>
            <div class="deposite-section mb-6">
              <div class="al-c recharge-input">
                <input maxlength="8" class="r-ipt flex-1" v-model="amount" type="text" />
                <span class="num">,000,000</span>
                <span class="land-text fz-14">LAND</span>
              </div>
              <div class="mt-1 fz-12 land-to-usd">1,000,000LAND=1USD</div>
            </div>

            <resource-count @estimateInput="estimateInput"></resource-count>
          </div>

          <div class="recharge-act d-flex">
            <pay-network style="width: 50%" @onNetwork="onNetwork"></pay-network>
            <pay-coin
              v-show="chainId"
              class="flex-1"
              v-model="coinType"
              :chainId="chainId"
              @onSelectCoin="onSelectCoin"
            ></pay-coin>
          </div>

          <div class="recharge-bar al-c space-btw">
            <div class="amount-info">
              <div class="fz-16 fw-b">Total</div>
              <div style="height: 42px" class="al-c" v-show="countEthLoading">
                <q-circular-progress indeterminate rounded size="20px" color="#000" />
              </div>
              <div v-show="!countEthLoading">
                <span class="amount fw-b">{{ transformAmount }}</span>
                <span class="coin-type fz-12 ml-1">{{ coinType }}</span>
                <span class="usd fz-12 ml-2" v-show="coinType == 'ETH'">≈{{ amount }}USD</span>
              </div>
            </div>

            <q-btn
              v-if="!isApproved"
              :loading="approving"
              flat
              class="recharge-btn fz-16 cursor-p"
              @click="handleApprove"
              :disable="disabled"
              >Approve</q-btn
            >
            <q-btn
              v-else
              flat
              :loading="depositing"
              class="recharge-btn fz-16 cursor-p"
              @click="handleRechargeLand"
              :disable="disabled"
              >Confirm</q-btn
            >
          </div>
        </div>
        <deposit-dialog-popup :class="{ popup: popup }" :stepIdx="stepIdx"></deposit-dialog-popup>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import {
  IQuoter__factory,
  UNILand__factory,
  Land__factory,
  ICoin__factory,
} from "@4everland/land-v5";
import { optimismRecharge, chainAddrList } from "../utils/chainAddrs";
import PayCoin from "./pay-coin.vue";
import PayNetwork from "./pay-network.vue";
import ResourceCount from "./resource-count.vue";
import DepositDialogPopup from "./deposit-dialog-popup.vue";
import Everpay from "everpay";

import { debounce, uid2euid } from "@/utils/helper";
import { BigNumber, providers } from "ethers";
import { formatEther, solidityPack, parseUnits, formatUnits, parseEther } from "ethers/lib/utils";
import { mapState } from "vuex";
const uint256Max = BigNumber.from("1").shl(256).sub(1);

export default {
  data() {
    return {
      depositDialog: false,
      coinType: "USDC",
      amount: "",
      countEthLoading: false,
      chainId: "",
      usdcAmount: BigNumber.from("0"),
      ethAmount: BigNumber.from("0"),
      allowance: BigNumber.from("0"),
      curAmountDecimals: 18,
      popup: false,
      account: null,
      approving: false,
      depositing: false,
      everPayTokenList: [],
      stepIdx: 0,
    };
  },
  async created() {
    window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    await this.getAccount();
    this.checkApprove();
  },
  unmounted() {
    window.ethereum.off("accountsChanged", this.handleAccountsChanged);
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    disabled() {
      return !this.amount || !this.coinType || !this.chainId;
    },
    opEthLandRecharge() {
      let provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return UNILand__factory.connect(optimismRecharge, signer);
    },
    ERC20() {
      let provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return ICoin__factory.connect(this.coinAddr, signer);
    },
    LandRecharge() {
      let provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return Land__factory.connect(this.curChainInfo.landRecharge, signer);
    },
    transformAmount() {
      if (this.coinType == "ETH") {
        return (formatEther(this.ethAmount) * 1).toFixed(5);
      } else {
        return this.usdcAmount.toString();
      }
    },
    curChainInfo() {
      return chainAddrList.find((it) => it.chainId == this.chainId);
    },
    coinAddr() {
      const coinType = this.coinType.toLowerCase();
      return this.curChainInfo?.coin[coinType];
    },
    isApproved() {
      if (this.chainId == 99999999) return true;
      if (this.coinType == "ETH") return true;
      return this.allowance.eq(uint256Max) || this.allowance.gte(this.usdcAmount);
    },
    payAmounts() {
      if (!this.amount) return BigNumber.from("0");
      let amoutU = parseUnits(this.amount, 24).div(1e6);
      const subDecimal = 18 - this.curAmountDecimals;
      if (subDecimal > 0) {
        amoutU = amoutU.div(BigNumber.from(10 ** subDecimal));
      }
      return amoutU;
    },
    euid() {
      return uid2euid(this.userInfo.uid);
    },
  },
  methods: {
    estimateInput(val) {
      this.amount = val;
    },
    async onNetwork(chain) {
      this.chainId = chain;
      if (this.chainId == 99999999) {
        this.coinType = "USDC";
        await this.initEverPay();
        return;
      }
      if (!this.coinType) return;
      if (this.coinType == "ETH") {
        this.usdc2eth();
      } else {
        await this.checkApprove();
      }
    },
    async onSelectCoin() {
      if (this.chainId == 99999999) return;
      if (!this.coinType) return;
      if (this.coinType == "ETH") {
        this.usdc2eth();
      } else {
        await this.checkApprove();
      }
    },
    async handleEthRecharge() {
      if (this.disabled) return;
      try {
        this.$loading("Loading...");
        const tx = await this.opEthLandRecharge.mintByETH(this.euid, {
          value: this.ethAmount,
        });
        const receipt = await tx.wait();
        console.log(receipt);
        this.$alert("recharge success!!");
        this.depositDialog = false;
      } catch (error) {
        this.onErr(error);
      }
      this.$loadingClose();
    },
    async initEverPay() {
      try {
        const everPay = new Everpay();
        console.log(this.account);
        const data = await everPay.balances({
          account: this.account,
        });
        console.log(data);
        const everPayTokenList = data.filter(
          (it) =>
            it.chainType == "ethereum" &&
            (it.symbol == "USDC" || it.symbol == "USDT" || it.symbol == "DAI")
        );

        this.everPayTokenList = everPayTokenList;
        console.log(this.everPayTokenList);
      } catch (err) {
        if (err.code && err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          this.$alert(err.message);
        }
      }
    },
    async handleEverpayPayment() {
      let provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const everpayPayInfo = this.everPayTokenList.find((it) => it.symbol == this.coinType);
      const balance = parseEther(everpayPayInfo.balance.toString());

      let payAmounts = this.payAmounts;

      console.log(balance.lt(payAmounts));
      if (balance.lt(payAmounts)) {
        throw new Error("insufficient-balance");
      }

      if (everpayPayInfo.symbol == "DAI") {
        payAmounts = formatEther(payAmounts);
      } else {
        payAmounts = formatUnits(payAmounts.div(10 ** 12), 6);
      }
      const everpay = new Everpay({
        account: this.account,
        chainType: "ethereum",
        ethConnectedSigner: signer,
      });
      const data = await everpay.transfer({
        tag: everpayPayInfo.tag,
        amount: payAmounts,
        to: "0xb7B4360F7F6298dE2e7a11009270F35F189Bd77E",
        data: {
          account: this.userInfo.uid,
        },
      });
      console.log(data);
      await this.$alert(
        "Deposit successful! The 4EVER cross-chain bridge is in action, using USDC on Polygon for the final step. Please wait patiently for your LAND to be credited."
      );
    },
    async handleRechargeLand() {
      this.depositing = true;
      this.popup = true;
      this.stepIdx = 1;
      try {
        if (this.chainId == 99999999) {
          await this.handleEverpayPayment();
          this.stepIdx = 2;
          this.depositing = false;
          return;
        }
        let receipt = "";
        if (this.coinType == "ETH") {
          if (!this.ethAmount) return;
          await this.handleEthRecharge();
        } else {
          console.log(this.payAmounts);
          const tx = await this.LandRecharge.mint(
            this.coinAddr,
            this.euid, // euid
            this.payAmounts
          );
          receipt = await tx.wait();
          console.log(receipt);
        }
        console.log("recharge success");
        this.stepIdx = 2;
      } catch (error) {
        this.onErr(error);
      }
      this.depositing = false;
    },
    handleDialog(val) {
      if (!val) {
        this.popup = false;
      }
    },
    async usdc2eth() {
      let provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      if (this.disabled) return;
      try {
        this.countEthLoading = true;
        const quoter = IQuoter__factory.connect(
          "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
          signer
        );
        const path = solidityPack(
          ["address", "uint24", "address"],
          [
            "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // usdc addr
            500, //
            this.coinAddr,
          ]
        );
        if (this.usdcAmount.eq(BigNumber.from("0"))) {
          this.ethAmount = BigNumber.from("0");
          this.countEthLoading = false;
          return BigNumber.from("0");
        }

        const res = await quoter.callStatic.quoteExactOutput(
          path,
          parseUnits(this.usdcAmount.toString(), 6)
        );
        console.log(formatEther(res));
        this.ethAmount = res;
        this.countEthLoading = false;
      } catch (error) {
        console.log(error);
      }
      this.countEthLoading = false;
    },
    onErr(err) {
      if (!err) return console.log("---- err null");
      if (/unknown account/.test(err.message)) {
        return this.getAccount();
      }
      const { data } = err;
      let msg = err.message;
      if (data) {
        msg = data.message || msg;
      }
      if (/repriced/i.test(msg) && /replaced/i.test(msg)) {
        return this.$toast("Transaction was replaced.");
      }
      if (/missing revert data/i.test(msg)) {
        msg = "Network Error";
      } else if (/user rejected/i.test(msg)) {
        msg = "Your transaction has been canceled.";
      } else if (/transaction failed/i.test(msg)) {
        msg = "Transaction Failed";
      } else if (/ipfs/.test(msg) && /invalid params/.test(msg)) {
        msg = "IPFS Storage Expired, extending service duration is required.";
      } else if (
        /exceeds balance/i.test(msg) ||
        msg == "overflow" ||
        /insufficient funds/i.test(msg) ||
        /insufficient-balance/i.test(msg)
      ) {
        msg = "Insufficient balance in your wallet.";
      } else if (msg.length > 100) {
        const mat = /^(.+)\[/.exec(msg);
        if (mat) msg = mat[1];
      }
      if (/already pending for origin/gi.test(msg)) {
        msg = "Wrong network, please switch your wallet network and try again.";
      }

      console.log(msg);
      return this.$alert(msg);
    },
    async getAccount() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.account = accounts[0];
    },
    async handleAccountsChanged(accounts) {
      this.account = accounts[0];
      if (this.chainId == 99999999) {
        await this.initEverPay();
      } else {
        await this.checkApprove();
      }
    },
    async checkApprove() {
      if (!this.curChainInfo) return;
      this.approving = true;
      try {
        const allowance = await this.ERC20.allowance(this.account, this.curChainInfo.landRecharge);
        this.curAmountDecimals = await this.ERC20.decimals();
        console.log(allowance, "allowance");
        this.allowance = allowance;
      } catch (error) {
        console.log(error);
        // if locked wallet  throw Error account, need get account
        this.getAccount();
      }
      this.approving = false;
    },
    async handleApprove() {
      if (this.disabled) return;
      this.approving = true;
      this.popup = true;
      this.stepIdx = 0;
      try {
        let gas = await this.ERC20.estimateGas.approve(this.curChainInfo.landRecharge, uint256Max);
        console.log("gas", gas);
        let gasPrice = await this.ERC20.provider.getGasPrice();

        const tx = await this.ERC20.approve(this.curChainInfo.landRecharge, uint256Max, {
          gasLimit: gas.mul(15).div(10),
          gasPrice: gasPrice.mul(12).div(10),
        });
        console.log("tx", tx);
        const receipt = await tx.wait();
        console.log(receipt);
      } catch (error) {
        this.onErr(error);
      }
      this.approving = false;
      this.checkApprove();
    },
  },
  components: {
    PayCoin,
    PayNetwork,
    ResourceCount,
    DepositDialogPopup,
  },
  watch: {
    amount() {
      this.amount = this.amount.replace(/[^\d]/g, "");
      if (this.amount) {
        this.usdcAmount = BigNumber.from(this.amount);
      } else {
        this.usdcAmount = BigNumber.from("0");
      }
      if (this.coinType == "ETH") {
        debounce(() => {
          this.usdc2eth();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.recharge-container {
  position: relative;
  z-index: 999;
  width: 540px;
  background: #0f172a;
  border-radius: 16px;
  overflow: hidden;
  .deposit-container {
    padding: 24px;
    .recharge-input {
      border-radius: 4px;
      border: 1px solid #334155;
      .r-ipt {
        font-size: 20px;
        font-family: "DIN Alternate";
        text-indent: 16px;
        text-align: right;
        background: #0f172a;
        color: #1eefa4;
      }
      .num {
        font-family: "DIN Alternate";
        font-size: 20px;
        padding-right: 16px;
        color: #cbd5e1;
      }
      .land-text {
        display: inline-block;
        width: 160px;
        color: #cbd5e1;
        text-align: center;
        font-size: 14px;
        padding: 16px 0px;
        background: #1e293b;
      }
    }

    .land-to-usd {
      color: #cbd5e1;
    }
  }

  .recharge-act {
    padding: 0 24px 24px 24px;
    gap: 8px;
  }

  .recharge-bar {
    padding: 8px 16px;
    background: #94f9ca;
    .amount-info {
      color: #0f172a;
      .amount {
        font-family: "DIN Alternate";
        font-size: 28px;
      }
      .coin-type {
        color: #334155;
      }
      .usd {
        color: #64748b;
      }
    }
    .recharge-btn {
      padding: 15px 26px 14px 26px;
      border-radius: 4px;
      background: #13c68a;
      font-weight: bold;
      color: #0f172a;
    }
  }
}
</style>

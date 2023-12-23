<template>
  <div class="q-pa-md">
    <resource-notice></resource-notice>
    <div class="resource-plate row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="land-container">
          <div class="fz-20 fw-b">Balance</div>
          <div class="my-4 al-c space-btw">
            <div class="land-content h-flex">
              <div class="land-content-top">
                <span class="land-amount">{{ formatLand.land }}</span>
                <span class="fz-14">{{ formatLand.unit }}</span>
                <span class="fw-b fz-20 ml-4">LAND</span>
              </div>

              <div class="land-content-bottom mt-1">≈{{ land2Usd }}USD</div>
            </div>
            <div class="conversion-btn cursor-p" @click="showConversion = !showConversion">
              Conversion
            </div>
          </div>

          <div class="descrition">
            <span class="cursor-p">What's LAND?</span>
            <span class="px-2">|</span>
            <span class="cursor-p">Pricing</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="usage-container">
          <div class="al-c">
            <span class="fz-20 fw-b">Usage & Free Resource</span>
            <!-- <img class="ml-1 cursor-p" width="24" src="/img/resource/help.svg" alt="" /> -->
          </div>

          <template v-for="item in transformUsage" :key="item.name">
            <resource-progress
              class="mt-4"
              :name="item.name"
              :used="item.used"
              :total="item.total"
              :color="item.color"
              :percent="item.percent"
              :showConversion="showConversion"
              :land2Resource="land2Resource[item.type]"
            ></resource-progress>
          </template>
        </div>
      </div>
    </div>

    <div class="recharge-container my-6">
      <div class="deposit-container">
        <div class="fz-20 fw-b mb-4">Deposit</div>
        <div class="deposite-section mb-4">
          <div class="al-c recharge-input" style="width: 50%">
            <input maxlength="8" class="r-ipt flex-1" v-model="amount" type="text" />
            <span class="num">,000,000</span>
            <span class="land-text fz-14">LAND</span>
          </div>
          <div class="mt-1 fz-12 land-to-usd">1,000,000LAND=1USD</div>
        </div>

        <resource-count @estimateInput="estimateInput"></resource-count>
      </div>

      <div class="recharge-act d-flex">
        <div class="row q-col-gutter-md" style="width: 100%">
          <div class="col-12 col-md-6">
            <pay-network @onNetwork="handleNetwork"></pay-network>
          </div>
          <div class="col-12 col-md-6">
            <pay-coin @onSelectCoin="onSelectCoin"></pay-coin>
          </div>
        </div>
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
          </div>
        </div>
        <div
          class="recharge-btn fz-16 cursor-p"
          :class="{ disabled: disabled }"
          @click="handleEthRecharge"
        >
          Confirm
        </div>

        <!-- <q-btn color="#13C68A" outline label="Confirm" /> -->
      </div>
    </div>

    <bill-details></bill-details>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getFileSize, debounce, uid2euid } from "@/utils/helper";
import { formatEther, solidityPack, parseUnits } from "ethers/lib/utils";
import { BigNumber, providers } from "ethers";
import { IQuoter__factory, UNILand__factory } from "@4everland/land-v5";
import { chainAddrList } from "./utils/chainAddrs";
import ResourceNotice from "./componets/resource-notice.vue";
import ResourceProgress from "./componets/resource-progress.vue";
import ResourceCount from "./componets/resource-count.vue";
import { optimismRecharge } from "./utils/chainAddrs";
import PayNetwork from "./componets/pay-network.vue";
import PayCoin from "./componets/pay-coin.vue";
import BillDetails from "./componets/bill-details.vue";
export default {
  data() {
    return {
      amount: "",
      coinType: "ETH",
      showConversion: false,
      stablecoin: true,
      usdcAmount: BigNumber.from("0"),
      ethAmount: BigNumber.from("0"),
      chainId: "",
      countEthLoading: false,
    };
  },
  created() {
    this.$store.dispatch("resourceStore/getLand");
    this.$store.dispatch("resourceStore/getUsage");
    this.$store.dispatch("resourceStore/getPrice");
  },
  computed: {
    ...mapGetters("resourceStore", ["formatLand", "land2Resource"]),
    ...mapState({
      usage: (s) => s.usageInfo,
      userInfo: (s) => s.userInfo,
    }),
    ...mapState("resourceStore", ["land", "usage"]),
    land2Usd() {
      const land = Number(formatEther(this.land));
      return Math.floor(land / 1e6);
    },
    transformUsage() {
      const usage = this.usage.filter((it) => it.type == "IPFS_STORAGE" || it.type == "TRAFFIC");
      return usage.map((it) => {
        let name = "";
        let color = "";
        let total = it.total;
        if (this.showConversion) {
          total = it.total + this.land2Resource[it.type].size;
        }
        if (it.type == "IPFS_STORAGE") {
          name = "Storage (IPFS)";
          color = "#57B9BC";
        } else {
          name = "BandWidth";
          color = "#F3CC5C";
        }
        return {
          type: it.type,
          name,
          used: getFileSize(it.used, true),
          total: getFileSize(it.total),
          percent: (it.used / total).toFixed(2) * 1,
          color,
        };
      });
    },
    signer() {
      let provider = new providers.Web3Provider(window.ethereum);
      return provider.getSigner();
    },
    opEthLandRecharge() {
      return UNILand__factory.connect(optimismRecharge, this.signer);
    },
    curChainInfo() {
      return chainAddrList.find((it) => it.chainId == this.chainId);
    },
    coinAddr() {
      const coinType = this.coinType.toLowerCase();
      return this.curChainInfo?.coin[coinType];
    },
    euid() {
      return uid2euid(this.userInfo.uid);
    },
    transformAmount() {
      if (this.stablecoin) {
        return (formatEther(this.ethAmount) * 1).toFixed(5);
      } else {
        return this.usdcAmount.toString();
      }
    },
    disabled() {
      return !this.amount || this.chainId != 10;
    },
  },
  methods: {
    handleNetwork(chain) {
      this.chainId = chain;
    },
    onSelectCoin(coin) {
      this.coinType = coin.label;
      this.stablecoin = coin.stablecoin;
    },
    estimateInput(val) {
      this.amount = val;
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
      } catch (error) {
        this.onErr(error);
      }
      this.$loadingClose();
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
        /insufficient funds/i.test(msg)
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
  },

  components: {
    ResourceNotice,
    ResourceProgress,
    ResourceCount,
    PayNetwork,
    PayCoin,
    BillDetails,
  },
  watch: {
    amount() {
      this.amount = this.amount.replace(/[^\d]/g, "");
      if (this.amount) {
        this.usdcAmount = BigNumber.from(this.amount);
      } else {
        this.usdcAmount = BigNumber.from("0");
      }
      if (this.stablecoin) {
        debounce(() => {
          this.usdc2eth();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.land-container,
.usage-container {
  border-radius: 16px;
  background: #0f172a;
  padding: 16px;
  color: #fff;
  .land-content {
    .land-content-top {
      height: 46px; /* 115% */
      .land-amount {
        font-size: 40px;
        font-family: "DIN Alternate";
        margin-right: 2px;
      }
    }
    .land-content-bottom {
      color: #cbd5e1;
      font-size: 14px;
    }
  }
  .conversion-btn {
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid rgba(30, 239, 164, 0.25);

    color: #1eefa4;
  }

  .descrition {
    color: #cbd5e1;
    font-size: 12px;
  }
}

.recharge-container {
  background: #0f172a;
  border-radius: 16px;
  overflow: hidden;
  .deposit-container {
    padding: 16px 16px 24px 16px;
    border-bottom: 1px solid #334155;

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
    padding: 16px 16px 24px 16px;
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

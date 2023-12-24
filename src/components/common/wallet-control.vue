<template>
  <q-btn rounded color="primary" @click="handleClick" v-if="!isConnect || !isOpChain">
    {{ showText }}
  </q-btn>
  <slot v-else></slot>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    sameAddr: {
      type: Boolean,
      default: true, // invalid login addr eq wallet addr
    },
  },
  data() {
    return {
      accounts: [],
      chainId: window.ethereum.chainId,
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
    addrMatch() {
      if (!this.accounts.length) return false;
      return this.accounts[0].toLowerCase() == this.uid.toLowerCase();
    },
    showText() {
      if (!this.addrMatch) return "Connect Wallet";
      if (!this.isOpChain) return "Switch to Op Main Chain";
      return "";
    },
    isConnect() {
      if (this.sameAddr) return this.addrMatch;
      return this.accounts.length > 0;
    },
    isOpChain() {
      return this.chainId == "0xa";
    },
  },
  created() {
    this.initWallet();
    this.getAccount();
  },
  methods: {
    async handleClick() {
      if (!this.isConnect) {
        await this.getAccount();
      } else if (!this.isOpChain) {
        await this.switchOpChain();
      } else {
        // do something slot method
      }
    },
    async getAccount() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        this.accounts = accounts;

        if (this.sameAddr && !this.addrMatch) {
          throw new Error(
            `Please use the wallet address associated with the current account for signing. The current account is ${this.uid.cutStr(
              4,
              6
            )}`
          );
        }
      } catch (error) {
        console.log(error);
        let msg = error.message;
        this.$alert(msg);
      }
    },
    initWallet() {
      window.ethereum.on("accountsChanged", (accounts) => {
        this.accounts = accounts;
      });
      window.ethereum.on("chainChanged", (chainId) => {
        this.chainId = chainId;
        console.log(this.chainId);
      });
    },
    async addOpChain() {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xa",
              chainName: "Optimism LlamaNodes",
              rpcUrls: ["https://optimism.llamarpc.com"],
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        });
      } catch (addError) {
        console.log("res", addError);
      }
    },
    async switchOpChain() {
      this.addOpChain();
      try {
        const res = await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa" }],
        });
        console.log("res", res);
        if (res && res.error) {
          this.addOpChain();
        }
      } catch (error) {
        if (error.code == 4902 || error.data?.originalError.code == 4902) {
          this.addOpChain();
        } else {
          throw new Error(error.message);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

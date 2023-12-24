<template>
  <q-btn rounded color="primary" @click="handleClick" v-if="!isConnect || !isOpChain">
    {{ showText }}
  </q-btn>
  <slot v-else></slot>
</template>

<script>
const { VITE_MOSS_CHAINID } = import.meta.env;
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
      if (!this.isOpChain) return "Switch Network";
      return "";
    },
    isConnect() {
      if (this.sameAddr) return this.addrMatch;
      return this.accounts.length > 0;
    },
    isOpChain() {
      return this.chainId == this.genChainId(VITE_MOSS_CHAINID);
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
      });
    },
    async addOpChain() {
      try {
        let param = {
          chainId: 80001,
          chainName: "polygon mumbai",
          rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
          nativeCurrency: {
            name: "matic Coin",
            symbol: "MATIC",
            decimals: 18,
          },
        };
        if (VITE_MOSS_CHAINID != 80001) {
          param = {
            chainId: "0xa",
            chainName: "Optimism LlamaNodes",
            rpcUrls: ["https://optimism.llamarpc.com"],
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
          };
        }
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [param],
        });
      } catch (addError) {
        console.log("res", addError);
      }
    },
    async switchOpChain() {
      try {
        this.addOpChain();
        const chainId = this.genChainId(VITE_MOSS_CHAINID);
        const res = await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
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
    genChainId(id) {
      return "0x" + Number(id).toString(16);
    },
  },
};
</script>

<style lang="scss" scoped></style>

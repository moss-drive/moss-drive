<template>
  <div class="network-radio-container">
    <div class="title fz-20 fw-b mb-2">Network</div>
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6" v-for="(it, i) in chainList" :key="`md-${i}`">
        <div
          class="radio-item al-c cursor-p"
          @click="onSelect(it.chainId)"
          :class="{
            active: selected == it.chainId,
          }"
        >
          <img
            :src="
              selected == it.chainId
                ? '/img/resource/circle-active.svg'
                : '/img/resource/circle.svg'
            "
            alt=""
          />
          <img class="ml-2" :src="it.img" width="22" />
          <span
            class="fz-14 ml-1"
            :class="{
              'color-1': selected == it.chainId,
            }"
            >{{ it.name }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "",
    };
  },
  computed: {
    chainList() {
      const list = [
        // {
        //   label: "Polygon",
        //   name: "Polygon",
        //   img: "/img/resource/chain-icons/polygon.svg",
        //   chainId: this.$inDev ? 80001 : 137,
        // },
        // {
        //   label: "Ethereum",
        //   name: "Ethereum",
        //   img: "/img/resource/chain-icons/ethereum.svg",
        //   chainId: this.$inDev ? 11155111 : 1,
        // },
        // {
        //   label: "BSC",
        //   name: "BSC",
        //   img: "/img/resource/chain-icons/bsc.svg",
        //   chainId: this.$inDev ? 97 : 56,
        // },
        // {
        //   label: "Arbitrum",
        //   name: "Arbitrum",
        //   img: "/img/resource/chain-icons/arbitrum.svg",
        //   chainId: this.$inDev ? 421613 : 42161,
        // },
        // {
        //   label: "zkSync",
        //   name: "zkSync Era",
        //   img: "/img/resource/chain-icons/zksync.svg",
        //   chainId: this.$inDev ? 280 : 324,
        // },
        {
          label: "Optimism",
          name: "Optimism",
          img: "/img/resource/chain-icons/optimism.svg",
          chainId: 10,
        },
      ];

      return list;
    },
  },
  created() {
    window.ethereum.on("chainChanged", this.initSeleted);
    this.initSeleted();
  },
  methods: {
    initSeleted() {
      this.selected = parseInt(window.ethereum.chainId);
      this.$emit("onNetwork", this.selected);
    },
    async onSelect(chainId) {
      try {
        if (this.selected == chainId) return;
        this.selected = chainId;
        await this.switchNet(chainId);
        this.$emit("onNetwork", this.selected);
      } catch (error) {
        console.log(error);
        this.initSeleted();
      }
    },
    async switchNet(id) {
      const chainId = "0x" + id.toString(16);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        // location.reload();
      } catch (error) {
        console.log("switch error 2", error);
        if (error.code == 4902 || error.data?.originalError.code == 4902) {
          await this.addChain(chainId, id);
        } else {
          throw new Error(error.message);
        }
      }
    },
    async addChain(chainId, id) {
      let params = {
        137: {
          chainId,
          chainName: "Polygon Mainnet",
          rpcUrls: [
            "https://polygon.llamarpc.com",
            // "https://polygon-rpc.com",
          ],
          nativeCurrency: {
            name: "Polygon Coin",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://polygonscan.com"],
        },
        11155111: {
          chainId,
          chainName: "Spolia",
          rpcUrls: ["https://eth-sepolia.public.blastapi.io"],
          nativeCurrency: {
            name: "Sepolia-ETH",
            symbol: "SepoliaETH",
            decimals: 18,
          },
          // blockExplorerUrls: ["https://goerli.etherscan.io/"],
        },
        56: {
          chainId,
          chainName: "BSC Mainnet",
          rpcUrls: ["https://rpc.ankr.com/bsc"],
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://bscscan.com"],
        },
        80001: {
          chainId,
          chainName: "polygon mumbai",
          rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
          nativeCurrency: {
            name: "matic Coin",
            symbol: "MATIC",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        97: {
          chainId,
          chainName: "BSC Chapel",
          rpcUrls: ["https://bsc-testnet.public.blastapi.io"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },

        421613: {
          chainId,
          chainName: "Arbitrum Goerli",
          rpcUrls: ["https://endpoints.omniatech.io/v1/arbitrum/goerli/public"],
          nativeCurrency: {
            name: "Arbitrum Coin",
            symbol: "AGOR",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        42161: {
          chainId,
          chainName: "Arbitrum One",
          rpcUrls: ["https://arb1.arbitrum.io/rpc"],
          nativeCurrency: {
            name: "Arbitrum Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        280: {
          chainId,
          chainName: "zkSync Era Testnet",
          rpcUrls: ["https://testnet.era.zksync.dev"],
          nativeCurrency: {
            name: "zkSync Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        324: {
          chainId,
          chainName: "zkSync Era Mainnet",
          rpcUrls: ["https://mainnet.era.zksync.io"],
          nativeCurrency: {
            name: "zkSync Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        5611: {
          chainId,
          chainName: "opBNB Testnet",
          rpcUrls: ["https://opbnb-testnet-rpc.bnbchain.org"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        204: {
          chainId,
          chainName: "opBNB",
          rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "BNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        1442: {
          chainId,
          chainName: "Polygon zkEVM Testnet",
          rpcUrls: ["https://rpc.public.zkevm-test.net"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        1101: {
          chainId,
          chainName: "Polygon zkEVM",
          rpcUrls: ["https://rpc.ankr.com/polygon_zkevm"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        59140: {
          chainId,
          chainName: "Linea Test",
          rpcUrls: ["https://rpc.goerli.linea.build"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        59144: {
          chainId,
          chainName: "Linea",
          rpcUrls: ["https://linea-mainnet.infura.io/v3"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        10: {
          chainId,
          chainName: "Optimism LlamaNodes",
          rpcUrls: ["https://optimism.llamarpc.com"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
      }[id];
      if (!params) return;
      try {
        await window.ethereum.request(
          {
            method: "wallet_addEthereumChain",
            params: [params],
          },
          this.connectAddr
        );
      } catch (error) {
        console.log("add chain err", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
}

.radio-item {
  // width: 178px;
  height: 48px;
  border-radius: 4px;
  background: #1e293b;
  padding: 12px 16px;
  box-sizing: border-box;
}
.radio-item.active {
  border: 1px solid rgba(30, 239, 164, 0.25);
  background: #102230;
  font-weight: bold;
}
</style>

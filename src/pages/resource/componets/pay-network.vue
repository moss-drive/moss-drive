<template>
  <div class="network-radio-container al-c">
    <div class="title fz-16 fw-b mr-1">Network</div>
    <div class="row q-col-gutter-sm flex-1">
      <div class="col-12" v-for="(it, i) in chainList" :key="`md-${i}`">
        <div
          class="radio-item al-c cursor-p"
          @click="onSelect(it.chainId)"
          :class="{
            active: selected == it.chainId,
          }"
        >
          <img :src="it.img" width="22" />
          <span class="fz-14 ml-1">{{ it.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { switchNet } from "@/utils/wallet";
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
      await switchNet(id);
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

<template>
  <div class="network-radio-container al-c">
    <div class="title fz-16 fw-b mr-1">Network</div>
    <q-select
      class="flex-1"
      dense
      outlined
      v-model="selected"
      map-options
      options-html
      option-value="chainId"
      @update:model-value="handleChange"
      :options="chainList"
    />
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
        {
          label: `<div class="al-c"><img src="/img/resource/chain-icons/optimism.svg" width="24" alt="" /><span class="ml-2">Optimism</span></div>`,
          name: "Optimism",
          chainId: 10,
        },
        {
          label: `<div class="al-c"><img src="/img/resource/chain-icons/blast.svg" width="24" alt="" /><span class="ml-2">Blast</span></div>`,
          name: "Blast",
          chainId: 81457,
        },
        {
          label: `<div class="al-c"><img src="/img/resource/chain-icons/everpay.svg" width="24" alt="" /><span class="ml-2">Everpay</span></div>`,
          name: "Everpay",
          chainId: 99999999,
        },
      ];

      return list;
    },
  },
  created() {
    window.ethereum.on("chainChanged", this.initSeleted);
    this.initSeleted();
  },
  unmounted() {
    window.ethereum.off("chainChanged", this.initSeleted);
  },
  methods: {
    initSeleted() {
      let selected = parseInt(window.ethereum.chainId);
      const index = this.chainList.findIndex((it) => it.chainId == selected);
      if (index == -1) {
        this.selected = "-";
        this.$emit("onNetwork");
      } else {
        this.selected = selected;
        this.$emit("onNetwork", this.selected);
      }
    },
    async onSelect(chainId) {
      try {
        console.log(chainId);
        if (this.selected == chainId) return;
        this.selected = chainId;
        if (this.selected !== 99999999) {
          await switchNet(chainId);
          this.$emit("onNetwork", this.selected);
        } else {
          this.$emit("onNetwork", this.selected);
        }
      } catch (error) {
        console.log(error);
        this.initSeleted();
      }
    },
    handleChange({ chainId }) {
      this.onSelect(chainId);
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

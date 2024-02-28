<template>
  <div class="al-c">
    <div class="fz-16 fw-b mr-1">Token</div>
    <q-select
      class="flex-1"
      dense
      outlined
      :model-value="modelValue"
      map-options
      options-html
      @update:model-value="onSelect"
      :options="coinList"
    />
  </div>
</template>

<script>
import { chainAddrList } from "../utils/chainAddrs";

export default {
  props: {
    chainId: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
    },
  },
  emits: ["onSelectCoin", "update:modelValue"],
  data() {
    return {
      selected: "-",
    };
  },
  computed: {
    curChainInfo() {
      return chainAddrList.find((it) => it.chainId == this.chainId);
    },
    coinList() {
      if (!this.curChainInfo) return [];
      let arr = Object.keys(this.curChainInfo.coin);
      const coinList = [
        {
          label: `<div class="al-c"><img src="/img/resource/symbol-icons/usdc.svg" width="24" alt="" /><span class="ml-2">USD Coin</span></div>`,
          value: "USDC",
        },
        {
          label: `<div class="al-c"><img src="/img/resource/symbol-icons/usdt.svg" width="24" alt="" /><span class="ml-2">Tether USD</span></div>`,
          value: "USDT",
        },
        {
          label: `<div class="al-c"><img src="/img/resource/symbol-icons/dai.svg" width="24" alt="" /><span class="ml-2">Dai Stablecoin</span></div>`,
          value: "DAI",
        },
        {
          label: `<div class="al-c"><img src="/img/resource/symbol-icons/eth.svg" width="24" alt="" /><span class="ml-2">ETH</span></div>`,
          value: "ETH",
        },
      ];
      let finalCoins = [];
      for (const item of coinList) {
        for (const it of arr) {
          if (item.value.toLowerCase() == it.toLowerCase()) {
            finalCoins.push(item);
          }
        }
      }
      return finalCoins;
    },
  },
  methods: {
    onSelect(item) {
      this.selected = item.value;
      this.$emit("update:modelValue", item.value);
      this.$emit("onSelectCoin", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.coin-label {
  width: 100%;
  border-radius: 4px;
  background: #1e293b;
  box-sizing: border-box;
  .name {
    line-height: 16px;
  }
  .name-label {
    line-height: normal;
    color: #cbd5e1;
  }
}
.coin-label.active {
  border: 1px solid rgba(30, 239, 164, 0.25);
  background: #102230;
}
.v-tooltip__content {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
}
.v-tooltip__content::after {
  display: block;
  content: "";
  position: absolute;
  right: 52px;
  bottom: -20px;
  border: 10px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}
</style>

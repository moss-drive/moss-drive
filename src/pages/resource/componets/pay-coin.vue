<template>
  <div>
    <div class="fz-20 fw-b mb-2">Choose Token</div>
    <div class="al-c flex-wrap" style="gap: 8px">
      <div
        @click="onSelect(it.label)"
        class="coin-label py-2 pl-4 cursor-p d-flex space-btw"
        :class="{
          active: selected == it.label,
        }"
        v-for="(it, i) in coinList"
        :key="i"
      >
        <div class="al-c flex-1">
          <img
            width="16"
            :src="
              selected == it.label ? '/img/resource/circle-active.svg' : '/img/resource/circle.svg'
            "
            alt=""
          />
          <img class="ml-2" :src="it.img" width="32" />
          <div class="fz-12 ml-2">
            <div class="fz-14 name">
              {{ it.name }}
            </div>
            <div class="name-label">{{ it.showLabel }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["onSelectCoin"],
  data() {
    return {
      selected: "USDC",
    };
  },
  computed: {
    coinList() {
      const coinList = [
        {
          label: "USDC",
          showLabel: "USDC",
          name: "USDC Coin",
          img: "/img/resource/symbal-icons/usdc.svg",
        },
        {
          label: "USDT",
          showLabel: "USDT",
          name: "Tether USD",
          img: "/img/resource/symbal-icons/usdt.svg",
        },
        {
          label: "DAI",
          showLabel: "DAI",
          name: "Dai Stablecoin",
          img: "/img/resource/symbal-icons/dai.svg",
        },
      ];

      return coinList;
    },
  },
  methods: {
    onSelect(label) {
      this.selected = label;
      this.$emit("onSelectCoin", label);
    },
  },

  watch: {
    chainId() {
      this.selected = "USDC";
    },
  },
};
</script>

<style lang="scss" scoped>
.coin-label {
  height: 48px;
  width: calc(50% - 4px);
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
  border: 1px solid #1eefa4;
  background: #102230;
  .name {
    font-weight: bold;
    color: #1eefa4;
  }
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

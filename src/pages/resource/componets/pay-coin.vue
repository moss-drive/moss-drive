<template>
  <div class="al-c">
    <div class="fz-16 fw-b mr-1">Token</div>
    <div class="al-c flex-wrap flex-1">
      <div
        @click="onSelect(it)"
        class="coin-label py-2 pl-4 cursor-p d-flex space-btw"
        :class="{
          active: selected == it.label,
        }"
        v-for="(it, i) in coinList"
        :key="i"
      >
        <div class="al-c flex-1">
          <img :src="it.img" width="24" />
          <div class="fz-12 ml-2">
            <span class="fz-14 name fw-b">
              {{ it.name }}
            </span>
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
      selected: "ETH",
    };
  },
  computed: {
    coinList() {
      const coinList = [
        // {
        //   label: "USDC",
        //   showLabel: "USDC",
        //   name: "USDC Coin",
        //   img: "/img/resource/symbal-icons/usdc.svg",
        //   stablecoin: true,
        // },
        // {
        //   label: "USDT",
        //   showLabel: "USDT",
        //   name: "Tether USD",
        //   img: "/img/resource/symbal-icons/usdt.svg",
        //   stablecoin: true,
        // },
        // {
        //   label: "DAI",
        //   showLabel: "DAI",
        //   name: "Dai Stablecoin",
        //   img: "/img/resource/symbal-icons/dai.svg",
        //   stablecoin: true,
        // },

        {
          label: "ETH",
          showLabel: "ETH",
          name: "ETH",
          img: "/img/resource/symbal-icons/eth.svg",
          stablecoin: false,
        },
      ];

      return coinList;
    },
  },
  methods: {
    onSelect(item) {
      this.selected = item.label;
      this.$emit("onSelectCoin", item);
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

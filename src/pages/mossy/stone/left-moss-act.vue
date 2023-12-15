<template>
  <div>
    <div class="mt-3 ta-r">
      <q-btn class="flex-1" color="primary" rounded>BUY STONE</q-btn>
      <q-btn class="flex-1 ml-4" outline color="primary" rounded>SELL STONE</q-btn>
    </div>
  </div>
</template>

<script>
import { MossHub } from "../../../utils/moss-hub";

export default {
  props: {
    id: null,
  },
  data() {
    return {
      mossHub: null,
    };
  },
  methods: {
    async initMoss() {
      if (!this.mossHub) {
        try {
          const mossHub = new MossHub();
          await mossHub.checkNet();
          this.mossHub = mossHub;
        } catch (error) {
          this.$alert(error.message);
        }
      }
      return this.mossHub;
    },
    async onBuy() {
      if (!this.initMoss()) return;
      try {
        this.mossHub.mint();
      } catch (error) {
        this.$alert(error.message);
      }
    },
    async onSell() {},
  },
};
</script>
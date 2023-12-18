<template>
  <iframe
    class="d-n"
    @load="onLoad"
    ref="iframe"
    :src="'/check-wallet.html?t=' + checkTimes"
    frameborder="0"
  ></iframe>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
  },
  data() {
    return {
      checkFlag: -1,
      checkTimes: 0,
    };
  },
  watch: {
    isFocus(val) {
      if (val) this.checkTimes++;
    },
    checkFlag(val, old) {
      console.log("wallet-check", val);
      if (old == -1) return;
      this.$toast("Wallet changed");
      setTimeout(() => {
        location.reload();
      }, 2e3);
    },
  },
  methods: {
    onLoad() {
      this.checkFlag = this.$refs.iframe.contentDocument.title;
    },
  },
};
</script>
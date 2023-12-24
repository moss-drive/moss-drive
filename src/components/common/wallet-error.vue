<template>
  <div>
    <q-dialog v-model="showPop">
      <div class="recharge-container">
        <div class="error-title fz-18 mb-5 px-2">
          {{ errorMsg }}
        </div>
        <q-expansion-item v-model="expanded" label="Detail Message">
          <q-card>
            <q-card-section>
              <div class="wb-all">
                {{ detailMsg }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <div class="ta-r mt-5">
          <q-btn rounded @click="showPop = false">OK</q-btn>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      showPop: false,
      expanded: false,
      error: {
        message: "Someting went wrong!",
      },
    };
  },
  computed: {
    detailMsg() {
      const { data } = this.error;
      let msg = this.error.message;
      if (data) {
        msg = data.message || msg;
      }
      return msg;
    },
    errorMsg() {
      let msg = this.detailMsg;
      if (/insufficient funds/i.test(msg)) {
        msg = "Insufficient balance in your wallet.";
      } else {
        msg = "Someting went wrong!";
      }
      return msg;
    },
  },
  created() {
    this.$bus.on("wallet-error", this.handleFn);
  },
  methods: {
    handleFn(error) {
      console.log(232232323);
      this.error = error;
      if (/user rejected/i.test(this.detailMsg)) {
        return;
      }
      this.showPop = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.recharge-container {
  width: 500px;
  padding: 24px;
  background: #0f172a;
  border-radius: 16px;
  overflow: hidden;
}
</style>

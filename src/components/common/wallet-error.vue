<template>
  <div>
    <q-dialog v-model="showPop">
      <div class="recharge-container">
        <div class="error-title mb-2 px-4">
          {{ errorMsg }}
        </div>
        <q-expansion-item v-model="expanded" label="Detail">
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
              eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
              architecto suscipit iste eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      showPop: true,
      expanded: false,
      error: {
        message: "Someting went wrong!",
      },
    };
  },
  computed: {
    errorMsg() {
      const { data } = this.error;
      let msg = this.error.message;
      if (data) {
        msg = data.message || msg;
      }
      if (/insufficient funds/i.test(msg)) {
        msg = "Insufficient balance in your wallet.";
      } else {
        msg = "Someting went wrong!";
      }
      return msg;
    },
  },
  created() {
    this.$bus.on("walletError", this.handleFn);
  },
  methods: {
    handleFn(error) {
      this.error = error;
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

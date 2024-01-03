<template>
  <q-dialog v-model="showPop">
    <q-card class="full-width pa-4 bg-primary" style="max-width: 450px">
      <div class="pos-a right-0 top-0 m-2">
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
      <!-- <q-card-section> Sign In </q-card-section> -->
      <div class="fz-18 fw-b mb-2">SIGN IN</div>
      <q-card-section>
        <wallet-connect keep @login="showPop = false" :noInvited="noInvited"></wallet-connect>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      noInvited: false,
    };
  },
  created() {
    this.$bus.on("show-login", (noInvited) => {
      this.noInvited = noInvited;
      this.showPop = true;
    });
  },
};
</script>

<script setup>
import StoneLeft from "./stone-left.vue";
import StoneRight from "./stone-right.vue";
</script>

<template>
  <div class="pa-5">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8 col-lg-9">
        <stone-left :info="info" :balance="balance" />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <stone-right :info="info" :balance="balance" />
      </div>
    </div>
  </div>

  <wallet-check />
</template>

<script>
import { mapState } from "vuex";
const { VITE_OP_CHAINID } = import.meta.env;

export default {
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
  },
  data() {
    return {
      info: {},
      balance: 0,
    };
  },
  watch: {
    uid() {
      this.getAccount();
    },
  },
  created() {
    this.stoneId = this.$route.params.catchAll[0];
    this.chainId = this.$route.query.chainId || VITE_OP_CHAINID;
    if (!/^\d+$/.test(this.stoneId)) {
      this.$router.replace("/");
      return;
    }
    document.title = "Mossyland";
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await this.$http.get("/stone/meta", {
          params: {
            stoneId: this.stoneId,
            chainId: this.chainId,
          },
        });
        if (data.stoneId) {
          data.stoneId += "";
        }
        document.title = data.stoneName + " - Mossyland";
        this.info = data;
        this.getAccount();
      } catch (error) {
        console.log(error);
      }
    },
    async getAccount() {
      if (!this.uid) return;
      try {
        const { data } = await this.$http.get("/stone/account", {
          params: {
            stoneId: this.stoneId,
          },
        });
        this.balance = data.accountBalance * 1;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

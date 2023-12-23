<script setup>
import StoneLeft from "./stone-left.vue";
import StoneRight from "./stone-right.vue";
</script>

<template>
  <div class="pa-5">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8 col-lg-9">
        <stone-left :id="id" :info="info" :balance="balance" />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <stone-right :id="id" :info="info" :balance="balance" />
      </div>
    </div>
  </div>

  <wallet-check />
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
  },
  data() {
    const { id } = this.$route.query;
    return {
      id,
      info: {},
      balance: 0,
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await this.$http.get("/stone/meta", {
          params: {
            id: this.id,
          },
        });
        this.info = data;
        this.getAccount();
      } catch (error) {
        console.log(error);
      }
    },
    async getAccount() {
      if (!this.uid) return;
      const { stoneId } = this.info;
      if (!stoneId) return;
      try {
        const { data } = await this.$http.get("/stone/account", {
          params: {
            stoneId,
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

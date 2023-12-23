<script setup>
import WalletConnect from "./wallet-connect.vue";
</script>

<template>
  <div class="q-pa-lg ta-c">
    <div class="pos-center">
      <div class="bg-primary bdrs-10 px-5 py-6" style="width: 360px">
        <q-btn
          v-if="isLogin"
          @click="goX"
          :loading="xLoading"
          flat
          rounded
          size="lg"
          style="background: #111"
          class="full-width text-white"
        >
          <span class="fz-20 mr-2">Bind</span>
          <img src="/img/common/x.svg" width="20" />
        </q-btn>
        <wallet-connect v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      xLoading: false,
    };
  },
  computed: {
    ...mapState({
      loginData: (s) => s.loginData,
    }),
    isLogin() {
      return !!this.loginData.uuid;
    },
  },
  created() {
    const { code, loginTo } = this.$route.query;
    if (code) {
      this.onCode(code);
    } else if (this.isLogin) {
      this.goX();
    } else {
      if (loginTo) localStorage.loginTo = loginTo;
    }
  },
  methods: {
    async onCode(code) {
      if (!localStorage.goX && /\.website/.test(location.href)) {
        try {
          await this.$confirm("Redirect to localhost?");
          location.href = "http://localhost:5173/login?code=" + code;
          return;
        } catch (error) {
          //
        }
      } else {
        localStorage.goX = "";
      }
      try {
        this.xLoading = true;
        await this.$http.get(`/login/twitter/user/profile`, {
          params: {
            code,
          },
        });
        localStorage.bindX = 1;
        window.close();
      } catch (error) {
        console.log(error);
        //
      }
      this.xLoading = false;
    },
    async goX() {
      try {
        this.xLoading = true;
        const { data } = await this.$http.get("/login/twitter");
        // console.log(data);
        localStorage.goX = 1;
        location.href = data.jump;
      } catch (error) {
        console.log(error);
      }
      this.xLoading = false;
    },
  },
};
</script>

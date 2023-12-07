<script setup>
import WalletConnect from "./wallet-connect.vue";
</script>

<template>
  <div class="q-pa-lg ta-c">
    <div v-if="!loginData.twitterId">
      <div class="mt-5 fz-30">Login</div>
      <div class="pa-6"></div>
      <q-btn
        @click="onLoginX"
        :loading="xLoading"
        flat
        rounded
        style="background: #222; width: 200px"
      >
        <img src="/img/common/x.svg" width="20" />
      </q-btn>
    </div>
    <div v-else-if="!loginData.token">
      <div class="mt-5 fz-30">Connect Wallet</div>
      <div class="pa-6"></div>
      <wallet-connect @login="onLoginData" />
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
  },
  created() {
    const { code } = this.$route.query;
    if (code) {
      this.onCode(code);
    } else if (this.loginData.uid) {
      this.$router.replace("/");
    }
  },
  methods: {
    async onCode(code) {
      try {
        this.xLoading = true;
        const { data } = await this.$http.get(`$auth/login/twitter/user/profile`, {
          params: {
            code,
          },
        });
        if (data.token) {
          this.onLoginData(data);
        } else {
          if (!data.twitterId) {
            this.$alert("Error: No Twitter ID");
          }
          this.$setStore({
            loginData: data,
          });
          this.$router.replace("/login");
        }
      } catch (error) {
        console.log(error);
        //
      }
      this.xLoading = false;
    },
    async onLoginX() {
      try {
        this.xLoading = true;
        const { data } = await this.$http.get("$auth/login/twitter");
        // console.log(data);
        location.href = data.jump;
      } catch (error) {
        console.log(error);
      }
      this.xLoading = false;
    },
    onRedirect() {
      const redirectTo = localStorage.loginTo || "/";
      this.$router.replace(redirectTo);
    },
    async onLoginData(data) {
      try {
        this.$loading("Login....");
        // const { data } = await this.$http.post(`$auth/st/${stoken}`);
        this.$store.dispatch("login", data);
        this.onRedirect();
      } catch (error) {
        console.log(error);
      }
      this.$loadingClose();
    },
  },
};
</script>

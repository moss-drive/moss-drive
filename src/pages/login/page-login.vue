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
    <div v-else-if="loginData.thirdWebToken_">
      <div class="mt-5 fz-30">ThirdWeb</div>
      <div class="pa-6"></div>
      <q-btn
        @click="onThirdWeb"
        :loading="thirdLoading"
        rounded
        color="primary"
        style="width: 200px"
      >
        Bind
      </q-btn>
    </div>
    <div v-else>
      <div class="mt-5 fz-30">Connect Wallet</div>
      <div class="pa-6"></div>
      <wallet-connect @login="onLoginData" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { Goerli } from "@thirdweb-dev/chains";

export default {
  data() {
    return {
      xLoading: false,
      thirdLoading: false,
    };
  },
  computed: {
    ...mapState({
      loginData: (s) => s.loginData,
    }),
  },
  created() {
    const { code, loginTo } = this.$route.query;
    if (code) {
      this.onCode(code);
    } else if (this.loginData.accessToken) {
      this.onRedirect();
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
        const { data } = await this.$http.get(`/login/twitter/user/profile`, {
          params: {
            code,
          },
        });
        if (data.accessToken) {
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
    async onThirdWeb() {
      try {
        this.thirdLoading = true;
        const walletAddr = await this.getThirdWebWallet();
        console.log(walletAddr);
      } catch (error) {
        console.log(error);
        this.$alert(error.message);
      }
      this.thirdLoading = false;
    },
    async getThirdWebWallet() {
      const embeddedWallet = new EmbeddedWallet({
        chain: Goerli, //  chain to connect to
        clientId: "8a76a182447af68e014556db57bd6cf9",
      });
      const authResult = await embeddedWallet.authenticate({
        strategy: "jwt",
        jwt: this.loginData.thirdWebToken,
      });

      const addr = await embeddedWallet.connect({ authResult });
      return addr;
    },
    async onLoginX() {
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
    onRedirect() {
      const redirectTo = localStorage.loginTo || "/";
      localStorage.loginTo = "";
      this.$router.replace(redirectTo);
    },

    async onLoginData(data) {
      try {
        this.$loading("Login....");
        // const { data } = await this.$http.post(`/st/${stoken}`);
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

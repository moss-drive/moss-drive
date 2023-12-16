<template>
  <div class="bg-primary bdrs-10 px-5 py-6" style="width: 360px">
    <p class="py-2">
      <img src="/img/home/join-txt.svg" height="24" class="d-b" />
    </p>
    <div class="py-5">
      <q-btn
        v-if="loginData.uuid"
        to="/drive"
        rounded
        size="lg"
        style="background: #111"
        class="full-width text-white"
      >
        <img src="/img/moss.svg" width="38" class="scale-9" />
        <span class="fz-18 ml-2">Moss Drive</span>
      </q-btn>
      <q-btn
        v-else
        @click="onLoginX"
        :loading="xLoading"
        flat
        rounded
        size="lg"
        style="background: #111"
        class="full-width text-white"
      >
        <span class="fz-20 mr-2">Sign in with</span>
        <img src="/img/common/x.svg" width="20" />
      </q-btn>
    </div>
    <div>
      <img src="/img/home/or-split.svg" class="w100p d-b" />
    </div>
    <div class="py-5">
      <q-btn href="/mossy" target="_blank" size="lg" rounded class="btn-mossy full-width">
        <img src="/img/mossy.png" width="38" class="" />
        <span class="fz-18 ml-2">Mossyland</span>
      </q-btn>
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
      if (redirectTo != "/") this.$router.replace(redirectTo);
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

<template>
  <q-btn
    flat
    rounded
    :size="size"
    :style="{
      background: bg,
    }"
    class="full-width text-white"
    :loading="loading"
    @click="onConnect(defItem.type)"
  >
    <template v-if="size == 'lg'">
      <img :src="defItem.img" width="30" />
      <span class="ml-2 fz-18">Connect Wallet</span>
    </template>
    <template v-else>
      <img :src="defItem.img" width="22" />
      <span class="ml-2 fz-16" v-if="!asMobile">Connect</span>
    </template>
  </q-btn>

  <q-dialog v-model="showInstall">
    <q-card class="full-width" style="max-width: 450px">
      <q-card-section>
        <div class="text-h6">Install</div>
      </q-card-section>
      <q-card-section>
        <div class="al-c">
          <img :src="curItem.img" width="50" />
          <div class="ml-3">
            <div class="text-h6">{{ curItem.label }}</div>
            <p>{{ curItem.desc }}</p>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="mt-4" align="right">
        <q-btn flat color="white" label="Cancel" @click="showInstall = false" />
        <q-btn rounded color="primary" width="100px" @click="onInstall">OK</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <wallet-check />
</template>

<script>
import { mapState } from "vuex";
import { WalletSign } from "./wallet-sign";

const walletList = [
  {
    name: "metamask",
    type: "METAMASK",
    label: "MetaMask",
    sub: "Popular",
    img: "/img/common/metamask.png",
    desc: "Your key to blockchain applications",
    link: "https://metamask.io/download/",
  },
];
export default {
  emits: ["login"],
  props: {
    size: {
      type: String,
      default: "lg",
    },
    bg: {
      type: String,
      default: "#111",
    },
    keep: Boolean,
    asMobile: Boolean,
    noInvited: Boolean,
  },
  data() {
    return {
      walletList,
      showInstall: false,
      curType: "",
      loading: false,
      tempData: null,
    };
  },
  computed: {
    ...mapState({
      loginData: (s) => s.loginData,
    }),
    defItem() {
      return this.walletList[0];
    },
    curItem() {
      return this.walletList.find((it) => it.type == this.curType) || this.defItem;
    },
  },
  mounted() {},
  methods: {
    onInstall() {
      window.open(this.curItem.link);
    },
    async onConnect(type) {
      this.curType = type;
      try {
        const wallet = new WalletSign(type);
        if (!wallet.client) {
          this.showInstall = true;
          return;
        }
        this.loading = true;
        const account = await wallet.getAccount();
        const nonce = await this.getNonce(account);
        const signature = await wallet.getSign(nonce);
        console.log({
          type,
          account,
          signature,
        });
        await this.getLoginData(account, {
          signature,
          // inviteCode: "123",
        });
      } catch (error) {
        console.log(error);
        let msg = error.message;
        if (/user rejected signing/.test(msg)) {
          msg = "";
        }
        if (msg) this.$alert(msg);
      }
      // this.$loadingClose();
      this.loading = false;
    },
    async getNonce(account) {
      const { data } = await this.$http.get(`/login/eth/wallet/${account.toLowerCase()}`);
      return data.nonce;
    },
    async getLoginData(account, params) {
      const body = {
        ...params,
      };
      const { data } = await this.$http.post(`/login/eth/wallet/${account}/sign`, body);
      if (data.token) {
        data.accessToken = data.token;
        delete data.token;
        data.uuid = account;
      }
      this.onLoginData(data);
    },
    onRedirect() {
      this.$toast("Welcome!", 1);
      this.$emit("login");
      if (this.keep) return;
      const redirectTo = localStorage.loginTo || "/file";
      localStorage.loginTo = "";
      if (redirectTo != this.$route.path) this.$router.replace(redirectTo);
    },
    async showInvite() {
      let code = localStorage.inviteCode || "";
      const needInput = !code;
      if (needInput) {
        try {
          code = await this.$prompt("Invitation Code", {
            cancel: {
              label: "Skip",
              color: "#000",
              flat: true,
            },
            // html: true,
            // msg: '<a href="https://discord.com/invite/4everland" target="_blank">How to Get?</a>',
          });
          code = code.trim().replace(/^Moss_/i, "");
        } catch (error) {
          code = "moss-egg";
        }
      }
      try {
        this.loading = true;
        await this.$http.post(
          `/invitation/${code}/verification`,
          {},
          {
            noTip: true,
            headers: {
              Authorization: this.tempData.accessToken,
            },
          }
        );
        this.$store.dispatch("login", this.tempData);
        this.onRedirect();
      } catch (error) {
        this.$toast(error.message);
        if (needInput) this.showInvite();
      }
      this.loading = false;
    },
    async onLoginData(data) {
      try {
        console.log(data);
        this.$loading("Login....");
        // const { data } = await this.$http.post(`/st/${stoken}`);
        if (data.isInvited || this.noInvited) {
          this.$store.dispatch("login", data);
          this.onRedirect();
        } else {
          this.tempData = data;
          this.showInvite();
        }
      } catch (error) {
        console.log(error);
      }
      this.$loadingClose();
    },
  },
};
</script>

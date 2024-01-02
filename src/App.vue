<template>
  <q-linear-progress
    v-show="showProgress"
    color="warning"
    query
    class="pos-f top-0 w100p"
    style="z-index: 10000"
  />
  <RouterView />
  <task-control></task-control>
  <wallet-error></wallet-error>
  <login-popup></login-popup>
</template>

<script>
import { useQuasar } from "quasar";
import { mapState } from "vuex";
import TaskControl from "./pages/drive/task-control.vue";

export default {
  name: "App",
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      showProgress: (s) => s.showProgress,
      uid: (s) => s.loginData.uuid,
      loginData: (s) => s.loginData,
      // token: (s) => s.loginData.accessToken,
    }),
    path() {
      return this.$route.path;
    },
  },
  setup() {
    const $q = useQuasar();
    window.$q = $q;
    $q.dark.set(true);

    window.$loading = (opts) => {
      if (typeof opts == "string") {
        opts = {
          message: opts,
        };
      }
      $q.loading.show(opts);
    };
    window.$loadingClose = (group) => {
      $q.loading.hide(group);
    };
    window.$toast = (message, opts = "warning") => {
      if (opts > 0) {
        opts = ["positive", "negative", "warning", "info", "ongoing"][opts - 1];
        if (!opts) opts = "positive";
      }
      if (typeof opts == "string") {
        opts = {
          type: opts, //
        };
      }
      $q.notify({
        message,
        timeout: 1200,
        position: "top",
        ...opts,
      });
    };
    window.$alert = (message, opts = {}) => {
      return new Promise((resolve) => {
        $q.dialog({
          title: "Tip",
          message,
          transitionShow: "jump-up",
          transitionHide: "jump-up",
          ...opts,
        })
          .onOk(resolve)
          .onDismiss(resolve);
      });
    };
    window.$confirm = (message, opts) => {
      return new Promise((resolve, reject) => {
        $q.dialog({
          title: "Confirm",
          message,
          cancel: true,
          persistent: true,
          ...opts,
        })
          .onOk(resolve)
          .onCancel(reject);
      });
    };
    window.$prompt = (title, opts = {}) => {
      return window.$confirm(opts.msg || "", {
        title,
        prompt: {
          model: "",
          type: "text", // optional
        },
        ...opts,
      });
    };
  },
  watch: {
    uid() {
      this.getUserInfo();
    },
    async isFocus(val) {
      if (val && localStorage.bindX) {
        await this.getUserInfo();
        localStorage.bindX = "";
        this.$toast("X binded", 1);
      }
    },
  },
  mounted() {
    this.onInit();
  },
  methods: {
    async getUserInfo() {
      if (!this.uid) return;
      try {
        const { data } = await this.$http.get("/users/twitter/info");
        this.$setStore({
          userInfo: data,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async onInit() {
      this.getUserInfo();
    },
  },
  components: {
    TaskControl,
  },
};
</script>

<template>
  <div class="bg-primary bdrs-10 px-5 py-6" style="width: 360px">
    <p class="py-2">
      <img :src="`/img/home/txt-${isLogin ? 'welcome' : 'join'}.svg`" height="24" class="d-b" />
    </p>
    <div class="py-5">
      <q-btn
        v-if="loginData.uuid"
        href="/drive"
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
  methods: {
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
  },
};
</script>

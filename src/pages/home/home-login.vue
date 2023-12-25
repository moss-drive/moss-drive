
<template>
  <div class="bg-primary bdrs-10 px-5 py-6 pos-r" style="width: 360px">
    <div class="pos-a right-0" style="top: -102px">
      <img :src="`/img/home/${isLogin ? 'heart' : 'hey'}.svg`" :width="isLogin ? 196 : 192" />
    </div>
    <p class="py-2">
      <img :src="`/img/home/txt-${isLogin ? 'welcome' : 'join'}.svg`" height="24" class="d-b" />
    </p>
    <div class="py-5">
      <q-btn
        v-if="isLogin"
        href="/drive"
        rounded
        size="lg"
        style="background: #111"
        class="full-width text-white"
      >
        <img src="/img/moss.svg" width="38" class="scale-9" />
        <span class="fz-18 ml-2">My Moss</span>
      </q-btn>
      <wallet-connect v-else />
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
  methods: {},
};
</script>

<style lang="scss">
body.body--dark {
  background-image: url(/img/mossy/bg-top-1.png);
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: contain;
}

.bg-active {
  background: #0000006e;
  color: #fff;
}
</style>


<script setup>
import HeaderRight from "./header-right.vue";
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark text-white bdb-1">
      <div class="al-c pl-4 pr-4" style="height: 64px">
        <a href="/mossy" class="al-c">
          <img src="/img/mossy.png" :width="asMobile ? 30 : 40" />
          <img class="ml-2" src="/img/mossy/mossy-text.svg" :height="asMobile ? 20 : 28" />
        </a>
        <div class="mr-auto"></div>
        <q-btn :href="isLogin ? '/file' : '/'" rounded color="primary">
          <img src="/img/common/my-moss.svg" width="20" />
          <span class="ml-2" v-if="!asMobile">My Moss</span>
        </q-btn>
        <net-choose />
        <header-right />
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { mapState } from "vuex";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    ...mapState({
      isLogin: (s) => !!s.loginData.uuid,
    }),
    asMobile() {
      return this.screen.width < 690;
    },
  },
};
</script>
<style lang="scss">
.bg-home {
  min-height: 100vh;
  background: #000 url(/img/home/bg.png) right 0 no-repeat;
  background-size: contain;
  background-attachment: fixed;
}
</style>

<script setup>
import HomeList from "./home-list.vue";
import HomeCard from "./home-card.vue";
import HeaderRight from "../../layouts/header-right.vue";
</script>

<template>
  <div class="bg-home h-flex">
    <div class="al-c">
      <a href="/" class="al-c pa-3 ml-5">
        <img src="/img/moss.svg" height="40" />
        <img src="/img/moss-txt.svg" height="26" class="ml-2" />
      </a>
      <div class="ml-auto" v-if="loginData.uuid">
        <header-right :border="false"></header-right>
      </div>
    </div>
    <div class="row flex-1" style="">
      <div
        :class="isFix ? 'col-12' : 'col-8'"
        style="margin: auto 0; transform: perspective(3000px) rotateY(40deg)"
      >
        <home-list />
      </div>
      <div class="col-4 h100p pos-r">
        <home-card :class="cardCls" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    ...mapState({
      loginData: (s) => s.loginData,
    }),
    asMobile() {
      return this.screen.width < 700;
    },
    isFix() {
      return this.screen.width < 1000;
    },
    cardCls() {
      if (this.isFix) {
        return this.asMobile ? "pos-center pos-f right-0" : "y-center pos-f right-0 mr-5";
      }
      return "y-center";
    },
  },
};
</script>
<style lang="scss">
.bg-home {
  min-height: 100vh;
  background: #000 url(/img/home/bg.png) right 0 no-repeat;
  background-size: contain;
  background-attachment: fixed;
}
</style>

<script setup>
// import HomeList from "./home-list.vue";
import HomeImg from "./home-img.vue";
// import HomeMint from "./home-mint.vue";
import HomeLogin from "./home-login.vue";
import HomeBtm from "./home-btm.vue";
import HeaderRight from "../../layouts/header-right.vue";
</script>

<template>
  <div class="bg-home h-flex">
    <div class="pos-f top-0 w100p z-100">
      <div class="al-c">
        <a href="/" class="al-c pa-3 ml-5">
          <img src="/img/moss.svg" height="40" />
          <img src="/img/home/moss-txt.svg" height="26" class="ml-2" />
        </a>
        <template v-if="loginData.uuid">
          <div class="ml-auto mr-3">
            <header-right :border="false"></header-right>
          </div>
        </template>
      </div>
    </div>
    <div class="row flex-1" style="">
      <div
        :class="isFix ? 'col-12' : 'col-8'"
        style="margin: auto 0"
        :style1="!asMobile ? 'transform: perspective(3000px) rotateY(40deg)' : 'padding: 30px'"
      >
        <!-- <home-mint v-if="!asMobile" /> -->
        <home-img class="pos-r" style="left: -90px" />
        <!-- <home-list :asMobile="asMobile" /> -->
      </div>
      <div class="col-4 h100p pos-r">
        <div
          :class="loginCls"
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          "
        >
          <home-login />
          <!-- <home-mint v-if="asMobile" /> -->
        </div>
      </div>
    </div>
    <home-btm />
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
    loginCls() {
      if (this.isFix) {
        return this.asMobile ? "pos-center pos-f right-0" : "y-center pos-f right-0 mr-5";
      }
      return "y-center";
    },
  },
  mounted() {
    const { invite } = this.$route.query;
    if (invite) {
      localStorage.inviteCode = invite;
    }
  },
};
</script>

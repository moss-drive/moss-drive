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
</script>

<template>
  <div class="bg-home h-flex">
    <div>
      <div class="al-c pa-3">
        <img src="/img/moss.svg" height="40" />
        <img src="/img/moss-txt.svg" height="26" class="ml-2" />
      </div>
    </div>
    <div class="row flex-1" style="">
      <div
        :class="asMobile ? 'col-12' : 'col-8'"
        style="margin: auto 0; transform: perspective(3000px) rotateY(40deg)"
      >
        <home-list />
      </div>
      <div class="col-4 h100p pos-r">
        <home-card class="y-center" :class="asMobile ? 'pos-f right-0 mr-5' : ''" />
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    asMobile() {
      return this.screen.width < 1000;
    },
  },
};
</script>
<template>
  <div class="mint-page">
    <div class="banner">
      <div class="al-c header">
        <a href="/" class="al-c pa-3 ml-5">
          <img src="/img/moss.svg" height="40" />
          <img src="/img/moss-txt.svg" height="26" class="ml-2" />
        </a>
        <div class="ml-auto">
          <header-right :border="false"></header-right>
        </div>
      </div>
      <div class="container">
        <q-img src="@/assets/imgs/mint/h1.png" width="1266px"></q-img>
      </div>
      <q-img class="ribbons" src="@/assets/imgs/mint/Ribbons.png"></q-img>
    </div>
    <div class="introduction">
      <div class="container">
        <q-img src="@/assets/imgs/mint/h1.png" width="1266px"></q-img>
      </div>
    </div>
    <div class="footer">
      <home-btm />
    </div>
  </div>
</template>

<script setup>
import HeaderRight from "../../layouts/header-right.vue";
import HomeBtm from "../home/home-btm.vue";
</script>

<script>
export default {
  name: "MintIndex",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.mint-page {
  width: 100%;
  padding-bottom: 76px;
  .header {
    width: 100%;
    // position: fixed;
    // top: 0;
    // left: 0;
  }
  .container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  }
  .banner {
    position: relative;
    width: 100%;
    height: 864px;
    background-color: #7e4fed;
    background-image: url("@/assets/imgs/mint/p1_background.png");
    background-size: 287px;
    text-align: center;
    .ribbons {
      width: 3840px;
      position: absolute;
      left: 50%;
      right: 50%;
      bottom: -100px;
      margin-left: -1920px;
    }
  }
  .introduction {
    width: 100%;
    height: 870px;
    background-color: #1eefa4;
  }
  .footer {
    position: fixed;
    height: 76px;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #000;
  }
}
</style>

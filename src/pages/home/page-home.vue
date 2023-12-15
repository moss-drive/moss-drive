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
</script>

<template>
  <div class="bg-home h-flex">
    <div>
      <div class="al-c pa-3">
        <img src="/img/moss.svg" height="40" />
        <img src="/img/moss-txt.svg" height="26" class="ml-2" />
      </div>
    </div>
    <div class="row flex-1">
      <div class="col-8" style="margin: auto 0">
        <home-list />
      </div>
    </div>
  </div>
</template>
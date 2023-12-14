<style lang="scss">
body.body--dark {
  background-image: url(/img/mossy/bg-top-1.png);
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: contain;
}
.main-wrap {
  max-width: 1350px;
  margin: 0 auto;
  padding: 0 20px;
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
          <img src="/img/mossy.png" width="40" />
          <img class="ml-2" src="/img/mossy/mossy-text.svg" height="28" />
        </a>
        <div class="mr-auto"></div>
        <header-right />
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
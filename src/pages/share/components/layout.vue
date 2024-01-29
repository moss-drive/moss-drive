<script setup>
import HeaderRight from "../../../layouts/header-right.vue";
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark text-white bdb-1">
      <div class="al-c pl-4 pr-4" style="height: 64px">
        <a href="/" class="al-c pa-3 ml-5">
          <img src="/img/moss.svg" height="40" />
          <img src="/img/moss-s-txt.png" height="36" class="ml-2" />
        </a>
        <div class="mr-auto"></div>
        <q-btn :href="isLogin ? '/file' : '/'" rounded color="primary">
          <img src="/img/common/my-moss.svg" width="20" />
          <span class="ml-2" v-if="!asMobile">My Moss</span>
        </q-btn>
        <header-right :noInvited="true" />
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

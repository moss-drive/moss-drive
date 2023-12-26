<script setup>
import HeaderRight from "../../../layouts/header-right.vue";
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark text-white bdb-1">
      <div class="al-c pl-4 pr-4" style="height: 64px">
        <a href="/" class="al-c pa-3 ml-5">
          <img src="/img/moss.svg" height="40" />
          <img src="/img/moss-txt.svg" height="26" class="ml-2" />
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

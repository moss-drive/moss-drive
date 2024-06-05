<style lang="scss">
.main-drawer {
  .q-item {
    color: #333;
    font-size: 15px;
  }
  .q-item.q-router-link--active,
  .q-item--active {
    color: #fff;
    background: #0000006e;
    font-weight: bold;
  }
}
</style>

<script setup>
import UsageInfo from "./usage-info.vue";
</script>

<template>
  <div class="main-drawer h100p h-flex">
    <div class="d-flex al-end py-3">
      <a href="/" class="ml-5">
        <img src="/img/logo.svg" height="40" />
      </a>
    </div>
    <div class="q-pa-md ta-c px-6">
      <q-btn href="/mossy" target="_blank" rounded class="btn-mossy" style="width: 100%">
        <img src="/img/mossy.png" width="40" />
        <span class="fz-18 ml-2">Mossyland</span>
      </q-btn>
    </div>
    <q-list>
      <q-item
        v-for="it in links"
        :key="it.title"
        clickable
        tag="a"
        :target="it.link ? '_blank' : null"
        :href="it.link"
        :to="it.to"
        :active="isActive(it)"
      >
        <!-- <q-item-section v-if="it.icon" avatar>
          <icon-drawer :name="it.icon" :active="isActive(it)" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ it.title }}</q-item-label>
        </q-item-section> -->

        <div class="al-c px-2">
          <icon-drawer v-if="it.icon" :name="it.icon" :active="isActive(it)" />
          <q-item-label class="ml-2 fz-14">{{ it.title }}</q-item-label>
        </div>
      </q-item>
    </q-list>

    <usage-info class="mt-auto"></usage-info>
  </div>
</template>

<script>
export default {
  props: {
    asMobile: Boolean,
  },
  computed: {
    path() {
      return this.$route.path;
    },
  },
  data() {
    return {
      links: [
        {
          title: "My Files",
          icon: "driver",
          to: "/file",
        },
        {
          title: "My Stones",
          icon: "stones",
          to: "/stone",
        },
        {
          title: "Collected Stones",
          icon: "star",
          // link: "https://quasar.dev/vue-components/table",
          to: "/collection",
        },
        {
          title: "Stone TXs",
          icon: "txs",
          to: "/txs",
        },
        {
          title: "Share Links",
          icon: "shareLinks",
          to: "/sharelist",
        },
      ],
    };
  },
  methods: {
    isActive(it) {
      return this.$route.path.indexOf(it.to) == 0;
    },
  },
};
</script>

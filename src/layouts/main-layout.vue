<style lang="scss">
.main-toolbar {
  height: 66px;
  color: #fff;
}
@media (min-width: $breakpoint-md-min) {
  .main-toolbar {
    border-top-left-radius: 24px;
  }
  .m-toggle-btn {
    display: none;
  }
}
</style>

<script setup>
import MainHeader from "./main/main-header.vue";
import MainDrawer from "./main/main-drawer.vue";
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <div class="bg-primary">
        <q-toolbar class="main-toolbar bdb-1 bg-header">
          <q-btn
            class="m-toggle-btn"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-toolbar-title>
            <b class="fz-16">{{ title }}</b>
            <div class="ml-1 d-ib" v-if="title == 'My Resources'">
              <img
                src="/img/resource/help.svg"
                style="vertical-align: middle"
                width="16"
                class="cursor-p"
              />
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                max-width="300px"
                class="bg-black-8 fz-12"
              >
                Moss operates on 4EVERLAND storage, therefore the resources you consume and the
                remaining resources are aligned with your 4EVERLAND account.
              </q-tooltip>
            </div>
          </q-toolbar-title>

          <main-header />
        </q-toolbar>
        <mobile-toolbar class="bg-header" v-if="asMobile" />
      </div>
    </q-header>

    <q-drawer :width="240" class="bg-primary" v-model="leftDrawerOpen" show-if-above>
      <main-drawer :asMobile="asMobile" />
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
      <!-- <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view> -->
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { getFileSize } from "../utils/helper";

export default {
  name: "MainLayout",
  computed: {
    meta() {
      return this.$route.meta;
    },
    title() {
      return this.meta?.title;
    },
    asMobile() {
      return this.screen.width < 690;
    },
  },
  data() {
    const { screen } = useQuasar();
    return {
      leftDrawerOpen: false,
      screen,
    };
  },
  created() {
    this.getUsageInfo();
    this.$bus.on("update-usage", () => {
      this.getUsageInfo();
    });
  },
  methods: {
    async getUsageInfo() {
      const { data } = await this.$http.get(`$pay/combo/user/list`);
      // console.log(data);
      const { combo, realTimeItems, totalIpfsStorage } = data;
      if (!combo) return this.$alert("no combo data");
      const { resourceItems } = combo;
      const IPFS = "IPFS_STORAGE";
      const totalStorage = resourceItems.find((it) => (it.resourceType = IPFS)).size * 1;
      const usedStorage =
        realTimeItems.find((it) => it.resourceType == IPFS).size * 1 + totalIpfsStorage * 1;
      this.$setStore({
        usageInfo: {
          totalStorage,
          perc: usedStorage / totalStorage,
          used: getFileSize(usedStorage),
          total: getFileSize(totalStorage),
        },
      });
    },
  },
};
</script>

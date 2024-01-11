<style>
.mh-600 {
  max-height: 500px !important;
  max-height: calc(100vh - 70px) !important;
}
</style>

<script setup>
import UserCard from "./main/user-card.vue";
import UserTask from "./main/user-task.vue";
</script>

<template>
  <div
    class="ml-5 h100p pl-5 pr-4 al-c"
    :class="{
      'bdl-1': border,
    }"
  >
    <template v-if="!uid">
      <wallet-connect size="md" bg="#1E293B" keep :asMobile="asMobile" :noInvited="noInvited" />
    </template>
    <template v-else>
      <q-btn size="sm" rounded color="info" style="padding: 5px 8px">
        <img src="/img/mossy/icon/ic-coin.png" width="26" />
        <span class="text-white ml-1 fz-14">110</span>

        <q-menu
          anchor="bottom middle"
          self="top middle"
          :style="{
            width: Math.min(screen.width - 30, 480) + 'px',
          }"
          style="max-height: 465px"
        >
          <user-task :userInfo="userInfo" :uid="uid" />
        </q-menu>
      </q-btn>
      <q-btn size="sm" class="ml-4" round color="info" style="padding: 7px">
        <img src="/img/mossy/icon/ic-bell.svg" width="22" />
      </q-btn>
      <q-btn
        class="ml-3"
        :class="{
          'q-px-sm': !asMobile,
        }"
        color="info"
        rounded
        :round="asMobile"
        :size="btnSize"
      >
        <user-avatar :src="userInfo.avatarUrl" :uid="uid" />
        <span v-if="!asMobile" class="ml-2 fz-14">{{ uname }}</span>

        <q-menu
          :style="{
            width: Math.min(screen.width - 30, 400) + 'px',
          }"
          class="mh-600"
        >
          <user-card :userInfo="userInfo" :uid="uid" />
        </q-menu>
      </q-btn>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { useQuasar } from "quasar";

export default {
  props: {
    border: {
      type: Boolean,
      default: true,
    },
    noInvited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      searchKey: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      uid: (s) => s.loginData.uuid,
    }),

    uname() {
      const { name } = this.userInfo;
      if (name) return name.cutStr(6, 6);
      return this.myAddr;
    },
    myAddr() {
      return this.uid.cutStr(6, 4);
    },
    asMobile() {
      return this.screen.width < 690;
    },
    btnSize() {
      return this.asMobile ? "12px" : null;
    },
  },
};
</script>

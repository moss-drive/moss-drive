<style>
.mh-600 {
  max-height: 500px !important;
  max-height: calc(100vh - 70px) !important;
}
</style>

<script setup>
import UserCard from "./main/user-card.vue";
</script>

<template>
  <div
    class="ml-5 h100p pl-2 al-c"
    :class="{
      'bdl-1': border,
      'pr-4': !asMobile,
    }"
  >
    <template v-if="!uid">
      <wallet-connect size="md" bg="#1E293B" keep :asMobile="asMobile" :noInvited="noInvited" />
    </template>
    <template v-else>
      <div class="ml-2 al-c" v-if="!asMobile">
        <user-point v-if="!noInvited" :menuWidth="menuWidth" />
      </div>
      <wallet-control fromTop />
      <q-btn class="ml-3 btn-sm1" color="info" rounded>
        <user-avatar :src="userInfo.avatarUrl" :uid="uid" />
        <span v-if="!asMobile" class="ml-2 fz-14">{{ uname }}</span>
        <img src="/img/common/ic-down.svg" width="10" class="ml-2" />

        <q-menu
          :offset="[0, 10]"
          :style="{
            width: menuWidth + 'px',
          }"
          class="mh-600"
        >
          <user-card :userInfo="userInfo" :uid="uid" :noInvited="noInvited" />
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
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      uid: (s) => s.loginData.uuid,
    }),
    menuWidth() {
      return Math.min(this.screen.width - 30, 400);
    },
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

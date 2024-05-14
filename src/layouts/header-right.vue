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
    class="ml-5 h100p pl-5 al-c"
    :class="{
      'bdl-1': border,
      'pr-4': !asMobile,
    }"
  >
    <template v-if="!uid">
      <wallet-connect size="md" bg="#1E293B" keep :asMobile="asMobile" :noInvited="noInvited" />
    </template>
    <template v-else>
      <div class="mr-4 al-c" v-if="!asMobile">
        <user-point v-if="!noInvited" :menuWidth="menuWidth" />
      </div>
      <q-btn
        size="sm"
        round
        color="info"
        style="padding: 7px"
        @click="unRead = false"
        v-if="!noInvited"
      >
        <img
          :src="unRead ? '/img/mossy/icon/ic-bell-active.svg' : '/img/mossy/icon/ic-bell.svg'"
          width="22"
        />
        <q-menu
          :style="{
            width: menuWidth + 'px',
          }"
          class="mh-600"
          :offset="[300, 10]"
        >
          <message-notice></message-notice>
        </q-menu>
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
import MessageNotice from "./components/message-notice.vue";

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
      unRead: false,
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
  watch: {
    uid(val) {
      if (val) {
        this.$store.dispatch("taskStore/getPoint");
        this.checkRead();
      }
    },
  },
  mounted() {
    if (this.uid) {
      this.$store.dispatch("taskStore/getPoint");
      this.checkRead();
    }
  },
  components: {
    MessageNotice,
  },
  created() {},
  methods: {
    async checkRead() {
      try {
        const { data } = await this.$http.get("/broadcast/unread");
        this.unRead = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<template>
  <div
    class="ml-5 h100p pl-5 pr-4 al-c"
    :class="{
      'bdl-1': border,
    }"
  >
    <template v-if="!uid">
      <wallet-connect size="md" bg="#1E293B" keep :asMobile="asMobile" />
    </template>
    <template v-else>
      <!-- <q-btn size="sm" rounded color="info" style="padding: 5px 8px">
        <img src="/img/mossy/icon/ic-coin.png" width="26" />
        <span class="text-white ml-1 fz-14">0</span>
      </q-btn> -->
      <!-- <q-btn size="sm" class="ml-4" round color="info" style="padding: 7px">
        <img src="/img/mossy/icon/ic-bell.svg" width="22" />
      </q-btn> -->

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
        <q-avatar size="22px" v-if="userInfo.avatarUrl">
          <img :src="userInfo.avatarUrl" />
        </q-avatar>
        <m-avatar v-else :hash="avatarId"></m-avatar>
        <span v-if="!asMobile" class="ml-2 fz-14">{{ uname }}</span>

        <q-menu style="width: 130px" auto-close>
          <q-list>
            <q-item clickable v-if="asMobile">
              <q-item-section>{{ uname }}</q-item-section>
            </q-item>
            <q-item clickable v-if="userInfo.name">
              <q-item-section>{{ myAddr }}</q-item-section>
            </q-item>
            <q-item href="/login" target="_blank" clickable v-else>
              <q-item-section>Bind X</q-item-section>
            </q-item>
            <q-item clickable @click="onLogout">
              <q-item-section>Sign out</q-item-section>
            </q-item>
          </q-list>
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
    avatarId() {
      return this.userInfo.twitterId || this.uid;
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
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
      this.$router.replace("/");
    },
  },
};
</script>
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
        <user-avatar :src="userInfo.avatarUrl" :uid="uid" />
        <span v-if="!asMobile" class="ml-2 fz-14">{{ uname }}</span>

        <q-menu
          :style="{
            width: Math.min(screen.width - 30, 400) + 'px',
          }"
          persistent1
        >
          <q-card class="bg-card-1">
            <q-card-section>
              <div class="ta-c">
                <div class="mt-2">
                  <user-avatar :src="userInfo.avatarUrl" :uid="uid" :size="60" />
                  <p class="mt-2">
                    <a
                      class="hover-1"
                      :href="`https://twitter.com/${userInfo.username}`"
                      target="_blank"
                      >@{{ userInfo.username }}</a
                    >
                  </p>
                  <p class="mt-1 op-7 d-center hover-1" @click="$copy(uid)">
                    <span class="mr-1">{{ uid.cutStr(6, 4) }}</span>
                    <q-icon name="content_copy" />
                  </p>
                </div>
              </div>

              <div class="mt-5">
                <q-tabs class="bdb-1" v-model="tabIdx" dense active-color="primary" no-caps>
                  <q-tab name="nft" label="Moss NFT" />
                  <q-tab name="invite" label="Invite" />
                  <q-tab name="settings" label="Settings" />
                </q-tabs>
              </div>
            </q-card-section>
          </q-card>
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
      tabIdx: "nft",
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
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
      this.$router.replace("/");
    },
  },
};
</script>

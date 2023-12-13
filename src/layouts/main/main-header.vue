<style lang="scss">
.top-search {
  height: 36px;
  // width: 400px;
  padding-left: 36px;
  letter-spacing: 1px;
}
</style>

<script setup>
import UploadIndex from "./upload-index.vue";
</script>

<template>
  <!-- <div class="pos-r flex-1">
    <icon-search class="y-center ev-n" style="left: 10px" />
    <input
      v-model="searchKey"
      type="text"
      placeholder="Search"
      class="bdrs-100 w100p top-search"
      :class="searchKey ? 'bg-white' : 'bg-info'"
    />
  </div> -->

  <q-btn
    v-if="inDrive || inStone"
    class="ml-3"
    color="primary"
    rounded
    :round="asMobile"
    :size="btnSize"
    :style="asMobile ? '' : 'width: 110px'"
    @click="onNew"
  >
    <icon-add />
    <span class="ml-2" v-if="!asMobile">{{ inDrive ? "NEW" : "Stone" }}</span>
    <upload-index v-if="inDrive" />
  </q-btn>

  <div class="ml-5 h100p bdl-1 pl-5 pr-4 al-c">
    <q-btn size="sm" rounded color="info" style="padding: 5px 8px">
      <img src="/img/mossy/icon/ic-coin.png" width="26" />
      <span class="text-white ml-1 fz-14">0</span>
    </q-btn>
    <q-btn size="sm" class="ml-4" round color="info" style="padding: 7px">
      <img src="/img/mossy/icon/ic-bell.svg" width="22" />
    </q-btn>

    <q-btn
      v-if="uid"
      class="ml-3"
      :class="{
        'q-px-sm': !asMobile,
      }"
      color="info"
      rounded
      :round="asMobile"
      :size="btnSize"
    >
      <m-avatar :hash="uid"></m-avatar>
      <span v-if="!asMobile" class="ml-2 fz-14">{{ uid.cutStr(4, 4) }}</span>

      <q-menu style="width: 130px" auto-close>
        <q-list>
          <q-item clickable v-if="asMobile">
            <q-item-section>{{ uid.cutStr(6, 4) }}</q-item-section>
          </q-item>
          <q-item clickable @click="onLogout">
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { debounce } from "../../utils/helper";
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      searchKey: "",
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
    path() {
      return this.$route.path;
    },
    inDrive() {
      return this.path.startsWith("/drive");
    },
    inStone() {
      return this.path.startsWith("/stone");
    },
    asMobile() {
      return this.screen.width < 690;
    },
    btnSize() {
      return this.asMobile ? "12px" : null;
    },
  },
  watch: {
    searchKey(val) {
      this.searchKey = val.replace("/", "");
      debounce(() => {
        this.$bus.emit("search-key", this.searchKey);
      }, 500);
    },
    path() {
      this.searchKey = "";
    },
  },
  methods: {
    onNew() {
      this.$bus.emit("click-new");
    },
    onLogout() {
      this.$store.dispatch("logout");
      this.$router.replace("/login");
    },
  },
};
</script>
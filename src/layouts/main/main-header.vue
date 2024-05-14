<style lang="scss">
.top-search {
  height: 36px;
  // width: 400px;
  padding-left: 40px;
  letter-spacing: 1px;
}
</style>

<script setup>
import UploadIndex from "./upload-index.vue";
import HeaderRight from "../header-right.vue";
</script>

<template>
  <!-- <a href="/mint" target="_blank" class="pos-r mr-3 hover-1">
    <img v-if="asMobile" src="/img/mossy/mint.png" height="40" class="d-b" />
    <img v-else src="/img/common/mint.png" height="56" class="d-b" />
  </a> -->
  <q-btn
    v-if="inDrive"
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

  <header-right />
</template>

<script>
import { debounce } from "../../utils/helper";
import { useQuasar } from "quasar";
import { mapState } from "vuex";

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
      myChainId: (s) => s.myChainId,
    }),
    path() {
      return this.$route.path;
    },
    inDrive() {
      return this.path.startsWith("/file");
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
  },
};
</script>
<style scoped lang="scss">
.bg-top {
  background: url(/img/mossy/bg-planet.png) 80% 50% no-repeat;
  background-size: 260px;
}
.m-search {
  width: 90vw;
  max-width: 700px;
  padding: 12px 12px;
  padding-left: 50px;
  text-align: center;
  font-size: 15px;
  &:focus {
    text-align: left;
  }
}
</style>

<script setup>
import ExploreList from "./explore/explore-list.vue";
</script>

<template>
  <div class="ta-c bg-top pt-9 pb-9">
    <div class="d-ib pos-r">
      <div class="fz-25 fw-b">Welcome to Mossyland</div>
      <div class="pos-r mt-5 d-ib">
        <img src="/img/mossy/ic-search.svg" width="32" class="y-center" style="left: 8px" />
        <input
          class="bdrs-100 m-search"
          type="text"
          v-model="searchKey"
          @keyup.enter="handleSearch"
          placeholder="Enter X id or stone keywords"
        />
      </div>
    </div>
  </div>
  <div class="main-wrap">
    <ExploreList></ExploreList>
  </div>

  <!-- <div class="pos-f" style="bottom: 80px; right: 40px">
    <a href="/mint" target="_blank" class="">
      <img src="/img/mossy/mint.png" height="100" class="d-b hover-s1 trans-200" />
    </a>
  </div> -->
</template>

<script>
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
    asMobile() {
      return this.screen.width < 690;
    },
  },
  methods: {
    handleSearch() {
      if (!this.searchKey) return;
      this.$router.push({
        path: "/mossy/search",
        query: {
          w: this.searchKey,
        },
      });
    },
  },
};
</script>

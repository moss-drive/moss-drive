<style scoped lang="scss">
.bg-top {
  background: url(/img/mossy/bg-planet.png) 66% 50% no-repeat;
  background-size: 230px;
}
.m-search {
  width: 500px;
  padding: 12px 12px;
  padding-left: 50px;
  font-size: 15px;
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
          placeholder="Enter stone keywords"
        />
      </div>
    </div>
  </div>
  <div class="main-wrap">
    <ExploreList></ExploreList>
  </div>
  <!-- <search-page ref="searchPage" v-show="searchfocus"></search-page> -->
</template>

<script>
import { useQuasar } from "quasar";

// import SearchPage from "./explore/search-page.vue";

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

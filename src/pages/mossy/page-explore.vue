<style scoped lang="scss">
.bg-top {
  background: url(/img/mossy/bg-planet.png) 66% 50% no-repeat;
  background-size: 230px;
}
.m-search {
  width: 350px;
  padding: 12px 12px;
  padding-left: 50px;
  font-size: 15px;
}
</style>

<script setup>
import ExploreList from "./explore/explore-list.vue";
</script>

<template>
  <div v-show="!searchfocus">
    <div class="ta-c bg-top pt-9 pb-9">
      <div class="d-ib pos-r">
        <div class="fz-25 fw-b">Welcome to Mossyland</div>
        <div class="pos-r mt-5 d-ib">
          <img src="/img/mossy/ic-search.svg" width="32" class="y-center" style="left: 8px" />
          <input
            class="bdrs-100 m-search"
            type="text"
            @focus="searchfocus = true"
            placeholder="Enter stone keywords"
          />
        </div>
      </div>
    </div>
    <div class="main-wrap">
      <ExploreList></ExploreList>
    </div>
  </div>

  <search-page ref="searchPage" v-show="searchfocus"></search-page>
</template>

<script>
import { useQuasar } from "quasar";

import SearchPage from "./explore/search-page.vue";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      searchfocus: false,
    };
  },
  computed: {
    asMobile() {
      return this.screen.width < 690;
    },
  },
  components: {
    SearchPage,
  },
  watch: {
    searchfocus(val) {
      if (val) {
        this.$nextTick(() => {
          document.getElementById("searchIpt").focus();
        });
      }
    },
  },
};
</script>

<style>
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
  <div class="ta-c bg-top pt-9 pb-9">
    <div class="d-ib pos-r">
      <div class="fz-25 fw-b">Welcome to Mossyland</div>
      <div class="pos-r mt-5 d-ib">
        <img src="/img/mossy/ic-search.svg" width="32" class="y-center" style="left: 8px" />
        <input class="bdrs-100 m-search" type="text" placeholder="Enter stone keywords" />
      </div>
      <div
        class="ml-3 pos-a btm-0 ta-l"
        :class="{
          'ml-3': !asMobile,
        }"
        style="left: 100%; width: 200px"
      >
        <q-btn
          color="primary"
          icon="add"
          rounded
          :round="asMobile"
          :size="asMobile ? 'medium' : 'large'"
        >
          <span v-if="!asMobile">ADD MY FILES</span>
        </q-btn>
      </div>
    </div>
  </div>
  <div class="main-wrap">
    <ExploreList></ExploreList>
  </div>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    asMobile() {
      return this.screen.width < 690;
    },
  },
};
</script>
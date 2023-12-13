<template>
  <div class="row q-col-gutter-md">
    <router-link
      :to="`/mossy/stone?id=${it.stoneId}`"
      class="col-6 col-sm-4 col-md-3"
      v-for="(it, i) in list"
      :key="i"
    >
      <div class="d-flex bg-dark2 pa-3 bdrs-8 pos-r cursor-p" v-ripple>
        <div class="flex-3 shrink-1 mr-2 h-flex">
          <div class="fz-15 fw-b line-3 lh-1 wb-all">{{ it.stoneName }}</div>
          <div class="op-5 mt-1 mb-1 fz-13">by {{ it.twitterName }}</div>
          <div class="fz-13 fw-b mt-auto al-c">
            <span>{{ it.price ? formatEther(it.price) : "-" }}ETH</span>
            <img class="ml-1" src="/img/mossy/icon/trend-up.svg" width="12" />
          </div>
        </div>
        <div class="flex-2">
          <div class="stone-cover w100p">
            <q-img :src="it.avatar" class="w100p" :ratio="1" />
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { utils } from "ethers";

export default {
  props: {
    list: Array,
  },
  methods: {
    formatEther(val) {
      return utils.formatEther(val);
    },
  },
};
</script>
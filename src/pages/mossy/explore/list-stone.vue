<template>
  <div class="row q-col-gutter-md">
    <router-link
      :to="`/${it.stoneId}`"
      target="_blank"
      class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
      v-for="(it, i) in list"
      :key="i"
    >
      <div class="d-flex bg-dark2 pa-4 bdrs-8 pos-r hover-2" v-ripple.early>
        <div class="flex-3 shrink-1 mr-2 h-flex">
          <div class="fz-15 fw-b line-3 lh-1 wb-all">
            <net-icon :chainId="it.chainId" :size="8" field="icon2" />
            <span class="ml-1">{{ it.stoneName }}</span>
          </div>
          <div class="mt-2 mb-1 al-c">
            <!-- <img :src="it.twitterAvatar || '/img/stone/x-round.svg'" width="18" class="bdrs-100" /> -->
            <user-avatar :src="it.twitterAvatar" :uid="it.uid" :size="18" />
            <span class="ml-1 fz-14 op-8">{{ it.twitterName }}</span>
          </div>
          <div class="fz-13 fw-b mt-auto al-c">
            <span>{{ it.price ? $formatEther(it.price) : "-" }}ETH</span>
            <!-- <img class="ml-1" src="/img/mossy/icon/trend-up.svg" width="12" /> -->
          </div>
        </div>
        <div class="flex-2 pr-2">
          <div class="stone-cover w100p">
            <q-img :src="it.avatar" class="w100p" :ratio="1" />
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
  },
  methods: {},
};
</script>

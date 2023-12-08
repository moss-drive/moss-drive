<template>
  <div class="row q-col-gutter-md">
    <div
      @click="$router.push('/mossy/stone')"
      class="col-6 col-sm-4 col-md-3"
      v-for="(it, i) in list"
      :key="i"
    >
      <div class="d-flex bg-dark1 pa-3 bdrs-8 pos-r cursor-p" v-ripple>
        <div class="flex-3 shrink-1 mr-2 h-flex">
          <div class="fz-15 fw-b line-3 lh-1 wb-all">{{ it.title }}</div>
          <div class="op-5 mt-1 mb-1 fz-13">by xx</div>
          <div class="fz-13 fw-b mt-auto al-c">
            <span>0.009ETH</span>
            <img class="ml-1" src="/img/mossy/icon/trend-up.svg" width="12" />
          </div>
        </div>
        <div class="flex-2">
          <div class="stone-cover w100p">
            <q-img :src="it.img" class="w100p" :ratio="1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
  },
};
</script>
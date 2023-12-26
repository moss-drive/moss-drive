<template>
  <a
    :href="`/${info.stoneId}`"
    :class="{
      'd-center': asMobile,
    }"
    target="_blank"
    v-if="info"
    class="pa-3 al-c h100p"
  >
    <div class="mr-auto h-flex h100p" v-if="!asMobile">
      <p class="line-1">{{ info.stoneName }}</p>
      <div class="mt-2 mb-1 al-c">
        <img :src="info.twitterAvatar" width="14" class="bdrs-100" />
        <span class="ml-1 fz-12 op-8 line-1">{{ info.twitterName }}</span>
      </div>
      <div class="mt-auto fz-13 op-6">
        <span>{{ info.price ? $formatEther(info.price) : "-" }}ETH</span>
      </div>
    </div>
    <div class="stone-cover">
      <q-img :src="info.avatar" width="60px" :ratio="1"></q-img>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    info: Object,
    asMobile: Boolean,
  },
};
</script>
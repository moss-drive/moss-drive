<template>
  <div class="pa-8 pt-0 ta-c">
    <img :src="`/img/stone/${img}.svg`" :width="width" />
    <div class="fz-15 op-9 mt-3">{{ desc || "As empty as a cloudless sky" }}</div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 260,
    },
    img: {
      type: String,
      default: "stone-empty",
    },
    desc: {
      type: String,
    },
  },
};
</script>

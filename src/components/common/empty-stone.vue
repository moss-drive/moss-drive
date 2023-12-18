<template>
  <div class="pa-8 pt-0 ta-c">
    <img :src="`/img/stone/${img}.svg`" width="260" />
    <div class="fz-15 op-9">{{ desc || "As empty as a cloudless sky" }}</div>
  </div>
</template>

<script>
export default {
  props: {
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

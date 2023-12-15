<template>
  <div class="pa-8 pt-0 ta-c">
    <img :src="`/img/stone/${name}.svg`" width="260" />
    <div class="fz-15 op-9">{{ desc }}</div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "stone-empty",
    },
    desc: {
      type: String,
      default: "As empty as a cloudless sky",
    },
  },
};
</script>

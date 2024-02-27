<template>
  <q-img :src="imgSrc" :ratio="1" :width="size" />
</template>

<script>
import { getNetIcon } from "../../utils/wallet";

export default {
  props: {
    chainId: String,
    size: {
      type: Number,
      default: 22,
    },
  },
  computed: {
    imgSrc() {
      const icon = getNetIcon(this.chainId);
      return `/img/common/${icon}`;
    },
  },
};
</script>
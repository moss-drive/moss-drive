<template>
  <q-img :src="imgSrc" :ratio="1" :width="size + 'px'" />
</template>

<script>
import { mapState } from "vuex";
import { getNetIcon } from "../../utils/wallet";

export default {
  props: {
    chainId: Number,
    size: {
      type: Number,
      default: 22,
    },
  },
  computed: {
    ...mapState({
      myChainId: (s) => s.myChainId,
    }),
    imgSrc() {
      const id = this.chainId || this.myChainId;
      const icon = getNetIcon(id);
      return `/img/common/${icon}`;
    },
  },
};
</script>
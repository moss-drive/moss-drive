<template>
  <img :src="imgSrc" :width="field == 'icon' ? size : null" :height="size" />
</template>

<script>
import { mapState } from "vuex";
import { getNetIcon } from "../../utils/wallet";

export default {
  props: {
    chainId: [Number, String],
    size: {
      type: Number,
      default: 22,
    },
    field: {
      type: String,
      default: "icon",
    },
  },
  computed: {
    ...mapState({
      myChainId: (s) => s.myChainId,
    }),
    imgSrc() {
      const id = this.chainId || this.myChainId;
      const icon = getNetIcon(id, this.field);
      return `/img/common/${icon}`;
    },
  },
};
</script>
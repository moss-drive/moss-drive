<template>
  <q-avatar :size="size + 'px'" v-if="src">
    <img :src="src" />
  </q-avatar>
  <m-avatar :size="size" v-else :hash="uid"></m-avatar>
</template>

<script>
export default {
  props: {
    src: String,
    uid: String,
    size: {
      type: Number,
      default: 22,
    },
  },
};
</script>
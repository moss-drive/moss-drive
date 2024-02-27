<template>
  <q-avatar :size="size + 'px'" v-if="src">
    <q-img
      :src="src"
      :placeholder-src="defsrc"
      :width="size + 'px'"
      :ratio="1"
      :spinner-size="size - 8 + 'px'"
    >
      <template v-slot:error>
        <div class="pos-mask bg-dark"></div>
      </template>
    </q-img>
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
    defsrc: {
      type: String,
      default: "/img/stone/x-round.svg",
    },
  },
};
</script>
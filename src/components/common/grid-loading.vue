<template>
  <div class="row">
    <div v-for="i in num" :key="i" class="col-4 col-sm-3 col-md-2 col-xl-1 pa-2">
      <div>
        <q-skeleton height="140px" square />

        <q-skeleton type="text" class="text-subtitle1" />
        <!-- <q-skeleton type="text" width="50%" class="text-subtitle1" /> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 8,
    },
  },
};
</script>
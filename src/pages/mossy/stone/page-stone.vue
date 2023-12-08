<script setup>
import StoneLeft from "./stone-left.vue";
import StoneRight from "./stone-right.vue";
</script>

<template>
  <div class="pa-5">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-9">
        <stone-left />
      </div>
      <div class="col-12 col-md-3">
        <stone-right />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
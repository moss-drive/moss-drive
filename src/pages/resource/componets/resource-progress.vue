<template>
  <div>
    <div class="resource-info mb-2 al-c space-btw">
      <div>{{ name }}</div>
      <div class="fz-12 resource-usage">
        <span class="resource-num fz-20" :style="{ color: color }">500</span>
        <span class="unit">GB</span>
        <span>/</span>
        <span>5GB</span>
      </div>
    </div>
    <q-linear-progress
      :value="0.4"
      size="8px"
      rounded
      color="color"
      style="background: #334155"
      :style="{
        '--color': color,
      }"
    />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#57B9BC",
    },
    used: {
      type: String,
      default: "123123123",
    },
    total: {},
  },
  computed() {},
};
</script>

<style lang="scss" scoped>
.text-color {
  color: var(--color) !important;
}

.resource-info {
  color: #cbd5e1;
  .resource-usage {
    > span {
      margin-left: 2px;
    }
    .resource-num {
      font-family: "DIN Alternate";
    }
  }
}
</style>

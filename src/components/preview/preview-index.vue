<style lang="scss">
@media (max-width: 599.98px) {
  .q-dialog__inner--bottom > div {
    border-radius: 0;
  }
}
</style>

<template>
  <q-dialog
    v-model="showPop"
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    class="bg-none"
  >
    <preview-con :list="list" :current="current" @close="showPop = false" />
  </q-dialog>
</template>

<script>
export default {
  emits: ["update:modelValue"],
  props: {
    modelValue: Boolean,
    list: Array,
    current: Number,
  },
  data() {
    return {
      showPop: this.modelValue,
    };
  },
  computed: {
    curItem() {
      return this.list[this.current] || {};
    },
    dialogOpt() {
      return {
        position: "bottom",
        maximized: true,
      };
    },
  },
  watch: {
    modelValue(val) {
      this.showPop = val;
    },
    showPop(val) {
      this.$emit("update:modelValue", val);
    },
  },
};
</script>
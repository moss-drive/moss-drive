<style lang="scss">
@media (max-width: 599.98px) {
  // .q-slider__track,
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
    <common-preview :list="list" :current="compCurrent" />
  </q-dialog>
</template>

<script>
import CommonPreview from "./common-preview.vue";

export default {
  components: {
    CommonPreview,
  },
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
    isAudio() {
      return this.curItem.type == "audio";
    },
    compCurrent() {
      return this.list.findIndex((it) => it == this.curItem);
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
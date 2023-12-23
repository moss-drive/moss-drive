<script setup>
import CheckAct from "./check-act/check-act.vue";
import DriveList from "./drive-list.vue";
</script>

<template>
  <drive-list is-page @refresh="onRefresh">
    <template v-slot:act="props">
      <check-act v-bind="props" />
    </template>
  </drive-list>

  <!--  -->
</template>

<script>
export default {
  data() {
    return {};
  },

  created() {},
  methods: {
    onRefresh() {
      this.listLoaded = true;
    },
  },
};
</script>
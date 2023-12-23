<script setup>
import CheckAct from "./check-act/check-act.vue";
import DriveList from "./drive-list.vue";
</script>

<template>
  <drive-list is-page @error="onError" @refresh="onRefresh">
    <template v-slot:act="props">
      <check-act v-bind="props" />
    </template>
  </drive-list>

  <!--  -->
</template>

<script>
export default {
  data() {
    return {
      isCreated: false,
      loadErr: "",
      listLoaded: false,
    };
  },

  created() {},
  methods: {
    onRefresh() {
      this.listLoaded = true;
    },
    onRetry() {
      this.$setStore({
        stsData: {},
      });
      this.loadErr = "";
      location.reload();
    },
    onError(error) {
      // localStorage.moss_bucket = "";
      this.loadErr = error.message;
      this.listLoaded = false;
    },
  },
};
</script>
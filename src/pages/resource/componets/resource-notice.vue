<template>
  <div class="notice-container my-4" v-if="showNotice">
    <img width="24" src="/img/resource/notice.svg" alt="" />
    <span class="ml-2 fz-14">
      The trial account will expire on 1st January 2023, after which the resources will be cleared.
      Please complete the initial deposit and upgrade your account to the Standard.
    </span>
    <img
      width="24"
      class="cursor-p ml-auto"
      src="/img/resource/close.svg"
      alt=""
      @click="showNotice = false"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNotice: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.notice-container {
  display: flex;
  padding: 8px 16px;
  align-items: center;
  border-radius: 4px;
  background: #94f9ca;
  color: #0f172a;
}
</style>

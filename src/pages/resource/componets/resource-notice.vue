<template>
  <div class="notice-container my-4" v-if="showNotice">
    <img width="24" src="/img/resource/notice.svg" alt="" />
    <span class="ml-2 fz-14">
      {{ invalidText }}
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      showNotice: true,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    invalidText() {
      let timestamp = +new Date();
      let createdTimestamp = this.userInfo.createdAt + 86400 * 30 * 1000;
      if (timestamp > createdTimestamp)
        return "Your trial account has expired. Upgrade to the permanent Standard account with a minimum deposit of 1U.";
      let expiredDate = new Date(createdTimestamp).format("date");
      return `The trial account will expire on ${expiredDate}.after which the resources will be cleared. Pleasecomplete the initial deposit and upgrade youraccount to the Standard.`;
    },
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

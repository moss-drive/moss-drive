<template>
  <div class="empty">
    <img :src="emptyImg" :width="width" />
    <div class="empty-message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 280,
    },
    emptyImg: {
      type: String,
      default: "/img/stone/default-empty.png",
    },
    message: {
      type: String,
      default: "As empty as a cloudless sky",
    },
  },
};
</script>
<style lang="scss" scoped>
.empty {
  width: 100%;
  text-align: center;
  .empty-message {
    color: #fff;
    /* Regular/14px */
    font-family: SF Pro Text;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 114.286% */
  }
}
</style>

<template>
  <div class="chat-container">
    <div class="al-c space-btw">
      <span class="fw-b fz-16">Chat</span>

      <img
        @click="handleBlowUp"
        src="/img/stone/chat-blow-up.svg"
        class="cursor-p"
        width="24"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBlowUp() {},
  },
};
</script>

<style lang="scss" scoped>
.chat-container {
  // border-radius: 16px;
  // background: #0f172a;
}
</style>

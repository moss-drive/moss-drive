<template>
  <div class="chat-container pos-r">
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
    <div class="chat-body"></div>

    <div class="chat-input-container pos-a pa-2 al-c space-btw">
      <input
        class="chat-input flex-1 fz-16"
        @keyup.enter="handleSendMessage"
        type="text"
        v-model="message"
      />
      <img
        width="32"
        class="cursor-p"
        @click="handleSendMessage"
        src="/img/stone/chat-send-btn.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  emits: ["blowUp"],
  props: {
    info: Object,
  },
  data() {
    return {
      message: "",

      // list:
    };
  },
  computed: {
    stoneId() {
      return "23";
    },
  },
  methods: {
    handleBlowUp() {
      this.$emit("blowUp");
    },
    async handleSendMessage() {
      try {
        await this.$http.put("/message/board", {
          message: this.message,
          stoneId: this.stoneId,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
}
.chat-input-container {
  width: 100%;
  left: 0;
  bottom: 0;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0f172a;
  .chat-input {
    background: transparent;
    color: #fff;
  }
}
</style>

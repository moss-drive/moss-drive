<template>
  <div class="chat-container pos-r h-flex" id="chatContainer">
    <div class="al-c space-btw">
      <span class="fw-b fz-16">Chat</span>
      {{ stoneId }}
      <img
        @click="handleBlowUp"
        src="/img/stone/chat-blow-up.svg"
        class="cursor-p"
        width="24"
        alt=""
      />
    </div>
    <div class="chat-body ov-a">
      <div class="chat-item al-c" v-for="item in list" :key="item.name">
        <img class="mr-2" width="32" style="border-radius: 100%" :src="item.avatar" alt="" />
        <div class="flex-1">
          <div class="user-name fz-12">{{ item.name }}</div>
          <div class="message-box pa-2 fz-14">{{ item.message }}</div>
        </div>
      </div>
    </div>

    <div class="chat-input-container pos-a pa-2 al-c space-btw">
      <input
        class="chat-input flex-1 fz-16"
        @keyup.enter="handleSendMessage"
        type="text"
        placeholder="Enter something..."
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
      list: [],
      height: 400,
    };
  },
  created() {},
  mounted() {
    this.getMessageList();
  },
  computed: {
    stoneId() {
      return this.info.stoneId;
    },
  },
  methods: {
    handleBlowUp() {
      this.$emit("blowUp");
    },
    async handleSendMessage() {
      try {
        if (!this.stoneId || !this.message) return;
        this.message = "";
        await this.$http.put("/message/board", {
          message: this.message,
          stoneId: this.stoneId,
        });
        this.getMessageList();
      } catch (error) {
        console.log(error);
      }
      this.getMessageList();
    },

    async getMessageList() {
      try {
        const { data } = await this.$http.get("/message/board", {
          params: {
            stoneId: 19,
          },
        });
        this.list = data;
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

  .chat-body {
    height: 400px;
    .chat-item {
      margin-top: 16px;
    }
    .user-name {
      color: #cbd5e1;
    }
    .message-box {
      margin-top: 2px;
      border-radius: 0px 4px 4px 4px;
      background: #334155;
    }
  }
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

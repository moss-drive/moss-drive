<template>
  <div class="chat-container pos-r h-flex" id="chatContainer">
    <div class="al-c space-btw">
      <span class="fw-b fz-16">Chat</span>
      <!-- <img
        @click="handleBlowUp"
        src="/img/stone/chat-blow-up.svg"
        class="cursor-p"
        width="24"
        alt=""
      /> -->
    </div>

    <div class="chat-body mt-2 h-flex ov-a" style="flex-direction: column-reverse">
      <div class="chat-item al-c" v-for="item in list" :key="item.id">
        <img class="mr-2" width="32" style="border-radius: 100%" :src="item.avatar" alt="" />
        <div class="flex-1">
          <div class="user-name fz-12">{{ item.name }}</div>
          <div class="message-box pa-2 fz-14">{{ item.message }}</div>
        </div>
      </div>
      <div class="ta-c cursor-p" @click="getMessageList(false)" v-show="curList.length >= size">
        <div v-if="!loading">Load More</div>
        <div v-else class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </div>
    </div>

    <div class="chat-input-container pos-a pa-2 al-c space-btw">
      <input
        class="chat-input flex-1 fz-16"
        @keyup.enter="handleSendMessage"
        type="text"
        maxlength="200"
        placeholder="Enter something..."
        v-model="message"
      />
      <img
        width="32"
        class="cursor-p"
        @click="handleSendMessage"
        :src="!message ? '/img/stone/chat-send-btn.svg' : '/img/stone/chat-send-btn-active.svg'"
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
    balance: Number,
  },
  data() {
    return {
      message: "",
      list: [],
      curList: [],
      page: 1,
      size: 20,
      loading: false,
      timer: null,
    };
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
        const message = this.message;
        this.message = "";
        await this.$http.put("/message/board", {
          message,
          stoneId: this.stoneId,
        });
        this.curList = [];
        this.page = 1;
        this.getMessageList(true);
      } catch (error) {
        console.log(error);
      }
    },

    async getMessageList(reset = false) {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/message/board", {
          params: {
            stoneId: this.stoneId,
            page: this.page,
            size: this.size,
          },
          noTip: 1,
        });
        if (!data) return (this.curList = []);
        this.curList = data;
        if (reset) {
          this.list = data;
          this.page = 1;
        } else {
          this.list = this.list.concat(this.curList);
          this.page++;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
  watch: {
    balance(val) {
      if (val) {
        this.getMessageList();
        if (this.timer) return;
        this.timer = setInterval(() => {
          this.page = 1;
          this.getMessageList(true);
        }, 15000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
  .chat-body {
    height: 300px;
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

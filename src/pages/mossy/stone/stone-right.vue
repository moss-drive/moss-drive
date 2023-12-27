<template>
  <div class="h-flex" style="height: 100%">
    <div class="bg-card-2 mb-5" v-if="!chatBlowUp">
      <div class="fw-b fz-18">Author</div>
      <div class="ta-c mt-5">
        <q-avatar size="60px" v-if="twitterInfo.avatarUrl">
          <img :src="twitterInfo.avatarUrl" />
        </q-avatar>
        <div v-else class="d-center">
          <m-avatar
            v-if="twitterInfo.twitterId"
            :hash="twitterInfo.twitterId"
            :size="60"
          ></m-avatar>
          <q-skeleton v-else type="circle" size="60px" />
        </div>
        <div class="pa-2"></div>
        <div v-if="!twitterInfo.name">
          <q-skeleton type="title" width="150px" class="m-auto" />
          <q-skeleton type="text-subtitle1" width="120px" class="mt-2 m-auto" />
        </div>
        <template v-else>
          <div class="fz-20 fw-b line-1">
            {{ twitterInfo.name || "-" }}
          </div>
          <div class="op-5 fz-14">
            <span>@{{ twitterInfo.username || "-" }}</span>
            <span class="ml-5">{{ "follower".getCountName(twitterInfo.followers) }} </span>
          </div>
        </template>
      </div>
      <div class="pa-2"></div>
      <div v-if="!twitterInfo.name">
        <q-skeleton height="100px" square />
      </div>
      <template v-else>
        <div class="line-2 fz-14 op-9">{{ twitterInfo.description }}</div>
        <div class="mt-5">
          <q-btn
            :href="`https://twitter.com/${twitterInfo.username}`"
            target="_blank"
            flat
            rounded
            style="background: #000"
            class="full-width"
          >
            <img src="/img/mossy/icon/x.svg" width="20" />
          </q-btn>
        </div>
      </template>
    </div>

    <div class="right-chat bg-card-2" v-show="balance > 0">
      <right-chat :info="info" @blowUp="handleBlowUp" :balance="balance"></right-chat>
    </div>

    <div class="right-chat-locked pos-r" v-show="balance <= 0">
      <div class="locked-bg"></div>
      <img width="80" class="pos-a" src="/img/stone/ic-locked.svg" alt="" />
      <span class="pos-a text">Buy Stone Keys to view chat</span>
    </div>
  </div>
</template>

<script>
import RightChat from "./right-chat.vue";
// import { mapState } from "vuex";
export default {
  props: {
    info: Object,
    balance: Number,
  },
  data() {
    return {
      chatBlowUp: false,
    };
  },
  computed: {
    twitterInfo() {
      return this.info.twitterInfo || {};
    },
  },

  methods: {
    handleBlowUp() {
      this.chatBlowUp = !this.chatBlowUp;
    },
  },
  components: {
    RightChat,
  },
};
</script>

<style lang="scss" scoped>
.right-chat {
  height: 450px;
  img {
    width: 100%;
  }
}
.right-chat-locked {
  width: 100%;
  height: 450px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, #0f172a 71.4%);
  border-radius: 16px;
  .locked-bg {
    background: url("/img/stone/chat-locked.png") no-repeat;
    background-size: 100%;
    height: 100%;
    border-radius: 16px;
  }
  img {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .text {
    left: 50%;
    transform: translate(-50%);
    bottom: 30%;
    white-space: nowrap;
  }
}
</style>

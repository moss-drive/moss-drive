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
          <div class="fz-20 fw-b" style="overflow: hidden; text-overflow: ellipsis">
            {{ twitterInfo.name || "-" }}
          </div>
          <div class="op-5 fz-14">@{{ twitterInfo.username || "-" }}</div>
        </template>
      </div>
      <div class="pa-2"></div>
      <div v-if="!twitterInfo.name">
        <q-skeleton height="100px" square />
      </div>
      <template v-else>
        <div class="line-2 fz-14 op-9">{{ info.description }}</div>
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

    <div class="right-chat bg-card-2">
      <!-- <div class="fw-b fz-18">Chat</div> -->
      <right-chat :info="info" @blowUp="handleBlowUp" :balance="balance"></right-chat>
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
}
</style>

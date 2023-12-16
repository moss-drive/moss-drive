<template>
  <div>
    <div class="bg-card-2">
      <div class="fw-b fz-18">Author</div>
      <div class="ta-c mt-5">
        <q-avatar size="60px" v-if="info.avatarUrl">
          <img :src="info.avatarUrl" />
        </q-avatar>
        <div v-else class="d-center">
          <m-avatar :hash="uid" size="60"></m-avatar>
        </div>
        <div class="mt-4 fz-20 fw-b">{{ info.name || "-" }}</div>
        <div class="op-5 fz-14">@{{ info.username || "-" }}</div>
      </div>
      <div class="mt-3 line-2 fz-14 op-9">{{ info.followers }} followers</div>
      <div class="mt-5">
        <q-btn
          :href="`https://twitter.com/${info.username}`"
          target="_blank"
          flat
          rounded
          style="background: #000"
          class="full-width"
        >
          <img src="/img/mossy/icon/x.svg" width="20" />
        </q-btn>
      </div>
    </div>

    <div class="bg-card-2 mt-5">
      <div class="fw-b fz-18">Chat</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    info: Object,
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
  },
};
</script>
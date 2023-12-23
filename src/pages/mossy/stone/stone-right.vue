<template>
  <div>
    <div class="bg-card-2">
      <div class="fw-b fz-18">Author</div>
      <div class="ta-c mt-5">
        <q-avatar size="60px" v-if="info.avatarUrl">
          <img :src="info.avatarUrl" />
        </q-avatar>
        <div v-else class="d-center">
          <m-avatar v-if="info.twitterId" :hash="info.twitterId" :size="60"></m-avatar>
          <q-skeleton v-else type="circle" size="60px" />
        </div>
        <div class="pa-2"></div>
        <div v-if="!info.name">
          <q-skeleton type="title" width="150px" class="m-auto" />
          <q-skeleton type="text-subtitle1" width="120px" class="mt-2 m-auto" />
        </div>
        <template v-else>
          <div class="fz-20 fw-b">{{ info.name || "-" }}</div>
          <div class="op-5 fz-14">@{{ info.username || "-" }}</div>
        </template>
      </div>
      <div class="pa-2"></div>
      <div v-if="!info.name">
        <q-skeleton height="100px" square />
      </div>
      <template v-else>
        <div class="line-2 fz-14 op-9">{{ info.description }}</div>
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
      </template>
    </div>

    <!-- <div class="bg-card-2 mt-5">
      <div class="fw-b fz-18">Chat</div>
    </div> -->
  </div>
</template>

<script>
// import { mapState } from "vuex";

export default {
  props: {
    info: Object,
  },
  computed: {},
};
</script>
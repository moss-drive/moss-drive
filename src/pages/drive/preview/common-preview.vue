<style lang="scss">
.qs-preview .q-carousel__slide {
  padding: 0;
}
.qs-preview .q-panel {
  overflow: hidden;
}
.bg-none {
  .q-dialog__backdrop {
    background: rgba($color: #000000, $alpha: 0.7);
  }
  .q-card {
    background: none;
    .q-carousel {
      background: none;
    }
  }
}
</style>

<script setup>
import ImgItem from "./img-item.vue";
</script>

<template>
  <q-card class="full-width bg-none">
    <q-card-section class="pos-a right-0 top-0 z-100">
      <q-btn icon="close" class="bg-black-5" flat round dense v-close-popup />
    </q-card-section>

    <q-carousel
      class="qs-preview"
      swipeable
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      :arrows="list.length > 1"
      v-model="curIdx"
      v-model:fullscreen="fullscreen"
      infinite
      height="100vh"
    >
      <q-carousel-slide v-for="(it, i) in list" :key="it.Key" :name="i" @click="onBgClick">
        <div class="m-auto" style="max-width: 800px; height: 95vh">
          <img-item v-if="it.type == 'image'" :src="it.url" />
          <template v-else>
            <iframe
              class="wh100p"
              :src="getUrl(it)"
              frameborder="0"
              @load="loading = false"
            ></iframe>
            <div class="pos-center" v-show="loading">
              <q-spinner-ios color="yellow" size="30px" />
            </div>
          </template>
        </div>
        <div class="d-center">
          <div>
            <span>CID</span>
            <a :href="getCidLink(it.cid)" target="_blank" class="color-a ml-1">
              <u>{{ it.cid.cutStr(6, 4) }}</u>
            </a>
            <q-icon name="content_copy" class="ml-1 hover-1 pa-1" @click="$copy(it.cid)"></q-icon>
          </div>
          <div class="ml-5">
            <span>URL</span>
            <a :href="it.url" target="_blank" class="color-a ml-1">
              <u>{{ it.name }}</u>
            </a>
          </div>
        </div>
      </q-carousel-slide>

      <template v-slot:control>
        <q-carousel-control position="top-left" :offset="[20, 20]">
          <div class="al-c white">
            <img :src="`/img/driver/icon_${curItem.type}.png`" width="30" class="d-b ml-2" />
            <span v-if="curItem" class="ml-2">{{ curItem.name }}</span>
            <!-- <span class="op-6" v-if="list.length > 1">({{ curIdx + 1 }}/{{ list.length }})</span> -->
          </div>
        </q-carousel-control>
      </template>
    </q-carousel>
  </q-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    list: Array,
    current: Number,
  },
  data() {
    return {
      curIdx: this.current,
      fullscreen: false,
      loading: true,
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.userInfo.uid,
    }),
    curItem() {
      return this.list[this.curIdx];
    },
  },
  watch: {
    current(val) {
      this.curIdx = val;
    },
    curItem() {
      console.log(this.curItem);
      this.loading = true;
    },
  },
  methods: {
    onBgClick(e) {
      console.log(e.target);
    },
    getCidLink(cid) {
      return this.$bucket.getIpfsLink(this.uid, cid);
    },
    getUrl(it) {
      let pre = "http://127.0.0.1:5174/";
      pre = "https://preview.4everland.org/";
      let url = pre + "?src=" + it.url;
      if (it.size > 1024 * 100) {
        if (/\.(js|json|txt|html)$/.test(it.name)) {
          url += "&type=download";
          // url = 'http://127.0.0.1:5173/test.html?src=' + it.url
        }
      }
      return url;
    },
  },
};
</script>
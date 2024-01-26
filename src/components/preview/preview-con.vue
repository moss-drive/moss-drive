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

<template>
  <q-card class="full-width bg-none">
    <q-card-section class="pos-a right-0 top-0 z-100">
      <q-btn icon="close" class="bg-black-5" flat round dense v-close-popup />
    </q-card-section>

    <q-carousel
      ref="slider"
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
      <q-carousel-slide v-for="(it, i) in viewList" :key="it.Key" :name="i" @click="onBgClick">
        <div class="vh100 h-flex">
          <div class="flex-1 ta-c">
            <div class="m-auto h100p d-center">
              <img-item v-if="it.type == 'image'" :src="it.url" />
              <video
                v-else-if="it.type == 'video'"
                :src="it.url"
                class="e-stop"
                style="max-height: 90vh; margin-top: 5vh"
                controls
              ></video>
              <audio v-else-if="it.type == 'audio'" :src="it.url" controls></audio>
              <div class="wh100p" style="max-width: 900px" v-else>
                <iframe
                  class="wh100p"
                  :src="getUrl(it)"
                  frameborder="0"
                  @load="loading = false"
                ></iframe>
                <div class="pos-center" v-show="loading">
                  <q-spinner-ios color="yellow" size="30px" />
                </div>
              </div>
            </div>
          </div>
          <div class="d-center" @click.stop v-if="!it.cidOnly">
            <div v-if="it.cid">
              <span>CID</span>
              <a :href="getCidLink(it.cid)" target="_blank" class="color-a ml-1">
                <u>{{ it.cid.cutStr(6, 4) }}</u>
              </a>
              <q-icon name="content_copy" class="ml-1 hover-1 pa-1" @click="$copy(it.cid)"></q-icon>
            </div>
            <div class="ml-5">
              <span>URL</span>
              <a :href="it.url" target="_blank" class="color-a ml-1">
                <u>{{ it.url.cutStr(20, 6) }}</u>
              </a>
            </div>
            <div class="ml-5">
              <span>Update Time</span>
              <span class="op-7 ml-2">{{ it.lastModified.format() }}</span>
            </div>
          </div>
        </div>
      </q-carousel-slide>

      <template v-slot:control>
        <q-carousel-control position="top-left" :offset="[20, 20]">
          <div class="al-c white bg-black-5 pa-1">
            <img :src="`/img/driver/icon_${curItem.type}.png`" width="30" class="d-b" />
            <span class="op-7 ml-2" v-if="list.length > 1">{{ curIdx + 1 }}/{{ list.length }}</span>
            <span v-if="curItem" class="ml-1">{{ curItem.name }}</span>
          </div>
        </q-carousel-control>
      </template>
    </q-carousel>
  </q-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  emits: ["close"],
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
    viewList() {
      return this.list.map((it) => {
        let { url } = it;
        let cidOnly = false;
        if (!url) {
          cidOnly = true;
          url = this.getCidLink(it.cid);
        }
        return {
          ...it,
          url,
          cidOnly,
        };
      });
    },
    curItem() {
      return this.viewList[this.curIdx];
    },
  },
  watch: {
    current(val) {
      this.curIdx = val;
    },
    curItem() {
      this.loading = true;
    },
  },
  mounted() {
    window.onkeyup = (e) => {
      const slider = this.$refs.slider;
      if (!slider) return;
      const len = this.list.length;
      if (len <= 1) return;
      const { code } = e;
      if (code == "ArrowRight") slider.next();
      else if (code == "ArrowLeft") slider.previous();
    };
  },
  unmounted() {
    window.onkeyup = null;
  },
  methods: {
    onBgClick(e) {
      const cls = [...e.target.classList];
      if (!cls.includes("e-stop")) {
        this.$emit("close");
      }
    },
    getCidLink(cid) {
      return this.$bucket.getIpfsLink(this.uid, cid);
    },
    getUrl(it) {
      let pre = "http://127.0.0.1:5174/";
      pre = "https://preview.4everland.org/";
      let url = pre + `?src=${encodeURIComponent(it.url)}`;
      if (it.cidOnly) {
        url += `&name=${it.name}`;
      }
      let type = this.$bucket.getExt(it.name);
      if (it.size > 1024 * 100) {
        if (/\.(js|json|txt|html)$/.test(it.name)) {
          type = "download";
        }
      }
      url += `&type=${type}`;
      return url;
    },
  },
};
</script>
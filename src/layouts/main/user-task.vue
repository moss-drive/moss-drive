<style lang="scss">
.ntf-wrap {
  min-height: 100px;
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>

<template>
  <q-card class="bg-card-1">
    <q-card-section>
      <div>
        <div>Moss Tasks</div>
      </div>
    </q-card-section>

    <div class="mt-1">
      <q-tabs class="bdb-1" v-model="tabIdx" dense active-color="primary" no-caps>
        <q-tab name="daily" label="Daily" />
        <q-tab name="achievement" label="Achievement" />
      </q-tabs>
    </div>
    <div>
      <div class="pa-4" v-show="tabIdx == 'daily'">
        <div class="row" v-if="!nftList">
          <div class="col-4 d-center" v-for="i in 3" :key="i">
            <q-skeleton size="100px" square />
          </div>
        </div>
        <div class="pt-5" v-else-if="!nftList.length">
          <empty-stone :width="200" class="pa-5" />
          <div class="ta-c">
            <q-btn color="primary" rounded href="/mint" target="_blank">
              <img src="/img/common/add-nft.svg" width="20" />
              <span class="ml-2">To Mint</span>
            </q-btn>
          </div>
        </div>
        <div class="row q-col-gutter-md" v-else>
          <div class="col-4" v-for="row in nftList" :key="row.nftId">
            <div class="pos-r bg-info bdrs-10 ov-h">
              <q-img v-if="/^http/.test(row.pic)" :src="row.pic" class="w100p bdrs-10" :ratio="1" />
              <div v-else class="w100p ntf-wrap" v-html="row.pic"></div>
              <div class="pos-btm ta-c bg-black-7 pa-">#{{ row.nftId }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pa-4" v-show="tabIdx == 'achievement'">
        <div v-if="!inviteList">
          <div class="mb-3" v-for="i in 3" :key="i">
            <q-skeleton type="QSlider" />
          </div>
        </div>
        <template v-else>
          <div
            v-for="row in inviteList"
            :key="row.code"
            class="bg-info bdrs-100 py-2 px-3 mb-3 al-c"
          >
            <div class="mr-auto fz-16">
              <span class="none-select op-6 mr-1">#</span>
              <span
                :class="{
                  'txt-del op-7 none-select': row.used,
                }"
                >{{ row.code }}</span
              >
            </div>
            <q-btn style="background: #334155" rounded flat v-if="row.used">
              <span class="mr-2">Used by</span>
              <a
                v-if="row.usedByTwitter"
                class="color-a line-1"
                :href="`https://twitter.com/${row.usedByTwitter}`"
                target="_blank"
                >@{{ row.usedByTwitter.cutStr(4, 4) }}</a
              >
              <span v-else>{{ row.usedByAddress.cutStr(5, 4) }}</span>
            </q-btn>
            <q-btn @click="$copy(row.code)" color="primary" rounded v-else>
              <icon-copy color="#333" />
              <span class="ml-2">Copy</span>
            </q-btn>
          </div>
        </template>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    userInfo: Object,
    uid: String,
  },
  data() {
    return {
      tabIdx: "daily",
      nftList: null,
      nftErr: null,
      inviteList: null,
      inviteErr: null,
    };
  },
  computed: {},
  watch: {
    tabIdx(val) {
      if (val == "daily") this.getNfts();
      else if (val == "achievement") this.getInvites();
    },
  },
  created() {
    this.getNfts();
  },
  methods: {
    getIpfs(link) {
      const cid = link.replace("ipfs://", "");
      return `https://${cid}.ipns.dweb.link/`;
      // return this.$bucket.getIpfsLink(this.uid, cid);
    },
    async getNfts() {
      try {
        this.nftErr = null;
        const { data } = await this.$http.get("/nfts");
        this.nftList = data;
      } catch (error) {
        this.nftErr = error.message;
      }
    },
    async getInvites() {
      try {
        this.inviteErr = null;
        const { data } = await this.$http.get("/invitation/usages");
        data.forEach((row) => {
          row.code = "Moss_" + row.code;
        });
        // data[0].used = 1;
        this.inviteList = data;
      } catch (error) {
        this.inviteErr = error.message;
      }
    },
    onSetting(row) {
      const { href, name } = row;
      if (href) return;
      if (name == "logout") {
        this.$store.dispatch("logout");
        this.$router.replace("/");
      }
    },
  },
};
</script>

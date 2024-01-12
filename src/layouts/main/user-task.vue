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
      <div class="task-box" v-show="tabIdx == 'daily'">
        <div v-if="!nftList">
          <div class="mb-3" v-for="i in 5" :key="i">
            <q-skeleton type="QSlider" height="54px" />
          </div>
        </div>
        <template v-else>
          <div class="task-item" v-for="item in 9" :key="item">
            <div class="task-item-left">
              <q-knob
                readonly
                v-model="value"
                show-value
                size="36px"
                :thickness="0.22"
                color="primary"
                track-color="knob"
              >
                <q-avatar size="32px">
                  <img src="/img/mossy/icon/ic-coin.png" />
                </q-avatar>
              </q-knob>
              <div>
                <div class="task-name">Login</div>
                <div class="task-desc">+2 points Claimed <span class="task-val">0</span></div>
              </div>
            </div>
            <div>
              <q-btn color="primary" rounded> Do Task </q-btn>
            </div>
          </div>
        </template>
      </div>
      <div class="task-box" v-show="tabIdx == 'achievement'">
        <div v-if="!nftList">
          <div class="mb-3" v-for="i in 5" :key="i">
            <q-skeleton type="QSlider" height="54px" />
          </div>
        </div>
        <template v-else>
          <div class="task-item" v-for="item in 9" :key="item">
            <div class="task-item-left">
              <q-knob
                readonly
                v-model="value"
                show-value
                size="36px"
                :thickness="0.22"
                color="primary"
                track-color="knob"
              >
                <q-avatar size="32px">
                  <img src="/img/mossy/icon/ic-coin.png" />
                </q-avatar>
              </q-knob>
              <div>
                <div class="task-name">Login</div>
                <div class="task-desc">+2 points Claimed <span class="task-val">0</span></div>
              </div>
            </div>
            <div>
              <q-btn color="primary" rounded> Do Task </q-btn>
            </div>
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
      value: 70,
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
        // this.nftList = data;
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

<style lang="scss">
.text-knob {
  color: #0f172a !important;
}
.bg-knob {
  background: #0f172a !important;
}
.task-box {
  padding: 16px;
  max-height: 360px;
  overflow: scroll;
  .task-item {
    display: flex;
    width: 100%;
    padding: 8px;
    justify-content: space-between;
    align-items: center;
    border-radius: 100px;
    border: 1px solid rgba(30, 239, 164, 0.25);
    background: #1e293b;
    margin-bottom: 16px;
    .task-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: SF Pro Text;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      .task-name {
        color: #fff;
        font-weight: 700;
      }
      .task-desc {
        color: #cbd5e1;
      }
      .task-val {
        color: #1eefa4;
      }
    }
  }
}
</style>

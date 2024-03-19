<style lang="scss">
.ntf-wrap {
  min-height: 100px;
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
}
.code-input {
  min-width: 180px;
  border: 1px solid #fff8;
  padding: 4px 8px;
}
</style>

<template>
  <q-card class="bg-card-1" style="border: 1px solid #334155">
    <q-card-section>
      <div class="ta-c">
        <div class="mt-2">
          <div class="d-center">
            <user-avatar :src="userInfo.avatarUrl" :uid="uid" :size="60" />
          </div>
          <p class="mt-2 line-1" v-if="userInfo.username">
            <a class="hover-1" :href="`https://twitter.com/${userInfo.username}`" target="_blank"
              >@{{ userInfo.username }}</a
            >
          </p>
          <p class="mt-1 op-7 d-center hover-1" @click="$copy(uid)">
            <span class="mr-1">{{ uid.cutStr(6, 4) }}</span>
            <icon-copy color="#fff" />
          </p>
        </div>
      </div>
    </q-card-section>

    <div class="mt-1">
      <q-tabs class="bdb-1" v-model="tabIdx" dense active-color="primary" no-caps>
        <q-tab name="nft" label="Moss NFT" />
        <q-tab name="invite" label="Invite" v-if="!this.noInvited" />
        <q-tab name="settings" label="Settings" />
      </q-tabs>
    </div>
    <div>
      <div class="pa-4" v-show="tabIdx == 'nft'">
        <div class="row" v-if="!nftList">
          <div class="col-4 d-center" v-for="i in 3" :key="i">
            <q-skeleton size="100px" square />
          </div>
        </div>
        <div class="pt-5" v-else-if="!nftList.length">
          <empty-stone :width="200" class="pa-5" />
          <!-- <div class="ta-c">
            <q-btn color="primary" rounded href="/mint" target="_blank">
              <img src="/img/common/add-nft.svg" width="20" />
              <span class="ml-2">To Mint</span>
            </q-btn>
          </div> -->
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
      <div class="pa-4" v-show="tabIdx == 'invite'">
        <div v-if="!inviteInfo">
          <div class="mb-3" v-for="i in 3" :key="i">
            <q-skeleton type="QSlider" />
          </div>
        </div>
        <div class="py-8" v-else>
          <!-- new invite -->
          <div class="al-c">
            <span class="mr-3">Invite Code</span>
            <div class="code-input">{{ inviteInfo.code }}</div>
            <icon-copy class="ml-3 hover-1" color="#fff" @click="$copy(inviteInfo.code)" />
          </div>
          <div class="al-c mt-5">
            <span class="mr-3 shrink-0">Invite Link</span>
            <div class="code-input line-1">{{ inviteInfo.link }}</div>
            <icon-copy class="ml-3 hover-1" color="#fff" @click="$copy(inviteInfo.link)" />
          </div>
          <div class="al-c mt-5">
            <span class="mr-3 shrink-0">My Invited</span>
            <span>{{ inviteInfo.invitees || 0 }}</span>
          </div>
        </div>
      </div>
      <div v-show="tabIdx == 'settings'">
        <q-list>
          <q-item
            :class="{
              'bdb-1': i < setList.length - 1,
            }"
            clickable
            v-for="(row, i) in setList"
            :key="row.name"
            :href="row.href"
            :target="row.href ? '_blank' : null"
            @click="onSetting(row)"
          >
            <div class="al-c py-2">
              <img :src="row.icon" width="25" />
              <span class="fz-18 ml-3">{{ row.label }}</span>
            </div>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    userInfo: Object,
    uid: String,
    noInvited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabIdx: "nft",
      nftList: null,
      nftErr: null,
      inviteInfo: null,
      inviteErr: null,
    };
  },
  computed: {
    setList() {
      let list = [
        {
          name: "logout",
          icon: "/img/common/ic-logout.svg",
          label: "Sign out",
        },
      ];
      if (!this.userInfo.username && !this.noInvited) {
        list.unshift({
          name: "bind",
          icon: "/img/common/x.svg",
          label: "Bind X",
          href: "/login",
        });
      }
      return list;
    },
  },
  watch: {
    tabIdx(val) {
      if (val == "nft") this.getNfts();
      else if (val == "invite") this.getInvites();
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
        const { data } = await this.$http.get("/invitation/usages");
        const info = {
          ...data[0],
        };
        info.code = "Moss_" + info.code;
        info.link = location.origin + "/?invite=" + info.code;
        // data[0].used = 1;
        this.inviteInfo = info;
      } catch (error) {
        console.log(error);
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

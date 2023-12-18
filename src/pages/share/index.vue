<template>
  <div class="share-box">
    <div class="share">
      <div class="share-left">
        <q-img class="top-img" width="100%" src="@/assets/imgs/share/left-top.png" />
        <div class="left-content">
          <div class="user-info">
            <q-img
              class="user-header"
              :src="
                userInfo.twitterAvatar
                  ? userInfo.twitterAvatar
                  : 'https://cdn.quasar.dev/img/parallax2.jpg'
              "
            />
            <div class="user-name">{{ userInfo.twitterName }}</div>
            <div class="user-account">@{{ userInfo.twitterUsername }}</div>
          </div>
          <div class="uncode" v-if="userInfo.valid && !showFileList">
            <q-form>
              <input
                class="valid-code"
                type="password"
                placeholder="Please enter the retrieval code"
                v-model="code"
              />
              <div>
                <q-btn
                  class="valid-btn"
                  label="Retrieve The File"
                  color="primary"
                  @click="getVaild"
                />
              </div>
            </q-form>
          </div>
          <div class="stone-info">
            <div class="stone-cover">
              <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" width="120px" :ratio="1" />
            </div>
            <div class="stone-name">
              <div class="ta-l">ABCDEFGHIJKLMNOPQRSTUVWXYZABCD</div>
              <q-btn round class="mt-2">
                <q-avatar size="40px">
                  <img src="@/assets/imgs/share/btn-right.png" />
                </q-avatar>
              </q-btn>
            </div>
          </div>
        </div>
        <q-img class="bottom-img" width="100%" src="@/assets/imgs/share/left-bottom.png" />
      </div>
      <div class="share-right">
        <div class="list-box" v-if="showFileList">
          <div class="list-top">
            <div class="share-info">
              <q-img src="@/assets/imgs/share/icon_folder.png" width="40px"></q-img>
              <span>{{ shareName }}</span>
            </div>
            <div class="share-time">
              <q-img
                src="@/assets/imgs/share/clock.png"
                width="24px"
                style="margin-right: 8px"
              ></q-img>
              <span style="margin-right: 24px">November 21, 2023, 18:01</span>
              <span>Expiration time: 7 days</span>
            </div>
          </div>
          <div class="list-bottom">
            <q-checkbox
              class="mr-4"
              size="40px"
              :label="checked.length + ` selected`"
              v-model="checkAll"
              indeterminate-value="not-empty"
            />
            <q-breadcrumbs gutter="sm">
              <q-breadcrumbs-el :label="`Files`" :to="basePath" @click.prevent="getList('')" />
              <q-breadcrumbs-el
                v-for="it in breadLinks"
                :key="it.folder"
                :label="it.label"
                :to="basePath"
                @click.prevent="getList(it.folder)"
              />
            </q-breadcrumbs>
            <div class="list-scroll">
              <grid-list
                :rows="rows"
                :loading="loading"
                :checked="checked"
                selection="multiple"
                @row-check="onRowCheck"
                @row-click="onRowClick"
              ></grid-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchShare, fetchShareVaild, fetchShareList } from "@/api/share.js";

export default {
  name: "ShareIndex",
  computed: {
    basePath() {
      return "/mossy/stone?id=" + this.id;
    },
    breadLinks() {
      let arr = this.curFolder.split("/");
      arr.pop();
      let folder = "";
      return arr.map((seg) => {
        folder += seg + "/";
        return {
          label: seg,
          // to: this.basePath + '?folder='+folder,
          folder,
        };
      });
    },
  },

  data() {
    return {
      loading: false,
      rows: [],
      checkAll: false,
      checked: [],
      userInfo: {},
      code: "",
      showFileList: false,
      curFolder: "",
      shareName: "",
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getShare();
    },
    async getShare() {
      const params = {
        id: this.$route.params.id,
      };
      const { data } = await fetchShare(params);
      this.userInfo = data;
      if (data.expire) {
        console.log("expire");
        return;
      } else if (data.valid) {
        console.log("need valid");
        console.log(this.$route);
        const code = this.$route.query.code;
        if (code) {
          this.code = code;
          this.getVaild();
        }
        return;
      } else {
        this.getVaild();
      }
    },
    async getVaild() {
      const code = this.code;
      const params = {
        id: this.$route.params.id,
        delimiter: "/",
        code: code,
        offset: 1,
        size: 100,
      };
      const { data } = await fetchShareVaild(params);
      const list = data.dataList;
      this.shareName = list[0].name + "...";
      this.setList(list);
      this.showFileList = true;
      this.$router.push({ query: { ...this.$route.query, code: code } });
    },
    async getList(path) {
      this.curFolder = path;
      const params = {
        shareId: this.$route.params.id,
        relativePath: path,
        delimiter: "/",
        offset: 1,
        size: 100,
      };
      if (this.loading === false) {
        this.loading = true;
      }
      const { data } = await fetchShareList(params);
      this.setList(data);
    },
    setList(list) {
      this.rows = list.map((it, index) => {
        const prefix = it.type == "Folder";
        let name = it.path.replace(this.curFolder, "");
        let type = this.$bucket.getType(name);
        if (prefix) {
          type = "folder";
          name = it.name;
        }
        return {
          ...it,
          prefix,
          sizeUnit: this.$bucket.getFileSize(it.size),
          name,
          type,
          key: index,
        };
      });
      this.loading = false;
    },
    onRowClick({ row, index }) {
      if (!row.prefix) {
        return;
      }
      this.loading = index;
      this.getList(row.path);
    },
    onRowCheck({ key }) {
      const idx = this.checked.indexOf(key);
      if (idx == -1) {
        this.checked.push(key);
      } else {
        this.checked.splice(idx, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.share-box {
  background-color: #000;
  height: calc(100vh - 64px);
  .share {
    padding: 24px;
    display: flex;
    height: 100%;
    .share-left {
      width: 330px;
      height: 100%;
      border-radius: 16px;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      overflow: hidden;

      .top-img {
        position: absolute;
        top: 0;
        left: 0;
      }
      .bottom-img {
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .left-content {
        text-align: center;
        padding: 0 24px;
        z-index: 99;
        .user-info {
          padding-bottom: 24px;
          border-bottom: 1px solid #334155;
          margin-bottom: 24px;
          .user-header {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            margin-bottom: 8px;
          }
          .user-name {
            color: #fff;
            font-family: SF Pro Text;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
          }
          .user-account {
            color: #cbd5e1;
            font-family: SF Pro Text;
            font-size: 14px;
            font-weight: 400;
          }
        }
        .uncode {
          .valid-code {
            display: flex;
            width: 100%;
            height: 40px;
            padding: 12px 40px;
            justify-content: center;
            align-items: center;
            border-radius: 25px;
            background: #fff;
            &::placeholder {
              color: #94a3b8;
              font-family: SF Pro Text;
              font-size: 14px;
              font-weight: 400;
            }
          }
          .valid-btn {
            width: 100%;
            height: 40px;
            border-radius: 24px;
            color: #0f172a;
            font-family: SF Pro Text;
            font-size: 16px;
            font-weight: 700;
            line-height: 18px; /* 112.5% */
            margin-top: 16px;
          }
        }
        .stone-info {
          display: flex;
          padding: 16px;
          gap: 8px;
          border-radius: 12px;
          border: 1px solid #334155;
          max-width: 282px;
          .stone-name {
            word-break: break-all;
            color: #fff;
            font-family: SF Pro Text;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px; /* 112.5% */
            text-align: right;
          }
        }
      }
    }
    .share-right {
      width: 100%;
      height: 100%;
      margin-left: 24px;
      flex: 1;
      .list-box {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        background: #0f172a;
        overflow: hidden;
        .list-top {
          padding: 24px;
          border-bottom: 1px solid #334155;
          .share-info {
            display: flex;
            align-items: center;
            gap: 16px;
            color: #fff;
            font-family: SF Pro Text;
            font-size: 32px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            margin-bottom: 16px;
          }
          .share-time {
            display: flex;
            align-items: center;
            color: #cbd5e1;
            font-family: SF Pro Text;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
          }
        }
        .list-bottom {
          padding: 24px;
          height: 100%;
          .list-scroll {
            overflow: scroll;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

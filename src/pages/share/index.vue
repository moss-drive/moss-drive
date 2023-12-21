<template>
  <div class="share-box">
    <div class="share">
      <div class="share-left">
        <q-img class="top-img" width="100%" src="@/assets/imgs/share/left-top.png" />
        <div class="left-content">
          <div class="user-info" v-if="userInfo">
            <q-img
              v-if="userInfo.twitterAvatar"
              class="user-header"
              :src="userInfo.twitterAvatar"
            />
            <m-avatar
              v-else-if="!userInfo.twitterUsername && userInfo.address"
              class="address-header"
              :hash="userInfo.address"
              size="64"
            ></m-avatar>
            <div v-else class="no-header">{{ userInfo.firstLetter }}</div>
            <div class="user-name">{{ userInfo.twitterName || setAddr(userInfo.address) }}</div>
            <div class="user-account" v-if="userInfo.twitterUsername">
              @{{ userInfo.twitterUsername }}
            </div>
            <div class="user-desc">{{ userInfo.twitterDesc }}</div>
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
          <div class="stone-info" v-if="stoneInfo">
            <div class="stone-cover">
              <q-img :src="stoneInfo.avatar" width="120px" :ratio="1" />
            </div>
            <div class="stone-name">
              <div class="ta-l stone-text">
                {{ stoneInfo.stoneName }}
              </div>
              <q-btn round class="mt-2">
                <q-avatar size="40px" @click="goStone(stoneInfo.id)">
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
              <div class="file-name">{{ shareName }}</div>
            </div>
            <div class="share-time">
              <q-img
                src="@/assets/imgs/share/clock.png"
                width="24px"
                style="margin-right: 8px"
              ></q-img>
              <span style="margin-right: 24px">{{ createdTime }}</span>
              <span v-if="!expirationTime > 30">Expiration time: {{ expirationTime }} days</span>
            </div>
          </div>
          <div class="list-bottom">
            <div class="mb-4">
              <q-checkbox
                class="mr-4"
                size="40px"
                :label="checked.length + ` selected`"
                v-model="checkAll"
                indeterminate-value="not-empty"
              />
              <q-btn
                v-show="checked.length > 0"
                class="valid-btn"
                rounded
                color="primary"
                @click="saveToStone"
              >
                <q-icon left size="24px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M11.5 18L14 15.5M14 15.5L11.5 13M14 15.5H8"
                      stroke="#0F172A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19.247 15.0039L20.8887 16.0702V16.0726C22.9365 17.4001 21.9674 20.5 19.5036 20.5H4.49378C4.49129 20.5 4.49378 20.5 4.49129 20.5C4.48879 20.5 4.4888 20.5 4.4888 20.5C3.92328 20.5 3.41755 20.3211 3.01148 20.0261C2.11214 19.3756 1.70607 18.1618 2.2367 17.0592L3.96065 13.4684C4.01795 13.3475 4.08023 13.2314 4.145 13.1178M19.247 15.0039L19.6605 14.143L19.7328 13.9931C20.2933 12.8252 19.81 11.4373 18.6341 10.84C17.7049 10.3685 16.6187 10.5257 15.8713 11.1447L16.1728 10.516L16.245 10.3661C16.8055 9.19819 16.3222 7.81025 15.1464 7.213C14.1548 6.71006 12.9815 6.92526 12.2366 7.65066L12.5106 7.07759L12.5829 6.92768C13.1434 5.75978 12.6601 4.37183 11.4842 3.77459C10.2286 3.13865 8.67908 3.64643 8.08367 4.89413L4.145 13.1178M19.247 15.0039L17.7021 14.0552M4.145 13.1178C6.09091 11.1053 7.45455 10.5759 7.45455 10.5759"
                      stroke="#0F172A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </q-icon>
                <div>Save to My Moss</div>
              </q-btn>
            </div>
            <q-breadcrumbs gutter="sm">
              <q-breadcrumbs-el :label="`Files`" :to="basePath" @click.prevent="goPath('')" />
              <q-breadcrumbs-el
                v-for="it in breadLinks"
                :key="it.folder"
                :label="it.label"
                :to="basePath"
                @click.prevent="goPath(it.folder)"
              />
            </q-breadcrumbs>
            <div id="fileList" class="list-scroll">
              <q-infinite-scroll
                ref="scrollBox"
                @load="onLoad"
                :offset="250"
                scroll-target="#fileList"
                :disable="scrollDisable"
              >
                <grid-list
                  v-if="showGrid"
                  :rows="rows"
                  :loading="loading"
                  :checked="checked"
                  selection="multiple"
                  @row-check="onRowCheck"
                  @row-click="onRowClick"
                ></grid-list>
                <template v-slot:loading>
                  <div
                    class="row justify-center q-my-md"
                    v-if="curFolder != '' && rows.length >= pageSize"
                  >
                    <q-spinner-ios color="yellow" size="30px" />
                  </div>
                </template>
              </q-infinite-scroll>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="showLogin">
      <q-card class="login-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="fz-16">Sign in</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <wallet-connect @login="afterLogin" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <act-move ref="move" :check-list="checked" :moveFunc="onSave" />
  </div>
</template>
<script setup>
import ActMove from "@/pages/drive/check-act/act-move.vue";
import WalletConnect from "@/pages/login/wallet-connect.vue";
</script>

<script>
import { mapState } from "vuex";

import { fetchShare, fetchShareVaild, fetchShareList, fetchStoneSave } from "@/api/share.js";

export default {
  name: "ShareIndex",
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
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
  watch: {
    checkAll(val) {
      if (val == "not-empty") return;
      if (val) this.checked = this.rows.map((it) => it.key);
      else this.checked = [];
    },
    "checked.length"(len) {
      let isAll = len == this.rows.length && this.rows.length != 0;
      if (!isAll && len > 0) isAll = "not-empty";
      this.checkAll = isAll;
    },
  },
  data() {
    return {
      loading: false,
      rows: [],
      tempRows: [],
      checkAll: false,
      checked: [],
      userInfo: {},
      code: "",
      showFileList: false,
      showGrid: false,
      curFolder: "",
      shareName: "",
      stoneInfo: null,
      showLogin: false,
      scrollDisable: false,
      pageSize: 100,
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.getShare();
    },
    async getShare() {
      const params = {
        id: this.$route.params.id,
      };
      const { data } = await fetchShare(params);
      data.firstLetter = data.twitterUsername?.substring(0, 1).toUpperCase();
      this.userInfo = data;
      if (data.expire) {
        window.$alert("Oh dear, you're late, this sharing page has already expired.");
        return;
      } else if (data.valid) {
        const code = this.$route.query.code;
        if (code) {
          this.code = code;
          this.showFileList = true;
        }
        return;
      } else {
        this.showFileList = true;
      }
    },
    async onLoad(index, done) {
      if (this.loading === false) {
        this.loading = true;
      }
      if (this.curFolder == "") {
        await this.getVaild();
      } else {
        await this.getMore();
      }
      done();
    },
    async goPath(path) {
      this.curFolder = path;
      this.$refs.scrollBox.reset();
      this.$refs.scrollBox.trigger();
      this.scrollDisable = false;
      this.tempRows = [];
      this.checked = [];
    },
    async getVaild() {
      const code = this.code;
      const params = {
        id: this.$route.params.id,
        delimiter: "/",
        code: code,
        startAfter: "",
        size: this.pageSize,
      };
      const { data } = await fetchShareVaild(params);
      const list = data.dataList;
      if (list.length < this.pageSize) {
        this.scrollDisable = true;
      }
      const createdTime = new Date(data.createdAt * 1000).toUTCString();
      const stoneList = data.stoneList;
      if (stoneList.length > 0) {
        this.stoneInfo = stoneList[0];
      }
      this.createdTime = createdTime;
      this.setList(list);
      this.handlerDateDurationCurrent(data.expireAt);
      let shareName = list[0].name;
      if (shareName.length > 12) {
        shareName = shareName.substring(0, 12);
      }
      this.shareName = shareName + "...";
      this.showFileList = true;
      this.$router.push({ query: { ...this.$route.query, code: code } });
    },
    async getMore() {
      let path = this.curFolder;
      let startAfter = "";
      if (this.tempRows.length > 0) {
        startAfter = this.tempRows.slice(-1)[0].path;
      }
      const params = {
        shareId: this.$route.params.id,
        relativePath: path,
        delimiter: "/",
        startAfter: startAfter,
        size: this.pageSize,
      };
      if (this.loading === false) {
        this.loading = true;
      }
      const { data } = await fetchShareList(params);
      if (data.length < this.pageSize) {
        this.scrollDisable = true;
      } else {
        this.scrollDisable = false;
      }
      this.checked = [];
      this.setList(data);
    },
    setList(list) {
      const addList = list.map((it, index) => {
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
      this.tempRows.push(...addList);
      this.rows = this.tempRows;
      this.loading = false;
      this.showGrid = true;
    },

    goStone(id) {
      this.$router.push({ path: "/mossy/stone", query: { id: id } });
    },
    onRowClick({ row, index }) {
      if (!row.prefix) {
        return;
      }
      this.loading = index;
      this.goPath(row.path);
    },
    onRowCheck({ key }) {
      const idx = this.checked.indexOf(key);
      if (idx == -1) {
        this.checked.push(key);
      } else {
        this.checked.splice(idx, 1);
      }
    },
    handlerDateDurationCurrent(expireAt) {
      let now = new Date().getTime();
      let cha = Math.abs(expireAt * 1000 - now);
      let days = parseInt(cha / (24 * 60 * 60 * 1000));
      let hours = parseInt((cha % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      let mins = parseInt((cha % (60 * 60 * 1000)) / (60 * 1000));
      this.expirationTime = days;
    },
    async saveToStone() {
      if (!this.uid) {
        this.showLogin = true;
        localStorage.loginTo = this.$route.fullPath;
        return;
      } else {
        this.$refs.move.showPop = true;
      }
    },
    async onSave(path) {
      let paths = [];
      let result = this.rows.filter((item) => {
        return this.checked.some((curVal) => curVal === item.key);
      });
      result.forEach((item) => {
        paths.push(item.path);
      });
      const bucketName = localStorage.moss_bucket;
      const params = {
        toBucketName: bucketName,
        toFolderPath: path,
        type: "SHARE",
        paths: paths,
        shareId: this.$route.params.id,
      };
      const { data } = await fetchStoneSave(params);
    },
    afterLogin() {
      this.showLogin = false;
    },
    setAddr(addr = "") {
      return addr.substr(0, 6) + "..." + addr.substr(addr.length - 4, 4);
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
      flex: 0 0 330px;
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
          .address-header {
            display: flex;
            justify-content: center;
            margin-bottom: 8px;
          }
          .no-header {
            width: 64px;
            height: 64px;
            line-height: 64px;
            border-radius: 50%;
            background-color: #7e4fed;
            color: #fff;
            text-align: center;
            font-size: 28px;
            margin: 0 auto;
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
          .user-desc {
            color: #fff;
            text-align: center;
            font-family: SF Pro Text;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
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
          gap: 16px;
          border-radius: 12px;
          border: 1px solid #334155;
          max-width: 282px;
          .stone-name {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            word-break: break-all;
            color: #fff;
            font-family: SF Pro Text;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px; /* 112.5% */
            text-align: right;
            .stone-text {
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
            }
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
        display: flex;
        flex-direction: column;
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
            .file-name {
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
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
          overflow: hidden;
          flex: 1;
          .list-scroll {
            max-height: 100%;
            overflow: auto;
            padding-bottom: 50px;
          }
        }
      }
    }
  }
}
.login-dialog {
  width: 400px;
  height: 152px;
  text-align: center;
  .connect-btn {
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
</style>

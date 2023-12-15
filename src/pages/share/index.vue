<template>
  <div class="share-box">
    <div class="share">
      <div class="share-left">
        <q-img class="top-img" width="100%" src="@/assets/imgs/share/left-top.png" />
        <div class="left-content">
          <div class="user-info">
            <q-img class="user-header" src="https://cdn.quasar.dev/img/parallax2.jpg" />
            <div class="user-name">Yan Meng @ Solv Protocol | ERC-3525 ERC-3525 ERC-3</div>
            <div class="user-account">@YanMengSolvvvvv</div>
          </div>
          <div class="uncode">
            <q-form>
              <input class="valid-code" type="text" placeholder="Please enter the retrieval code" />
              <div>
                <q-btn class="valid-btn" label="Retrieve The File" color="primary" />
              </div>
            </q-form>
          </div>
        </div>
        <q-img class="bottom-img" width="100%" src="@/assets/imgs/share/left-bottom.png" />
      </div>
      <div class="share-right">
        <div class="list-box">
          <div></div>
          <div>
            <q-checkbox
              class="mr-4"
              size="40px"
              :label="checked.length + ` selected`"
              v-model="checkAll"
              indeterminate-value="not-empty"
            />
            <grid-list
              :rows="rows"
              :loading="loading"
              :checked="checked"
              selection="multiple"
              @row-check="onRowCheck"
            ></grid-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchShare, fetchShareVaild } from "@/api/share.js";

const aaa = [
  {
    name: "4everNFT",
    type: "File",
    size: "21741",
    path: "1.png",
    lastModified: 1702523062195,
  },
  {
    name: "4everNFT",
    type: "File",
    size: "21741",
    path: "3.png",
    lastModified: 1702523062168,
  },
  {
    name: "4everNFT",
    type: "File",
    size: "21741",
    path: "4.png",
    lastModified: 1702523062175,
  },
  {
    name: "4everNFT",
    type: "File",
    size: "21741",
    path: "5.png",
    lastModified: 1702523062172,
  },
  {
    name: "333",
    type: "Folder",
    size: "",
    path: "333/",
    lastModified: 0,
  },
];
export default {
  name: "ShareIndex",

  data() {
    return {
      loading: false,
      rows: [],
      checkAll: false,
      checked: [],
    };
  },

  mounted() {
    this.list();
    // this.init();
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
      if (data.expire) {
        console.log("expire");
        return;
      } else if (data.valid) {
        console.log("need valid");
        return;
      } else {
        this.getVaild();
      }
    },
    async getVaild() {
      const params = {
        delimiter: "/",
        code: "",
      };
      const { data } = fetchShareVaild(params);
    },
    list() {
      this.rows = aaa.map((it, index) => {
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
      }
    }
    .share-right {
      width: 100%;
      height: 100%;
      margin-left: 24px;
      .list-box {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        background: #0f172a;
      }
    }
  }
}
</style>

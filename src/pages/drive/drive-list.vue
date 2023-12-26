<style lang="scss">
.in-move-act {
  .q-breadcrumbs .text-primary {
    color: rgba(255, 255, 255, 0.4) !important;
  }
  .file-item {
    opacity: 0.7;
    pointer-events: none;
  }
  thead tr:first-child {
    height: 5px;
    th {
      display: none;
    }
  }
}
</style>

<script setup>
import FilePreview from "./preview/preview-index.vue";
</script>

<template>
  <div class="mt-9 ta-c" v-if="loadErr">
    <p class="op-8 mb-3">{{ loadErr }}</p>
    <q-btn color="info" @click="initBucket()" :loading="objLoading">Retry</q-btn>
  </div>
  <div class="q-pa-md" v-else-if="!isCreated">
    <div class="pa-2" style="width: 200px">
      <q-skeleton type="text" class="text-subtitle1" />
      <q-skeleton type="text" width="50%" class="text-subtitle1 mt-6 mb-6" />
    </div>
    <grid-loading v-if="isPage" />
  </div>

  <template v-else>
    <div class="pa-3 pb-0 pos-s z-100" style="top: 72px" v-if="isPage">
      <div class="al-c">
        <q-checkbox
          :disable="objLoading !== false"
          class="mr-4"
          size="40px"
          :label="checked.length + ` selected`"
          v-model="checkAll"
          indeterminate-value="not-empty"
        />

        <slot
          name="act"
          :checked="checked"
          :obj-list="objRows"
          :stone-num="stoneList.length"
        ></slot>

        <div class="pos-r ml-auto mr-2 bd-1">
          <icon-search class="y-center ev-n" style="left: 10px" />
          <input
            v-model="searchKey"
            type="text"
            placeholder="Search"
            class="bdrs-100 w100p top-search"
            :class="searchKey ? 'bg-info' : 'bg-info'"
          />
        </div>
        <div class="">
          <q-btn round flat @click="showMode = modeIcon">
            <img :src="`/img/driver/mode-${modeIcon}.svg`" width="20" />
          </q-btn>
        </div>
      </div>
    </div>
    <div :class="isPage ? 'q-pa-md' : 'in-move-act'">
      <div
        class="al-c"
        :class="isPage ? 'q-mt-md q-ml-sm' : 'pos-s z-100 q-dark '"
        style="top: 50px"
      >
        <q-breadcrumbs gutter="sm">
          <q-breadcrumbs-el
            :label="isPage ? 'All files' : 'My Drive'"
            to="/file"
            @click.prevent="goPath('/file')"
          />
          <q-breadcrumbs-el
            v-for="it in breadLinks"
            :key="it.to"
            :label="it.label"
            :to="it.to"
            @click.prevent="goPath(it.to)"
          />
        </q-breadcrumbs>
        <q-spinner-ios v-show="objLoading === true" class="ml-3" color="yellow" size="15px" />
      </div>

      <div class="q-mt-md">
        <empty-stone
          v-if="objLoading === false && objList.length == 0"
          :desc="searchKey ? `No results for &quot;${searchKey}&quot;` : ''"
        />
        <q-infinite-scroll v-else @load="onLoad" :disable="objLoading !== false || !objNextToken">
          <component
            :is="showMode + '-list'"
            :isPage="isPage"
            :selection="isPage ? 'multiple' : null"
            :rows="objRows"
            :loading="objLoading"
            :checked="checked"
            @row-click="onRowClick"
            @row-check="onRowCheck"
          />
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-ios color="yellow" size="30px" />
            </div>
          </template>
        </q-infinite-scroll>

        <div class="pa-8"></div>
      </div>
    </div>
    <file-preview v-model="showPreview" :list="fileList" :current="fileIdx" />
  </template>
</template>

<script>
import mixin from "./drive-list.js";
import { mapState } from "vuex";
import TableList from "./table-list.vue";

export default {
  emits: ["update:prefix", "refresh", "error"],
  mixins: [mixin],
  props: {
    isPage: Boolean,
    prefix: String,
  },
  components: {
    TableList,
  },
  data() {
    return {
      bucketName: null,
      objList: [],
      objLoading: false,
      objNextToken: null,
      loadErr: "",
      showPreview: false,
      fileIdx: -1,
      showMode: this.isPage ? "grid" : "table",
      checkAll: false,
      checked: [],
      curPath: "/file",
      searchKey: "",
      stoneList: null,
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
    objRows() {
      const stoneList = this.stoneList || [];
      return this.objList.map((obj) => {
        const stone = stoneList.find((it) => {
          return it.folderPath == obj.key;
        });
        let { type } = obj;
        if (stone) type = "stone";
        let icon = `/img/driver/icon_${type}.png`;
        if (type == "image" && obj.url && obj.size < 1024 * 500) {
          icon = obj.url;
        }
        return {
          ...obj,
          type,
          icon,
        };
      });
    },
    modeIcon() {
      return this.showMode == "grid" ? "table" : "grid";
    },
    path() {
      if (this.isPage) return this.$route.path;
      return this.curPath;
    },
    inDrive() {
      return this.path.startsWith("/file");
    },
    breadLinks() {
      let arr = this.path.split("/").slice(1);
      let to = "/" + arr[0];
      arr.splice(0, 1);
      return arr.map((seg) => {
        to += "/" + seg;
        return {
          label: decodeURIComponent(seg),
          to,
        };
      });
    },
    bucketPrefix() {
      return this.$bucket.getPrefixByPath(this.path);
    },
    fileList() {
      return this.objList.filter((it) => !it.prefix);
    },
  },
  watch: {
    path() {
      this.searchKey = "";
      if (this.$bucket.client) {
        this.getList();
      }
    },
    searchKey() {
      this.getList();
    },
    checkAll(val) {
      if (val == "not-empty") return;
      if (val) this.checked = this.objList.map((it) => it.key);
      else this.checked = [];
    },
    "checked.length"(len) {
      let isAll = len == this.objList.length;
      if (!isAll && len > 0) isAll = "not-empty";
      this.checkAll = isAll;
    },
    bucketPrefix(val) {
      this.$emit("update:prefix", val);
    },
    prefix(val) {
      if (val != this.bucketPrefix && val.includes(this.bucketPrefix)) {
        const folder = val.replace(this.bucketPrefix, "").replace("/", "");
        this.goNext(folder);
      }
    },
  },
  created() {
    this.initBucket();
    this.$bus.on("drive-refresh", () => {
      this.getList();
    });
    this.$bus.on("stone-created", () => {
      this.getStoneList();
    });
  },
  methods: {
    goPath(to) {
      if (this.isPage) {
        const method = this.$q.platform.has.touch ? "replace" : "push";
        this.$router[method](to);
      } else {
        this.curPath = to;
      }
    },
    goNext(folder) {
      this.goPath(this.path + "/" + folder);
    },
    onRowCheck({ key }) {
      const idx = this.checked.indexOf(key);
      if (idx == -1) {
        this.checked.push(key);
      } else {
        this.checked.splice(idx, 1);
      }
    },
    onRowClick({ row, index }) {
      if (row.prefix) {
        if (this.objLoading !== false) return;
        this.objLoading = index;
        this.goNext(row.name);
        return;
      }
      this.fileIdx = this.fileList.findIndex((it) => it.url == row.url);
      this.showPreview = true;
    },
    async getStoneList() {
      if (!this.uid) return;
      const { data } = await this.$http.get("/stone");
      this.stoneList = data;
    },
    async onLoad(index, done) {
      console.log(index);
      await this.getList(true);
      done();
    },
    async getList(isMore) {
      try {
        if (!this.stoneList) {
          await this.getStoneList();
        }
        const Prefix = decodeURIComponent(this.bucketPrefix);
        const params = {
          Bucket: this.bucketName,
          folder: Prefix,
          Prefix,
          Delimiter: "/",
          MaxKeys: 120,
        };
        if (isMore) {
          params.ContinuationToken = this.objNextToken;
        } else {
          this.checked = [];
          if (this.objLoading === false) {
            this.objLoading = true;
          }
        }
        if (this.isPage) {
          if (this.searchKey) {
            params.Prefix += this.searchKey;
          } else {
            this.$bucket.listParams = params;
          }
        }
        const data = await this.$bucket.listObjects(params);
        if (data.params.Prefix == params.Prefix) {
          if (isMore) {
            this.objList = this.objList.concat(data.rows);
          } else {
            this.objList = data.rows;
            this.objLoading = false;
          }
          this.loadErr = "";
          this.objNextToken = data.nextToken;
        }
      } catch (error) {
        console.log(error);
        this.loadErr = error.message;
        if (/Access/i.test(this.loadErr)) {
          this.$emit("error", error);
        }
        if (isMore) {
          window.$toast(this.loadErr);
        }
        this.objLoading = false;
      }
      if (!isMore) {
        this.$emit("refresh");
      }
    },
  },
};
</script>

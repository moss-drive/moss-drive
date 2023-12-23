<script setup>
import ActMove from "../../drive/check-act/act-move.vue";
</script>

<template>
  <act-move ref="move" :check-list="[]" :move-func="onSave"></act-move>

  <div>
    <div class="m-3">
      <!-- <q-skeleton type="title" v-if="notBuy" width="150px" /> -->
      <div class="al-c" v-if="balance">
        <q-checkbox
          :disable="loading"
          class="mr-4"
          size="40px"
          :label="checked.length + ` selected`"
          v-model="checkAll"
          indeterminate-value="not-empty"
        />
        <q-btn
          v-show="checked.length"
          color="primary"
          rounded
          class="ml-3"
          @click="$refs.move.showPop = true"
        >
          <img src="/img/stone/stone-save.svg" width="18" class="mr-2" />
          <span>Save to My Moss</span>
        </q-btn>
      </div>
      <div class="al-c ml-3 mt-3">
        <q-breadcrumbs gutter="sm">
          <q-breadcrumbs-el :label="`Files`" :to="basePath" @click.prevent="curFolder = ''" />
          <q-breadcrumbs-el
            v-for="it in breadLinks"
            :key="it.folder"
            :label="it.label"
            :to="basePath"
            @click.prevent="curFolder = it.folder"
          />
        </q-breadcrumbs>
        <q-spinner-ios v-show="loading === true" class="ml-3" color="yellow" size="15px" />
      </div>
    </div>
    <div class="pa-3">
      <div v-if="notBuy">
        <empty-stone img="stone-lock" desc="Buy Stone Key to view files" />
      </div>
      <q-infinite-scroll v-else @load="onLoad" :disable="loading !== false || noMore">
        <grid-list
          :rows="rows"
          :checked="checked"
          selection="multiple"
          :loading="loading"
          @row-click="onRow"
          @row-check="onCheck"
        ></grid-list>
      </q-infinite-scroll>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    id: null,
    stoneId: null,
    balance: null,
  },
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
    notBuy() {
      return !this.balance;
    },
  },
  data() {
    return {
      curFolder: "",
      rows: null,
      loading: false,
      checked: [],
      checkAll: false,
      noMore: false,
      page: 1,
    };
  },
  watch: {
    checkAll(val) {
      if (val == "not-empty") return;
      if (val) this.checked = this.rows.map((it) => it.key);
      else this.checked = [];
    },
    "checked.length"(len) {
      let isAll = len == this.rows.length;
      if (!isAll && len > 0) isAll = "not-empty";
      this.checkAll = isAll;
    },
    curFolder() {
      this.getList();
    },
    balance() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async onLoad(index, done) {
      console.log(index);
      await this.getList(true);
      done();
    },
    onCheck(row) {
      const idx = this.checked.indexOf(row.key);
      if (idx == -1) this.checked.push(row.key);
      else this.checked.splice(idx, 1);
      console.log(this.checked);
    },
    async onSave({ prefix }) {
      const { data } = await this.$http.post("/stone/save", {
        toBucketName: this.$bucket.defBucket,
        toFolderPath: prefix,
        type: "STONE",
        stoneId: this.stoneId,
        paths: this.checked,
      });
      return data.count;
    },
    onRow({ row, index }) {
      if (!row.prefix) {
        this.onCheck(row);
        return;
      }
      this.loading = index;
      this.curFolder = row.path;
    },

    async getList(isMore) {
      if (!this.balance) return;
      try {
        const params = {
          stoneId: this.stoneId,
          relativePath: this.curFolder,
          delimiter: "/",
        };
        if (isMore) {
          params.startAfter = this.rows[this.rows.length - 1].path;
        } else {
          this.noMore = false;
          this.checked = [];
          if (this.loading === false) {
            this.loading = true;
          }
        }
        const { data } = await this.$http.get("/stone/page/list", {
          params,
        });
        const rows = data.map((it) => {
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
            key: it.path,
            name,
            type,
          };
        });
        if (!rows.length) this.noMore = true;
        if (isMore) {
          this.rows = this.rows.concat(rows);
        } else {
          this.rows = rows;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>

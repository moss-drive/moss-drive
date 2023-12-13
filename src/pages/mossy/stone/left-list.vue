<template>
  <div>
    <div class="m-5 al-c">
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
    <empty-stone v-if="!rows.length && !loading" />
    <grid-list v-else :rows="rows" :loading="loading" @row-click="onRow"></grid-list>
  </div>
</template>

<script>
export default {
  props: {
    id: null,
  },
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
      curFolder: "",
      rows: [],
      loading: false,
    };
  },
  watch: {
    curFolder() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    onRow({ row, index }) {
      if (!row.prefix) {
        return;
      }
      this.loading = index;
      this.curFolder = row.path;
    },
    async getList() {
      try {
        if (this.loading === false) {
          this.loading = true;
        }
        const { data } = await this.$http.get("/stone/page/list", {
          params: {
            stoneId: this.id,
            relativePath: this.curFolder,
            delimiter: "/",
          },
        });
        this.rows = data.map((it) => {
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
          };
        });
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>
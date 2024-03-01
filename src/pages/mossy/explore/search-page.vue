<template>
  <div class="pos-r search-page px-6">
    <div class="pos-r mt-5 al-c search-container bdrs-100">
      <img src="/img/mossy/ic-search-white.svg" width="24" class="y-center" style="left: 8px" />
      <input
        class="m-search"
        type="text"
        id="searchIpt"
        v-model="searchKey"
        @keyup.enter="handleEnter"
        placeholder="Enter stone keywords"
      />
      <img
        class="ml-auto cursor-p"
        @click="handleBack"
        width="24"
        src="/img/mossy/ic-close.svg"
        alt=""
      />
    </div>
    <div class="search-info fw-b fz-14 mt-6">Search results for "{{ searchKey }}"</div>

    <q-infinite-scroll @load="onLoad" :offset="250" :disable="curRows.length < size">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="stoneId"
        virtual-scroll
        hide-pagination
        :pagination="{ rowsPerPage: -1 }"
        :loading="tableLoading"
      >
        <template v-slot:no-data>
          <empty-component
            style="padding-top: 20px"
            width="280"
            :emptyImg="emptyImg"
            message="Nothing to see here, just lots of nada!"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" @click="onRow(props.row, props.rowIndex)">
            <q-td key="stoneId" :props="props">
              <span class="fz-14" style="color: #1eefa4"> #{{ props.row.stoneId }}</span>
            </q-td>
            <q-td key="stoneName" :props="props">
              <div class="al-c">
                <div class="stone-cover my-4">
                  <q-img :src="props.row.stoneAvatar" width="64px" :ratio="1" />
                </div>
                <span class="ml-4 fz-14 fw-b">
                  {{ props.row.stoneName }}
                </span>
              </div>
            </q-td>
            <q-td key="twitterName" :props="props">
              <img class="avatar mr-1" width="24" :src="props.row.twitterAvatar" alt="" />
              <span class="fz-14">
                {{ props.row.twitterName }}
              </span>
            </q-td>
            <q-td key="chainId" :props="props">
              <net-icon :chainId="props.row.chainId" :size="18" class="mr-2" />
            </q-td>
            <q-td key="arrow" :props="props">
              <img width="24" src="/img/mossy/icon/arrows.svg" alt="" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <!-- <div class="pos-a no-data" v-else>
      <img src="/img/mossy/search-no-data.png" width="280" alt="" />
      <div class="fz-14 ta-c">Nothing to see here, just lots of nada!</div>
    </div> -->
  </div>
</template>

<script>
import { debounce } from "@/utils/helper";
import emptyImg from "/img/stone/search-no-data.png";

export default {
  data() {
    return {
      columns: [
        {
          name: "stoneId",
          label: "Stone ID",
          align: "left",
          field: "stoneId",
        },
        {
          name: "stoneName",
          label: "Stone Name",
          align: "left",
          field: "stoneName",
        },
        {
          name: "twitterName",
          align: "left",
          label: "Author",
          field: "twitterName",
        },
        { name: "chainId", align: "left", label: "Network", field: "chainId" },
        {
          name: "arrow",
          align: "left",
          label: "",
          field: "arrow",
        },
      ],
      rows: [],
      curRows: [],
      tableLoading: false,
      searchKey: "",
      page: 1,
      size: 10,
      emptyImg: emptyImg,
    };
  },
  created() {
    this.searchKey = this.$route.query.w;
    this.handleEnter();
  },
  methods: {
    async onLoad(index, done) {
      await this.handleSearch();
      done();
    },
    handleEnter() {
      if (!this.searchKey) return this.handleBack();
      this.$router.replace(`/mossy/search?w=${this.searchKey}`);
      this.page = 1;
      this.curRows = this.rows = [];
      debounce(() => {
        this.handleSearch();
      });
    },
    async handleSearch() {
      this.tableLoading = true;
      try {
        const { data } = await this.$http.get("/stone/search", {
          params: {
            keyword: this.searchKey,
            page: this.page,
            size: this.size,
          },
        });
        this.curRows = data;
        if (!data) return (this.curRows = []);
        this.rows = this.rows.concat(data);
        this.page++;
      } catch (error) {
        console.log(error);
        this.curRows = [];
      }
      this.tableLoading = false;
    },
    onRow(it) {
      window.open(location.origin + `/${it.stoneId}?chainId=${it.chainId}`);
    },
    handleBack() {
      this.searchKey = "";
      this.$router.push("/mossy");
    },
  },
};
</script>

<style lang="scss" scoped>
.q-table__container {
  box-shadow: none;
  td {
    font-size: 20px;
  }
}
.search-container {
  width: 50%;
  min-width: 350px;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #334155;
  .m-search {
    padding-left: 28px;
    width: 100%;
    font-size: 14px;
    line-height: 16px;
    color: #fff;
    background: #000;
  }
}
.avatar {
  vertical-align: bottom;
  border-radius: 33px;
  border: 0.5px solid rgba(255, 255, 255, 0.25);
}

.search-info {
  color: #cbd5e1;
}
.no-data {
  left: 50%;
  top: 150%;
  transform: translateX(-50%);
}
</style>

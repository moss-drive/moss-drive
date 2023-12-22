<template>
  <div class="q-pa-md">
    <q-table
      :loading="loading"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      flat
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <!-- <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template> -->

      <template v-slot:body="props">
        <q-tr :props="props" class="ta-tr" @click="goStone(props.row, props.rowIndex)">
          <q-td key="stoneName" :props="props">
            <div class="stone-name-td">
              <div class="stone-cover">
                <q-img :src="props.row.stoneAvatar" width="64px" :ratio="1" />
              </div>
              <div class="stoneName">
                {{ props.row.stoneName }}
              </div>
            </div>
          </q-td>
          <q-td key="author" :props="props">
            <div>
              <q-avatar size="24px" class="mr-1">
                <img :src="props.row.avatar" />
              </q-avatar>
              {{ props.row.author }}
            </div>
          </q-td>
          <q-td key="currentPrice" :props="props">
            {{ props.row.price / 1e18 + " ETH" }}
          </q-td>
          <q-td key="holdings" :props="props">
            {{ props.row.holding }}
          </q-td>
          <q-td key="action" :props="props" style="width: 50px">
            <q-icon size="24px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </q-icon>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data>
        <empty-component
          style="padding-top: 120px"
          width="280"
          :emptyImg="emptyImg"
          :message="emptyMessage"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
import { fetchCollections } from "@/api/collection.js";
import emptyImg from "/img/stone/default-empty.png";

const columns = [
  { name: "stoneName", align: "left", label: "Stone Name", field: "stoneName", sortable: false },
  { name: "author", align: "left", label: "Author", field: "author", sortable: false },
  {
    name: "currentPrice",
    align: "left",
    label: "Current Price",
    field: "currentPrice",
    sortable: false,
  },
  { name: "holdings", align: "left", label: "Holdings", field: "holdings", sortable: false },
  { name: "action", align: "left", label: "", field: "action", sortable: false },
];

export default {
  data() {
    return {
      loading: false,
      columns,
      rows: [],
      emptyImg,
      emptyMessage: "As empty as a cloudless sky",
      page: 1,
      size: 10,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const params = {
        page: this.page,
        size: this.size,
      };
      const { data } = await fetchCollections(params);
      data.forEach((row, index) => {
        row.index = index + 1;
      });
      this.rows = data;
    },
    onScroll() {
      return;
      const data = this.rows;
      data.push({
        stoneName: "1213",
        createdAt: 1702279706539,
        action: "SOLD",
        value: 44,
        txHash: "Ox222...222",
      });
      data.forEach((row, index) => {
        row.index = index + 1;
      });
      this.rows = data;
      console.log("loading");
    },
    // onScroll({ to, ref }) {
    //   const lastIndex = rows.value.length - 1;

    //   if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    //     loading.value = true;

    //     setTimeout(() => {
    //       nextPage.value++;
    //       nextTick(() => {
    //         ref.refresh();
    //         loading.value = false;
    //       });
    //     }, 500);
    //   }
    // },
    goStone(row, index) {
      // this.$router.push({ path: "/mossy/stone", query: { id: row.id } });

      window.open(`${window.location.origin}/mossy/stone?id=${row.id}`);
    },
  },
};
</script>

<style lang="scss"></style>

<style lang="scss" scoped>
.ta-tr {
  height: 96px;
  .q-td {
    color: #fff;
    font-family: SF Pro Text;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px; /* 114.286% */
  }
  .stone-name-td {
    height: 100%;
    display: flex;
    gap: 16px;
    align-items: center;
    font-weight: 700;
    line-height: 18px; /* 128.571% */
  }
}
</style>

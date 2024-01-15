<template>
  <div class="q-pa-md">
    <empty-component
      v-if="rows.length == 0"
      style="padding-top: 120px"
      width="280"
      :emptyImg="emptyImg"
      :message="emptyMessage"
    />
    <q-table
      v-else
      class="my-sticky-header-table"
      :loading="loading"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      flat
      hide-pagination
      :rows-per-page-options="[0]"
      virtual-scroll
      :virtual-scroll-slice-size="10"
      :virtual-scroll-sticky-size-start="48"
      @virtual-scroll="onScroll"
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
            {{ props.row.amounts + " ETH" }}
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
    </q-table>
  </div>
</template>

<script>
import { fetchCollections } from "@/api/collection.js";
import emptyImg from "/img/stone/default-empty.png";
import { BigNumber } from "ethers";

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
      size: 100,
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
      if (data.length < this.size) {
        this.hasNewPage = false;
      } else {
        this.hasNewPage = true;
      }
      data.forEach((row, index) => {
        let amounts = BigNumber.from(row.price) / 1e18;
        if (this.isOver6Decimals(amounts)) {
          amounts = amounts.toFixed(6);
        }
        row.index = index + 1;
        row.amounts = amounts;
      });
      this.rows.push(...data);
    },
    onScroll({ index, to, direction, ref }) {
      const lastIndex = this.rows.length - 1;
      if (!this.loading && this.hasNewPage && index === lastIndex) {
        this.page += 1;
        this.$nextTick(() => {
          this.getList();
        });
      }
    },
    goStone(row, index) {
      // this.$router.push({ path: "/mossy/stone", query: { id: row.id } });

      window.open(`${window.location.origin}/${row.stoneId}`);
    },
    isOver6Decimals(num) {
      return (num.toString().split(".")[1] || []).length > 6;
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
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 90vh
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #000

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>

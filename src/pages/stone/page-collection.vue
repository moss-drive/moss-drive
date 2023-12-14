<template>
  <div class="q-pa-md">
    <q-table
      title="Total 33 stones"
      :loading="loading"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      flat
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" class="ta-tr">
          <q-td key="stoneName" :props="props" class="stone-name-td">
            <div class="stone-cover">
              <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" width="64px" :ratio="1" />
            </div>
            <div class="stoneName">
              {{ props.row.stoneName }}
            </div>
          </q-td>
          <q-td key="author" :props="props">
            {{ props.row.author }}
          </q-td>
          <q-td key="averagePrice" :props="props">
            {{ props.row.averagePrice }}
          </q-td>
          <q-td key="currentPrice" :props="props">
            {{ props.row.currentPrice }}
          </q-td>
          <q-td key="holdings" :props="props">
            {{ props.row.holdings }}
          </q-td>
          <q-td key="action" :props="props"> > </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Well this is sad... {{ message }} </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "vue";

const columns = [
  { name: "stoneName", align: "left", label: "Stone Name", field: "stoneName", sortable: false },
  { name: "author", align: "left", label: "Author", field: "author", sortable: false },
  {
    name: "averagePrice",
    align: "left",
    label: "Average Price",
    field: "averagePrice",
    sortable: false,
  },
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

const rows = [
  {
    stoneName: "Frozen Yogurt",
    author: "Frozen",
    averagePrice: 6.0,
    currentPrice: 24,
    holdings: 4,
  },
];

export default {
  setup() {
    return {
      loading: false,
      filter: ref(""),
      selected: ref([]),
      columns,
      rows,
    };
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
    align-items: center;
    font-weight: 700;
    line-height: 18px; /* 128.571% */
  }
}
</style>

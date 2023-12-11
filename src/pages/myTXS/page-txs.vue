<template>
  <div class="q-pa-md">
    <q-table
      :loading="loading"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      flat
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props" class="ta-tr">
          <q-td key="index" :props="props">
            {{ props.row.index }}
          </q-td>
          <q-td key="stoneName" :props="props">
            {{ props.row.stoneName }}
          </q-td>
          <q-td key="createdAt" :props="props">
            {{ new Date(props.row.createdAt).toUTCString() }}
          </q-td>
          <q-td key="action" :props="props">
            {{ props.row.action }}
          </q-td>
          <q-td key="value" :props="props">
            {{ props.row.value }}
          </q-td>
          <q-td key="txHash" :props="props">
            <a href="" target="_blank">
              {{ props.row.txHash }}
            </a>
          </q-td>
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
import { fetchTransaction } from "@/api/txs.js";

const columns = [
  { name: "index", align: "left", label: "#", field: "index", sortable: false },
  { name: "stoneName", align: "left", label: "Stone Name", field: "stoneName", sortable: false },
  { name: "createdAt", align: "left", label: "Date", field: "createdAt", sortable: false },
  {
    name: "action",
    align: "left",
    label: "Action",
    field: "action",
    sortable: false,
  },
  {
    name: "value",
    align: "left",
    label: "Amounts",
    field: "value",
    sortable: false,
  },
  { name: "txHash", align: "left", label: "Tx Hash", field: "txHash", sortable: false },
];

const rows = [
  {
    stoneName: "ABCDEFGHIJKLMNOPQRSTUVWXYZABCD",
    createdAt: 1702279706539,
    action: "BOUGHT",
    value: 24,
    txHash: "Ox222...222",
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
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data } = await fetchTransaction();
    },
  },
};
</script>

<style lang="scss" scoped>
.ta-tr {
  .q-td {
    color: #fff;
    font-family: SF Pro Text;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 114.286% */
  }
}
</style>

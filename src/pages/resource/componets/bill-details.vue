<template>
  <div>
    <q-table
      title="Bill Details"
      title-class="bill-title"
      :rows="rows"
      :columns="columns"
      row-key="name"
      virtual-scroll
      hide-pagination
      :loading="tableLoading"
    >
      <template v-slot:no-data>
        <empty-component
          style="padding-top: 20px"
          width="280"
          :emptyImg="emptyImg"
          :message="emptyMessage"
        />
      </template>
    </q-table>
    <div class="pagination q-pa-lg flex flex-center">
      <q-pagination
        @update:model-value="change"
        v-model="curPage"
        color="teal"
        :max="totalPage"
        :max-pages="6"
        boundary-numbers
      />
    </div>
  </div>
</template>

<script>
import { fetchBillList } from "@/api/resource.js";
import { formatLand } from "../../../utils/helper";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import emptyImg from "/img/stone/default-empty.png";

export default {
  data() {
    return {
      columns: [
        {
          name: "txHash",
          required: true,
          label: "Tx Hash",
          align: "left",
          field: "txHash",
          format: (val) => `${val}`,
          style: "font-weight: bold; font-size: 14px;width: 300px",
        },
        {
          name: "land",
          align: "left",
          label: "Resource",
          field: "land",
          style: " font-size: 14px",
        },
        { name: "usd", align: "left", label: "Cost", field: "usd", style: "font-size: 14px" },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
          style: " font-size: 14px",
        },
      ],
      rows: [],
      curPage: 1,
      tableLoading: false,
      limit: 5,
      totalPage: 0,
      emptyImg: emptyImg,
      emptyMessage: "As empty as a cloudless sky",
    };
  },
  created() {
    this.getList(this.curPage);
  },
  methods: {
    async getList(page) {
      this.tableLoading = true;
      try {
        const { data } = await fetchBillList(page, this.limit);
        const curList = data.items.map((it) => {
          return {
            ...it,
            land: formatLand(it.landAmount),
            usd: formatEther(BigNumber.from(it.landAmount).div(1e6)),
            status: "Success",
          };
        });
        this.rows = curList;

        this.totalPage = Math.ceil(data.total / this.limit);
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    change(val) {
      this.getList(val);
    },
  },
};
</script>

<style>
.bill-title {
  font-weight: bold !important;
}
</style>
<style lang="scss" scoped>
.q-table__container {
  background: #0f172a;
  border-radius: 8px 8px 0 0;
  box-shadow: none;

  td {
    font-size: 20px;
  }
}
.pagination {
  background: #0f172a;
  border-radius: 0 0 8px 8px;
}
</style>

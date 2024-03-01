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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="txHash" :props="props">
            <a target="__blank" :href="getTxLink(props.row.txHash, props.row.network)">
              {{ props.row.txHash == "" ? "--" : props.row.txHash.cutStr(10, 10) }}
            </a>
          </q-td>
          <q-td key="land" :props="props">
            {{ props.row.land }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ props.row.amount }}
          </q-td>
          <q-td key="createdAt" :props="props">
            {{ new Date(props.row.createdAt * 1000).format() }}
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="pagination q-pa-lg flex flex-center">
      <q-pagination
        v-show="totalPage > 1"
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
import { formatLand, getTxLink } from "../../../utils/helper";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import emptyImg from "/img/stone/default-empty.png";
import {
  MumbaiUSDC,
  MumbaiUSDT,
  MumbaiDAI,
  MumbaiUSDCE,
  GoerliUSDC,
  GoerliUSDT,
  GoerliDAI,
  ChapelUSDC,
  ChapelUSDT,
  ChapelDAI,
  ArbitrumUSDC,
  ArbitrumUSDT,
  ArbitrumDAI,
  zkSyncUSDC,
  zkSyncUSDT,
  zkSyncDAI,
  optimisUSDC,
  optimisUSDT,
  optimisDAI,
  optimisETH,
} from "../utils/chainAddrs";

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
          style: "font-weight: bold; font-size: 14px;width: 300px",
        },
        {
          name: "land",
          align: "left",
          label: "LAND Amount",
          field: "land",
          style: " font-size: 14px",
        },
        { name: "amount", align: "left", label: "Cost", field: "amount", style: "font-size: 14px" },
        {
          name: "createdAt",
          align: "left",
          label: "CreatedAt",
          field: "createdAt",
          style: "font-size: 14px",
        },
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
      coinInfo: {
        USDC: [MumbaiUSDC, GoerliUSDC, ChapelUSDC, ArbitrumUSDC, zkSyncUSDC, optimisUSDC],
        USDCE: [MumbaiUSDCE],
        USDT: [MumbaiUSDT, GoerliUSDT, ChapelUSDT, ArbitrumUSDT, zkSyncUSDT, optimisUSDT],
        DAI: [MumbaiDAI, GoerliDAI, ChapelDAI, ArbitrumDAI, zkSyncDAI, optimisDAI],
        ETH: [optimisETH],
      },
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
          let coinType = "USDC";
          for (const key in this.coinInfo) {
            let findCoinAddr = this.coinInfo[key].find((item) => item == it.amountType);
            if (findCoinAddr) coinType = key;
          }
          if (coinType == "USDCE") {
            coinType = "USDC.e";
          }
          it.coinType = coinType;
          if (it.amountType == "0x4200000000000000000000000000000000000006") {
            if (!it.originalValue) {
              it.amount = 0;
            } else {
              it.amount =
                Number(formatEther(BigNumber.from(it.originalValue))).toFixed(5) +
                " " +
                it.coinType;
            }
          } else {
            it.amount =
              Number(formatEther(BigNumber.from(it.amount))).toFixed(2) + " " + it.coinType;
          }
          it.network = this.getChainType(it.network);
          return {
            ...it,
            land: formatLand(it.landAmount),
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
    getTxLink: getTxLink,
    getChainType(id) {
      id *= 1;
      if ([137, 80001].includes(id)) return "Polygon";
      if ([56, 97].includes(id)) return "BSC";
      if ([42161].includes(id)) return "Arbitrum";
      if ([280, 324].includes(id)) return "zkSync";
      if ([9999999].includes(id)) return "everPay";
      if ([1, 11155111].includes(id)) return "Ethereum";
      if ([10].includes(id)) return "Optimism";
      if ([534352].includes(id)) return "Scroll";
      if ([81457].includes(id)) return "Blast";
      if ([99999991].includes(id)) return "Redeem Historical Remaining Resources";
      return "";
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

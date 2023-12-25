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
      flat
      hide-pagination
      :rows-per-page-options="[0]"
      virtual-scroll
      :virtual-scroll-slice-size="10"
      :virtual-scroll-sticky-size-start="48"
      @virtual-scroll="onScroll"
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
            {{ formatTime(props.row.createdAt * 1000) }}
          </q-td>
          <q-td key="action" :props="props">
            <div v-if="props.row.action == 'Bought'" class="act-box buy">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3.5 12H5.88197C6.56717 12 7.19357 12.3871 7.5 13C7.80643 13.6129 8.43283 14 9.11803 14H14.882C15.5672 14 16.1936 13.6129 16.5 13C16.8064 12.3871 17.4328 12 18.118 12H20.5M9 7L12 10M12 10L15 7M12 10V4M6.5 7V7C6.08102 7 5.87153 7 5.69128 7.03332C5.05268 7.15137 4.53156 7.55037 4.25104 8.13608C4.17186 8.3014 4.11466 8.51311 4.00026 8.93653C3.74452 9.8831 3.47001 10.8201 3.15662 11.7515C3.09744 11.9275 3.05471 12.1085 3.02897 12.2923C3 12.4992 3 12.7105 3 13.1331V15.2C3 16.8802 3 17.7202 3.32698 18.362C3.6146 18.9265 4.07354 19.3854 4.63803 19.673C5.27976 20 5.11984 20 6.8 20H17.2C18.8802 20 18.7202 20 19.362 19.673C19.9265 19.3854 20.3854 18.9265 20.673 18.362C21 17.7202 21 16.8802 21 15.2V13.1331C21 12.7105 21 12.4992 20.971 12.2923C20.9453 12.1085 20.9026 11.9275 20.8434 11.7515C20.5831 10.9781 20.2701 9.87935 20.0117 8.93327C19.895 8.50609 19.8367 8.2925 19.7547 8.12424C19.4741 7.54803 18.9575 7.15363 18.3277 7.03472C18.1438 7 17.9292 7 17.5 7V7"
                  stroke="#F35950"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Buy
            </div>
            <div v-else-if="props.row.action == 'Sold'" class="act-box sell">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3.5 12H5.88197C6.56717 12 7.19357 12.3871 7.5 13C7.80643 13.6129 8.43283 14 9.11803 14H14.882C15.5672 14 16.1936 13.6129 16.5 13C16.8064 12.3871 17.4328 12 18.118 12H20.5M6.5 7V7C6.08102 7 5.87153 7 5.69128 7.03332C5.05268 7.15137 4.53156 7.55037 4.25104 8.13608C4.17186 8.3014 4.11466 8.51311 4.00026 8.93653C3.74452 9.8831 3.47001 10.8201 3.15662 11.7515C3.09744 11.9275 3.05471 12.1085 3.02897 12.2923C3 12.4992 3 12.7105 3 13.1331V15.2C3 16.8802 3 17.7202 3.32698 18.362C3.6146 18.9265 4.07354 19.3854 4.63803 19.673C5.27976 20 5.11984 20 6.8 20H17.2C18.8802 20 18.7202 20 19.362 19.673C19.9265 19.3854 20.3854 18.9265 20.673 18.362C21 17.7202 21 16.8802 21 15.2V13.1331C21 12.7105 21 12.4992 20.971 12.2923C20.9453 12.1085 20.9026 11.9275 20.8434 11.7515C20.5831 10.9781 20.2701 9.87935 20.0117 8.93327C19.895 8.50609 19.8367 8.2925 19.7547 8.12424C19.4741 7.54803 18.9575 7.15363 18.3277 7.03472C18.1438 7 17.9292 7 17.5 7V7"
                  stroke="#0A9E71"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 7L12 4M12 4L9 7M12 4L12 10"
                  stroke="#0A9E71"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Sell
            </div>
            <div v-else-if="props.row.action == 'REWARD'" class="act-box bonus">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M9.10102 3C10.3636 1.76281 12.0927 1 14 1C17.866 1 21 4.13401 21 8C21 9.90734 20.2372 11.6365 18.9999 12.899M15 14C15 17.866 11.866 21 8 21C4.13401 21 1 17.866 1 14C1 10.134 4.13401 7 8 7C11.866 7 15 10.134 15 14Z"
                  stroke="#FFBB45"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Bonus
            </div>
          </q-td>
          <q-td key="value" :props="props">
            {{ (props.row.action == "Bought" ? "-" : "+") + props.row.amounts + " ETH" }}
          </q-td>
          <q-td key="txHash" :props="props">
            <a :href="props.row.href" target="_blank" class="tx-hash">
              {{ props.row.sHash }}
            </a>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "vue";
import { BigNumber } from "ethers";
import { fetchTransaction } from "@/api/txs.js";
import emptyImg from "/img/stone/default-empty.png";
import { format } from "quasar";
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
      hasNewPage: false,
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
      this.loading = true;
      const { data } = await fetchTransaction(params);
      if (data.length < this.size) {
        this.hasNewPage = false;
      } else {
        this.hasNewPage = true;
      }
      this.rows.push(...data);
      this.rows.forEach((row, index) => {
        let amounts = BigNumber.from(row.value);
        row.index = index + 1;
        row.amounts = amounts / 1e18;
        // row.href = `https://mumbai.polygonscan.com/tx/${row.txHash}`;
        row.href = `https://sepolia-optimism.etherscan.io/tx/${row.txHash}`;
        row.sHash = row.txHash.substr(0, 5) + "..." + row.txHash.substr(row.txHash.length - 3, 3);
      });
      this.loading = false;
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
    formatTime(timestamp) {
      let date = new Date(timestamp);
      let chinaDate = date.toUTCString();
      let chinaDateArray = chinaDate.split(" ");
      let displayDate = `${chinaDateArray[1]} ${chinaDateArray[2]}, ${chinaDateArray[3]}`;
      return displayDate;
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
    .act-box {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: SF Pro Text;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .buy {
      color: #f35950;
    }
    .sell {
      color: #0a9e71;
    }
    .bonus {
      color: #ffbb45;
    }
    .tx-hash {
      color: #039cff;
      text-decoration: solid;
    }
  }
}
</style>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  max-height:90vh
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

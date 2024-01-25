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
          <q-td key="link" :props="props">
            <a :href="props.row.link" target="_blank" rel="noopener noreferrer">
              {{ props.row.link }}
            </a>
          </q-td>
          <q-td key="createdAt" :props="props">
            {{ formatTime(props.row.createdAt * 1000) }}
          </q-td>
          <q-td key="expiration" :props="props">
            {{ props.row.expiration }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              flat
              round
              size="sm"
              color="primary"
              icon="content_copy"
              @click="copyLink(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "vue";
import { BigNumber } from "ethers";
import { fetchUserShareList } from "@/api/share.js";
import emptyImg from "/img/stone/default-empty.png";
import { format, copyToClipboard } from "quasar";

const columns = [
  { name: "index", align: "left", label: "#", field: "index", sortable: false },
  { name: "link", align: "left", label: "Link", field: "stoneName", sortable: false },
  { name: "createdAt", align: "left", label: "CreateAt", field: "createdAt", sortable: false },
  {
    name: "expiration",
    align: "left",
    label: "Expiration",
    field: "expiration",
    sortable: false,
  },
  {
    name: "action",
    align: "left",
    label: "Action",
    field: "action",
    sortable: false,
  },
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
      const { data } = await fetchUserShareList(params);
      if (data.length < this.size) {
        this.hasNewPage = false;
      } else {
        this.hasNewPage = true;
      }
      this.rows.push(...data);
      this.rows.forEach((row, index) => {
        row.index = index + 1;
        row.linkNoCode = `${window.location.origin}/s/${row.shareLink}`;
        row.link = `${window.location.origin}/s/${row.shareLink}?code=${row.code}`;
        row.expiration = this.setExpiration(row);
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
    setExpiration(item) {
      if (item.validityPeriod == "FOREVER") {
        return "Forever";
      } else if (item.expireAt * 1000 < new Date().getTime()) {
        return "Expired";
      } else {
        return this.formatTime(item.expireAt * 1000);
      }
    },
    formatTime(timestamp) {
      let date = new Date(timestamp);
      let chinaDate = date.toUTCString();
      let chinaDateArray = chinaDate.split(" ");
      let displayDate = `${chinaDateArray[1]} ${chinaDateArray[2]}, ${chinaDateArray[3]}`;
      return displayDate;
    },
    isOver6Decimals(num) {
      return (num.toString().split(".")[1] || []).length > 6;
    },
    copyLink(row) {
      this.onCopy(
        `Hi, I've shared some files with you using #Moss (@mymoss_io on X). You can view them by opening the link in a browser.
Link: ${row.linkNoCode}
Extraction code: ${row.code}`
      );
    },
    async onCopy(txt, msg = "Copied") {
      await copyToClipboard(txt);
      if (msg) this.$toast(msg, 1);
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

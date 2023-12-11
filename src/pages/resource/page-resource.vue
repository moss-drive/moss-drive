<template>
  <div class="q-pa-md">
    <resource-notice></resource-notice>
    <div class="resource-plate al-c">
      <div class="land-container">
        <div class="fz-20 fw-b">Balance</div>
        <div class="my-4 al-c space-btw">
          <div class="land-content h-flex">
            <div class="land-content-top">
              <span class="land-amount">23,233</span>
              <span class="fz-14">k</span>
              <span class="fw-b fz-20 ml-4">LAND</span>
            </div>

            <div class="land-content-bottom mt-1">≈100USD</div>
          </div>
          <div class="conversion-btn cursor-p">Conversion</div>
        </div>

        <div class="descrition">
          <span class="cursor-p">What's LAND?</span>
          <span class="px-2">|</span>
          <span class="cursor-p">Pricing</span>
        </div>
      </div>
      <div class="usage-container ml-6">
        <div class="al-c">
          <span class="fz-20 fw-b">Usage & Free Resource</span>
          <img class="ml-1 cursor-p" width="24" src="/img/resource/help.svg" alt="" />
        </div>

        <template v-for="item in list" :key="item.name">
          <resource-progress class="mt-4" :name="item.name" :color="item.color"></resource-progress>
        </template>
      </div>
    </div>

    <div class="recharge-container my-6">
      <div class="deposit-container">
        <div class="fz-20 fw-b mb-4">Deposit</div>
        <div class="deposite-section mb-4">
          <div class="al-c recharge-input" style="width: 50%">
            <input maxlength="8" class="r-ipt flex-1" v-model="amount" type="text" />
            <span class="num">,000,000</span>
            <span class="land-text fz-14">LAND</span>
          </div>
          <div class="mt-1 fz-12 land-to-usd">1,000,000LAND=1USD</div>
        </div>

        <div class="fz-20 fw-b mb-4">Calculator</div>
        <div class="al-c space-btw flex-wrap" style="gap: 16px">
          <resource-count-row
            class="flex-1 resource-count-row"
            v-for="item in resourceTagsConfig"
            :key="item.name"
            :tags="item.tags"
            :unit="item.unit"
            :items="item.items"
            :name="item.name"
            @countPrice="countPrice"
          ></resource-count-row>
        </div>
      </div>

      <div class="recharge-act d-flex">
        <pay-network class="flex-1"></pay-network>
        <pay-coin class="flex-1 ml-4" @onSelectCoin="onSelectCoin"></pay-coin>
      </div>

      <div class="recharge-bar al-c space-btw">
        <div class="amount-info fw-b">
          <div class="fz-16">Total</div>
          <div class="al-c">
            <span class="amount">999.0000</span>
            <span class="coin-type fz-12 ml-1">{{ coinType }}</span>
          </div>
        </div>
        <div class="recharge-btn cursor-p">Approve</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ResourceNotice from "./componets/resource-notice.vue";
import ResourceProgress from "./componets/resource-progress.vue";
import ResourceCountRow from "./componets/resource-count-row.vue";

import PayNetwork from "./componets/pay-network.vue";
import PayCoin from "./componets/pay-coin.vue";

export default {
  data() {
    return {
      list: [
        { name: "Storage (IPFS)", used: "2312312312", total: "23213211", color: "#57B9BC" },
        { name: "BandWidth", used: "2312312312", total: "23213211", color: "#F3CC5C" },
      ],
      amount: "",
      resourceTagsConfig: [
        {
          name: "IPFS Storage",
          tags: [
            {
              text: "30 GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "80 GB",
              value: 80 * Math.pow(1024, 3),
            },
            {
              text: "500 GB",
              value: 500 * Math.pow(1024, 3),
            },
          ],
          unit: Math.pow(1024, 3),
          items: [
            {
              text: "MB",
              value: Math.pow(1024, 2),
            },
            { text: "GB", value: Math.pow(1024, 3) },
            {
              text: "TB",
              value: Math.pow(1024, 4),
            },
          ],
        },
        {
          name: "IPFS Storage Days",
          tags: [
            {
              text: "180 Days",
              value: 180 * 86400,
            },
            {
              text: "365 Days",
              value: 365 * 86400,
            },
            {
              text: "1096 Days",
              value: 1096 * 86400,
            },
          ],
          unit: 86400,
          items: [{ text: "Days" }],
        },
        {
          name: "BindWidth",
          tags: [
            {
              text: "500 MB",
              value: 500 * Math.pow(1024, 2),
            },
            {
              text: "30 GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "100 GB",
              value: 100 * Math.pow(1024, 3),
            },
          ],
          unit: Math.pow(1024, 3),
          items: [
            {
              text: "MB",
              value: Math.pow(1024, 2),
            },
            { text: "GB", value: Math.pow(1024, 3) },
            {
              text: "TB",
              value: Math.pow(1024, 4),
            },
          ],
        },
      ],
      coinType: "USDC",
    };
  },
  computed: {
    ...mapState({
      usage: (s) => s.usageInfo,
    }),
  },
  methods: {
    countPrice() {
      console.log(2);
    },
    onSelectCoin(coin) {
      this.coinType = coin;
    },
  },
  components: {
    ResourceNotice,
    ResourceProgress,
    ResourceCountRow,
    PayNetwork,
    PayCoin,
  },
};
</script>
<style lang="scss" scoped>
.land-container,
.usage-container {
  flex: 1;
  border-radius: 16px;
  background: #0f172a;
  padding: 16px;
  color: #fff;
  .land-content {
    .land-content-top {
      height: 46px; /* 115% */
      .land-amount {
        font-size: 40px;
        font-family: "DIN Alternate";
        margin-right: 2px;
      }
    }
    .land-content-bottom {
      color: #cbd5e1;
      font-size: 14px;
    }
  }
  .conversion-btn {
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid #1eefa4;
    color: #1eefa4;
  }

  .descrition {
    color: #cbd5e1;
    font-size: 12px;
  }
}

.recharge-container {
  background: #0f172a;
  border-radius: 16px;
  overflow: hidden;
  .deposit-container {
    padding: 16px 16px 24px 16px;
    border-bottom: 1px solid #334155;

    .recharge-input {
      border-radius: 4px;
      border: 1px solid #334155;
      .r-ipt {
        font-size: 20px;
        font-family: "DIN Alternate";
        text-indent: 16px;
        text-align: right;
        background: #0f172a;
        color: #1eefa4;
      }
      .num {
        font-family: "DIN Alternate";
        font-size: 20px;
        padding-right: 16px;
        color: #cbd5e1;
      }
      .land-text {
        display: inline-block;
        width: 160px;
        color: #cbd5e1;
        text-align: center;
        font-size: 14px;
        padding: 16px 0px;
        background: #1e293b;
      }
    }

    .land-to-usd {
      color: #cbd5e1;
    }
  }

  .recharge-act {
    padding: 16px 16px 24px 16px;
  }

  .recharge-bar {
    padding: 8px 16px;
    background: #94f9ca;
    .amount-info {
      color: #0f172a;

      .amount {
        font-family: "DIN Alternate";
        font-size: 28px;
      }
      .coin-type {
        color: #334155;
      }
    }
    .recharge-btn {
      padding: 15px 26px 14px 26px;
      border-radius: 4px;
      background: #13c68a;
      font-weight: bold;
    }
  }
}
</style>

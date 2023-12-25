<template>
  <div class="q-pa-md">
    <resource-notice v-if="!onChain"></resource-notice>
    <div class="resource-plate row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="land-container">
          <div class="fz-20 fw-b">Balance</div>
          <div class="my-4 al-c space-btw">
            <div class="land-content h-flex">
              <div class="land-content-top">
                <span class="land-amount">{{ formatLand.land }}</span>
                <span class="fz-14">{{ formatLand.unit }}</span>
                <span class="fw-b fz-20 ml-4">LAND</span>
              </div>

              <div class="land-content-bottom mt-1">≈{{ land2Usd }}USD</div>
            </div>
            <div class="al-c">
              <div class="conversion-btn ta-c cursor-p" @click="showConversion = !showConversion">
                Conversion
              </div>
              <div class="deposit-btn ta-c fw-b cursor-p ml-4" @click="handleDeposit">Deposit</div>
            </div>
          </div>

          <div class="descrition">
            <span class="cursor-p">
              <a
                href="https://docs.4everland.org/get-started/billing-and-pricing/what-is-land"
                target="__blank"
                >What's LAND?</a
              >
            </span>
            <span class="px-2">|</span>
            <span class="cursor-p">
              <a
                href="https://docs.4everland.org/get-started/billing-and-pricing/pricing-model"
                target="__blank"
                >Pricing</a
              >
            </span>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="usage-container">
          <div class="al-c">
            <span class="fz-20 fw-b">Usage & Free Resource</span>
            <!-- <img class="ml-1 cursor-p" width="24" src="/img/resource/help.svg" alt="" /> -->
          </div>

          <template v-for="item in transformUsage" :key="item.name">
            <resource-progress
              class="mt-4"
              :name="item.name"
              :used="item.used"
              :total="item.total"
              :color="item.color"
              :percent="item.percent"
              :showConversion="showConversion"
              :land2Resource="land2Resource[item.type]"
            ></resource-progress>
          </template>
        </div>
      </div>
    </div>

    <bill-details class="mt-4"></bill-details>
    <deposit-dialog ref="depositRef"></deposit-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getFileSize } from "@/utils/helper";
import { formatEther } from "ethers/lib/utils";
import ResourceNotice from "./componets/resource-notice.vue";
import ResourceProgress from "./componets/resource-progress.vue";
import DepositDialog from "./componets/deposit-dialog.vue";
import BillDetails from "./componets/bill-details.vue";
export default {
  data() {
    return {
      showConversion: false,
    };
  },
  created() {
    this.$store.dispatch("resourceStore/getLand");
    this.$store.dispatch("resourceStore/getUsage");
    this.$store.dispatch("resourceStore/getPrice");
  },
  computed: {
    ...mapGetters("resourceStore", ["formatLand", "land2Resource"]),
    ...mapState({
      // usage: (s) => s.usageInfo,
      userInfo: (s) => s.userInfo,
    }),
    ...mapState("resourceStore", ["land", "usage", "onChain"]),
    land2Usd() {
      const land = Number(formatEther(this.land));
      return Math.floor(land / 1e6);
    },
    transformUsage() {
      const usage = this.usage.filter((it) => it.type == "IPFS_STORAGE" || it.type == "TRAFFIC");
      return usage.map((it) => {
        let name = "";
        let color = "";
        let total = it.total;
        if (this.showConversion) {
          total = it.total + this.land2Resource[it.type].size;
        }
        if (it.type == "IPFS_STORAGE") {
          name = "Storage (IPFS)";
          color = "#57B9BC";
        } else {
          name = "BandWidth";
          color = "#F3CC5C";
        }
        return {
          type: it.type,
          name,
          used: getFileSize(it.used, true),
          total: getFileSize(it.total),
          percent: (it.used / total).toFixed(2) * 1,
          color,
        };
      });
    },
  },
  methods: {
    handleDeposit() {
      this.$refs.depositRef.depositDialog = true;
    },
  },

  components: {
    ResourceNotice,
    ResourceProgress,
    BillDetails,
    DepositDialog,
  },
};
</script>
<style lang="scss" scoped>
.land-container,
.usage-container {
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
    width: 115px;
    padding: 12px 16px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #1eefa4;
    color: #1eefa4;
  }

  .deposit-btn {
    width: 117px;
    padding: 12px 16px;
    border-radius: 4px;
    box-sizing: border-box;
    color: #0f172a;
    border: 1px solid #1eefa4;
    background: #1eefa4;
  }

  .descrition {
    a {
      color: #cbd5e1;
      font-size: 12px;
    }
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
      color: #0f172a;
    }
  }
}
</style>

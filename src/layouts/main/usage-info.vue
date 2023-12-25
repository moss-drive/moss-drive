<template>
  <div>
    <div class="resource-recharge-tip px-4">
      <div
        class="resource-recharge-content pa-2 fz-12 cursor-p"
        v-show="!onChain"
        @click="$router.push('/resource')"
      >
        <img class="gift-img" src="/img/resource/gift.svg" width="32px" alt="" />
        <div class="ml-1">
          Deposit $1 to upgrade your account and gain access to permanent free resources.
        </div>
      </div>
    </div>
    <div class="bg-black-1 pa-5">
      <div class="al-c">
        <span>Storage</span>
      </div>
      <div class="mt-3 progress-content">
        <div
          class="progress"
          :style="{ width: transformUsage.percent > 100 ? '100&' : transformUsage.percent + '%' }"
          :class="{ overflow: transformUsage.percent > 100 }"
        ></div>
      </div>
      <div class="mt-2 usage-resource al-c">
        <span class="fz-12 nowrap"
          >{{ transformUsage.used.num }} {{ transformUsage.used.unit }}/{{
            transformUsage.total
          }}</span
        >
        <span class="fz-12 transform-data nowrap">
          + {{ land2Resource["IPFS_STORAGE"].transformSize }} * 1 mo</span
        >
        <div class="ml-1">
          <img src="/img/common/info-o.svg" width="12" class="d-b" />
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            max-width="300px"
            class="bg-black-8 fz-12"
          >
            "used resources" refers to the space occupied by files in "My Drive", while "remaining
            resources" refers to the remaining IPFS resources in the current account on 4EVERLAND.
          </q-tooltip>
        </div>
      </div>
      <div class="mt-5">
        <q-btn outline class="full-width" to="/resource">Get More</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getFileSize } from "../../utils/helper";
export default {
  computed: {
    ...mapState("resourceStore", ["land", "usage", "onChain"]),
    ...mapGetters("resourceStore", ["land2Resource"]),
    transformUsage() {
      const usage = this.usage.find((it) => it.type == "IPFS_STORAGE");
      let total = usage.total;
      total = usage.total + this.land2Resource[usage.type].size.toNumber();
      return {
        type: usage.type,
        used: getFileSize(usage.used, true),
        total: getFileSize(usage.total),
        percent: ((usage.used / total) * 100).toFixed(2) * 1,
      };
    },
  },
  created() {
    this.$store.dispatch("resourceStore/getLand");
    this.$store.dispatch("resourceStore/getUsage");
    this.$store.dispatch("resourceStore/getPrice");
    this.$store.dispatch("resourceStore/checkOnChain");
  },
};
</script>
<style lang="scss" scoped>
.resource-recharge-content {
  color: #fff;
  border-radius: 8px;
  background: linear-gradient(
    116deg,
    rgba(126, 79, 237, 0.56) 5.68%,
    rgba(126, 79, 237, 0.75) 61.94%
  );
  .gift-img {
    float: left;
    shape-outside: padding-box;
  }
  .day {
    color: #ff2e00;
    font-family: DIN Alternate;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px; /* 100% */
  }
}

.usage-resource {
  color: #475569;
}
.progress-content {
  border: 1px solid #047557;
  border-radius: 10px;
  padding: 1px;

  .progress {
    height: 4px;
    border-radius: 10px;
    background: #047557;
    transition: all 1s ease;
  }
  .progress.overflow {
    background: rgba(129, 71, 59, 1);
  }
}
</style>

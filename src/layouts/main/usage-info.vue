<template>
  <div class="bg-black-1 pa-5">
    <div class="al-c">
      <span>Storage</span>
    </div>
    <div class="mt-3 progress-content">
      <div
        class="progress"
        :style="{ width: transformUsage.percent + '%' }"
        :class="{ overflow: transformUsage.percent > 100 }"
      ></div>
    </div>
    <div class="mt-2 usage-resource">
      <span class="fz-12"
        >{{ transformUsage.used.num }} {{ transformUsage.used.unit }}/{{
          transformUsage.total
        }}</span
      >
      <span class="fz-12 transform-data">
        + {{ land2Resource["IPFS_STORAGE"].transformSize }} * 1 mo</span
      >
    </div>
    <!-- <div class="mt-3 al-c" style="color: #475569">
        <span>Remaining 40GB July 3,2022</span>
        <div class="ml-1">
          <img src="/img/common/info-o.svg" width="16" class="d-b" />
          <q-tooltip anchor="top middle" self="bottom middle" max-width="300px" class="bg-black-8">
            "used resources" refers to the space occupied by files in "My Drive", while "remaining
            resources" refers to the remaining IPFS resources in the current account on 4EVERLAND.
          </q-tooltip>
        </div>
      </div> -->
    <div class="mt-5">
      <q-btn outline class="full-width" to="/resource">Get More</q-btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getFileSize } from "../../utils/helper";
export default {
  computed: {
    ...mapState("resourceStore", ["land", "usage"]),
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
  },
};
</script>
<style lang="scss" scoped>
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

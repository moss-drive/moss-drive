<template>
  <div>
    <div class="resource-recharge-tip px-4" v-show="!onChain">
      <div
        class="resource-recharge-content fz-12 cursor-p"
        @click="$router.push('/resource')"
      ></div>
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
        <span class="fz-12 transform-data nowrap" v-show="showIpfsTransformSize">
          + {{ ipfsTransformSize }}</span
        >
        <div class="ml-1" v-show="showIpfsTransformSize">
          <img src="/img/common/info-o.svg" width="12" class="d-b" />
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            max-width="300px"
            class="bg-black-8 fz-12"
          >
            The value after the '+' is only an estimate of the storage that LAND balance can consume
            in one month.
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
    showIpfsTransformSize() {
      return this.land2Resource["IPFS_STORAGE"].size != 0;
    },
    ipfsTransformSize() {
      return this.land2Resource["IPFS_STORAGE"].transformSize;
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
  position: relative;
  height: 160px;
  background: url("/img/resource/burst.svg") no-repeat;
  background-size: 100%;
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

<template>
  <div class="al-c space-btw flex-wrap" style="gap: 16px">
    <resource-count-row
      class="flex-1 resource-count-row"
      v-for="item in resourceTagsConfig"
      :key="item.name"
      :tags="item.tags"
      :unit="item.unit"
      :items="item.items"
      :name="item.name"
      :type="item.type"
      @countPrice="countPrice"
    ></resource-count-row>
  </div>
</template>

<script>
import ResourceCountRow from "./resource-count-row.vue";
import { BigNumber } from "ethers";
import { mapState } from "vuex";
import { parseEther } from "ethers/lib/utils";
export default {
  data() {
    return {
      resourceTagsConfig: [
        {
          name: "Storage",
          type: "IPFS Storage",
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
          name: "Storage Days",
          type: "IPFS Storage Days",
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
          type: "BindWidth",
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
      recordIpfsSize: BigNumber.from("0"),
      recordIpfsSeconds: BigNumber.from("0"),
      ipfsPrice: BigNumber.from("0"),
      bandwidthPrice: BigNumber.from("0"),
    };
  },
  computed: {
    ...mapState({
      resourcePrice: (s) => s.resourceStore.resourcePrice,
    }),

    totalPrice() {
      return this.ipfsPrice.add(this.bandwidthPrice).div(parseEther("1"));
    },

    estimateInputVal() {
      let estimatePrice = BigNumber.from("1");
      let fixNumber = BigNumber.from("0");
      if (this.totalPrice.eq(fixNumber)) {
        return "";
      }
      const totalPrice = this.totalPrice.toString();
      if (totalPrice.length > 6) {
        if (Number(totalPrice.slice(-6)) > 0) {
          fixNumber = BigNumber.from("1");
        }
        estimatePrice = BigNumber.from(totalPrice).div(1e6).add(fixNumber);
      }

      return estimatePrice.toString();
    },
  },
  methods: {
    countPrice(payload) {
      switch (payload.type) {
        case "IPFS Storage":
          this.recordIpfsSize = BigNumber.from(payload.value.toString());
          this.ipfsPrice = this.recordIpfsSize
            .mul(this.recordIpfsSeconds)
            .mul(this.resourcePrice["IPFS_STORAGE"].unitPrice);
          break;
        case "IPFS Storage Days":
          this.recordIpfsSeconds = BigNumber.from(payload.value.toString());
          this.ipfsPrice = this.recordIpfsSize
            .mul(this.recordIpfsSeconds)
            .mul(this.resourcePrice["IPFS_STORAGE"].unitPrice);
          break;
        case "BindWidth":
          this.bandwidthPrice = BigNumber.from(payload.value.toString()).mul(
            this.resourcePrice["TRAFFIC"].unitPrice
          );
          break;
        default:
          break;
      }
    },
  },
  watch: {
    totalPrice() {
      this.$emit("estimateInput", this.estimateInputVal);
    },
  },

  components: {
    ResourceCountRow,
  },
};
</script>

<style lang="scss" scoped></style>

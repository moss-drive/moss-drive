<template>
  <div>
    <div class="resource-info mb-2 al-c space-btw">
      <div>{{ name }}</div>

      <div class="fz-12 resource-usage al-c">
        <div>
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            max-width="300px"
            class="bg-black-8 fz-12"
          >
            {{
              name == "Storage (IPFS)"
                ? `The computation method for IPFS consumption is Time * Space. This value is only an
            estimate of the storage that LAND balance can consume in one month. The final charge
            will still be based on the actual storage used`
                : "The estimated resources usable with the current LAND balance"
            }}
          </q-tooltip>
          <span class="land-to-resource fz-12 mr-2 cursor-p" v-show="showConversion"
            >+ {{ land2Resource.transformSize }}
            {{ name == "Storage (IPFS)" ? " * 1 mo" : "" }}</span
          >
        </div>
        <span class="resource-num fz-20" :style="{ color: color }">{{ used.num }}</span>
        <span class="unit">{{ used.unit }}</span>
        <span>/</span>
        <span>{{ total }}</span>
      </div>
    </div>
    <q-linear-progress
      :value="percent"
      size="8px"
      rounded
      color="color"
      style="background: #334155"
      :style="{
        '--color': color,
      }"
    />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#57B9BC",
    },
    used: {
      type: Object,
      default: () => {
        return {
          num: 0,
          unit: "GB",
        };
      },
    },
    total: {
      type: String,
      default: "0 GB",
    },
    percent: {
      type: Number,
      default: 0,
    },
    showConversion: {
      type: Boolean,
      default: false,
    },
    land2Resource: {
      type: Object,
      default: () => {
        return {
          size: "0",
          transformSize: "0 GB",
        };
      },
    },
  },
  computed() {},
};
</script>

<style lang="scss" scoped>
.text-color {
  color: var(--color) !important;
}

.resource-info {
  color: #cbd5e1;

  .land-to-resource {
    color: #1eefa4;
  }
  .resource-usage {
    > span {
      margin-left: 2px;
    }
    .resource-num {
      font-family: "DIN Alternate";
    }
  }
}
</style>

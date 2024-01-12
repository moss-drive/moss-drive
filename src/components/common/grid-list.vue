<style lang="scss">
.driver-grid {
  .grid-item {
    border-radius: 8px;
    user-select: none;
    cursor: pointer;
    &:active .cover {
      opacity: 0.8;
    }
    &.active {
      background: #1e293b;
      .check-wrap {
        visibility: visible;
      }
    }
  }
}
body.no-touch .grid-item:hover,
body.touch .grid-item.hover {
  background: #334155;
  .check-wrap {
    visibility: visible;
  }
}
</style>

<template>
  <grid-loading :num="6" v-if="!rows" />
  <empty-stone v-else-if="!rows.length" />
  <div class="row pos-r driver-grid">
    <div class="col-4 col-sm-3 col-md-2 pa-2" v-for="(row, i) in rows" :key="row.key">
      <div
        @click="onRow(row, i)"
        class="ta-c driver-list-item grid-item pb-4"
        :class="{
          active: isCheck(row),
          hover: hoverIdx == i,
        }"
      >
        <p
          class="ta-l hide"
          :class="{
            'check-wrap': selection == 'multiple',
          }"
          v-if="checked"
        >
          <q-checkbox size="40px" :model-value="isCheck(row)" @click="onCheck(row)"></q-checkbox>
        </p>
        <div class="pos-r">
          <q-img
            :src="getIcon(row)"
            spinner-size="30px"
            :ratio="1"
            width="50%"
            class="cover ev-n trans-100"
            :class="{
              'op-6': i === loading,
            }"
          />
          <div class="pos-center" v-if="i === loading">
            <q-spinner-ios color="yellow" size="30px" />
          </div>
        </div>
        <p class="line-1 px-2">{{ row.name }}</p>
        <p
          class="fz-12 op-5"
          :class="{
            hide: row.prefix,
          }"
        >
          {{ row.sizeUnit || "-" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  emits: ["row-click", "row-check"],
  props: {
    rows: Array,
    loading: null,
    checked: Array,
    selection: String,
  },
  data() {
    return {
      platform: useQuasar().platform,
      hoverIdx: -1,
    };
  },
  computed: {
    hasTouch() {
      return this.platform.has.touch;
    },
    isIos() {
      return this.platform.is.ios;
    },
  },
  watch: {
    rows() {
      this.hoverIdx = -1;
    },
  },
  methods: {
    isCheck(row) {
      return (this.checked || []).includes(row.key);
    },
    onCheck(row) {
      this.$emit("row-check", row);
    },
    getIcon(row) {
      if (row.icon) {
        return row.icon;
      }
      if (row.cid && row.type == "image" && row.size < 10 * 1024 * 1024) {
        if (this.$inDev) {
          return `https://moss-img.4everland.co/cdn-cgi/image/width=150/ipfs/${row.cid}`;
        }
        return `https://moss-img.4everland.link/ipfs/${row.cid}?width=150&optimizer=image`;
      }
      return `/img/driver/icon_${row.type}.png`;
    },
    onRow(row, index) {
      if (this.checked && this.hasTouch && !this.isCheck(row) && this.hoverIdx != index) {
        this.hoverIdx = index;
        return;
      }
      this.$emit("row-click", {
        row,
        index,
      });
    },
  },
};
</script>

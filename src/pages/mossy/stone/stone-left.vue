<style>
.bg-header-s1 {
  background: linear-gradient(0, #111729, #7e4fed);
}
</style>

<script setup>
import LeftList from "./left-list.vue";
import LeftMossAct from "./left-moss-act.vue";
</script>

<template>
  <div class="bdrs-10 bg-dark2 ov-h">
    <div class="bg-header-s1 pa-4 bdb-1">
      <div class="d-flex mt-5">
        <q-skeleton size="110px" square v-if="!loaded" />
        <div v-else>
          <div class="stone-cover">
            <q-img
              :src="info.stoneAvatar || '/img/stone/stone-cover.png'"
              :ratio="1"
              width="110px"
            ></q-img>
          </div>
        </div>
        <div class="ml-8 flex-1">
          <div v-if="!loaded">
            <q-skeleton type="title" />
            <q-skeleton class="mt-2" height="100px" />
          </div>
          <template v-else>
            <div class="fw-b fz-20 line-2">{{ info.stoneName || "-" }}</div>
            <div class="mt-2 line-5 op-6">
              {{ info.bio || "-" }}
            </div>
          </template>
        </div>
      </div>
      <div class="mt-7">
        <q-skeleton type="title" v-if="!loaded" style="max-width: 735px" />
        <div v-else class="al-c mt-7 fw-b f-wrap">
          <div class="mr-4" v-for="(row, j) in kvList" :key="j">
            <span>{{ row.key }}</span>
            <span class="fz-20 color-2 ml-1">
              {{ row.val || "-" }}
            </span>
          </div>
        </div>
      </div>
      <left-moss-act v-if="info.stoneId" :stoneId="info.stoneId" :balance="balance" />
    </div>
    <left-list :stoneId="info.stoneId" :id="info.id" :balance="balance" />
  </div>
</template>

<script>
export default {
  props: {
    info: Object,
    balance: null,
  },
  computed: {
    loaded() {
      return !!this.info.stoneName;
    },
    kvList() {
      const format = (val) => {
        return this.$formatEther(val) + "ETH";
      };
      let { totalSupply: supply, price, floor, floorSupply, worth } = this.info;
      if (price) price = format(price);
      if (floor) floor = format(floor);
      if (worth) worth = format(worth);
      return [
        {
          key: "Current Supply",
          val: supply,
        },
        {
          key: "Current Price",
          val: price,
        },
        {
          key: "Current Floor",
          val: floor,
        },
        // {
        //   key: "Next Floor",
        //   val: floor,
        // },
        {
          key: "Floor Supply",
          val: floorSupply,
        },
        {
          key: "Pool Value",
          val: worth,
        },
        {
          key: "Hold",
          val: this.balance,
        },
      ];
    },
  },
};
</script>
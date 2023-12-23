<script setup>
import StoneEdit from "./stone-edit.vue";
</script>

<template>
  <stone-edit ref="edit" @refresh="getList" />

  <div class="q-pa-md">
    <div class="row" v-if="!rows">
      <div v-for="i in 1" :key="i" class="col-12 col-sm-6 col-lg-4 pa-2">
        <q-card flat>
          <!-- <q-skeleton type="text" width="160px" class="text-subtitle1" /> -->
          <q-skeleton height="260px" square />
        </q-card>
      </div>
    </div>
    <div v-else-if="!rows.length">
      <empty-stone />
    </div>
    <div class="row" v-else>
      <div class="col-12 col-sm-6 col-lg-4 pa-2" v-for="it in rows" :key="it.id">
        <!-- <img src="/img/stone/stone-head.png" height="40" class="d-b" /> -->
        <!-- style="top: -13px" -->
        <div class="bg-card-1 stone-card pa-4 pos-r">
          <div class="pos-a right-0 top-0 m-3 pa-1 hover-1" @click="$refs.edit.onEdit(it)">
            <img src="/img/stone/stone-edit.svg" width="20" />
          </div>
          <div class="al-c">
            <div class="stone-cover">
              <q-img :src="it.avatar" width="110px" :ratio="1" />
            </div>
            <div class="ml-4">
              <p v-for="(row, j) in it.kvList" :key="j">
                <span class="op-8">{{ row.label }}</span>
                <b class="color-2 fz-18 ml-2">{{ row.val || "-" }}</b>
              </p>
            </div>
          </div>
          <div class="mt-4">
            <p class="fw-b fz-20">{{ it.stoneName }}</p>
            <div class="mt-2 op-8 line-1">
              <p v-if="it.stoneId">
                Stone ID <span class="color-1">#{{ it.stoneId }}</span>
              </p>
              <div class="al-c" v-else>
                <span>Transaction in progress</span>
                <img class="ml-4 mr-1 d-b" src="/img/common/ic-clock.svg" width="14" />
                <span>{{ getMin(it.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="mt-3 al-c">
            <q-btn
              :href="`/mossy/stone?id=${it.id}`"
              target="_blank"
              color="primary"
              class="flex-1"
              rounded
              >Stone Page</q-btn
            >
            <q-btn
              :to="`/drive/${it.folderPath.replace(/\/$/, '')}`"
              color="primary"
              class="flex-1 ml-4"
              outline
              rounded
              >Open Folder</q-btn
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getMin(time) {
      let min = Math.round((Date.now() / 1e3 - time) / 60);
      if (min > 60) {
        return Math.floor(min / 60) + "h " + (min % 60) + "mins";
      }
      return min + "mins";
    },
    async getList() {
      try {
        this.rows = null;
        const { data } = await this.$http.get("/stone");
        const format = (val) => {
          return this.$ethUtils.formatEther(val) + "ETH";
        };
        for (const it of data) {
          let { price, floor } = it;
          if (price) price = format(price);
          if (floor) floor = format(floor);
          it.kvList = [
            {
              label: "Supply",
              val: it.totalSupply,
            },
            {
              label: "Price",
              val: price,
            },
            {
              label: "Floor",
              val: floor,
            },
          ];
        }
        this.rows = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
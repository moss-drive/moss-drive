<style>
.bg-header-s1 {
  background: linear-gradient(0, #111729, #7e4fed);
}
</style>

<script setup>
import LeftList from "./left-list.vue";
</script>

<template>
  <div class="bdrs-10 bg-dark2 ov-h">
    <div class="row q-col-gutter-md bg-header-s1 pa-4 bdb-1">
      <div class="col-12 col-sm-8">
        <div class="fw-b fz-20">{{ info.stoneName || "-" }}</div>
        <div class="d-flex mt-5">
          <div class="stone-cover">
            <q-img :src="info.stoneAvatar" :ratio="1" width="100px"></q-img>
          </div>
          <div class="ml-3 line-5 op-8">
            {{ info.bio || "-" }}
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <img src="/img/temp-chart.svg" class="w100p" />
        <div class="mt-3 al-c">
          <q-btn class="flex-1" color="primary" rounded>BUY STONE</q-btn>
          <q-btn class="flex-1 ml-4" outline color="primary" rounded>SELL STONE</q-btn>
        </div>
      </div>
    </div>

    <left-list :id="id" />
  </div>
</template>

<script>
export default {
  props: {
    id: null,
  },
  data() {
    return {
      info: {},
    };
  },

  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await this.$http.get("/stone/meta", {
          params: {
            stoneId: this.id,
          },
        });
        this.info = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
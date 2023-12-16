<script setup>
import StoneLeft from "./stone-left.vue";
import StoneRight from "./stone-right.vue";
</script>

<template>
  <div class="pa-5">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-9">
        <stone-left :id="id" :info="info" />
      </div>
      <div class="col-12 col-md-3">
        <stone-right :id="id" :info="info.twitterInfo || {}" />
      </div>
    </div>
  </div>

  <wallet-check />
</template>

<script>
export default {
  data() {
    const { id } = this.$route.query;
    return {
      id,
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
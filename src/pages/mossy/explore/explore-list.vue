<style lang="scss">
.q-checkbox--dense .q-checkbox__label {
  padding-left: 3px;
}
.mossy-opts {
  .q-btn-item {
    width: 100px;
    margin-right: 10px;
    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>

<script setup>
import ListStone from "./list-stone.vue";
import ListRank from "./list-rank.vue";
</script>

<template>
  <div class="mt-5 mb-8 d-center">
    <div class="bg-dark2 pa-2 bdrs-100 mossy-opts">
      <q-btn-toggle
        class="rounded"
        v-model="type"
        unelevated
        toggle-color="primary"
        :options="typeOpts"
      />
    </div>
  </div>

  <template v-if="type == 'FOR_YOU' || type == 'LATEST'">
    <div v-if="!rows" class="row q-col-gutter-md">
      <div class="col-6 col-sm-4 col-md-3" v-for="i in 6" :key="i">
        <q-card flat>
          <q-skeleton height="120px" square />
        </q-card>
      </div>
    </div>
    <div v-else-if="!rows.length">
      <empty-stone />
    </div>
    <list-stone v-else :list="rows" />
  </template>
  <list-rank v-else :list="rows" />
</template>

<script>
export default {
  data() {
    const { type = "LATEST" } = this.$route.query;
    return {
      checkMap: {},
      type,
      typeOpts: [
        { label: "For you", value: "FOR_YOU" },
        { label: "Latest", value: "LATEST" },
        { label: "Top", value: "RANKING_LIST" },
      ],
      rows: null,
      list: [
        {
          title: "Preact is a fast 3kB alternative to React with the same modern API.",
          img: "https://qs3.4everland.store/logos/preact.svg",
          star: false,
          starNum: 49,
        },
      ],
    };
  },
  watch: {
    type(type) {
      this.$router.replace({
        path: "/mossy",
        query: {
          type,
        },
      });
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.rows = null;
        const { data } = await this.$http.get("/stone/square", {
          params: {
            type: this.type,
            size: 60,
          },
        });
        this.rows = data;
      } catch (error) {}
    },
  },
};
</script>
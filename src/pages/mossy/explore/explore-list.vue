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
  <div class="mt-5 mb-6 d-center">
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

  <div v-if="!rows" class="row q-col-gutter-md">
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" v-for="i in 6" :key="i">
      <q-card flat>
        <q-skeleton height="120px" square />
      </q-card>
    </div>
  </div>
  <div v-else-if="!rows.length">
    <div class="pa-6"></div>
    <empty-stone />
  </div>
  <template v-else>
    <q-infinite-scroll
      v-if="type == 'FOR_YOU' || type == 'LATEST'"
      @load="onLoad"
      :disable="noMore || loadingMore"
    >
      <list-stone :list="rows" />
      <div class="ta-c mt-6" v-show="loadingMore">
        <q-spinner color="primary" size="3em" />
      </div>
      <div class="pa-3"></div>
    </q-infinite-scroll>
    <list-rank v-else :list="rows" />
  </template>
</template>

<script>
import { mapState } from "vuex";

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
      page: 1,
      noMore: false,
    };
  },
  computed: {
    ...mapState({
      myChainId: (s) => s.myChainId * 1,
    }),
  },
  watch: {
    myChainId() {
      this.getList();
    },
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
    async onLoad(index, done) {
      console.log(index);
      await this.getList(true);
      done();
    },
    async getList(isMore) {
      try {
        if (isMore) {
          this.loadingMore = true;
          this.page += 1;
        } else {
          this.page = 1;
          this.rows = null;
          this.noMore = false;
        }
        const size = this.type == "RANKING_LIST" ? 10 : 36;
        const { data } = await this.$http.get("/stone/square", {
          params: {
            type: this.type,
            page: this.page,
            size,
            chainId: this.myChainId,
          },
        });
        if (data.length < size - 5) {
          this.noMore = true;
        }
        if (isMore) {
          this.rows = [...this.rows, ...data];
        } else {
          this.rows = data;
        }
      } catch (error) {
        console.log(error);
      }
      this.loadingMore = false;
    },
  },
};
</script>

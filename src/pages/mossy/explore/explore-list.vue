<style>
.q-checkbox--dense .q-checkbox__label {
  padding-left: 3px;
}
</style>

<script setup>
import ListStone from "./list-stone.vue";
import ListRank from "./list-rank.vue";
</script>

<template>
  <div class="mb-6 d-center">
    <div class="bg-dark1 pa-2 bdrs-100">
      <q-btn-toggle
        class="rounded"
        v-model="type"
        unelevated
        toggle-color="primary"
        :options="[
          { label: 'For you', value: 'foryou' },
          { label: 'Popular', value: 'pop' },
          { label: 'Latest', value: 'latest' },
        ]"
      />
    </div>
  </div>

  <list-stone v-show="type == 'foryou' || type == 'pop'" :list="list" />
  <list-rank v-show="type == 'latest'" :list="list" />
</template>

<script>
export default {
  data() {
    const { type = "foryou" } = this.$route.query;
    return {
      checkMap: {},
      type,
      list: [
        {
          title: "Preact is a fast 3kB alternative to React with the same modern API.",
          img: "https://qs3.4everland.store/logos/preact.svg",
          star: false,
          starNum: 49,
        },
        {
          title: "Preact is a fast 3kB alternative to React with the same modern API.",
          img: "https://qs3.4everland.store/logos/preact.svg",
          star: false,
          starNum: 49,
        },
        {
          title: "Preact is a fast 3kB alternative to React with the same modern API.",
          img: "https://qs3.4everland.store/logos/preact.svg",
          star: false,
          starNum: 49,
        },
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
    },
  },
};
</script>
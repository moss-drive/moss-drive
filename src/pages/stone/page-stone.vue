<template>
  <div class="q-pa-md">
    <div class="row" v-if="!rows">
      <div v-for="i in 1" :key="i" class="col-12 col-sm-6 col-lg-4 pa-2">
        <q-card flat>
          <q-skeleton type="text" width="160px" class="text-subtitle1" />
          <q-skeleton height="260px" square />
        </q-card>
      </div>
    </div>
    <div v-else-if="!rows.length">
      <empty-stone />
    </div>
    <div class="row" v-else>
      <div class="col-12 col-sm-6 col-lg-4 pa-2" v-for="it in rows" :key="it.id">
        <img src="img/stone/stone-head.png" height="40px" class="d-b" />
        <div class="bg-card-1 stone-card pa-4 pos-r" style="top: -13px">
          <div class="pos-a right-0 top-0 m-3 pa-1 hover-1">
            <img src="/img/stone/stone-edit.svg" width="20" />
          </div>
          <div class="al-c">
            <div class="stone-cover">
              <q-img :src="it.avatar" width="110px" :ratio="1" />
            </div>
            <div class="ml-4">
              <p v-for="(row, j) in it.lines" :key="j">
                <span class="op-8">{{ row.label }}</span>
                <b class="color-2 fz-18 ml-2">{{ row.val || "-" }}</b>
              </p>
            </div>
          </div>
          <div class="mt-4">
            <p class="fw-b fz-20">{{ it.stoneName }}</p>
            <p class="mt-2 op-8">{{ it.bio }}</p>
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
    async getList() {
      try {
        const { data } = await this.$http.get("/stone");
        console.log(data);
        data.lines = [
          {
            label: "Supply",
            val: data.totalSupply,
          },
          {
            label: "Price",
            val: data.price,
          },
          {
            label: "Floor",
            val: data.floor,
          },
        ];
        this.rows = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
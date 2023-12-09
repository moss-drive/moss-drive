<template>
  <div class="q-pa-md">
    <div class="row" v-if="!rows">
      <div v-for="i in 2" :key="i" class="col-12 col-sm-6 col-lg-4 pa-2">
        <q-card flat>
          <q-skeleton height="240px" square />
        </q-card>
      </div>
    </div>
    <div class="ta-c" v-else-if="!rows.length">
      <div class="pa-8">
        <img src="/img/stone/stone-empty.svg" width="280" />
        <div class="fz-15 op-9">As empty as a cloudless sky</div>
      </div>
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
              <p v-for="i in 3" :key="i">
                <span class="op-8">Supply</span>
                <b class="color-2 fz-18 ml-2">230</b>
              </p>
            </div>
          </div>
          <div class="mt-4">
            <p class="fw-b fz-20">{{ it.stoneName }}</p>
            <p class="mt-2 op-8">{{ it.bio }}</p>
          </div>
          <div class="mt-3 al-c">
            <q-btn color="primary" class="flex-1" rounded>Stone Page</q-btn>
            <q-btn color="primary" class="flex-1 ml-4" outline rounded>Open</q-btn>
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
        this.rows = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
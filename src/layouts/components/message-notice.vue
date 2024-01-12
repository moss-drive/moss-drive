<template>
  <div class="notice-container pa-4">
    <div class="fw-b">Notification</div>
    <div class="al-c mt-4" v-if="!items.length" style="height: 397px">
      <empty-component emptyImg="/img/stone/stone-empty.svg"></empty-component>
    </div>
    <div class="mt-4" v-else style="height: 397px; overflow: scroll" id="scroll-target-id">
      <q-infinite-scroll
        @load="onLoad"
        :disable="!hasNext"
        :offset="100"
        scroll-target="#scroll-target-id"
      >
        <div v-for="(item, index) in items" :key="index" class="notice-item al-c pa-2">
          <div class="icon-bg d-center mr-2">
            <img src="/img/stone/x-round.svg" width="24" alt="" />
          </div>
          <div class="notice-content flex-1">
            <div class="fw-b fz-14 notice-text">
              AA New Vaccine Approved: Hope in Pandemic Fight.
            </div>
            <div class="al-c space-btw">
              <div class="fz-12 date">Apr 20 2023</div>
              <div class="fz-12 al-c cursor-p">
                <span>View All</span>
                <img src="/img/common/right-arrow.svg" width="16" alt="" />
              </div>
            </div>
          </div>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      limit: 10,
      hasNext: true,
      page: 1,
    };
  },
  created() {
    console.log(11);
    // do some request
  },
  methods: {
    onLoad(index, done) {
      setTimeout(() => {
        this.items.push({}, {}, {}, {}, {}, {}, {});
        done();
      }, 2000);
    },
    async checkRead() {
      try {
        const { data } = await this.$http.get("/broadcast/unread");
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async getList() {
      try {
        const { data } = await this.$http.get("/broadcast/messages", {
          params: {
            pageSize: this.limit,
            page: this.page,
          },
        });
        this.page++;
        console.log(data);
        const { hasNext, lastRead, currentH, items } = data;
        this.hasNext = hasNext;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-container {
  border-radius: 16px;
  background: #0f172a;
}
.icon-bg {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #334155;
}
.notice-item {
  border-radius: 8px;
  background: #1e293b;
  .notice-content {
    color: #fff;
    .date {
      color: #cbd5e1;
    }
  }
}

.notice-item + .notice-item {
  margin-top: 16px;
}
</style>

<style lang="scss">
.no-border {
  overflow: visible;
  th,
  tr,
  td {
    border: none;
  }
  tbody .empty-tr {
    td {
      height: 20px;
      opacity: 0;
    }
  }
}

.avatar {
  vertical-align: middle;
  border-radius: 33px;
  border: 0.5px solid rgba(255, 255, 255, 0.25);
}
</style>

<template>
  <div class="">
    <div class="row m-auto q-col-gutter-lg" style="max-width: 900px">
      <div class="col-12 col-sm-4" v-for="(item, i) in topThreeList" :key="item.id">
        <div class="bdrs-10 ov-h bg-dark2">
          <img
            :src="`/img/mossy/stone/rank-bg${i + 1}.png`"
            style="max-height: 120px"
            class="w100p d-b"
          />
          <div class="pa-5">
            <div class="pos-r pa-2 mb-4">
              <div class="pos-btm">
                <div class="stone-cover">
                  <q-img :src="item.avatar" width="90px" :ratio="1" />
                </div>
              </div>
            </div>
            <p class="fz-18 fw-b line-1">{{ item.stoneName }}</p>
            <div class="mt-1 fz-14 al-c">
              <img
                :src="item.twitterAvatar || '/img/stone/x-round.svg'"
                width="18"
                class="bdrs-100"
              />
              <span class="op-8 ml-1">{{ item.twitterName }}</span>
            </div>
            <q-btn
              :href="'/' + item.stoneId"
              target="_blank"
              color="primary"
              rounded
              class="full-width mt-4"
              >{{ $formatEther(item.price) }} ETH</q-btn
            >
          </div>
        </div>
      </div>
    </div>

    <div class="ov-a mt-6" style="max-width: 1350px">
      <q-markup-table class="no-border" flat square :bordered="false">
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Stone</th>
            <th class="text-left">Author</th>
            <th class="text-left">Pool Value</th>
            <th class="text-left">Current Price</th>
            <th class="text-left">Supply</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in otherList" :key="item.id">
            <tr class="bg-dark2 q-touch pos-r" @click="onRow(item)">
              <td class="text-left">
                <b class="fz-18">{{ index + 4 }}</b>
              </td>
              <td class="text-left">
                <div class="al-c">
                  <div class="stone-cover">
                    <q-img :src="item.avatar" width="58px" :ratio="1" />
                  </div>
                  <b class="ml-4 fz-16">{{ item.stoneName }}</b>
                </div>
              </td>
              <td class="">
                <img class="avatar mr-1" width="24" :src="item.twitterAvatar" alt="" />
                <span> {{ item.twitterName }}</span>
              </td>
              <td class="text-left fw-b">{{ $formatEther(item.worth) }} ETH</td>
              <td class="text-left fw-b">{{ $formatEther(item.price) }} ETH</td>
              <td class="text-left fw-b">
                <div class="al-c space-btw">
                  <span class="fw-b">
                    {{ item.totalSupply }}
                  </span>
                  <img width="24" src="/img/mossy/icon/arrows.svg" alt="" />
                </div>
              </td>
            </tr>
            <tr class="empty-tr">
              <td></td>
            </tr>
          </template>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    topThreeList() {
      if (!this.list) return [];

      return this.list.slice(0, 3);
    },
    otherList() {
      if (!this.list) return [];
      return this.list.slice(3);
    },
  },
  methods: {
    onRow(item) {
      // this.$router.push(``);
      window.open(`/${item.stoneId}`);
    },
  },
};
</script>

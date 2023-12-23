<style lang="scss">
$corner: 36px;
.td-corner {
  position: absolute;
  content: "";
  top: 0;
  height: 100%;
  width: $corner;
  background: url(/img/mossy/stone/td-corner.svg) 0 0 no-repeat;
  background-size: contain;
}
.no-border {
  overflow: visible;
  th,
  tr,
  td {
    border: none;
  }

  tr.pos-r {
    td:first-of-type {
      &:before {
        @extend .td-corner;
        left: -$corner;
      }
    }
    td:last-of-type {
      &:after {
        @extend .td-corner;
        // right: -$corner;
        left: 100%;
        transform: rotateX(180deg) rotateY(180deg);
      }
    }
  }
  tr.pos-r:hover {
    td:first-of-type {
      &:before {
        background-image: url(/img/mossy/stone/td-corner-hover.svg);
      }
    }
    td:last-of-type {
      &:after {
        background-image: url(/img/mossy/stone/td-corner-hover.svg);
      }
    }
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
  <div class="pa-8 pt-0">
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
            <p class="fz-18 fw-b">{{ item.stoneName }}</p>
            <div class="mt-1 fz-14 op-8">{{ item.twitterName }}</div>
            <q-btn color="primary" rounded class="full-width mt-4" @click="onRow(item)"
              >{{ formatEther(item.worth) }} ETH</q-btn
            >
          </div>
        </div>
      </div>
    </div>

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
            <td class="text-left fw-b">{{ formatEther(item.worth) }} ETH</td>
            <td class="text-left fw-b">{{ formatEther(item.price) }} ETH</td>
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
</template>
<script>
import { formatEther } from "ethers/lib/utils";
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
    formatEther: formatEther,
    onRow(item) {
      this.$router.push(`/mossy/stone?id=${item.id}`);
    },
  },
};
</script>

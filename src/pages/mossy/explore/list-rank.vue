<style lang="scss">
$corner: 39px;
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
</style>

<template>
  <div class="pa-8 pt-0">
    <div class="row m-auto q-col-gutter-lg" style="max-width: 900px">
      <div class="col-12 col-sm-4" v-for="i in 3" :key="i">
        <div class="bdrs-10 ov-h bg-dark2">
          <img
            :src="`/img/mossy/stone/rank-bg${i}.png`"
            style="max-height: 120px"
            class="w100p d-b"
          />
          <div class="pa-5">
            <div class="pos-r pa-2 mb-4">
              <div class="pos-btm">
                <div class="stone-cover">
                  <q-img
                    src="https://qs3.4everland.store/logos/preact.svg"
                    width="110px"
                    :ratio="1"
                  />
                </div>
              </div>
            </div>
            <p class="fz-18 fw-b">this is a test</p>
            <div class="mt-1 fz-14 op-8">elon</div>
            <q-btn color="primary" rounded class="full-width mt-4">0.0009 ETH</q-btn>
          </div>
        </div>
      </div>
    </div>

    <q-markup-table class="no-border" flat square :bordered="false">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Stone</th>
          <th class="text-right">Author</th>
          <th class="text-right">Pool Value</th>
          <th class="text-right">Current Price</th>
          <th class="text-right">Supply</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="i in 3" :key="i">
          <tr class="bg-dark2 q-touch pos-r">
            <td class="text-left">
              <b class="fz-18">{{ i }}</b>
            </td>
            <td class="text-left">
              <div class="al-c">
                <div class="stone-cover">
                  <q-img
                    src="https://qs3.4everland.store/logos/preact.svg"
                    width="64px"
                    :ratio="1"
                  />
                </div>
                <b class="ml-2 fz-16">DSDS001</b>
              </div>
            </td>
            <td class="text-right">Elon</td>
            <td class="text-right">87</td>
            <td class="text-right">87</td>
            <td class="text-right">87</td>
          </tr>
          <tr class="empty-tr">
            <td></td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
  </div>
</template>
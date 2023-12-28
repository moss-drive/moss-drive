<style lang="scss">
</style>

<template>
  <q-table
    color="primary"
    flat
    :rows="rows"
    :columns="columns"
    row-key="name"
    :selection="selection"
    v-model:selected="selected"
    hide-pagination
    :rows-per-page-options="[0]"
  >
    <!-- <template #header> </template> -->
    <template #body="scope">
      <q-tr
        class="driver-list-item"
        :class="{
          active: checked.includes(scope.row.key),
          'file-item': !scope.row.prefix,
        }"
        :props="scope"
        @click="onRow(scope.row, scope.rowIndex)"
      >
        <q-td style="width: 50px" v-if="selection == 'multiple'">
          <q-checkbox
            size="40px"
            color="primary"
            keep-color
            :model-value="checked.includes(scope.row.key)"
            @click="$emit('row-check', scope.row)"
          />
        </q-td>
        <q-td key="name">
          <div class="al-c">
            <div class="pos-r">
              <q-img
                :src="scope.row.icon"
                spinner-size="20px"
                width="32px"
                class="cover ev-n trans-100"
                :class="{
                  'op-2': scope.rowIndex === loading,
                }"
              ></q-img>
              <div class="pos-center" v-if="scope.rowIndex === loading">
                <q-spinner-ios color="warning" size="20px" />
              </div>
            </div>
            <span class="fz-15 ml-3">{{ scope.row.name }}</span>
          </div>
        </q-td>
        <q-td key="cid" v-if="isPage">
          <div class="al-c" v-if="scope.row.cid && uid" @click.stop>
            <a class="hover-1" :href="$bucket.getIpfsLink(uid, scope.row.cid)" target="_blank">{{
              scope.row.cid.cutStr(8, 5)
            }}</a>
            <q-icon
              name="content_copy"
              class="ml-1 hover-1 pa-2"
              @click="$copy(scope.row.cid)"
            ></q-icon>
          </div>
        </q-td>
        <q-td key="size" v-if="isPage">
          {{ scope.row.sizeUnit }}
        </q-td>
        <q-td key="lastModified" v-if="isPage">
          {{ scope.row.updatedAt }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapState } from "vuex";
export default {
  emits: ["row-click", "row-check"],
  props: {
    isPage: Boolean,
    rows: Array,
    loading: null,
    checked: Array,
    selection: String,
  },
  data() {
    return {
      selected: [],
      activeIdx: -1,
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.userInfo.uid,
    }),
    columns() {
      let cols = [
        {
          name: "Key",
          required: true,
          label: "Name",
          align: "left",
          field: "name",
          // field: (row) => row.name,
          // format: (val) => `${val}`,
          sortable: true,
        },
      ];
      if (this.isPage) {
        cols = cols.concat([
          { name: "cid", align: "left", label: "CID", field: "cid" },
          { name: "size", align: "left", label: "Size", field: "size", sortable: true },
          {
            name: "updatedAt",
            align: "left",
            label: "Update Time",
            field: "lastModified",
            sortable: true,
          },
        ]);
      }
      return cols;
    },
  },
  methods: {
    onRow(row, index) {
      // this.activeIdx = this.activeIdx == idx ? -1 : idx
      this.$emit("row-click", {
        row,
        index,
      });
    },
  },
};
</script>

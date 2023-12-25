<script setup>
import ActDelete from "./act-delete.vue";
import ActMove from "./act-move.vue";
import ActStone from "./act-stone.vue";
import ActShare from "./act-share.vue";
</script>

<template>
  <div
    v-show="checked.length > 0"
    :class="{
      'x-center pos-f z-100': screen.xs,
    }"
    style="bottom: 30px"
  >
    <q-btn-group class="split-line" rounded>
      <q-btn
        @click="onAct(it.name)"
        color="primary"
        :class="{
          disable: it.disabled,
        }"
        v-for="it in objMenus"
        :key="it.name"
      >
        <img :src="`/img/driver/${it.icon || it.name}.svg`" width="22" />
        <q-tooltip anchor="top middle" :offset="[0, 28]" class="bg-black" v-if="!it.disabled">
          {{ it.tip || it.name.capitalize() }}
        </q-tooltip>
      </q-btn>
    </q-btn-group>
  </div>

  <act-delete ref="delete" :check-list="checkList" />
  <act-move ref="move" :check-list="checkList" />
  <act-stone ref="stone" :check-item="checkItem" />
  <act-share ref="share" :check-list="checkList" />
</template>

<script>
import { useQuasar } from "quasar"; // copyToClipboard
import { mapState } from "vuex";

export default {
  props: {
    checked: Array,
    objList: Array,
    stoneNum: Number,
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    objMenus() {
      const len = this.checked.length;
      let isFile = false;
      let isRootDir = false;
      if (len == 1) {
        const row = this.checkList[0];
        isFile = !!row.url;
        if (!isFile) isRootDir = row.key.split("/").length == 2;
        // console.log(row);
      }
      return [
        {
          name: "publish",
          icon: "stone",
          disabled: !(len == 1 && isRootDir && this.checkItem.type == "folder"),
          tip: "Claim Stone",
        },
        {
          name: "share",
        },
        {
          name: "move",
          disabled: this.checkList.filter((it) => it.prefix).length > 0,
        },
        {
          name: "download",
          disabled: !isFile,
        },
        {
          name: "delete",
          icon: "trash",
          disabled: this.checkList.find((it) => it.type == "stone"),
        },
      ];
    },
    checkList() {
      return this.objList.filter((it) => this.checked.includes(it.key));
    },
    checkItem() {
      return this.checkList[0];
    },
  },
  methods: {
    async onAct(name) {
      // console.log(name, rows);
      const item = this.checkItem;
      if (name == "publish") {
        if (this.stoneNum) {
          return this.$alert(
            "In order to enable creators to concentrate more on managing their Stones effectively, the current version only permits users to create ONE Stone. We will introduce the option to create multiple Stones in future releases."
          );
        }
        if (localStorage.bindX) {
          localStorage.bindX = "";
          return location.reload();
        }
        if (!this.userInfo.twitterId) {
          window.open("/login");
          return;
        }
        this.$refs.stone.showPop = true;
      } else if (name == "share") {
        this.$refs.share.showPop = true;
        // await copyToClipboard(item.url);
        // this.$toast("Copied", 1);
      } else if (name == "download") {
        window.open(item.url);
      } else if (name == "delete") {
        this.$refs.delete.showPop = true;
      } else if (name == "move") {
        this.$refs.move.showPop = true;
      }
    },
  },
};
</script>
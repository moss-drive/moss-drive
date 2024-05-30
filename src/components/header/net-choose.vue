<template>
  <q-btn class="ml-3 btn-bd-1 px-1 bg-header" flat rounded :size="btnSize" @click="$emit('click')">
    <net-icon :size="dense ? 18 : 24" />
    <span class="ml-2 fz-13" v-if="!dense">
      <span v-if="curItem">{{ curItem.name }}</span>
      <span v-else>Switch Network</span>
    </span>
    <img src="/img/common/ic-down.svg" width="10" class="ml-2" />

    <q-menu v-if="isConnect" style="width: 150px" auto-close>
      <q-list>
        <q-item
          @click="onItem(it)"
          :clickable="myChainId != it.id"
          v-for="it in list"
          :key="it.name"
        >
          <div class="al-c">
            <q-avatar size="22px">
              <img :src="`/img/common/${it.icon}`" />
            </q-avatar>
            <span class="ml-2">{{ it.name }}</span>
          </div>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mapState } from "vuex";
import { useQuasar } from "quasar";

export default {
  props: {
    isConnect: Boolean,
    netList: Array,
    dense: Boolean,
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    ...mapState({
      myChainId: (s) => s.myChainId,
    }),
    list() {
      return [
        ...this.netList,
        // {
        //   name: "Blast Testnet ",
        //   icon: "net-blast.png",
        //   link: "https://blast-test.mymoss.io/",
        // },
      ];
    },
    curItem() {
      return this.netList.find((it) => it.id == this.myChainId);
    },
    asMobile() {
      return this.screen.width < 690;
    },
    btnSize() {
      return this.dense ? "xs" : "sm";
    },
  },
  methods: {
    onItem(it) {
      if (it.link) window.open(it.link);
      else this.$emit("item", it);
    },
  },
};
</script>
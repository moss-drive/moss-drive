<template>
  <q-btn
    class="ml-3"
    :class="{
      'q-px-sm': !asMobile,
    }"
    color="info"
    rounded
    :round="asMobile"
    :size="btnSize"
    @click="$emit('click')"
  >
    <net-icon />
    <!-- <span v-if="!asMobile" class="ml-2 fz-14">Optimism</span> -->

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
import { netList } from "../../utils/wallet";

export default {
  props: {
    isConnect: Boolean,
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      netList,
    };
  },
  computed: {
    ...mapState({
      myChainId: (s) => s.myChainId,
    }),
    list() {
      return [
        ...netList,
        {
          name: "Blast Testnet ",
          icon: "net-blast.png",
          link: "https://blast-test.mymoss.io/",
        },
      ];
    },
    asMobile() {
      return this.screen.width < 690;
    },
    btnSize() {
      return this.asMobile ? "12px" : null;
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
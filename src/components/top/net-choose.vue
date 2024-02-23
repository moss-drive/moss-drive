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
  >
    <q-avatar size="22px">
      <img src="/img/common/net-error.svg" />
    </q-avatar>
    <!-- <span v-if="!asMobile" class="ml-2 fz-14">Optimism</span> -->

    <q-menu style="width: 150px" auto-close>
      <q-list>
        <q-item clickable v-for="it in netList" :key="it.name">
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
import { useQuasar } from "quasar";
import { netList } from "../../utils/wallet";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      netList,
    };
  },
  computed: {
    asMobile() {
      return this.screen.width < 690;
    },
    btnSize() {
      return this.asMobile ? "12px" : null;
    },
  },
};
</script>
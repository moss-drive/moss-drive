<template>
  <q-btn
    v-show="!asMobile"
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
      <img src="/img/temp/net-op.png" />
    </q-avatar>
    <span v-if="!asMobile" class="ml-2 fz-14">Optimism</span>

    <q-menu style="width: 150px" auto-close>
      <q-list>
        <q-item clickable>
          <div class="al-c">
            <q-avatar size="22px">
              <img src="/img/temp/net-op.png" />
            </q-avatar>
            <span class="ml-2">Optimism</span>
          </div>
        </q-item>
        <q-item>
          <div class="al-c">
            <q-avatar size="22px">
              <img src="/img/temp/net-blast.png" />
            </q-avatar>
            <div class="ml-2">
              <div class="fz-12 bdrs-100" style="background: #004d3b; padding: 1px 4px">
                Coming soon
              </div>
              <p class="op-7">Blast</p>
            </div>
          </div>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
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
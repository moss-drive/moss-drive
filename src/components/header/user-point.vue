<script setup>
import UserTask from "./user-task.vue";
</script>

<style lang="scss">
.btn-sm1 {
  padding: 5px 8px;
  .bd-img {
    border: 3px solid #000;
    border-radius: 100px;
  }
}
</style>

<template>
  <div class="al-c">
    <q-btn v-if="blastPoint" size="sm" rounded color="info" class="btn-sm1 mr-3">
      <img src="/img/common/net-blast.png" width="26" class="bd-img" />
      <span class="text-white ml-1 fz-14">{{ blastPoint }}</span>
      <q-menu :offset="[0, 10]" style="width: 300px">
        <ul>
          <li>Your TVL in Moss earns Blast points, these Blast points are updated periodically.</li>
          <li class="mt-3">Finalized points can be checked on the Blast website.</li>
        </ul>
      </q-menu>
    </q-btn>
    <q-btn size="sm" rounded color="info" class="btn-sm1">
      <img src="/img/mossy/icon/ic-coin.png" width="26" />
      <span class="text-white ml-1 fz-14">{{ pointInfo.total }}</span>
      <q-menu
        anchor="bottom middle"
        :offset="[0, 10]"
        self="top middle"
        :style="{
          width: menuWidth + 'px',
        }"
      >
        <user-task :userInfo="userInfo" :uid="uid" />
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    menuWidth: Number,
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      uid: (s) => s.loginData.uuid,
    }),
    ...mapState("taskStore", ["pointInfo"]),
    blastPoint() {
      return this.pointInfo.blast?.points || "0";
    },
  },
};
</script>
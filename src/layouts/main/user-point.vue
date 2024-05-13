<script setup>
import UserTask from "./user-task.vue";
</script>

<template>
  <div class="al-c">
    <q-btn size="sm" rounded color="info" style="padding: 5px 8px">
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
  },
};
</script>
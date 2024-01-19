<template>
  <q-card class="bg-card-1" style="border: 1px solid #334155">
    <q-card-sectio>
      <div class="task-header">
        <div class="tast-title">Moss Tasks</div>
        <div>
          <q-btn flat round @click="init">
            <q-icon size="24px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
                  stroke="#CBD5E1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </q-icon>
          </q-btn>
        </div>
      </div>
    </q-card-sectio>

    <div class="mt-1">
      <q-tabs class="bdb-1" v-model="tabIdx" dense active-color="primary" no-caps>
        <q-tab name="daily" label="Daily" />
        <q-tab name="achievement" label="Achievement" />
      </q-tabs>
    </div>
    <div>
      <div class="task-box" v-show="tabIdx == 'daily'">
        <div v-if="!dailyList">
          <div class="mb-3" v-for="i in 4" :key="i">
            <q-skeleton type="QSlider" height="54px" />
          </div>
        </div>
        <template v-else>
          <div
            class="task-item"
            :class="{
              'task-item-done': item.status == 'COMPLETED',
            }"
            v-for="item in dailyList.items"
            :key="item"
          >
            <div class="task-item-left">
              <q-knob
                readonly
                v-model="item.value"
                show-value
                size="36px"
                :thickness="0.22"
                :color="item.status == 'COMPLETED' ? 'done' : 'primary'"
                track-color="knob"
              >
                <q-avatar size="32px">
                  <img src="/img/mossy/icon/ic-coin.png" />
                </q-avatar>
              </q-knob>
              <div>
                <div class="task-name">{{ item.name }}</div>
                <div class="task-desc">
                  +{{ item.step }} Points&nbsp;&nbsp;&nbsp;&nbsp;Claimed
                  <span class="task-val">{{ item.recv }}</span>
                </div>
              </div>
            </div>
            <div>
              <q-btn
                color="primary"
                rounded
                v-if="item.status == 'ON_GOING'"
                style="width: 100px"
                @click="nextStep(item)"
              >
                Do Task
              </q-btn>
              <q-btn
                color="primary"
                rounded
                v-if="item.status == 'CLAIM'"
                style="width: 100px"
                @click="nextStep(item)"
              >
                Claim {{ item.reward }}
              </q-btn>
              <q-btn
                disable
                rounded
                v-if="item.status == 'COMPLETED'"
                style="background-color: #475569; color: #64748b; width: 100px"
              >
                Done
              </q-btn>
            </div>
          </div>
        </template>
      </div>
      <div class="task-box" v-show="tabIdx == 'achievement'">
        <div v-if="!achievementsList">
          <div class="mb-3" v-for="i in 4" :key="i">
            <q-skeleton type="QSlider" height="54px" />
          </div>
        </div>
        <template v-else>
          <div
            class="task-item"
            :class="{
              'task-item-done': item.taskStatus == 'COMPLETED',
            }"
            v-for="item in achievementsList.list"
            :key="item"
          >
            <div class="task-item-left">
              <!-- <q-knob
                readonly
                v-model="item.value"
                show-value
                size="36px"
                :thickness="0.22"
                :color="item.taskStatus == 'COMPLETED' ? 'done' : 'primary'"
                track-color="knob"
              >
                <q-avatar size="32px">
                  <img src="/img/mossy/icon/ic-coin.png" />
                </q-avatar>
              </q-knob> -->
              <q-avatar size="36px">
                <img src="/img/mossy/icon/ic-coin-nopro.png" />
              </q-avatar>
              <div>
                <div class="task-name">{{ item.name }}</div>
                <div class="task-desc">+{{ item.reward }} Points</div>
              </div>
            </div>
            <div>
              <q-btn
                v-if="item.taskStatus == 'ON_GOING'"
                :disable="item.type == 'USE_ALL_INVITES'"
                color="primary"
                rounded
                style="width: 100px"
                @click="nextStep(item)"
              >
                Do Task
              </q-btn>
              <q-btn
                color="primary"
                rounded
                v-if="item.taskStatus == 'CLAIM'"
                style="width: 100px"
                @click="nextStep(item)"
              >
                Claim {{ item.reward }}
              </q-btn>
              <q-btn
                disable
                rounded
                v-if="item.taskStatus == 'COMPLETED'"
                style="background-color: #475569; color: #64748b; width: 100px"
              >
                Done
              </q-btn>
            </div>
          </div>
        </template>
      </div>
    </div>
  </q-card>
</template>

<script>
import { fetchDailyList, fetchAchievementsList, fetchNext } from "@/api/task.js";

export default {
  props: {
    userInfo: Object,
    uid: String,
  },
  data() {
    return {
      tabIdx: "daily",
      dailyList: null,
      achievementsList: null,
    };
  },
  computed: {},
  watch: {
    tabIdx(val) {
      if (val == "daily") this.getDaily();
      else if (val == "achievement") this.getAchievements();
    },
  },
  created() {
    this.getDaily();
  },
  methods: {
    async init() {
      this.getDaily();
      this.getAchievements();
      this.$store.dispatch("taskStore/getPoint");
    },
    async getDaily() {
      try {
        const { data } = await fetchDailyList();
        data.items.forEach((item) => {
          item.reward = item.cur * item.step - item.recv;
          item.value = (item.cur / item.upLimit) * 100;
        });
        this.dailyList = data;
        console.log(this.dailyList);
      } catch (error) {
        console.log(error);
      }
    },
    async getAchievements() {
      try {
        const { data } = await fetchAchievementsList();
        data.list.forEach((item) => {
          item.value = item.taskStatus === "ON_GOING" ? 0 : 100;
        });
        this.achievementsList = data;
      } catch (error) {
        console.log(error);
      }
    },
    async nextStep(item) {
      try {
        const { data } = await fetchNext(item.id);
        this.onAfterNext(item, data);
      } catch (error) {
        console.log(error);
      }
    },
    async onAfterNext(item, data) {
      switch (data.next) {
        case "JUMP":
          // this.$router.push(data.message);
          window.location.href = data.message;
          break;
        case "OPEN_NEW_TAB":
          window.open(data.message);
          break;
        case "POPUP":
          this.onPopup(item, data);
          break;
        case "POPUP_S_C_T":
          this.onPopupMint(item, data);
          break;
        // case "EMAIL_BIND":
        //   this.onEmailBind();
        //   break;
        case "NONE":
          this.init();
          break;
        default:
          break;
      }
    },
    async onPopup(item, data) {
      await this.$alert(`${data.message}`, {
        title: `+${item.reward} Points`,
      });
      this.init();
    },
    async onPopupMint(item, data) {
      await this.$alert(data.message, { title: data.tips });
      this.init();
    },
  },
};
</script>

<style lang="scss">
.text-knob {
  color: #0f172a !important;
}
.bg-knob {
  background: #0f172a !important;
}
.text-done {
  color: #004d3b !important;
}
.bg-done {
  color: #004d3b !important;
}

.task-header {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tast-title {
    color: #fff;
    font-family: SF Pro Text;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
.task-box {
  padding: 16px;
  // max-height: 290px;
  // overflow: scroll;
  .task-item {
    display: flex;
    width: 100%;
    padding: 8px;
    justify-content: space-between;
    align-items: center;
    border-radius: 100px;
    border: 1px solid rgba(30, 239, 164, 0.25);
    background: #1e293b;
    margin-bottom: 16px;

    .task-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: SF Pro Text;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      .task-name {
        color: #fff;
        font-weight: 700;
      }
      .task-desc {
        color: #cbd5e1;
      }
      .task-val {
        color: #1eefa4;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .task-item-done {
    border: 1px solid #334155;
  }
}
</style>

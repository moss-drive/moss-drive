<template>
  <q-card class="bg-card-1">
    <q-card-section>
      <div>
        <div>Moss Tasks</div>
      </div>
    </q-card-section>

    <div class="mt-1">
      <q-tabs class="bdb-1" v-model="tabIdx" dense active-color="primary" no-caps>
        <q-tab name="daily" label="Daily" />
        <q-tab name="achievement" label="Achievement" />
      </q-tabs>
    </div>
    <div>
      <div class="task-box" v-show="tabIdx == 'daily'">
        <div v-if="!dailyList">
          <div class="mb-3" v-for="i in 5" :key="i">
            <q-skeleton type="QSlider" height="54px" />
          </div>
        </div>
        <template v-else>
          <div class="task-item" v-for="item in dailyList.items" :key="item">
            <div class="task-item-left">
              <q-knob
                readonly
                :value="(item.cur / item.upLimit) * 100"
                show-value
                size="36px"
                :thickness="0.22"
                color="primary"
                track-color="knob"
              >
                <q-avatar size="32px">
                  <img src="/img/mossy/icon/ic-coin.png" />
                </q-avatar>
              </q-knob>
              <div>
                <div class="task-name">{{ item.name }}</div>
                <div class="task-desc">
                  +{{ item.step }} points Claimed
                  <span class="task-val">{{ item.recv }}</span>
                </div>
              </div>
            </div>
            <div>
              <q-btn
                color="primary"
                rounded
                v-if="item.status == 'ON_GOING'"
                style="width: 84px"
                @click="nextStep(item)"
              >
                Do Task
              </q-btn>
              <q-btn
                color="primary"
                rounded
                v-if="item.status == 'CLAIM'"
                style="width: 84px"
                @click="nextStep(item)"
              >
                Claim {{ item.cur * item.step - item.recv }}
              </q-btn>
              <q-btn
                disable
                rounded
                v-if="item.status == 'COMPLETED'"
                style="background-color: #475569; color: #64748b; width: 84px"
              >
                Done
              </q-btn>
            </div>
          </div>
        </template>
      </div>
      <div class="task-box" v-show="tabIdx == 'achievement'">
        <div v-if="!nftList">
          <div class="mb-3" v-for="i in 5" :key="i">
            <q-skeleton type="QSlider" height="54px" />
          </div>
        </div>
        <template v-else>
          <div class="task-item" v-for="item in 9" :key="item">
            <div class="task-item-left">
              <q-knob
                readonly
                v-model="value"
                show-value
                size="36px"
                :thickness="0.22"
                color="primary"
                track-color="knob"
              >
                <q-avatar size="32px">
                  <img src="/img/mossy/icon/ic-coin.png" />
                </q-avatar>
              </q-knob>
              <div>
                <div class="task-name">Login</div>
                <div class="task-desc">+2 points Claimed <span class="task-val">0</span></div>
              </div>
            </div>
            <div>
              <q-btn color="primary" rounded> Do Task </q-btn>
            </div>
          </div>
        </template>
      </div>
    </div>
  </q-card>
</template>

<script>
import { fetchPoint, fetchDailyList, fetchAchievementsList, fetchNext } from "@/api/task.js";

export default {
  props: {
    userInfo: Object,
    uid: String,
  },
  data() {
    return {
      tabIdx: "daily",
      dailyList: null,
      inviteList: null,
      inviteErr: null,
      value: 70,
    };
  },
  computed: {},
  watch: {
    tabIdx(val) {
      if (val == "daily") this.getDaily();
      else if (val == "achievement") this.getInvites();
    },
  },
  created() {
    this.getDaily();
  },
  methods: {
    async getDaily() {
      try {
        const { data } = await fetchDailyList();
        this.dailyList = data;
      } catch (error) {
        this.nftErr = error.message;
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
          this.$router.push(data.message);
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
        case "EMAIL_BIND":
          this.onEmailBind();
          break;
        case "NONE":
          this.init();
          break;
        default:
          break;
      }
    },
    async onPopup(item, data) {
      await this.$alert(`+${item.reward} Points`, data.message, {
        maxWidth: 300,
        textCenter: true,
      });
      this.init();
    },
    async onPopupMint(item, data) {
      await this.$alert(data.tips, data.message);
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
.task-box {
  padding: 16px;
  max-height: 360px;
  overflow: scroll;
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
  }
}
</style>

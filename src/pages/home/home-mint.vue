<template>
  <div class="home-bg">
    <q-img
      v-if="!asMobile"
      src="@/assets/imgs/home/mint-bg.png"
      style="width: 100%; max-width: 1138px"
    />
    <div style="width: 100%; padding: 0 10px" v-if="freeMintStart">
      <q-img
        src="@/assets/imgs/home/mint-start.png"
        style="margin-top: 16px; width: 100%; max-width: 400px"
      />
      <div class="mt-4">
        <q-btn color="primary" rounded class="go-mint" to="/mint">Mint now</q-btn>
      </div>
    </div>
    <div style="width: 100%; padding: 0 10px" v-else>
      <div class="cutdown-time">
        <span class="time">{{ freeMinttTime.hour }}</span>
        <span>:</span>
        <span class="time">{{ freeMinttTime.minute }}</span>
        <span>:</span>
        <span class="time">{{ freeMinttTime.second }}</span>
      </div>
      <q-img
        src="@/assets/imgs/home/mint-text.png"
        style="margin-top: 16px; width: 100%; max-width: 400px"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      freeMintStartAt: 1704787200000,
      freeMinttTime: {
        hour: "00",
        minute: "00",
        second: "00",
      },
      freeMintStart: false,
    };
  },
  computed: {
    ...mapState({
      loginData: (s) => s.loginData,
    }),
    asMobile() {
      return this.screen.width < 700;
    },
    isFix() {
      return this.screen.width < 1000;
    },
    loginCls() {
      if (this.isFix) {
        return this.asMobile ? "pos-center pos-f right-0" : "y-center pos-f right-0 mr-5";
      }
      return "y-center";
    },
  },
  created() {
    this.initTime();
  },
  methods: {
    initTime() {
      let freeStartTimer;
      const setTime = () => {
        const freeMinttTime = this.cutdonw(this.freeMintStartAt);
        if (freeMinttTime) {
          this.freeMinttTime = freeMinttTime;
        } else {
          this.freeMintStart = true;
          if (freeStartTimer) {
            clearInterval(freeStartTimer);
          }
        }
      };
      setTime();
      freeStartTimer = setInterval(setTime, 1000);
    },
    cutdonw(startTime, endTime) {
      function num(n) {
        if (n < 0) {
          n = 0;
        }
        return n < 10 ? "0" + n : n;
      }
      let nowTime = new Date().getTime();
      let countDown = startTime - nowTime;
      if (countDown <= 0) {
        return false;
      } else {
        let oHour = Math.floor(countDown / 1000 / 60 / 60);
        let oMinute = Math.floor((countDown / 1000 / 60) % 60);
        let oSecond = Math.floor((countDown / 1000) % 60);
        return {
          hour: num(oHour),
          minute: num(oMinute),
          second: num(oSecond),
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-bg {
  text-align: center;
  margin-top: 16px;
  width: 100%;
}
.cutdown-time {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  span {
    color: #fff;
    font-family: DIN Alternate;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    color: #1eefa4;
  }
  .time {
    padding: 12px 8px;
    color: #1eefa4;
    text-align: center;
    background: #0f172a;
    border-radius: 8px;
    border: 1px solid #1eefa4;
  }
}
.mint-text {
  color: #1eefa4;
  font-family: Montserrat;
  font-size: 24px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  text-transform: uppercase;
  margin-top: 15px;
}
.go-mint {
  width: 330px;
  height: 61px;
  color: #0f172a;
  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
  animation: pulse 2s infinite;
  position: relative;
  z-index: 999;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>

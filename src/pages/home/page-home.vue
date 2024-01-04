<style lang="scss">
.bg-home {
  min-height: 100vh;
  background: #000 url(/img/home/bg.png) right 0 no-repeat;
  background-size: contain;
  background-attachment: fixed;
}
</style>

<script setup>
// import HomeList from "./home-list.vue";
import HomeImg from "./home-img.vue";
import HomeLogin from "./home-login.vue";
import HomeBtm from "./home-btm.vue";
import HeaderRight from "../../layouts/header-right.vue";
</script>

<template>
  <div class="bg-home h-flex">
    <div class="pos-f top-0 w100p z-100">
      <div class="al-c">
        <a href="/" class="al-c pa-3 ml-5">
          <img src="/img/moss.svg" height="40" />
          <img src="/img/home/moss-txt.svg" height="26" class="ml-2" />
        </a>
        <div class="ml-auto" v-if="loginData.uuid">
          <header-right :border="false"></header-right>
        </div>
      </div>
    </div>
    <div class="row flex-1" style="">
      <div
        :class="isFix ? 'col-12' : 'col-8'"
        style="margin: auto 0"
        :style1="!asMobile ? 'transform: perspective(3000px) rotateY(40deg)' : 'padding: 30px'"
      >
        <div class="home-bg">
          <q-img src="@/assets/imgs/home/mint-bg.png" style="width: 100%; max-width: 1138px" />
          <div>
            <div class="cutdown-time">
              <span class="time">{{ freeMinttTime.hour }}</span>
              <span>:</span>
              <span class="time">{{ freeMinttTime.minute }}</span>
              <span>:</span>
              <span class="time">{{ freeMinttTime.second }}</span>
            </div>
            <!-- <div class="mint-text">Time Until Free Mint Starts</div> -->
            <q-img src="@/assets/imgs/home/mint-text.png" width="400px" style="margin-top: 16px" />
          </div>
        </div>
        <!-- <home-img class="pos-r" style="left: -90px" /> -->
        <!-- <home-list :asMobile="asMobile" /> -->
      </div>
      <div class="col-4 h100p pos-r">
        <home-login :class="loginCls" />
      </div>
    </div>
    <home-btm />
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
</style>

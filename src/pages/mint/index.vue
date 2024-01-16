<template>
  <div class="mint-page">
    <div class="banner-box">
      <div class="al-c header">
        <a href="/">
          <img src="@/assets/imgs/mint/logo.svg" height="56" style="display: block" />
        </a>
        <div class="ml-auto">
          <header-right :border="false" :noInvited="true"></header-right>
        </div>
      </div>
      <div class="container banner">
        <q-img src="@/assets/imgs/mint/h1.png" width="100%" style="max-width: 1266px"></q-img>
        <q-img class="banner-pos-left" src="@/assets/imgs/mint/image_65.png" width="172px"></q-img>
        <q-img class="banner-pos-right" src="@/assets/imgs/mint/image_68.png" width="190px"></q-img>
        <div v-if="phase == 3" style="margin-top: 60px">
          <q-img src="@/assets/imgs/mint/mintend.png" style="width: 100%; max-width: 656px"></q-img>
        </div>
        <div class="start-mint" v-else>
          <div class="cutdown-time" v-if="!freeMintStart">
            <span class="time">{{ freeMinttTime.hour }}</span>
            <span>:</span>
            <span class="time">{{ freeMinttTime.minute }}</span>
            <span>:</span>
            <span class="time">{{ freeMinttTime.second }}</span>
          </div>
          <template v-if="!freeMintEnd">
            <div>
              <q-btn
                class="mint-btn"
                :class="{ 'mint-btn-disable': !freeMintStart || freeMintEnd }"
                @click="onMint"
                :disable="!freeMintStart || freeMintEnd"
                >Free Mint</q-btn
              >
              <div class="mint-info">
                <div class="mint-info-item">
                  <span class="mint-key">Price:</span>
                  <span class="mint-val">Free</span>
                </div>
                <div class="mint-info-item">
                  <span class="mint-key">Minting Progress:</span>
                  <span class="mint-val">{{ nftNum.free.mint }}/{{ nftNum.free.total }}</span>
                </div>
                <div class="mint-info-item">
                  <span class="mint-key">Time:</span>
                  <span class="mint-val">Jan 9 08:00 - Jan 10 08:00 (UTC)</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div>
              <q-btn
                class="mint-btn"
                :class="{ 'mint-btn-disable': !publicSellStart || publicSellEnd }"
                @click="onMint"
                :disable="!publicSellStart || publicSellEnd"
                >MINT NOW</q-btn
              >
              <div class="mint-info">
                <div class="mint-info-item">
                  <span class="mint-key">YOUR MINT LIMIT:</span>
                  <span class="mint-val">{{ saleMintNum }}/5</span>
                </div>
                <div class="mint-info-item">
                  <span class="mint-key">Price:</span>
                  <span class="mint-val" v-if="fundingPhase == 1">0.005ETH</span>
                  <span class="mint-val" v-if="fundingPhase == 2">0.01ETH</span>
                </div>
                <div class="mint-info-item">
                  <span class="mint-key">Minting Progress:</span>
                  <span class="mint-val" v-if="fundingPhase == 1"
                    >{{ nftNum.phaseOne.mint }}/{{ nftNum.phaseOne.total }}</span
                  >
                  <span class="mint-val" v-if="fundingPhase == 2"
                    >{{ nftNum.phaseTwo.mint }}/{{ nftNum.phaseTwo.total }}</span
                  >
                </div>
                <div class="mint-info-item">
                  <span class="mint-key">Time:</span>
                  <span class="mint-val">Jan 10 08:00 (UTC)</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- <div class="minted">
          <div class="minted-text">Hooray, you' ve just planted a "Mystery of Moss Origins"！</div>
          <div>
            <q-btn class="mint-btn mint-btn-active" @click="goMoss">Step into Moss</q-btn>
            <q-btn class="mint-btn mint-btn-active share-btn" @click="onShare"
              >Share on
              <q-icon right size="26px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.19922 1.11328H8.35623L25.4673 25.5577H18.3103L1.19922 1.11328ZM5.46734 3.3355L19.4673 23.3355H21.1992L7.19922 3.3355H5.46734Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.6345 14.592L1.23535 25.5577H4.16219L11.9502 16.4717L10.6345 14.592ZM15.8899 11.8754L25.1146 1.11328H22.1877L14.5741 9.9958L15.8899 11.8754Z"
                    fill="white"
                  />
                </svg>
              </q-icon>
            </q-btn>
          </div>
        </div> -->
      </div>
      <q-img class="ribbons" src="@/assets/imgs/mint/Ribbons.png"></q-img>
    </div>
    <div class="introduction-box">
      <div class="container introduction">
        <div class="introduction-title">
          <q-img src="@/assets/imgs/mint/Introduction.png" width="350px"></q-img>
        </div>
        <div class="introduction-content">
          <q-img class="tit-img" src="@/assets/imgs/mint/title.png" width="1063px"></q-img>
          <div class="info-box">
            <div class="info-item" v-for="item in list" :key="item">
              {{ item }}
            </div>
          </div>
          <div class="mint-box">
            <div class="mint-item">
              <div class="mint-left">
                <div class="mint-left-top">
                  <q-img src="@/assets/imgs/mint/gift.png" width="80px"></q-img>
                  <div>Free Mint</div>
                </div>
                <div class="mint-left-bottom">
                  <div class="mint-tit">Exclusive for whitelisted users</div>
                  <div class="mint-text">
                    <span class="mint-key">Price:</span>
                    <span class="mint-val">Free</span>
                  </div>
                  <div class="mint-text">
                    <span class="mint-key">Number:</span>
                    <span class="mint-val">300</span>
                  </div>
                  <div class="mint-text">
                    <span class="mint-key">Time:</span>
                    <span class="mint-val">Jan 9 08:00 - Jan 10 08:00 (UTC)</span>
                  </div>
                </div>
              </div>
              <div class="mint-right"></div>
            </div>
            <div class="mint-item">
              <div class="mint-left">
                <div class="mint-left-top">
                  <q-img src="@/assets/imgs/mint/money.png" width="80px"></q-img>
                  <div>Public Sale</div>
                </div>
                <div class="mint-left-bottom">
                  <div class="mint-tit">All users can join the Mint</div>
                  <div class="d-flex">
                    <div class="mint-text mr-4">
                      <div>
                        <span class="mint-key">PHASE:</span>
                        <span class="mint-val">First</span>
                      </div>
                      <div>
                        <span class="mint-key">Price:</span>
                        <span class="mint-val">0.005ETH</span>
                      </div>
                      <div>
                        <span class="mint-key">Number:</span>
                        <span class="mint-val">3199</span>
                      </div>
                      <div>
                        <span class="mint-key">Time:</span>
                        <span class="mint-val">Jan 10 08:00 (UTC)</span>
                      </div>
                    </div>
                    <div class="mint-text">
                      <div>
                        <span class="mint-key">PHASE:</span>
                        <span class="mint-val">Second</span>
                      </div>
                      <div>
                        <span class="mint-key">Price:</span>
                        <span class="mint-val">0.01ETH</span>
                      </div>
                      <div>
                        <span class="mint-key">Number:</span>
                        <span class="mint-val">6000</span>
                      </div>
                      <div>
                        <span class="mint-key">Time:</span>
                        <span class="mint-val">After the first phase sold out</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mint-right"></div>
            </div>
          </div>
        </div>
      </div>
      <q-img v-if="asMobile" src="@/assets/imgs/mint/i_mobile.png" width="100%"></q-img>
    </div>
    <div class="faq-box">
      <div class="container faq">
        <div class="faq-title">
          <q-img src="@/assets/imgs/mint/faq.png" width="113px"></q-img>
        </div>
        <div class="faq-item" v-for="(item, index) in faqList" :key="index">
          <q-img :src="item.icon" width="80px"></q-img>
          <div class="faq-tit">
            {{ item.title }}
          </div>
          <div class="faq-cont" v-html="item.content"></div>
        </div>
      </div>
    </div>
    <!-- <wallet-control ref="switchNet" style="visibility: hidden" :noInvited="true" /> -->
    <q-dialog v-model="txLoading" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6">In Process</div>
        </q-card-section>

        <q-card-section style="text-align: center">
          <q-img src="@/assets/imgs/mint/mint_loading.gif" width="220px"></q-img>
          <div class="mt-4">Minting in progress</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="footer">
      <home-btm :isFixed="false" />
    </div>
  </div>
</template>

<script setup>
import HeaderRight from "../../layouts/header-right.vue";
import HomeBtm from "../home/home-btm.vue";
</script>

<script>
import { useQuasar } from "quasar";

import { BigNumber, providers } from "ethers";
import { mapState } from "vuex";

import { Mossy__factory } from "@moss-hub/mossy";
import { switchNet } from "@/utils/wallet.js";

import { fetchNftNum } from "@/api/mint.js";

import faq_icon_0 from "@/assets/imgs/mint/faq_0.png";
import faq_icon_1 from "@/assets/imgs/mint/faq_1.png";
import faq_icon_2 from "@/assets/imgs/mint/faq_2.png";

const { VITE_MOSS_CHAINID, VITE_MOSS_NFT_MINT_CONTRACT } = import.meta.env;

export default {
  name: "MintIndex",
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
    asMobile() {
      return this.screen.width < 960;
    },
  },
  watch: {
    async uid() {
      await this.checkMint();
    },
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      list: [
        "Genesis NFT",
        "Moss Beta Invitation Code",
        "Additional Hidden Privileges",
        "Moss Bonus",
        "Exclusive Identity",
        "Resource Airdrops",
        "Create Stone",
        "Eligibility for Rare Event Participation",
      ],
      faqList: [
        {
          icon: faq_icon_0,
          title: "Intro",
          content:
            "Moss is a social document management and sharing platform based on Web3. It aims to provide an alternative to centralized file management, allowing users to have better control over their data while being able to share files quickly, easily, and securely.Moss utilizes decentralized storage capabilities such as IPFS/Arweave to enable users to store and manage various types of content securely. Moss also provides the MossLand sharing community, allowing creators to create their own exclusive sharing spaces and interact with their subscribers, sharing paid content in order to generate income.",
        },
        {
          icon: faq_icon_1,
          title: "About Moss NFT",
          content:
            "The Mystery of Moss Origins is the first NFT released by Moss, presenting the iconic Moss logo in various unique combinations. Limited to 9999 pieces, holders will enjoy exclusive privileges, including the right to create Moss Stone and rewards for event mission points.",
        },
        {
          icon: faq_icon_2,
          title: "Key Features",
          content: `Autonomy and Security: Moss utilizes Web3 and encryption technologies to give users autonomous ownership of their data and ensure data security. <br/>
            Convenient File Management: Moss provides a beautiful Ul and supports one-click saving, uploading, and sharing of any type of file. Moss also supports diverse file storage options such as clients, Telegram bots, etc.<br/>
Spaces and Chatrooms： Creators can create spaces and chatrooms of various topics, establishing social connections with users who can appreciate and reward them.<br/>
Open Sharing Community: Moss provides an open sharing community, offering creators more exposure and users more powerful resource search capabilities.<br/>
Tokenization of Spaces: Creators can tokenize their spaces, allowing users to buy and sell shares of the spaces. Users who own shares can join spaces and chatrooms. With these robust features, Moss has created a groundbreaking social sharing platform through the integration of Web3 and encryption technology. Users can freely upload, store, and share meaningful content on Moss, and generate income through these contributions. Additionally, users can forge new friendships and experience a fresh dimension of Web3.`,
        },
      ],
      minted: false,
      freeMintStartAt: 1704787200000,
      freeMintEndAt: 1704873600000,
      freeMintStart: false,
      freeMintEnd: false,
      publicSellStart: false,
      publicSellEnd: false,
      phase: 0,
      fundingPhase: 2,
      freeMintNum: 0,
      saleMintNum: 0,
      freeMinttTime: {
        hour: "00",
        minute: "00",
        second: "00",
      },
      nftNum: {
        free: {},
        phaseOne: {},
        phaseTwo: {},
      },
      txLoading: false,
    };
  },
  async created() {
    this.getNftNum();
    this.initTime();
    // await this.initContract();
  },
  async mounted() {
    await this.checkMint();
  },

  methods: {
    initTime() {
      let freeStartTimer;
      const setTime = () => {
        const freeMinttTime = this.cutdonw(this.freeMintStartAt);
        const freeMinttEndTime = this.cutdonw(this.freeMintEndAt);
        if (freeMinttTime) {
          this.freeMinttTime = freeMinttTime;
        } else {
          this.freeMintStart = true;
        }
        if (!freeMinttEndTime) {
          this.freeMintEnd = true;
          this.publicSellStart = true;
          this.checkMint();
          if (freeStartTimer) {
            clearInterval(freeStartTimer);
          }
        }
      };
      setTime();
      freeStartTimer = setInterval(setTime, 1000);
    },
    async getNftNum() {
      const { data } = await fetchNftNum();
      this.nftNum = data;
    },
    async initContract() {
      const provider = new providers.Web3Provider(window.ethereum);
      const add = VITE_MOSS_NFT_MINT_CONTRACT;
      const signer = provider.getSigner();
      const factory = Mossy__factory.connect(add, signer);
      this.Factory = factory;
    },
    async checkNet() {
      const chainId = window.ethereum.chainId;
      if (chainId != VITE_MOSS_CHAINID) {
        await switchNet(VITE_MOSS_CHAINID);
      }
      await this.initContract();
    },
    async checkMint() {
      try {
        await this.checkNet();
        const account = this.uid;
        const phase = await this.Factory.getPhase();
        // const fundingPhase = await this.Factory.fundingPhase();
        console.log(phase);
        // console.log(fundingPhase);
        this.phase = phase;
        // this.fundingPhase = fundingPhase;
        if (phase == 3) {
          this.publicSellEnd = true;
        }
        if (account) {
          const amount = await this.Factory.balanceOf(account);
          const saleAmount = await this.Factory.sales(account);
          console.log(amount);
          console.log(saleAmount);
          this.freeMintNum = amount;
          this.saleMintNum = saleAmount;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onMint() {
      const account = this.uid;
      if (!account) {
        this.$bus.emit("show-login", true);
        return;
      } else {
        const currentAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (account.toLowerCase() != currentAccounts[0].toLowerCase()) {
          return this.$alert("Please utilize the logged-in wallet for minting.");
        }
        try {
          this.txLoading = true;
          let param = {};
          await this.checkNet();
          await this.checkMint();
          if (!this.freeMintEnd && this.freeMintNum >= 1) {
            return this.$alert("The Mint quantity limit has been reached.");
          }
          if (this.freeMintEnd && this.saleMintNum >= 5) {
            return this.$alert("The Mint quantity limit has been reached.");
          }
          if (this.fundingPhase == 1) {
            param = {
              value: (5e15).toString(),
            };
          }
          if (this.fundingPhase == 2) {
            param = {
              value: (1e16).toString(),
            };
          }
          // this.txLoading = true;
          const tx = await this.Factory.mint(param);
          console.log(tx);
          const receipt = await tx.wait(1);
          console.log(receipt);
          await this.checkMint();
          this.getNftNum();
          this.$toast("Hoora, Mint has been successful!", 1);
        } catch (error) {
          console.log(error);
          this.onErr(error);
        } finally {
          this.txLoading = false;
        }
      }
    },
    goMoss() {
      window.open("/mossy");
    },
    onShare() {
      window.open(
        `https://twitter.com/intent/tweet?text=Just minted the exclusive 'Mystery of Moss Origins' NFT from @mymoss_io, the innovative Web3-based social document management and sharing platform. Explore this one-of-a-kind digital artwork now and embrace the future of decentralized file management. #NFT #MossOrigins #web3`
      );
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
    onErr(err) {
      if (!err) return console.log("---- err null");
      const { data } = err;
      let msg = err.message;
      if (data) {
        msg = data.message || msg;
      }
      if (/repriced/i.test(msg) && /replaced/i.test(msg)) {
        return this.$toast("Transaction was replaced.");
      }
      if (/Caller is not in white list/i.test(msg)) {
        msg = "Caller is not in white list.";
      } else if (/all tokens sold out/i.test(msg)) {
        msg = "All tokens sold out.";
      } else if (/free minting has been sold out/i.test(msg)) {
        msg = "Free minting has been sold out.";
      } else if (/missing revert data/i.test(msg)) {
        msg = "Network Error";
      } else if (/user rejected/i.test(msg)) {
        msg = "Your transaction has been canceled.";
      } else if (/transaction failed/i.test(msg)) {
        msg = "Transaction Failed";
      } else if (/ipfs/.test(msg) && /invalid params/.test(msg)) {
        msg = "IPFS Storage Expired, extending service duration is required.";
      } else if (
        /exceeds balance/i.test(msg) ||
        msg == "overflow" ||
        /insufficient funds/i.test(msg)
      ) {
        msg = "Insufficient balance in your wallet.";
      } else if (msg.length > 100) {
        const mat = /^(.+)\[/.exec(msg);
        if (mat) msg = mat[1];
      } else if (/already pending for origin/gi.test(msg)) {
        msg = "Wrong network, please switch your wallet network and try again.";
      } else {
        msg = "Mint failed, please try again later!";
      }

      if (/Request of type 'wallet_switchEthereumChain'/i.test(msg)) {
        msg = null;
      }
      if (msg) {
        return this.$alert(msg);
      } else {
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mint-page {
  width: 100%;
  overflow: hidden;
  .header {
    width: 100%;
    padding: 4px 0;
    // position: fixed;
    // top: 0;
    // left: 0;
  }
  .container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  }
  .banner-box {
    position: relative;
    width: 100%;
    height: 864px;
    background-color: #7e4fed;
    background-image: url("@/assets/imgs/mint/p1_background.png");
    background-size: 287px;
    text-align: center;
    .banner {
      position: relative;
      height: 100%;
      .banner-pos-left {
        position: absolute;
        left: 175px;
        bottom: 190px;
      }
      .banner-pos-right {
        position: absolute;
        right: 73px;
        bottom: 250px;
      }
      .start-mint {
        position: relative;
        z-index: 999;
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
        }
        .time {
          padding: 12px 8px;
          color: #fff;
          text-align: center;
          border-radius: 8px;
          background: #0f172a;
        }
      }
      .mint-btn {
        width: 300px;
        height: 61px;
        text-align: center;
        border-radius: 64px;
        border: 2px solid #0f172a;
        background: #1eefa4;
        color: #0f172a;
        box-shadow: 8px 12px 0px 0px #0f172a;
        font-size: 24px;
        font-style: normal;
        font-weight: 900;
        line-height: normal;
        text-transform: uppercase;
        margin-top: 12px;
        opacity: 1 !important;
      }
      .mint-btn-disable {
        background: #cbd5e1;
        color: #64748b;
      }
      .share-btn {
        background: #7e4fed;
        color: #fff;
        margin-left: 40px;
      }
      .mint-info {
        margin-top: 24px;
        .mint-info-item {
          color: #fff;
          text-align: center;
          font-family: SF Pro Text;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          line-height: 24px;
          .mint-key {
            color: #fff;
            font-weight: 700;
            text-transform: uppercase;
            margin-right: 4px;
          }
        }
      }
      .minted {
        position: relative;
        z-index: 999;
        .minted-text {
          color: #fff;
          font-size: 24px;
          font-style: normal;
          font-weight: 900;
          line-height: normal;
          text-transform: uppercase;
          margin: 24px 0;
        }
      }
    }
    .ribbons {
      width: 3840px;
      position: absolute;
      left: 50%;
      right: 50%;
      bottom: -100px;
      margin-left: -1920px;
    }
  }
  .introduction-box {
    width: 100%;
    height: 870px;
    background-color: #1eefa4;
    .introduction {
      height: 100%;
      background-image: url("@/assets/imgs/mint/p2_background.png");
      background-size: contain;
      background-repeat: no-repeat;
      padding: 80px;
      padding-top: 40px;

      .introduction-content {
        margin-top: 24px;
        height: 700px;
        background-image: url("@/assets/imgs/mint/Rectangle.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 0 40px;
        padding-top: 64px;
        .tit-img {
          display: block;
          margin: 0 auto;
        }
        .info-box {
          display: flex;
          flex-wrap: wrap;
          gap: 32px 28px;
          justify-content: center;
          margin-top: 40px;
          .info-item {
            padding: 8px 20px;
            border-radius: 100px;
            background: #1eefa4;
            color: #0f172a;
            font-family: SF Pro Text;
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            white-space: nowrap;
            position: relative;
            &::before {
              content: "";
              background-image: url("@/assets/imgs/mint/before.png");
              width: 22px;
              height: 24px;
              display: inline-block;
              background-size: contain;
              position: absolute;
              left: -5px;
              bottom: -5px;
            }
            &::after {
              content: "";
              background-image: url("@/assets/imgs/mint/after.png");
              width: 34px;
              height: 38px;
              display: inline-block;
              background-size: contain;
              position: absolute;
              right: -16px;
              top: -12px;
            }
          }
        }
        .mint-box {
          display: flex;
          gap: 0 40px;
          padding: 0 20px;
          margin-top: 40px;
          .mint-item {
            display: flex;
            .mint-left {
              width: 480px;
              height: 230px;
              padding: 16px 24px;
              padding-top: 0;
              border-radius: 16px;
              border-right: 2px dashed rgba(255, 255, 255, 0.25);
              background: #7e4fed;
              .mint-left-top {
                display: flex;
                align-items: center;
                color: #1eefa4;
                font-family: SF Pro Text;
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
              }
              .mint-left-bottom {
                margin-top: 16px;
                .mint-tit {
                  color: #fff;
                  font-family: SF Pro Text;
                  font-size: 16px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: normal;
                  margin-bottom: 16px;
                }
                .mint-text {
                  color: #cbd5e1;
                  font-family: SF Pro Text;
                  font-size: 14px;
                  // display: flex;
                  .mint-key {
                    font-weight: 700;
                    margin-right: 4px;
                    text-transform: uppercase;
                  }
                  .mint-val {
                    font-weight: 400;
                  }
                }
              }
            }
            .mint-right {
              width: 80px;
              height: 230px;
              border-radius: 16px;
              background: #7e4fed;
            }
          }
        }
      }
    }
  }
  .faq-box {
    .faq {
      padding: 40px 80px;
      .faq-item {
        margin-top: 40px;
        .faq-tit {
          color: #fff;
          font-family: SF Pro Text;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          margin-bottom: 16px;
        }
        .faq-cont {
          color: #cbd5e1;
          font-family: SF Pro Text;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px; /* 142.857% */
        }
      }
    }
  }
  .footer {
    width: 100%;
    background-color: #000;
  }
}

@media (max-width: 960px) {
  .mint-page {
    .banner-box {
      .banner {
        .banner-pos-left {
          position: absolute;
          left: 15px;
          bottom: 190px;
        }
        .banner-pos-right {
          position: absolute;
          right: 20px;
          bottom: 300px;
        }
      }
    }
    .introduction-box {
      height: auto;
      .introduction {
        display: none;
      }
    }
    .faq-box {
      .faq {
        padding: 20px 16px;
        .faq-item {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>

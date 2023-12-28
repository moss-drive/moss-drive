<template>
  <div class="mint-page">
    <div class="banner-box">
      <div class="al-c header">
        <a href="/">
          <img src="@/assets/imgs/mint/logo.svg" height="56" style="display: block" />
        </a>
        <div class="ml-auto">
          <header-right :border="false"></header-right>
        </div>
      </div>
      <div class="container banner">
        <q-img src="@/assets/imgs/mint/h1.png" width="1266px"></q-img>
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
                    <span class="mint-val">1000</span>
                  </div>
                  <div class="mint-text">
                    <span class="mint-key">Time:</span>
                    <span class="mint-val">12.30 12:00---1.29 12:00</span>
                  </div>
                </div>
              </div>
              <div class="mint-right"></div>
            </div>
            <div class="mint-item">
              <div class="mint-left">
                <div class="mint-left-top">
                  <q-img src="@/assets/imgs/mint/money.png" width="80px"></q-img>
                  <div>Public Sell</div>
                </div>
                <div class="mint-left-bottom">
                  <div class="mint-tit">All users can join the Mint</div>
                  <div class="mint-text">
                    <div style="margin-right: 24px">
                      <span class="mint-key">Price:</span>
                      <span class="mint-val">0.005ETH</span>
                    </div>
                    <div>
                      <span class="mint-key">Price:</span>
                      <span class="mint-val">0.01ETH</span>
                    </div>
                  </div>
                  <div class="mint-text">
                    <div style="margin-right: 24px">
                      <span class="mint-key">Number:</span>
                      <span class="mint-val">3000</span>
                    </div>
                    <div>
                      <span class="mint-key">Number:</span>
                      <span class="mint-val">5999</span>
                    </div>
                  </div>
                  <div class="mint-text">
                    <span class="mint-key">Time:</span>
                    <span class="mint-val">12.30 12:00---1.29 12:00</span>
                  </div>
                </div>
              </div>
              <div class="mint-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="faq-box">
      <div class="container faq">
        <div class="faq-title">
          <q-img src="@/assets/imgs/mint/FAQ.png" width="113px"></q-img>
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
    <div class="footer">
      <home-btm />
    </div>
  </div>
</template>

<script setup>
import HeaderRight from "../../layouts/header-right.vue";
import HomeBtm from "../home/home-btm.vue";
</script>

<script>
import faq_icon_0 from "@/assets/imgs/mint/faq_0.png";
import faq_icon_1 from "@/assets/imgs/mint/faq_1.png";
import faq_icon_2 from "@/assets/imgs/mint/faq_2.png";

export default {
  name: "MintIndex",

  data() {
    return {
      list: [
        "Genesis NFT",
        "Moss Beta Invitation Code",
        "Additional Hidden Privileges",
        "Moss Bonus",
        "Exclusive Identity",
        "Eligibility for Rare Event Participation",
        "Resource Airdrops",
      ],
      faqList: [
        {
          icon: faq_icon_0,
          title: "What is Moss Origins？",
          content:
            "The Mystery of Moss Origins is Moss' s inaugural NFT featuring the iconic Moss logo in various unique combinations. Limited to 9999 pieces, holders will enjoy exclusive privileges including Moss invitation codes and event task point bonuses.",
        },
        {
          icon: faq_icon_1,
          title: "What is Moss？",
          content:
            "The Mystery of Moss Origins is Moss' s inaugural NFT featuring the iconic Moss logo in various unique combinations. Limited to 9999 pieces, holders will enjoy exclusive privileges including Moss invitation codes and event task point bonuses.",
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
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.mint-page {
  width: 100%;
  padding-bottom: 76px;
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
        height: 666px;
        background-image: url("@/assets/imgs/mint/Rectangle.png");
        background-size: contain;
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
          padding: 0 40px;
          margin-top: 40px;
          .mint-item {
            display: flex;
            .mint-left {
              width: 420px;
              height: 270px;
              padding: 24px;
              border-radius: 16px;
              border-right: 2px solid rgba(255, 255, 255, 0.25);
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
                margin-top: 40px;
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
                  display: flex;
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
              width: 120px;
              height: 270px;
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
    position: fixed;
    height: 76px;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #000;
  }
}
</style>

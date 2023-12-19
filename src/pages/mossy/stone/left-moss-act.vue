<template>
  <div>
    <div class="mt-3 ta-r">
      <q-btn class="flex-1" color="primary" rounded @click="onPop(true)">BUY STONE</q-btn>
      <q-btn class="flex-1 ml-4" outline color="primary" rounded @click="onPop()">SELL STONE</q-btn>
    </div>
  </div>

  <q-dialog v-model="showPop" position="top" :persistent="buying">
    <q-card class="full-width pa-2" style="max-width: 600px">
      <q-card-section>
        <div class="text-h6">{{ isBuy ? "Buy" : "Sell" }} Stone Key</div>
      </q-card-section>
      <q-card-section>
        <div class="d-flex mt-3">
          <div class="flex-1">
            <q-input
              v-model="form.amount"
              @keyup="checkAmount"
              label="Quantity"
              autofocus
              stack-label
              filled
            />
          </div>
          <div class="flex-2 ml-5">
            <div class="mb-1 mt-1 al-c">
              <span class="fz-13 op-6">Slippage:</span>
              <span class="ml-2">{{ form.slippage }}%</span>
            </div>
            <q-slider v-model="form.slippage" :min="0" :max="100" />
          </div>
        </div>
        <div class="row mt-8">
          <div class="col-4" v-for="(it, j) in buyKvList" :key="j">
            <div class="pa-3">
              <p class="fz-15 op-8">{{ it.key }}</p>
              <q-skeleton class="mt-2" square height="25px" v-if="calcLoading" />
              <p v-else class="color-2 fw-b">
                <span class="fz-22">{{ it.val || "-" }}</span>
                <span class="ml-1">ETH</span>
              </p>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat color="white" label="Cancel" v-if="!buying" @click="showPop = false" />
        <q-btn rounded color="primary" :disabled="calcLoading" :loading="buying" @click="onBuy">{{
          isBuy ? "Buy" : "Sell"
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { debounce } from "@/utils/helper";
import { MossHub } from "../../../utils/moss-hub";
import { mapState } from "vuex";

export default {
  props: {
    stoneId: null,
  },
  data() {
    return {
      mossHub: null,
      showPop: false,
      isBuy: false,
      buying: false,
      form: {
        amount: "",
        slippage: 20,
      },
      calcLoading: false,
      calcData: null,
    };
  },
  watch: {},
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
    buyKvList() {
      const data = this.calcData || {};
      return [
        {
          key: "Estimated Keys Price",
          val: data.keyPrice,
        },
        {
          key: "Transaction Fee",
          val: data.transFee,
        },
        {
          key: "Total",
          val: data.total,
        },
      ];
    },
  },
  methods: {
    onPop(isBuy) {
      if (!this.uid) {
        localStorage.loginTo = location.pathname + location.search;
        this.$router.push("/login");
        return;
      }
      this.isBuy = isBuy;
      this.showPop = true;
    },
    async initMoss() {
      if (!this.mossHub) {
        try {
          const mossHub = new MossHub();
          await mossHub.checkNet();
          this.mossHub = mossHub;
        } catch (error) {
          this.$alert(error.message);
        }
      }
      return this.mossHub;
    },
    checkAmount() {
      this.calcData = null;
      debounce(() => {
        this.onAmount(this.form.amount);
      });
    },
    async onAmount(val) {
      let { amount, slippage } = this.form;
      console.log(val);
      if (val) {
        val = parseInt(val);
        if (isNaN(val) || val < 1) val = "";
        else if (val % 1 > 0) val = Math.floor(val);
        if (val != amount) {
          this.form.amount = val;
          amount = val;
        }
      }
      if (!amount) {
        this.calcData = null;
        return;
      }
      const mossHub = await this.initMoss();
      if (!mossHub) return;
      let data;
      try {
        this.calcLoading = true;
        const fn = this.isBuy ? "stoneMint" : "stoneBurn";
        const data = await mossHub[fn]([this.stoneId, amount]);
        console.log(data);
        this.calcData = {
          keyPrice: mossHub.formatEther(data.value),
          transFee: mossHub.formatEther(data.devFee.add(data.creatorFee)),
          total: mossHub.formatEther(data.total),
          _total: data.total,
        };
      } catch (error) {
        console.log(error);
        this.calcData = null;
        this.$alert(error.message, {
          // title: "Please check your wallet",
        });
      }
      this.calcLoading = false;
      return data;
    },
    async onBuy() {
      const { amount, slippage } = this.form;
      if (!amount) {
        return this.$toast("Quantity required");
      }
      if (!this.calcData) {
        const data = await this.onAmount(amount);
        if (!data) return;
      }
      const mossHub = await this.initMoss();
      if (!mossHub) return;
      try {
        const fn = this.isBuy ? "mint" : "burn";
        const addr = await mossHub.getWalletAddr();
        const { _total } = this.calcData;
        const args = [this.stoneId, addr, amount];
        if (this.isBuy) {
          args.push({
            value: _total.mul(100 + slippage).div(100),
          });
        } else {
          args.push(_total.mul(100 - slippage).div(100));
        }
        this.buying = true;
        const tx = await mossHub[fn](args);
        await tx.wait(2);
        await this.$alert("Done");
        location.reload();
      } catch (error) {
        this.$alert(error.message);
      }
      this.buying = false;
    },
    async onSell() {},
  },
};
</script>
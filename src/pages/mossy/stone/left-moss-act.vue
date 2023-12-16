<template>
  <div>
    <div class="mt-3 ta-r">
      <q-btn class="flex-1" color="primary" rounded @click="popBuy = true">BUY STONE</q-btn>
      <q-btn class="flex-1 ml-4" outline color="primary" rounded>SELL STONE</q-btn>
    </div>
  </div>

  <q-dialog v-model="popBuy" position="top" :persistent="buying">
    <q-card class="full-width pa-2" style="max-width: 600px">
      <q-card-section>
        <div class="text-h6">Buy Stone Key</div>
      </q-card-section>
      <q-card-section>
        <div class="d-flex mt-3">
          <div class="flex-1">
            <q-input
              v-model="form.amount"
              @keyup="checkAmount"
              label="Quantity"
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
        <q-btn flat color="white" label="Cancel" v-if="!buying" @click="popBuy = false" />
        <q-btn rounded color="primary" :disabled="calcLoading" :loading="buying" @click="onBuy"
          >Buy</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { debounce } from "@/utils/helper";
import { MossHub } from "../../../utils/moss-hub";

export default {
  props: {
    id: null,
  },
  data() {
    return {
      mossHub: null,
      popBuy: false,
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
        const data = await mossHub.stoneMint([this.id, amount]);
        console.log(data);
        this.calcData = {
          keyPrice: mossHub.formatEther(data.value),
          transFee: mossHub.formatEther(data.devFee.add(data.creatorFee)),
          total: mossHub.formatEther(data.total),
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
        // this.mossHub.mint();
        this.$toast("todo: mint");
      } catch (error) {
        this.$alert(error.message);
      }
    },
    async onSell() {},
  },
};
</script>
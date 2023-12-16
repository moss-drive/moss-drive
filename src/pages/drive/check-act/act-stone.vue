<template>
  <wallet-check />
  <q-dialog v-model="showPop" position="top" :persistent="saving">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section class="pos-s top-0 q-dark z-10">
        <div class="al-c">
          <div class="text-h6">
            <span>Claim Stone</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="isDone">
        <div class="pa-9 ta-c">
          <q-img src="/img/stone/stone-done.png" width="280px"></q-img>
          <div class="mt-1 fz-14">You successfully claimed a stone!</div>
          <div class="mt-8">
            <q-btn
              :href="`/mossy/stone?id=${stoneId}`"
              target="_blank"
              @click="onDone"
              color="primary"
              size="large"
              style="width: 160px"
              >Stone Page</q-btn
            >
          </div>
        </div>
      </q-card-section>
      <template v-else>
        <q-card-section>
          <q-banner inline-actions rounded class="bg-info text-white">
            The selected folder is being designated as "Stone", and its contents will be displayed
            on the Stone homepage once created.
            <template v-slot:action>
              <!-- <q-btn flat label="Dismiss" /> -->
            </template>
          </q-banner>

          <q-form class="q-gutter-s mt-5">
            <div class="row mb-6">
              <div class="col-3">
                <div class="stone-cover">
                  <q-img :src="form.avatar" width="110px" :ratio="1" />
                </div>
              </div>
              <div class="col-9">
                <q-input filled v-model="form.stoneName" dense label="Stone name *" hint="" />
                <q-input
                  filled
                  v-model="form.bio"
                  dense=""
                  type="textarea"
                  rows="3"
                  label="Description"
                  placeholder="Add an optional description"
                />
              </div>
            </div>
            <q-input filled dense label="URL" v-model="form.urlPath" prefix="stone.mymoss.io/" />
            <div class="mt-2 row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  filled
                  dense
                  label="Floor Price"
                  v-model="mossForm.floorPrice"
                  suffix="ETH"
                />
              </div>
              <div class="col-6">
                <q-input filled dense label="Initial issuance quantity" v-model="mossForm.intNum" />
              </div>
            </div>
            <div class="mt-6">
              <q-input
                filled
                dense
                label="How many tokens need to be sold to increase the price once?"
                v-model="mossForm.tokenNum"
              />
            </div>
            <div class="mt-6">
              <q-input
                filled
                dense
                label="After each price increase, by how much does the floor price quantity increase?"
                v-model="mossForm.stepNum"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat color="white" label="Cancel" v-if="!saving" @click="showPop = false" />
          <q-btn rounded color="primary" :loading="saving" @click="onNext">Next</q-btn>
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { MossHub } from "../../../utils/moss-hub";

const initForm = {
  stoneName: "",
  avatar: "/img/stone/stone-cover.png",
  bio: "",
  urlPath: "",
};
const initMossForm = {
  floorPrice: "0.0002",
  intNum: "50",
  tokenNum: "50",
  stepNum: "5",
};
export default {
  props: {
    checkItem: Object,
  },
  data() {
    return {
      showPop: false,
      form: { ...initForm },
      mossForm: { ...initMossForm },
      saving: false,
      isDone: false,
      stoneId: null,
      mossHub: null,
    };
  },
  created() {},
  methods: {
    onDone() {
      this.showPop = false;
      this.isDone = false;
      this.form = { ...initForm };
      this.mossForm = { ...initMossForm };
      setTimeout(() => {
        this.$router.push("/stone");
      }, 300);
    },
    async onNext() {
      try {
        if (!this.mossHub) {
          this.mossHub = new MossHub();
        }
        await this.mossHub.checkNet();
      } catch (error) {
        this.$alert(error.message);
        return;
      }

      const form = { ...this.form };
      form.folderPath = this.checkItem.key;
      form.bucketName = this.$bucket.defBucket;
      form.address = "test-addr";
      let msg = "";
      if (!form.stoneName) msg = "Stone name required";
      else if (!form.urlPath) msg = "URL Path required";
      if (msg) {
        return this.$toast(msg);
      }
      try {
        this.saving = true;
        const { data } = await this.$http.post("/stone", form);
        this.stoneId = data.stoneId;
        this.onCreate();
      } catch (error) {
        console.log(error);
        this.saving = false;
      }
    },
    async onCreate() {
      try {
        const form = this.mossForm;
        const timeoutAt = Math.floor((Date.now() + 3 * 60e3) / 1e3);
        this.saving = true;
        await this.setTimeoutAt(timeoutAt);
        const price = this.mossHub.parseEther(form.floorPrice);
        const tx = await this.mossHub.create([
          this.stoneId,
          price,
          form.intNum,
          form.tokenNum,
          form.stepNum,
          timeoutAt,
          {
            value: price.add(price.mul(25).div(1e3)),
          },
        ]);
        this.$loading("Creating...");

        await tx.wait(2);
        this.isDone = true;
      } catch (error) {
        console.log(error);
        let msg = error.message;
        if (/user reject/.test(msg)) {
          this.$toast("Rejected");
        } else {
          this.$alert(msg);
        }
      }
      this.$loadingClose();
      this.saving = false;
    },
    setTimeoutAt(timeoutAt) {
      this.$http.put(
        "/stone/timeout",
        {},
        {
          params: {
            stoneId: this.stoneId,
            timeoutAt,
          },
        }
      );
    },
  },
};
</script>
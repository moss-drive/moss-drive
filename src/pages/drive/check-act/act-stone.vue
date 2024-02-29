<template>
  <wallet-check />
  <q-dialog v-model="showPop" position="top" :persistent="saving">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section>
        <div class="text-h6">
          <span>Create Stone</span>
        </div>
      </q-card-section>

      <q-card-section v-if="isDone">
        <div class="pa-9 ta-c">
          <q-img src="/img/stone/stone-done.png" width="280px"></q-img>
          <div class="mt-1 fz-14">You successfully created a stone!</div>
          <div class="mt-8">
            <q-btn :to="`/stone`" @click="onDone" color="primary" size="large" style="width: 160px"
              >My Stones</q-btn
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

          <q-form ref="form" class="q-gutter-s mt-5">
            <div class="row mb-3">
              <div class="col-3">
                <div class="stone-cover">
                  <q-img :src="tempImg || form.avatar" width="110px" :ratio="1" />
                  <div class="pos-center">
                    <q-btn
                      class="op-8"
                      size="small"
                      round
                      color="info"
                      icon="upload"
                      :loading="uploading"
                      @click="$refs.file.click()"
                    >
                    </q-btn>
                  </div>
                </div>
                <div class="d-n">
                  <input
                    type="file"
                    accept="image/*"
                    ref="file"
                    class="pos-mask op-0 cursor-p"
                    @input="onFile"
                  />
                </div>
              </div>
              <div class="col-9">
                <q-input
                  filled
                  v-model="form.stoneName"
                  dense
                  label="Stone name *"
                  hint=""
                  :rules="[
                    (val) => !!val || 'required',
                    (val) => val.length <= 30 || 'No more than 30 characters',
                  ]"
                />
                <q-input
                  class="mt-2"
                  filled
                  v-model="form.bio"
                  dense=""
                  type="textarea"
                  rows="3"
                  label="Description"
                  placeholder="Optional"
                  :rules="[(val) => val.length <= 300 || 'No more than 300 characters']"
                />
              </div>
            </div>
            <!-- <q-input
              class="mb-2"
              filled
              dense
              label="URL"
              v-model="form.urlPath"
              prefix="stone.mymoss.io/"
              :rules="[
                (val) => !!val || 'required',
                (val) => /^[\w-]+$/.test(val) || 'Invalid path',
                (val) => val.length <= 30 || 'No more than 30 characters',
              ]"
            /> -->
            <div class="row q-col-gutter-md mt-">
              <div class="col-6">
                <q-input
                  filled
                  disable
                  dense
                  label="Floor Price"
                  v-model="mossForm.floorPrice"
                  :rules="[(val) => val > 0 || 'greater than zero']"
                  suffix="ETH"
                />
              </div>
              <div class="col-6">
                <q-input
                  filled
                  disable
                  dense
                  label="Initial issuance quantity"
                  v-model="mossForm.intNum"
                  :rules="[(val) => val > 0 || 'greater than zero']"
                />
              </div>
            </div>
            <div v-show="isAll">
              <div class="mt-2">
                <q-input
                  filled
                  disable
                  dense
                  label="The number of keys sold required for the initial floor price increase"
                  :rules="[(val) => val >= 10 || 'Minimum value is 10']"
                  v-model="mossForm.tokenNum"
                />
              </div>
              <div class="mt-2">
                <q-input
                  filled
                  disable
                  dense
                  label="After each price increase, by how much does the floor price quantity increase"
                  :rules="[
                    (val) =>
                      (val >= 0 && val * 1 <= mossForm.tokenNum / 10) ||
                      'Must be less than 2/10 of the previous quantity',
                  ]"
                  v-model="mossForm.stepNum"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions class="text-primary">
          <div class="mr-auto ml-1">
            <q-btn size="small" @click="isAll = !isAll" color="primary" flat>{{
              isAll ? "Collapse" : "Advanced Settings"
            }}</q-btn>
          </div>
          <q-btn
            class="mr-2"
            flat
            color="white"
            label="Cancel"
            v-if="!saving"
            @click="showPop = false"
          />
          <wallet-control @change="onWalletChange">
            <q-btn rounded color="primary" :loading="saving" @click="onSubmit">
              <net-icon />
              <span class="ml-2">Create</span>
            </q-btn>
          </wallet-control>
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import { MossHub } from "../../../utils/moss-hub";
const { VITE_MEDIA_PRE, VITE_OP_CHAINID } = import.meta.env;

const initForm = {
  stoneName: "",
  avatar: "",
  bio: "",
  urlPath: "",
};
const initMossForm = {
  floorPrice: "0.0001",
  intNum: "1",
  tokenNum: "10",
  stepNum: "2",
};
export default {
  props: {
    checkItem: Object,
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
      myChainId: (s) => s.myChainId,
      stoneList: (s) => s.stoneList,
    }),
  },
  data() {
    return {
      showPop: false,
      isAll: false,
      form: { ...initForm },
      mossForm: { ...initMossForm },
      tempImg: null,
      saving: false,
      isDone: false,
      rowId: null,
      mossHub: null,
      uploading: false,
      opChainId: VITE_OP_CHAINID,
    };
  },
  watch: {
    checkItem(val) {
      if (!val) return;
      this.rowId = null;
      this.tempImg = null;
      this.form = {
        ...initForm,
        stoneName: val.name,
      };
    },
    myChainId() {
      const one = this.stoneList.find((it) => it.chainId == this.myChainId);
      if (one && this.showPop) {
        this.showPop = false;
        this.$alert(
          "On this network, the folder 'stone' already exists. Please switch networks to create."
        );
      }
    },
  },
  created() {},
  methods: {
    onSubmit() {
      this.$refs.form.validate().then((suc) => {
        if (suc) this.onCreate();
        // else this.$toast("Please check the form");
      });
    },
    onFile(ev) {
      const file = ev.target.files[0];
      if (!file) return;
      const maxKb = 500;
      if (file.size > maxKb * 1024) {
        return this.$alert(`The image size should not exceed ${maxKb}KB.`);
      }
      this.tempImg = URL.createObjectURL(file);
      this.onUpload(file);
    },
    async onUpload(file) {
      const form = new FormData();
      form.append("file", file);
      this.uploading = true;
      try {
        const { data } = await this.$http.post("/stone/upload/avatar", form);
        this.form.avatar = data.key.replace("MossStoneProfile", VITE_MEDIA_PRE);
      } catch (error) {
        console.log(error);
      }
      this.tempImg = null;
      this.uploading = false;
    },
    onDone() {
      this.showPop = false;
      this.isDone = false;
      this.form = { ...initForm };
      this.mossForm = { ...initMossForm };
      setTimeout(() => {
        this.$router.push("/stone");
      }, 300);
    },
    async onNext(tx) {
      const form = { ...this.form };
      form.folderPath = this.checkItem.key;
      form.bucketName = this.$bucket.defBucket;
      form.chainId = this.myChainId;
      if (!form.avatar) {
        form.avatar = "/img/stone/def-cover.png";
      }
      try {
        this.saving = true;
        const { data } = await this.$http.post("/stone", form);
        this.rowId = data.id;
        this.$loading("Pending...");
        await tx.wait(1);
        this.isDone = true;
        this.$bus.emit("stone-created");
      } catch (error) {
        console.log(error);
        this.saving = false;
      }
      this.$loadingClose();
    },
    onWalletChange() {
      this.mossHub = null;
      this.initMoss();
    },
    async initMoss() {
      if (!this.mossHub) {
        try {
          const mossHub = new MossHub(this.myChainId);
          await mossHub.checkNet();
          this.mossHub = mossHub;
        } catch (error) {
          this.$toast(error.message);
        }
      }
      return this.mossHub;
    },
    async checkNft() {
      let valid = false;
      try {
        this.$loading("Checking");
        const { data } = await this.$http.post("/stone/nft/valid", {
          chainId: this.opChainId,
        });
        this.$loadingClose();
        valid = data.valid;
        if (this.$inDev) valid = true;
        if (!valid) {
          await this.$confirm(
            `Hey you! Looking to create a Stone? You'll need the 'Mystery of Moss Origins' NFT first. `,
            {
              confirmText: "Start by adopting one!",
            }
          );
          window.open("https://opensea.io/collection/mymoss");
        }
      } catch (error) {
        console.log(error);
      }
      this.$loadingClose();
      return valid;
    },
    async onCreate() {
      const mossHub = await this.initMoss();
      if (!mossHub) return;
      try {
        const valid = await this.checkNft();
        if (!valid) return;
        const addr = await mossHub.getWalletAddr();
        this.form.address = addr;
        const form = this.mossForm;
        const timeoutAt = Math.floor((Date.now() + 3 * 60e3) / 1e3);
        this.saving = true;
        // await this.setTimeoutAt(timeoutAt);
        const price = mossHub.parseEther(form.floorPrice);
        const args = [
          // price,
          // form.intNum,
          // form.tokenNum,
          // form.stepNum,
          timeoutAt,
          {
            value: price.add(price.mul(25).div(1e3)),
          },
        ];
        console.log(args);
        const tx = await mossHub.create(args);
        // await tx.wait(2);
        //
        this.onNext(tx);
      } catch (error) {
        this.saving = false;
        if (error) this.$bus.emit("wallet-error", error);
      }
      //
    },
    setTimeoutAt(timeoutAt) {
      this.$http.put(
        "/stone/timeout",
        {},
        {
          params: {
            id: this.rowId,
            timeoutAt,
          },
        }
      );
    },
  },
};
</script>

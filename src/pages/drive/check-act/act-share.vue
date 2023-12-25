<template>
  <q-dialog v-model="showPop" position="top" :persistent="saving">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section>
        <div class="text-h6">
          <span>Share Files</span>
        </div>
      </q-card-section>
      <template v-if="!resData">
        <q-card-section>
          <div class="op-9 fz-15 m-3 mt-0">Validity Period</div>
          <div class="q-gutter-sm">
            <q-radio
              v-for="it in dayOpts"
              :key="it.val"
              v-model="form.type"
              :val="it.val"
              :label="it.txt"
            />
          </div>
          <div class="op-9 fz-15 m-3 mt-6">Extraction Code</div>
          <div>
            <q-radio v-model="codeType" val="auto" label="Generate Random" />
          </div>
          <div class="d-flex al-start mt-2" style="max-width: 400px">
            <q-radio v-model="codeType" val="custom" />
            <q-input
              class="flex-1"
              v-model="form.code"
              filled
              dense
              placeholder="Enter a 4-digit extraction code"
              hint="Only support digits and alphabets"
              @focus="codeType = 'custom'"
            ></q-input>
          </div>
        </q-card-section>

        <q-card-actions class="text-primary" align="right">
          <q-btn flat color="white" label="Cancel" v-if="!saving" @click="showPop = false" />
          <q-btn style="width: 140px" rounded color="primary" :loading="saving" @click="onSubmit"
            >Create a link</q-btn
          >
        </q-card-actions>
      </template>
      <template v-else>
        <q-card-section>
          <div class="al-c">
            <q-icon name="check_circle" class="color-1" size="30px" />
            <b class="fz-25 ml-2">Successfully created!</b>
          </div>
          <div class="mt-5">
            <q-banner dense rounded class="bg-6">
              {{ shareLink }}
              <template v-slot:action>
                <q-btn @click="onOpen" outline size="sm" label="Open" color="primary" />
              </template>
            </q-banner>
          </div>
          <div class="op-9 fz-15 mt-6">Extraction Code</div>
          <div class="mt-3" style="width: 150px">
            <q-banner dense rounded class="bg-6"> {{ resData.code }} </q-banner>
          </div>
          <div class="mt-7 color-1" v-if="!isLong">
            <p>Link will be expired at {{ new Date(resData.expireAt * 1000).format() }}</p>
          </div>
          <div class="mt-7">
            <q-btn
              color="primary"
              class="full-width"
              @click="onCopy(shareLink + ' ' + resData.code)"
              >Copy link and extraction code</q-btn
            >
          </div>
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { copyToClipboard } from "quasar";
const dayOpts = [
  {
    val: "DAY_1",
    txt: "1 Day",
  },

  {
    val: "DAY_7",
    txt: "7 Days",
  },
  {
    val: "DAY_30",
    txt: "30 Days",
  },
  {
    val: "FOREVER",
    txt: "Permanent",
  },
];

export default {
  props: {
    checkList: Array,
  },
  data() {
    return {
      showPop: false,
      saving: false,
      dayOpts,
      codeType: "auto",
      form: {
        type: "DAY_1",
        code: "",
      },
      resData: null,
    };
  },
  computed: {
    shareLink() {
      return this.$getShareLink(this.resData.link);
    },
    isLong() {
      return this.resData.expireAt - Date.now() / 1e3 > 10 * 86400;
    },
  },
  watch: {
    showPop(val) {
      if (val) {
        this.resData = null;
      }
    },
  },
  methods: {
    async onOpen() {
      await this.onCopy(this.resData.code, "Extraction code is copied!");
      setTimeout(() => {
        window.open(this.shareLink);
      }, 800);
    },
    async onCopy(txt, msg = "Copied") {
      await copyToClipboard(txt);
      if (msg) this.$toast(msg, 1);
    },
    async onSubmit() {
      const form = { ...this.form };
      let { code } = form;
      if (this.codeType == "auto") {
        code = this.$genNonce();
      } else {
        code = code.toLowerCase();
        if (!/^\w{4}$/.test(code)) {
          return this.$toast("Invalid extraction code");
        }
      }
      form.code = code;
      form.bucketName = this.$bucket.defBucket;
      let path = this.$route.path.replace(/^\/drive/, "").replace(/\//, "");
      if (path) path += "/";
      form.folderPath = path;
      form.paths = this.checkList.map((it) => it.key).join(",");
      console.log(form);
      try {
        this.saving = true;
        const { data } = await this.$http.post("/share", form);
        this.resData = data;
      } catch (error) {
        console.log(error);
      }
      this.saving = false;
    },
  },
};
</script>
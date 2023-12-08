<template>
  <q-dialog v-model="showPop" position="top" :persistent="saving">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section class="pos-s top-0 q-dark z-10">
        <div class="al-c">
          <div class="text-h6">
            <span>Claim Stone</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-banner inline-actions rounded class="bg-info text-white">
          The selected folder is being designated as "Stone", and its contents will be displayed on
          the Stone homepage once created.
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
              <q-input filled v-model="form.stoneName" label="Stone name *" hint="" />
              <q-input
                filled
                v-model="form.bio"
                type="textarea"
                rows="3"
                label="Description"
                placeholder="Add an optional description"
              />
            </div>
          </div>
          <q-input filled label="URL" v-model="form.urlPath" prefix="stone.mymoss.io/" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat color="white" label="Cancel" :disabled="saving" @click="showPop = false" />
        <q-btn rounded color="primary" :loading="saving" @click="onNext">Next</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    checkItem: Object,
  },
  data() {
    return {
      showPop: false,
      form: {
        stoneName: "",
        avatar: "https://qs3.4everland.store/logos/preact.svg",
        bio: "",
        urlPath: "",
      },
      saving: false,
    };
  },
  methods: {
    async onNext() {
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
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      this.saving = false;
    },
  },
};
</script>
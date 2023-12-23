<template>
  <q-dialog v-model="showPop" position="top" :persistent="saving">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section>
        <div class="text-h6">
          <span>Edit Stone</span>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form ref="form" class="q-gutter-s mt-5">
          <div class="row mb-6">
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
                :rules="[(val) => val.length > 300 || 'No more than 300 characters']"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat color="white" label="Cancel" v-if="!saving" @click="showPop = false" />
        <q-btn rounded color="primary" :loading="saving" @click="onSubmit">Create</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
const { VITE_MEDIA_PRE } = import.meta.env;

export default {
  data() {
    return {
      showPop: false,
      saving: false,
      form: {},
      tempImg: null,
    };
  },
  methods: {
    onEdit(it) {
      const { id, stoneName, bio, avatar } = it;
      this.form = {
        id,
        stoneName,
        bio,
        avatar,
      };
      this.showPop = true;
    },
    onSubmit() {
      this.$refs.form.validate().then((suc) => {
        if (suc) this.onSave();
        // else this.$toast("Please check the form");
      });
    },
    async onSave() {
      try {
        const { id, stoneName, bio, avatar } = this.form;
        const form = {
          id,
          stoneName,
          stoneBio: bio,
          stoneAvatar: avatar,
        };
        this.saving = true;
        await this.$http.put("/stone", form);
        this.$toast("Stone info updated", 1);
        this.showPop = false;
        this.$emit("refresh");
      } catch (error) {
        console.log(error);
      }
      this.saving = false;
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
  },
};
</script>
<style lang="scss">
.img-item img {
  min-width: 150px;
  max-width: 90%;
  max-height: 80vh;
  background: #fff url(/img/common/bg-trans.svg);
  background-size: 30px;
  transition: all ease 200ms;
  &:hover {
    box-shadow: 0 0 3px #666;
    max-height: auto;
    min-width: 200px;
    max-height: 90vh;
  }
}
.meta-txt {
  margin-top: 3px;
  font-size: 13px;
  color: #99a9bf;
}
</style>

<template>
  <div
    class="img-item wh100p al-c f-center"
    :class="{
      big: isBig,
    }"
  >
    <div class="pos-center" v-if="loading">
      <q-spinner-ios color="yellow" size="30px" />
    </div>
    <div class="ta-c">
      <img
        class="e-stop"
        ref="img"
        :src="src"
        @click="isBig = !isBig"
        @load="onLoad"
        @error="onEnd"
      />
      <!-- <div class="meta-txt" title="width(px) × height(px)">
        {{ metaTxt }}
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
  },
  data() {
    return {
      loading: true,
      isBig: false,
      metaTxt: "",
    };
  },
  methods: {
    onLoad() {
      this.loading = false;
      const el = this.$refs.img;
      this.metaTxt = el.naturalWidth + " × " + el.naturalHeight;
    },
    onEnd() {
      this.loading = false;
    },
  },
};
</script>
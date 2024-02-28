<template>
  <div class="step-container">
    <div v-show="stepIdx == 0" class="al-c space-btw">
      <div>
        <div class="al-c">
          <img src="/img/resource/step-circle.svg" width="12" alt="" />
          <div class="title ml-1 fw-b">Approve</div>
        </div>
        <div class="mt-1 description">
          Please sign the authorization for the maximum expenditure amount in your wallet.
        </div>
      </div>
    </div>
    <div v-show="stepIdx == 1" class="al-c space-btw">
      <div>
        <div class="al-c">
          <img src="/img/resource/step-circle.svg" width="12" alt="" />
          <div class="title ml-1 fw-b">Payment</div>
        </div>
        <div class="mt-1 description">Please sign again to complete payment for your purchase.</div>
      </div>
    </div>

    <div v-show="stepIdx == 2" class="al-c space-btw">
      <div>
        <div class="al-c">
          <img src="/img/resource/step-circle.svg" width="12" alt="" />
          <div class="title ml-1 fw-b">Wait for the resources to be credited.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepIdx: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.step-container {
  width: 100%;
  transform: translateY(-100px);
  padding: 20px 16px 8px 16px;
  border-radius: 0px 0px 16px 16px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), #004d3b;
  transition: all 0.5s ease;
  .step-num-content {
    background: rgba(30, 239, 164, 0.25);
    padding: 4px;
    border-radius: 50%;
  }
  .step-num {
    width: 16px;
    height: 16px;
    color: #0f172a;
    font-weight: bold;
    border-radius: 50%;
    background: #1eefa4;
  }
  .title {
    color: #1eefa4;
  }
  .description {
    color: #94a3b8;
    font-size: 12px;
  }

  .operate-btn {
    border-radius: 4px;
    background: #1eefa4;
    color: #0f172a;
  }
}
.step-container.popup {
  transform: translateY(-8px);
}
</style>

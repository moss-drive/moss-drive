<style>
.bg-header-s1 {
  background: linear-gradient(0, #111729, #7e4fed);
}
</style>

<script setup>
import LeftList from "./left-list.vue";
</script>

<template>
  <div class="bdrs-10 bg-dark2 ov-h">
    <div class="row q-col-gutter-md bg-header-s1 pa-4 bdb-1">
      <div class="col-12 col-sm-8">
        <div class="fw-b fz-20">What you get from momo</div>
        <div class="d-flex mt-5">
          <div class="stone-cover">
            <q-img
              src="https://qs3.4everland.store/logos/preact.svg"
              :ratio="1"
              width="100px"
            ></q-img>
          </div>
          <div class="ml-3 line-5 op-8">
            "I have been working with Growmodo for nearly two years now. With their keen eye for
            design, development skills, and expert project management, I have managed to serve a lot
            more clients than I would without them.""We're extremely happy with Growmodo. Our
            project manager has been exceptional. She's always very prompt with replies and
            communicating how things are going."We want to make delegating work feel as natural as
            possible to you. That's why we That's why we That's why we That's why we That
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <img src="/img/temp-chart.svg" class="w100p" />
        <div class="mt-3 al-c">
          <q-btn class="flex-1" color="primary" rounded>BUY STONE</q-btn>
          <q-btn class="flex-1 ml-4" outline color="primary" rounded>SELL STONE</q-btn>
        </div>
      </div>
    </div>

    <left-list />
  </div>
</template>
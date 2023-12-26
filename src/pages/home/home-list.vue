<style lang="scss">
.c_wrap {
  background: #172033;
  height: 120px;
  position: relative;
  border-radius: 10px;
  transition: transform ease 200ms;
  &:active {
    transform: scale(0.9);
  }
}
.c_wrap::before {
  content: "";
  position: absolute;
  width: calc(100% + 3px);
  height: calc(100% + 3px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background: radial-gradient(250px circle at var(--x) var(--y), #00dc82 0, transparent 100%);
}
.c_wrap .c_mask {
  position: absolute;
  inset: 3px;
  background: #172033;
  border-radius: 10px;
}
</style>

<script setup>
import ListItem from "./list-item.vue";
</script>

<template>
  <div class="row">
    <div class="col-4 col-lg-3" v-for="i in 12" :key="i">
      <div class="pa-2">
        <div class="c_wrap">
          <div class="c_mask">
            <list-item :asMobile="asMobile" :info="rows[i - 1]"></list-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    asMobile: Boolean,
  },
  data() {
    return {
      rows: [],
    };
  },
  mounted() {
    var elements = document.getElementsByClassName("c_wrap");
    // 添加鼠标移动事件监听器
    document.addEventListener("mousemove", function (event) {
      // 获取鼠标位置
      var mouseX = event.pageX;
      var mouseY = event.pageY;

      // 遍历元素并输出距离鼠标的坐标
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var rect = element.getBoundingClientRect();
        var elementX = rect.left + window.scrollX;
        var elementY = rect.top + window.scrollY;

        var distanceX = mouseX - elementX;
        var distanceY = mouseY - elementY;
        element.style.setProperty("--x", distanceX + "px");
        element.style.setProperty("--y", distanceY + "px");
      }
    });
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$http.get("/stone/square", {
          params: {
            type: "FOR_YOU",
            size: 20,
          },
        });
        this.rows = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
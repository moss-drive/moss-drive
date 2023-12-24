<template>
  <div class="resource-row-cpm mb-1">
    <div class="row-title">
      {{ name }}
    </div>
    <div class="al-c">
      <div
        v-for="(item, index) in tags"
        :key="index"
        class="tag cursor-p fz-12 al-c justify-center"
        :class="curIndex == index ? 'active' : ''"
        @click="handleTag(index)"
      >
        {{ item.text }}
      </div>
      <div class="select-content justify-center al-c ml-2" :class="curIndex == -1 ? 'active' : ''">
        <input
          type="text"
          class="fz-12 ta-c resource-input flex-1"
          @input="handleInput"
          v-model="value"
        />
        <div v-if="items.length > 1" class="al-c select-resource pa-1">
          <select
            @change="handleChangeUnit"
            class="cursor-p"
            :id="'select_' + type"
            v-model="selected"
          >
            <option class="fz-14" :value="it.value" v-for="it in items" :key="it.value">
              {{ it.text }}
            </option>
          </select>
        </div>
        <span class="fz-12" v-else>{{ items[0].text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    name: String,
    tags: {
      type: Array,
      default: () => [
        {
          text: "30GB",
          value: 30 * Math.pow(1024, 3),
        },
        {
          text: "80GB",
          value: 80 * Math.pow(1024, 3),
        },
        {
          text: "500GB",
          value: 500 * Math.pow(1024, 3),
        },
      ],
    },
    items: {
      type: Array,
      default: () => {
        return [
          {
            text: "MB",
            value: Math.pow(1024, 2),
          },
          { text: "GB", value: Math.pow(1024, 3) },
          {
            text: "TB",
            value: Math.pow(1024, 4),
          },
        ];
      },
    },
    unit: {
      type: Number,
      default: Math.pow(1024, 3),
    },
  },
  emits: ["countPrice"],
  data() {
    return {
      value: "",
      curIndex: null,
      selected: Math.pow(1024, 3),
    };
  },
  created() {
    this.selected = this.unit;
  },
  methods: {
    handleTag(i) {
      if (this.curIndex == i) {
        this.curIndex = null;
        this.$emit("countPrice", { value: 0, type: this.type });
      } else {
        this.curIndex = i;
        this.$emit("countPrice", {
          value: this.tags[this.curIndex].value,
          type: this.type,
        });
      }
    },
    handleInput() {
      this.$emit("countPrice", {
        value: this.value * this.selected,
        type: this.type,
      });
    },
    handleChangeUnit(e) {
      this.selected = e.target.value;
      this.handleInput();
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.curIndex = -1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-row-cpm {
  width: 100%;
  min-width: 300px;
  font-size: 16px;
  .row-title {
    margin-bottom: 2px;
    color: #cbd5e1;
  }
}
.select-content {
  flex: 1;
  width: 92px;
  border-radius: 4px;
  height: 40px;
  padding: 12px 8px;
  background: #1e293b;
  box-sizing: border-box;
}

.select-content.active {
  border: 1px solid rgba(30, 239, 164, 0.25);
}
.tag {
  // width: 80px;
  flex: 1;
  height: 40px;
  border-radius: 4px;
  background: #1e293b;
}

.tag + .tag {
  margin-left: 8px;
}
.tag.active {
  border: 1px solid rgba(30, 239, 164, 0.25);
  color: #1eefa4;
  font-weight: bold;
}
.resource-input {
  width: 41px;
  padding-right: 10px;
  color: #1eefa4;
  font-weight: bold;
  box-sizing: border-box;
  text-align: right;
  background: transparent;
}

.select-resource {
  position: relative;
  border-radius: 2px;
  font-size: 12px;
  background: #334155;

  select {
    border: none;
    color: #fff;
    outline: none;
    border-radius: 2px;
    background: #334155;
  }
}
</style>

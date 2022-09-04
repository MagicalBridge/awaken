<template>
  <div class="picker-color-component">
    <input
      type="color"
      :value="value"
      @input="onChange(($event as any).target.value)"
    />
    <ul class="color-list">
      <li
        class="color-item"
        :class="{ 'color-item-active': color === value }"
        v-for="color in colors"
        :key="color"
        @click="onChange(color)"
      >
        <div
          v-if="color.startsWith('#')"
          :style="{ backgroundColor: color }"
        ></div>
        <div v-else class="transparent-back"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export const defaultColors = [
  "#ffffff",
  "#f5222d",
  "#fa541c",
  "#fadb14",
  "#52c41a",
  "#1890ff",
  "#722ed1",
  "#8c8c8c",
  "#000000",
  "",
];

export default defineComponent({
  props: {
    value: {
      type: String,
      default: "#ffffff",
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => defaultColors,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const onChange = (color: any) => {
      context.emit("change", color);
    };

    return {
      onChange,
    };
  },
});
</script>

<style scoped>
.picker-color-component {
  display: flex;
  align-items: center;
}
.picker-color-component input {
  margin-right: 8px;
  height: 48px;
}

.color-list {
  min-width: 150px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  margin-bottom: 0;
}

.color-list .color-item {
  padding: 2px;
  flex: 0 0 20%;
  height: 25px;
  border-radius: 2px;
}

.color-list .color-item.color-item-active {
  border: 1px solid #ddd;
}

.color-list .color-item div {
  height: 100%;
  border: 1px solid #f2f2f2;
}

.color-item div.transparent-back {
  background-image: url("@/assets/transparent.png");
}
</style>

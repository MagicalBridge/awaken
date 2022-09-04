<template>
  <div @click="setActive(id)" :class="{ active: active }" class="edit-wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["set-active"],
  props: {
    id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const setActive = (id: string) => {
      emit("set-active", id);
    };
    return { setActive };
  },
});
</script>

<style scoped>
.edit-wrapper.active {
  border: 1px solid #1890ff;
}
</style>

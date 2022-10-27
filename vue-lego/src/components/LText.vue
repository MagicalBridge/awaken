<template>
  <component
    :is="tag"
    :style="styleProps"
    @click.prevent="handleClick"
    class="l-text-component"
  >
    {{ text }}
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import {
  transformToComponentProps,
  textDefaultProps,
  testStylePropNames,
} from "@/defaultProps";
import { useComponentCommon } from "@/hooks/useComponentCommon";

const defaultProps = transformToComponentProps(textDefaultProps);

export default defineComponent({
  name: "l-text",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    ...defaultProps,
  },
  setup(props) {
    //  pick 从对象中读取 key 和 key 对应的值组成新对象
    const { styleProps, handleClick } = useComponentCommon(
      props,
      testStylePropNames
    );
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>

<style scoped>
.l-text-component {
  position: relative !important;
}
</style>

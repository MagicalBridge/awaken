<template>
  <img
    class="l-image-component"
    :style="(styleProps as any)"
    :src="src"
    @click.prevent="handleClick"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useComponentCommon } from "@/hooks/useComponentCommon";
import {
  transformToComponentProps,
  imageDefaultProps,
  imageStylePropNames,
} from "@/defaultProps";
const defaultProps = transformToComponentProps(imageDefaultProps);

export default defineComponent({
  name: "l-image",
  props: {
    ...defaultProps,
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(
      props,
      imageStylePropNames
    );

    return {
      styleProps,
      handleClick,
    };
  },
});
</script>

<style scoped>
.l-image-component {
  max-width: 100%;
  position: relative !important;
}
</style>

<template> 
  <component :is="tag" :style="styleProps">
    {{ text }}
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { pick } from "lodash-es"
export default defineComponent({
  name: "l-text",
  props: {
    text: {
      type: String,
    },
    fontSize: {
      type: String,
    },
    tag: {
      type: String,
      default: "div",
    },
  },
  setup(props) {
    // 将样式属性提取出来
    const styleProps = computed(() => {
      return pick(props, ["fontSize"])
    })

    console.log(styleProps)

    return {
      styleProps,
    }
  },
})
</script>

<style scoped>
.l-text-component {
  position: relative !important;
}
</style>

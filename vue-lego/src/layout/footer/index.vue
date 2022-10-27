<template>
  <footer>
    <h4>Vue3 project</h4>
    <div>copyright @189xxxx9752</div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "LayoutFooter",
});
</script>

<style scoped>
footer {
  flex: 0 0 64px;
  background: antiquewhite;
  display: flex;
  flex-direction: column;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

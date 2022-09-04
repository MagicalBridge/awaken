<template>
  <Layout />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Layout from "@/layout/index.vue";
export default defineComponent({
  components: {
    Layout,
  },
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

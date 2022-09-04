<template>
  <div class="container">
    <Header v-if="withHeader" class="header"></Header>
    <div class="main">
      <router-view></router-view>
    </div>
    <Footer v-if="withFooter" class="footer"></Footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed /* , ref, watchEffect */ } from "vue";
import { useRoute } from "vue-router";

import Header from "@/layout/header/index.vue";
import Footer from "@/layout/footer/index.vue";

export default defineComponent({
  name: "LayoutIndex",
  setup() {
    const route = useRoute();

    //#region 使用 computed 计算属性
    const withHeader = computed(() => !route.meta.withoutHeader);
    const withFooter = computed(() => !route.meta.withoutFooter);
    //#endregion

    //#region 使用 ref + watchEffect
    // const withHeader = ref(true);
    // const withFooter = ref(true);
    // watchEffect(() => {
    //   withHeader.value = !route?.meta?.withoutHeader as boolean;
    //   withFooter.value = !route?.meta?.withoutFooter as boolean;
    // });
    //#endregion

    return {
      withHeader,
      withFooter,
    };
  },
  components: {
    Header,
    Footer,
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.container .main {
  flex: 1;
}
</style>

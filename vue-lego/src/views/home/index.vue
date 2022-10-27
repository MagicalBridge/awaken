<template>
  <div class="home-container">
    <!-- 搜索栏 -->
    <section>
      <a-input-search
        v-model:value="searchParams.keyword"
        placeholder="检索模板"
        enter-button
        style="width: 260px"
        @search="onSearchTemplates"
      ></a-input-search>
    </section>

    <!-- 模板列表 -->
    <section>
      <TemplateList :list="testData" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "vue";
import { useStore } from "vuex";

import { GlobalDataProps } from "@/store/index";

import TemplateList from "@/components/TemplateList.vue";

interface ParamsProps {
  keyword?: string;
}

export default defineComponent({
  name: "HomePage",
  setup() {
    //  检索关键词搜素模板
    const searchParams = reactive<ParamsProps>({});
    const onSearchTemplates = () => {
      console.log(`search templates with keyword ${searchParams.keyword}`);
    };

    const store = useStore<GlobalDataProps>();
    const testData = computed(() => store.state.templates.data);
    return { testData, searchParams, onSearchTemplates };
  },
  components: {
    TemplateList,
  },
});
</script>

<style scoped>
.home-container {
  padding: 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

section {
  margin-top: 16px;
  max-width: 1320px;
  min-width: 960px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
</style>

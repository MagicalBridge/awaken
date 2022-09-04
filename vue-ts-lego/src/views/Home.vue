<template>
  <div class="home-container">
    <!-- 模板列表 -->
    <section>
      <!-- HomePage -->
      <TemplateList :list="testData" />
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { useStore } from "vuex"
import { GlobalDataProps } from "../store/index"
import TemplateList from "../components/TemplateList.vue"

export default defineComponent({
  name: "Home",
  setup() {
    // 一个函数想要返回值得到用户的自定义结果，就是使用泛型
    const store = useStore<GlobalDataProps>()
    // 如果想要响应式的呈现一个数据，必须使用 computed 进行包裹
    const testData = computed(() => {
      return store.state.templates.data
    })
    return { testData }
  },
  components: {
    TemplateList,
  },
})
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

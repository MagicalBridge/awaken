<template>
  <div class="homepage-container">
    <img :src="template.coverImg" />
  </div>
</template>

<script lang="ts">
import { defineComponent,computed } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import { GlobalDataProps } from "../store/index"
import { TemplateProps } from '../store/modules/templates'

export default defineComponent({
  name: "TemplateDetail",
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id as string
    const template = computed<TemplateProps>(() => {
      return store.getters.getTemplateById(parseInt(currentId))
    })
    return {
      route, // 从这里可以拿到路由信息
      template
    }
  },
})
</script>

<style>
</style>

<template>
  <div>
    <div v-if="withHeader">
      <a-layout>
        <a-layout-header>
          <div class="page-title">
            <router-link to="/">微盟乐高</router-link>
            <UserProfile :user="user" />
          </div>
        </a-layout-header>
        <a-layout-content>
          <!-- 这里存放router-view -->
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
      <a-layout-footer> 微盟集团乐高项目 </a-layout-footer>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import {GlobalDataProps} from "./store/index"
import UserProfile from "./components/UserProfile.vue"

export default defineComponent({
  name: "App",
  components: {
    UserProfile,
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const withHeader = computed(() => {
      return route.meta.withHeader
    })
    const user = computed(() => {
      return store.state.user
    })
    return {
      withHeader,
      user
    }
  },
})
</script>

<style>
.page-title {
  color: #fff;
}
</style>

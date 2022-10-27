<template>
  <header>
    <h1>
      <router-link to="/">
        <img
          src="@/assets/logo2.png"
          alt="慕課樂高"
          title="慕課樂高"
          class="logo-image"
        />
      </router-link>
      慕课乐高
    </h1>
    <!-- 用戶操作交互模塊 -->
    <div class="opera-wrap">
      <UserProfile :user="user" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";

import UserProfile from "./UserProfile.vue";

export default defineComponent({
  name: "LayoutHeader",
  setup() {
    const store = useStore<GlobalDataProps>();
    const user = computed(() => store.state.user);
    return { user };
  },
  components: {
    UserProfile,
  },
});
</script>

<style scoped>
header {
  flex: 0 0 64px;
  padding: 0 32px;
  background: #1b2e5a;
  display: flex;
  align-items: center;
}

header h1 {
  font-size: 22px;
  margin-bottom: 0;
  color: transparent;
}

.opera-wrap {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
</style>

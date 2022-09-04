<template>
  <!-- <router-link v-if="!user?.isLogin" to="/login">
    <a-button typeof="primary" class="user-profile-component">登录</a-button>
  </router-link> -->
  <a-button
    v-if="!user?.isLogin"
    typeof="primary"
    class="user-profile-component login-btn"
    @click="login"
    >登录</a-button
  >
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.data?.nickName }}</router-link>
      <template #overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="createDesign">创建作品</a-menu-item>
          <a-menu-item key="1"
            ><router-link to="/works">我的作品</router-link></a-menu-item
          >
          <a-menu-item class="logout" key="2" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { UserProps } from "@/store/modules/user";
import { message } from "ant-design-vue";

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserProps>,
      require: true,
    },
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    //  创建作品
    const createDesign = async () => {
      router.push(`/editor/${1}`);
    };

    //  登录操作
    const login = () => {
      router.push("/login");
      // store.commit("login");
      // message.success("登录成功", 2);
    };

    //  登出操作
    const logout = () => {
      message.info("操作成功, 2 后执行退出", 2);
      store.commit("logout");
      setTimeout(() => {
        router.push(`/`);
      }, 2000);
    };

    return {
      logout,
      createDesign,
      login,
    };
  },
});
</script>

<style scoped>
.user-profile-dropdown {
  border-radius: 2px !important;
}
.user-operation > * {
  margin-left: 30px !important;
}
</style>

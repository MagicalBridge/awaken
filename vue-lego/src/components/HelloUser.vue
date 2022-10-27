<template>
  <div class="hello-user-container">
    <button class="load-btn" @click="handleLoadUser">load User</button>
    <div class="user-info">
      <template v-if="!user.error">
        <span>{{ user.data?.username }}</span
        ><br />
        <span>{{ user.data?.name }}</span
        ><br />
        <span>{{ user.data?.phone }}</span>
        <br />
        <span>{{ user.data?.email }}</span>
        <br />
        <span>{{ JSON.stringify(user.data?.company) }}</span>
        <br />
        <span>{{ JSON.stringify(user.data?.address) }}</span>
      </template>
      <template v-else>
        {{ user }}
        <div class="load-error">{{ user.error?.message }}</div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import axios from "axios";

interface UserDataProps {
  username: string;
  phone: string;
  name: string;
  id: number;
  address: object;
  company: object;
  email: string;
}

interface UserProps {
  data: null | Partial<UserDataProps>;
  loading?: boolean;
  error?: null | Error;
}

export default defineComponent({
  setup() {
    const user = reactive<UserProps>({
      data: null,
      loading: false,
      error: null,
    });

    const handleLoadUser = () => {
      user.loading = true;
      axios
        .get(`https://jsonplaceholder.typicode.com/users/1`)
        .then((resp) => {
          user.data = resp.data;
        })
        .catch((err) => {
          user.error = err;
        })
        .finally(() => {
          user.loading = false;
        });
    };

    return {
      user,
      handleLoadUser,
    };
  },
});
</script>

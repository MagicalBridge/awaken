import { Module } from "vuex";
import { GlobalDataProps } from "../index";

interface UserDataProps {
  nickName: string;
  avatar?: string;
  email?: string;
}

export interface UserProps {
  isLogin: boolean;
  data?: UserDataProps;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    data: undefined,
  },
  mutations: {
    login: (state, payload) => {
      state.isLogin = true;
      state.data = { nickName: payload.nickName, avatar: payload.avatar };
    },
    logout: (state) => {
      state.isLogin = false;
      state.data = undefined;
    },
  },
  actions: {
    login({ commit }, payload) {
      commit("login", payload);
    },
  },
};

export default user;

import { Module } from "vuex";
import { GlobalDataProps } from "../index";

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
  isHot?: boolean;
  isNew?: boolean;
}

export interface TemplatesProps {
  data: TemplateProps[];
}

//  测试数据
export const testData: TemplateProps[] = [
  { id: 1, title: "title1", coverImg: "", author: "", copiedCount: 0 },
  { id: 2, title: "title2", coverImg: "", author: "", copiedCount: 0 },
  { id: 3, title: "title3", coverImg: "", author: "", copiedCount: 0 },
  { id: 4, title: "title4", coverImg: "", author: "", copiedCount: 0 },
];

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData,
  },
  getters: {
    //  获取模板数据 & id
    getTemplateById:
      (state /* , getters, rootState, rootGetters */) => (id: number) => {
        // rootState.user.data?.nickName;
        return state.data.find((t) => t.id === id);
      },
  },
  mutations: {},
};

export default templates;

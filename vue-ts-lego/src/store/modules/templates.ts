import { Module } from "vuex";
import { GlobalDataProps } from "../index";

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export interface TemplatesProps {
  data: TemplateProps[];
}

//  测试数据
export const testData: TemplateProps[] = [
  {
    id: 1,
    title: "title1",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    author: "louis",
    copiedCount: 5,
  },
  {
    id: 2,
    title: "title2",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
    author: "vivian",
    copiedCount: 4,
  },
  {
    id: 3,
    title: "title3",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-682056.png",
    author: "micky",
    copiedCount: 2,
  },
];

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData,
  },
  getters: {
    //  获取模板数据 & id
    getTemplateById: (state) => (id: number) => {
      // rootState.user.data?.nickName;
      return state.data.find((t) => t.id === id);
    },
  },
};

export default templates;

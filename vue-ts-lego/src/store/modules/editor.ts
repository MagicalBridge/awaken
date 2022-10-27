import { Module } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { GlobalDataProps } from "../index";

export interface EditorProps {
  // 供中间便器渲染的组件
  components: ComponentProps[];
  // 当前编辑的元素 uuid
  currentElement?: string;
}

export interface ComponentProps {
  // 元素属性
  props: { [key: string]: unknown };
  // 元素 id: uuidv4 生成
  id: string;
  // 元素名称, 如 l-text, l-image 等
  name: string;
}

// 测试数据
export const testComponents: ComponentProps[] = [
  {
    id: uuidv4(),
    props: {
      text: 'hello',
      fontSize:'20px'
    },
    name: "l-text",
  },
  {
    id: uuidv4(),
    props: {
      text: 'hello2',
      fontSize:'10px'
    },
    name: "l-text",
  },
  {
    id: uuidv4(),
    props: {
      text: 'hello3',
      fontSize:'15px'
    },
    name: "l-text",
  },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
  }
};

export default editor;

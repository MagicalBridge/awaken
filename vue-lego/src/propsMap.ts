import { h, VNode } from "vue";
import { TextComponentProps } from "@/defaultProps";

export interface PropToForm {
  component: string;
  extraProps?: { [key: string]: any }; //  额外的其他属性
  text?: string; //  label 文案
  subComponent?: string; //  子组件
  options?: { text: string | VNode; value: any }[]; //  子组件渲染和展示文本
  initalTransform?: (v: any) => any; //  转化函数 - 传参处理
  afterTransform?: (v: any) => any; //  转换函数  - 输出结果
  valueProp?: string; //  接收值的 key 名, 默认 value
  eventName?: string; //  发送事件名, 默认 change
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm;
};

const fontFamilyArray = [
  { value: "'SimSun','STSong'", text: "宋体" },
  { value: "'SimHei','STHei'", text: "黑体" },
  { value: "'KaiTi','STKaiti'", text: "楷体" },
  { value: "'FangSong','STFangsong'", text: "仿宋" },
];

const fontFamilyOptions = fontFamilyArray.map((font) => {
  return {
    value: font.value,
    text: h("span", { style: { fontFamily: font.value } }, font.text),
  };
});

export const mapPropsToForms: PropsToForms = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: { rows: 3 },
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: "字号",
    component: "a-input-number",
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (v: number) => (v ? `${v}px` : ""),
  },
  lineHeight: {
    text: "行高",
    component: "a-slider",
    extraProps: { min: 0, max: 3, step: 0.1 },
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (v: number) => v.toString(),
  },
  textAlign: {
    component: "a-radio-group",
    subComponent: "a-radio-button",
    text: "对齐",
    options: [
      { value: "left", text: "左" },
      { value: "center", text: "中" },
      { value: "right", text: "右" },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "字体",
    options: [{ value: "", text: "无" }, ...fontFamilyOptions],
  },
  color: {
    text: "字色",
    component: "picker-color",
  },
};

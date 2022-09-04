import { mapValues, without } from "lodash-es";

export interface CommonDefaultProps {
  actionType: string;
  url: string;
  height: string;
  width: string | number;
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
  borderStyle: string;
  borderColor: string;
  borderWith: string;
  borderRadius: string;
  boxShadow: string;
  opacity: number | string;
  position: string;
  left: string;
  right: string;
  top: string;
  bottom: string;
  cursor: string;
}

export interface TextComponentProps extends CommonDefaultProps {
  text: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: string;
  textAlign: string;
  color: string;
  backgroundColor: string;
}

export interface ImageDefaultProps extends CommonDefaultProps {
  src: string;
}

export type AllComponentProps = TextComponentProps & ImageDefaultProps;

/** 通用属性*/
export const commonDefaultProps: CommonDefaultProps = {
  //    actions
  actionType: "",
  url: "",
  //    size
  height: "",
  width: "100%",
  paddingLeft: "0px",
  paddingRight: "0px",
  paddingTop: "0px",
  paddingBottom: "0px",
  //    border type
  borderStyle: "none",
  borderColor: "#000",
  borderWith: "0",
  borderRadius: "0",
  //    shadow and opacity
  boxShadow: "0 0 0 #000000",
  opacity: 1,
  //    position and x,y
  position: "absolute",
  left: "0",
  right: "0",
  top: "0",
  bottom: "0",
  cursor: "normal",
};

/** 文本属性*/
export const textDefaultProps: TextComponentProps = {
  text: "正文内容",
  fontSize: "14px",
  fontFamily: "",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  lineHeight: "1",
  textAlign: "left",
  color: "#000000",
  backgroundColor: "",
  ...commonDefaultProps,
};

export const imageDefaultProps: ImageDefaultProps = {
  src: "test.url",
  ...commonDefaultProps,
};

/** 转化生成 component 的 props 属性*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformToComponentProps = <T extends { [key: string]: any }>(
  props: T
) => {
  return mapValues(props, (item) => ({
    type: item.constructor,
    default: item,
  }));
};

/** 文本的样式属性名集合*/
export const testStylePropNames = without(
  Object.keys(textDefaultProps),
  "actionType",
  "url",
  "text"
);

/** 图片样式属性名集合*/
export const imageStylePropNames = without(
  Object.keys(imageDefaultProps),
  "src"
);

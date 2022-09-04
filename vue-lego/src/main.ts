import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//  全局注册 antd
// import Antd from "ant-design-vue";

//   antd 样式文件引入
import "ant-design-vue/dist/antd.css";

//  全局局部注册
import {
  Row,
  Col,
  Button,
  Card,
  Tag,
  Form,
  Input,
  InputNumber,
  Dropdown,
  Menu,
  Slider,
  Radio,
  Select,
  Progress,
} from "ant-design-vue";

const app = createApp(App);

app
  .use(Row)
  .use(Col)
  .use(Tag)
  .use(Button)
  .use(Card)
  .use(Input)
  .use(InputNumber)
  .use(Slider)
  .use(Dropdown)
  .use(Menu)
  .use(Radio)
  .use(Select)
  .use(Progress)
  .use(Form);

app.use(store).use(router); //  use 返回 app instance

app.mount("#app"); //  mount 返回 component instance

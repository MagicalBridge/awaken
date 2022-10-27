import store from "@/store";
import { testData } from "@/store/modules/templates";
import { testComponents, ComponentProps } from "@/store/modules/editor";
import { TextComponentProps } from "@/defaultProps";
import { clone, last } from "lodash-es";
const cloneCompnents = clone(testComponents);

describe(`测试 vuex store`, () => {
  it(`store 是否包含三个模块`, () => {
    expect(store.state).toHaveProperty("user");
    expect(store.state).toHaveProperty("templates");
    expect(store.state).toHaveProperty("editor");
  });

  //  user 模块
  describe(`测试 user 模块`, () => {
    //  登录
    it(`test user login`, () => {
      store.commit("login");
      expect(store.state.user.isLogin).toBeTruthy();
      expect(store.state.user.data?.nickName).toBe("smiling.");
    });
    //  登出
    it(`test user logout`, () => {
      store.commit("logout");
      expect(store.state.user.isLogin).toBeFalsy();
    });
  });

  //  templates 模块
  describe(`测试 templates 模块`, () => {
    it(`默认的 templates 数据`, () => {
      expect(store.state.templates.data).toHaveLength(testData.length);
    });
    it(`模板数据 id 1`, () => {
      const selectTemplate = store.getters.getTemplateById(1);
      expect(selectTemplate.title).toBe("title1");
    });
  });

  //  editor 模块
  describe(`测试 editor 模块`, () => {
    it(`存在默认数据`, () => {
      expect(store.state.editor.components).toHaveLength(cloneCompnents.length);
    });

    it(`当前选择元素, setActive `, () => {
      store.commit("editor/setActive", cloneCompnents[0].id);
      expect(store.state.editor.currentElement).toBe(cloneCompnents[0].id);
      const currentElement = store.getters["editor/getCurrentElement"];
      expect(currentElement.id).toBe(cloneCompnents[0].id);
    });

    it(`添加元素, addComponent`, () => {
      const payload: Partial<TextComponentProps> = {
        text: "text1",
      };
      store.commit("editor/addComponent", payload);
      expect(store.state.editor.components).toHaveLength(
        cloneCompnents.length + 1
      );
      const lastItem = last(store.state.editor.components);
      expect(lastItem?.props.text).toBe("text1");
    });

    it(`更新元素属性, updateComponent`, () => {
      const newProps = {
        key: "text",
        value: "update",
      };
      store.commit("editor/updateComponent", newProps);
      const currentElement: ComponentProps =
        store.getters["editor/getCurrentElement"];
      expect(currentElement.props.text).toBe("update");
    });
  });
});

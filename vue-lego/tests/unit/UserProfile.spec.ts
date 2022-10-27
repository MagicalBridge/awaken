import { mount, VueWrapper } from "@vue/test-utils";
import UserProfile from "@/layout/header/UserProfile.vue";
import { message } from "ant-design-vue";
import store from "@/store";

//  直接模拟三方库实现
jest.mock("ant-design-vue", () => ({
  message: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

//  直接模拟三方库实现, 模拟 history.pushState 实现, 检测数组中是否由该值即可
const mockRoutes: string[] = [];
jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: (url: string) => mockRoutes.push(url),
  }),
}));
// jest.mock("vuex");

//  mock 全局组件
const mockComponent = {
  template: `<div><slot></slot></div>`,
};
const mockComponent2 = {
  template: `<div><slot></slot><slot name="overlay"></slot></div>`,
};
const mockGlobalComponents = {
  "a-button": mockComponent,
  "a-dropdown-button": mockComponent2,
  "router-link": mockComponent,
  "a-menu": mockComponent,
  "a-menu-item": mockComponent,
};

let wrapper: VueWrapper<any>;
describe("UserProfile 组件测试", () => {
  beforeAll(() => {
    jest.useFakeTimers(); //  jest 模拟 timer
    wrapper = mount(UserProfile, {
      props: { user: { isLogin: false } },
      global: {
        components: mockGlobalComponents,
        provide: {
          store, //  直接使用真实的 store 进行行为认证
        },
      },
    });
  });
  it(`测试未登录`, async () => {
    expect(wrapper.find(".user-profile-component").exists()).toBeTruthy();
    expect(wrapper.get(".user-profile-component").text()).toBe("登录");
    // 检测行为
    await wrapper.get(".user-profile-component.login-btn").trigger("click");
    expect(message.success).toHaveBeenCalled();
    //  使用真实 mount.options.global.provide  挂载真实store后, 检验结果
    expect(store.state.user.data?.nickName).toBe("smiling.");
  });
  it(`测试已登录`, async () => {
    //    异步修改传递 props 值
    await wrapper.setProps({
      user: {
        isLogin: true,
        data: {
          nickName: "smiling.",
        },
      },
    });
    const UPC = wrapper.get(".user-profile-component");
    //    检验登录用户名
    expect(UPC.findAll("div")[0]).toBeTruthy();
    expect(UPC.findAll("div")[0].text()).toBe("smiling.");
    //    检验登出节点按钮
    expect(UPC.find(".user-profile-dropdown").exists()).toBeTruthy();
    expect(
      UPC.get(".user-profile-dropdown").find(".logout").exists()
    ).toBeTruthy();
    expect(UPC.get(".user-profile-dropdown").get(".logout").text()).toBe(
      "登出"
    );
    //    检测登出行为
    await UPC.get(".logout").trigger("click");
    expect(message.info).toHaveBeenCalled();
    expect(store.state.user.isLogin).toBeFalsy();
    jest.runAllTimers(); //  执行跑完 timer
    expect(mockRoutes).toEqual(["/"]);
  });
  afterEach(() => {
    //  重置 message 调用
    (message as jest.Mocked<typeof message>).success.mockReset();
    (message as jest.Mocked<typeof message>).info.mockReset();
  });
});

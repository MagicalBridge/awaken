import { shallowMount, VueWrapper } from "@vue/test-utils";
import Hello from "@/components/Hello";
import HelloUser from "@/components/HelloUser.vue";
import flushPromises from "flush-promises";
import axios from "axios";
jest.mock("axios");

//  jest.Mocked 指定 mock 对象为特定类型
const mockAxios = axios as jest.Mocked<typeof axios>;

let wrapper: VueWrapper<any>;
describe("HelloWorld.vue", () => {
  //  beforeEach 每个测试用例执行前会执行的回调函数
  beforeEach(() => {
    wrapper = shallowMount(HelloUser, {
      props: {},
    });
  });
  it("renders props.msg when passed", async () => {
    const msg = "Hello, Vue Test Unit";
    wrapper = shallowMount(Hello, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
    const countBtn = wrapper.get("button.count-btn");
    expect(countBtn).toBeTruthy();
    await countBtn.trigger("click");
    const countWrap = wrapper.get("p.count-wrap");
    expect(countWrap).toBeTruthy();
    expect(countWrap.text()).toBe("1");
    await countBtn.trigger("click");
    await countBtn.trigger("click");
    expect(countWrap.text()).toBe("3");
  });

  it("触发事件", async () => {
    const todoVal = "todo message";
    wrapper = shallowMount(Hello, {
      props: { msg: todoVal },
    });
    const h1 = wrapper.get("h1");
    expect(h1.text()).toBe(todoVal);
    await wrapper.get("input.input-wrap").setValue(todoVal);
    await wrapper.get("button.input-button").trigger("click");
    expect(wrapper.get("ul.todo-container").findAll("li")).toHaveLength(1);
    expect(wrapper.get("ul.todo-container").get("li").text()).toBe(todoVal);
    expect(wrapper.emitted()).toHaveProperty("add-todo");
    await wrapper.get("input.input-wrap").setValue("newValue");
    await wrapper.get("button.input-button").trigger("click");
    expect(wrapper.get("ul.todo-container").findAll("li")).toHaveLength(2);
    const events = wrapper.emitted("add-todo");
    expect(events && events[0]).toEqual([todoVal]);
  });

  it.only("请求测试 - 成功", async () => {
    wrapper = shallowMount(HelloUser, {});
    // 设置成功的 get 请求
    mockAxios.get.mockResolvedValueOnce({
      data: { username: "smiling", name: "wupeng" },
    });
    await wrapper.get("button.load-btn").trigger("click");
    expect(mockAxios.get).toHaveBeenCalled();
    //  让 promise 完成
    await flushPromises();
    const userInfo = wrapper.get("div.user-info");
    expect(userInfo.get("span").text()).toBe("smiling");
    expect(userInfo.findAll("span")[1].text()).toBe("wupeng");
  });

  it.only(`请求测试 - 失败`, async () => {
    wrapper = shallowMount(HelloUser, {});
    mockAxios.get.mockRejectedValueOnce({ message: "请求失败" });
    await wrapper.get("button.load-btn").trigger("click");
    expect(mockAxios.get).toHaveBeenCalled();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    await flushPromises();
    // 检验失败时DOM节点是否生成
    const userInfo = wrapper.get("div.user-info");
    expect(userInfo.find("div.load-error").exists()).toBeTruthy();
    //  检验失败时节点内容是否是 请求失败
    expect(userInfo.get("div.load-error").text()).toBe("请求失败");
  });

  afterEach(() => {
    //  测试用例结束, 重置 mockAxios.get
    mockAxios.get.mockReset();
  });
});

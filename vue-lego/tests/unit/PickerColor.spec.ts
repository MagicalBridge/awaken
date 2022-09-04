import { shallowMount, VueWrapper } from "@vue/test-utils";
import PickerColor from "@/components/PickerColor.vue";
import rgbHex from "rgb-hex";

const defaultColors = [
  "#ffffff",
  "#f5222d",
  "#fa541c",
  "#fadb14",
  "#52c41a",
  "#1890ff",
  "#722ed1",
  "#8c8c8c",
  "#000000",
  "",
];

let wrapper: VueWrapper<any>;
describe(`PickerColor 组件测试`, () => {
  beforeAll(() => {
    wrapper = shallowMount(PickerColor, {
      props: {
        value: "#ffffff",
      },
    });
  });

  it(`组件基础布局和样式`, () => {
    //  检测左侧是否为 input, 类型和值是否正确
    expect(wrapper.find("input").exists()).toBeTruthy();
    const inputEle = wrapper.get("input").element;
    expect(inputEle).toHaveProperty("type");
    expect(inputEle.getAttribute("type")).toBe("color");
    //  检测右侧是否有颜色列表
    expect(wrapper.find(".color-list").exists()).toBeTruthy();
    expect(wrapper.findAll(".color-list li")).toHaveLength(
      defaultColors.length
    );
    //  检测一个元素的 css backgroundColor 属性是否相等对应的颜色
    const firstItem = wrapper.get(".color-list li:first-child div")
      .element as HTMLElement;
    expect("#" + rgbHex(firstItem.style.backgroundColor)).toBe(
      defaultColors[0]
    );
    //  检测最后一个元素是否有特殊的类名
    const lastItem = wrapper.get(".color-list li:last-child div")
      .element as HTMLElement;
    expect(lastItem.classList).toContain("transparent-back");
  });

  it(`组件的 input 的行为和事件`, async () => {
    //  检测 input 修改后, 是否发送了对应的事件和值
    const blackHex = "#000000";
    const input = wrapper.get("input");
    await input.setValue(blackHex);
    expect(wrapper.emitted()).toHaveProperty("change");
    const events = wrapper.emitted("change") || [];
    expect(events[0]).toEqual([blackHex]);
  });

  it(`组件的右侧颜色列表的行为和事件`, async () => {
    //  检测颜色列表点击后, 是否发送对应的事件和值
    const firstItem = wrapper.get(".color-list li div");
    await firstItem.trigger("click");
    const events = wrapper.emitted("change") || [];
    expect(events[1]).toEqual([defaultColors[0]]);
  });
});

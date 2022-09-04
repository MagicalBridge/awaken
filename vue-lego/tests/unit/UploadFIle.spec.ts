import { mount, shallowMount, VueWrapper } from "@vue/test-utils";
import UploadFile from "@/components/UploadFile.vue";
import flushPromises from "flush-promises";
import axios from "axios";
jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

const mockComponent = {
  template: `<div><slot></slot></div>`,
};

const mockComponents = {
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent,
  CloseOutlined: mockComponent,
};

const mockGlobalComponents = {
  "a-progress": mockComponent,
};

let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });

const setInputValue = (fileInput: HTMLInputElement) => {
  const files = [testFile];
  Object.defineProperty(fileInput, "files", {
    value: files,
    writable: false, //  不可写
  });
};

describe(`UploadFile 组件测试`, () => {
  beforeAll(() => {
    jest.useFakeTimers();

    wrapper = mount(UploadFile, {
      props: {
        action: "test.file",
      },
      global: {
        components: mockGlobalComponents,
        stubs: mockComponents,
      },
    });
  });

  it(`组件基本展示`, () => {
    expect(wrapper.get("button").text()).toBe("点击上传"); //  button 文案
    expect(wrapper.get("input").isVisible()).toBeFalsy(); //  input 隐藏
  });

  it(`组件行为测试 - 上传成功`, async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { status: "success" } });
    //  给 input 添加 files 属性, 如何模拟 file 文件
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    //  input change 触发
    expect(wrapper.get("button").text()).toBe("点击上传");
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).toBeCalledTimes(1);
    expect(wrapper.get("button").text()).toBe("正在上传");
    //  列表长度修改, 并且有正确的 class
    expect(wrapper.get("button").attributes()).toHaveProperty("disabled"); //  检验按钮 disabled 状态
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.find("li:first-child");
    expect(firstItem.classes()).toContain("upload-loading");
    await flushPromises();
    await jest.runAllTimers();
    expect(wrapper.get("button").text()).toBe("点击上传");
    //  正确的 class, 并且文件名对应
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe(testFile.name);
  });

  it(`组件行为测试 - 上传失败`, async () => {
    mockAxios.post.mockRejectedValueOnce({ message: "操作失败" });
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).toBeCalledTimes(1);
    expect(wrapper.get("button").text()).toBe("正在上传");
    await flushPromises();
    await jest.runAllTimers();
    expect(wrapper.get("button").text()).toBe("点击上传");
    expect(wrapper.findAll("li").length).toBe(2);
    const lastItem = wrapper.find("li:last-child");
    expect(lastItem.classes()).toContain("upload-error");
    //  点击删除删除该项
    await lastItem.get(".delete-icon").trigger("click");
    expect(wrapper.findAll("li").length).toBe(1);
  });

  it(`组件测试 - 支持自定义模板`, async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    mockAxios.post.mockResolvedValueOnce({ data: { url: "xyz.url" } });
    const wrapper = mount(UploadFile, {
      props: {
        action: "test.upload",
      },
      slots: {
        default: `<button>custom button</button>`,
        loading: `<button class="loading">custom loading</button>`,
        uploaded: `<template #uploaded="{ uploadedData }"> 
          <div class="custom-loaded">{{ uploadedData.url }}</div>
        </template>`,
      },
      global: {
        stubs: mockComponents,
        components: mockGlobalComponents,
      },
    });

    expect(wrapper.get("button").text()).toBe("custom button");
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    expect(wrapper.get(".loading").text()).toBe("custom loading");
    await flushPromises();
    await jest.runAllTimers();
    expect(wrapper.get(".custom-loaded").text()).toBe("dummy.url");
    //  第二次触发
    await wrapper.get("input").trigger("change");
    expect(wrapper.get(".loading").text()).toBe("custom loading");
    await flushPromises();
    await jest.runAllTimers();
    expect(wrapper.get(".custom-loaded").text()).toBe("xyz.url");
  });

  it(`生命钩子函数测试 - before upload - boolean`, async () => {
    const callback = jest.fn();
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const checkFileSize = (file: File) => {
      if (file.size > 2) {
        callback();
        return false;
      }
      return true;
    };
    const wrapper = shallowMount(UploadFile, {
      props: {
        action: "test.url",
        beforeUpload: checkFileSize,
      },
      global: {
        components: mockGlobalComponents,
      },
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).not.toHaveBeenCalled();
    expect(wrapper.findAll("li").length).toBe(0);
    expect(callback).toHaveBeenCalled();
  });

  it(`生命钩子函数测试 - before upload - Promise<File>`, async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const failPromise = () => {
      return Promise.reject("wrong type");
    };
    const successPromise = (file: File) => {
      const newFile = new File([file], "new_name.docx", { type: file.type });
      return Promise.resolve(newFile);
    };
    const successPromiseWithWrongType = () => {
      return Promise.resolve("abcd");
    };
    const wrapper = shallowMount(UploadFile, {
      props: {
        action: "test.url",
        beforeUpload: failPromise,
      },
      global: {
        components: mockGlobalComponents,
      },
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    //  fail promise
    await wrapper.get("input").trigger("change");
    await flushPromises();
    expect(mockAxios.post).not.toHaveBeenCalled();
    expect(wrapper.findAll("li").length).toBe(0);
    //  success promise with wrong file
    await wrapper.setProps({ beforeUpload: successPromiseWithWrongType });
    await wrapper.get("input").trigger("change");
    await flushPromises();
    expect(mockAxios.post).not.toHaveBeenCalled();
    //  success promise with file
    await wrapper.setProps({ beforeUpload: successPromise });
    await wrapper.get("input").trigger("change");
    await flushPromises();
    await jest.runAllTimers();
    expect(mockAxios.post).toHaveBeenCalled();
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe("new_name.docx");
  });

  it(`生命构造函数 - UploadProgress UploadError UploadSuccess`, async () => {
    //
  });

  it(`拖拽测试`, async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const wrapper = shallowMount(UploadFile, {
      props: {
        action: "test.url",
        drag: true,
      },
      global: {
        components: mockGlobalComponents,
      },
    });
    const uploadArea = wrapper.get(".upload-area");
    await uploadArea.trigger("dragover");
    expect(uploadArea.classes()).toContain("is-dragover");
    await uploadArea.trigger("dragleave");
    expect(uploadArea.classes()).not.toContain("is-dragover");
    //  模拟 drop
    await uploadArea.trigger("drop", {
      dataTransfer: { files: [testFile] },
    });
    expect(mockAxios.post).toHaveBeenCalled();
    await flushPromises();
    await jest.runAllTimers();
    expect(wrapper.findAll("li").length).toBe(1);
  });

  it(`autoUpload 测试`, async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const wrapper = shallowMount(UploadFile, {
      props: {
        action: "test.url",
        drag: true,
        autoUpload: false,
      },
      global: {
        components: mockGlobalComponents,
      },
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("upload-ready");
    //  通过实例调用 uploadFiles 方法执行上传
    wrapper.vm.uploadFiles();
    expect(mockAxios.post).toHaveBeenCalled();
    await flushPromises();
    await jest.runAllTimers();
    expect(firstItem.classes()).toContain("upload-success");
  });

  it(`listType 为 picture 并使用 URL.createObjectURL 进行图片本地预览`, async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    //  模拟 URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => "test.url");
    const wrapper = mount(UploadFile, {
      props: {
        action: "test.url",
        listType: "picture",
      },
      global: {
        components: mockGlobalComponents,
      },
    });
    expect(wrapper.get("ul").classes()).toContain("upload-list-picture");
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    await flushPromises();
    await jest.runAllTimers();
    expect(wrapper.findAll("li").length).toBe(1);
    expect(wrapper.find("li:first-child img").exists()).toBeTruthy();
    const firstImg = wrapper.get("li:first-child img");
    expect(firstImg.attributes("src")).toEqual("test.url");
  });

  afterEach(() => {
    //  case 执行完 重置 mockAxios.post 重置
    mockAxios.post.mockReset();
  });
});

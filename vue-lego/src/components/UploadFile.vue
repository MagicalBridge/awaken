<template>
  <div class="upload-file-component">
    <div
      class="upload-area"
      :class="{
        'is-dragover': drag && isDragOver,
      }"
      v-on="events"
    >
      <slot v-if="isUploading" name="loading">
        <button disabled>正在{{ !autoUpload ? "选择" : "上传" }}</button>
      </slot>
      <slot
        v-else-if="lastFileData && lastFileData.loaded"
        name="uploaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击{{ !autoUpload ? "选择" : "上传" }}</button>
      </slot>
    </div>
    <button v-if="!autoUpload" @click="uploadFiles">开始上传</button>

    <input
      @change="handleFileChange"
      ref="inputFileRef"
      type="file"
      :style="{ display: 'none' }"
    />
    <ul v-if="showUploadList" :class="`upload-list upload-list-${listType}`">
      <li
        v-for="file in filesList"
        :key="file.uid"
        :class="`upload-item upload-${file.status}`"
      >
        <img
          v-if="listType === 'picture' && file.url"
          :src="file.url"
          :alt="file.name"
          width="80"
        />
        <span class="filename">
          <template v-if="file.status === 'loading'">
            <LoadingOutlined />
            <a-progress :percent="file.process" size="small" />
          </template>
          <template v-else>
            <FileOutlined />
            {{ file.name }}
          </template>
        </span>
        <span @click="handleDeleteItem(file.uid)" class="delete-icon">
          <CloseOutlined />
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType } from "vue";
import {
  LoadingOutlined,
  FileOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import { last } from "lodash-es";
import { v4 as uuidV4 } from "uuid";
type UploadStatus = "ready" | "loading" | "success" | "error";

export interface UploadFile {
  uid: string;
  name: string;
  size: number;
  raw: File;
  status: UploadStatus;
  resp?: any;
  process?: number;
  url?: string;
}

type CheckUpload = (file: File) => boolean | Promise<File>;
type UploadProgress = (loaded: number, total: number) => void;
type UploadError = (error: Error) => void;
type UploadSuccess = (result: any) => void;

export default defineComponent({
  emits: ["success"],
  props: {
    action: {
      type: String,
      default: "/api/lego/upload",
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    listType: {
      type: String,
      default: "text",
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>,
    },
    uploadProgress: {
      type: Function as PropType<UploadProgress>,
    },
    uploadError: {
      type: Function as PropType<UploadError>,
    },
    uploadSuccess: {
      type: Function as PropType<UploadSuccess>,
    },
  },
  setup(props, context) {
    const uploadStatus = ref<UploadStatus>("ready");
    const filesList = ref<UploadFile[]>([]);
    const isDragOver = ref(false);
    //  是否出于上传中
    const isUploading = computed(() =>
      filesList.value.some((file) => file.status === "loading")
    );
    const inputFileRef = ref<null | HTMLInputElement>(null);

    // button 触发 input[type=file] 执行上传工作
    const triggerUpload = () => {
      if (inputFileRef.value) {
        inputFileRef.value.click();
      }
    };

    const lastFileData = computed(() => {
      const lastFile = last(filesList.value);
      if (lastFile) {
        return {
          loaded: lastFile.status === "success",
          data: lastFile.resp,
        };
      }
      return false;
    });

    //  上传逻辑
    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData();
      formData.append(readyFile.name, readyFile.raw);
      readyFile.status = "loading"; //  初始文件状态
      readyFile.process = 0; //  重置进度
      axios
        .post(`${props.action}`, formData, {
          headers: {
            "Content-Type": "mutipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const { total, loaded } = progressEvent;
            readyFile.process = Number(((loaded / total) * 100).toFixed(0));
            //  上传进度钩子函数
            if (props.uploadProgress) {
              props.uploadProgress(loaded, total);
            }
          },
          timeout: 10000,
        })
        .then((resp) => {
          setTimeout(() => {
            readyFile.status = "success";
            readyFile.process = 100;
            if (props.uploadSuccess) {
              props.uploadSuccess(resp);
            }
          }, 700);
          readyFile.resp = resp.data;
          context.emit("success", { resp: resp.data, file: readyFile.raw });
        })
        .catch((error) => {
          setTimeout(() => {
            readyFile.status = "error";
            if (props.uploadError) {
              props.uploadError(error);
            }
          }, 700);
        })
        .finally(() => {
          //  重置 input value 值, 保证 input change 事件正常触发
          if (inputFileRef.value) {
            inputFileRef.value.value = "";
          }
        });
    };

    const addFileToList = (file: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidV4(),
        size: file.size,
        name: file.name,
        status: "ready",
        raw: file,
      });
      if (props.listType === "picture") {
        try {
          fileObj.url = URL.createObjectURL(file);
          // const fileRender = new FileReader();
          // fileRender.readAsDataURL(file);
          // fileRender.addEventListener("load", () => {
          //   fileObj.url = fileRender.result as string;
          // });
        } catch (e) {
          console.error("upload File error", e);
        }
      }

      filesList.value.push(fileObj);
      //  确定自动上传时, 执行上传逻辑方法
      if (props.autoUpload) {
        postFile(fileObj);
      }
    };

    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        const uploadFile = files[0];
        //  上传文件前钩子逻辑
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadFile);
          if (result && result instanceof Promise) {
            result
              .then((processedFile) => {
                if (processedFile instanceof File) {
                  addFileToList(processedFile);
                } else {
                  throw new Error(
                    "beforeUpload Promise should return File object"
                  );
                }
              })
              .catch((e) => {
                console.log(e);
              });
          } else if (result === true) {
            addFileToList(uploadFile);
          }
        } else {
          addFileToList(uploadFile);
        }
      }
    };

    //  暴露的上传文件方法, 当 autoUpload 为 false 使用
    const uploadFiles = () => {
      filesList.value
        .filter((file) => file.status === "ready")
        .forEach(postFile);
    };

    //  input 内容改变触发上传文件操作
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      beforeUploadCheck(files);
    };

    const handleDeleteItem = (id: string) => {
      filesList.value = filesList.value.filter((file) => file.uid !== id);
    };

    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault();
      isDragOver.value = over;
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      isDragOver.value = false;
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files);
      }
    };

    //  事件注册
    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload,
    };

    //  启动 drop 时, 添加 dragover, dragleave, drop 事件
    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => {
          handleDrag(e, true);
        },
        dragleave: (e: DragEvent) => {
          handleDrag(e, false);
        },
        drop: handleDrop,
      };
    }

    return {
      uploadStatus,
      inputFileRef,
      triggerUpload,
      handleFileChange,
      filesList,
      isUploading,
      handleDeleteItem,
      lastFileData,
      isDragOver,
      events,
      uploadFiles,
    };
  },
  components: {
    LoadingOutlined,
    FileOutlined,
    CloseOutlined,
  },
});
</script>

<style scoped>
.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area.is-dragover {
  border-color: aqua;
}

.upload-success {
  color: aqua;
}
.upload-error {
  color: red;
}

.upload-loading {
  color: beige;
}
</style>

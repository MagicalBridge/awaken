<template>
  <div class="about">
    <h1>This is an template detail page</h1>
    <div>{{ template.id }} - {{ template.title }} - {{ template.author }}</div>
    <a-button @click="goEditor">编辑</a-button>
    <Hello msg="hello" />
    <PickerColor @change="handlePickerChange" :value="pickColor" />
    <UploadTest />
    <hr />
    <UploadFile
      ref="uploadRef"
      :before-upload="handleBeforeUpload"
      :upload-progress="handleOnUploadProcess"
      :upload-success="handleOnUploadSuccess"
      :upload-error="handleOnUploadError"
      :auto-upload="false"
      list-type="picture"
      drag
    >
      <template #default>custom 点击上传</template>
      <template #loading>custom 上传中</template>
      <template #uploaded="{ uploadedData }">
        {{ uploadedData.url }}
      </template>
    </UploadFile>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import { GlobalDataProps } from "@/store";
import { TemplateProps } from "@/store/modules/templates";

import Hello from "@/components/Hello";
import PickerColor from "@/components/PickerColor.vue";
import UploadTest from "@/components/UploadTest.vue";
import UploadFile from "@/components/UploadFile.vue";

export default defineComponent({
  name: "TemplateDetailPage",
  setup() {
    const uploadRef = ref();
    const route = useRoute();
    const router = useRouter();
    const store = useStore<GlobalDataProps>();
    const currentId = route.params.id as string;
    const template = computed<TemplateProps>(() =>
      store.getters.getTemplateById(parseInt(currentId))
    );

    const goEditor = () => {
      router.push(`/editor/${currentId}`);
    };

    const pickColor = ref<undefined | string>(undefined);
    const handlePickerChange = (color: string) => {
      pickColor.value = color;
    };

    const handleOnUploadProcess = (loaded: number, total: number) => {
      console.log("- handleOnUploadProcess", loaded, total);
    };

    const handleBeforeUpload = (file: File) => {
      console.log("handleBeforeUpload", file);
      return true;
    };

    const handleOnUploadSuccess = (result: any) => {
      console.log("handleOnUploadSuccess", result);
    };
    const handleOnUploadError = (e: Error) => {
      console.log("handleOnUploadError", e.message);
    };

    return {
      uploadRef,
      template,
      pickColor,
      handlePickerChange,
      goEditor,
      handleBeforeUpload,
      handleOnUploadProcess,
      handleOnUploadSuccess,
      handleOnUploadError,
    };
  },
  components: {
    Hello,
    PickerColor,
    UploadTest,
    UploadFile,
  },
});
</script>

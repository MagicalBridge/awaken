<template>
  <div class="styled-upload">
    <upload-file
      class="styled-uploader"
      action="/api/lego/upload"
      :show-upload-list="false"
      :before-upload="commonUploadCheck"
      @success="handleUploadSuccess"
    >
      <div class="uploader-container">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </div>
      <template #loading>
        <div class="uploader-container disabled">
          <LoadingOutlined spin />
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded>
        <div class="uploader-container">
          <FileImageOutlined />
          <h4>上传图片</h4>
        </div>
      </template>
    </upload-file>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FileImageOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import UploadFile from "@/components/UploadFile.vue";
import { commonUploadCheck } from "@/helper";
export default defineComponent({
  emits: ["success"],
  setup(props, context) {
    const handleUploadSuccess = ({ resp, file }: { resp: any; file: File }) => {
      context.emit("success", { resp, file });
    };

    return {
      commonUploadCheck,
      handleUploadSuccess,
    };
  },
  components: {
    UploadFile,
    FileImageOutlined,
    LoadingOutlined,
  },
});
</script>

<style scoped>
.styled-upload {
  padding: 8px 16px;
  width: 112px;
  color: aliceblue;
  border-radius: 6px;
  background: #2895fd;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
}

.styled-upload:hover {
  opacity: 0.94;
}

.uploader-container {
  display: flex;
  align-items: center;
}

.uploader-container.disabled {
  opacity: 0.8;
  cursor: wait;
}

.uploader-container h4 {
  color: aliceblue;
  margin-bottom: 0;
}

.uploader-container > span {
  margin-right: 4px;
}
</style>

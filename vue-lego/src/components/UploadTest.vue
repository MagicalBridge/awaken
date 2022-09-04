<template>
  <div class="upload-test">
    <input type="file" @change="handleUploadFile" />
    <button type="submit">上传</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
export default defineComponent({
  setup() {
    const handleUploadFile = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uplaodFile = files[0];
        const formData = new FormData();
        formData.append(uplaodFile.name, uplaodFile); //  传 key 为上传图片名, 值为图片的二进制流
        formData.append("name", uplaodFile.name); //  传 key 为, name 值为图片名的字段
        //  使用 ajax 上传文件
        axios
          .post(`http://local.upload.test/7001`, formData, {
            headers: {
              "Content-Type": "mutipart/form-data",
            },
          })
          .then((resp) => {
            console.log(resp.data);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    };
    return {
      handleUploadFile,
    };
  },
});
</script>

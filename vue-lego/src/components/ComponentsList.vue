<template>
  <div class="component-container">
    <div class="image-component">
      <StyledUpload @success="onImageUploaded" />
    </div>
    <div class="text-component">
      <div
        v-for="(item, index) in list"
        :key="index"
        @click="onItemClick(item)"
        class="text-component-item"
      >
        <l-text v-bind="item"></l-text>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import StyledUpload from "@/components/StyledUpload.vue";
import LText from "@/components/LText.vue";
import { v4 as uuidV4 } from "uuid";
import {
  imageDefaultProps,
  TextComponentProps,
  textDefaultProps,
} from "@/defaultProps";
import { ComponentProps } from "@/store/modules/editor";
import { UploadResp } from "@/extraType";
import { getImageDimension } from "@/helper";

export default defineComponent({
  props: {
    list: Array as PropType<Partial<TextComponentProps>[]>,
    default: () => [],
  },
  emits: ["on-item-click"],
  setup(props, { emit }) {
    const onItemClick = (props: Partial<TextComponentProps>) => {
      const componentData: ComponentProps = {
        name: "l-text",
        id: uuidV4(),
        props: { ...textDefaultProps, ...props },
      };
      emit("on-item-click", componentData);
    };

    const onImageUploaded = (data: { resp: UploadResp; file: File }) => {
      const { resp, file } = data;
      const componentData: ComponentProps = {
        name: "l-image",
        id: uuidV4(),
        props: {
          ...imageDefaultProps,
        },
      };
      console.log(resp.data); //  TODO: 使用线上地址, 这里暂时使用本地内存图片地址, 后面服务端开发完成后替换
      // componentData.props.src = resp.data.url;
      componentData.props.src = URL.createObjectURL(file);
      getImageDimension(file).then(({ width }) => {
        const maxWidth = 260;
        componentData.props.width =
          String(width > maxWidth ? maxWidth : width) + "px";

        emit("on-item-click", componentData);
      });
    };
    return { onItemClick, onImageUploaded };
  },
  components: {
    StyledUpload,
    LText,
  },
});
</script>

<style scoped>
.component-container {
  display: flex;
}
</style>

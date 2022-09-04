<template>
  <div class="editor-page">
    <a-row class="container">
      <a-col :span="6" class="templates-wrap">
        组件列表
      </a-col>
      <a-col :span="12" class="editor-wrap">
        <div class="control">
          <!-- 动态渲染组件 -->
          画布区域
        </div>
      </a-col>
      <a-col :span="6" class="attrs-wrap">
        <!-- 属性渲染/编辑 -->
        属性渲染
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditorPage",
  components: {},
});
</script>

<style scoped>
.editor-page {
  height: 100vh;
}

.container {
  height: 100%;
}

.container .templates-wrap {
  height: 100%;
  background: antiquewhite;
}

.templates-wrap .components-wrap {
  height: 100%;
}

.container .editor-wrap {
  padding: 120px 60px 0;
  background: plum;
}
.container .editor-wrap .control {
  min-height: 360px;
  background: aliceblue;
}
.container .attrs-wrap {
  background: aliceblue;
}
</style>

<template>
  <div class="editor" id="editor-layout-main">
    <a-layout :style="{ background: 'fff' }">
      <a-layout-header class="header">
        <div class="page-title">慕课乐高</div>
      </a-layout-header>
      <a-layout-side width="300" style="background: yellow">
        <div class="sidebar-container">组件列表</div>
      </a-layout-side>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area"></div>
        </a-layout-content>
      </a-layout>
      <a-layout-side width="300" style="background: purple">
        <div class="setting-container">组件属性</div>
      </a-layout-side>
    </a-layout>
  </div>
</template>

<script>
export default {}
</script>

<style>
.sidebar-container {
  height: 100%;
}
</style>

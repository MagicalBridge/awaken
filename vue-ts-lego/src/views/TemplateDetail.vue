<template>
  <div class="homepage-container">
    <a-layout :style="{ background: 'fff' }">
      <a-layout-header class="header">
        <div class="page-title">慕课乐高</div>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <div class="content-container">
          <template-list :list="testData"></template-list>
        </div>
      </a-layout-content>
      <a-layout-footer>
        版权所有
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>

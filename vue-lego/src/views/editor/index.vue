<template>
  <div class="editor-page">
    <a-row class="container">
      <a-col :span="6" class="templates-wrap">
        <components-list
          :list="defaultTextTemplates"
          @onItemClick="handleItemClick"
        ></components-list>
      </a-col>
      <a-col :span="12" class="editor-wrap">
        <div class="control">
          <!-- 动态渲染组件 -->
          <edit-wrapper
            v-for="component in components"
            :key="component.id"
            :id="component.id"
            :active="currentElement?.id === component.id"
            @setActive="setActive"
          >
            <component
              :is="component.name"
              v-bind="component.props"
            ></component>
          </edit-wrapper>
        </div>
      </a-col>
      <a-col :span="6" class="attrs-wrap">
        <!-- 属性渲染/编辑 -->
        <props-table
          v-if="currentElement && currentElement.props"
          :props="currentElement.props"
          @change="handleChange"
        ></props-table>
        <pre>{{ currentElement?.props }}</pre>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store/index";
import { ComponentProps } from "@/store/modules/editor";
import { defaultTextTemplates } from "@/defaultTemplates";

import LText from "@/components/LText.vue";
import LImage from "@/components/LImage.vue";
import ComponentsList from "@/components/ComponentsList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import PropsTable from "@/components/PropsTable.vue";

export default defineComponent({
  name: "EditorPage",
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);

    const handleItemClick = (component: any) => {
      store.commit("editor/addComponent", component);
    };

    const setActive = (id: string) => {
      store.commit("editor/setActive", id);
    };

    //  当前选中
    const currentElement = computed<null | ComponentProps>(
      () => store.getters["editor/getCurrentElement"]
    );

    //  表单属性变更监听
    const handleChange = ({ key, value }: { key: string; value: any }) => {
      store.commit("editor/updateComponent", { key, value });
    };

    return {
      components,
      defaultTextTemplates,
      handleItemClick,
      setActive,
      currentElement,
      handleChange,
    };
  },
  components: {
    LText,
    LImage,
    ComponentsList,
    EditWrapper,
    PropsTable,
  },
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

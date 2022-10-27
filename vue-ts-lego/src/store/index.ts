import { createStore } from "vuex";
import { UserProps } from "./modules/user";
import { TemplatesProps } from "./modules/templates";
import { EditorProps } from "./modules/editor";
import user from "./modules/user";
import templates from "./modules/templates";
import editor from "./modules/editor";

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
}

const store = createStore({
  modules: {
    templates,
    user,
    editor,
  },
});

export default store;

import { ref, defineComponent, reactive } from "vue";
import HelloUser from "./HelloUser.vue";

export default defineComponent({
  props: {
    msg: {
      type: String,
    },
  },
  emits: ["add-todo"],
  setup(props, context) {
    const count = ref(0);

    const increment = () => {
      count.value++;
    };

    const inputValue = ref("");
    const todos = reactive<string[]>([]);

    const addTodo = () => {
      const todo = inputValue.value;
      todos.push(todo);
      context.emit("add-todo", todo);
    };

    return () => (
      <div>
        <h1>{props.msg}</h1>
        <p class={"count-wrap"}>{count.value}</p>
        <button class={"count-btn"} onClick={increment}>
          increment count
        </button>
        <br />
        <input v-model={inputValue.value} class="input-wrap" type="text" />{" "}
        <button class="input-button" onClick={addTodo}>
          add TODO
        </button>
        <ul class="todo-container">
          {todos &&
            todos.map((todo) => {
              return <li>{todo}</li>;
            })}
        </ul>
        <hr />
        <HelloUser />
      </div>
    );
  },
});

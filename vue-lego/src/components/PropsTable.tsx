import { defineComponent, computed, PropType, VNode } from "vue";
import { reduce } from "lodash-es";
import { TextComponentProps } from "@/defaultProps";
import { mapPropsToForms } from "@/propsMap";
import { Input, InputNumber, Slider, Radio, Select } from "ant-design-vue";

const mapToComponent = {
  "a-textarea": Input.TextArea,
  "a-input-number": InputNumber,
  "a-slider": Slider,
  "a-radio-group": Radio.Group,
  "a-radio-button": Radio.Button,
  "a-select": Select,
  "a-select-option": Select.Option,
} as any;

interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}

function capitatizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default defineComponent({
  props: {
    props: {
      type: Object as PropType<Partial<TextComponentProps>>,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const finallyProps = computed(() =>
      reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            const {
              valueProp = "value",
              eventName = "change",
              initalTransform,
              afterTransform,
            } = item;
            const newItem = {
              ...item,
              value: initalTransform ? initalTransform(value) : value,
              valueProp,
              eventName,
              events: {
                ["on" + capitatizeFirstLetter(eventName)]: (e: any) =>
                  context.emit("change", {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  }),
              },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {} as { [key: string]: FormProps }
      )
    );

    return () => (
      <div class="props-table">
        {Object.keys(finallyProps.value).map((key) => {
          const value = finallyProps.value[key];
          const ComponentName = mapToComponent[value.component];
          const SubComponent = value.subComponent
            ? mapToComponent[value.subComponent]
            : null;
          const props = {
            [value.valueProp]: value.value,
            ...value.extraProps,
            ...value.events,
          };
          return (
            <div key={key} class={"prop-item"}>
              {value.text && <span class="label">{value.text}</span>}
              <div class={"prop-component"}>
                <ComponentName {...props}>
                  {value.options &&
                    value.options.map((option, index) => {
                      return (
                        <SubComponent key={index} value={option.value}>
                          {option.text}
                        </SubComponent>
                      );
                    })}
                </ComponentName>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});

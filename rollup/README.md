## 编译报错：
babelHelpers: 'bundled' option was used by default. It is recommended to configure this option explicitly, read more here: https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers

上面的提示意思是，在使用babel插件的时候，babelHelpers这个配置项希望被显示的声明添加，即使本身就是有默认值的，默认值是bundled。
## 安装包的时候
- npm nrm use taobao
- yarn  yrm use taobao

- pnpm


09:40
Hedgehog
新旧差别大吗 一样
靜待雨落
旧的是不是 需要引入react  新的是 jsx 不需要引入react 


09:46
浅夏
我们现在用yarn3 
我赌你的枪里没有子弹
老师讲课也用pnpm吧 



人生只如初见
直接判断..children的长度不是一样么？ 
靜待雨落
肯定是个数组 判断长度是可以的
不一定是个 数组  页可能是null 
09:59
xiaohai
为啥没有导出就会自动编译呢 
1
为啥这个标识常量要搞个symbol包一下,直接用字符串不行吗 
字符串可能会重复
symbol永远不会重复的，独一无二的值

我赌你的枪里没有子弹
hello 为啥编译成props了 
children是props的一个属性
props.children = [hello]; 
👵
children不递归吗 
递归,但是这个递归是babel帮我们做的
babel会帮我们递归调用
人生只如初见撤回了一条消息
沉默的木子
是先通过babel编译成了React。createElement这样的语法嘛 
是的
xiaohai
index.js 



堆栈中createment执行上下文不止压一个吧
这个不一定，看你嵌套的个数
<div>
 <div>
   <div>
 </div>
</div>   
123
createElement 执行完毕生成的vdom 经过react-dom 处理生成真实的dom 插入页面 
靜待雨落
嗯嗯 明白了 



10:50
👵
调用函数组件那一行bable做了啥 
10:56
kkkk
class的type也是函数？ 
lzb
执行render 
浅夏
那如果人为的在函数组件上也添加这个静态属性，岂不是乱套了 
是的


double撤回了一条消息
人生只如初见
state对象里怎么删除某个属性？
无法删除，只能设置为null
setState({number:null}); 
double
在合成事件和钩子里面事异步 
靜待雨落
这样多次setState  就只更新一次了把 
现是同步的，更新没有合并，所以多次更次会更次多次
123
不能删，你要是不用，就不创建 


不要直接操作state
要想修改状态只能用this.setState();


11:55
沉默的木子
是在click事件里面 
double
dom 是不是直接全部换的 是的
废物的点心
在click里 
kkkk
在点击弄的短点 

11:59
xiaohai
相当于没有Dom diff 了吗 是的 
ilark
通过oldVdom获取真实DOM调用了2次，有优化空间 
yuanwang
再看一下 finddom相关的流程吧 

最佳划水选手
vdom.dom是在哪里赋值的？ 
老师，forceUpdate第三行不能这么写吧，对函数式组件不适应 

h2x撤回了一条消息
喜喜
实际使用不可能在事件函数里这么写吧 
因为不可能，所出就引出另一个实现 合成事件
合成事件两个目标
1.在实现批量更新时候帮我们调用 updateQueue.isBatchingUpdate = true; updateQueue.batchUpdate();
2.实现兼容性处理，把不标准的浏览器按着现变成标准的实现
靜待雨落
相同的状态是不是可以不用更新  
是的 这就是我们后讲的性能优化中 
React.PureComponent可以实现状态如果不变，就不用更新

人生只如初见
当前组件和子组件都更新了 
h2x
set了，我忘记了 
1
不是遍历set 里面的都更新吗 
h2x
我搞错了，是一次 
废物的点心
clear哪里来的 


函数组件没有render 呢 
人生只如初见
看一下set下面哪个函数实现呢 
kkkk
再看一下，咋实现的 
h2x
不需要用微任务来更新视图吗 




人生只如初见
updateComponent多次执行的话，render不是也执行多次了么？为什么不只执行最后一次的updateComponent 
沉默的木子
因为updaters是一个Set,而Set里的每个元素是唯一的。
现在是只有一个组件，调用的他的updateComponent 
人生只如初见
哦，set对多次setState时收集的同一个实例做了过滤 
喜喜
没理解委托这里 
123
storee【eventType】_store_ 上没有呢 
沉默的木子
let store = dom.store || (dom.store = {}) 
这不是先读dom.store，如果没有就执行后面的，先给dom.store => {}, 之后才是执行=号赋值 
123
这个event 从那里来的 
废物的点心
event就相当原生事件上的e，就是把任何元素的事件都挂在document上了 
喜喜
1 


沉默的木子
那要是两个按钮都绑定的click事件，那document[eventType]不是重复了？会覆盖吗 
给文档 对象绑一次就行了
123
那要是 button 外层也有个div。也帮定个onclick 事件呢。在document 上的 怎么执行呢，点击button  button上的事件执行完毕， div的事件 再执行 
人生只如初见
事件委托这里怎么处理冒泡 
h2x
要是我写 的事件里面阻止了冒泡呢 




如果建立多个组件  document会被多次绑定事件咯  感觉这一块放在初始化的地方好点 
人生只如初见
多个组件不会被多次绑定啊 
沉默的木子
原生事件执行就是在冒泡阶段执行的吧 
123
会走 
1
判断了target 就不会走div了 
韦林
因为事件没在Button 上 
喜喜
没懂为啥没冒泡，div不是也加了onclick的事件函数 
沉默的木子
就是说事件都是绑定在document上面的，所以就没法向上冒泡了，只是调用的方法是target上的handler 



如果建立多个组件  document会被多次绑定事件咯  感觉这一块放在初始化的地方好点 
1.多个组件，文档 不会绑定多个事件 因为做了判断了，如果绑过了就不绑了
2.其实在源码真的就是一上来就全在初始化阶段绑上了所有的事件
http://www.zhufengpeixun.com/strong/html/126.12.react-4.html#t204.1%20react-dom.js


人生只如初见
多个组件不会被多次绑定啊 
沉默的木子
原生事件执行就是在冒泡阶段执行的吧 是的
123
会走 
1
判断了target 就不会走div了 是的
韦林
因为事件没在Button 上 
喜喜
没懂为啥没冒泡，div不是也加了onclick的事件函数 
没有，我们没有给任何DOm添加onclick
只能document添加了事件函数
沉默的木子
就是说事件都是绑定在document上面的，所以就没法向上冒泡了，只是调用的方法是target上的handler 
人生只如初见
怎，1判断是否阻止冒泡 
123撤回了一条消息
123撤回了一条消息
14:48
h2x
51错了吧 
人生只如初见
51行是不是写错了？应该是 = nativeEvent 
123
一样的因为 从nativeEvent copy 了一遍 
喜喜
我还没懂最开始为啥冒泡没冒成 
人生只如初见
因为只有document上有事件，其他元素上没有事件 是的
沉默的木子
事件都是绑定在document上了，没法向上冒泡了啊  的
废物的点心
事件在docuemnt上 所以没冒成 是的
其实原生冒泡是执行了，一直冒泡到文档 对象上了
喜喜
div上不是绑了吗 
123
阻止了冒泡那事件不久绑定不到document 吗？ 
h2x
72也错了吧 
人生只如初见
绑定到document上和冒泡无关 
1
这样生成封装的事件对象 会不会很耗性能? 能不能直接用Object.create() 
漫漫人生
没有return 
h2x
54 
h2x
54，76错了 



div上面有，但是创建的时候是先创建了button，所以创建div的时候就不会再绑定事件了 
div上没有绑定事件
1.绑定时候先绑的是div

14:59
沉默的木子
是不是如果用Object.create的话，当是函数的时候this就不好保证了？ 
废物的点心
老师 你在模拟阻止冒泡的方法里调用了原生的阻止冒泡的方法， 不阻止也不会有问题吧？  
其实没有问题



喜喜
模拟阻止冒泡 是阻止 模拟冒泡那段吗 
张仁阳
休息5分 
h2x
如果我用同步任务setstate，把isbatchingupdate设为true，在用微任务更新视图，更新完视图的时候把isbatchingupdata设置false，这样可以替代合成事件吧 

如果我在像生命周期中这些地方执行setState, isbatchingupdate 不就没有执行吗 
看看阻止默认事件怎么做的 
 if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }

  漫漫人生
  成功把批量机制从react15更新到了react18


  
setState({number: this.state,number + 1})
setState({number: this.state,number + 2})
这样批量的话  最终是
setState({number: this.state,number + 2})吗 
是一样的
靜待雨落
写2个不一样的 


15:43
人生只如初见
ref是真实dom还是组件实例？ 
123
这个ref 是为了保证 这个值不变 
123
看你绑定在谁身上 
我赌你的枪里没有子弹
ref 也可以放一些其他值 
ref可以放任何的值
人生只如初见
讲讲ref怎么保持值不变，组件更新后保持同一个引用？ 
这个是没有问题的


为什么要调用一下 creatRef ?'
为了初始化Ref  
15:52
123撤回了一条消息
人生只如初见
普通对象不用ref的话更新后就不相等了吧 
这个问题在我们后面讲react hooks的时候会有详细 的讲
废物的点心撤回了一条消息
ilark
callback要把旧的值传回去 
Hedgehog
源码有diff，这里直接替换 
Hedgehog
callback调用完也要清空吧 
h2x
callback.call() 
人生只如初见
callback不应该在setState里调用么 
1
手写一个对象 不就行了 

16:02
h2x
不需要callback.call(classInstance)吗 
人生只如初见
箭头函数，不用 
h2x
不写箭头函数不就变了 


this.refs 已经废弃了

16:16
123
但是useRef 和forwardRef 有什么区别呢？ 
useRef我们会在后面讲react hooks

16:24
ilark
type.render属性 
韦林
forwardRef  为了把ref 传入函数组件中  是的
人生只如初见
type.render?type不就是函数组件么？ 
不是



123
函数组件也会销毁吗？ 
韦林
执行完就没了 
浅夏
这是15的生命周期吧 
kkkk
类组件执行完不也没了？ 
类组件一直都会在

123
函数组件的setTimeout 和addEventListener 不用手动销毁  
123撤回了一条消息
123撤回了一条消息
123撤回了一条消息
韦林
类 执行会产生 实例 new Class().      
123
24行 = 0 



17:07
漫漫人生
没有 
沉默的木子
子组件的props改变了，但是如果父组件不更新的话组组件也不更新？ 




子组件创建的时候  willReceiceProps 没有执行 

属性改变的时候 才会执行willReceiveProps 初次挂载不走

挂载的时候  父组件传的内容的值却有  感觉第一次挂载也要执行
   willReceiceNewProp 却没有执行  不太明白为什么 第一次就不接收属性吗  




这次的domdiff涉及fiber吗 
react15
喜喜
刚讲的批量更新只在事件处理函数处理了，要是其他地方有批量更新是怎么做的呢 
人生只如初见
react太灵活了 


刚讲的批量更新只在事件处理函数处理了，要是其他地方有批量更新是怎么做的呢 
在React17以前，如果想在事件函数之外实现批量更新
 ReactDOM.unstable_batchedUpdates(() => {
        this.setState({ number: this.state.number + 1 })
        console.log(this.state.number);
        this.setState({ number: this.state.number + 1 })
        console.log(this.state.number);
      });

      
在其他地方多次this.setState会不会批量更新 
不会的
只有在事件函数中才是批量的
人生只如初见
这次讲18么？ 
人生只如初见
现在新项目类组件都不用了吧 
尽量不要用

19:57
我赌你的枪里没有子弹
老师 那天的代码中 我们不是吧string和number类型的值包装成对象了嘛，然后这个值本身放在这个对象的props属性中，这样有个问题，在执行updateProps这个方法中，会遍历这个字符串，这里是不是要处理下 



因为在以前使用 componentWillReceiveProps的时候 
经常有人在里面调用setState()
this.setState();


20:42
人生只如初见
react更新是全量更新么？从根部root开始比对更新？ 
是的
123
这种方式好侵入行啊，我不管你用不用 我都给每个孩子都传递props 
 不会啊
 需要，你就接收，不需要你可以不接收
123
每一层孩子 
人生只如初见
用不用是在事件里决定的，在编译阶段react没法知道用不用啊 
20:48
shine
 函数组件用 userContext也一样吧 是的

123
consumer 是给函数组件用的 是的

20:48
shine
 函数组件用 userContext也一样吧 
123
consumer 是给函数组件用的 
废物的点心撤回了一条消息
沉默的木子
contextValue里面的changeColor怎么传进去的 
废物的点心
不在同一个文件 ColorContext怎么拿到啊 
import导入
ilark
类组件如果使用多个context的值怎么做？ 
做不到了
类组件如果使用静态属性的方式 只能使用一个contextType
只能Consumer

靜待雨落
传的对象里面 有changeColor 


context其实仅仅是一个共享的变量，仅此而矣

123
怎么会是不用就不传递呢？ 
沉默的木子
没有看到…… 
123
这句话 决定了 我需要我就调用if (type.contextType) {
  classInstance.context = type.contextType._currentValue;
 } 
20:54
123
但是一般很少混着用呢 



这样的话，只有<Context/>组件的子组件才有对应的props数据，并不是之前以为的<Provider/>下面的每个子组件都有该props 
其实不是的，在以前的react中，是需要父子关系的
但是现在不需要了，不需要有父子关系也是可的 

shine撤回了一条消息
shine
类组件这样赋值的话 有多个呢 context不就被覆盖了 
是的
所以如果你用的static contextType的话只能用一个

123
爷爷上有， 爸爸上也有  孩子上是什么样 
以前的话是会合并爷爷和属性和父亲的会合并
现在不存在这个问题

shine
2个   
人生只如初见
let {Provider,Context} = React.createContext()
这样解构后使用的话还能正确的给_currentValue赋值么 
可以的
21:30
123
update 和mounted 是一套逻辑呢 




靜待雨落
  provider  consumer  当做自定义组件就好理解了 
h2x
我以为REACT_TEXT也是symbol 
{
    $$typeof: REACT_ELEMENT, type: REACT_TEXT, props: element
}
123
就是全局上放了个个创建对象的函数 
123
每次用的时候先函数调用去先创建个对象容器开始存数据
context = {currentValue:null}
。moutprovider 传入props。
context.currentValue=props.value
value  moutcontext 开始 用数据 
context.currentValue
123
这是在讲什么？ 
123
experimentalDecorators 
我赌你的枪里没有子弹
overvide 文件名错了 
123
config-overrides.js 
123
日常开发我很少用到呢。场景呢 
人生只如初见
函数组件中还用高阶组件么 
ilark
有hooks后基本用不上了 
123
哦 
人生只如初见
dva的connect用的就是高阶组件吧 是的
123
老师这些讲到就是阿里系用的东西。 
人生只如初见
@123，生产环境的vite.config配置能不能分享一份 
123
react的吗？ 
人生只如初见
en 
123
稍等呢，一会儿发 
人生只如初见
嗯嗯，谢谢 

为什么装插件
因为cra是一个脚手架，内置 了webpack
webpack有自己babel配置
默认的babel配置并不能支持装饰器，所以需要我们安装额的插件并且配置


靜待雨落
装饰器的本质就是个高阶函数吧  
可以这么认为
22:04
人生只如初见
装饰器语法还会被推广么？ 
123
mobx 
123
里面都是装饰器呢 





我赌你的枪里没有子弹
babel.config那个文件也不用配置了是吗老师 不需要了
09:40
靜待雨落
super不是父类吗 也就是React.Component 调用为什么是Button组件的虚拟DOM  不明白 
ilark
olderCompontent.render() 
ilark
不是应该用传过来的么 
09:47
shine
children长度不为1呢 
不为1就是数组，保留 不变

kkkk
cloneElement 也是返回一个vdom吗 是的

我赌你的枪里没有子弹
也不等于null 
我赌你的枪里没有子弹
length 等于1 为啥还要提取出来呢 
props.children 
如果是一个儿子，那就是对象，而非数组
如果是多个儿子，就是数组


obj1 或者 obj2 不是 object 或者等于null 是什么场景呢 
它的子节点是一null或者 undefined


vdom这里为什么又包了一层 type : {type....} functionComponent
两个type含义完全 不同
type 是虚拟DOM也不是React元素的类型，也就是React.createElement第一个参数 
第二个type指的是函数组件本身 functionComponent

10:42
ilark撤回了一条消息
废物的点心
 null 的时候 不会走默认值 
废物的点心
只有undefined时才走好像 
学习
创建函数 和 内联回调函数 怎么却别 

function create(){

}

exec(()=>{

})

废物的点心
刚才举的那个例子obj1 obj2 本身内存地址是不一样的， 但是调用shallowEqual应该返回的是true吧  
false

除了memo这样的性能优化,react还有什么优化的方法吗 
人生只如初见
性能优化只讲一个mome么 
人生只如初见
不可以React.render么？ 
张仁阳
http://www.zhufengpeixun.com/strong/html/106.2.react_hooks.html 


11:49
学习
只要deps 完全一样 就不重新计算 是的 
我赌你的枪里没有子弹
useMemo 的结果也放到hookStates中吗 
是的
上一次放进去，下次直接取复用上次的结果 

夕慕
some为true,index为什么要++ 
无论如何，一个 hook处理结束索引都得加

那等于 hooksState 里面不光有 state的值，还有别的hook产生的的值 
是的
所有的hooks存的值都会放在 hooksStates里



我赌你的枪里没有子弹
1 
我赌你的枪里没有子弹
hook没有挂载到React上 
我赌你的枪里没有子弹
是单独导出的 
学习
我感觉刚才子组件不重新 执行 演示了usecallback 什么关系呢  没有演示 
feng
使用方法我都学了几天，源码几分钟 就写完了。。。 
判断是否更新的那里，只是匹配了数组的值 
Hedgehog
数组里面的值不只是字段来的吗？ 
Hedgehog
hooks里面 
shine
离开输入框 
feng
oninput试试 


靜待雨落
useMemo  和useCallback  不传给子组件是不是不用 

老师 如果useMemo 前面用过了useState hookIndex 不就改变不是0 了吗 
不是的

hookIndex在一次渲染过程中会一直累加
0 1 2 3 4 5 
只有在下次重新渲染的时候才会重置为0
虚拟DOM是一样的

14:36
feng
如果是return 并且加了依赖 空数组呢？ 
那return 就没有意义了，永远用不到了
14:41
人生只如初见
先++，在赋值 


useEffect的使用场景是啥 
副作用 调接口 改标题 增加一些定时器 只要会修改全局变量，都会写在这里
shine
一般异步请求 要放在这里吗？还是放在useCallback里 
肯定 是放在useEffect里的
useCallback只是缓存函数定义，并没有执行代码的功能

123
usecallback 放在 行内事件的 


就是onclick 或者onxxx的 后面的函数 
shine
分页也用的到 
废物的点心
只有有依赖项 return的才相当于willUnmont？ 没有依赖项每次都会执行return的函数 
是的

靜待雨落
空数组只执行一次   定时器什么时候销毁  组件卸载的时候吗 
不销毁了
现在没有组件卸载这个说法了

废物的点心
就可以理解为watch 
人生只如初见
setState修改了值后，怎么立即获取到最新的值 ？？？？？？？


setState修改了值后，怎么立即获取到最新的值 
我赌你的枪里没有子弹
deps 是[]  return 的函数 组件卸载时候就执行了吧 
再次强度 组件没有卸载这个环节

shine
有回调 
人生只如初见
怎么知道组件被卸载？ 
就没有卸载
14:54
shine撤回了一条消息
123
渲染前就执行完毕了位置 
人生只如初见
useMemo和useRef是不是很像 
核心都是保持值是不变的，多次执行返回的是一个同一个结象
只不过useMemo值是你给的。useRef是一般用会传给组件的ref属性，用来引用实例
ref其实可以引用任何值





那怎么知道组件被销毁，或者从使用到不被使用 
夕慕
那如果离开页面的时候要掉一个接口那怎么写呢 
废物的点心
[] 的 return 
人生只如初见
const [state, setState] = useState(initState)
const  currentState = useMemo(()=>state,[state]) 
张仁阳
休息5 
人生只如初见
这样是不是能拿到setState()后的最新值 
最后的值肯定 是对的
但是一般来说我想是想在调用 setSTate这后获取最新值
15:08
shine
所以老师到底是哪套房子煤气没关查到了吗？ 


自始至终销毁掉的不是组件实例啊 是timer 定时器啊 
没有实例没有实例没有实例

feng
刷新页面的时候会执行return的函数么？ 不会

15:13
123
在行内事件里面setState 完了之后的state 是最新值 
夕慕
包个set timeout行嘛 
shine
放ref.current咯 

shine撤回了一条消息
feng
用useEffect监听state不就可以拿到最新的么？ 
没有
useEffect没有监听函数
shine
那也是慢半拍  
shine
你要马上拿到只能用ref（有穿越能力） 
feng
哦 


废物的点心
都知道时state的最新值了  不用effect 直接用state的最新之不久可以了么 




老师你这个用的useRef 不是createRef 呢。 换下呢 
shine
函数组件和类组件的区别 
我赌你的枪里没有子弹
createRef 是类组件用的 
函数组件也能用，但是它每次都会返回新的对象
因为类组件扔实例，所以内部调用createRef创建一份缓存就可以了，一直缓存的这一分
但是函数组件没有实例，每次都会重新执行函数，如果使用createRef每次都是新的
123
但是发现在哎函数组件中用createRef 也行啊 
我赌你的枪里没有子弹
那函数组件每次渲染都是 { current: null } 没意义了 
h2x
没有this 
人生若只如初见
this. 
Hedgehog
代理了 



人生只如初见
useImperativeHandler必须和forwardRef结合使用么 
是的

靜待雨落
这样的话是不是  可以使用这两个hooks组合调子组件的方法 
韦林
函数组件，的state更新 ， 函数组件就会重新执行一次 


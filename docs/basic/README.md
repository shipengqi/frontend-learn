# Vue 语法

Vue 学习曲线平缓，容易上手，这里做一个学习笔记。并根据[官网](https://cn.vuejs.org/)和《Vue.js实战》一书中的例子，进行练习实践，
练习代码放在[GitHub](https://github.com/shipengqi/vue-learn-demo)上。

## 简单介绍
关于Vue，不多介绍，可自己查看[官方完档](https://cn.vuejs.org/v2/guide/index.html)。

Vue提供了web开发中常见的高级功能：

- 解耦视图与数据
- 可复用的组件
- 前端路由
- 状态管理
- 虚拟DOM

### 什么是MVVM

MVVM(Model-View-View-Model)模式是由MVC衍生出来的。当View （视图层）变化时，会自动更新到ViewModel （视图模型），
反之亦然。View 和ViewModel 之间通过双向绑定（data-binding ）建立联系。


## Vue数据双向绑定

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Data binder demo</title>
</head>
<body>
    <div id="app">
        <input type="text" v-model="name" placeholder="Please enter your name">
        <h1>Hello, {{name}}</h1>
    </div>
    <script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
    <script>
        //创建vue实例 app
        var app = new Vue({
          el: "#app", //el指定挂载的DOM元素，也可以是 document.getElementByld('app')
          data: {
            name: ""
          }
        });

        //可以通过app.name 来访问data对象里的所有属性。
        console.log(app.name);
        //可以通过app.$el 来访问该元素。
        console.log(app.$el);
    </script>
</body>
</html>
```
效果如图：
![databind](/images/vue/databinder.jpg)

上面的代码在`input`标签上，有一个`v-model`，它的值对应于我们Vue 实例的`data`选项中的`name`字段，这就是数据绑定。
Vue 实例的`data`选项，用来声明需要双向绑定的数据。当一个 Vue 实例被创建时，它向 Vue 的**响应式系统**中加入了其 data 对象中能找到的所有的属性。
当这些属性的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。
**只有当实例被创建时 data 中存在的属性才是响应式的。**也就是说如果你添加一个新的属性，例如：
``` javascript
app.age = 18;
```

那么对`app.age`属性的改动将不会触发任何视图的更新。所以如果需要双向绑定的数值，如果初始化时它为空或者不存在，就给它设置一个初始的值。

> 数据驱动DOM 是Vue.js的核心理念，所以尽量不要主动操作DOM。
> 所有会用到的数据都应该预先在`data`内声明，这样不至于将数据散落在业务逻辑中，难以维护。

### 生命周期

创建Vue实例，会有一个初始化的过程，例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时会调用响应的生命周期的钩子。
可以利用钩子函数，在不同的阶段，添加自己的业务逻辑。

**[官网](https://cn.vuejs.org/v2/guide/instance.html)的生命周期图示**
![lifecycle](/images/vue/lifecycle.png)

常用的钩子有：
- `created`，实例创建完成后调用，此阶段完成了数据的观测等，但尚未挂载，$el 还不可用。需要初始化处理一些数据时会比较有用。
- `mounted`，el 挂载到实例上后调用，一般业务逻辑会在这里开始。
- `beforeDestroyed`，实例销毁之前调用。主要解绑一些使用addEventListener 监听的事件等。

``` javascript
new Vue({
  data: {
    name: "xiaoming"
  },
  created: function () {
    console.log('Hello: ' + this.name);
  }
  mounted: function () {
    console.log('Hello: ' + this.name);
  }
})
// => "a is: 1"
```
> 生命周期钩子的 this 上下文指向调用它的 Vue 实例。
> **不要在选项属性或回调上使用箭头函数**，因为箭头函数会绑定`this`的指向。
> 经常导致 `Uncaught TypeError: Cannot read property of undefined`
> 或 `Uncaught TypeError: this.myMethod is not a function` 之类的错误。

### 模板语法

#### 插值

**文本**
`Mustache`语法 (双大括号)是最基本的插值方法，会自动将双向绑定的数据实现显示。

``` html
<div id="app">
    <h1>Hello, {{name}}</h1>
</div>
<script>
    var app = new Vue({
      el: "#app",
      data: {
        name: "pooky"
      }
    });
</script>
```
使用`v-once`指令，可以执行一次性地插值，当数据改变时，插值处的内容不会更新。
``` html
<span v-once>这个值不会改变: {{ msg }}</span>
```

**插入html**
如果想输出HTML，而不是解释后的文本使用`v-html`:
``` html
<div id="app">
    <span v-html="link"></span>
</div>
<script>
    var app = new Vue({
      el: "#app",
      data: {
        link: '<a href="#">这是一个连接</a>'
      }
    });
</script>
```

> 动态渲染的 HTML 很容易导致 XSS 攻击。。

如果想显示双括号标签，而不进行替换，使用"v-pre"，这个指令，可以跳过这个元素和子元素的编译过程。
``` html
<span v-pre>{{不会编译的内容}}</span>
```

**v-bind**
双括号插值的方式是不能用到html标签的属性上，如果需要可以使用`v-bind`:
``` html
<div v-bind:id="dynamicId"></div>
```

在布尔特性的情况下：
``` html
<button v-bind:disabled="isButtonDisabled">Button</button>
```
如果`isButtonDisabled`的值是 `null`、`undefined`或`false`，则`disabled`特性甚至不会被包含在渲染出来的`<button>`元素中。


**JavaScript 表达式**
除了简单的绑定属性键值，还可以使用JavaScript 表达式：
``` html
<div id="app">
    {{number + 1}}
    {{ ok ? "yes" : "no" }}
    {{ msg.split(",")}}
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      number: 18,
      ok: "yes",
      msg: "hello, Vue"
    }
  });
</script>
```

#### 过滤器
Vue支持在双括号插值的后面加上`|`管道符对数据过滤，例如对时间格式转换把浏览器默认格式`2017-01-02T14:04:49.470Z`，
转换为`2017-01-02 22:04:49`，或者字母大小转换：
``` html
<div id="app">
    {{date | formatDate}}
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>
  var padDate = function (value) {
    return value < 10 ? "0" + value: value;
  };
  var app = new Vue({
    el: "#app",
    data: {
      date: new Date()
    },
    filters: {
      formatDate: function (value) { //value 就是需要过滤的数据
        var date= new Date(value);
        var year= date.getFullYear() ;
        var month= padDate(date.getMonth() + 1) ;
        var day= padDate(date.getDate());
        var hours= padDate(date.getHours());
        var minutes = padDate (date.getMinutes ());
        var seconds = padDate (date.getSeconds ());
        //将整理好的数据返回出去
        return year + "-" + month + "-" + day +" "+ hours + ":" + minutes + ":"+ seconds ;
      }
    },
    mounted: function () {
      var self = this;
      this.timer = setInterval(function () {
        self.date = new Date();
      }, 1000)
    },
    beforeDestoryed: function () {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  });
</script>
```

过滤器可以串联和接受参数：
``` html
{{msg| filtera | filterb}}

{{msg| filtera("arg1", arg2)}}
```
'filtera'被定义为接收三个参数的过滤器函数。其中'msg'的值作为第一个参数，普通字符串 'arg1' 作为第二个参数，表达式'arg2'的值作为第三个参数。

还可以创建 Vue 实例之前定义全局过滤器：
```javascript
Vue.filter('globalFilter', function (value) {
  if (!value) return ''
  return value.toString();
})

new Vue({
  // ...
})
```

### 指令
在Vue中指令是带有`v-`的特殊属性，比如：`v-if`，`v-for`，`v-html`这些都是指令，指令的职责就是当javascript表达式的值改变时，响应的作用于DOM上。

``` html
<div id="app">
    <span v-if="show">显示的内容</span>
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>
    var app = new Vue({
      el: "#app",
      data: {
        show: true
      }
    })
</script>
```

**`v-bind`和`v-on`**

`v-bind`指令可以用于响应式地更新 HTML 属性:
``` html
<a v-bind:href="url">...</a>
```
这里的`v-bind`后面的冒号跟了一个`href`，这表示一个参数，该元素的 href 属性与表达式 url 的值绑定。

`v-on`指令可以用来绑定监听事件:
``` html
<div id="app">
    <span v-if="show">显示的内容</span>
    <button v-on:click="clickHandler">隐藏</button>
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      show: true
    },
    methods: {
      clickHandler: function () {
        this.hide();  //Vue将methods 里的方法也代理了，所以也可以像访问Vue 数据那样来调用方法。
      },
      hide: function () {
        this.show = false;
      }
    }
  })
</script>
```
这里使用v-on:click 给该元素绑定了一个点击事件。

**缩写**
``` html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>
```

## 总结
- 只有当实例被创建时 data 中存在的属性才是响应式的。也就是说如果你添加一个新的属性，比如`data: {name: xiaoming}`，在创建实例后，添加`app.age = 18`，
这里的`age`属性，的改动将不会触发任何视图的更新。**所以如果需要双向绑定的数值，如果初始化时它为空或者不存在，就给它设置一个初始的值。**
- 所有会用到的数据都应该预先在data内声明，这样不至于将数据散落在业务逻辑中，难以维护。
- 数据驱动 DOM 是Vue.js的核心理念，所以尽量不要主动操作 DOM。
- 常用钩子函数：
    - `created`，实例创建完成后调用，此阶段完成了数据的观测等，但尚未挂载，$el 还不可用。需要初始化处理一些数据时会比较有用。
    - `mounted`，el 挂载到实例上后调用，一般业务逻辑会在这里开始。
    - `beforeDestroyed`，实例销毁之前调用。主要解绑一些使用 addEventListener 监听的事件等。
- 生命周期钩子的 this 上下文指向调用它的 Vue 实例。
- 不要在选项属性或回调上使用**箭头函数**，因为箭头函数会绑定 this 的指向，会导致`Uncaught TypeError: Cannot read property of undefined`
或`Uncaught TypeError: this.myMethod is not a function` 之类的错误。
- 插值：
    - 双括号插值
    - `v-html`
    - `v-bind`
- 双括号插值的方式是不能用到html标签的属性上，如果需要可以使用`v-bind`
- 如果`v-bind`的值是 `null`、`undefined`或`false`，则绑定的特性甚至不会被包含在渲染出来的元素中。
- 全局过滤器和局部过滤器，Vue 支持在双括号插值的后面加上`|`管道符对数据过滤
- `v-bind`，缩写：`:`，v-on，缩写`@`


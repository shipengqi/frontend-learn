# Vue 指令

前面我们知道了 Vue 中可以使用前缀是`v-`的指令。
简单的学习了`v-bind`和`v-on`，缩写是`:`和`@`，`v-bind`可以绑定html的属性，`v-on`用来监听事件，
使用`v-html`插入HTML，使用`v-pre`跳过元素和子元素的编译过程，可以显示双括号

先来学习`v-bind`来绑定`class`和`style`，动态地切换 class 和 style。

## 绑定class
### 对象语法

`v-bind:class`指令可以与普通的`class`属性共存，可以传入多个属性。

``` html
<div id="app"><div class="static" :class="{ active: isActive, 'text-danger': hasError }"></div></div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      isActive: true,
      hasError: false
    }
  });
</script>


//还可以绑定对象
<div v-bind:class="classObject"></div>

data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

上面的代码，结果渲染为`<div class="static active"></div>`
**`:class`表达式过长或者逻辑比较复杂时，可以绑定计算属性**：
``` html
<div id="app"><div :class="classObject"></div></div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      isActive: true,
      error: null
    },
    computed: {
      classObject: function () {
        return {
          active: this.isActive && !this.error,
          'text-danger': this.error && this.error.type === 'fatal'
        }
      }
    }
  });
</script>
```

### 数组语法
`:class`可以传入一个数组，以应用一个`class`列表：

``` html
<div id="app"><div class="static" :class="[activeClass, errorClass]"></div></div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      activeClass: 'active',
      errorClass: 'text-danger'
    }
  });
</script>

//三元表达式
<div :class="[isActive ? activeClass : '', errorClass]"></div>

//数组语法中也可以使用对象语法
<div :class="[{ active: isActive }, errorClass]"></div>
```

## 绑定内联样式
Vue 绑定内联样式`v-bind:style`，和在元素张写`css`的写法相似，CSS 属性名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，用单引号括起来) 来命名：
```html
<div id="app"><div :style="{'color': color, 'font-size': fontSize + 'px'}">绑定样式</div></div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      color: "red",
      fontSize: 16
    }
  });
</script>

```
### 对象语法
```html
<div id="app"><div :style="styleObject">绑定样式</div></div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      styleObject: {
        color: 'red',
        fontSize: '25px'
      }
    }
  });
</script>

```

### 数组语法
应用多个样式对象时，可以使用数组语法。数组语法并不常用，一般是写在对象里，较为常用的应当是计算属性。
``` html
<div :style="[styleA, styleB]"></div>
```
### 自动添加前缀
当`v-bind:style`使用需要添加[浏览器引擎前缀](https://developer.mozilla.org/zh-CN/docs/Glossary/Vendor_Prefix)的 CSS 属性时，
如`transform`，Vue.js 会自动侦测并添加相应的前缀。浏览器引擎前缀，是一些放在CSS属性前的小字符串，用来确保这种属性只在特定的浏览器渲染引擎下才能识别和生效。
浏览器引擎前缀(Vendor Prefix)主要是各种浏览器用来试验或测试新出现的 CSS3 属性特征。

这些前缀并非所有都是需要的，但通常你加上这些前缀不会有任何害处——只要记住一条，把不带前缀的版本放到最后一行：
```css
-moz-border-radius: 10px;
-webkit-border-radius: 10px;
-o-border-radius: 10px;
border-radius: 10px;
```
有些新的CSS3属性已经试验了很久，一些浏览器已经对这些属性不再使用前缀。`Border-radius`属性就是一个非常典型的例子。最新版的浏览器都支持不带前缀的`Border-radius`属性写法。

## 条件渲染

### `v-if`,`v-else-if`,`v-else`
Vue 中条件渲染指令有`v-if`,`v-else-if`,`v-else`。和js中的`if else`条件语句差不多。条件渲染指令根据表达式的值，在DOM上渲染或者销毁元素：
``` html
<div id="app">
    <div v-if="status === 1">
        <h1>条件渲染1</h1>
        <h2>{{msg}}</h2>
    </div>
    <div v-else-if="status === 2">
        <h1>条件渲染2</h1>
        <h2>{{msg}}</h2>
    </div>
    <div v-else>
        <h1>条件渲染3</h1>
        <h2>{{msg}}</h2>
    </div>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      status: 2,
      msg: "hello, vue."
    }
  });
</script>
```

**`v-else`元素必须紧跟在带`v-if`或者`v-else-if`的元素的后面，否则它将不会被识别。**


可以在Vue内置的`<template> `元素上使用`v-if`：
```html
<div id="app">
    <template v-if="ok">
        <h1>v-if template</h1>
        <p>Hello, world</p>
        <p>Hello, vue</p>
    </template>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      ok: true
    }
  });
</script>
```

**Vue为了提高渲染效率，通常会复用已有的元素，而不是重新渲染**：
```html
<div id="app">
    <template v-if="type === 'username'">
        <label>Username</label>
        <input placeholder="Enter your username">
    </template>
    <template v-else="type === 'email'">
        <label>Email</label>
        <input placeholder="Enter your email address">
    </template>
    <button @click="toggleType">切换登录类型</button>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      type: "username"
    },
    methods: {
      toggleType: function () {
        this.type = this.type === "username" ? "email" : "username";
      }
    }
  });
</script>
```

那么在上面的代码中切换 type ，输入的内容没有改变，但是`placeholder`被替换了。说明`input`元素被复用了。
但是**如果想让Vue不复用它们。只需添加一个具有唯一值的`key`属性**：
```html
<div id="app">
    <template v-if="type === 'username'">
        <label>Username</label>
        <input placeholder="Enter your username" key="username-input">
    </template>
    <template v-else="type === 'email'">
        <label>Email</label>
        <input placeholder="Enter your email address" key="email-input">
    </template>
    <button @click="toggleType">切换登录类型</button>
</div>
```

`<label>`元素仍然是被复用的，因为没有添加`key`属性。

### `v-show`
`v-show`的使用方法与`v-if`大致一样，不同的是`v-show`只是简单地切换元素的`CSS`属性`display`。`v-show`表达式的值为`true`是就显示，`false`就隐藏。

```html
<div id="app">
    <p v-show="show">显示的内容</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      show: true
    }
  });
</script>
```

**`v-show`不能用到`<template>`上，不会生效。**
`v-if`与`v-show`功能相同，但是`v-if`每次切换都会去销毁重建元素，但是`v-show`是惰性的，它只是进行了`css`切换。
所以说**`v-if`的切换开销更大，`v-show`适合在切换频繁的场景使用。**

## 列表渲染

### 遍历数组
列表渲染指令`v-for`，它的表达式需结合`in`来使用，类似`item in items`的形式：
``` html
<div id="app">
    <ul>
        <li v-for="phone in phones">{{ phone.name }}</li>
    </ul>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      phones: [
        {name: "iPhone X"},
        {name: "iPhone 8p"},
        {name: "iPhone 8"},
        {name: "iPhone 7p"},
        {name: "iPhone 7"}
      ]
    }
  });
</script>
```

列表渲染也可以用`of`替代`in`作为分隔符：
``` html
<li v-for="phone of phones">{{ phone.name }}</li>
```
**遍历数组时，有一个可选参数`index`**：
```html
<li v-for="(phone, index) in phones">{{index}} - {{ phone.name }}</li>
```

### 遍历对象
`v-for`遍历一个对象：
``` html
<div id="app">
    <ul>
        <li v-for="value in phone">{{ value }}</li>
    </ul>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      phone: {
        name: "iPhone",
        version: "X",
        price: "9000"
      }
    }
  });
</script>
```
**遍历对象属性时，有两个可选参数，分别是`key`和`index`**：
```html
<li v-for="(value, key, index) in phone">{{ value }}</li>
```

### key
和条件渲染`v-if`一样，`v-for`默认会复用已有元素，**但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出。**
为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一`key`属性。
用`v-bind`来绑定动态值 ：

``` html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

**建议尽可能在使用`v-for`时提供`key`，除非遍历输出的 DOM 内容非常简单。**

### 数组更新
Vue的核心思想就是是数据与视图的双向绑定，当我们修改数组时，Vue 会检测到数据变化，所以用`v-for`渲染的视图也会立即更新。
Vue 包含了一组观察数组变异的方法，使用它们改变数组也会触发视图更新：
- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

变异方法 (mutation method)，会改变被这些方法调用的原始数组。但是有些不会：
- `filter()`
- `concat()`
- `slice()`
**这些不会改变原始数组，总是返回一个新数组。当使用这些方法时，可以用新数组替换旧数组**：
``` html
<div id="app">
    <ul>
        <li v-for="phone in phones">{{ phone.name }}</li>
    </ul>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      phones: [
        {name: "iPhone X"},
        {name: "iPhone 8p"},
        {name: "iPhone 8"},
        {name: "iPhone 7p"},
        {name: "iPhone 7"}
      ]
    }
  });

  app.phones = app.phones.filter(function (item) {
    return item.name.includes("8");
  });
  app.phones.push({name: "HuaWei P20"});
</script>
```

**以下变动的数组Vue 是检测不到的：**
1. 通过索引直接设置：`app.phones[10] = {name: "HuaWei P20"}`
2. 手动修改数组长度：`app.phones.length = 2`

解决第一个问题，有两种方式可以达到和`app.phones[10] = {name: "HuaWei P20"}`同样效果，同时也触发状态更新：
第一种方法：
```javascript
Vue.set(vm.items, indexOfItem, newValue)

Vue.set(app.phones, 10, {name: "HuaWei P20"})
```

webpack 中使用组件化的方式，默认是没有导入Vue 的,使用`vm.$set`实例方法，`vm.$set`其实是`Vue.set`的一个别名
``` javascript
vm.$set(vm.items, indexOfItem, newValue)

app.$set(app.phones, 10, {name: "HuaWei P20"})
```
另一种方法：
``` javascript
app.phones.splice(10, 1, {name: "HuaWei P20"});
```

第二个问题也使用`splice()`解决：
```javascript
app.phones.splice(1);
```

**Vue 不能检测对象属性的添加或删除，例如：**
```javascript
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` 现在是响应式的

vm.b = 2
// `vm.b` 不是响应式的
```

解决方法：
```javascript
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})

Vue.set(vm.userProfile, 'age', 27)
//或者
vm.$set(vm.userProfile, 'age', 27)

//如果要赋值多个新属性，使用Object.assign() 或 _.extend()
//注意要创建一个新的空对象

vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

### 排序和过滤


### `v-for` & `template`
`v-for`也可以和`v-if`一样应用在 `<template>`上来渲染多个元素:
```html
<ul>
  <template v-for="phone in phones">
    <li>{{ phone.name }}</li>
    <li>{{ phone.version }}</li>
    <li>{{ phone.price }}</li>
  </template>
</ul>
```

### `v-for` & `v-if`
如果`v-for`和`v-if`在同一个节点上，`v-for`的优先级比`v-if`更高，这意味着`v-if`将分别重复运行于每个`v-for`循环中。

```html
<ul>
    <li v-for="phone in phones" v-if="phone.price < 5000">

    </li>
</ul>
```
上面的代码就只会展示价格低于5000的phone。

如果想要`v-if`优先级高于`v-for`只能把`v-if`放在`v-for`的外层元素：
```html
<ul v-if="phones.length > 0">
    <li v-for="phone in phones" v-if="phone.price < 5000">

    </li>
</ul>
<p v-else>No phones!</p>
```


## 其它指令

### `v-cloak
这个指令不需要表达式，会在Vue 实例结束编译时从绑定的HTML 元素上移除，一般和 CSS 规则如 `[v-cloak] { display: none }` 一起使用时。
这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。
```html
<div id="app">
    <span v-cloak>{{ message }}</span>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      message: "Hello, Vue."
    }
  });
</script>
```

上面的代码虽然加了`v-cloak`指令，但是当网速慢，vue问价文件未加载完成时，页面上还是会显示：
``` html
{{ message }}
```
直到创建vue实例，编译模板时，才会替换DOM，所以这个过程页面会有闪动。解决这个问题只要加上：
```css
[v-cloak] {
    display: none
}
```
### `v-once`
这个指令不需要表达式，作用是只渲染元素和组件一次。第一次渲染后，不会再随数据变化重新渲染。
```html
<div id="app">
    <span v-once>{{ message }}</span>
    <div v-once>
        <span>{{message}}</span>
    </div>
    <span>{{message}}</span>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      message: "Hello, Vue."
    }
  });
  setInterval(function () {
    app.message = "hello"
  },1000)

</script>
```
可用来优化性能。

## 总结

- `v-bind`动态更新html元素上的属性。
- `v-bind`绑定`class`和`style`，实现动态切换。可以绑定计算属性。
- `v-if`,`v-else-if`,`v-else`,`v-show`，`v-else`元素必须紧跟在带`v-if`或者`v-else-if`的元素的后面，否则它将不会被识别。可以用到`<template>`上。
- Vue 为了提高渲染效率，通常会复用已有的元素，而不是重新渲染，但是如果想让 Vu e不复用它们。只需给元素添加一个具有唯一值的`key`属性
- `v-show`只是简单地切换元素的`CSS`属性`display`。`v-show`表达式的值为`true`是就显示，`false`就隐藏。
- `v-show`不能用到`<template>`上，不会生效。
- `v-if`的切换开销更大，`v-show`适合在切换频繁的场景使用。
- 建议尽可能在使用`v-for`时提供`key`，除非遍历输出的 DOM 内容非常简单。
- Vue 包含了一组观察数组变异的方法，会改变被这些方法调用的原始数组。使用它们改变数组也会触发视图更新:`push`,`pop`,`shift`,`unshift`,`splice`,`sort`,`reverse`
- `filter`,`concat`,`slice`，这些不会改变原始数组，总是返回一个新数组，当使用这些方法时，可以用新数组替换旧数组。
- Vue 检测不到的数组变动：
  - 通过索引直接设置：`app.phones[10] = {name: "HuaWei P20"}`
  - 手动修改数组长度：`app.phones.length = 2`
- 创建 vue 实例后，Vue 不能检测对象属性的添加或删除，使用`vue.$set`。
- `v-for`也可以和`v-if`一样应用在`<template>`上。
- 如果`v-for`和`v-if`在同一个节点上，`v-for`的优先级比`v-if`更高，这意味着`v-if`将分别重复运行于每个`v-for`循环中。
- `v-cloak`，`v-once`



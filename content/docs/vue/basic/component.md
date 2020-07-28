# Vue 组件

`Vue`组件是`Vue`最核心的功能。

`Vue`的组件可以扩展`html`元素，提高代码重用性。

## 注册组件

### 全局注册
```javascript
Vue.component('my-component', {
  // 选项
})
```

组件的命名最好使用小写加`-`分割的形式命名。

使用：
```html
<div id="app">
    <my-component></my-component>
</div>
<script>
  Vue.component('my-component', {
    template: '<div>A test component!</div>'
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```
`template`的`DOM`结构必须被一个元素包含，如果直接写成`A test component!`，不带`<div></div>`是无法渲染的。

**全局注册的行为必须在根`Vue`实例 (通过`new Vue()`) 创建之前发生。**
### 局部注册

```javascript
new Vue({
  // ...
  components: {
    // <my-component> 只在父组件模板中可用
    'my-component': {
      template: '<div>A test component!</div>'
    }
  }
})
```

## 使用组件需要注意两点

### DOM解析
Vue 组件的模板在某些情况下会受到HTML 的限制(例如，使用`el`选项来把 Vue 实例挂载到一个已有内容的元素上)，
像 `<ul>`、`<ol>`、`<table>`、`<select>` 这样的元素里允许包含的元素有限制，而另一些像 `<option>` 这样的元素只能出现在某些特定元素的内部。
比如`<table>`内规定只允许是`<tr>`、`<td>`、`<th>`等这些表格元素，所以在`<table>`内直接使用组件是无效的。这种情况下，可以使用特殊的`is`
属性来挂载组件:
```html
<table>
  <my-table>...</my-table> //<my-row> 会被当作无效的内容
</table>

//使用is属性
<table>
  <tr is="my-table"></tr>
</table>
```

> 使用字符串模板时不受限制的。

### `data`选项必须是函数
```html
<div id="app">
    <my-component2></my-component2>
</div>
<script>
  Vue.component('my-component2', {
    template: '<div>{{message}}</div>',
    data: function () {
      return {
        message: "data 必须是函数"
      }
    }
  });
  var app = new Vue({
    el: "#app"
  })
</script>
```

`data`必须是函数，是因为`javascript`的对象是引用关系，如果返回出的对象引用的是同一个对象，那么对这个对象的修改，所有引用它的组件都会收到影响：
```html
<div id="app">
    <my-component3></my-component3>
    <my-component3></my-component3>
    <my-component3></my-component3>
</div>
<script>
  var data = {
    num: 0
  };
  Vue.component('my-component3', {
    template: '<button @click="num++">{{num}}</button>',
    data: function () {
      return data;
    }
  });
  var app = new Vue({
    el: "#app"
  })
</script>
```
上面的代码中，三个组件实例共享了同一个`data`对象，因此递增一个`num`会影响所有组件。


## 使用`Prop`传递数据

在 Vue 中，父子组件的关系可以总结为**父组件通过`Prop`给子组件下发数据，子组件通过事件给父组件发送消息**。

```html
<div id="app">
    <child-component message="父组件 prop下发的数据"></child-component>
</div>
<script>
  Vue.component('child-component', {
    props: ["message"],
    template: '<div>{{message}}</div>'
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```

`props`中声明的数据与组件`data`函数`return`数据主要区别就是`props`的来自父级，而`data`中的是组件自己的数据，
作用域是组件本身，**这两种数据都可以在模板`template`中使用也可以在 `vm` 实例中通过 `this.message` 来使用。**
如果要传递多个数据，就在`props`数组中添加。


因为HTML 特性是不区分大小写的。所以，**使用DOM模板时，`camelCase` (驼峰式命名) 的`prop`需要转换成对应的`kebab-case`(短横线分隔式命名)**：
```html
Vue.component('child-component2', {
    props: ["testMsg"],
    template: '<div>{{testMsg}}</div>'
});

<!-- 在 HTML 中使用 kebab-case -->
<child test-msg="camelCase 转成 kebab-case"></child>
```

**字符串模板不受这个限制。**

### `prop`传递动态数据

可以用`v-bind`来动态地将`prop`绑定到父组件的数据。每当父组件的数据变化时，该变化也会传导给子组件：
```html
<div id="app">
    <child-component3 :test-msg3="dyMsg"></child-component3>
</div>
<script>
    Vue.component('child-component3', {
      props: ["testMsg3"],
      template: '<div>{{testMsg3}}</div>'
    });

    var app = new Vue({
      el: "#app",
      data: {
        dyMsg: "父组件 动态prop数据"
      }
    });
</script>
```

**当要传递布尔值，数值，数组，对象时，要使用`v-bind`，否则传递的是字符串，而不是你想要的值：**
```html
<!-- 传递了一个字符串 "1" -->
<comp some-prop="1"></comp>

<!-- 传递真正的数值 -->
<comp v-bind:some-prop="1"></comp>
```

### 单向数据流

`vue 2`中`prop`传递数据是单向的，父组件的数据变化可以传递给子组件，反之不行。这种设计，避免子组件改变父组件的状态，解耦父子组件。
一般两种情况下需要改变`prop`：

1. `Prop`作为初始值传入后，子组件想把它当作局部数据来用。
2. `Prop`作为原始数据传入，由子组件处理成其它数据输出。


处理方法：
1. 在组件的`data`函数中，声明一个新的变量，用`prop`的值初始化它：
``` javascript
props: ['initialCounter'],
data: function () {
  return { counter: this.initialCounter }
}
```

2. 使用计算属性：
```javascript
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

> 在`JavaScript`中对象和数组是引用类型，指向同一个内存空间，所以`props`是一个对象或数组，在子组件内部改变它会影响父组件的状态。


### `prop`验证
为组件的`prop`指定验证规则，用对象的形式来定义`prop`，不用数组：
```javascript
Vue.component('example', {
  props: {
    // 数字 (`null` 指允许任何类型)
    propA: Number,
    // 可以是多种类型数值或者字符串
    propB: [String, Number],
    // 字符串，必传
    propC: {
      type: String,
      required: true
    },
    // 数值，如果没有传入默认值是100
    propD: {
      type: Number,
      default: 100
    },
    // 数组/对象的默认值应当由一个工厂函数返回
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

`type` 类型：

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

`type` 也可以是一个自定义构造器函数，使用 `instanceof` 检测。
当`prop`验证失败，开发版本的Vue 会抛出警告。

> 注意`prop`会在组件实例创建之前进行校验，所以在`default`或`validator`函数里，诸如`data`、`computed`或`methods`等实例属性还无法使用。


## 组件间通信
父组件使用`prop`传递数据给子组件，子组件通过**自定义事件**向父组件传递数据。
Vue实现了两个接口`$on`和`$emit`，这两个接口类似`addEventListener` 和 `dispatchEvent`。
父组件可以在使用子组件的地方直接用`v-on`来监听子组件触发的事件：
``` html
<div id="app">
    <p>{{ total }}</p>
    <my-component v-on:increase="getTotal" v-on:reduce="getTotal"></my-component>
</div>
<script>

  Vue.component('my-component', {
    template:
      `<div>
           <button v-on:click="handleIncrease">+</button>
           <button v-on:click="handleReduce">-</button>
       </div>`,
    data: function () {
      return {
        number: 0
      }
    },
    methods: {
      handleIncrease: function () {
        this.number ++;
        this.$emit("increase", this.number);
      },
      handleReduce: function () {
        this.number --;
        this.$emit("reduce", this.number);
      }
    }
  });

  var app = new Vue({
    el: "#app",
    data: {
      total: 0
    },
    methods: {
      getTotal: function (total) {
        this.total = total;
      }
    }
  })
</script>
```
`$emit()`方法的第一个参数是自定义事件的名称，例如示例的`increase`和`reduce`后面的参数都是要传递的数据，可以不填或填写多个。

### 绑定原生事件

如果需要在组件上监听原生DOM事件，使用修饰符`.native`：
```html
<my-component v-on:click.native="doSomeThing"></my-component>
```

### 使用`v-model`
```html
<div id="app">
    <p>{{total}}</p>
    <my-component v-model="total"></my-component>
</div>
<script>

  Vue.component('my-component', {
    template: "<button @click='handleClick'>+</button>",
    data: function () {
      return {
        number: 0
      }
    },
    methods: {
      handleClick: function () {
        this.number ++;
        this.$emit("input", this.number);
      }
    }
  });

  var app = new Vue({
    el: "#app",
    data: {
      total: 0
    }
  })
</script>
```

上面的代码实现了点击按钮加`1`的效果，不过这次组件`$emit`的事件名是特殊的`input`，在使用组件的父级，井没有在`<my-component>`上使用`@input= "handler"`，
而是直接用了`v-model`绑定的一个数据`total`。这也可以算是一个语法糖，也可以改成：
```html
<div id="app">
    <p>{{total}}</p>
    <my-component @input="getTotal"></my-component>
</div>
<script>

  Vue.component('my-component', {
     ....
  });

  var app = new Vue({
    el: "#app",
    data: {
      total: 0
    },
    methods: {
      getTotal: function(total) {
        this.total = total;
      }
    }
  })
</script>
```


```html
<input v-model="something">
```
这不过是以下示例的语法糖：
```html
<custom-input
  v-bind:value="something"
  v-on:input="something = arguments[0]">
</custom-input>
```

**也就是绑定父组件的`value`，监听子组件的`input`事件。**

所以要让组件的`v-model`生效，它应该：

- **子组件接受一个`value prop`**
- **在有新的值时触发`input`事件并将新值作为参数**

### `v-model`创建自定义表单输入组件
```html
<div id="app">
    <p>{{total}}</p>
    <my-component v-model="total"></my-component>
    <button @click="handleReduce">-</button>
</div>
<script>

  Vue.component('my-component', {
    props: ["value"],
    template: '<input :value="value" @input="updateValue"',
    methods: {
      updateValue: function () {
        this.$emit("input", event.target.value);
      }
    }
  });

  var app = new Vue({
    el: "#app",
    data: {
      total: 100
    },
    methods: {
      handleReduce: function () {
        this.total --;
      }
    }
  })
</script>
```


### 非父子组件通信
非父子关系的组件间通信，可以使用一个空的`Vue`实例作为事件总线(`bus`)，也就是一个中介：
```html
<div id="app">
    {{msg}}
    <my-component1></my-component1>
</div>
<script>
  var bus = new Vue();
  Vue.component('my-component1', {
    template: '<button @click="handleClick">bus</button>',
    methods: {
      handleClick: function () {
        bus.$emit("on-msg", "my-component1 发出的消息")
      }
    }
  });

  var app = new Vue({
    el: "#app",
    data: {
      msg: ""
    },
    mounted: function () {
      var self = this;
      bus.$on("on-msg", function (msg) {
        self.msg = msg;
      })
    }
  })
</script>
```

这种方法轻量地实现了任何组件间的通信，如果深入使用，可以扩展`bus`实例，给它添加`data` 、`methods` 、`computed` 等选项，这些都是可以公用的，在业务中，
尤其是协同开发时非常有用，因为经常需要共享一些通用的信息，比如用户登录的昵称、性别、邮箱等，还有用户的授权`token`等。只需在初始化时让`bus`获取一次，
任何时间、任何组件就可以从中直接使用了，在单页面富应用（SPA ）中会很实用

## `slot`分发内容

当需要让组件组合使用，混合父组件的内容与子组件的模板时，就会用到`slot`，这个过程叫作内容分发（`transclusion`）。
**`props`传递数据、`events` 触发事件和`slot` 内容分发就构成了`Vue` 组件的`3` 个`API` 来源，再复杂的组件也是由这`3`部分构成的。**

### 作用域
学习`slot`，首先要知道：编译的作用域。例如：
```html
<child-component>
  {{ message }}
</child-component>
```

这里的`message`就是一个`slot`，但是它绑定的是父组件的数据，而不是子组件`</child-component>`的数据。
**父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译。**

```html
<!-- 无效 -->
<child-component v-show="someChildProperty"></child-component>
```
上面的代码，试图在父组件模板内将一个指令绑定到子组件的属性/方法，`someChildProperty`是子组件的属性，上例不会如预期那样工作。父组件模板并不感知子组件的状态。
正确的方式应该是：
```html
Vue.component('child-component', {
  // 有效，因为是在正确的作用域内
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```
类似地，被分发的内容会在父作用域内编译。

### 单个`slot`
在子组件内使用特殊的`<slot>`元素就可以为这个子组件开启一个`slot`，如果没有`<slot>`元素，父组件的内容将会被丢弃。
```html
<div id="app">
    <child-component1>
        <p>分发的内容</p>
        <p>更多的内容</p>
    </child-component1>
</div>
<script>
  var bus = new Vue();
  Vue.component('child-component1', {
    template: '<div><slot><p>父组件没有插入内容，就显示</p></slot></div>'
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```

**如果父组件没有插入内容，就会显示最初在`<slot>`标签中的内容（备用内容）。**

> **备用内容在子组件的作用域内编译。**

### 具名slot

`<slot>`元素可以指定一个`name`来进一步配置如何分发内容。多个插槽可以有不同的名字。
**仍然可以有一个匿名插槽，它是默认插槽。**
作为找不到匹配的内容片段的备用插槽。如果没有默认插槽，这些找不到匹配的内容片段将被抛弃。
```html
<div id="app">
    <child-component1>
        <h2 slot="header">slot header</h2>
        <p>分发的内容</p>
        <p>更多的内容</p>
        <div slot="footer">slot footer</div>
    </child-component1>
</div>
<script>
  var bus = new Vue();
  Vue.component('child-component1', {
    template: '' +
    '<div class="container">' +
    '   <div><slot name="header"></slot></div>' +
    '   <div><slot></slot></div>' +
    '   <div><slot name="footer"></slot></div>' +
    '</div>'
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```

### 作用域插槽
作用域插槽是一种特殊的插槽，使用一个可以复用的模板替换己渲染元素。
```html
<div id="app">
    <child-component1>
        <template slot-scope="props">
            <p>显示父组件的内容</p>
            <p>{{props.message}}</p>
        </template>
    </child-component1>
</div>
<script>
  Vue.component('child-component1', {
    template: '<div><slot message="显示子组件的内容"></slot></div>',
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```
上面的代码中，在父组件中有一个特殊属性`slot-scope` ，它的值将被用作一个临时变量名，此变量接收从子组件传递过来的数据，
在子组件中，`<slot>`元素上有一个`message="显示子组件的内容"`，用来将数据传到`slot`。

### `$slot`
`$slot`用来访问被插槽分发的内容，每个具名插槽有其相应的属性 (例如`slot="foo"`中的内容将会在`vm.$slots.foo`中被找到)。
`vm.$slots.default`属性包括了所有没有被包含在具名插槽中的节点。

在使用`render`函数创建组件时，比较有用。

## 动态组件
`is`特性来实现动态组件。
添加一个`keep-alive`指令，可以把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染：
```html
<keep-alive>
  <component :is="currentTabComponent">
    <!-- 非活动组件将被缓存！ -->
  </component>
</keep-alive>
```

组件会在 `currentTabComponent` 改变时改变。

## 异步组件
当项目比较大时，没有必要一开始把所有组件都加载，降低性能。注册`vue`的组件的时候，第二个参数定义为一个工厂函数，
实现异步加载组件：
```html
<div id="app">
    <my-component></my-component>
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>

  Vue.component('my-component', function (resolve, reject) {
    setTimeout(function () {
      resolve({
        template: "<div>异步加载组件</div>"
      })
    }, 5000)
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```

这里的`resolve`和`reject`和`Promise`对象的`resolve`方法，`reject`方法效果差不多。`setTimeout`只是为了表示这里是个异步方法。

## 递归组件
组件在它的模板内可以递归地调用自己，只需要给组件设置`name`选项：
```html
<div id="app">
    <my-component :count="1"></my-component>
</div>
<script>
  Vue.component('my-component', {
    name: "my-component",
    props: {
      count: {
        type: Number,
        default: 1
      }
    },
    template: "<div><my-component :count='count + 1' v-if='count < 3'></my-component></div>"
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```
使用递归组件，要确保递归调用有终止条件 (比如递归调用时使用`v-if`并最终解析为`false`)，否则会导致一个`max stack size exceeded`错误。
可以用来开发一些具有未知层级关系的独立组件，比如级联选择器。

## 内联模板
如果子组件有`inline-template`特性，组件将把它的内容当作它的模板，而不是把它当作分发内容。
```html
<div id="app">
    <my-component inline-template>
        <div>
            <h2>父组件中定义的组件的模板</h2>
        </div>
    </my-component>
</div>
<script>
  Vue.component('my-component', {

  });

  var app = new Vue({
    el: "#app"
  })
</script>
```
`inline-template`让模板的作用域难以理解。使用`template`选项在组件内定义模板或者在`.vue`文件中使用`template`元素才是最佳实践。


## `X-Template`
另一种定义模板的方式是在`JavaScript`标签里使用`text/x-template`类型，并且指定一个`id`。
```html
<div id="app">
    <my-component></my-component>
    <script type="text/x-template" id="my-component">
        <div>组件的内容</div>
    </script>
</div>
<script>
  Vue.component('my-component', {
    template: "#my-component"
  });

  var app = new Vue({
    el: "#app"
  })
</script>
```
这种方式将模板和组件的其它定义分离了，应该避免使用。

## 子组件索引
在子组件中，可以使用`this.$parent`访问父实例，如果当前实例有的话。父组件也可以通过`this.$children`访问它所有的子组件，
**需要注意`$children`并不保证顺序，也不是响应式的。**`Vue`提供了子组件索引的方法，可以使用`ref`为子组件指定一个引用`ID`。例如：
```html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>

<script>
    var parent = new Vue({ el: '#parent' })
    // 访问子组件实例
    var child = parent.$refs.profile
</script>
```

## 总结
- 全局注册，局部注册，组件的命名最好使用小写加`-`分割的形式命名。
- 全局注册的行为必须在根`Vue`实例 (通过`new Vue()`) 创建之前发生。
- `template`的`DOM`结构必须被一个元素包含，否则无法渲染。
- 使用组件需要注意两点：
  - `data`选项必须是函数
  - 像 `<ul>`、`<ol>`、`<table>`、`<select>` 这样的元素里允许包含的元素有限制，而另一些像 `<option>` 这样的元素只能出现在某些特定元素的内部。
    比如`<table>`内规定只允许是`<tr>`、`<td>`、`<th>`等这些表格元素，所以在`<table>`内直接使用组件是无效的。
  - 使用特殊的`is`
  - 使用字符串模板时不受限制的。
- 使用`DOM`模板时，`camelCase`(驼峰式命名)的`prop`需要转换成对应的`kebab-case`(短横线分隔式命名)。字符串模板不受这个限制。
- 当要传递布尔值，数值，数组，对象时，要使用`v-bind`，否则传递的是字符串，而不是你想要的值。
- 在`JavaScript`中对象和数组是引用类型，指向同一个内存空间，所以`props`是一个对象或数组，在子组件内部改变它会影响父组件的状态。
- `prop`验证。
- 父组件使用`prop`传递数据给子组件，子组件通过自定义事件向父组件传递数据。
- 如果需要在组件上监听原生`DOM`事件，使用修饰符`.native`
- 要让组件的`v-model`生效，它应该：
  - 子组件接受一个`value prop`
  - 在有新的值时触发`input`事件并将新值作为参数
- 非父子组件通信：
  - 可以使用一个空的`Vue`实例作为事件总线(`bus`)
- `props`传递数据、`events`触发事件和`slot`内容分发就构成了`Vue`组件的3个`API`来源，再复杂的组件也是由这3部分构成的。
- 编译的作用域，父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译。
- 在子组件内使用特殊的`<slot>`元素就可以为这个子组件开启一个`slot`，如果没有`<slot>`元素，父组件的内容将会被丢弃。
- `<slot>` 元素可以指定一个`name`来进一步配置如何分发内容。多个插槽可以有不同的名字。仍然可以有一个匿名插槽，它是默认插槽。如果没有默认插槽，这些找不到匹配的内容片段将被抛弃。
- 作用域插槽是一种特殊的插槽，使用一个可以复用的模板替换己渲染元素。
- `$slot`用来访问被插槽分发的内容
- `keep-alive`指令，可以把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染
- 注册vue的组件的时候，第二个参数定义为一个工厂函数，实现异步加载组件
- 组件在它的模板内可以递归地调用自己，只需要给组件设置`name`选项
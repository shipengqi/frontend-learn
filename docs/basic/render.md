# Vue render 函数

Vue 2.x使用了虚拟DOM，虚拟DOM本质上是一个JavaScript对象，在状态变化是，虚拟DOM会进行diff计算，更新需要被替换的DOM，而不会重新渲染整个页面。

使用 render 函数：
```html
<h1>
  <a name="hello-bue" href="#hello-vue">
    Hello Vue!
  </a>
</h1>
```
上面的代码，我们使用组件实现：
```html
<my-component :level="1">Hello Vue!</my-component>


<script type="text/x-template" id="my-component-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>


Vue.component('my-component', {
  template: '#my-component-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

上面的代码实现了我们想要的效果，但是代码冗长，重复使用`<slot>`元素，如果用render函数：
```html
Vue.component('my-component', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,
      this.$slots.default
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```
这样的实现就精简很多。

## 虚拟DOM
```html
<div>
  <h1>My virtual dom</h1>
  content
</div>
```

上面的HTML，当浏览器读到这些代码，它会创建一个节点树，每一个元素都是节点，文字内容也是节点，包括注释，每个节点还有自己的子节点。
Vue 通过建立一个虚拟 DOM 对真实 DOM 发生的变化保持追踪。请仔细看这行代码：
```javascript
return createElement('h1', this.blogTitle)
```
`createElement`返回的其实不是一个实际的 DOM 元素，而是一个节点的描述对象。它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点及其子节点。
这样的节点叫做"虚拟节点 (Virtual Node)""，简写为"VNode"。"虚拟 DOM"是由 Vue 组件树建立起来的整个 VNode 树的称呼。

## createElement 参数
```javascript
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签字符串，组件选项对象，或者
  // 解析上述任何一种的一个 async 异步函数，必要参数。
  'div',

  // {Object}
  // 一个包含模板相关属性的数据对象
  // 这样，您可以在 template 中使用这些属性。可选参数。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子节点 (VNodes)，由 `createElement()` 构建而成，
  // 或使用字符串来生成“文本节点”。可选参数。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

##  data 对象
```javascript
{
  // 和`v-bind:class`一样的 API
  'class': {
    foo: true,
    bar: false
  },
  // 和`v-bind:style`一样的 API
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 正常的 HTML 特性
  attrs: {
    id: 'foo'
  },
  // 组件 props
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器基于 `on`
  // 所以不再支持如 `v-on:keyup.enter` 修饰器
  // 需要手动匹配 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅对于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Scoped slots in the form of
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其他组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其他特殊顶层属性
  key: 'myKey',
  ref: 'myRef'
}
```

## 约束
组件树中的所有 VNodes 必须是唯一的。这意味着，下面的使用是错误的：
```html
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 错误-重复的 VNodes
    myParagraphVNode, myParagraphVNode
  ])
}
```

那么需要多个重复的组件、元素，可以使用工厂函数来实现。
```html
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## 使用JavaScript
### `v-if`,`v-for`
在vue中，像`v-if`, `v-for`，这些指令，用JavaScript实现会更简单：
```html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

上面的代码如果使用render函数：
```html
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```
### `v-model`
render函数没有实现与`v-model`相应的 api，所以要自己实现：
```html
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```
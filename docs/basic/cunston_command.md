# Vue 自定义指令

Vue 提供了很多内置的指令，但是有时我们希望对DOM进行底层操作，这就需要自定义指令。

## 自定义指令注册


### 全局注册
全局注册一个`v-test`的指令：
```html
Vue.directive("test", {
  //指令选项
})
```
### 局部注册
局部注册一个`v-test`的指令：
```html
var app = new Vue({
  el: "#app",
  directive: {
    test: {
      //指令选项
    }
  }
})
```

## 钩子
指令定义对象可以提供如下几个钩子函数，都是可选的：
- `bind`，只调用一次，指令在第一次绑定到元素时调用。这个钩子可以定义一个在绑定时执行一次的初始化设置。
- `inserted`，被绑定元素插入父节点时调用。
- `update`，被绑定元素所在的模板更新时调用。
- `componentUpdated`，被绑定元素所在模板完成一次更新周期时调用．
- `unbind`，只调用一次，指令与元素解绑时调用。

### 钩子函数参数
- el：指令所绑定的元素，可以直接操作 DOM 。
- binding：`Object`类型
  - name：指令名字，不包括`v-`前缀。
  - value：指令的绑定值，例如：`v-my-directive="1 + 1"`中，绑定值为 2。
  - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  - expression：字符串形式的指令表达式。例如`v-my-directive="1 + 1"`中，表达式为 "1 + 1"。
  - arg：传给指令的参数，可选。例如`v-my-directive:foo`中，参数为 "foo"。
  - modifiers：一个包含修饰符的对象。例如`v-my-directive.foo.bar`中，修饰符对象为`{ foo: true, bar: true }`。
- vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

```html
<div id="app">
    <div v-test:msg.a.b="message"></div>
</div>
<script>
  Vue.directive('test', {
    bind: function (el, binding, vnode) {
      var s = JSON.stringify;
      el.innerHTML =
        'name: '       + s(binding.name) + '<br>' +
        'value: '      + s(binding.value) + '<br>' +
        'expression: ' + s(binding.expression) + '<br>' +
        'argument: '   + s(binding.arg) + '<br>' +
        'modifiers: '  + s(binding.modifiers) + '<br>' +
        'vnode keys: ' + Object.keys(vnode).join(', ')
    }
  });

  new Vue({
    el: '#app',
    data: {
      message: 'Hello, Vue!'
    }
  })
</script>
```
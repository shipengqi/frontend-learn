# Vue 事件处理

Vue中使用指令`v-on`监听DOM事件，缩写是`@`。类似原生javascript的 `onclick`。

```html
<div id="app">
    <span>{{number}}</span>
    <button @click="number++">点击加1</button>
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      number: 18
    }
  })
</script>
```

通常情况下，业务逻辑比较复杂，`@click`后面可以跟上方法名，方法定义在vue实例的`methods`中。
```html
<div id="app">
    <span>{{number}}</span>
    <button @click="handleClick()">点击加1</button>
    <button @click="handleClick(10)">点击加10</button>
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      number: 18
    },
    methods: {
      handleClick: function (num) {
        num = num || 1;
        this.number += num;
      }
    }
  })
</script>
```

## $event
`@click="handleClick()"`这里的`handleClick`可以跟上`()`也可以不跟，如果不需要参数，就可以不跟，但如果需要传入参数，
没有括号时，也会默认会将原生事件对象`event`传入，加了括号时，如果要用`event`参数，可以使用 Vue 提供的一个特殊变量`$event`，用于访问原生DOM 事件：
``` html
<div id="app">
    <button v-on:click="say('hi', $event)">Say hi</button>
    <button v-on:click="say('what', $event)">Say what</button>
    <button v-on:click="warn('Form cannot be submitted yet.', $event)">Submit</button>
    <a href="http://www.baidu.com" @click="handle('禁止打开', $event)">打开链接</a>
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      number: 18
    },
    methods: {
      say: function (msg) {
        alert(msg);
        alert(event.target.tagName);
      },
      warn: function (message, event) {
        // 现在我们可以访问原生事件对象
        if (event) event.preventDefault();
        alert(message);
      },
      handle(message, event) {
        if (event) event.preventDefault();
        alert(message);
      }
    }
  })
</script>
```

## 事件修饰符
上面的例子，调用`event.preventDefault()`或`event.stopPropagation()`这种方法，虽然可以在方法中实现，
但是更好的方式：**方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。**在vue中可以通过修饰符实现，修饰符是由点开头的指令后缀来表示的：
- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

用法：

```html
<!-- 阻止单击事件冒泡 -->
<a @click.stop="handle"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="handle"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="handle"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理 -->
<div @click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div @click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div @scroll.passive="onScroll">...</div>

<!-- 键盘事件 -->
<!-- 只有在 `keyCode` 是 13 时调用 `vm.submit()` -->
<input @keyup.13="submit">

<!-- Vue 为最常用的按键提供了别名 -->
<input @keyup.enter="submit">
```

> 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用`v-on:click.prevent.self`会阻止所有的点击，而`v-on:click.self.prevent`只会阻止对元素自身的点击。
> 不要把`.passive`和`.prevent`一起使用，因为`.prevent`将会被忽略，同时浏览器可能会向你展示一个警告。

常用的按键别名：
- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

自定义按键修饰符别名：
```javascript
// 可以使用 v-on:keyup.f1
Vue.config.keyCodes.enter2 = 13
```

按键修饰符也可以组合使用，或和鼠标一起配合使用：

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

例如：
```html
<!-- Alt + C -->
<input @keyup.alt.67="handle">

<!-- Ctrl + Click -->
<div @click.ctrl="handle">Ctrl Click</div>
```

## 总结
- Vue中使用指令`v-on`监听DOM事件，缩写是`@`。类似原生javascript的 `onclick`。
- 使用`$event`，访问原生DOM事件。
- **方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。**
- 事件修饰符：
    - `.stop`，阻止事件冒泡
    - `.prevent`，阻止元素发生默认的行为
    - `.capture`，添加事件监听器时使用事件捕获模式
    - `.self`，只当在`event.target`是当前元素自身时触发处理函数
    - `.once`，事件将只会触发一次
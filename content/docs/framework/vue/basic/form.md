# Vue 表单

使用Vue指令`v-model`可以完成表单数据的双向绑定。

## 文本

```html
<div id="app">
    <input type="text" v-model="message" placeholder="输入 ...">
    <p>输入的内容：{{message}}</p>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      message: ""
    },
    methods: {
      handle: function () {
        console.log(event.target.value); //默认第一个参数是event
        this.message = event.target.value;
      }
    }
  })
</script>
```

**`v-model`只依赖所绑定的数据，会忽略初始化时的`value`、`checked`、`selected`属性的初始值，
在`<textarea></textarea>` 之间插入的值，也不会生效。使用`v-model`时，如果是用中文输入法输入中文，
一般在没有选定词组前，也就是在拼音阶段，Vue 是不会更新数据的，当敲下汉字时才会触发更新。如果希望总是实时更新，可以用`@input`来替代`v-model`。 **

```html
<div id="app">
    <input type="text" @input="handle" placeholder="输入 ...">
    <p>输入的内容：{{message}}</p>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      message: ""
    },
    methods: {
      handle: function () {
        console.log(event.target.value);
        this.message = event.target.value;
      }
    }
  })
</script>
```

## 文本域

```html
<textarea v-model="message" placeholder="输入 ..."></textarea>
<p>输入的内容：{{message}}</p>
```

## 复选框
```html
<div id="app">
    <!--单个复选框，绑定到布尔值-->
    <input type="checkbox" id="checkbox" v-model="checked">
    <label for="checkbox">状态：{{ checked }}</label>
    <br>
    <!--多个复选框，绑定到同一个数组-->
    <input type="checkbox" id="ihpone" value="ihpone" v-model="phones">
    <label for="ihpone">ihpone</label>
    <br>
    <input type="checkbox" id="huawei" value="huawei" v-model="phones">
    <label for="huawei">huawei</label>
    <br>
    <input type="checkbox" id="sansung" value="sansung" v-model="phones">
    <label for="sansung">sansung</label>
    <br>
    <span>Checked phones: {{ phones }}</span>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      checked: false,
      phones: []
    }
  })
</script>
```
## 单选按钮
```html
<div id="app">
    <input type="radio" id="one" value="One" v-model="picked">
    <label for="one">One</label>
    <br>
    <input type="radio" id="two" value="Two" v-model="picked">
    <label for="two">Two</label>
    <br>
    <span>Picked: {{ picked }}</span>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      picked: ''
    }
  })
</script>
```
## 选择列表

```html
<div id="app">
    <select v-model="selected">
        <option disabled value="">请选择</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    <br>
    <span>Selected: {{ selected }}</span>
    <br>
    <!--多选-->
    <select v-model="multiSelected" multiple>
        <option value="apple">iphone</option>
        <option>huawei</option>
        <option>sansung</option>
    </select>
    <br>
    <span>Selected: {{ multiSelected }}</span>
    <br>
    <!--用 v-for 渲染-->
    <select v-model="dyselected">
        <option v-for="option in options" v-bind:value="option.value">
            {{ option.text }}
        </option>
    </select>
    <br>
    <span>Selected: {{ dyselected }}</span>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      selected: '',
      multiSelected: ["apple", "huawei"],
      dyselected: '',
      options: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ]
    }
  })
</script>
```
`<option>`是备选项，如果含有`value`属性，`v-model`就会优先匹配`value`的值：如果没有，就会直接匹配`<option>`的`text`，推荐像上面这样提供一个值为空的禁用选项。

## 绑定值
单选按钮、复选框和选择列表在单独使用或单选的模式下，`v-model`绑定的值是一个静态字符串或布尔值，但有时需要绑定一个动态的数据，这时可以用`v-bind`来实现。
```html
<!--单选按钮-->
<div id="app">
    <input type="radio" v-model="picked" :value="value">
    <label>单选按钮</label>
    <p>{{picked}}</p>
    <p>{{value}}</p>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      picked: false,
      value: 666
    }
  })
</script>

<!--复选框-->
<div id="app">
    <input type="checkbox" v-model="toggle" :true-value="value1" :false-value="value2">
    <p>{{toggle}}</p>
    <p>{{value1}}</p>
    <p>{{value2}}</p>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      toggle: false,
      value1: 666,
      value2: 888
    }
  })
</script>

<!--选择列表-->
<div id="app">
    <select v-model="selected">
        <!-- 内联对象字面量 -->
        <option v-bind:value="{ number: 123 }">123</option>
    </select>
    <p>选中：{{selected.number}}</p>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      selected: ""
    }
  })
</script>
```
选择列表，当选中时，`app.selected`是一个`Object`，所以`app.selected.number == 123`。

> 复选框中的的`true-value`和`false-value`不会影响输入控件的`value`特性，因为浏览器在提交表单时并不会包含未被选中的复选框。
> 如果要确保表单中这两个值中的一个能够被提交，(比如“yes”或“no”)，请换用单选按钮。

## 修饰符
与事件的修饰符类似，`v-model`也有修饰符，用于控制数据同步的时机。

### `.lazy`
在输入框中，`v-model`默认是在`input`事件中同步输入框的数据，使用修饰符`.lazy`会转变为在`change`事件中同步。
```html
<input v-model.lazy="msg" type="text">
```

**添加了`.lazy`修饰符之后，msg 不会实时再改变，而是在失焦或按回车时才更新。**


### `.number`
自动将用户的输入值转为数值类型，在数字输入框时会比较有用。
```html
<input v-model.number="age" type="number">
```

### `.trim`
自动过滤用户输入的首尾空白字符。

```html
<input v-model.trim="msg">
```


## 总结
- `v-model`只依赖所绑定的数据，会忽略初始化时的`value`、`checked`、`selected`属性的初始值。
- 使用`v-model`时，如果是用中文输入法输入中文，一般在没有选定词组前，也就是在拼音阶段，Vue 是不会更新数据的，
当敲下汉字时才会触发更新。如果希望总是实时更新，可以用`@input`来替代v-model。
- `<option>`是备选项，如果含有`value`属性，`v-model`就会优先匹配`value`的值：如果没有，就会直接匹配`<option>`的`text`，推荐像上面这样提供一个值为空的禁用选项。
- `v-model`绑定的值是一个静态字符串或布尔值
- 修饰符：
  - `.lazy`，`v-model`默认是在`input`事件中同步输入框的数据，使用修饰符`.lazy`会转变为在`change`事件中同步。
  - `.number`，自动将用户的输入值转为数值类型，在数字输入框时会比较有用。
  - `.trim`，自动过滤用户输入的首尾空白字符。


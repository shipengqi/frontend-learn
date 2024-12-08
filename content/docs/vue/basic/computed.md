# Vue 计算属性

模板内的表达式一般只用来做简答计算，碰到复杂的逻辑，最好使用计算属性，方便维护。
计算属性还可以依赖多个Vue 实例的数据，只要其中任一数据变化，计算属性就会重新执行，视图也会更新。
计算属性可以理解为一种代理模式，在读取属性之时，先经历读代理(getter)中的计算，再返回需要的结果，这个过程就可以认为是在为这个属性添加了一个代理。
也可以添加写代理(setter)。

``` html
<div id="app">
    {{ prices }}
</div>
<script src="https://unpkg.com/vue@2.5.15/dist/vue.min.js"></script>
<script>
  var app = new Vue({
    el: "#app",
    data: {
      phones: [
        {
          name: "iPhone 7",
          price: 5600,
          count: 10
        },
        {
          name: "iPhone x",
          price: 8900,
          count: 100
        },
        {
          name: "iPhone 8",
          price: 6000,
          count: 12
        },
      ],
      books: [
        {
          name: "Nodejs",
          price: 56,
          count: 10
        },
        {
          name: "Vue",
          price: 46,
          count: 100
        },
        {
          name: "Go",
          price: 60,
          count: 12
        },
      ]
    },
    computed: {
      prices: function () {
        var prices = 0;
        for (var i = 0; i < this.phones.length; i ++) {
          prices += this.phones[i].price * this.phones[i].count;
        }

        for (var i = 0; i < this.books.length; i ++) {
          prices += this.books[i].price * this.books[i].count;
        }
        return prices;
      }
    }
  })
</script>
```

上面的代码中，使用了计算属性`computed`，商品变化，总价就会变化。
## getter setter
每一个计算属性都包含`getter`和`setter`方法，计算属性默认只有`getter`，但是可以自己提供`setter`。
``` javascript
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter ，执行 vm.fullName = 'pooky' 时，setter 就会被调用，从而更新firstName lastName
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

## 计算属性的两个小技巧
- **计算属性可以依赖其他计算属性**
- 计算属性不仅可以依赖当前Vue 实例的数据，还可以依赖其他实例的数据

## 计算属性与方法
用`methods`也可以实现相同的效果，**计算属性和方法区别就是计算属性是基于它的依赖缓存的**。也就是说，**计算属性只会在它依赖的数据改变时，
才会重新取值计算，否则不会更新。`methods`只要重新渲染就会被调用。**


**所以是否使用计算属性，取决于是否需要缓存，如果需要大量的计算时，建议使用计算属性。**

``` html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>

var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```
上面的例子中，`message`是响应式的，`message`改变，`reversedMessage`也改变。

``` html
computed: {
  now: function () {
    return Date.now()
  }
}
```

上面的例子，`Date.now()`不是响应式依赖，所以计算属性将不再更新。

## 计算属性和侦听属性
侦听属性用来观察 Vue 实例的数据变化。
- **尽量使用计算属性。**
- **数据变化，需要执行异步或者开销较大，使用侦听属性。**

侦听属性，就是**观察者模式**了。


``` html
//使用methods
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})

//使用计算属性，代码更简洁
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

## 总结
- 计算属性只有在它的相关依赖发生改变时才会重新求值。
- 每一个计算属性都包含getter和setter方法，计算属性默认只有getter，但是可以自己提供setter。
- 计算属性和方法区别就是计算属性是基于它的依赖缓存的。也就是说，计算属性之后在它依赖的数据改变时，才会重新取值计算，否则不会更新。methods 只要重新渲染就会被调用。
如果需要大量的计算时，建议使用计算属性。
- 计算属性是代理模式，侦听器是观察者模式。
- 尽量使用计算属性，数据变化，需要执行异步或者开销较大，使用侦听属性。



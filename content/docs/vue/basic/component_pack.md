# Vue 如何封装组件

封装通用组件必须具备高性能、低耦合的特性，如何封装一个好的组件？

## 数据从父组件传入

1. 为了低耦合，子组件就应该是无状态的。即使本身会生成数据，也只能在内部使用，不能传递出去。
2. 应该对`props`传递的参数应该添加一些验证规则
3. `props`传入的参数，不建议修改，如果必须要修改，建议定义子组件的`data`的一个属性来接收`prop`传入的值。
如果`prop`只以一种原始的值传入且需要进行转换，可以使用计算属性，比如把`prop`传入的值转成小写`return this.size.trim().toLowerCase()`。

## 在父组件处理事件

1. 事件的处理方法应当尽量放到父组件中，通用组件本身只作为一个中转，降低耦合性，保证了通用组件中的数据不被污染
2. 组件内部的一些交互行为，或者处理的数据只在组件内部传递，这时候就不需要用`$emit`了

## 留一个`slot`

1. 一个通用组件，往往不能够完美的适应所有应用场景，留一个`slot`来让父组件实现一些功能。
2. 开发通用组件的时候，只要不是独立性很高的组件，建议都留一个`slot`，即使还没想好用来干什么。

## 不要依赖 Vuex

1. Vuex 用来做组件状态管理的，类似一个全局变量，会一直占用内存，除非刷新页面，不建议用来非父子组件通信。
2. Vuex 在写入数据庞大的 state 的时候，就会产生内存泄露
3. 如果刷新页面时需要保留数据，可以通过 web storage 保存。

## 合理运用 scoped
在编写组件的时候，可以在`<style>`标签中添加`scoped`，让标签中的样式只对当前组件生效，但是一味的使用`scoped`，肯定会产生大量的重复代码，
所以当全局样式写好之后，再针对每个组件，通过`scoped`属性添加组件样式。
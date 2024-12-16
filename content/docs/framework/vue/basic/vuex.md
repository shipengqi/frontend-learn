# Vuex

[Vuex](https://vuex.vuejs.org) 是一个Vue状态管理插件。


## 安装
```bash
npm install vuex --save

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

## 介绍
当我们的应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。

对于问题一，传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。对于问题二，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。
以上的这些模式非常脆弱，通常会导致无法维护的代码。

因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为！

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，我们的代码将会变得更结构化且易维护。

Vuex有五个核心概念，分别是：

- State
- Getter
- Mutation
- Action
- Module

**Vuex的核心就是`store`（仓库），`store`包含了大部分的应用的数据（状态）。Vuex里面的数据都是响应式的，任何组件使用同一个`store`里面的数据时，只要`store`的数据变化，
相应的组件也会更新。Vuex不能直接改变`store`中的数据，改变`store`数据的唯一途径就是显示的提交（commit）mutation。没有为什么，就是一个约定，是因为我们想要更明确
地追踪到状态的变化。这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。**

```javascript
const store = new Vuex.Store({
  state: {
    count: "test"
  },
  mutations: {
    add (state) {
      state.count ++;
    },
    reduce (state) {
      state.count --;
    }
  }
})
```

上面的代码创建了一个`store`，数据保存在`state`属性中，**在组件中调用 store 中的状态简单到仅需要在计算属性中返回即可**：

```html
<template>
    <div>
      {{$store.state.count}}
      {{count}}
    </div>
</template>
<script>
  export default {
    computed: {
      count() {
        return this.$store.state.count;
      },
    },
    methods: {
      handleAdd() {
        this.$store.commit("add");
      },
      handleReduce() {
        this.$store.commit("reduce");
      },
    }
  }
</script>
```
由于不能直接改变`store`中的数据，我们可以在上面的代码中还添加了两个`mutations`， 在`methods`中通过 `this.$store.commit`方法来提交执行`mutation`。


## state
Vuex 使用**单一状态树**，应用层级的状态应该集中到单个 store 对象中。

```javascript
const app = new Vue({
  el: '#app',
  // 把 store 的实例注入所有的子组件
  store
})
```
通过在根实例中注册`store`选项，该`store`实例会注入到根组件下的所有子组件中，且子组件能通过`this.$store`访问到。

### mapState
当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。
`mapState`辅助函数帮助我们生成计算属性:

```javascript
import {mapState} from 'content/docs/framework/vue/basic/vuex'

export default {
    // ...
    computed: mapState({
        // 箭头函数可使代码更简练
        count: state => state.count,

        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',

        // 为了能够使用 `this` 获取局部状态，必须使用常规函数
        countPlusLocalState(state) {
            return state.count + this.localCount
        }
    })
}


//也可以给 mapState 传一个字符串数组
computed: mapState([
    // 映射 this.count 为 store.state.count
    'count'
])
```

## getter
如果下面的代码中，要对数组list过滤出小于10的数据：
```javascript
state: {
    list: [1, 9, 8, 10, 21, 7]
}

computed: {
  list () {
    return this.$state.list.filter(item => item < 10);
  }
}
```

计算属性可以很简单的实现，但是如果在多个组件中都需要过滤，那就要把代码复制多份，这个时候就可以使用getter：
```javascript
const store = new Vuex.Store({
    state: {
        list: [1, 5, 8, 10, 30, 50]
    },
    getters: {
        filteredList: state => {
            return state.list.filter(item => item < 10);
        }
    }
});

//访问getter
export default {
    computed: {
        list () {
            return this.$store.getters.filteredList;
        }
    }
}
```

getter 也可以依赖其他的getter ，把getter 作为第二个参数。
```javascript
getters: {
    listLength: (state, getters) => {
        return getters.filteredList.length;
    }
}
```

### 传参
getter函数不能直接传参数，但是可以通过让 getter 返回一个函数，来实现给 getter 传参。对 store 里的数据进行查询时非常有用：
```javascript
getters: {
  // ...
  getBotByName: (state) => (name) => {
    return state.botList.find((bot) => {
      bot.name === name
    })
  }
}


$store.getters.getBotByName("test")
```
### mapGetters
getter有自己的辅助函数`mapGetters`，不多介绍了。



## mutation

提交 mutation 是更改状态的唯一方法，通过 `this.$store.commit`方法来提交，上面已经简单的使用了mutation，mutation还可以接受第二个参数(payload)，
```javascript
  mutations: {
    add (state, n = 1) {
      state.count += n;
    }
  }


  //提交mutation
  this.$store.commit("add", 2);
```

当要传入的参数比较多时，payload可以传入对象。
```javascript
  mutations: {
    commit (state, payload) {
      state.name = payload.name;
    }
  }

  this.$store.commit("commit", {
    name: "xiaoming",
    age: 18
  });
```
Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项:

- 提前在你的 store 中初始化好所有所需属性
- 要在对象上添加新属性时，应该使用 vue.set，或以新对象替换老对象。

### 使用常量替代 Mutation 事件类型
使用常量替代 mutation 事件类型，并把这些常量放在单独的文件中：

```javascript
// mutation-types.js
const TEST_MUTATION = 'TEST_MUTATION'

export {
    TEST_MUTATION
}


// store.js
import Vuex from 'content/docs/vue/basic/vuex'
import {TEST_MUTATION} from './mutation-types'

const store = new Vuex.Store({
    state: {...},
    mutations: {
        [TEST_MUTATION](state) {
            // mutate state
        }
    }
})
```


### mapMutations
mapMutations 辅助函数将组件中的 methods 映射为 `$store.commit` 调用：
```javascript
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', //  `this.increment()` 映射为 `this.$store.commit('increment')`

    ]),
    ...mapMutations({
      add: 'increment' // `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```
**Mutation 必须是同步函数**，因为如果mutation是异步，当mutation 触发的时候回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用，
任何在回调函数中进行的状态的改变都是不可追踪的。

## action
上面已经知道，mutation只能是同步的，如果需要异步操作数据，就使用actions。action 与mutation 很像，区别：

- action 提交的是 mutation，而不是直接变更状态。
- action 可以包含异步操作。
- 改变数据就用mutation，存在业务逻辑，就用action。

```javascript
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state, n = 1) {
            state.count += n;
        }
    },
    actions: {
        increment (context, payload) {
            context.commit('increment', payload.num);
        },
        asyncIncrement (context) {
            return new Promise(resolve => {
                setTimeout(() => {
                    context.commit('increment');
                    resolve();
                }, 1000)
            });
        }
    }
});
```
上面代码中的context对象具有store 实例对象的属性和方法，但是不是 store 实例本身。可以访问`context.state` 和 `context.getters`。

action的通过`$store.dispatch`方法触发:
```javascript
this.$store.dispatch('increment', {num: 2});
this.$store.dispatch('asyncIncrement').then(() => {
    console.log(this.$store.state.count);
});
```

### mapActions
action的辅助函数`mapActions `，不多介绍。

在 action 中也可以触发另外一个 action：
```javascript
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

## module
对于大型应用，store 文件太大，就可以分割成多个模块。在**结构**介绍。
## 结构
使用 Vuex 需要遵守的规则：

- 应用层级的状态应该集中到单个 store 对象中。
- 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。
- 异步逻辑都应该封装到 action 里面。


如果你的 store 文件太大，可以将 action、mutation 和 getter 分割到单独的文件。

对于大型应用，可以把 Vuex 相关代码分割到模块中：


``` bash
├── index.html
├── main.js
├── api
│   └── ... # API
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # store
    ├── actions.js        # 根级别的action
    ├── mutations.js      # 根级别的mutation
    └── modules
        ├── a.js   # a模块
        └── b.js   # b模块
```


```javascript
//main.js：
import Vue from 'vue'
import App from './components/App.vue'
import store from './store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

//index.js
import Vue from 'vue'
import Vuex from 'vuex'
import a from './modules/a'
import b from './modules/b'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    a,
    b
  }
})

//a.js


const state = {
  count: 0
}

const getters = {
  render (state) {

  },
}

const actions = {
  increment ({ commit, state }, {}) {

  }
}

const mutations = {
  increment (state) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
```


### 命名空间
可以添加 `namespaced: true` 给模块添加命名空间，否则模块内部的 action、mutation 和 getter会注册到全局。这样可能导致拥有同一 mutation 或 action 的多个模块都能够对作出响应。
```javascript
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

### 在局部模块访问全局
在上面的例子中，有a模块和b模块，模块自己的state是**局部状态对象**，模块内部的 mutation 和 getter的第一个参数`state`，注意这个`state`是局部状态对象，而不是根节点的。
模块内部的action，第一个参数context，context.state属性也是局部的，但是可以通过`context.rootState`访问根节点状态，通过`context.rootGetter`访问根节点getter。
getter函数要访问根节点状态通过第三个参数，第四个参数是根节点的getter：
```javascript
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState, rootGetter ) {
      return state.count + rootState.count
    }
  }
}
```

如果要在全局命名空间内分发 action 或提交 mutation，给 dispatch 或 commit 传入第三参数`{ root: true }`。
```javascript
$store.dispatch('someOtherAction', null, { root: true })
$store.commit('someOtherAction', null, { root: true })
```

### store.registerModule
在 store 创建之后，可以使用 `store.registerModule` 方法注册模块,`store.unregisterModule(moduleName)`` 来卸载模块
```javascript
// 注册模块 `myModule`
store.registerModule('myModule', {

})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {

})
```

## 其他
### 插件
Vuex 的 store 的 `plugins` 选项，可以添加插件。具体使用查看[官网文档](https://vuex.vuejs.org/zh-cn/plugins.html)
### 严格模式
开启严格模式：
```javascript
const store = new Vuex.Store({
  // ...
  strict: true
})
```
严格模式下，不是由 mutation 函数引起的状态变更会抛出错误。会影响性能，建议在开发环境下使用。
### 表单
使用 Vuex 时，如果使用`v-model`绑定`state`中的数据会比较麻烦，因为使用`v-model`双向绑定数据，用户在`input`输入时会尝试修改`state`，
这在Vuex的严格模式中是会抛出错误的，因为`state`的数据只能在`mutation`中修改。


有两种方式可以解决上面的问题：
- 双向绑定计算属性
- 不使用`v-model`，`v-model`只是一个语法糖，可以直接使用`@input="handleInput"`监听`input`事件，并使用`:value`给表单元素绑定`value`，在`handleInput`函数中
提交`mutation`。

我比较常用的方式是第一种，给计算属性添加`getter`和`setter`：
```javascript
<bot-input v-model="volumeType"></bot-input>

computed: {
  volumeType: {
    get () {
      return this.$store.state.currentData.volume.type;
    },
    set (value, oldVal) {
      this.$store.commit('updateCurrentData', {volume: {type: value}});
    }
  }
}
```

具体使用查看[官网文档](https://vuex.vuejs.org/zh-cn/forms.html)

/**
 * User: shipengqi (pooky.shipengqi@gmail.com)
 * Date: 2018/5/6
 * Time: 15:46
 *
 */

function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function(data) {
    var self = this;
    if (!data || typeof data !== 'object') {
      return;
    }

    // 遍历data所有属性
    Object.keys(data).forEach(function(key) {
      self.defineReactive(data, key, data[key]);
    });
  },
  defineReactive: function(data, key, value) {
    var dep = new Dep();
    //递归遍历
    observe(value);

    //添加 setter和getter
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function getter () {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return value;
      },
      set: function setter (newValue) {
        if (newValue === value) {
          return;
        }
        value = newValue;

        // 通知所有订阅者
        dep.notify();
      }
    });
  }
};

function observe(value) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value);
}


function Dep () {
  this.subs = [];
}
Dep.prototype = {
  addSub: function(sub) {
    this.subs.push(sub);
  },
  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
};
Dep.target = null;
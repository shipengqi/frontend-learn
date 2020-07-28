/**
 * User: shipengqi (pooky.shipengqi@gmail.com)
 * Date: 2018/5/6
 * Time: 15:46
 *
 */

function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  update: function() {
    // 收到属性值变化的通知
    this.run();
  },
  run: function() {
    var value = this.get();// 取到最新值
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get: function() {
    Dep.target = this;  // 缓存自己
    var value = this.vm.data[this.exp]; // 强制触发getter，添加自己到属性订阅器中
    Dep.target = null;  // 释放自己
    return value;
  }
};
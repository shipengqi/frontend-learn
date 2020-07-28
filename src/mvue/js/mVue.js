/**
 * User: shipengqi (pooky.shipengqi@gmail.com)
 * Date: 2018/5/6
 * Time: 15:45
 *
 */

function mVue (options) {
  var self = this;
  this.data = options.data;
  this.methods = options.methods;
  var mounted  = options.mounted || function(){};
  Object.keys(this.data).forEach(function(key) {
    self.proxyKeys(key);
  });

  observe(this.data);
  new Compile(options.el, this);
  mounted.call(this); // 所有事情处理好后执行mounted函数
}

mVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function getter () {
        return self.data[key];
      },
      set: function setter (newVal) {
        self.data[key] = newVal;
      }
    });
  }
};
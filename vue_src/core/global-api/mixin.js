/* @flow */

import { mergeOptions } from '../util/index'

// 在 Vue 上添加 mixin
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}

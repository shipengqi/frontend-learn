# focus and tabindex 

- `div` 默认情况下是不会被 focus 的，需要 focus `div`。 可以添加 attribute `tabindex = -1`，这个表示可以 focus 但是不可以 `tab`，如果要可以 tab 那么是 `tabindex = 0`。
- `button` 默认情况下可以被 focus
- `a` 如果有 `herf` 可以被 focus，没有 `herf` 默认情况下不会被 focus。

`tabindex` 的 number 可以用来表示 focusable 和 tabable。

浏览器会从 tabindex 1 开始， tabindex 越大顺序越靠后, 数字重复就用 `parent -> child -> sibling` 的顺序 (所以对于一个区块只要分配一个值就可以了)。 tabindex 0 的顺序
会被放到最后。 例如：`1,1,2,2,2,2,3,4,5,0,0,0....`。

click 会有 focus 的， 但是没有 tab effect 边框
`display: none` 和 `visibility: hidden` 的元素是不可以 focus 的。
`document.click()` 这种模拟 click 的话, 是不会 focus 的, 可以再调用 `.focus()` 来 focus 元素。

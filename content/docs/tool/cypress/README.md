# Cypress

启动 Cypress：
```bash
./node_modules/.bin/cypress open

$(npm bin)/cypress open

npx cypress open

yarn run cypress open
```

启动后，会弹出窗口，`INTEGRATION TESTS` 是 cypress 提供的一些列子，双击的 `js` 文件，可以运行测试。

右上角可以切换浏览器。


## Usage

```typescript
// 获取指定 id 元素
cy.get("#{id}>")
// 获取包含指定 class 的元素
cy.get(".{class name}")
// 获取包含指定 attributes 的元素
cy.get("button[id='main']")
// 查找父元素的第 number 个子元素
cy.get(":nth-child({number})")
cy.get(":nth-child({number})>.nav-menu-item-content")
```

---
title: 管道
weight: 6
---

管道的作用是转换组件模板数据。要在 HTML 模板中指定值的转换方式，使用管道操作符 `|`。

## 内置管道
- `date` 日期格式化
- `currency` 货币格式化
- `uppercase` 转大写
- `lowercase` 转小写
- `json` 格式化 json 数据

```html
{{ date | date: "yyyy-MM-dd" }}
{{ num | currency: "￥" }} // ￥{num}
```

## 自定义管道

需求：指定字符串不能超过规定的长度

```javascript
// summary.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'summary' 
});
export class SummaryPipe implements PipeTransform {
    transform (value: string, limit?: number) {
        if (!value) return null;
        let actualLimit = (limit) ? limit : 50;
        return value.substr(0, actualLimit) + '...';
    }
}
```

```typescript
// app.module.ts
import { SummaryPipe } from './summary.pipe'
@NgModule({
    declarations: [
      SummaryPipe
    ] 
});
```

使用管道：

```html
<div> {{ 'test' | summary: 100 }} </div>
```

管道传参，使用 `:` 分隔，如果有多个参数，每个参数之间用 `:` 分隔（`| summary: 100: 200`）。

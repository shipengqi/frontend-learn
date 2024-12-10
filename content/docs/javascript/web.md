# Web API

# cookie、sessionStorage、localStorage

基本特性对比：

| 特性 | cookie | sessionStorage | localStorage |
| --- | --- | --- | --- |
| 数据生命周期 | 过期时间可设置，默认为会话结束时删除 | 仅在当前会话有效，关闭浏览器后清除 | 持久存储，除非手动清除，否则不会过期 |
| 数据存储大小 | 通常最大 4KB | 通常最大 5MB | 通常最大 5MB |
| 是否随请求发送 | 会自动随 HTTP 请求发送给服务器（Cookie 头） | 不会 | 不会 |
| 存取方式 | document.cookie | sessionStorage API | localStorage API |
| 作用域 | 同源同路径（默认） | 同源	同源
| 安全性 | 可以通过 HttpOnly 和 Secure 增强安全性 | 纯客户端存储，受 XSS 攻击威胁 | 纯客户端存储，受 XSS 攻击威胁 |



## cookie

在客户端和服务器之间传递少量数据。 需要服务器读取的信息，例如会话标识 (Session ID)。 用户偏好设置存储，例如主题选择或语言设置。

- 体积较小，适合存储少量信息。
- 支持设置过期时间和作用域。

### 域和路径

在设置 Cookie 时，域名 (Domain) 和 路径 (Path) 是控制 Cookie 作用范围的两个重要属性。

#### 设置域名

```
Set-Cookie: key=value; Domain=example.com
```

行为规则：

- 明确指定域名：
  - 例如：`Domain=example.com`。
    - 适用于 `example.com` 和其所有子域（如 `sub.example.com`）。
- 未指定 Domain 属性：
  - 默认情况下，Cookie 的作用域是设置该 Cookie 的域名（不包括子域）。
  - 例如，Set-Cookie 由 `www.example.com` 发出：
    - Cookie 仅适用于 `www.example.com`，而不适用于 `example.com` 或 `sub.example.com`。

如果需要跨子域共享 Cookie，可以设置为主域：

```
Set-Cookie: key=value; Domain=example.com
```

这样，`example.com`、`www.example.com` 和 `sub.example.com` 都可以访问此 Cookie。

为了限制作用范围，可以设置具体子域：

```
Set-Cookie: key=value; Domain=sub.example.com
```

#### 设置路径

```
Set-Cookie: key=value; Path=/somepath
```

行为规则：
- 明确指定路径：
  - 例如：`Path=/app`
    - Cookie 适用于 `/app` 和其子路径（如 `/app/page`）。
    - 不适用于 `/` 或其他路径（如 `/admin`）。
- 未指定 `Path` 属性：
  - 默认路径为设置 Cookie 的 URL 路径（不包括文件名部分）。
  - 例如，`https://example.com/docs/page.html` 设置的 Cookie，默认路径为 `/docs/`。

## sessionStorage

- 存储仅在当前会话有效的数据。
- 页面刷新时保留数据，但关闭浏览器或标签页后数据会被清除。
- 比如表单的临时保存、会话中用户选择的某些状态。
- 数据隔离于单个标签页或窗口。

## localStorage

- 持久存储较大的非敏感数据，例如用户设置、缓存数据。
- 需要长时间保留的数据，如购物车内容。
- 数据不随浏览器关闭而消失，除非手动清除。

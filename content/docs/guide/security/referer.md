---
title: Referer
draft: true
---

## 图片防盗链

**图片防盗链**是一种防止其他网站未经授权直接链接到你网站上的图片，从而消耗你的带宽并可能侵犯版权的技术手段。通常，它通过检查
HTTP 请求头部中的 `Referer` 字段，验证请求是否来自合法的域名。如果请求的来源不是被允许的域名，服务器会拒绝加载图片，或者返回一个
403 Forbidden 错误。

### 常见的实现方法

1. `Referer` 校验：
   当浏览器请求图片时，会在 HTTP 请求头中带上 `Referer` 字段，告诉服务器当前请求是从哪个页面发出的。防盗链通过检查这个字段来判断请求是否来自指定的合法域名。
   如果 `Referer` 字段的值与服务器预设的允许域名匹配，则允许加载图片；否则，拒绝访问。
   
   例如：

   - 请求的 `Referer` 是 `https://www.legit-site.com`，服务器允许该域名访问图片。
   - 如果请求的 `Referer` 是 `https://www.other-site.com`，服务器则拒绝访问。

2. 限制访问来源 IP 或 Host： 
   通过限制哪些 IP 地址或主机可以访问图片，避免外部站点使用盗链方式来加载你的图片。这通常涉及到配置服务器或防火墙。

3. Token 验证： 
   通过生成唯一的 token 机制，只有合法用户能够访问图片资源。这要求用户在请求图片时提供有效的 token，例如通过签名 URL 的方式实现。

4. 重定向到 403 页面或其他资源：
   对盗链的请求进行重定向，返回 HTTP 403 Forbidden 错误或者转向其他指定的资源。


### 破解方法

1. 伪造 `Referer`：
   - **方法**：通过修改 HTTP 请求头中的 `Referer` 字段，伪造一个合法的来源。
   - **实现**：可以使用浏览器的开发者工具，或使用命令行工具（如 `curl`）或一些专门的脚本，来修改 `Referer` 字段。

   示例：使用 `curl` 请求时伪造 `Referer`：

   ```bash
   curl -H "Referer: https://www.legit-site.com" https://example.com/image.jpg
   ```

   对于一些博客网站可以在 `html` 的 `head` 部分加上一行：
   
   ```html
   <meta name="referrer" content="no-referrer" />
   ```
   
   或者直接在 `img` 标签中加上 `referrerpolicy`：
   
   ```html
   <img referrerpolicy="no-referrer" />
   ```

2. 代理服务器绕过：
   - **方法**：通过使用代理服务器来隐藏真实的请求来源。请求会通过代理服务器转发，目标网站只能看到代理服务器的 IP 地址，而无法看到原始请求的 `Referer`。
   - **实现**：使用公共代理服务器或自建代理，转发图片请求，绕过防盗链检查。

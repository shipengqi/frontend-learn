---
title: HttpClient
weight: 12
---

该模块用于发送 Http 请求，用于发送请求的方法都返回 Observable 对象。

# 快速开始

1. 引入 `HttpClientModule` 模块

   ```typescript
   // app.module.ts
   import { httpClientModule } from '@angular/common/http';
   imports: [
     httpClientModule
   ]
   ```

2. 注入 `HttpClient` 服务实例对象，用于发送请求

   ```typescript
   // app.component.ts
   import { HttpClient } from '@angular/common/http';
   
   export class AppComponent {
   	constructor(private http: HttpClient) {}
   }
   ```

3. 发送请求

   ```typescript
   import { HttpClient } from "@angular/common/http"
   
   export class AppComponent implements OnInit {
     constructor(private http: HttpClient) {}
     ngOnInit() {
       this.getUsers().subscribe(console.log)
     }
     getUsers() {
       return this.http.get("https://jsonplaceholder.typicode.com/users")
     }
   }
   ```

# 请求方法

```typescript
this.http.get(url [, options]);
this.http.post(url, data [, options]);
this.http.delete(url [, options]);
this.http.put(url, data [, options]);
```

```typescript
this.http.get<Post[]>('/getAllPosts')
  .subscribe(response => console.log(response))
```

# 请求的配置选项

## 请求参数

```typescript
import { HttpParams } from '@angular/common/http';

const params = new HttpParams().set('page', '1').set('limit', '10');
this.http.get('url', { params }).subscribe(response => console.log(response));

```

## 请求头

```typescript
import { HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders().set('Authorization', 'Bearer token');
this.http.get('url', { headers }).subscribe(response => console.log(response));

```

## 响应内容

```typescript
declare type HttpObserve = 'body' | 'response';
// response 读取完整响应体
// body 读取服务器端返回的数据
```

```typescript
this.http.get(
  "https://jsonplaceholder.typicode.com/users", 
  { observe: "body" }
).subscribe(console.log)
```

# 拦截器

多个拦截器是按顺序执行的，顺序从上到下，即先注册的拦截器会先执行。

- 请求拦截器：先处理请求
- 响应拦截器：先处理响应

如果你有多个拦截器，它们会按顺序依次处理请求和响应。

创建拦截器：`ng g interceptor <name>`。

## 请求拦截

一个拦截器用来记录每个请求和响应的日志：
```typescript
// logging-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Request:', req);

        // 继续传递请求
        return next(req).pipe(
            tap(
                event => console.log('Response:', event),
                error => console.error('Error:', error)
            )
        );
    }
}

```

为每个 HTTP 请求中自动附加一个身份验证令牌：
```typescript
// auth-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // 假设你有一个 AuthService 来获取 token

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 获取存储的 token
    const authToken = this.authService.getToken();

    // 如果 token 存在，修改请求头，添加 Authorization
    if (authToken) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      // 将修改后的请求传递给下一个处理程序
      return next(clonedRequest);
    }

    // 如果没有 token，直接传递原始请求
    return next(req);
  }
}

```

## 响应拦截

```typescript
// response-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    // 在响应到达时修改响应数据
                    console.log('Response body:', event.body);
                    // 你可以在这里修改响应数据，比如做一些转换
                }
            })
        );
    }
}

```

使用拦截器来集中处理 HTTP 错误，比如统一处理 401 错误（未授权）或 500 错误（服务器错误）：

```typescript
// error-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          console.error('Unauthorized request. Redirecting to login...');
          // 处理 401 错误：例如跳转到登录页
        } else if (error.status === 500) {
          console.error('Internal server error:', error);
          // 处理 500 错误：例如弹出错误提示
        }
        return throwError(error);  // 重新抛出错误
      })
    );
  }
}

```

## 拦截器注入

```typescript
@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ]
})
export class AppModule {}

```

## HttpContext

在 Angular 中，`HttpInterceptor` 提供了拦截和修改 HTTP 请求的机制，从 Angular 15 开始，HttpClient 添加了 `context` 属性，可以携带额外的上下文信息供拦截器或服务使用。这为拦截器在不依赖全局状态或修改请求头的情况下提供了传递数据的方式。

1. 定义 `HttpContextToken`
   `HttpContextToken` 是用来定义和获取上下文值的工具：
   
   ```typescript
   import { HttpContextToken } from '@angular/common/http';

   // 定义一个上下文 Token
   export const MY_CONTEXT_TOKEN = new HttpContextToken<string>(() => null); // 默认值为 null
   ``` 

2. 在请求中设置 `context`
   在发起请求时，通过 HttpClient 的 `context` 属性设置值：
   
   ```typescript
   import { HttpClient, HttpContext } from '@angular/common/http';
   import { Component } from '@angular/core';
   import { MY_CONTEXT_TOKEN } from './context-token';
   
   @Component({
     selector: 'app-root',
     template: `<p>Check Console</p>`
   })
   export class AppComponent {
     constructor(private http: HttpClient) {
       // 创建一个带有 context 的 HttpContext 对象
       const context = new HttpContext().set(MY_CONTEXT_TOKEN, 'CustomHeaderValue');
       // 发起请求时附加 context
       this.http.get('/api/data', { context }).subscribe(response => {
         console.log(response);
       });
     }
   }
   ```

3. 拦截器设置
   在拦截器中，可以使用 `request.context.get()` 获取 `HttpContext` 中的值：

   ```typescript
   import { Injectable } from '@angular/core';
   import {
     HttpInterceptor,
     HttpRequest,
     HttpHandler,
     HttpEvent
   } from '@angular/common/http';
   import { Observable } from 'rxjs';
   
   @Injectable()
   export class CustomInterceptor implements HttpInterceptor {
     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       // 获取 context 中的值
       const customValue = request.context.get(MY_CONTEXT_TOKEN);
       if (customValue) {
         console.log('Context value:', customValue);
         // 可以基于 context 的值修改请求，例如添加自定义 header
         request = request.clone({
           headers: req.headers.append('X-Custom-Header', customValue),
         });
       }
       return next(request);
     }
   }
   ```

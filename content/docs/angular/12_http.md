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
        return next.handle(req).pipe(
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
      return next.handle(clonedRequest);
    }

    // 如果没有 token，直接传递原始请求
    return next.handle(req);
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
        return next.handle(req).pipe(
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
    return next.handle(req).pipe(
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

# NPM

## npm install

`npm install` 的工作流:

![install workflow](/static/images/npm-install.png)


### 检查 Config

根据当前项目中 NPM 的 Config 作为启动安装的配置，在终端中输入npm config ls -l后即可查看当前的 npm config 如下图,这其中包括了
我们常用的 npm 包安装源、npm 包的命名空间、缓存以及缓存的行为等

```
shipeng@CNshipeng01 MINGW64 /c/Code/bosun (feat/angular14)
$ npm config ls -l
; "default" config from default values

_auth = (protected)
access = null
all = false
allow-same-version = false
also = null
...

; "builtin" config from C:\Users\shipeng\AppData\Roaming\npm\node_modules\npm\npmrc

prefix = "C:\\Users\\shipeng\\AppData\\Roaming\\npm"

; "user" config from C:\Users\shipeng\.npmrc

http-proxy = "http://web-proxy.jp.softwaregrp.net:8080"
https-proxy = "http://web-proxy.jp.softwaregrp.net:8080/"
proxy = "http://web-proxy.jp.softwaregrp.net:8080/"
strict-ssl = false

; "cli" config from command line options

long = true
```

NPM 支持在不同层级中使用配置项，并且具备不同的优先级。四个层级的配置项：

1. `cli configs` 优先级最高，指的是命令行执行时添加的配置参数。
2. `builtin config` 指的是项目目录中 `.npmrc` 文件中的配置。`.npmrc` 文件存在多个层级时，项目级的 `.npmrc` 文件 > 用户级的 `.npmrc` 文件 > Node 全局 `.npmrc` 文件。
3. `user config` 用户层级的配置，一般执行 `npm config set` 命令默认修改的都是这一层级的配置。
4. `global config` 当前 Node 环境中的全局配置，一般通过 `npm config set xx --global` 修改。这个“全局”并不是当前操作系统的全局，而是
    当前 Node 环境，因为如果安装了 nvm 切换多个版本的 Node，而这里的配置项在各个版本的 Node 中是隔离的。
5. `default config` 默认配置。

### package-lock.json

是否存在有效的 `package-lock.json` 文件将会决定从 npm 服务端获取包信息和构建依赖树这两步工作是否要执行。

`package-lock.json` 是 `npm 5.x` 版本新增文件，它的作用是锁定依赖结构，即**只要你目录下有 `package-lock.json` 文件，那么你每次执行 `npm install` 后生成
的 `node_modules` 目录结构一定是完全相同的**。`npm install` 时存在 `package-lock.json` 文件会直接下载对应的包，不会再去获取包的版本信息。

后续如果需要重新安装依赖，则会直接从 `package-lock.json` 文件中读取，极大的提升了安装的效率。

### 构建依赖树

依赖树就是 npm 包与其依赖包之间的关系，主要体现在 `node_modules` 内部的目录结构上。

#### 嵌套结构

早期的 npm 1、npm 2 中呈现出的是嵌套结构，就是说了每个依赖项自己的依赖都是存放自己的 `node_modules` 文件夹下。

这样的方式优点很明显，`node_modules` 的结构和 `package.json` 结构一一对应，层级结构明显，并且保证了每次安装目录结构都是相同的。

问题：
1. 依赖层级太深，会导致文件路径过长的问题，尤其在 window 系统下（文件路径最大长度为 260 个字符）。
2. 大量重复的包被安装，文件体积超级大。

#### 扁平结构

npm 在 3.x 版本做了一次较大更新。其将早期的嵌套结构改为扁平结构：安装模块时，不管其是直接依赖还是子依赖的依赖，优先将其安装在 `node_modules` 根目录。
这确实缓解了嵌套模式的两个问题，减少了包的冗余。当安装到相同模块时，判断已安装的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 `node_modules` 下安装该模块。

问题:
1. 依赖结构的不确定性。
2. 扁平化算法本身的复杂性很高，耗时较长。
3. 项目中可以非法访问没有声明过依赖的包

### 缓存

执行 `npm install` 或 `npm update` 命令下载依赖后，会存放到本地的缓存目录中，然后再将对应的的依赖复制到项目的 `node_modules` 目录下。

`npm config get cache 命令可以查询

npm 在执行安装时，可以根据 `package-lock.json` 中存储的 integrity、version、name 生成一个唯一的 key 对应到 `index-v5` 目录下的缓存记录，从而找到 tar包的 hash，然后
根据 hash 再去找缓存的 tar 包直接使用。


npm 提供了离线安装模式：

`--prefer-offline`： 优先使用缓存数据，如果没有匹配的缓存数据，则从远程仓库下载(默认)。
`--prefer-online`： 优先使用网络数据，如果网络数据请求失败，再去请求缓存数据，这种模式可以及时获取最新的模块。
`--offline`： 不请求网络，直接使用缓存数据，一旦缓存数据不存在，则安装失败。

### 文件完整性

在下载依赖包之前，我们一般就能拿到 npm 对该依赖包计算的 hash 值，例如执行 `npm info` 命令，紧跟 `tarball` (下载链接) 的就是 `shasum` (hash)。

在下载完成之后需要在本地在计算一次文件的 hash 值，如果两个 hash 值是相同的，则确保下载的依赖是完整的，如果不同，则进行重新下载。

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

`npm config get cache` 命令可以查询

npm 在执行安装时，可以根据 `package-lock.json` 中存储的 integrity、version、name 生成一个唯一的 key 对应到 `index-v5` 目录下的缓存记录，从而找到 tar包的 hash，然后
根据 hash 再去找缓存的 tar 包直接使用。


npm 提供了离线安装模式：

`--prefer-offline`： 优先使用缓存数据，如果没有匹配的缓存数据，则从远程仓库下载(默认)。
`--prefer-online`： 优先使用网络数据，如果网络数据请求失败，再去请求缓存数据，这种模式可以及时获取最新的模块。
`--offline`： 不请求网络，直接使用缓存数据，一旦缓存数据不存在，则安装失败。

### 文件完整性

在下载依赖包之前，我们一般就能拿到 npm 对该依赖包计算的 hash 值，例如执行 `npm info` 命令，紧跟 `tarball` (下载链接) 的就是 `shasum` (hash)。

在下载完成之后需要在本地在计算一次文件的 hash 值，如果两个 hash 值是相同的，则确保下载的依赖是完整的，如果不同，则进行重新下载。


## package.json

### 版本号

`package.json` 中 `version` 字段、 `dependencies` 依赖列表中，都使用到了版本号：

npm 版本号由 3 个数字组成： `{主版本}.{次版本}.{补丁版本}`。

当发布新的版本时，需遵循以下规则：

- 进行不兼容的 API 更改，升级主版本
- 以向后兼容的方式添加功能，升级次版本
- 以向后兼容的方式修复缺陷，升级补丁版本

版本的一些规则：

- `^` ：只会执行不更改**最左边非零数字**的更新（不更改第一个非零数字）
  如果写入的是 `^0.13.0`，则当运行 `npm update` 时，可更新到 `0.13.1`、`0.13.2` 等，但不能更新到 `0.14.0` 或更高版本
  如果写入的是 `^1.13.0`，则当运行 `npm update` 时，可更新到 `1.13.1`、`1.14.0` 等，但不能更新到 `2.0.0` 或更高版本

- `~`：仅更新补丁版本
  如果写入的是 `~0.13.0`，则当运行 `npm update` 时，会更新到补丁版本：即 `0.13.1` 可以，但 `0.14.0` 不可以。
- `>`：接受大于指定版本的任何版本
- `>=`：接受大于等于指定版本的任何版本
- `<`：接受小于指定版本的任何版本
- `<=`：接受小于等于指定版本的任何版本
- `=`：接受明确的版本（与不带符号，直接写版本号一样）
- `-`：接受指定范围的版本。例如：`2.1.0 - 2.6.2`
- `||`： `或` 符号（ `且` 用空格即可）
  `1.0.0 || >=1.1.0 <1.2.0`：使用 `1.0.0` 或大于等于 `1.1.0` 但小于 `1.2.0` 的版本
- `latest`：关键字，使用可用的最新版本

### peerDependencies

假设现在有一个 `demo` 工程,已经在其 `package.json` 的 `dependencies` 中声明了 `packageA`，有两个包 `app1` 和 `app2` 也依赖 `packageA`，
如果在 `app1` 或 `app2` 中使用 `dependencies` 而不是 `peerDependencies` 来声明 `packageA`，那么 `npm install` 安装完 `app1` 和 `app2` 
之后的依赖图是这样的：

```
├── demo
│   └── node_modules
│       ├── packageA
│       ├── app1
│       │   └── nodule_modules
│       │       └── packageA
│       └── app2
│       │   └── nodule_modules
│       │       └── packageA
```

`packageA` 依赖包被安装了 3 次，造成了 2 次安装冗余。

如果采用 `peerDependencies` 来下载，就可以避免这个核心依赖库被重复下载的问题。`app1` 和 `app2` 的 `package.json` 文件使用 `peerDependencies` 字段声
明 `packageA`。再执行 `npm install`，生成的依赖结构就会如下所示：

```
├── demo
│   └── node_modules
│       ├── packageA
│       ├── app1
│       └── app2
```

`packageA` 也只被安装了一次。

> 如果用户在根目录的 `package.json` 文件里显式依赖了核心库，那么各个子项目里的 `peerDependencies` 声明就会忽略。
> 如果用户没有显式依赖核心库，那么就按照子项目的 `peerDependencies` 中声明的版本将库安装到项目根目录中。当用户依赖的版本、各插件依赖的版本之
> 间不相互兼容，会报错让用户自行修复。


### `--legacy-peer-deps`

在 npm v7 或以上版本，会默认安装 `peerDependencies`。

在很多情况下，这会导致版本冲突，从而中断安装过程。

`--legacy-peer-deps` 标志是在 v7 中引入的，目的是绕过 `peerDependency` 自动安装。它告诉 npm 忽略项目中引入的各个依赖模块之间依赖相同但版本不同的问题。

### `--force`

`--force` 也可以解决依赖冲突，目的是无视冲突，强制从远程仓库中获取资源并覆盖掉本地资源。

### `legacy-peer-deps` 和 `--force`

`legacy-peer-deps` 通常更安全，在处理同级别的依赖关系冲突时，应该是首选选项。

`--force` 应该作为最后的手段来使用，而且只有在你完全理解其影响的情况下才可以使用。它有可能引入破坏性的变化或导致软件包的不一致。


## npmrc

`.npmrc` 是 NPM 的配置文件 。

文件可以存在四个位置，具有不同的作用域：

- 项目配置文件：项目根目录下的 `.npmrc` 文件作为当前项目的 NPM 配置文件。
- 用户配置文件：在当前用户根目录下的 `~/.npmrc` 文件作为当前用户的 NPM 配置文件。
- 全局配置文件：使用 `npm config get prefix` 获取 NPM 全局安装路径，使用获取的路径加上 `.../etc/.npmrc` 获取全局配置文件，当前配置文件作用于所有用户。
- NPM 内置配置文件：放置于 `/path/to/npm/npmrc`，不可修改。

配置文件的格式是 `ini` 格式的参数列表：

```ini
<key>=<value>
```

配置文件可以直接修改，也可以使用 NPM 命令：

```bash
# 设置
npm config set <key>=<value> [<key>=<value> ...]
npm set <key>=<value> [<key>=<value> ...]

# 获取
npm config get [<key> [<key> ...]]
npm get [<key> [<key> ...]]

# 显示所有配置（可显示为 json 结构）
npm config list [--json]

# 从所有配置文件中删除指定 key
npm config delete <key> [<key> ...]
```

### 优先级

`项目配置文件 > 用户配置文件 > 全局配置文件 > NPM 内置配置文件`

### 常见用法

#### 定义镜像源

项目配置文件：

```ini
# 设置同一个前缀/目录下包的源
# 设置将前缀为@babel的包源指向了华为源
@babel:registry=https://mirrors.huaweicloud.com/repository/npm/

# 指定项目下所有包的源，切换为国内源
# 如果上面的前缀规则没有匹配到，则使用这里的源
registry = https://registry.npmmirror.com
```
enum Type { Strong, Week }

class Java {
    helloJava() {
        console.log('Hello Java')
    }
    java: any
}

class JavaScript {
    helloJavaScript() {
        console.log('Hello JavaScript')
    }
    js: any
}

function getLang(t: Type) {
    let lang = t === Type.Strong ? new Java() : new JavaScript()

    // 这里需要类型断言，否则 ts 无法判断类型
    if ((lang as Java).helloJava) {
        (lang as Java).helloJava()
    } else {
        (lang as JavaScript).helloJavaScript()
    }

    return lang
}

getLang(Type.Strong) // Hello Java

// 上面的 getLang 方法，由于不知道程序运行时，会传入什么样的类型，就需要在每一处加上类型断言，这使代码不容易维护。
// 类型保护就可以用来解决这个问题
// 1. 使用 instanceof

function getLang2(t: Type) {
    let lang = t === Type.Strong ? new Java() : new JavaScript()

    if (lang instanceof Java) {
        lang.helloJava()
    } else {
        lang.helloJavaScript()
    }
}

// 2. in 判断对象是否包含某个属性

function getLang3(t: Type) {
    let lang = t === Type.Strong ? new Java() : new JavaScript()

    if ('java' in lang) {
        lang.helloJava()
    } else {
        lang.helloJavaScript()
    }
}

// 3. typeof 判断出类型，就可以使用类型的方法或属性
function getLang4(t: Type, x: string | number) {
    let lang = t === Type.Strong ? new Java() : new JavaScript()

    if (typeof x === 'string') {
        x.length
    } else {
        x.toFixed()
    }
}

// 4. 创建类型保护函数
function isJava(lang: Java | JavaScript): lang is Java {
    return (lang as Java).helloJava !== undefined
}
function getLang5(t: Type) {
    let lang = t === Type.Strong ? new Java() : new JavaScript()

    if (isJava(lang)) {
        lang.helloJava()
    } else {
        lang.helloJavaScript()
    }
}
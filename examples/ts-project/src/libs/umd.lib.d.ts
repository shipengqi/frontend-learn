declare namespace umdLib {
    const version: string
    function doSomething(): void
}

// export as namespace 专为 umd 类库设置的语句
export as namespace umdLib

export = umdLib
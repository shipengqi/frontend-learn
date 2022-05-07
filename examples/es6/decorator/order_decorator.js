function dec(id) {
    console.log('evaluated', id);
    return (target, property, descriptor) => console.log('executed', id);
}

function dec2(target, property, descriptor) {
    console.log('executed dec2');
}

function dec3(target, property, descriptor) {
    console.log('executed dec3');
}

class ExampleDecoratorsOrder {
    @dec(1)
    @dec(2)
    method() {
    }

    @dec2
    @dec3
    method2() {
    }
}

// evaluated 1
// evaluated 2
// executed 2
// executed 1
// executed dec3
// executed dec2

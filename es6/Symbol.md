# 本章为草稿阶段，不建议阅读

# Symbol

> ES6引入了一种新的原始数据类型Symbol，表示独一无二的值。它是JavaScript语言的第七种数据类型，前六种是：Undefined、Null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

````html
<!-- https://github.com/Automattic/expect.js -->
<script src="/static/expect.js"></script>
````

## ID

有时我们需要给一些数据生成 ID，且这个 ID 是唯一性的。绝对不能与任何其他ID重复。此时可以使用 `Symbol()` 作为 ID。

<!--MR-H
<script data-markrun-lastrun="true" >console.info('ID')</script>
-->

````js
var createItem = function (text) {
    return {
        id: Symbol(),
        text: text
    }
}
var list = [
    createItem('abc'),
    createItem('123'),
    createItem('456')
]
var removeItem = function (target) {
    list = list.filter(function (item) {
        if (item.id === target.id) {
            return false
        }
        else {
            return true
        }
    })
}
console.log(list, JSON.stringify(list))
removeItem(list[1])
console.log(list, JSON.stringify(list))
````

## getOwnPropertySymbols

<!--MR-H
<script data-markrun-lastrun="true" >console.info('getOwnPropertySymbols')</script>
-->

````js
var obj = {}
var some = Symbol('some')
obj[some] = 'abc'
obj['age'] = 24
for (var key in obj) {
    console.log('for-in:', key)
}
// for-in: age
````

> Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。

````js
obj[Symbol('123')] = 'xyz'
console.log(
    Object.getOwnPropertyNames(obj)
) // ["age"]
console.log(
    Object.getOwnPropertySymbols(obj)
) // [Symbol(some), Symbol(123)]
````

### 全局 Symbol

<!--MR-H
<script data-markrun-lastrun="true" >console.info('全局 Symbol')</script>
-->

````js
// 全局等于全局
expect(Symbol.for('a')).to.equal(Symbol.for('a'))

// 非全局不等于非全局
expect(Symbol('a')).not.to.equal(Symbol('a'))

// 非全局不等全局
expect(Symbol('a')).not.to.equal(Symbol.for('a'))

var someAbc = Symbol.for('abc')
expect(Symbol.keyFor(someAbc)).to.equal('abc')
````

### 判断类库是否加载过

<!--MR-R
{
    type: 'pre',
    file: './library-symbol-test.js',
    run: false
}
-->

<!--MR-H
<script data-markrun-lastrun="true" >console.info('判断类库是否加载过')</script>
<script data-markrun-lastrun="true" src="./library-symbol-test.js"></script>
<script data-markrun-lastrun="true" src="./library-symbol-test.js"></script>
-->

```html
<script src="./library-symbol-test.js"></script>
<script src="./library-symbol-test.js"></script>
```

# generator

> 阅读本章前请务必理解 [Promise](./Promise/md)

首先异步变成最终推荐使用 `async` 函数的方案，但是需要先了解 `generator` 才能更好的理解 `async 函数`。

````js
function* some () {
    console.log('start')
    yield 'a'
    yield 'b'
    yield 'c'
    return 'over'
}

var nimo = some()
nimo.next() // start
nimo.next() // {value: 'a', done: false}
nimo.next() // {value: 'b', done: false}
nimo.next() // {value: 'c', done: false}
nimo.next() // {value: undefined, done: true}
````

通过在函数内加入 yield 作为暂停标记，当第一次调用 `next` 后遇到 yield 则会暂停。通过 `next` 继续执行。

`generator` 只所以可以作为异步编程的工具是因为可以通过同步的写法写出异步操作。比如：

## 异步加载图片

首先定义一个加载图片的 Promise 生成函数

````js
function loadPhoto(src) {
    return new Promise(function (resolve, reject) {
        var img = new Image()
        img.onload = function () { resolve(img) }
        img.onerror = function () { reject(`${src} loading fail`) }
        img.src = src
    })
}
````

```js
// 使用示例
var promise = loadPhoto('https://picsum.photos/100/100')

promise
.then(function resolve (imgNode) {
    console.log('promiseLoad:', imgNode.src)
}).catch(function (error) {
    throw error
})
```

创建 generator 函数加载指定图片

**加载图片，异步加载完成后打印图片代码**

````js
function* load (src){
    var photoCode = yield loadPhoto(src)
    console.log('photoCode', photoCode)
}
var g = load('https://picsum.photos/300/300')
var promise = g.next().value
promise.then(function (imgNode) {
    var photoCode = `<img class="photo" src="${imgNode.src}" />`
    g.next(photoCode)
})
````

**进一步获取模糊版本的图片**

````js
function* loadBlur (src){
    var photoSrc = yield loadPhoto(src)
    var blurPhotoCode = yield loadPhoto(photoSrc)
    console.log('blurPhotoCode', blurPhotoCode)
}
var gBlur = loadBlur('https://picsum.photos/300/300')
var promise = gBlur.next().value
promise.then(function (imgNode) {
    return gBlur.next(`${imgNode.src}?blur`).value
}).then(function (imgNode) {
    var photoCode = `<img class="photo" src="${imgNode.src}" />`
    gBlur.next(photoCode)
}).catch(function (err) {
    console.log(err)
})
````

`generator` 虽然能解决异步的问题，但有时它反而会让代码更难以维护，即使有 [co](https://github.com/tj/co)模块来解决自动执行的需求。

前期了解 `generator` 的语法后可以立即学习 [async函数](./async.md)

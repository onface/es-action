# Promise

> Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

> 推荐阅读： http://es6.ruanyifeng.com/#docs/promise

````js
var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve('msg')
        // or
        // reject('error message')
    }, 100)
})
.then(function resolve(value) {
    // value = 'msg'
}, function reject(error) {
    // error = 'error message'
})
````

## 加载图片

> 图片加载成功调用 resole，图片加载失败调用 reject

**不使用 `Promise` 实现加载图片**

````js
function loadImg (url, resolve, reject) {
    var img = new Image()
    img.onload = function () {
        resolve(img)
    }
    img.onerror = function () {
        reject(url + ' loading fail')
    }
    img.src = url
}
loadImg(
    'https://picsum.photos/50/50',
    function resolve (imgNode) {
        console.log('loadImg:', imgNode.src)
    },
    function reject (error) {
            throw error
    }
)
````

**使用 `Promise` 实现加载图片**

````js
function promiseLoad(url) {
    return new Promise(function (resolve, reject) {
        var img = new Image()
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function () {
            reject(url + ' loading fail')
        }
        img.src = url
    })
}
promiseLoad('https://picsum.photos/100/100').then(
    function resolve (imgNode) {
        console.log('promiseLoad:', imgNode.src)
    },
    function reject (error) {
            throw error
    }
)
````

在简单场景下使用 `Promise` 和不适用 `Promise` 并没有什么区别。

如果需要按队列加载图片， `Promise` 的优势就体现出来了。

**回调函数**

````js
console.log('--------')
var loadImgFeject = function reject(msg) {
    console.error(msg)
}
loadImg(
    'https://picsum.photos/10/10',
    function resolve(imgNode) {
        console.info('Callback 1:', imgNode.src)
        loadImg(
            'https://picsum.photos/20/20',
            function resolve(imgNode) {
                console.info('Callback 2:', imgNode.src)
                loadImg(
                    'https://picsum.photos/30/30',
                    function resole(imgNode) {
                        console.info('Callback 3:', imgNode.src)
                    },
                    loadImgFeject
                )
            },
            loadImgFeject
        )
    },
    loadImgFeject
)
````


**Promise**

````js
promiseLoad('https://picsum.photos/110/110')
.then(function resolve(imgNode) {

    console.log('Promise  1:', imgNode.src)
    return promiseLoad('https://picsum.photos/120/120') // @1

}).then(function resolve(imgNode) { // @2

    console.log('Promise  2:', imgNode.src)
    return promiseLoad('https://picsum.photos/130/130')

}).then(function resole(imgNode) {

    console.log('Promise  3:', imgNode.src)

}).catch(loadImgFeject)
````

> @1 行中还可以继续返回 `Promise`，@2 的 `then` 对应的是 @1 返回的 `Promise`
> 可以通过最后一个 catch 捕获全面所有的错误，等于是将 loadImgFeject 设为 then 的第二个参数

队列执行回调的时候不使用 `Promise` 就会造成 [回调地狱](http://callbackhell.com/)

因为 `Promise` 能避免回调地狱，很多第三方库都将回调函数改成了 `Promise`。如果你看到第三方库示例中出现了 `.then()` 说明这个库支持 `Promise`。


## catch

catch不止可以捕获 reject 的返回，还能捕获 `throw` 错误

````js
new Promise(function(resolve, reject) {
    throw new Error('error default')
}).catch(function (err) {
    console.log('error', err)
})
````

> 一般总是建议，Promise 对象后面要跟catch方法，这样可以处理 Promise 内部发生的错误。catch方法返回的还是一个 Promise 对象，因此后面还可以接着调用then方法。

## finally

> `finally`方法用于指定不管 `Promise` 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。


```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

`finally` 的使用场景一般是：异步操作前将某个按钮禁用，完成后无论成功失败都将禁用取消

## all

> Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

**家庭中三个人的头像都加载成功才会显示出来**

````js
Promise.all(
    [
        promiseLoad('https://picsum.photos/201/201'),
        promiseLoad('https://picsum.photos/202/202'),
        promiseLoad('https://picsum.photos/203/203'),
    ]
).then(function (photoArray) {
    console.log('photoArray', photoArray)
}).catch(function (error) {
    console.log('error', error)
})
````

## race

`Promise.all` 和 `Promise.race` 的区别就像 `Array.prototype.every` `Array.prototype.some`

**任何一个头像加载成功就显示出来**

````js
Promise.race(
    [
        promiseLoad('https://picsum.photos/2012/201'),
        promiseLoad('https://picsum.photos/202/202'),
        promiseLoad('https://picsum.photos/203/203'),
    ]
).then(function (photo) {
    console.log('photo', photo)
}).catch(function (error) {
    console.log('error', error)
})
````

清除缓存后会发现日志会变成 `photo <img src=​"https:​/​/​picsum.photos/​201/​202">​` 而不是 2012 因为 202 图片尺寸小，先被加载完成，所以回调的是 202 。再次刷新则是 2012 因为浏览器缓存了这些图片，2012因为在第一行就优先被加载了。


## Promise.resolve Promise.reject


`Promise.resolve() Promise.reject()` 就是个语法糖

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了')
```

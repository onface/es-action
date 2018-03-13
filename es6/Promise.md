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

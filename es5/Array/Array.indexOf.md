# Array.prototype.indexOf(searchElement[, fromIndex = 0])

> 建议先阅读文档 [Array.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)

````js
var names = ['nimo', 'judy', 'nico']
names.indexOf('judy')   // 1
````

`String.prototype.indexOf()` 方法返回指定值在字符串对象中首次出现的位置。从 fromIndex 位置开始查找，如果不存在，则返回 -1。

而ES5中则新增了 `Array.prototype.indexOf(searchElement[, fromIndex = 0])` 方法返回给定元素能找在数组中找到的第一个索引值，否则返回-1。

## 替代ES3遍历查询

利用 `Array.prototype.indexOf()` 我们可以替换到我们之前写过的一些 `for` 查找索引

````js
var names = ['nimo', 'judy', 'nico']
var index
var searchElement = 'judy'
var i
for (i = 0; i< names.length; i++) {
    if (names[i] === searchElement) {
        index = i
        // stop for
        i = names.length
    }
}
console.log('index:', index)
````

## 全文搜索

并且 `Array.prototype.indexOf(searchElement[, fromIndex = 0])` 支持 `fromIndex` 参数，此参数默认为 0 。

利用他我们可以利用递归找到所有的匹配元素

````js
var names = ['nimo', 'judy', 'nico', 'nimo', 'judy', 'nico', 'nimo', 'judy', 'nico']

function findAll (array, searchElement) {
    var allIndex = []
    var index = array.indexOf(searchElement)
    while (index !== -1) {
        allIndex.push(index)
        index = array.indexOf(searchElement, index + 1);
    }
    return allIndex
}
console.log(
    findAll(names, 'judy')  // [1, 4, 7]
)
````


## 倒数名次查询

利用 formIdex: -10 查询倒数第十名中是否存在某人,如果是倒数第十名返回某人的名次。

````js
var rank = ["郑敏","陈伟","苏强","郑丽","徐杰","龚芳","韩静","郑洋","钱磊","陆勇","廖秀英","罗秀英","宋霞","赖明","魏军","易娜","江明","邹超","张三","薛娜","宋强","曹艳"]
console.log(
    rank.indexOf('张三', -10)     // 18
)
console.log(
    rank.indexOf('陈伟', -10)     // -1
)
````

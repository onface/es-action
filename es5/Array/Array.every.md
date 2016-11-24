# Array.prototype.every(callback[, thisArg])

> 建议先阅读文档 [Array.prototype.every()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

> `every` 方法测试数组的**所有元素**是否都通过了指定函数的测试。

> `every` 不会改变原数组。

`every` 最适合校验一组数据是否全部通过函数测试


````js
var data = [
	{
		id: 1,
		name: 'a',
		// 试一试将这里的 check 改为 true 查看 isCheckAll 的结果
		check: false
	},
	{
		id: 2,
		name: 'b',
		check: true
	},
	{
		id: 3,
		name: 'c',
		check: true
	}
]
var isCheckAll = data.every(function (item, index, array) {
	if (item.check === true) {
		return true
    }
    else {
    	return false
    }
})
console.log('isCheckAll', isCheckAll)	// false
````

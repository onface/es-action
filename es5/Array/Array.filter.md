# Array.prototype.filter(callback[, thisArg])

> 建议先阅读文档 [Array.prototype.filter()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

**filter 不会改变原数组**

````js
console.info('filter 不会改变原数组')
var names = ['nimo', 'judy', 'nico']
var newNames = names.filter(function (value, index, array) {
    // 删除 nico
    if (value === 'nico') {
        return false
    }
    else {
        return true
    }
})
console.log('names', names)         // ["nimo", "judy", "nico"]
console.log('newNames', newNames)   // ["nimo", "judy"]
````

## 遍历时修改原数组

> filter 遍历的元素范围在第一次调用 callback 之前就已经确定了。在调用 filter 之后被添加到数组中的元素不会被 filter 遍历到。如果已经存在的元素被改变了，则他们传入 callback 的值是 filter 遍历到它们那一刻的值。被删除或从来未被赋值的元素不会被遍历到。

**遍历的元素范围在第一次调用 callback 之前就已经确定了 **
````js
console.info('\n遍历的元素范围在第一次调用 callback 之前就已经确定了')
var country = ['China', 'America', 'Shambhala']
var newCountry = country.filter(function callback (value, index, array) {
    // 可通过 array 给原数组添加数据
    // 但 filter 只遍历 callback 之前的 country
    // country filter value: *** 不会打印时间戳
    array.push(new Date().getTime())
    console.log('country filter value:', value)
    if (value === 'Shambhala') {
        return true
    }
    else {
        return false
    }
})
console.log('newCountry', newCountry)   // ["China", "America"]
console.log('country', country)         // ["China", "America", "Shambhala", 1479865512679, 1479865512679, 1479865512680]
````

** 遍历时 array 被修改 **

````js
console.info('\n遍历时 array 被修改')
var lang = ['Chinese', 'English', 'French']
var newLang = lang.filter(function (value, index, array) {
    console.log('lang filter value:', value)
    if (value === 'English') {
        array[index + 1] = 'English next item ' + array[index + 1]
    }
    return true
})
console.log('newLang', newLang)    // newLang ["Chinese", "English", "English next item French"]
````

## 删除数字某一项

````js
console.info('\n删除数字某一项')
var delFilter = function (value) {
    if (value === 'DELETE_PLACEHOLDER') {
        return false
    }
    else {
        return true
    }
}
var ids = ['000--350000200509193383', '111--440000201007271296', '222--450000200112271471', '333-120000197110291785']
ids[2] = 'DELETE_PLACEHOLDER'
ids = ids.filter(delFilter)
console.log('ids', ids)        // ids ["000--350000200509193383", "111--440000201007271296", "333-120000197110291785"]
````


## thisArg 的作用

关于 thisArg 如果你觉得有什么好的实践，欢迎 PR 你的代码。

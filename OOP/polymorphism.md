# 多态 - polymorphism

> 多态：同一操作作用于不同的对象，可以有不同的解释，产生不同的执行结果。


JavaScript “天生”就支持多态

> 多态最根本好处在于，你不必向对象询问“你是什么类型” 后根据得到的答案调用对象的某个行为。你只管调用该行为。
>《重构：改善既有代码的设计》Martin Fowler

````js
var action = function (people) {
    if (typeof people.work === 'function') {
        people.work()
    }
}
// 演员
var Actor = function (name) {
    this.name = name
    this.work = function () {
        console.log(this.name + ': 表演')
    }
}
// 摄影师
var Photographer = function (name) {
    this.name = name
    this.work = function () {
        console.log(this.name + ': 拍摄演员')
    }
}
// 流浪汉
var Tramp = function (name) {

}
var peoples = [
    new Actor('nimo'),
    new Photographer('judy'),
    new Tramp('anonymous')
]
peoples.forEach(function (item) {
    action(item)
})
// nimo: 表演
// judy: 拍摄演员
````

# private&public

````html
<!-- https://github.com/Automattic/expect.js -->
<script src="/static/expect.js"></script>
````

> 阅读本章前应对JavaScript面向对象有一定了解。推荐阅读:[Javascript 面向对象编程（一）：封装](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)

> 本章先介绍一些关键的基础知识，然后开发一个面向对象的弹出框说明日常工作中何时使用 `prototype`

## constructor&prototype

通过构造函数可以创建对象，并且创建的对象可以访问构造函数的 `prototype`。

````js
var Dog = function (settings) {
    this.name = settings.name
    this.onBrak = settings.onBrak
}
Dog.prototype.create = function () {
    this.constructor.prototype.amount ++
}
Dog.prototype.amount = 0
Dog.prototype.bark = function () {
    this.onBrak()
    return '汪汪'
}
var jim = new Dog({
    name: 'jim',
    onBrak: function() {console.log('jim bark')}
})
jim.create()
expect(jim.bark()).equal('汪汪')
expect(jim.name).equal('jim')
expect(jim.amount).equal(1)

var sam = new Dog({
    name: 'sam',
    onBrak: function() {console.log('sam bark')}
})
sam.create()
expect(sam.bark()).equal('汪汪')
expect(sam.name).equal('sam')
expect(sam.amount).equal(2)
expect(jim.amount).equal(2)
````

后文中将构造函数创建的对象称之为**实例**。实例的 `constructor` 属性可以访问到构造函数

````js
expect(jim.constructor).equal(Dog)
````

而通过实例的 `constructor` 可以访问到构造函数的 `prototype`

````js
expect(jim.constructor.prototype).equal(Dog.prototype)
````

通过 `constructor.prototype.constructor` 可以访问到构造函数

````js
expect(jim.constructor.prototype.constructor).equal(Dog).equal(jim.constructor)
````

`constructor.prototype.constructor` 这种关系就像

````js
var nimo = {name: 'nimo'}
var judy = {name: 'judy'}

nimo.wife = judy
judy.husband = nimo
````

**关键知识：**  
1. 通过构造函数创建的实例可通过 `constructor` 访问到构造函数
2. 构造函数的 `prototype` 属性的 `constructor` 指向的是构造函数自身


## 私有属性/方法和公有属性/方法

`prototype` 定义公有属性/方法，构造函数和公有方法中 `this.**` 定义私有属性和私有方法。

- 私有属性： `jim.name` `sam.name`
- 私有方法： `jim.onBrak()` `jim.onBrak()`
- 公有属性： `jim.amount` `sam.amount`
- 公有方法 `jim.bark() jim.create()` `sam.bark() sam.create()`

## Dialog

几乎每个项目中都要用到弹窗

弹窗的接口大概是这样的：

````js
````

弹窗的技术实现思路如下：

```
```

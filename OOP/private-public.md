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

`prototype` 定义公有属性/方法，`this.**` 定义私有属性和私有方法。

- 私有属性： `jim.name` `sam.name`
- 私有方法： `jim.onBrak()` `jim.onBrak()`
- 公有属性： `jim.amount` `sam.amount`
- 公有方法 `jim.bark() jim.create()` `sam.bark() sam.create()`

## dialog

几乎每个项目中都要用到弹窗

### 调用

````html
<button id="btn1-show">click</button>
<button id="btn1-changeContent">change content</button>
````

<!--
{
    runTimeout: 100,
    afterCode: 'window.dialog1 = dialog1;'
}
-->
````js
var dialog1 = new Dialog({
    content: 'abc'
})
dialog1.onClose(function() {
    console.log(this.content)
    console.log('close')
})
document.getElementById('btn1-show').onclick = function () {
    dialog1.show()
}
document.getElementById('btn1-changeContent').onclick = function () {
    dialog1.setContent('123')
    dialog1.show()
}
````

### 初步实现

- 私有属性： `content` `dom` `settings`
- 私有方法：`closeCallbacks`
- 公有方法： `render` `show` `setContent` `hide` `onClose`。

````css
.j-dialog {
    width:400px;
    padding:10px;
    background-color:#eee;
    border-radius: 5px;
    position: fixed;
    left:50%;
    top:50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 10px rgba(1,1,1,.3);
}
.j-dialog-close {
    color:red;
    cursor: pointer;
    float: right;
}
````

````js
var Dialog = function (settings) {
    // 扩展默认属性
    var defaultSettings = {
        content: '',
        close: 'x'
    }
    for(var key in settings) {
        defaultSettings[key] = settings[key]
    }
    settings = defaultSettings
    var self = this
    self.settings = settings
    self.content = settings.content
    self.constructor.prototype.render.apply(self)
    self.closeCallbacks = []
}
Dialog.prototype.render = function () {
    var self = this
    var settings = self.settings
    self.dom = {
        wrap: document.createElement('div'),
        close: null,
        bd: null
    }
    self.dom.wrap.setAttribute('class', 'j-dialog')

    self.dom.close = document.createElement('span')
    self.dom.close.setAttribute('class', 'j-dialog-close')
    self.dom.close.innerHTML = settings.close
    self.dom.wrap.appendChild(self.dom.close)

    self.dom.bd = document.createElement('div')
    self.dom.bd.setAttribute('class', 'j-dialog-bd')
    self.dom.bd.innerHTML = self.content
    self.dom.wrap.appendChild(self.dom.bd)
    self.dom.wrap.style.display = 'none'
    document.body.appendChild(self.dom.wrap)
    self.dom.close.onclick = function () {
        self.constructor.prototype.hide.apply(self)
    }
}
Dialog.prototype.show = function () {
    var self = this    
    self.dom.wrap.style.display = 'block'
}
Dialog.prototype.hide = function () {
    var self = this    
    self.dom.wrap.style.display = 'none'
    self.closeCallbacks.forEach(function (callback) {
        callback.apply(self)
    })
}
Dialog.prototype.setContent = function (content) {
    var self = this    
    self.content = content
    self.dom.bd.innerHTML = self.content
}
Dialog.prototype.onClose = function (callback) {
    var self = this
    self.closeCallbacks.push(callback)
}
````

### 公有属性 Dialog.prototype.zIndex

初步实现的代码在解决多个弹窗时候会出现bug

````html
<button id="btn2-first" >先点击我</button>
<button id="btn2-last" >再点击我</button>
````
<!--{
    afterCode: 'window.dialogOne = dialogOne;window.dialogTwo = dialogTwo;'
}-->
````js
var dialogOne = new Dialog({
    content: '露气寒光集，微阳下楚丘。猿啼洞庭树，人在木兰舟。广泽生明月，苍山夹乱流。云中君不见，竟夕自悲秋。离原上草，一岁一枯荣。野火烧不尽，春风吹又生。远芳侵古道，晴翠接荒城。又送王孙去，萋萋满别情。'
})
var dialogTwo = new Dialog({
    content: '天秋月又满，城阙夜千重。还作江南会，翻疑梦里逢。风枝惊暗鹊，露草覆寒虫。羁旅长堪醉，相留畏晓钟。'
})

document.getElementById('btn2-first').onclick = function () {
    dialogTwo.show()
}
document.getElementById('btn2-last').onclick = function () {
    dialogOne.show()
}
````

`dialogOne` 显示时无法罩住 `dialogTwo` ，因为 `dialogTwo.dom.wrap` 后插入 `<body>` 。可以利用 CSS 的 `zIndex` 指定元素显示在上面。

增加一个 **公有属性** `prototype.zIndex`，在 `prototype.show()` 被调用时递增 `prototype.zIndex` 并设置为 `this.dom.wrap` 的 `zIndex`值。

````js
var Modal = function (settings) {
    // 扩展默认属性
    var defaultSettings = {
        content: '',
        close: 'x'
    }
    for(var key in settings) {
        defaultSettings[key] = settings[key]
    }
    settings = defaultSettings
    var self = this
    self.settings = settings
    self.content = settings.content
    self.constructor.prototype.render.apply(self)
    self.closeCallbacks = []
}
// !!!!!!!!!!!!!!!!!!!!!
Modal.prototype.zIndex = 1000
// !!!!!!!!!!!!!!!!!!!!!
Modal.prototype.show = function () {
    var self = this    
    self.dom.wrap.style.display = 'block'
    // !!!!!!!!!!!!!!!!!!!!
    this.constructor.prototype.zIndex = this.constructor.prototype.zIndex + 1
    self.dom.wrap.style.zIndex = this.constructor.prototype.zIndex
    // !!!!!!!!!!!!!!!!!!!!!
}
Modal.prototype.render = function () {
    var self = this
    var settings = self.settings
    self.dom = {
        wrap: document.createElement('div'),
        close: null,
        bd: null
    }
    self.dom.wrap.setAttribute('class', 'j-dialog')

    self.dom.close = document.createElement('span')
    self.dom.close.setAttribute('class', 'j-dialog-close')
    self.dom.close.innerHTML = settings.close
    self.dom.wrap.appendChild(self.dom.close)

    self.dom.bd = document.createElement('div')
    self.dom.bd.setAttribute('class', 'j-dialog-bd')
    self.dom.bd.innerHTML = self.content
    self.dom.wrap.appendChild(self.dom.bd)
    self.dom.wrap.style.display = 'none'
    document.body.appendChild(self.dom.wrap)
    self.dom.close.onclick = function () {
        self.constructor.prototype.hide.apply(self)
    }
}
Modal.prototype.hide = function () {
    var self = this    
    self.dom.wrap.style.display = 'none'
    self.closeCallbacks.forEach(function (callback) {
        callback.apply(self)
    })
}
Modal.prototype.setContent = function (content) {
    var self = this    
    self.content = content
    self.dom.bd.innerHTML = self.content
}
Modal.prototype.onClose = function (callback) {
    var self = this
    self.closeCallbacks.push(callback)
}
````


````html
<button id="btn3-first" >先点击我</button>
<button id="btn4-last" >再点击我</button>
````


````js
var modalOne = new Modal({
    content: '露气寒光集，微阳下楚丘。猿啼洞庭树，人在木兰舟。广泽生明月，苍山夹乱流。云中君不见，竟夕自悲秋。离原上草，一岁一枯荣。野火烧不尽，春风吹又生。远芳侵古道，晴翠接荒城。又送王孙去，萋萋满别情。'
})
var modalTwo = new Modal({
    content: '天秋月又满，城阙夜千重。还作江南会，翻疑梦里逢。风枝惊暗鹊，露草覆寒虫。羁旅长堪醉，相留畏晓钟。'
})

document.getElementById('btn3-first').onclick = function () {
    modalTwo.show()
}
document.getElementById('btn4-last').onclick = function () {
    modalOne.show()
}
````

**灵活使用面向对象的**私有**属性/方法和**公有**属性/方法，可解决工作中很多问题。**

推荐阅读：[继承](./extends.md)

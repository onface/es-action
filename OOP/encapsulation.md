# 封装 - encapsulation

## 封装数据

````js
var zIndex = (function () {
    var _zIndexCount = 0
    return function (text) {
        _zIndexCount ++
        return _zIndexCount
    }
})()
console.log(
    zIndex()  // 1
)
console.log(
    zIndex() // 2
)
````
## 封装生成div的代码

````js
var dialog = (function () {
    var _zindex = 0
    return function (text) {
        _zindex ++
        console.log('<div style="z-index:' + _zindex + ';" >' + text + '</div>')
    }
})()

dialog('nimo')  //<div style="z-index:1;" >nimo</div>

dialog('judy') // <div style="z-index:2;" >judy</div>
````

## 构造函数封装

````js
var Dialog = function (text) {
    // 私有属性
    this.text = text
}
// 公有方法
Dialog.prototype.show = function () {
    this.constructor.prototype._zIndex = this.constructor.prototype._zIndex + 1
    console.log('<div style="z-index:' + this.constructor.prototype._zIndex + ';" >' + this.text +'</div>')
}
// 公有属性
Dialog.prototype._zIndex = 0
var aDialog = new Dialog('a')
var bDialog = new Dialog('b')
aDialog.show()  // <div style="z-index:1;" >a</div>
bDialog.show()  // <div style="z-index:2;" >b</div>
aDialog.show() // <div style="z-index:1;" >a</div>
````

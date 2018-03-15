# async

````js
function loadPhoto(src) {
    return new Promise(function (resolve, reject) {
        var img = new Image()
        img.onload = function () { resolve(img) }
        img.onerror = function () { reject(`${src} loading fail`) }
        img.src = src
    })
}

const read = async function (settings) {
    const photo = await loadPhoto(settings.src)
    const blurPhoto = await loadPhoto(settings.addBlur(photo.src))
    var photoCode = settings.transCode(blurPhoto.src)
    console.log(photoCode)
}

read({
    src: 'https://picsum.photos/130/80',
    addBlur: function (src) {
        return `${src}?blur`
    },
    transCode: function (src) {
        return `<img class="photo" src="${src}"/>`
    }
}) // <img class="photo" src="https://picsum.photos/130/80?blur"/>
````

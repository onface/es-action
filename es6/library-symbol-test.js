// library-symbol-test.js
;(function () {
    if (typeof window[Symbol.for('dialog-running-already')] !== 'undefined') {
        return
    }
    window[Symbol.for('dialog-running-already')] = true
    console.log('running dialog')
})()

/*
 * mose(Mock Server)
 * Homepage: http://www.mosejs.org
 */
var mose = require('mose')
var app = mose({
    name: 'es56-action',
    root: __dirname,
    static: './output'
})

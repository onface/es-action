/*
 * mose(Mock Server)
 * Homepage: http://www.mosejs.org
 */
var mose = require('mose')
var open = require('open')
open('http://127.0.0.1:' + 49144)
var app = mose({
    name: 'es56-action',
    port: 49144,
    root: __dirname,
    static: './output'
})

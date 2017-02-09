fis.hook(require('fis3-hook-relative'));
var path = require('path')
var markrun = require('markrun')
fis.match('**', {
  relative: true
})
var babel = require('babel-core');
fis.match('{*.js,*.md:js}', {
    parser: function (content, file) {
        return babel.transform(content, {
            presets: [
                'es2015'
            ]
        }).code
    }
})
fis.match('static/**.js', {
    parser:[]
})
fis.match('{server.js,fis-conf.js}', {
    release: false
})
fis.match('*.md', {
    rExt: '.html',
    isHtmlLike: true,
    parser: function (content, file) {
        var html = markrun(content, {
            template: require('fs').readFileSync(path.join(__dirname, '/static/markrun-template.html')).toString(),
            compile: {
                'js': function (source, data, info) {
                    return {
                        lang: 'js',
                        code: fis.compile.partial(source, file, {
                           ext: 'js'
                        })
                    }
                }
            }
        })
        return html
    }
    ,
    postprocessor: function (content, file) {
        var re = /(<a.*?)href=(['"]?)([^'"\s?]+)((\?[^'"\s]*)?)\2([^>]*>)/ig
        return content.replace(re, function(all, prefix, quote, value, query, queryInner, postfix) {
            var f = fis.uri(value)
            if(f.file) {
                var message = {
                    target: f.file.subpath,
                    file: file
                }
                fis.emit('plugin:relative:fetch', message)
                var ret = message.ret
                ret = ret.replace(/README\.md$/i, 'index.html')
                ret = ret.replace(/\.md$/i, '.html')
               all = prefix + 'href=' + quote + ret + query + quote + postfix
            }
            return all
        })
    }
})
fis.match('(**)README.md', {
    release: '$1index'
})

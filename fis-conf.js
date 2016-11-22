fis.hook(require('fis3-hook-relative'));
var path = require('path')
var markrun = require('markrun')
fis.match('**', {
  relative: true
})
fis.match('*.md', {
    rExt: '.html',
    isHtmlLike: true,
    parser: function (content, file) {
        var html = markrun(content, {
            template: require('fs').readFileSync(path.join(__dirname, '/static/markrun-template.html')).toString()
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

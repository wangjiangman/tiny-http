var Util = {
    isWin: process.platform.toLowerCase().indexOf('win') > -1 ? true : false,
    URI2Path: function(uri) {
        uri = url.parse(uri).pathname.replace(/%20/g, ' ');
        var re = /(%[0-9A-Fa-f]{2}){3}/g;
        if (re.test(uri)) {
            //能够正确显示中文，将三字节的字符转换为utf-8编码
            uri = uri.replace(re, function(word) {
                var buffer = new Buffer(3),
                    array = word.split('%');
                array.splice(0, 1);
                array.forEach(function(val, index) {
                    buffer[index] = parseInt('0x' + val, 16);
                });
                return buffer.toString('utf8');
            });
        }
        return uri;
    },
    getIPAdress: function() {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        return '127.0.0.1'; //如果没有找到IP，则返回127.0.0.1
    },
    proxy: function(func, context) {
        return function() {
            return func.apply(context, arguments);
        };
    },
    open: function(path, callback) {
        var child_process = require('child_process');
        //console.log('browse ' + path + '\n');
        var cmd = path.replace(/"/g, '""');
        if (this.isWin) {
            cmd = 'start "" ' + cmd;
        } else {
            if (process.env['XDG_SESSION_COOKIE']) {
                cmd = 'xdg-open ' + cmd;
            } else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
                cmd = 'gnome-open ' + cmd;
            } else {
                cmd = 'open ' + cmd;
            }
        }
        child_process.exec(cmd, callback);
    }
};

var File = {
    writeFile: function(fileName, content) {
        fs.writeFile(fileName, content, function(err) {
            if (err) throw err;
        });
    },
    rmFile: function(fileName) {
        if (Util.isWin) {
            require('child_process').exec('del /f /s /q ' + path.join(__dirname, fileName));
        } else {
            require('child_process').exec('rm -f ' + path.join(__dirname, fileName));
        }
    }
};

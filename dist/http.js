;/*!/http/require.js*/
'use strict';
var http = require('http'),
    url = require('url'),
    path = require('path'),
    child_process = require('child_process'),
    fs = require('fs');
;/*!/http/conf.js*/
var Conf = function() {
    var conf = {
        LIST_DIR: true,//是否显示目录
        CACHE: 'no-cache',
        DEFAULT_INDEX: ['index.html', 'index.htm', 'index.asp', 'index.php', 'index.json', 'index.txt', 'index.njs'],//默认首页索引
        EXTEND_EXT: '.njs',//扩展后缀
        MAX_QUEUE_LENGTH: 20,

        /*允许用于并发处理CGI的最大进程数,为了避免主进程阻塞，CGI使用子进程处理，CGI会进入一个等待队列，等待执行，进程越多，并发处理能力越强，但系统资源占用越多*/

        //以下设置无需配置
        WEB_ROOT: null,
        PORT: null,
        IP: null,
        WORKING_DIR: __dirname,
        process: {length :0},
        
    };
    return conf;
};

;/*!/http/mime.js*/
var Mime={lookupExtension:function(a,t){return this.TYPES[a.toLowerCase()]||t||"text/plain"},TYPES:{".3gp":"video/3gpp",".a":"application/octet-stream",".ai":"application/postscript",".aif":"audio/x-aiff",".aiff":"audio/x-aiff",".appcache":"text/manifest",".asc":"application/pgp-signature",".asf":"video/x-ms-asf",".asm":"text/x-asm",".asp":"text/html",".php":"text/html",".asx":"video/x-ms-asf",".atom":"application/atom+xml",".au":"audio/basic",".avi":"video/x-msvideo",".bat":"application/x-msdownload",".bin":"application/octet-stream",".bmp":"image/bmp",".bz2":"application/x-bzip2",".c":"text/x-c",".cab":"application/vnd.ms-cab-compressed",".cc":"text/x-c",".chm":"application/vnd.ms-htmlhelp",".class":"application/octet-stream",".com":"application/x-msdownload",".conf":"text/plain",".cpp":"text/x-c",".crt":"application/x-x509-ca-cert",".css":"text/css",".csv":"text/csv",".cxx":"text/x-c",".deb":"application/x-debian-package",".der":"application/x-x509-ca-cert",".diff":"text/x-diff",".djv":"image/vnd.djvu",".djvu":"image/vnd.djvu",".dll":"application/x-msdownload",".dmg":"application/octet-stream",".doc":"application/msword",".dot":"application/msword",".dtd":"application/xml-dtd",".dvi":"application/x-dvi",".ear":"application/java-archive",".eml":"message/rfc822",".eps":"application/postscript",".exe":"application/x-msdownload",".f":"text/x-fortran",".f77":"text/x-fortran",".f90":"text/x-fortran",".flv":"video/x-flv",".for":"text/x-fortran",".gem":"application/octet-stream",".gemspec":"text/x-script.ruby",".gif":"image/gif",".gz":"application/x-gzip",".h":"text/x-c",".hh":"text/x-c",".htm":"text/html",".html":"text/html",".ico":"image/vnd.microsoft.icon",".ics":"text/calendar",".ifb":"text/calendar",".iso":"application/octet-stream",".jar":"application/java-archive",".java":"text/x-java-source",".jnlp":"application/x-java-jnlp-file",".jpeg":"image/jpeg",".jpg":"image/jpeg",".js":"application/javascript;charset=utf-8",".json":"application/json",".log":"text/plain;charset=utf-8",".m3u":"audio/x-mpegurl",".m4v":"video/mp4",".man":"text/troff",".manifest":"text/cache-manifest",".mathml":"application/mathml+xml",".mbox":"application/mbox",".mdoc":"text/troff",".me":"text/troff",".mid":"audio/midi",".midi":"audio/midi",".mime":"message/rfc822",".mml":"application/mathml+xml",".mng":"video/x-mng",".mov":"video/quicktime",".mp3":"audio/mpeg",".mp4":"video/mp4",".mp4v":"video/mp4",".mpeg":"video/mpeg",".mpg":"video/mpeg",".ms":"text/troff",".msi":"application/x-msdownload",".odp":"application/vnd.oasis.opendocument.presentation",".ods":"application/vnd.oasis.opendocument.spreadsheet",".odt":"application/vnd.oasis.opendocument.text",".ogg":"application/ogg",".p":"text/x-pascal",".pas":"text/x-pascal",".pbm":"image/x-portable-bitmap",".pdf":"application/pdf",".pem":"application/x-x509-ca-cert",".pgm":"image/x-portable-graymap",".pgp":"application/pgp-encrypted",".pkg":"application/octet-stream",".pl":"text/x-script.perl",".pm":"text/x-script.perl-module",".png":"image/png",".pnm":"image/x-portable-anymap",".ppm":"image/x-portable-pixmap",".pps":"application/vnd.ms-powerpoint",".ppt":"application/vnd.ms-powerpoint",".ps":"application/postscript",".psd":"image/vnd.adobe.photoshop",".py":"text/x-script.python",".qt":"video/quicktime",".ra":"audio/x-pn-realaudio",".rake":"text/x-script.ruby",".ram":"audio/x-pn-realaudio",".rar":"application/x-rar-compressed",".rb":"text/x-script.ruby",".rdf":"application/rdf+xml",".roff":"text/troff",".rpm":"application/x-redhat-package-manager",".rss":"application/rss+xml",".rtf":"application/rtf",".ru":"text/x-script.ruby",".s":"text/x-asm",".sgm":"text/sgml",".sgml":"text/sgml",".sh":"application/x-sh",".sig":"application/pgp-signature",".snd":"audio/basic",".so":"application/octet-stream",".svg":"image/svg+xml",".svgz":"image/svg+xml",".swf":"application/x-shockwave-flash",".t":"text/troff",".tar":"application/x-tar",".tbz":"application/x-bzip-compressed-tar",".tcl":"application/x-tcl",".tex":"application/x-tex",".texi":"application/x-texinfo",".texinfo":"application/x-texinfo",".text":"text/plain",".tif":"image/tiff",".tiff":"image/tiff",".torrent":"application/x-bittorrent",".tr":"text/troff",".txt":"text/plain",".vcf":"text/x-vcard",".vcs":"text/x-vcalendar",".vrml":"model/vrml",".war":"application/java-archive",".wav":"audio/x-wav",".wma":"audio/x-ms-wma",".wmv":"video/x-ms-wmv",".wmx":"video/x-ms-wmx",".wrl":"model/vrml",".wsdl":"application/wsdl+xml",".xbm":"image/x-xbitmap",".xhtml":"application/xhtml+xml",".xls":"application/vnd.ms-excel",".xml":"application/xml",".xpm":"image/x-xpixmap",".xsl":"application/xml",".xslt":"application/xslt+xml",".yaml":"text/yaml",".yml":"text/yaml",".zip":"application/zip"}};
;/*!/http/api.js*/
var Api = {
    resolve: function(filepath) {
        if (/^[\\/]/.test(filepath)) {
            return path.join(conf.WEB_ROOT, filepath);
        } else {
            return path.join(__dirname, filepath);
        }
    },
    read: function(file) {
        //console.log(__filename);
        return fs.readFileSync(this.resolve(file));
    },
    write: function(file, content) {
        var type = Object.prototype.toString.call(content);
        if (type === '[object Object]' || type === '[object Array]') {
            content = JSON.stringify(content);
        } else if (type === '[object Function]') {
            content = content.toString();
        }
        return fs.writeFileSync(this.resolve(file), content);
    },
    parse: function(content) {
        return require('querystring').parse(content);
    },
    end: function(data) {
        
    }
};
Object.defineProperty(global, 'TH', {//定义全局变量TH,并设置为只读，防止误修改
    enumerable: true,
    writable: false,
    value: Api
});

;/*!/http/cgi.js*/
var Cgi = function(script, request, response, conf) {
    if (!(script && request && response)) {
        console.log('Cgi request is invalid!');
    }

    var self = this;
    this.script = script;
    this.request = request;
    this.response = response;


    var _TH = (function() {
        var __TH = {};
        for (var p in TH) {
            __TH[p] = TH[p];
        }
        __TH.resolve = function(script) {
            var args = arguments;
            if (/^[\\/]/.test(script)) {
                script = path.join(conf.WEB_ROOT, script);
            } else {
                script = path.join(path.dirname(self.script), script);
            }
            return script;
        };
        __TH._forked = true;
        return __TH;
    }());

    var _require = (function() {
        var __require = function(script) {
            //console.log('script:' + script);
            var args = arguments;
            if (/^[\\/]/.test(script)) {
                args[0] = path.join(conf.WEB_ROOT, script);
            } else if (script.charAt(0) === '.') {
                args[0] = path.join(path.dirname(self.script), script);
            }
            return require.apply(this, args);
        };

        for (var p in require) {
            __require[p] = require[p];
        }
        __require._forked = true;
        return __require;
    }());

    function parseFunction(func) {
        func = func.toString();
        return {
            args: func.substring(func.indexOf('(') + 1, func.indexOf(')')).replace(/\s+/g, '').split(','),
            code: func.slice(func.indexOf('{') + 1, func.lastIndexOf('}'))
        };
    }

    this.do = function(data) {
        if (conf.process.length >= conf.MAX_QUEUE_LENGTH) { //如果队列已满，等待
            console.log(new Date().toString() + ': Cgi process queue overflow!!!  waitting...');
            setTimeout(function() {
                this.do(data);
            }.bind(this), 100);

            return;
        }

        this.process = child_process.fork(__filename, ['*cgi*', this.script]);
        //CGI使用子进程执行，防止CGI阻塞主进程

        //console.log(this.request);
        this.process.send({
            method: this.request.method,
            url: this.request.url,
            headers: this.request.headers,
            data: data
        });

        conf.process.length++;


        request.on('close', function() {
            //console.log(self.process.pid);
            self.process.kill();
        });

        this.process.on('message', function(msg) {
            self.request.resume();//恢复数据传送
            if (msg.contentType === 'function') {
                var func = parseFunction(msg.content);
                var args = func.args.slice(0);
                args.push('require');
                args.push('TH');
                args.push('done');
                args.push('__initEnvironment'); //修正一些内置全局变量
                args.push('__initEnvironment();try {' + func.code + '\n} catch (e) {arguments[1].writeHead(501);arguments[1].end("Internal error");console.log("\\n`' + self.script.replace(/\\/g, '\\\\') + '` has error:\\n\\n"  + e.stack + "\\n");return;}');

                var ret = Function.apply(self, args);

                ret(self.request, self.response, msg.data, _require, _TH,
                    function(data) {
                        self.response.writeHead(200);
                        self.response.end(data);
                    }, (function(_filename, _dirname) {
                        return function() {//通过initEnvironment调用
                            global.__filename = _filename;
                            global.__dirname = _dirname;
                        }
                    })(self.script, path.dirname(self.script))
                );

            } else if (msg.contentType === 'object') {
                //console.log(msg);
                self.response.writeHead(200, {
                    'content-type': 'text/json'
                });
                self.response.end(JSON.stringify(msg.content));
            } else if (msg.contentType === 'error') {
                self.response.writeHead(501, {
                    'content-type': 'text/plain'
                });
                self.response.end(msg.content);
            } else { // (msg.contentType === 'string' || msg.contentType === 'number') {
                self.response.writeHead(200, {
                    'content-type': 'text/html'
                });
                self.response.end(msg.content.toString());
            }

        });

        this.process.on('exit', function() {
            conf.process.length--;
        });
    };


    if (this.request.method === 'POST') {

        if (this.request.headers['content-type'].indexOf('multipart') > -1) {
            this.request.pause();//如果是上传文件之类的操作，先暂停上传，等子cgi fork起来之后再处理
            this.do();
        } else {
            var tmpData = '';
            this.request.on('data', function(chunk) {
                tmpData += chunk;
            });
            this.request.on('end', function() {
                self.do(tmpData);
            });
        }

    } else {
        this.do();
    }
};

;/*!/http/server.js*/
var RequestHandle = function(request, response, conf) {
    this.conf = conf;
    this.request = request;
    this.response = response;
    this.uri = Util.URI2Path(request.url);
    this.url = url.parse(request.url);
    this.filename = path.join(this.conf.WEB_ROOT, this.uri);
    this.handle(this.filename, this.conf.EXTEND_EXT);
};

RequestHandle.prototype = {
    constructor: RequestHandle,
    handle: function(pathname, ext) {
        this.filename = pathname;
        if (pathname === __filename) { //禁止查看自己
            this.goTo403();
            return;
        };

        fs.lstat(pathname, function(err, stat) {
            if (err) {
                if (!ext) {
                    this.goTo404();
                } else {
                    this.handle(path.join(pathname, ext));
                }
            } else {
                if (stat.isDirectory()) {
                        var lastChar = this.uri.slice(-1);
                        if (!(lastChar === '/' || lastChar === '\\')) {//自动修正网址
                            var rUrl = this.url.pathname + '/';
                            if (this.url.search) rUrl += this.url.search;
                            this.goTo301(rUrl);
                            return;
                        }
                    
                    this.searchDefaultIndex(pathname, this.conf.DEFAULT_INDEX.slice(0));
                } else {
                    this.readFile();
                }
            }
        }.bind(this));
    },
    listDirectory: function(parentDirectory, res) {
        if (!this.conf.LIST_DIR) {
            this.goTo403();
            return;
        }
        fs.readdir(parentDirectory, function(error, files) {
            if (error) {
                this.goToError(500, 'Readdir error!');
                return;
            }
            var body = this.showDirectory(parentDirectory, files);
            res.writeHead(200, {
                'Content-Type': 'text/html;charset=utf-8',
                'Content-Length': Buffer.byteLength(body, 'utf8'),
                'Server': 'NodeJS ' + process.version
            });
            res.write(body, 'utf8');
            res.end();
        }.bind(this));
    },
    searchDefaultIndex: function(basedir, files) { //遍历默认首页
        var file = files.shift();
        if (!file) {
            this.listDirectory(basedir, this.response);
            return;
        }
        this.filename = path.join(basedir, file);
        fs.exists(this.filename, function(exists) {
            if (exists) {
                this.readFile();
            } else {
                this.searchDefaultIndex(basedir, files);
            }
        }.bind(this));
    },
    showDirectory: function(parent, files) {
        var template = "<!doctype html>\r\n<html>\r\n\r\n<head>\r\n    <meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\"></meta>\r\n    <title>NodeJS Server</title>\r\n</head>\r\n\r\n<body>\r\n    <ul>\r\n        {%list%}\r\n    </ul>\r\n</body>\r\n";

        var res = [];
        res.push('<li><a href="../"><strong>../</strong></a></li>');
        files.forEach(function(val) {
            var stat; try {stat = fs.statSync(path.join(parent, val));} catch (e) {return}
            if (stat.isDirectory(val)) {
                val = path.basename(val) + '/';
                res.push('<li><a href="' + val + '"><strong>' + val + '</strong></a></li>');
            } else {
                val = path.basename(val);
                res.push('<li><a href="' + val + '">' + val + '</a></li>');
            }
        });
        res.push('</ul>');

        return template.replace(/\{\%list\%\}/, res.join(''));
    },
    readFile: function() { //读取文件
        var mime;
        if (path.extname(this.filename) !== this.conf.EXTEND_EXT) {
            fs.readFile(this.filename, function(err, content) {
                if (err) {
                    this.response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    this.response.end(err + '\n');
                    return;
                }
                this.response.writeHead(200, {
                    'Content-Type': mime = Mime.lookupExtension(path.extname(this.filename)),
                    'Cache-Control': this.conf.CACHE || this.request.headers['cache-control'] || 'no-cache'
                });
                if (module.exports.middleHandle) {
                    content = module.exports.middleHandle(content, {
                        request: this.request,
                        response: this.response,
                        mime: mime,
                        conf: this.Conf
                    });
                }
                this.response.end(content);
            }.bind(this));
        } else {
            new Cgi(this.filename, this.request, this.response, this.conf);
        }
    },
    goToError: function(num, text) {
        this.response.writeHead(num, {
            'Content-Type': 'text/plain'
        });
        this.response.end(text + '\n');
    },
    goTo301: function(path) {
        this.response.writeHead(301, {
            Location: path
        });
        this.response.end();
    },
    goTo403: function() {
        this.response.writeHead(403, {
            'Content-Type': 'text/plain'
        });
        this.response.end('403 Forbidden\n');
    },
    goTo404: function() {
        this.response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        this.response.end('404 Not Found\n');
    }
};

var Server = function() {
    this.instance = null;
    this.conf = new Conf();
};


Server.prototype = {
    constructor: Server,
    createServer: function() {
        this.instance = http.createServer(
            Util.proxy(function(request, response) {
                if (module.exports.preHandle) {
                    var ret = module.exports.preHandle(request, response);
                    if (ret === false) return;
                }
                new RequestHandle(request, response, this.conf);
            }, this)
        );

        this.instance.listen(this.conf.PORT);
    },
    initConf: function(port, webroot, conf) {
        port = +port || 80;
        webroot = webroot || '';
        conf = conf || {};

        this.conf.IP = conf.ip || '127.0.0.1';
        this.conf.WEB_ROOT = path.resolve(webroot);
        this.conf.PORT = port || 80;
    },
    startBrowser: function() {
        setTimeout(function() {
            Util.open('http://127.0.0.1' + (this.conf.PORT == 80 ? '/' : ':' + this.conf.PORT + '/'), function(err) {
                if (err) {
                    console.log(err);
                    process.exit();
                }
            });
        }.bind(this), 2000);
    },
    init: function(port, webroot, conf) {
        this.initConf(port, webroot, conf);
        this.createServer();
        if (conf.autoOpenBrowser !== false) {
            this.startBrowser();
        }

        console.log('Server running at http://' + this.conf.IP + (this.conf.PORT == 80 ? '' : ':' + this.conf.PORT) + '/');
        console.log('The webroot is: ' + this.conf.WEB_ROOT);
        return this;
    },
    start: function() {
        //参数示例： 
        //node http.js 800 ./dist
        //node http ./dist
        //node http 8080
        //node http
        var port, webroot;
        if (parseInt(process.argv[2], 10) == process.argv[2]) {
            port = process.argv[2];
            webroot = process.argv[3];
        } else {
            port = 80;
            webroot = process.argv[2];
        }

        return this.init(port, webroot, {
            autoOpenBrowser: process.argv[4] ? true : false, //是否自动打开浏览器
            workingDir: __dirname, //工作目录
        });
    }
};

;/*!/http/util.js*/
var Util = {
    isWin: /^win/i.test(process.platform),
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

;/*!/http/index.js*/
module.exports = {
    Server: Server,
    run: function() {
        return new Server().start();
    },
    preHandle: null,
    middleHandle: null
}

if (process.argv[2] === '*cgi*') {//如果是CGI模式，只执行require
    var exportsData = {};//exportsData用于参数传递
    Object.defineProperty({}, 'exportsData', {//将exportsData设置只读，不允许改变其对象类型
        enumerable: true,
        writable: false,
        value: exportsData
    });

    __filename = path.resolve(process.argv[3]);
    __dirname = path.dirname(__filename);

    process.on('message', function(incoming) {//监听主进程message
        var ret = {};
        try {
            ret = require(__filename)(incoming, exportsData, function(ret) {//用于处理异步cgi
                ret = {
                    contentType: typeof ret,
                    content: typeof ret === 'object' ? JSON.stringify(ret) : ret.toString(),
                    data: exportsData
                };
                process.send(ret);//发送返回数据给主进程
                process.disconnect();//断开与主进程的IPC连接 
            });
            if (ret !== false) {
                ret = {
                    contentType: typeof ret,
                    content: typeof ret === 'object' ? JSON.stringify(ret) : ret.toString(),
                    data: exportsData
                };
                process.send(ret);//发送返回数据给主进程
                process.disconnect();//断开与主进程的IPC连接  
            }
        } catch (e) {
            console.log(e.stack);
            ret = {
                contentType: 'error',
                content: 'Internal error'
            }
            process.send(ret);
            process.disconnect();//断开与主进程的IPC连接  
        }      
    })
    return;
}

if (process.mainModule && process.mainModule.filename === __filename) { //如果通过命令行直接启动，则执行start
    new Server().start();
}

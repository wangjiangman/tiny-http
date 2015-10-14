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
                    'Content-Type': Mime.lookupExtension(path.extname(this.filename)),
                    'Cache-Control': this.conf.CACHE || this.request.headers['cache-control'] || 'no-cache'
                });
                if (module.exports.middleHandle) {
                    content = module.exports.middleHandle(content, {
                        request: this.request,
                        response: this.response,
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

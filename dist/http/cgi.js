var Cgi = function(script, request, response, conf) {
    if (!(script && request && response)) {
        console.log('Cgi request is invalid!');
    }

    var self = this;
    this.script = script;
    this.request = request;
    this.response = response;

    var _require = function(script) {//
        //console.log('script:' + script);
        var args = arguments;
        if (/^[\\/]/.test(script)) {
            args[0] = path.join(conf.WEB_ROOT, script);
        } else if (script.charAt(0) === '.') {
            args[0] = path.join(path.dirname(self.script), script);
        }
        console.log(args[0]);
        return require.apply(this, args);
    };
    for(var p in require) {
        _require[p] = require[p];
    }

    function parseFunction(func) {
        func = func.toString();
        return {
            args: func.substring(func.indexOf('(') + 1, func.indexOf(')')).replace(/\s+/g, '').split(','),
            code: func.slice(func.indexOf('{') + 1, func.lastIndexOf('}'))
        };
    }

    this.do = function(data) {
        if (conf.process.length >= conf.MAX_QUEUE_LENGTH) {//如果队列已满，等待
            console.log(new Date().toString() + ': Cgi process queue overflow!!!  waitting...');
            setTimeout(function() {
                this.do(data);
            }.bind(this), 1000);

            return;
        }

        this.process = child_process.fork(__filename, ['*cgi*', this.script]);
        //CGI使用子进程执行，防止CGI阻塞主进程
        
        //console.log(this.request);
        this.process.send({method: this.request.method, url: this.request.url, headers: this.request.headers, data: data});

        conf.process.length++;


        request.on('close', function() {
            //console.log(self.process.pid);
            self.process.kill();
        });

        this.process.on('message', function(msg) {
            //console.log(msg);
            
            if (msg.contentType === 'function') {
                var func = parseFunction(msg.content);
                var args = func.args.slice(0);
                args.push('require');
                args.push('try {\n' + func.code + '\n} catch (e) {console.log("\\n`' + self.script.replace(/\\/g, '\\\\') + '` has error:\\n\\n"  + e + "\\n");}');

                var ret = Function.apply(self, args);
                //console.log(ret.toString());

                ret(self.request, self.response, msg.data, _require);

            } else if (msg.contentType === 'object') {
                //console.log(msg);
                self.response.writeHead(200);
                self.response.end(JSON.stringify(msg.content));
            } else {// (msg.contentType === 'string' || msg.contentType === 'number') {
                self.response.writeHead(200);
                self.response.end(msg.content.toString());
            }

        });

        this.process.on('exit', function() {
            conf.process.length--;
        });
    };


    if (this.request.method === 'POST') {
        var tmpData = '';
        this.request.on('data', function(chunk) {
            tmpData += chunk;
        });
        this.request.on('end', function() {
            self.do(tmpData);
            //tmpData = null;
        });
    } else {
        this.do();
    }
};

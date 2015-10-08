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
    }
};
Object.defineProperty(global, 'TH', {//定义全局变量TH,并设置为只读，防止误修改
    enumerable: true,
    writable: false,
    value: Api
});

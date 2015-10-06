module.exports = function(income, exp) {
    var startTime = Date.now();

    for(var i = 0; i < 5000000000; i++) {
        //do some thing
        i++;
    }//如果长时间无响应，可以适当将时间调小

    var date = new Date().toString();

    //return 'hello world!!!'; // return string
    //return {'date': new Date().toString()};//return符合json规范的obj

    //以上两种形式返回的Status Code指定为200
    //console.log(income);
    exp.date = date;
    exp.income = income;
    exp.timeuse = Date.now() - startTime;

    return function(resquest, response, exp) {//return一个function,可以自己定义response
        //注：function里面的代码会回到主进程执行，所以不要在此执行占CPU代码
        require('/test/sub.js')(resquest.headers);
        console.log(__filename);
        console.log(__dirname);
        response.writeHead(200);

   
        response.write(TH.read('index.html'));
        response.write('post data is:' + exp.income.data + '<br />');
        response.write('post url is:' + exp.income.url + '<br />');
        response.write('headers is:<br>' + require('/test/sub.js')(resquest.headers) + '<br>');
        response.write(exp.date + '<br>total use:' + exp.timeuse + 'ms');
        response.end();
    }
};
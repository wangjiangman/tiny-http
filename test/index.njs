module.exports = function(income, exp) {
    
    //for(var i = 0; i < 5000000000; i++) {}//如果长时间无响应，可以适当将时间调小

    var date = new Date().toString();

    //console.log('hello world');
    //return 'hello world!!!'; // return string
    //return {'date': new Date().toString()};//只能return符合json规范的obj

    //以上两种形式返回的Status Code指定为200
    console.log(income);
    exp.date = date;
    console.log(exp)

    return function(resquest, response, exp) {//也可以return一个function,可以自己定义response
        //注：function里面的代码会回到主进程执行，所以不要在此执行占CPU代码
        //console.log(require('/test/sub.js')());
        response.writeHead(200);

        setTimeout(function() {
            response.end(exp.date);
        }, 100);  
    }
};
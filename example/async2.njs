module.exports = function(income, exp, done) {
    setTimeout(function() {
        done('hello world');
    }, 1000);
    return false;//����false��ʾ���ݻ����첽��ʽ����
};
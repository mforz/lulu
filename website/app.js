var express = require('express');
var proxy = require('http-proxy-middleware');
var app = express();


app.all("*", function(req, res, next) {
  if (req.path !== "/" && !req.path.includes(".")) {
    res.header("Access-Control-Allow-Credentials", true);
    // 这里获取 origin 请求头 而不是用 *
    res.header("Access-Control-Allow-Origin", req.headers["origin"] || "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
  }
  next();
});




let pathProxy = (arr)=>{
    // let re = arr.map(res=>{
        let target,pathRewrite;
        switch(arr){
            case '/it120':
                target = 'https://api.it120.cc/mforz/';
                pathRewrite = {'^/it120':'/'}
            break
            case '/qqmusic':
                target = 'https://u.y.qq.com/';
                pathRewrite = {'^/qqmusic':'/'}
            break
            case '/weather':
                target = 'https://interface.sina.cn/dfz/outside/ipdx/weather.d.html?length=1&air=1&ip=115.159.0.115&callback=';
                pathRewrite = {'^/weather':'/'}
            break
            case '/hotword':
                target = 'http://top.baidu.com/mobile_v2/buzz/hotspot';
                pathRewrite = {'^/hotword':'/'}
            break
            case '/iciba-one':
                target = 'http://open.iciba.com/dsapi/';
                pathRewrite = {'^/iciba-one':'/'}
            break
            case '/iciba-trans':
                target = 'http://dict-co.iciba.com/api/dictionary.php?type=json&key=D9559383FCE4D0AC0AFA9C1C6CBF871D&';
                pathRewrite = {'^/iciba-trans':'/'}
            break
            case '/youdao':
                target = 'http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&';
                pathRewrite = {'^/youdao':'/'}
            break

            default:
                console.log(res)
        }
        return proxy({
            target: target,
            changeOrigin: true,
            pathRewrite: pathRewrite
        })
    // })
    // return re
}

app.use('/it120',pathProxy('/it120'))
app.use('/qqmusic',pathProxy('/qqmusic'))
app.use('/weather',pathProxy('/weather'))
app.use('/hotword',pathProxy('/hotword'))
app.use('/iciba-one',pathProxy('/iciba-one'))
app.use('/iciba-trans',pathProxy('/iciba-trans'))
app.use('/youdao',pathProxy('/youdao'))


app.use(express.static("./"));

// const port = process.env.PORT || 3000;


app.listen(2233, () => {

  console.log(`server running @ http://localhost:2233  如果端口占用 lsof -i tcp:8080 && kill pid`);
});

module.exports = app;
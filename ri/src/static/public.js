//获取cookie
const getCookie =(name)=>{
    let arr
    ,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg)
    if (arr)
        return unescape(arr[2]);
    else
        return null;
}

//设置cookie
const setCookie =(name,value,day=0)=>{
    if (day !== 0) {  //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
        let expires = day * 24 * 60 * 60 * 1000
        ,date = new Date(+new Date() + expires);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
    } else {
        document.cookie = name + "=" + escape(value);
    }
}

//删除cookie
const delCookie = (name)=> {

    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    
    if(name)
        setCookie(name, ' ', -1);
    else
        if (keys) {
            for (let i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
};

//设置localstorage
const setStorage =(name,value)=>{
    if(window.localStorage)
        localStorage.setItem(name, JSON.stringify(value))
    else
        setCookie(name,value)
    return true
}

//获取localstorage
const getStorage =(name)=>{
    if (window.localStorage)
        return JSON.parse(localStorage.getItem(name))
    else
        getCookie(name)
}

//删除localstorage
const delStorage = (name)=>{
    if (window.localStorage)
        name ? localStorage.removeItem(name) : localStorage.clear()
    else
        delCookie(name)
}

//跳转
const goTo = (to,from) =>{
    window.location.href = 'http://'+ window.location.host + to
}

//音频播放
let audio = new Audio()
const tts= (tgt,url)=>{
    //  判断url非空
    if(!tgt && !!url){
        audio.src = url
        audio.play()
        return
    }
    let reg = /[\u4e00-\u9fa5a-zA-Z\d]/g, lan ='en'
    tgt = tgt.match(reg)?tgt.match(reg).join(""):'无法识别和读取';                       // 提取数字汉字字母
    escape(tgt).indexOf("%u")!==-1? lan='zh': lan='en'   // 判断是否为存在汉字
    //
    audio.src=`https://fanyi.baidu.com/gettts?lan=${lan}&text=${tgt}&spd=${lan=='en'?3:5}&source=web`
    audio.play()
    //监听播放完
    // ev = audio.addEventListener('ended',()=>{
    //     ev = null
    // })
}

//手机环境
const isPhone = function(){
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
       return true
    } else {
       return false
    }
}

//定位
const getLocation =()=>{
     if (navigator.geolocation){
            navigator.geolocation.watchPosition((position)=>{
                console.log(position.coords.latitude + "," + position.coords.longitude)
            },(error)=>{
                switch(error.code){
                    case error.PERMISSION_DENIED :
                        console.log("用户拒绝对获取地理位置的请求");
                    break;
                    case error.POSITION_UNAVAILABLE :
                        console.log("位置信息是不可用的");
                    break;
                    case error.TIMEOUT :
                        console.log("请求用户地理位置超时");
                    break;
                    case error.UNKNOWN_ERROR :
                        console.log("未知错误");
                    break;
                    default :
                    break;
                 }
            },
            {timeout:5000})
    }else{
        console.log("该浏览器不支持定位")
    }
}

//获取时间
const getTime = () => {
    const date = new Date()
    const time = {
        year : ('000'+date.getYear()).substr(-2),
        month : ('000'+(date.getMonth()+1)).substr(-2),
        day : ('000'+date.getDate()).substr(-2),
        hours: ('000'+date.getHours()).substr(-2),
        minutes:('000'+date.getMinutes()).substr(-2),
        seconds:('000'+date.getSeconds()).substr(-2),
    }
    return time
}
import color from './color'

export {
    getCookie,
    setCookie,
    delCookie,

    getStorage,
    setStorage,
    delStorage,
    
    goTo,
    tts,
    isPhone,
    getLocation,
    getTime,
    color
}
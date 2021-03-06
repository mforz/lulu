
//获取cookie
const getCookie =(name)=>{
    let arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
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
    let keys = document.cookie.match(/[^ =;]+(?==)/g);
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
    window.location.href = 'http://'+ window.location.host +'#'+ to
}
//音频/文字-播放
const TTS = ()=>{}
TTS.prototype = {
    audio : new Audio(),
    play :function(tgt,url){
        if(!tgt && !!url){
            this.audio.src = url
            this.audio.play()
            return
        }
        let reg = /[\u4e00-\u9fa5a-zA-Z\d]/g, lan ='en'
        tgt = tgt.match(reg)?tgt.match(reg).join(""):'无法识别和读取';                       // 提取数字汉字字母
        escape(tgt).indexOf("%u")!==-1? lan='zh': lan='en'   // 判断是否为存在汉字
        //
        this.audio.src=`https://fanyi.baidu.com/gettts?lan=${lan}&text=${tgt}&spd=${lan==='en'?3:5}&source=web`
        this.audio.play()
        //监听播放完
        // ev = audio.addEventListener('ended',()=>{
        //     ev = null
        // })
    }
}
//浏览环境
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
        month :('000'+(date.getMonth()+1)).substr(-2),
        day :  ('000'+date.getDate()).substr(-2),
        hours: ('000'+date.getHours()).substr(-2),
        minutes:('000'+date.getMinutes()).substr(-2),
        seconds:('000'+date.getSeconds()).substr(-2),
    }
    return time
}
//全屏
const fullScreen =()=>{
    try{
        let el = document.documentElement;
        let rfs= el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        };
    }catch{
        return false
    }
     
}
//内网ip
const getIP=()=> {
    let RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if (RTCPeerConnection){
        var rtc = new RTCPeerConnection({
            iceServers: []
        });
        if (1 || window.mozRTCPeerConnection) {
            rtc.createDataChannel('', {
                reliable: false
            });
        };

        rtc.onicecandidate = function (evt) {
            if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
        };
        rtc.createOffer(function (offerDesc) {
            grepSDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
        }, function (e) {
            console.warn("offer failed", e);
        });
        var addrs = Object.create(null);
        addrs["0.0.0.0"] = false;

        function updateDisplay(newAddr) {
            if (newAddr in addrs) return;
            else addrs[newAddr] = true;
            var displayAddrs = Object.keys(addrs).filter(function (k) {
                return addrs[k];
            });
            for (var i = 0; i < displayAddrs.length; i++) {
                if (displayAddrs[i].length > 16) {
                    displayAddrs.splice(i, 1);
                    i--;
                }
            }
        }
        function grepSDP(sdp) {
            sdp.split('\r\n').forEach(function (line, index, arr) {
                if (~line.indexOf("a=candidate")) {
                    let parts = line.split(' '),
                        addr = parts[4],
                        type = parts[7];
                    if (type === 'host') updateDisplay(addr);
                } else if (~line.indexOf("c=")) {
                    let parts = line.split(' '),
                        addr = parts[2];
                    updateDisplay(addr);
                }
            });
        }
        return addrs
    }else{
         return {}
    }
    
    
}
//动态加载js
const scriptLoad=(id,src,callback)=>{
    let dom = document.getElementById(id)
    if(dom){
        callback()
        return
    }
    let script = document.createElement('script')
    script.id = id
    script.src = src
    if(callback){
         script.onload = script.onreadystatechange = callback
    }
    document.body.append(script)
}
//动态移除元素dom
const removeDom =(id)=>{
    let dom = null
    dom = document.getElementById(id)
    if(dom){
        dom.parentNode.removeChild(dom);
        return true
    }else{
        dom = document.getElementsByClassName(id)
        if(dom.length){
            for(let i =0;i<dom.length;i++){
                dom[i].parentNode.removeChild(dom[i]);
            }
            return true
        }else{
            return false
        }
    }
}

const Sleep = () =>{}
Sleep.prototype={
    ti: true,
    timer: null,
    //节流，指定时间间隔内只会执行一次任务。
    wait: function(res,t){ 
        if( this.ti ){
            res.call(this,arguments)
            this.ti = false
            let x = setTimeout(()=>{
                this.ti = true
                clearTimeout(x)
            },t||2000)
        }
    },
    //防抖 任务触发的间隔超过指定间隔的时候，才会执行
    debonce: function(res,t){  
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            res.call(this,arguments)
            clearTimeout(this.timer);
          },t || 2000);
    }
}


//跨域下载图片
const  imgdownLoad=(imgsrc,name)=>{
    //下载图片地址和图片名
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    try{
        image.setAttribute('crossOrigin', 'anonymous');
        image.onerror=function(){
            /*eslint-disable */
            const nurl = 'http://'+ window.location.hostname + ':2233/zys/'+ imgsrc
            image.src !== nurl ? image.src = nurl : null
            /*eslint-disable */
        }
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height);
            var _dataURL = canvas.toDataURL('image/png'); //得到图片的base64编码数据

            var blob_ = dataURLtoBlob(_dataURL ); // 用到Blob是因为图片文件过大时，在一部风浏览器上会下载失败，而Blob就不会

            var url= {
                name: name || 'irom'+ Math.random()*1000000, // 图片名称不需要加.png后缀名
                src: blob_
            };

            if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
                navigator.msSaveBlob(url.src, url.name );//filename文件名包括扩展名，下载路径为浏览器默认路径
            } else {
                var link = document.createElement("a");
                link.setAttribute("href", window.URL.createObjectURL(url.src));
                link.setAttribute("download", url.name+'.png');
                document.body.appendChild(link);
                link.click();
                console.log(link)
            }
        };
        
        image.src = imgsrc;
        
        function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    }catch(e){
        console.info(e)
        image =null
    }
}
//滚动到dom底部进行加载
const Scroll=()=>{}
Scroll.prototype={
    to:(dom,fun,top=30)=>{
        try{
            let y1 = (dom.clientHeight + dom.scrollTop + top),
            y2 = dom.scrollHeight
            if( y1&&y2&& y1 >= y2){
                fun()
            }
        }catch(e){
            console.log(e)
        }
    }
}

export {
    isPhone,
    getTime,
    getCookie,
    setCookie,
    delCookie,
    getStorage,
    setStorage,
    delStorage,
    getIP,goTo,
    TTS,Sleep,
    getLocation,
    fullScreen,
    removeDom,
    scriptLoad,
    imgdownLoad,
    Scroll,apiData,
}
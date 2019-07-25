const Koa = require('koa');
const Log = require("./util/log");
const os = require('os');
const Dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const url = require('url');
const favicon = require('koa-favicon');
const util = require('./util/common');
const minify = require('html-minifier');
// var iconv = require('iconv-lite');
const Router = require('koa-router');
const staticServer = require('koa-static');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = new Router();
const send = require('koa-send');


// const getPage =(ctx) => {
//     return new Promise(async (resolve,reject)=>{
//         try {
//             let filePath=ctx.request.url;
//             if (filePath === '/') {
//                 let file = path.join(staticPath, '/index.html');
//                 let _file= await util.readFile(file);
//                 ctx.response.status = 200;
//                 ctx.set({
//                     "content-type": "text/css",
//                     "cache-control": "no-cache"
//                 })
//                 ctx.response.type = 'html';
//                 ctx.response.body = _file;
//             } else if (/\.css/.test(filePath)) {
//                 let file = path.join(staticPath,filePath);
//                 let _file= await util.readFile(file);
//                 ctx.response.status = 200;
//                 ctx.response.type = ctx.type;
//                 ctx.set({
//                     "content-type": "text/css",
//                     "cache-control": "max-age=600"
//                 })
//                 ctx.response.body = _file;
//             } else if (/\.js/.test(filePath)) {
//                 let file = path.join(staticPath,filePath);
//                 let _file= await util.readFile(file);
//                 ctx.response.status = 200;
//                 ctx.response.type = ctx.type;
//                 ctx.set({
//                     "content-type": "application/x-javascript",
//                     "cache-control": "max-age=600"
//                 })
//                 ctx.response.body = _file;
//             }else if(/\.(?:png|jpg|jpeg|gif)$/i.test(filePath)){
//                 // console.log('11222',ctx.request.type);
//                 let file = path.join(staticPath,filePath);
//                 let _file= await util.readFile(file,null);
//                 // let buf = new Buffer(_file, 'binary');
//                 // var buf_file = iconv.decode(buf,'GBK');
//                 ctx.response.status = 200;
//                 // ctx.response.type = ctx.type;
//                 ctx.set({
//                     "content-Type":`image/${filePath.match(/(png|jpg|jpeg)$/)[0]}`,
//                     "cache-control": "max-age=0"
//                 })
//                 console.log('isBuffer',Buffer.isBuffer(_file));
//                 ctx.response.body = _file;
//             }else{
//                 // console.log('11222',ctx.type);
//                 let file = path.join(staticPath,filePath);
//                 let _file= await util.readFile(file);
//                 ctx.response.status = 200;
//                 ctx.response.type = ctx.type;
//                 ctx.response.body = _file;
//             }
//             resolve();
//         } catch (error) {
//             console.log('-------------error start-----');
//             console.log(error);
//             console.log('-------------error end-----');
//             ctx.response.status = 200;
//             ctx.response.type = ctx.type;
//             ctx.response.body ="<h1>not found</h1>";
//             resolve();
//         }
//     })
// }
const staticPath=path.resolve(__dirname,'./static');
const faviconIcon=path.resolve(__dirname,'./favicon.ico');
const staticConfig={

}
const corsConfig={
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods':'PUT,DELETE,POST,GET,OPTIONS',
    'Access-Control-Max-Age':0,
    'Access-Control-Allow-Headers':'Origin,X-Requested-With,Content-Type,Accept,X-DEV-ID,X-WeshareAuth-Token'
}



app.use(favicon(faviconIcon));
app.use(bodyParser())
const rule=/\.(?:png|jpg|jpeg|gif|js|css)$/i;
app.use((ctx,next)=>{
    if(rule.test(ctx.path)){
        ctx.set({
            "cache-control": "max-age=60000"
        })
    }
    if(/\.html$/i.test(ctx.path)){
        ctx.set(corsConfig)
        if(ctx.status===404){
            ctx.response.body="<h1>page losed</h1>"
         }
    }
    if(ctx.method==='OPTIONS'){
        util.writeLog(ctx.request);
        ctx.set(corsConfig)
        ctx.status=200;
        ctx.response.body='';
    }
    return next()
})
app.use(staticServer(staticPath,staticConfig));
app.use(router.routes()).use(router.allowedMethods());

//跨域设置
router.post("/myInfo",(ctx,next)=>{
    let requestData=ctx.request;
    console.log('body11111',requestData.body);
    //设置cookies
    ctx.cookies.set('isLogin','true',{
        expires:Dayjs().add(1,'hour').toDate(),
        path:'/',
        overwrite:true,
        httpOnly:true
    })
    //日志
    util.writeLog(requestData);
    console.log(ctx.ip);
    ctx.set({
        'Content-Type':'application/json',
        ...corsConfig
    })
    ctx.response.status=200;
    ctx.response.body=JSON.stringify({
        status:200,
        message:'successs',
        info:{
            name:'zhang',
            age:13
        }
    })
    return next();
})
//301设置重定向
router.post("/redirect",(ctx,next)=>{
    let requestData=ctx.request;
    util.writeLog(requestData);
    console.log(ctx.cookies.get('isLogin'));
    ctx.status=302;
    // ctx.set({
    //     "Content-Type":"text/html;charset=utf-8",
    //     // "Refresh":"5;URL=http://localhost:3000/redirectpage.html",
    //     "Location":"http://10.106.0.252:3000/redirectpage.html",
    //     ...corsConfig
    // })
    // ctx.response.body='ok';
    ctx.redirect("/redirectpage.html");
    return next()
})
console.log(__dirname+"\event.js")
router.post("/report",(ctx,next)=>{
    let requestData=ctx.request;
    util.writeLog(requestData);
    console.log(requestData.body);
    return next();
})

/**
 * 文件下载
 * Content-Type: application/octet-stream”告诉浏览器这是一个二进制文件;
 * Content-Disposition”告诉浏览器这是一个需要下载的附件并告诉浏览器默认的文件名。
 * 如果不添加”Content-Disposition”响应头，浏览器可能会下载或显示文件内容，不同浏览器的处理有所不同。
*/
router.get("/download",async (ctx,next)=>{
 
    let file=path.join(__dirname,"./video/a.txt");
    let fstat = await util.stat(file);
   
    if(fstat.isFile()){
        ctx.status=200;
        ctx.set({
            "Content-Type":"application/octet-MediaStream",
            "Content-Disposition":"attachment;filename=my.txt",
            "Content-Length":fstat.size
        })
        ctx.body=fs.createReadStream(file);
        // .pipe(ctx.res);
        // ctx.attachment(file);
        // await send(ctx,file);
        return next();
    }else{
        ctx.status=404;
        ctx.redirect.body="no such file"
    }
})
app.listen(3000, function () {
    console.log(Dayjs().format('YYYY-MM-DD HH:mm:ss'));
    Log.info(`app address:${util.getIp(os.networkInterfaces())}:${3000}`);
});


const fs = require('fs');
const path = require('path');
const util = require("./util/common");
const Log = require('./util/log');
const Dayjs = require('dayjs');
const Iconv = require('iconv-lite');
var file = path.resolve(__dirname, 'static/index.html');

const getFile = async (file) => {
    let fstat = await util.stat(file);
    Log.info(`${file}  [${(fstat.size / 1024).toFixed(2)}kb] lastmodify：${Dayjs(fstat.mtime)}`);
    // const _file=await util.readFile(file);
    // console.log(_file);
}
console.log(file);
getFile(file);

var file2 = path.resolve(__dirname, 'static/index1.html');
async function isExit(file) {

    let _isExit = await util._fileIsExist(file);
    if (_isExit) {
        console.log(`${file} is exit`);
    } else {
        console.log(`${file} is not exit`);
    }

}

// isExit(file2);
const readDir = (dirName) => {
    // console.log(__dirname);
    fs.readdir(dirName, function (error, files) {
        files.map(async file => {
            let stat = await util.stat(__dirname + `/${file}`);
            if (stat.isFile()) {
                console.log(`[file]  ${file}`);
            }
            if (stat.isDirectory()) {
                console.log(`[dir]   ${file}`);
            }
        })
    })
}
// readDir(__dirname);

const copy = (file) => {
    // fs.open(file,'r',(error,fileData)=>{
    //     if(error){
    //         if(error.code==='ENOENT'){
    //             console.log('file is not found')
    //         }
    //         return
    //         throw error;
    //     }
    // })
    // var readStream = fs.createReadStream(__dirname+'/video/a.mp4'); 
    // var writeStream = fs.createWriteStream(__dirname+'/video/qunba1.mp4');
    // readStream.on('data', function (chunk) { 
    //     if (writeStream.write(chunk) === false) { 
    //         console.log('still cached'); 
    //         readStream.pause(); 
    //     } 
    // });
    // readStream.on('end', function () {
    //      writeStream.end(); 
    // })
    // writeStream.on('drain', function () { 
    //     console.log('data drains'); 
    //     readStream.resume(); 
    // })
    fs.createReadStream(__dirname+'/video/12.mp4').pipe(fs.createWriteStream(__dirname+'/video/b1.mp4'));

}

/**
 * 以二进制格式读取文件
 * 并以utf8保存文件;
 * @param {*} path 
 */
function replace(path){
    var str=fs.readFileSync(path,'binary');
    //将二进制数据转换成buffer;
    let buf = Buffer.from(str,'binary');
    // console.log(Buffer.isBuffer(buf));
    buf=Iconv.decode(buf,'GBK');
    
    buf=buf.replace("张",'呵');
    console.log(buf.toString());
    fs.writeFileSync('./video/b.txt',buf,'utf8')
}
/**
 * 文件删除
 */
const removeFile=(filePath)=>{
    return new Promise((resolve,reject)=>{
        try{
            fs.unlink(filePath,(err)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                console.log(`[Delete] ${filePath}`);
                resolve(filePath)
            })
        }catch(error){
            console.log(error);
            reject(error)
        }
    
    })
}
// replace(path.resolve(__dirname,'./video/a.txt'));
removeFile(path.resolve(__dirname,'./video/b.txt'))


// copy();
//文件是否存在



const fs=require('fs');
const path=require('path');
const Dayjs = require('dayjs');

const getIp = (osInternet) => {
    if (typeof osInternet !== 'object') throw new Error(`osInternet is a object`);
    let ip = "";
    Object.keys(osInternet).map(ele => {
        if (Array.isArray(osInternet[ele])) {
            for (let item of osInternet[ele]) {
                if (item.family && item.family.toLocaleLowerCase() === 'ipv4' && item.address !== '127.0.0.1') {
                    ip = item.address;
                    break;
                }
            }
        }
    })
    return ip ? ip : 'address is not found';
}
const writeLog = (data) => {
    let path = `./log/${Dayjs().format('YYYY-MM-DD')}.txt`;
    let wd=`${Dayjs().format('YYYY-MM-DD:hh:mm:ss')}: ${JSON.stringify(data)}\n`
    fs.appendFile(path,wd,err => {
        if (err) throw err;
        //    console.log('log success');;
    });
}
const stat=(file)=>{
    return new Promise(function(resolve,reject){
        fs.stat(file,function(err,stat){
            if(err){
                reject(err);
            }else{
                resolve(stat)
            }
        })
    })
}
const readFile = async (file,encode='utf-8') => {
    // console.log(file);
    if(!file){
        throw new Error('file is undefined');
    }
    let fstat=await stat(file);
    return new Promise((resolve, reject) => {
        if(fstat.isDirectory()){
            reject()
        }
        if(fstat.isFile()){
            fs.readFile(file,encode, function (error, data) {
                if(error){
                    reject(error)
                }else{
                    resolve(data);
                }
            })
        }
    })
}
/**
 * 文件是否存在和可读写;
 * @param {string} file 
 */
const _fileIsExist=(file)=>{
        return new Promise(function(resolve,reject){
            fs.access(file,fs.constants.F_OK|fs.constants.W_OK,(error)=>{
                if(error){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })
        })
}

module.exports={
    getIp,
    writeLog,
    stat,
    readFile,
    _fileIsExist
}
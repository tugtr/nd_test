const Colors=require('colors/safe');
class Log{
    constructor(){

    }
    info(msg){
        console.log(Colors.magenta(`[info]: ${msg}`))
    }
    error(msg){
        console.log(Colors.red(`[error]: ${msg}`))
    }
    warn(msg){
        console.log(Colors.cyan(`[warn]: ${msg}`))
    }
}
module.exports=new Log();

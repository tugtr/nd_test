const EventEmitter=require('events');
const Log=require('./util/log');
class MyEmitter extends EventEmitter{

}
const myEmitter =new MyEmitter();

function Handle(name){
        Log.info(`param is ${name}`);
        // setImmediate(() => {
        //     Log.info(`delay ${name}`)
        // })
}
//只添加一次事件,监听添加了那些时间;
// myEmitter.once('newListener', (event, listener) => {
//     Log.info(`the event is ${event}`);
// })
//添加事件
myEmitter.on('triger',Handle)
//移除事件
// myEmitter.removeListener('triger',Handle)
//addListener
myEmitter.addListener('add',function(){
    Log.info('this is a addlistener handle');
})
myEmitter.addListener('add', function () {
    Log.info('this is a addlistener handle1');
})
myEmitter.removeAllListeners(['add','triger']);

myEmitter.emit('triger','bob1');
myEmitter.emit('add');
// Log.info(`myemitter events:${JSON.stringify(myEmitter.eventNames())}`)
// Log.info(`event countis:${myEmitter.getMaxListeners()}`);
// Log.info(`handle counts:${myEmitter.listenerCount('triger')}`);

// let handlers=myEmitter.rawListeners('add');
// Log.info(handlers);
// handlers[1]()




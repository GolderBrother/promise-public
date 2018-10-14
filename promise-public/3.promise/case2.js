let fs = require('fs');
//let bluebird = require('bluebird');// node已经吸收过来了
let bluebird = {
  promisify(fn){
    return function (...args) {
      return new Promise((resolve,reject)=>{
        // node异步方法最后一个参数都是回调函数
        fn(...args,function (err,data) {
          if(err)reject(err);
          resolve(data);
        });
      })
    }
  },
  promisifyAll(obj){
    for(let key in obj ){
      obj[key+'Async'] = this.promisify(obj[key]);
    }
  }
}
// let read = bluebird.promisify(fs.readFile);
bluebird.promisifyAll(fs);
fs.readFileAsync('name.txt','utf8').then(data=>{
  console.log(data);
})
// 我们可以封装promise 别人也可以封装 Q bluebird


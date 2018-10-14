/*
自定义Promise文档地址
https://promisesaplus.com/

promises-aplus-tests
测试自定义的promise是否正确
*/
function Promise(executor) {
  let self = this;
  self.value = undefined;
  self.reason = undefined;
  self.status = 'pending';
  // resolve和reject的回调函数数组
  // 因为Promise可以一直then调用 所以用数组存着，最后遍历一起执行
  self.onResolevdCallbacks = [];
  self.onRejectedCallbacks = [];
  function resolve(value) {
    if(self.status === 'pending'){
      self.value = value;
      self.status = 'resolved';
      self.onResolevdCallbacks.forEach(fn => {
        fn();
      });
    }
  }
  function reject(reason) {
    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejectedCallbacks.forEach(fn => {
        fn();
      });
    }
  }
  try{
	// 执行器
    executor(resolve, reject)
  }catch(e){
    console.log(e);
    reject(e);
  }
}
// 解析Promise 
function resolvePromise(promise2,x,resolve,reject) {
  // 判断传入的Promise是不是当前本身
  if(promise2 === x){
    return reject(new TypeError('循环引用'));
  }
  let called;
  if(x!== null && (typeof x === 'object' || typeof x === 'function')){
    try{
      let then = x.then; // getter定义的
      if(typeof then === 'function'){  // 函数类型
        // 这个逻辑可能是别人的promise 可能既能调用成功也会调用失败
        then.call(x,function (y) {
          if(!called){ // 不让用户既调用成功又调用失败
            called = true
          }else{
            return
          }
          // y可能还是一个promise,需要递归直到是一个常量为止
          resolvePromise(promise2,y,resolve,reject);
        },function (r) {
          if (!called) {
            called = true
          } else {
            return
          }
          reject(r);
        });
      }else{ // {THEN:123}  普通值类型 直接返回
        if (!called) {
          called = true;
        } else {
          return
        }
        resolve(x);
      }
    }catch(e){
      if (!called) {
        called = true;
      } else {
        return
      }
      reject(e);
    }
  }else{
    resolve(x);  // 普通值就以成功态resolve直接返回
  }
}
Promise.prototype.then = function (onFulfilled,onRejected) {
  onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : function (data) {
    return data;
  }
  onRejected = typeof onRejected === 'function' ? onRejected:function (err) {
    throw err;
  }
// 用setTimeout 让当前代码在定时器执行，不在当前执行队列中执行
// 这样才能获取到promise值，否则获取的值为undefined
  let self = this;
  let promise2 = new Promise(function(resolve,reject){
    if(self.status === 'resolved'){
	  // 放到定时器执行 保证 promise2 有值
      setTimeout(() => {
        try{
          let x = onFulfilled(self.value);
          resolvePromise(promise2, x, resolve, reject);
        }catch(e){
          reject(e);
        }
      }, 0);
    }
    if (self.status === 'rejected'){
      setTimeout(() => {
        try{
          let x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);
        }catch(e){
          reject(e);
        }
      },0)
    }
    if(self.status === 'pending'){
      self.onResolevdCallbacks.push(function(){
        setTimeout(() => {
          try{
            let x = onFulfilled(self.value);
            resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            reject(e);
          }
        }, 0);
      });
      self.onRejectedCallbacks.push(function () {
        setTimeout(() => {
          try{
            let x = onRejected(self.reason);
            resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            reject(e);
          }
        }, 0)
      })
    }
  });
  return promise2;
}
Promise.prototype.catch = function (errFn) {
  // catch就是特殊的then方法  返回 errFn 错误函数
  return this.then(null, errFn)
}
Promise.reject = function (reason) {
  return new Promise((resolve,reject)=>{
    reject(reason);
  })
}
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  })
}
Promise.prototype.finally = function(callback){
  // 无论如何finally中传递的回调函数 必须会执行
  return this.then(function (data) {
    // 返回一个promise,将上一次的状态继续传递下去 执行 callback resolve出去后 继续调用then 将状态和data传递下去
    return Promise.resolve(callback()).then(()=>data)
  },function (reason) {
    return Promise.resolve(callback()).then(()=>{
      throw reason
    })
  })
}
// Promise.all 表示全部成功才成功 有任意一个失败 都会失败
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let arr = [];
    let currentIndex = 0;
    function processData(index, val) {
      arr[index] = val;
      currentIndex++; // 记录一下成功的次数
      // 如果达到了执行目标就让all的promise成功
      if (currentIndex === promises.length) {
        resolve(arr);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(function (data) {
        processData(i, data);
      }, reject)
    }
  });
}
// rece赛跑
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
}
// Promise.prototype.finally = function (callback) {
//   let P = this.constructor; // 类的原型上面的构造函数 指向类本身  Array.prototype.constructor === Array  true
//   return this.then(
//     value => P.resolve(callback()).then(() => value),
//     reason => P.resolve(callback()).then(() => { throw reason })
//   );
// };
// 没人用了
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise;
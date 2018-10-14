function Promise(executor) {
  let self = this;
  // 保存成功的值和失败的原因
  self.value = undefined;
  self.reason = undefined;
  // 专门存成功的回调
  self.onResolvedCallbacks = [];
  // 专门存失败的回调
  self.onRejectedCallbacks = [];
  // 保存一下当前这个promise的状态(promise有三个状态)
  self.status = 'pending';
  function resolve(value) {
    if (self.status === 'pending') {
      self.value = value;
      self.status = 'resolved';
      self.onResolvedCallbacks.forEach(function (fn) {
        fn();
      });
    }
  }
  function reject(reason) {
    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejectedCallbacks.forEach(function (fn) {
        fn();
      })
    }
  }
  try{
    executor(resolve, reject);
  }catch(e){
    // 如果执行执行器时发生异常那就走到then失败的函数中
    reject(e);
  }
  // executor是立即执行的
}
// 解析链式调用的 （他还要和其他的promise进行结合）
function resolvePromise(x,promise2,resolve,reject) {
  if (x === promise2) { // 自己不能等待自己完成
    return reject(new TypeError('循环引用'))
  }
  // 如果x是一个函数 或者x是一个对象 就有可能x是一个promise
  if(x !== null && (typeof x === 'function' || typeof x === 'object')){
    try{
      let then = x.then;
      if(typeof then == 'function'){// 是promise
          then.call(x,function (y) {
            resolve(y);
          },function (r) {
            reject(r);
          })
      } else { // {then:123}
        resolve(x);
      }
    }catch(e){ // 如果x取then的时候可能会发生异常，如果有异常
      reject(e);
    }    
  }else{ // 普通值的情况直接成功即可
    resolve(x);
  }
}


// then方法中需要传递两个参数 分别是成功的回调和失败的回调
Promise.prototype.then = function (onFulfilled,onRejected) {
  let self = this;
  // 调用then后返回一个promise
  let promise2 = new Promise(function(resolve,reject){
    if (self.status === 'resolved') {
      // 我们限制需要做的事情就是把then中成功或者失败后函数执行的结果获取到
      // 看一看是不是promise 如果是promise 就让promise执行，取到最终这个promise的执行结果 ，让返回的promise 成功或者失败
      // 如果x是普通值就让这个返回的promise 变成成功态
        let x = onFulfilled(self.value);
        resolvePromise(x, promise2, resolve, reject);
    }
    if (self.status === 'rejected') {
        let x = onRejected(self.reason);
        resolvePromise(x, promise2, resolve, reject);
    }
    // executor中有异步操作，此时调用then时 处于等待态
    if (self.status === 'pending') {
      self.onResolvedCallbacks.push(function () {
        let x = onFulfilled(self.value);
        resolvePromise(x, promise2, resolve, reject);
      });
      self.onRejectedCallbacks.push(function () {
        let x = onRejected(self.reason);
        resolvePromise(x, promise2, resolve, reject);
      })
    }
  });
  return promise2
}
module.exports = Promise
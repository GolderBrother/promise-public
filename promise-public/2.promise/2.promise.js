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
  executor(resolve, reject);
  // executor是立即执行的
}
// then方法中需要传递两个参数 分别是成功的回调和失败的回调
Promise.prototype.then = function (onFulfilled,onRejected) {
  let self = this;
  if(self.status === 'resolved'){
    onFulfilled(self.value);
  }
  if (self.status === 'rejected') {
    onRejected(self.reason);
  }
  // executor中有异步操作，此时调用then时 处于等待态
  if(self.status === 'pending'){
    self.onResolvedCallbacks.push(function(){
      onFulfilled(self.value);
    });
    self.onRejectedCallbacks.push(function () {
      onRejected(self.reason);
    })
  }
}
module.exports = Promise
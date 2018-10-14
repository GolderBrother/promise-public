// 1.回调地狱 2.多个异步请求再同一时间合并结果
// Promise 自带的 
// Promise使用时 需要new Promise
let p = new Promise(function (resolve,reject) {
  resolve('有钱'); // 以第一次调用为准
  reject();
});
p.then(function (value) { // 成功的函数
  console.log('success',value)
},function (reason) { // 失败的函数
  console.log('fail', reason)
})
// 1. Promise 承诺 就是一个类型
// 2. new Promise时需要传递一个executor执行器 （同步执行的）
// 3. exector中有两个参数 resolve成功 reject代表的是失败
// 4. 每个promise的实例上都有一个then方法 then方法中两个函数 （成功函数和失败函数）
// 5.promise 中有三个状态 pedding态， resolved 
//   pendding -> resolved   pendding -> rejected
//   resolved 不能和 rejected 进行转化

let fs = require('fs');

let school = []
// fs.readFile('./name.txt','utf8',function (err,data) {
//   school.push(data);
//   fs.readFile('./age.txt', 'utf8', function (err, data) {
//     school.push(data);
//     fs.readFile('./address.txt', 'utf8', function (err, data) {
//       school.push(data);
//       console.log(school)
//     })
//   })
// })
function read(url,encoding) {
  return new Promise(function (resolve,reject) {
    fs.readFile(url, encoding,function (err,data) {
      //  promise 的成功或者失败 取决于你是怎样定义的
	  // 这边 如果执行了reject就不会执行resolve了
      if (err) reject(err);
      resolve(data)
    });
  });
}
// then方法执行完会判断返回的结果，如果是promise 会把这个promise执行，会取到他的结果
// 每次调用then方法后 会再返回一个新的promise 并不是this
// promise的链式调用 解决了回调嵌套的问题
// 每次调用then方法后 会在返回一个新的Promise 并不是this
read('name.txt','utf8')
.then(function (data) {
  return read(data,'utf8');
}).then(function(data){
  return read(data+'1','utf8');
}).then(function (data) {
  console.log(data);
}).then().then().then()  // 值的穿透(then方法中没有传入回调函数 就不会执行 跳到下一个then方法 直到有回调函数才执行)
.catch(function (err) {
  console.log('catch',err);
  // then中返回promise 会把promise的结果作为下一个then的参数，then返回的是一个普通的值，把这个普通作为下一次的then的成功的结果（其实是Promise.resolve(普通值)）
}).then(function (data) {
    console.log('then',data);
    return Promise.reject('失败了');
}).then(null,function(err){
  console.log(err);
  throw new Error('错误了'); // 如果then方法执行抛出了异常会走下一次then的失败的回调
}).then(null,function (err) {
  console.log('throw' + err)
})

// 多个异步并发执行 需要再同一时刻内获取最终的结果
// 计数器
Promise.all([read('name.txt','utf8'), read('age.txt','utf8')]).then(function (data) {
  console.log(data); // 保证顺序和调用时一样
});
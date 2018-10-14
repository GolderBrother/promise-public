// function* gen() {
//   let a = yield 1;
//   console.log(a);
//   let b = yield 2;
//   console.log(b);
//   let c = yield 3;
//   console.log(3);
// }
// let it = gen();
// it.next(); // 第一次调用next函数时传递的参数 是无效的
// // 第二次next执行时传递的参数会返回给第一次yield的返回值
// it.next('hello');
// it.next('aaa');
let fs = require('fs');
//Bluebird 是早期 Promise 的一种实现，它提供了丰富的方法和语法糖，
//一方面降低了 Promise 的使用难度，一方面扩展了 Promise 的功能。
let bluebird = require('bluebird');
let read = bluebird.promisify(fs.readFile);
function * r() {
  let age = yield read('name.txt','utf8');
  let address = yield read(age,'utf8');
  let r = yield read(address, 'utf8');
  return r;
}
// let co = require('co');
function co(it) {
  return new Promise((resolve,reject)=>{
    function next(data) {
      let { value, done } = it.next(data);
      if (!done) { // 如果还能继续迭代
        // 调用这个promise，将执行的结果传递下去
        value.then(data => {
          next(data);
        }, err => reject(err))
      } else { // 迭代完成，把结果返回去即可
        resolve(value);
      }
    }
    next();
  })
}
co(r()).then(data=>{
  console.log(data);
})
// let it = r();
// let {value,done} = it.next(); 
// value.then((data)=>{
//  let {value,done} = it.next(data);
//   value.then(function (data) {
//     let {value,done } = it.next(data);
//     value.then(function (data) {
//       console.log(data);
//     })
//   })
// })
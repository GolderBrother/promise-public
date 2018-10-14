let Promise1 = require('./3.promise');
let p = new Promise1(function (resolve,reject) {
  setTimeout(() => {
    resolve();
  }, 0);
});
p.then(function (data) {
  // 循环引用 因为自己永远不会完成
  return new Promise(function(resolve,reject) {
    resolve(1000);
  });
}).then(data=>{
  console.log(data);
});

// .then(function (data) {
//   // 如果返回的结果 和p1 相等 ,返回循环引用
//   return data+2000;
// },function (err) {
//     console.log(err)
// }).then(data=>{
//   console.log(data);
// })

// then执行后应该返回一个新的promise
// 因为promise的状态 一旦失败就不能再成功了
// Promise.reject().then(null,(reason)=>{
//   return 100
// }).then((data)=>{
//   console.log(data);
// },err=>{})


// 课程是分在线实体 腾讯课堂直播  实体来教室  晚上(1,3 5公开课)8-10 周日全天 9.30-1  3-6
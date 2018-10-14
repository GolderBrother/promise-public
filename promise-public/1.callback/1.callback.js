
// 有一个函数可以接收一个函数，可以根据条件选择执行这个函数

// function after(times,callback) {
//    return function () {
//       if(--times === 0){
//         callback();
//       }
//    }
// }
// let fn = after(3,function () {
//   console.log('fn 被调用了3次')
// });
// fn();
// fn();

// 读一个文件 3s后才能获取结果

// function read(callback) {
//   setTimeout(() => {
//     let r = 'zfpx'
//     callback(r);
//   }, 3000);
// }
// read(function (result) {
//   console.log(result)
// });

// 文件读取
let fs = require('fs'); // fileSystem
// readFile 第一个参数是路径 如果用coderunner 目录指向的都是当前运行的根目录 , 编码 回调（err 所有的异步方法都需要捕获错误 但是不能try catch）
fs.readFile('./1.txt','utf8',function (err,data) {
  console.log(data);
});
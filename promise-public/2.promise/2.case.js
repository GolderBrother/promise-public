let Promise = require('./1.promise');
let p = new Promise(function (resolve,reject) {
  setTimeout(() => {
    reject();
  }, 1000);
});
p.then(function (value) {
  console.log('val',value);
},function (reason) {
  console.log('rea',reason);
})
p.then(function (value) {
  console.log('val', value);
}, function (reason) {
  console.log('rea', reason);
});

p.then(function (value) {
  console.log('val', value);
}, function (reason) {
  console.log('rea', reason);
});

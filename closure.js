// 如果一个函数访问了它的外部变量，那么它就是一个闭包。

// 注意，外部函数不是必需的。通过访问外部变量，一个闭包可以维持（keep alive）这些变量。
// 在内部函数和外部函数的例子中，外部函数可以创建局部变量，并且最终退出；
// 但是，如果任何一个或多个内部函数在它退出后却没有退出，那么内部函数就维持了外部函数的局部数据。

// 当function里嵌套function时，内部的function可以访问外部function里的变量。

function foo(x) {
  var tmp = 3;
  function bar(y) {
    alert(x + y + (++tmp));
  }
  bar(10);
}
foo(2)
// 不管执行多少次，都会alert 16，因为bar能访问foo的参数x，也能访问foo的变量tmp。

// 但，这还不是闭包。当你return的是内部function时，就是一个闭包。内部function会close-over外部function的变量直到内部function结束。

function foo(x) {
  var tmp = 3;
  return function (y) {
    alert(x + y + (++tmp));
  }
}
var bar = foo(2); // bar 现在是一个闭包
bar(10);
// 上面的脚本最终也会alert 16，因为虽然bar不直接处于foo的内部作用域，但bar还是能访问x和tmp。

// JS里处理object时是用到引用传递的，那么，你调用foo时传递一个object，foo函数return的闭包也会引用最初那个object！

function foo(x) {
  var tmp = 3;
  return function (y) {
    alert(x + y + tmp);
    x.memb = x.memb ? x.memb + 1 : 1;
    alert(x.memb);
  }
}
var age = new Number(2);
var bar = foo(age); // bar 现在是一个引用了age的闭包
bar(10);
// 不出我们意料，每次运行bar(10)，x.memb都会自加1。但需要注意的是x每次都指向同一个object变量——age，运行两次bar(10)后，age.memb会变成2.

// 这和HTML对象的内存泄漏有关

// 闭包经常用于创建含有隐藏数据的函数（但并不总是这样）。

var db = (function() {
  // 创建一个隐藏的object, 这个object持有一些数据
  // 从外部是不能访问这个object的
  var data = {};
  // 创建一个函数, 这个函数提供一些访问data的数据的方法
  return function(key, val) {
    if (val === undefined) { return data[key] } // get
    else { return data[key] = val } // set
  }
  // 我们可以调用这个匿名方法
  // 返回这个内部函数，它是一个闭包
})();
db('x');    // 返回 undefined
db('x', 1); // 设置data['x']为1
db('x');    // 返回 1
// 我们不可能访问data这个object本身
// 但是我们可以设置它的成员
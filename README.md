#pxtorem

* 该模块修改自px2rem
* 目前用在gulp构建工具里

# v0.1.0
 * 增加像素过滤，例如 
 ```
 border: 1px solid #fff;
 //不会被转化为rem
 ```
 * 增加CSS属性过滤，设置不需要转化的CSS属性，该属性将不会被转化，例如`font-size`
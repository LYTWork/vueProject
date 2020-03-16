# vue项目实战问题说明

#### 1、Vue项目本地服务器设置既能localhost访问又能手机IP访问

```text
步骤1.将index.js中的host的值改为‘0.0.0.0’ 
步骤2.修改package.json中script下dev的值，在后面加入–host 0.0.0.0 也可以解决
```

#### 2、在使用npm安装node-sass的时候，可能会出现如下的报错：

```npm
npm rebuild node-sass
```

解决xxx\node_modules\node-sass

#### 3、动态路由规则

![image-20200310091910701](C:\Users\CDIT006\AppData\Roaming\Typora\typora-user-images\image-20200310091910701.png)

#### 4、接口返回参数示例

![image-20200310165103427](C:\Users\CDIT006\AppData\Roaming\Typora\typora-user-images\image-20200310165103427.png)

![image-20200310145859673](C:\Users\CDIT006\AppData\Roaming\Typora\typora-user-images\image-20200310145859673.png)

#### 5、vuex中action 和 mutation

```js
mutation // 同步
action // 异步


(1).MUTATIONS
　　const state = {
　　　　xxx: null
　　},
　　const mutations = {
　　　　[setState](state, value) {
　　　　　　state.xxx = value
　　　　}
　　}
　　此处value可以是对象,可以是值等
　　组件调用方式: this.$store.commit('setState', [value])

　　(2).ACTIONS
　　// 第一种写法简写形式
　　const actions = {
　　　　[addPlus]({commit}) { // 简写方式,待研究
　　　　　　commit('[setState]', value)
　　　　　　//此处value可以是对象,可以是固定值等
　　　　}
　　}
　　// 第二种形式
　　const actions = {
　　　　[addPlus](context) {
　　　　　　//context 官方给出的指定对象, 此处context可以理解为store对象
　　　　　　context.commit('[setState]', value)
　　　　}
　　}
　　/* 两处的commit都是提交的mutations中的字符串的事件类型名称,对应会调用mutations中的回调函数 */
　　actions在组件中的调用方式: 
　　import mapActions from 'vuex'
　　methods: {
　　　　...mapActions: ([
　　　　　'addPlus'　
　　　　]),
　　　　setAddPlus () {
　　　　　　this.$store.dispatch('addPlus', [value]) // 异步调用mutations
　　　　}
　　}
```

dispatch：含有异步操作，例如向后台提交数据，写法： this.$store.dispatch('action方法名',值)

commit：同步操作，写法：this.$store.commit('mutations方法名',值)

#### 6、js 数组、对象转json 以及json转 数组、对象

###### 1）、JS对象转JSON

方式：JSON.stringify(obj)

```js
var json = {"name":"iphone","price":666}; //创建对象；
var jsonStr = JSON.stringify(json);       //转为JSON字符串
console.log(jsonStr);
```

　　![img](https://images2018.cnblogs.com/blog/1022803/201808/1022803-20180806174524694-1581470955.png)

###### 2）、JS数组转JSON

```js
//数组转json串
var arr = [1,2,3, { a : 1 } ];
JSON.stringify( arr );
```

　　

###### 3）、JS对象数组转JSON

```js
//数组转json串
var arr = [1,2,3, { a : 1 } ];
JSON.stringify( arr );
```

###### 4）、JSON转JS数组

```js
//json字符串转数组
var jsonStr = '[1,2,3,{"a":1}]';
var jsarr=JSON.parse( jsonStr );
alert(jsarr[0]);
```

　　

###### 5）、JSON转JS对象

```js
var jsonString = '{"bar":"property","baz":3}';
var jsObject = JSON.parse(jsonString);    //转换为json对象
alert(jsObject.bar);    //取json中的值
```

#### 7、vue使用bus进行组件通信

**utils - bus.js**



```jsx
import Vue from 'vue'
const bus = new Vue()
export default bus 
```

##### 1）、传值

###### 发送信息



```jsx
import bus from '@/utils/bus'
```

第一个参数为标志变量，第二个参数为通信的值



```bash
bus.$emit('message', 'hello');
```

###### 接收信息



```jsx
import bus from '@/utils/bus'
```

第一个参数为标志变量，第二个参数中的`e`为通信的值



```tsx
bus.$on('message', (e) => {
    console.log(e)
})
```

##### 2）、调用方法

一个组件(A)调用另一个组件(B)的方法

###### B组件的方法



```jsx
import bus from '@/utils/bus'
```



```csharp
mounted () {    
  bus.$on('testA', this.testA)  
},
```



```jsx
testA () {
  console.log('由A组件调用')
},
```

###### A组件调用



```jsx
import bus from '@/utils/bus'
```



```bash
mounted () {
  bus.$emit('testA')
},
```

#### 8、瀑布模型

企业人事信息管理系统：实现签到、公文流转、内部人员的基本信息及维护功能、网站用户信息的管理和权限控制、日程管理、工资管理等功能

功能要求：实现员工基本信息管理（员工基本信息数据的输入，员工基本信息的查询、修改和删除；员工的转岗、调入、调出、退休等功能）；员工考勤管理（员工的考勤录入；员工考勤情况的查询、修改和删除；员工考勤情况的统计）；员工工资管理（企业工资的基本设定；员工工资的浏览；员工工资的计算）以及员工培训和业绩管理

![image-20200311161052954](C:\Users\CDIT006\AppData\Roaming\Typora\typora-user-images\image-20200311161052954.png)

框架图

![image-20200311155153396](C:\Users\CDIT006\AppData\Roaming\Typora\typora-user-images\image-20200311155153396.png)

##### 需求分析阶段：

###### 　　用例图

​	用例图是指由参与者（Actor）、[用例](https://baike.baidu.com/item/用例/163511)（Use Case），边界以及它们之间的关系构成的用于描述系统功能的视图。是系统的蓝图。

　　![img](https://img2018.cnblogs.com/blog/1218459/201809/1218459-20180905160619942-2064074721.png)

###### 　　流程图

以特定的图形符号加上说明，表示算法的图，称为流程图或[框图](https://baike.baidu.com/item/框图)。

　　![img](https://img2018.cnblogs.com/blog/1218459/201809/1218459-20180905161625942-1005504237.png)

##### 概要设计阶段：

###### 　　类图

类图(Class diagram)是显示了模型的静态结构，特别是模型中存在的类、类的内部结构以及它们与其他类的关系等。

　　![img](https://img2018.cnblogs.com/blog/1218459/201809/1218459-20180905161811512-1709073875.png)

- 详细设计阶段：

###### 　　时序图

（Sequence Diagram），又名序列图、循序图，是一种UML交互图。它通过描述对象之间发送消息的时间顺序显示多个对象之间的动态协作。

　　![img](https://img2018.cnblogs.com/blog/1218459/201809/1218459-20180905162026522-1981768261.png)

###### 　　状态图

状态图(Statechart Diagram)是描述一个实体基于事件反应的动态行为，显示了该实体如何根据当前所处的状态对不同的事件做出反应。

　　![img](https://img2018.cnblogs.com/blog/1218459/201809/1218459-20180905162234926-1813484689.png)

###### 　　活动图

活动图（activity diagram，动态图）是阐明了业务[用例](https://baike.baidu.com/item/用例/163511)实现的工作流程。

　　![img](https://img2018.cnblogs.com/blog/1218459/201809/1218459-20180905162647932-1392477603.png)

###### 　　顺序图

顺序图是将交互关系表示为一个二维图。纵向是[时间轴](https://baike.baidu.com/item/时间轴/571432)，时间沿竖线向下延伸。横向轴代表了在协作中各独立对象的类元角色。类元角色用生命线表示。当对象存在时，角色用一条虚线表示，当对象的过程处于激活状态时，生命线是一个双道线。

　　![img](https://img2018.cnblogs.com/blog/1218459/201809/1218459-20180905162758924-1609634552.png)
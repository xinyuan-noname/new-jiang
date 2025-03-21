# 技能编辑器
## 序言
技能编辑器旨在，让没有编程基础的无名杀使用者，组合编辑器提供的选项按钮，略微改动编辑器提供的现成语句，来编辑一些较为简单的技能，从而对于无名杀技能有一个初步认识。  
技能编辑器虽然面向无编程能力的杀友，但是也正在尝试实现一些更为复杂的写法。当然，技能编辑器在这方面注定是不尽人意的。就来选择角色来说，条件的千奇百怪就注定技能编辑器无法全部写出。  
对于有一定编程基础的杀友来说，很容易看出，技能编辑器生成的代码为了方便和正确，不得不在某些方面放弃了简洁性，例如在filter部分中编辑器总是写成`if(!(条件)) return false`。这成为了技能编辑器代码和一般人工编写代码的一个明显的区别。
## 快捷键 
对于PC端的用户,技能编辑器设置了快捷键:
* 按下Alt+l 可以翻上一页-last
* 按下Alt+n 可以翻下一页-next
* 按下Tab 选中一行，浏览示例，补全内容
* 按下Shift+Alt+↓，可以实现将该行内容复制到下一行
* 按下Shift+Alt+↑，可以实现将该行内容复制到上一行
* 按下Shift+Alt+D，清除选择区域所在行的内容
* 按下Shift+Alt+C，清空该输入框
* 按下Shift+Alt+F，整理输入框
* 按下Shift+Alt+S，打开查询语句框

关于Tab键的具体用法请[点此跳转](#输入框侧边栏)
## 技能id
编辑器的第一个界面中可以设置技能的id，技能的id需满足以下要求
* 不是JavaScript的关键字
* 不得包含除了"$"和"_"之外的符号
* 不得包含无名杀的禁用词
---
## 技能类别
编辑器的第一个界面也可以设置技能的类别：
* 触发类
* 出牌阶段类
* 视为类
    * 使用类
    * 打出类
    * 使用打出类
* 纯mod类（计划加入）

### 触发类技能
就是发生了某个事件时，触发了某个时机，才可能发动的技能。换而言之，触发对应的时机，是发动对应技能的必要条件。  
以下是几个时机：
* 受到伤害后
* 回复体力后
* 判定牌生效后
* 回合开始前  

被动发动的技能大概率为触发技，占到三国杀的半壁江山。 

### 出牌阶段类技能
就是在仅有在出牌阶段才能主动发动的技能。主动发动是关键词。  
可能与之混淆的是出牌阶段开始时这类技能，虽然这类技能时机上包含“出牌阶段”，但是却不是主动发动，只是达到了某个节点而触发的技能。  
而这里说出牌阶段类技能，是主动发动的，一旦在出牌阶段内达成条件，可以自由决定发动还是不发动，体现在游戏上就是可以选择按下按钮还是不按下按钮。  
如孙权之【制衡】，华佗之【青囊】都是简单的出牌阶段类技能。

### 视为类技能
这类技能在编辑器中直接被分为三种，并与触发类与出牌阶段类并列，即使用类、打出类以及使用打出类。  
在三国杀中明确区分了使用和打出的概念，如有不了解的，请自行了解。  
在这里，这三类技能的区别就是用途不同，一类视为技用于应对使用特定的牌，另一类则用于应对打出特定的牌，还有一类是两者都可以应对。  
如甘宁之【奇袭】，赵云之【龙胆】，关羽之【武圣】都是视为类技能。

### 纯mod类技能（计划）
略

---

## 技能标签
技能标签经过扩展已经达到惊人的数量，我在较新的版本中已经进行了一轮扩充。现在除了三国杀各服的特殊技能标签外，加入国战的预亮、阵法技、主将技、副将技，加入了自动发动等标签。  
以下是几点注意事项
* 一旦选择了势力技，下方会出现一个特殊设置，中有势力列表供选择。
* 一旦选择了主将技或副将技，下方出现的特殊设置中会多出“鱼减半个”，这是阴阳鱼减少半个的缩写
* 一旦同时选择主将技和副将技，技能就必定无法成功生成，必定报错。
* 选择了强制发动的触发类技能，游戏会自动判定为锁定技，若需取消，请在后面选择非锁定技。
* 同时选择非锁定技和锁定技，最终效果为非锁定技。
* 第二页：**添加动画**的技能标签，第三页：**免疫封印效果**的技能标签，第四页：**国战**有关的技能标签，我们将不常用的标签：海外服的昂扬技、手杀谋攻篇的蓄力技、Key包的蓄能技放在最后。
* 技能标签按你所选择的顺序生成。
* 特殊缩写:
  * “每回合一次”，每回合限一次
  * “每轮一次”，每轮限一次
  * “标记持显”，是标记持续显示
  * “鱼减半个”，阴阳鱼减少半个
---

## 编写位置
提供三种编写位置，本体自带编写器、mt管理器、主代码。  
自己按需求选择即可。  
现版本中添加了生成技能的功能。现在无论哪种编写位置都可以生成技能。  
而在较早的版本中，需要在选择了主代码为编写位置的情况下才能生成，选择其他编写位置均无响应。

---
## 编写介绍
### 输入窗口
技能编辑器提供三个可输入的窗口:
* 限制条件
* 技能效果
* 触发时机  

### 基本符号
#### 算数运算符
|符号|名称|写法|
|:-:|:-:|:-:|
|+|加法运算符|加|
|-|减法运算符|减|
|*|乘法运算符|乘、乘以|
|/|除法运算符|除以|
|%|取模运算符|取模、模|
|++|自增运算符|自增|
|--|自减运算符|自减|

#### 比较运算符
|符号|名称|写法|
|:-:|:-:|:-:|
|==|相等运算符|是、为、等于、相等于|
|===|严格相等运算符|真等于、严格等于、严格相等于|
|!=|不等于运算符|不是、不为、不等于|
|!==|严格不等于运算符|真不等于、严格不等于|
|>|大于运算符|大于|
|<|小于运算符|小于|
|>=|大于等于运算符|大于等于、大等、不小于|
|<=|小于等于运算符|小于等于、小等、不大于|

#### 逻辑运算符
|符号|名称|写法|
|:-:|:-:|:-:|
|\|\||逻辑或运算符|或者、逻辑或|
|&&|逻辑且运算符|并且、且、逻辑且|
|!|逻辑非运算符|逻辑非|

#### 位运算符
|符号|名称|写法|
|:-:|:-:|:-:|
|\||位或运算符|位或、OR|
|&|位与运算符|位与、AND|
|~|位非运算符|位非、NOT|
|^|异或运算符|异或、XOR|
|<<|左移运算符|左移|
|>>|右移运算符|右移|

#### 赋值运算符
|符号|名称|写法|
|:-:|:-:|:-:|
|=|基本赋值运算符|令为|
|+=|加法赋值运算符|加等|
|-=|减法赋值运算符|减等|
|*=|乘法赋值运算符|乘等、乘以等|
|/=|除法赋值运算符|除等、除以等|
|%=|取模赋值运算符|模等、取模等|
|\|=|位或赋值运算符|位或等|
|&=|位与赋值运算符|位与等|
|~=|位非赋值运算符|位非等|
|^=|异或赋值运算符|异或等|
|<<=|左移赋值运算符|左移等|
|>>=|右移赋值运算符|右移等|

#### 其他运算符
|符号|名称|写法|
|:-:|:-:|:-:|
|.|属性(成员)访问操作符|访|
|//|单行注释符|注释、单行注释|



### 基础语法
输入框的基础语法有
* **声明变量**  
变量 变量名 令为 初始值
* **调用方法**  
对象 方法 参数1 参数2 ...  
* **条件语句1**  
如果  
布尔表达式  
那么  
分支开始   
代码块  
分支结束
* **条件语句2**  
否则  
分支开始  
分支结束
* **其他分支语句**  
一下语句和js写法相同
  * **switch分支语句:**  
  * **for-;;循环语句**
  * **for-in循环语句**
  * **for-of循环语句**
  * **while循环语句**
  * **do-while循环语句**



以下是一些实例(//后表示翻译后的语句)
```
声明变量:
变量 x 令为 伤害点数
//var x = trigger.num
块级变量 y 令为 伤害点数
//let y = trigger.num
块变 _y 令为 伤害点数
//let _y = trigger.num
常量 z 令为 伤害点数
//const z = trigger.num
```
```
调用方法:
你 摸牌 一张
//player.draw(1)

你 摸牌或回复体力值 三张 一点
//player.chooseDrawRecover(1,2)
```
```
条件语句:
如果
你 已受伤
那么
分支开始
你 回复体力值 一点
分支结束
否则
分支开始
你 摸牌 两者
分支结束
//if(player.isDamaged()){
//    player.recover(1)
//}
//else{
//    player.draw(2)
//}
```
输入框以行为单位，每行只能有一个对象调用方法，另一个对象则被认定为参数。基于此，我给出一些支持的写法和不支持的写法。

```
支持:
你摸一张牌  √
你回复一点体力  √
你的体力上限
大于
你的体力值  √
你受到伤害后 √
一名角色出牌阶段开始时  √

不支持:
你摸一张牌 回复一点体力  ×
你的体力上限大于体力值  ×
你受到伤害后 一名角色出牌阶段开始时 ×
```
这一特点更准确的说法是：`对象名+方法名`（这个方法一般是需填入参数的）其后的都认为是参数，都会以“,”相连。  
因此,如果需要在括号里用对象的某个属性,可以用写成`对象名+访+属性名`。  
比如  
```
不加“访”：
你 摸牌 你 体力
//player.draw(player,hp) ×
你 摸牌 你 储存 xxx
//player.draw(player,storage,xxx) ×
加“访”：
你 摸牌 你 访 体力
//player.draw(player.hp) √
你 摸牌 你 访 储存 访 xxx
//player.draw(player.storag.xxx) √

```

了解输入框的基本语法可以更好的检查语句的正确性。

### 指令
输入框内置了许多指令，下列是一些共用指令的适配情况  
|名称|作用|适用|
|:-:|:-:|:-:|
|整理|将用户输入的语言尽可能转化为适配编辑器的语言|所有|
|同上|复制上一行的内容|所有|
|同下|复制下一行的内容|所有|
|清空|清空输入中的所有内容|所有|
|本技能id|快速获取技能的id|所有|
|继承|快速获取已有技能的相应内容|限制条件&技能效果|
|新如果|自动生成条件语句1|限制条件&技能效果|
|新否则|自动生成条件语句2|限制条件&技能效果|
|如果*n|快速生成n个条件语句1|限制条件&技能效果|
|花色分支|生成花色相关的switch语句|限制条件&技能效果|
|switch-case*n|生成switch语句|限制条件&技能效果|
|for-;;|生成for-;;循环|限制条件&技能效果|
|for-in|生成for-in循环|限制条件&技能效果|
|for-of|生成for-of循环|限制条件&技能效果|
|do-while|生成do-while循环|限制条件&技能效果|
|while-|生成while循环|限制条件&技能效果|



下面是指令的用法示例：
```
示例:
你摸一张牌 整理

预期效果:
你 摸牌 一张
```
```
示例:
你摸一张牌
同上

预期效果:
你摸一张牌
你摸一张牌
```
```
示例:
同下
你摸一张牌

预期效果:
你摸一张牌
你摸一张牌
```
```
示例:
你adsfawtgurhgpo 清空

预期效果(全部清空):
//无内容
```
```
示例(注意这里写技能id后要换行)
继承yiji
//这里换了行!

预期效果:
[在限制条件中写会复制yiji的filter内容]
[在技能效果中写会复制yiji的content内容]
```
```
示例:
新如果

预期效果:
如果
//这里写条件
那么
分支开始
//这里写效果
分支结束
```
```
示例:
新否则

预期效果:
否则
分支开始
//这里写效果
分支结束
```
```
示例:
如果*2

预期效果:
如果

那么
分支开始

分支结束
如果

那么
分支开始

分支结束
```
```
示例:
花色分支

预期效果:
变量 花色 令为 
分岔 ( 花色 ) 
分支开始
	情况 红桃 :
	分支开始
		
	分支结束
	打断
	情况 方片 :
	分支开始
		
	分支结束
	打断
	情况 黑桃 :
	分支开始
		
	分支结束
	打断
	情况 梅花 :
	分支开始
		
	分支结束
	打断
分支结束
```
```
示例:
switch-case*2

预期效果:
switch (){
case ():{

}
break;
case ():{

}
break;
default:{

};break;
}
```
```
示例:
for-;;

预期效果:
for( 块变 i 令为 0 ; i< ; i++ ){

}
```
```
示例:
for-in

预期效果:
for( 常量 k in  ){

}
```
```
示例:
while-

预期效果:
while(  ){

}
```
```
示例:
do-while

预期效果:
do{

}
while(  )
```
注意:文中//跟着的内容用于解释,在实际使用中为空哦
### 输入框侧边栏

我在限制条件、技能效果、触发时机三个输入框设置了侧边栏。侧边栏可以便捷的输入指令和查询一些用法示例。

|侧边栏项|功能|
|:--:|:--:|
|整理|整理指令一样的效果，将用户语句转化为编辑器可识别的语句|
|清空|快速清空该输入框的所有内容|
|替换|迅速的将一些字符替换成另一些字符|
|"本技能id"|快速输入带引号的id|
|查询语句|可以查询相关的一些示例语句|

对于查询语句，你可以在某一行按下Tab键，便可以选中该行，我们尝试根据查询语句中的样例补全它。


[点击此处跳转观看视频](https://www.bilibili.com/video/BV1U5YYeEEMo/?share_source=copy_web&vd_source=aee52d36faeb2629aa310872aa1f1da5)

### 输入框转化规则

从输入框传入的文字将会遵循以下步骤尝试编写为技能:

1. 切行
2. 分词
3. 翻译
4. 连接
5. 组装
6. 合成

### 切行
这一步做两件事：
1. 以换行符(\n)为标准,切割传入的文本
2. 丢弃以"/\*"为开头并以"\*/"结尾的行、空行

### 分词
这一步按照以下流程：
1. 判断该行是否为全英文，若是，则传递原行
2. 每一行按空格和制表符分割为一个一个的词语
3. 判断分割后的含中文的词语，若这些中文均带有英文引号（单双反），则改为传递原行

### 翻译
这一步按照以下流程：
1. 判断是否传递的原行，若是，则该行跳过翻译流程
2. 尝试翻译词语，先直接从字典中查询，然后删除其中所有“的”字再次查询，若仍旧没有查询到，则保留原形
3. 对于有“;denyPrefix”的词，在句首加一个“!”
4. 对于有“;intoFunctionWait”的词，按“;”分割，分成方法部分和参数部分，参数部分放在句子最后
5. 检测是否有“;intoFunction”的词，按“;”分割，分成方法部分和参数部分，参数部分紧跟方法

### 连接
略

### 组装
略

### 合成

---
## 限制条件输入框  
### 语法规则
限制条件输入框遵循如下规则：  
- 限制条件输入框在组装过程中先会尝试将输入的语句划分为若干个语段
- 对于每个语段，都会尝试转化为`if(!(condition)) return false`的形式，如果不能，则保留原样
- 之后会将独占一行的` || `或者` && `的前后换行符`\n`去除
- 最后检测`if(\n condition \n )\n{`这三处换行符`\n`并去除

以下是几个实例(//表示翻译后的语句)  

#### 单一布尔表达式
```
你 体力值 大于 3
//if(! (player.hp > 3)) return false;

你 体力值
大于
你 手牌数
//if(! (player.hp>player.countCards("h")))  return false; 
```

#### 复杂布尔表达式
```
你 体力值 大于 3
或者
你 体力值
大于
你 手牌数
//  if(! (player.hp > 3 || player.hp > player.countCards("h"))) return false;
```

#### 条件语句
```
如果
你 体力值 大于 3
或者
你 体力值
大于
你 手牌数
那么
分支开始
    不发动
分支结束
//  if(! (player.hp > 3 || player.hp > player.countCards("h"))){
//    return false;
//  } 
```
值得注意的点是，遇到<,<=,>=,>,==,!=等**关系运算符**和逻辑运算符 **(||,&&)** 提行即可。  
整理指令会自动调整**并且**、**或者**这两个逻辑运算符，使得其符合标准。

### 特殊区域

#### 变量区
filter的变量区可以并且只能通过指令生成，具体见[私有指令](#私有指令)。  
在这个区域内，可以自由书写，不会试图转化为`if(!(condition))return false;`的形式。  
变量区没有设置闭合检测，请不要试图嵌套变量区！  
比如：
```
#变量 区头
变量 
x 令为 
3
x 自增
#变量 区尾
```

转化结果：  
```
var 
x = 
3
x++
```
### 私有指令
|名称|作用|
|:-:|:-:|
|新变量区|生成变量区|

一下是这些指令的示例： 

#### 新变量区
```
示例：新变量区

预期结果：
#变量区头

#变量区尾
```

---
## 技能效果输入框
### 私有指令
|名称|作用|
|:-:|:-:|
|新选择如果|条件为result.bool的条件语句1|
|新判定回调|生成判定回调区|
|新选择发动|生成选择发动区|

#### 新判定回调
```
示例：新判定回调

预期结果：
#判定回调区头
函数 参数表头 参数表尾 函数开始
	新步骤
	
函数结束
#判定回调区尾
```
### 选择模式
选择模式的有关数据存放在:新将包/js/editor/parameter.js中
EditorParameterList为角色方法的参数表
EditorParameter\[method\]是一个object数组 编辑器会逐个解析数组的每一项 生成对应的交互控件 
该object属性用途如下:
1. cn:string - 设置控件的中文
2. type:string - 设置控件类型
3. value:string - 该参数对应着事件的key

一个方法的注意事项都在EditorParameList\[method\][0]标出
1. mission:<methodCn> - 该方法的中文翻译
2. order:true - 参数是有序的
3. NapIndex:number[] - 非参数的索引 该值只能通过set设置

## 特殊触发时机列表
### 阶段类
|名称|时机|
|:-:|:-:|
|摸牌阶段(开始时)1|和〖突袭〗、〖恂恂〗时机相同|
|摸牌阶段(开始时)2|和〖裸衣〗、〖英姿〗时机相同，晚于摸牌阶段(开始时)1|

### 使用牌类
|名称|时机|
|:-:|:-:|
|使用牌时0||
|使用牌时1||
|使用牌时2||
|使用牌时||


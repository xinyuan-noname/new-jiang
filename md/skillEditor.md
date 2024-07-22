# 技能编辑器
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
1. 受到伤害后
2. 回复体力后
3. 判定牌生效后
4. 回合开始前  

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
如甘宁之【奇袭】，赵云之【龙胆】，关羽之红牌当【杀】的神技都是视为类技能。

### 纯mod类技能（计划）
略

---

## 技能标签
技能标签经过扩展已经达到惊人的数量，我在较新的版本中已经进行了一轮扩充。现在除了三国杀各服的特殊技能标签外，加入国战的预亮、阵法技、主将技、副将技，加入了自动发动等标签。  
以下是几点注意事项
* 一旦选择了势力技，下方会出现一个特殊设置，中有势力列表供选择。
* 一旦选择了主将技或副将技，下方出现的特殊设置中会多出“鱼减半个”，这是阴阳鱼减少半个的缩写
* 一旦同时选择主将技和副将技，技能就必定无法成功生成，必定报错。

---

## 编写位置
提供三种编写位置，本体自带编写器、mt管理器、主代码。  
自己按需求选择即可。  
在较新版本中添加的生成技能的功能，需要在选择了主代码的情况下，其他编写位置均无响应。

---
## 发动条件
发动条件的是每行只能有一个主语
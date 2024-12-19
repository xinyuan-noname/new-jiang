# 新将包
## 原创函数
### 文件相关
#### game.xjb_loadAPI(suc,fail,branch)
用于引入xjb_xyAPI并配置
#### game.xjb_loadAPI_PR()
引入xjb_xyAPI并配置,下载的来源为PR分支
### 交互相关
分为一般的和promise版的，promise写起来更加方便。
下面是一些新将包的promise交互框写法。
#### 确认框
```
const {result,bool,chosen} = await game.xjb_create.promise.alert(message);
```
## 常用量
### 技能相关
- `lib.xjb_skillDirectory`(Object<string,string>)：技能信息表。
  - Key  `id`
  - Val `〖中文名〗(id)info`
- `lib.xjb_skillNameMap`(Object<string,string>)：技能名映射表
  - Key `id`
  - Val `〖中文名〗(id)`
- `lib.xjb_skillList`(string[])：技能id集，所有武将技能id的集合
## 配置

## 声明
本仓库的扩展包图片资源均来自于网络，如涉及侵权问题，请联系作者，我将及时删除！  
联系方式
qq：1580163778

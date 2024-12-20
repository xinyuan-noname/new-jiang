## 常用函数

### UI相关
#### ui.xjb_hideElement(node)
隐藏一个元素node。
#### ui.xjb_showElement(node)
令以ui.xjb_hideElement隐藏的元素显示。

### 交互相关
分为一般的和promise版的，promise写起来更加方便。
下面是一些新将包的promise交互框写法。
#### 确认框
```
const {result,bool,chosen} = await game.xjb_create.promise.alert(message);
```

### 文件相关
#### game.xjb_loadAPI(suc,fail,branch)
用于引入xjb_xyAPI并配置
#### game.xjb_loadAPI_PR()
引入xjb_xyAPI并配置,下载的来源为PR分支



## 常用量
### 技能相关
- `lib.xjb_skillDirectory(Object<string,string>)`：技能信息表。
  - Key  `id`
  - Val `〖中文名〗(id)info`
- `lib.xjb_skillNameMap(Object<string,string>)`：技能名映射表
  - Key `id`
  - Val `〖中文名〗(id)`
- `lib.xjb_skillList(string[])`：技能id集，所有武将技能id的集合
## 配置
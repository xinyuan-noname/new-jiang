## 常用函数

### UI相关
#### ui.xjb_hideElement(node)
隐藏一个元素node。
#### ui.xjb_showElement(node)
令以ui.xjb_hideElement隐藏的元素显示。

### 交互相关
分为一般的和promise版的，promise写起来更加方便。
下面是一些新将包的promise交互框写法。
#### 警告框
``` js
await game.xjb_create.promise.alert(message);
```
#### 确认框
``` js
const { bool } = await game.xjb_create.promise.confirm(message);
```
#### 输入框
``` js
const { result, bool } = await game.xjb_create.promise.prompt(title, defaultValue, placeholder);
```
#### 区间选数字框
``` js
const { result, bool } = await game.xjb_create.promise.range(title, setting, changeValue);
```
- title 对话框的标题
- setting 对话框的设置
  - max 上限
  - min 下限
  - value 默认值
- changeValue 当range控件值改变时 设置的回调函数 用于更新标题内容

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

### 灵力相关
- `xjb_lingliUser`：默认灵力使用者。
## 配置
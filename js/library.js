let siyan = {
   height: "442.04px",
   width: "457.21px"
}
let wuyan = {
   height: "442.04px",
   width: "537.21px"
}
let qiyan = {
   height: "442.04px",
   width: "727.21px"
}
export const xjb_library = {
   intro: {
      "mingxie": {
         headline: "鸣谢",
         writer: "",
         content: `鸣谢B龇牙哥B对本扩展的推荐。 n
            鸣谢B智慧B的大力支持。n
            鸣谢B白给的军师B大力支持。n
            鸣谢B文和先生B对审批群的帮助。 n
            鸣谢B没有缓冲B提供的称号。 n
            鸣谢B阿巴～阿巴B对扩展问题的热心帮助。 n
            鸣谢B杀友们B的bug反馈。 n`,
         style: siyan
      },
      "disk": {
         headline: "网盘",
         writer: "",
         content: `
            扩展包:新将包 n
            B群号:n
            ぇ682507990ぇhttps://qm.qq.com/q/L5Tg72KtWIこ n
            B百度网盘:n
            ぇhttps://pan.baidu.com/s/1BPnI6Bx5Sufc1hbnnabL0g?pwd=3qn1ぇhttps://pan.baidu.com/s/1BPnI6Bx5Sufc1hbnnabL0g?pwd=3qn1こ n
            B123云盘:n
            ぇhttps://www.123pan.com/s/Qwfujv-cAybh.htmlぇhttps://www.123pan.com/s/Qwfujv-cAybh.htmlこn
            `,
         style: wuyan
      },
      "qzj": {
         headline: "强制技",
         writer: "",
         content:
            `B强制技B(qzj):一种特殊的主动技。n 
             B特性B:使技能目标该回合所有技能数据清空。n
             B提示B:请不要于此时用游戏自带编辑器编辑扩展，防止数据丢失！`,
         style: siyan
      },
      "remnantArea": {
         headline: "残区",
         writer: "",
         content:
            `
               A残区Aア(remnantArea)アn
               B概念B:n
               一种特殊的区域(s)，在该区域内存放着残牌。n
              B特性B:n
              1.一名角色的判定阶段开始前，其残区中每有两张同名的牌，且该牌可使用对自己使用，则其移去这两张牌，对自己使用一张同名的实体牌。n
              2.残区中的牌不可被使用，不可被打出。n              
               B使用残牌B:n
               一名角色使用残牌意味着:在其残区中置入和使用的残牌同名的牌。
               `,
         style: wuyan
      },
      "xjb_lingli": {
         headline: "灵力",
         writer: "",
         content: `
            B一些全局函数B n
            ア1. window.xjb_lingli.daomo.test(player)アn
            这个函数用于检测player是否拥有导魔介质n
            2.
            `,
         style: wuyan
      },
      "hun_system": {
         headline: "魂币系统",
         writer: "",
         content: `
            魂币系统是一种交换系统，有如下功能：n
            A商店n
            用于交易特殊卡牌，现对金币、铜币添加了防伪标记。n
            A变身n
            使用后，ま变成对应的武将ま实际上是获得一个随从ら，自带装备和卡牌。当一名变身武将死亡后才可变身为另外的武将。n
            A养成n
            点击养成功能的各选项即开始养成。n
            A维持魂币系统：n
            在使用系统功能时，会消耗系统能量。n
            消费魂币会让系统获得能量。n
            在刘徽-祖冲之项目投入魂币会以较高的概率转化为能量。n
            清零魂币则以最高概率转化为能量。n
            n
            A获得魂币：n
            B打卡B：n
            打卡点可用于抽奖，每日登录即赠送一个打卡点。
            投资刘徽-祖冲之项目也可能获得打卡点。n
            B对局B：n
            你的回合内每有一名角色死亡，则你获得1个魂币；n
            ま你造成一次重伤ま造成的伤害大于1ら，则你获得一个魂币。n
            B解锁称号B：n
            获得一个称号则可获得50个魂币，称号只有在打开扩展后才显示，于角色进度查询中可以查看更多内容。n
            B超值抽奖B:n
            可以获得包括魂币在内的奖品。n
            B回收技能B：n
            详见可以在养成功能-回收技能，每个技能5魂币。n
            B两种货币B：n
            场上角色累积使用牌、打出牌、造成伤害的分数达到500，牌堆中便添加一张【铜币】；
            场上角色累积使用牌、打出牌、造成伤害的分数达到1500，牌堆中便添加一张【金币】
            `,
         style: siyan
      },
      "skill_X": {
         headline: "X技",
         writer: "",
         content: `
            AX技Aア(skill_X)ア:n
            为方便独立出来的技能。每一个数字对应一个效果。一般和アplayer.fc_Xア一起使用。n
            A player.fc_X A:X技的数据处理器。用法如下:n
             1.B数字类参数B，一个数字只对应着一项事件(摸牌、恢复体力、失去体力等等)，可以连写，会依次执行。n
             2.B布尔类参数B，布尔用于确认是否选择角色。アtrueア→令角色执行事件，アfalseア→アonlymeア角色执行事件。 n
             3.B数组类参数B，数组的每一项和数字对应，并决定着事件的数值。n            
             4.B字符串类参数B，当这类参数为如下所提到的，会有如下效果:n
             ①アnoskill_tempア:强制技效果；n
             ②アbaiban_tempア:执行角色该回合白板；n
             ③アusechenSkillア:使用名臣技；n
             5.B对象类参数B，其键有如下所提到的，会有如下效果:n
            ①アnatureア:数组，为伤害设置属性；n
            ②アexpireア:对象，为アtempSkillア设置期限;n
            ③アskillsア:数组，设置获得的技能;n
            ④アidentityア:数组，设置成为的身份；n
            ⑤アawakenア:数组，设置废除的技能；n
            ⑥アonlymeア:数组，设置アonlymeア角色。n   
            n                       
            `,
         style: siyan
      },
   },
   poem: {
      "短歌行": {
         headline: "短歌行",
         writer: "两汉 建安 曹操",
         content: `
对酒当歌，人生几何！譬如朝露，去日苦多。慨当以慷，忧思难忘。何以解忧？唯有杜康。青青子衿，悠悠我心。但为君故，沉吟至今。呦呦鹿鸣，食野之苹。我有嘉宾，鼓瑟吹笙。
明明如月，何时可掇？忧从中来，不可断绝。越陌度阡，枉用相存。契阔谈讌，心念旧恩。月明星稀，乌鹊南飞。绕树三匝，何枝可依？山不厌高，海不厌深。周公吐哺，天下归心。 
`,
         style: siyan
      },
      "观沧海": {
         headline: "观沧海",
         writer: "两汉 建安 曹操",
         content: `
东临碣石，以观沧海。
水何澹澹，山岛竦峙。
树木丛生，百草丰茂。
秋风萧瑟，洪波涌起。
日月之行，若出其中；
星汉灿烂，若出其里。
幸甚至哉，歌以咏志。
`,
         style: siyan
      },
      "龟虽寿": {
         headline: "龟虽寿",
         writer: "两汉 建安 曹操",
         content: `
神龟虽寿，犹有竟时。
腾蛇乘雾，终为土灰。
老骥伏枥，志在千里。
烈士暮年，壮心不已。
盈缩之期，不但在天；
养怡之福，可得永年。
幸甚至哉，歌以咏志。
`,
         style: siyan
      },
      "白马篇": {
         headline: "白马篇",
         writer: "两汉 建安 曹植",
         content: `
白马饰金の羁，连翩西北驰。
借问谁家子，幽并游侠儿。
少小去乡の邑，扬声沙漠垂。
宿昔秉良弓，の楛の矢何参差。
控弦破左的，右发摧月支。
仰手接飞の猱，俯身散马蹄。
狡捷过猴猿，勇の剽若豹の螭。
边城多警急，虏骑数迁移。
羽の檄从北来，厉马登高堤。
长驱蹈匈奴，左顾凌鲜卑。
弃身锋刃端，性命安可怀？
父母且不顾，何言子与妻！
名编壮士籍，不得中顾私。
捐躯赴国难，视死忽如归！
`,
         style: wuyan
      },
      "铜雀台赋": {
         headline: "铜雀台赋",
         writer: "两汉 建安 曹植",
         content: `
从明后而嬉游兮，登层台以娱情。
见太府之广开兮，观圣德之所营。n
建高门之の嵯峨兮，浮双阙乎太清。
立中天之华观兮，连飞阁乎西城。n
临の漳水之长流兮，望园果之滋荣。
仰春风之和穆兮，听百鸟之悲鸣。n
天云の垣其既立兮，家愿得而获の逞。
扬仁化于宇内兮，尽肃恭于上京。n
惟桓文之为盛兮，岂足方乎圣明！
休矣美矣！惠泽远扬。n
翼佐我皇家兮，宁彼四方。
同天地之规量兮，齐日月之の晖光。n
永贵尊而无极兮，等年寿于东王。
`,
         style: qiyan
      },
      "洛神赋": {
         headline: "洛神赋",
         writer: "魏晋 黄初 曹植",
         content: `
    黄初三年，余朝京师，还济洛川。古人有言：斯水之神，名曰宓妃。感宋玉对楚王神女之事，遂作斯赋。其辞曰：n
    余从京域，言归东の藩，背伊阙，越っ4huán轘の辕，经通谷，陵景山。日既西倾，车の殆马烦。尔乃税驾乎の蘅の皋，の秣驷乎芝田，容与乎阳林，流の眄乎洛川。于是精移神の骇，忽焉思散。俯则未察，仰以殊观。の睹一丽人，于岩之畔。乃援御者而告之曰：“尔有の觌于彼者乎？彼何人斯，若此之艳也！”御者对曰：“臣闻河洛之神，名曰宓妃。然则君王之所见也，无乃是乎！其状若何？臣愿闻之。”n
    余告之曰：其形也，翩若惊鸿，婉若游龙。荣の曜秋菊，华茂春松。の髣の髴兮若轻云之蔽月，飘の飖兮若流风之回雪。远而望之，皎若太阳升朝霞；迫而察之，灼若芙の蕖出渌波。の秾纤得衷，修短合度。肩若削成，腰如约素。延颈秀项，皓质呈露。芳泽无加，铅华弗御。云の髻峨峨，修眉联娟。丹唇外朗，皓齿内鲜。明眸善の睐，の靥辅承权。の瓌姿艳逸，仪静体闲。柔情绰态，媚于语言。奇服旷世，骨像应图。披罗衣之璀の粲兮，の珥瑶碧之华の琚。戴金翠之首饰，の缀明珠以耀躯。践远游之文履，曳雾绡之轻の裾。微幽兰之芳の蔼兮，步の踟の蹰于山の隅。于是忽焉纵体，以遨以嬉。左倚采の旄，右荫桂旗。の攘皓の腕于神浒兮，采の湍の濑之玄芝。n
    余情悦其淑美兮，心振荡而不怡。无良媒以接欢兮，托微波而通辞。愿诚素之先达兮，解玉佩以要之。の嗟佳人之信修兮，羌习礼而明诗。抗の琼の珶以和予兮，指潜渊而为期。
   执眷眷之款实兮，惧斯灵之我欺。感交甫之弃言兮，怅犹豫而狐疑。收和颜而静志兮，申礼防以自持。n
    于是洛灵感焉，の徙の倚の彷の徨。神光离合，乍阴乍阳。の竦轻躯以鹤立，若将飞而未翔。践っ椒涂之郁烈，步の蘅の薄而流芳。超长吟以永慕兮，声哀厉而弥长。尔乃众灵杂沓，命俦啸侣。或戏清流，或翔神渚，或采明珠，或拾翠羽。从南湘之二妃，携汉滨之游女。叹匏瓜之无匹兮，咏牵牛之独处。扬轻の袿之の猗靡兮，の翳修袖以延の伫。体迅飞の凫，飘忽若神。凌波微步，罗袜生尘。动无常则，若危若安；进止难期，若往若还。转の眄流精，光润玉颜。含辞未吐，气若幽兰。华容婀娜，令我忘餐。于是屏の翳收风，川后静波。冯\u5937鸣鼓，女娲清歌。腾文鱼以警乘，鸣玉の銮以偕逝。六龙の俨其齐首，载云车之容の裔。鲸の鲵の踊而夹の毂，水禽翔而为卫。于是越北の沚，过南冈，の纡素领，回清扬。动朱唇以徐言，陈交接之大の纲。恨人神之道殊兮，怨盛年之莫当。抗罗の袂以掩涕兮，泪流の襟之浪浪。悼良会之永绝兮，哀一逝而异乡。无微情以效爱兮，献江南之明の珰。虽潜处于太阴，长寄心于君王。忽不悟其所舍，怅神宵而蔽光。n
    于是背下陵高，足往神留。遗情想像，顾望怀愁。冀灵体之复形，御轻舟而上溯。浮长川而忘反，思绵绵而增慕。夜耿耿而不寐，沾繁霜而至の曙。命仆夫而就驾，吾将归乎东路。揽の騑の辔以抗策，怅盘桓而不能去。
`,
         style: wuyan
      },
      "赠白马王彪": {
         headline: "赠白马王彪",
         writer: "魏晋 黄初 曹植",
         content: `
A序n
黄初四年五月，白马王、任城王与余俱朝京师、会节气。到洛阳，任城王の薨。至七月，与白马王还国。后有司以二王归藩，道路宜异宿止，意毒恨之。盖以大别在数日，是用自の剖，与王辞焉，愤而成篇。n
   
   A一n
谒帝承明庐，逝将归旧疆。清晨发皇の邑，日夕过首阳。伊洛广且深，欲济川无梁。泛舟越洪涛，怨彼东路长。顾瞻恋城阙，引领情内伤。n

   A二n
太谷何寥廓，山树郁苍苍。霖雨泥我涂，流の潦浩纵横。中の逵绝无轨，改辙登高岗。の脩坂造云日，我马玄以黄。n

   A三n
玄黄犹能进，我思の郁以の纡。の郁の纡将何念，亲爱在离居。本图相与の偕，中更不克俱。の鸱枭鸣衡の轭，豺狼当路の衢。苍蝇间白黑，谗巧令亲疏。欲还绝无の蹊，揽の辔止の踟の蹰。n

   A四n
の踟の蹰亦何留？相思无终极。秋风发微凉，寒蝉鸣我侧。原野何萧条，白日忽西匿。归鸟赴乔林，翩翩厉羽翼。孤兽走索群，衔草不遑食。感物伤我怀，抚心长太息。n

   A五n
太息将何为，天命与我违。奈何念同生，一往形不归。孤魂翔故域，灵の柩寄京师。存者忽复过，亡の殁身自衰。人生处一世，去若朝露の晞。年在桑榆间，影响不能追。自顾非金石，の咄の唶令心悲。n

   A六n
心悲动我神，弃置莫复陈。丈夫志四海，万里犹比邻。恩爱苟不亏，在远分日亲。何必同衾帱，然后展の慇の懃。忧思成疾の疢，无乃儿女仁。仓っ2cù卒骨肉情，能不怀苦辛？n

   A七n
苦辛何虑思，天命信可疑。虚无求列仙，松子久吾欺。变故在斯须，百年谁能持？离别永无会，执手将何时？王其爱玉体，俱享黄发期。收泪即长路，の援笔从此辞。
`,
         style: wuyan
      },
      "燕歌行": {
         headline: "燕歌行",
         writer: "两汉 建安 曹丕",
         content: `
秋风萧瑟天气凉，草木摇落露为霜。
群燕辞归の鹄南翔。
念君客游多断肠，慊慊思归恋故乡，君为淹留寄他方。
贱妾茕茕守空房，忧来思君不敢忘，不觉泪下沾衣裳。
援琴鸣弦发清商，短歌微吟不能长。
明月皎皎照我床，星汉西流夜未央。
牵牛织女遥相望，尔独何辜限河梁。
`,
         style: qiyan
      },
      "蜀道难": {
         headline: "蜀道难",
         writer: "唐 天宝 李白",
         content: `
の噫の吁の嚱，危乎高哉！蜀道之难，难于上青天！蚕丛及鱼凫，开国何茫然！尔来四万八千岁，不与秦塞通人烟。西当太白有鸟道，可以横绝峨眉巅。地崩山摧壮士死，然后天梯石の栈相钩连。上有六龙回日之高标，下有冲波逆折之回川。黄鹤之飞尚不得过，猿の猱欲度愁攀の援。青泥何盘盘，百步九折の萦岩の峦。の扪っ4shēn参历井仰胁息，以手抚の膺坐长叹。n
问君西游何时还？畏途の巉岩不可攀。但见悲鸟号古木，雄飞雌从绕林间。又闻子规啼夜月，愁空山。蜀道之难，难于上青天，使人听此凋朱颜！连峰去天不盈尺，枯松倒挂倚绝壁。
飞湍瀑流争喧の豗，の砯崖转石万の壑雷。其险也如此，嗟尔远道之人胡为乎来哉！n
剑阁峥嵘而の崔の嵬，一夫当关，万夫莫开。所守或っ3fēi匪亲，化为狼与豺。朝避猛虎，夕避长蛇，磨牙の吮血，杀人如麻。锦城虽云乐，不如早还家。蜀道之难，难于上青天，侧身西望长の咨の嗟！
`,
         style: wuyan
      },
      "行路难": {
         headline: "行路难",
         writer: "唐 天宝 李白",
         content: ` 
A其一n
金樽清酒斗十千，玉盘珍羞直万钱。n
停杯投の箸不能食，拔剑四顾心茫然。n
欲渡黄河冰塞川，将登太行雪满山。n
闲来垂钓碧溪上，忽复乘舟梦日边。n
行路难！行路难！多歧路，今安在？n
长风破浪会有时，直挂云帆济沧海。n
n
A其二n
大道如青天，我独不得出。 n
羞逐长安社中儿，赤鸡白雉赌梨栗。n
弹剑作歌奏苦声，曳の裾王门不称情。n
淮阴市井笑韩信，汉朝公卿忌贾生。n
君不见昔时燕家重郭の隗，拥の篲折节无嫌猜。n
剧辛乐毅感恩分，输肝剖胆效英才。n
昭王白骨萦蔓草，谁人更扫黄金台？n
行路难，归去来！n
n
A其三n
有耳莫洗颍川水，有口莫食首阳の蕨。n
含光混世贵无名，何用孤高比云月？n
吾观自古贤达人，功成不退皆殒身。n
子胥既弃吴江上，屈原终投湘水の滨。n
陆机雄才岂自保？李斯税驾苦不早。n
华亭鹤の唳の讵可闻？上蔡苍鹰何足道？n
君不见吴中张翰称达生，秋风忽忆江东行。n
且乐生前一杯酒，何须身后千载名？ 
`,
         style: qiyan
      },
      "清平调": {
         headline: "清平调",
         writer: "唐 天宝 李白",
         content: `
A其一 n
云想衣裳花想容，春风拂っ4jiàn槛露华浓。 n
若非群玉山头见，会向瑶台月下逢。 n
A其二 n
一枝の秾艳露凝香，云雨巫山の枉断肠。n
借问汉宫谁得似，可怜飞燕倚新妆。 n
A其三 n
名花倾国两相欢，长得君王带笑看。n
解释春风无限恨，沉香亭北倚阑干。n
`,
         style: wuyan
      },
      "梦游天姥吟留别": {
         headline: "梦游天っ2mǔ姥吟留别",
         writer: "唐 天宝 李白",
         content: `
海客谈の瀛洲，烟涛微茫信难求；n
越人语天っ2mǔ姥，云霞明灭或可睹。n
天っ2mǔ姥连天向天横，势拔五岳掩赤城。n
天台四万八千丈，对此欲倒东南倾。n
我欲因之梦吴越，一夜飞度镜湖月。n
湖月照我影，送我至っ4shàn剡溪。n
谢公宿处今尚在，渌水荡漾清猿啼。n
脚著谢公の屐，身登青云梯。n
半壁见海日，空中闻天鸡。n
千岩万转路不定，迷花倚石忽已の暝。n
熊咆龙吟の殷岩泉，の栗深林兮惊层巅。n
云青青兮欲雨，水の澹の澹兮生烟。n
列缺霹雳，丘峦崩摧。n
洞天石の扉，の訇然中开。n
青冥浩荡不见底，日月照耀金银台。 n
の霓为衣兮风为马，云之君兮纷纷而来下。n
虎鼓瑟兮鸾回车，仙之人兮列如麻。n
忽魂の悸以魄动，恍惊起而长の嗟。n
惟觉时之枕席，失向来之烟霞。n
世间行乐亦如此，古来万事东流水。n
别君去兮何时还？且放白鹿青崖间，须行即骑访名山。n
安能摧眉折腰事权贵，使我不得开心颜！n
`,
         style: wuyan
      },
      "将进酒": {
         headline: "っ5qiāng将进酒",
         writer: "唐 天宝 李白",
         content: `
君不见，黄河之水天上来，奔流到海不复回。n
君不见，高堂明镜悲白发，朝如青丝暮成雪。n
人生得意须尽欢，莫使金の樽空对月。n
天生我材必有用，千金散尽还复来。n
の烹羊宰牛且为乐，会须一饮三百杯。n
の岑夫子，丹丘生，っ5qiāng将进酒，杯莫停。n
与君歌一曲，请君为我倾耳听。n
钟鼓の馔玉不足贵，但愿长醉不愿醒。n
古来圣贤皆寂寞，惟有饮者留其名。n
陈王昔时宴平乐，斗酒十千の恣欢の谑。n
主人何为言少钱，径须の沽取对君酌。n
五花马、千金の裘，呼儿将出换美酒，与尔同销万古愁。 
`,
         style: wuyan
      },
      "弃我去者": {
         headline: "宣州谢の朓楼の饯别校书叔云",
         writer: "唐 天宝 李白",
         content: `
弃我去者，昨日之日不可留；n
乱我心者，今日之日多烦忧。n
长风万里送秋雁，对此可以の酣高楼。n
蓬莱文章建安骨，中间小谢又清发。n
俱怀逸兴壮思飞，欲上青天揽明月。n
抽刀断水水更流，举杯消愁愁更愁。n
人生在世不称意，明朝散发弄扁舟。
`,
         style: wuyan
      },
   },
   article: {
      "过秦论": {
         headline: "过秦论",
         writer: "两汉 汉文帝 贾谊",
         content: `
   A上篇n
    秦孝公据の崤の函之固，拥の雍州之地，君臣固守以窥周室，有席卷天下，包举宇内，囊括四海之意，并吞八荒之心。当是时也，商君佐之，内立法度，务耕织，修守战之具，外连の衡而斗诸侯。于是秦人拱手而取西河之外。n
    孝公既没，惠文、武、昭襄蒙故业，因遗策，南取汉中，西举巴、蜀，东割膏の腴之地，北收要害之郡。诸侯恐惧，会盟而谋弱秦，不爱珍器重宝肥饶之地，以致天下之士，合从の缔交，相与为一。当此之时，齐有孟尝，赵有平原，楚有春申，魏有信陵。此四君者，皆明智而忠信，宽厚而爱人，尊贤而重士，约从离衡，兼韩、魏、燕、楚、齐、赵、宋、卫、中山之众。于是六国之士，有の甯越、徐尚、苏秦、杜赫之属为之谋，齐明、周最、陈の轸、召滑、楼缓、翟景、苏厉、乐毅之徒通其意，吴起、孙膑、带佗、の倪良、王廖、田忌、廉颇、赵の奢之伦制其兵。尝以十倍之地，百万之众，叩关而攻秦。秦人开关延敌，九国之师，の逡巡而不敢进。秦无亡の矢遗の镞之费，而天下诸侯已困矣。于是从散约败，争割地而赂秦。秦有余力而制其弊，追亡逐北，伏尸百万，流血漂橹；因利乘便，宰割天下，分裂山河。强国请服，弱国入朝。延及孝文王、庄襄王，享国之日浅，国家无事。n
    及至始皇，奋六世之余烈，振长策而御宇内，吞二周而亡诸侯，履至尊而制六合，执敲扑而鞭の笞天下，威振四海。南取百越之地，以为桂林、象郡；百越之君，俯首系颈，委命下吏。乃使蒙恬北筑长城而守藩篱，却匈奴七百余里；胡人不敢南下而牧马，士不敢弯弓而报怨。于是废先王之道，焚百家之言，以愚の黔首；の隳名城，杀豪杰；收天下之兵，聚之咸阳，销锋の镝，铸以为金人十二，以弱天下之民。然后践华为城，因河为池，据亿丈之城，临不测之渊，以为固。良将劲弩守要害之处，信臣精卒陈利兵而谁何。天下已定，始皇之心，自以为关中之固，金城千里，子孙帝王万世之业也。n
    始皇既没，余威震于殊俗。然陈涉の瓮の牖绳の枢之子，氓隶之人，而迁徙之徒也；才能不及中人，非有仲尼、墨翟之贤，陶朱、の猗顿之富；蹑足行伍之间，而倔起阡陌之中，率疲弊之卒，将数百之众，转而攻秦；斩木为兵，揭竿为旗，天下云集响应，赢粮而っ4yǐng景从。山东豪俊遂并起而亡秦族矣。n
    且夫天下非小弱也，雍州之地，崤函之固，自若也。陈涉之位，非尊于齐、楚、燕、赵、韩、魏、宋、卫、中山之君也；锄の櫌の棘矜，非の铦于钩の戟长の铩也；の谪の戍之众，非抗于九国之师也；深谋远虑，行军用兵之道，非及乡时之士也。然而成败异变，功业相反，何也？试使山东之国与陈涉度长の絜大，比权量力，则不可同年而语矣。然秦以区区之地，致万乘之势，序八州而朝同列，百有余年矣；然后以六合为家，崤函为宫；一夫作难而七庙の隳，身死人手，为天下笑者，何也？仁义不施而攻守之势异也。n
n
A中篇n
  秦灭周の祀，并海内，兼诸侯，南面称帝，以养四海。天下之士，の斐然向风。若是，何也？曰：近古之无王者久矣。周室卑微，五霸既灭，令不行于天下。是以诸侯力政，强凌弱，众暴寡，兵革不休，士民罢弊。今秦南面而王天下，是上有天子也。既元元之民冀得安其性命，莫不虚心而仰上。当此之时，专威定功，安危之本，在于此矣。n
    秦王怀贪鄙之心，行自奋之智，不信功臣，不亲士民，废王道而立私爱，焚文书而酷刑法，先诈力而后仁义，以暴虐为天下始。夫兼并者高诈力，安危者贵顺权，此言取与守不同术也。秦离战国而王天下，其道不易，其政不改，是其所以取之守之者无异也。孤独而有之，故其亡可立而待也。借使秦王论上世之事，并殷、周之迹，以制御其政，后虽有\u6deb骄之主，犹未有倾危之患也。故三王之建天下，名号显美，功业长久。n
    今秦二世立，天下莫不引领而观其政。夫寒者利の裋褐，而饥者甘の糟の糠。天下の嚣の嚣，新主之资也。此言劳民之易为仁也。向使二世有庸主之行而任忠贤，臣主一心而忧海内之患，の缟素而正先帝之过；裂地分民以封功臣之后，建国立君以礼天下；虚の囹の圄而免刑戮，去收の孥污秽之罪，使各反其乡里；发仓の廪，散财币，以振孤独穷困之士；轻赋少事，以佐百姓之急；约法省刑，以持其后，使天下之人皆得自新，更节修行，各慎其身；塞万民之望，而以盛德与天下，天下息矣。即四海之内皆欢然各自安乐其处，惟恐有变。虽有狡害之民，无离上之心，则不轨之臣无以饰其智，而暴乱之奸の弭矣。n
    二世不行此术，而重以无道：坏宗庙与民，更始作阿房之宫；繁刑严诛，吏治刻深；赏罚不当，赋敛无度。天下多事，吏不能纪；百姓困穷，而主不收恤。然后奸伪并起，而上下相遁；蒙罪者众，刑の戮相望于道，而天下苦之。自群卿以下至于众庶，人怀自危之心，亲处穷苦之实，咸不安其位，故易动也。是以陈涉不用汤、武之贤，不借公侯之尊，奋臂于大泽，而天下响应者，其民危也。n
    故先王者，见终始之变，知存亡之由。是以牧民之道，务在安之而已矣。下虽有逆行之臣，必无响应之助。故曰：“安民可与为义，而危民易与为非”，此之谓也。贵为天子，富有四海，身在于戮者，正之非也。是二世之过也。n

A下篇n
    秦兼诸侯山东三十余郡，の脩津关，据险塞，の缮甲兵而守之。然陈涉率散乱之众数百，奋臂大呼，不用弓戟之兵，の鉏の耰白梃，望屋而食，横行天下。秦人阻险不守，关梁不闭，长戟不刺，强弩不射。楚师深入，战于鸿门，曾无藩篱之难。于是山东诸侯并起，豪俊相立。秦使章の邯将而东征，章の邯因其三军之众，要市于外，以谋其上。群臣之不相信，可见于此矣。子婴立，遂不悟。借使子婴有庸主之材而仅得中佐，山东虽乱，三秦之地可全而有，宗庙之祀宜未绝也。n
    秦地被山带河以为固，四塞之国也。自缪公以来，至于秦王，二十余君，常为诸侯雄。此岂世贤哉？其势居然也。且天下尝同心并力攻秦矣，当此之世，贤智并列，良将行其师，贤相通其谋，然困于阻险而不能进，秦乃延入战而为之开关，百万之徒逃北而遂坏。岂勇力智慧不足哉？形不利，势不便也。秦小邑并大城，守险塞而军，高垒毋战，闭关据厄，荷戟而守之。诸侯起于匹夫，以利合，非有素王之行也。其交未亲，其下未附，名曰亡秦，其实利之也。彼见秦阻之难犯也，必退师。案土息民，以待其敝，收弱扶罢，以令大国之君，不患不得意于海内。贵为天子，富有四海，而身为禽者，其救败非也。n
    秦王足己而不问，遂过而不变。二世受之，因而不改，暴虐以重祸。子婴孤立无亲，危弱无辅。三主之惑，终身不悟，亡不亦宜乎？当此时也，世非无深虑知化之士也，然所以不敢尽忠指过者，秦俗多忌讳之禁也，——忠言未卒于口而身の糜没矣。故使天下之士倾耳而听，重足而立，阖口而不言。是以三主失道，而忠臣不谏，智士不谋也。天下已乱，奸不上闻，岂不悲哉！先王知壅蔽之伤国也，故置公卿、大夫、士，以饰法设刑而天下治。其强也，禁暴诛乱而天下服；其弱也，五伯征而诸侯从；其削也，内守外附而社稷存。故秦之盛也，繁法严刑而天下震；及其衰也，百姓怨而海内叛矣。故周王序得其道，千余载不绝；秦本末并失，故不能长。由是观之，安危之统相去远矣。n
    鄙谚曰：“前事之不忘，后事之师也。”是以君子为国，观之上古，验之当世，参之人事，察盛衰之理，审权势之宜，去就有序，变化因时，故旷日长久而社稷安矣。
`,
         style: wuyan
      },
      "述志令": {
         headline: "让县自明本志令",
         writer: "两汉 建安 曹操",
         content: `
  孤始举孝廉，年少，自以本非岩穴知名之士，恐为海内人之所见凡愚，欲为一郡守，好作政教，以建立名誉，使世士明知之；故在济南，始除残去秽，平心选举，违迕诸常侍。以为强豪所忿，恐致家祸，故以病还。n
  去官之后，年纪尚少，顾视同岁中，年有五十，未名为老。内自图之，从此却去二十年，待天下清，乃与同岁中始举者等耳。故以四时归乡里，于谯东五十里筑精舍，欲秋夏读书，冬春射猎，求底下之地，欲以泥水自蔽，绝宾客往来之望。然不能得如意。n
  后徵为都尉，迁典军校尉，意遂更欲为国家讨贼立功，欲望封侯作征西将军，然后题墓道言“汉故征西将军曹侯之墓”，此其志也。而遭值董卓之难，兴举义兵。是时合兵能多得耳，然常自损，不欲多之；所以然者，多兵意盛，与强敌争，倘更为祸始。故汴水之战数千，后还到扬州更募，亦复不过三千人，此其本志有限也。n
  后领兖州，破降黄巾三十万众。又袁术僭号于九江，下皆称臣，名门曰建号门，衣っ2pī被皆为天子之制，两妇预争为皇后。志计已定，人有劝术使遂即帝位，露布天下，答言“曹公尚在，未可也”。后孤讨禽其四将，获其人众，遂使术穷亡解の沮，发病而死。及至袁绍据河北，兵势强盛，孤自度势，实不敌之；但计投死为国，以义灭身，足垂于后。幸而破绍，枭其二子。又刘表自以为宗室，包藏奸心，乍前乍却，以观世事，据有当州，孤复定之，遂平天下。身为宰相，人臣之贵已极，意望已过矣。n
  今孤言此，若为自大，欲人言尽，故无の讳耳。设使国家无有孤，不知当几人称帝，几人称王！或者人见孤强盛，又性不信天命之事，恐私心相评，言有不逊之志，妄相の忖度，每用耿耿。齐桓、晋文所以垂称至今日者，以其兵势广大，犹能奉事周室也。《论语》云：“三分天下有其二，以服事殷，周之德可谓至德矣。”夫能以大事小也。昔乐毅走赵，赵王欲与之图燕。乐毅伏而垂泣，对曰：“臣事昭王，犹事大王；臣若获戾，放在他国，没世然后已，不忍谋赵之徒隶，况燕后嗣乎！”胡亥之杀蒙の恬也，恬曰：“自吾先人及至子孙，积信于秦三世矣；今臣将兵三十余万，其势足以背叛，然自知必死而守义者，不敢辱先人之教以忘先王也。”孤每读此二人书，未尝不怆然流涕也。孤祖、父以至孤身，皆当亲重之任，可谓见信者矣，以及子の桓兄弟，过于三世矣。n
  孤非徒对诸君说此也，常以语妻妾，皆令深知此意。孤谓之言：“顾我万年之后，汝曹皆当出嫁，欲令传道我心，使他人皆知之。”孤此言皆肝鬲之要也。所以勤勤恳恳叙心腹者，见周公有《金の縢》之书以自明，恐人不信之故。然欲孤便尔委捐所典兵众，以还执事，归就武平侯国，实不可也。何者？诚恐己离兵为人所祸也。既为子孙计，又己败则国家倾危，是以不得慕虚名而处实祸，此所不得为也。前朝恩封三子为侯，固辞不受，今更欲受之，非欲复以为荣，欲以为外援，为万安计。n
　 孤闻介推之避晋封，申胥之逃楚赏，未尝不舍书而叹，有以自省也。奉国威灵，仗の钺征伐，推弱以克强，处小而禽大。意之所图，动无违事，心之所虑，何向不济，遂荡平天下，不辱主命。可谓天助汉室，非人力也。然封兼四县，食户三万，何德堪之！江湖未静，不可让位；至于邑土，可得而辞。今上还阳夏、の柘、苦三县户二万，但食武平万户，且以分损谤议，ま少まshāo，稍稍ら减孤之责也。
`,
         style: wuyan
      },
      "隆中对": {
         headline: "隆中对",
         writer: "两汉 建安 诸葛亮",
         content: `
    自董卓以来，豪杰并起，跨州连郡者不可胜数。曹操比于袁绍，则名微而众寡。然操遂能克绍，以弱为强者，非惟天时，抑亦人谋也。n
   今操已拥百万之众，挟天子而令诸侯，此诚不可与争锋。孙权据有江东，已历三世，国险而民附，贤能为之用，此可以为援而不可图也。n
   荆州北据汉、沔，利尽南海，东连吴会，西通巴、蜀，此用武之国，而其主不能守，此殆天所以资将军，将军岂有意乎？益州险塞，沃野千里，天府之土，高祖因之以成帝业。刘璋暗弱，张鲁在北，民殷国富而不知存恤，智能之士思得明君。n
   将军既帝室之胄，信义著于四海，总揽英雄，思贤如渴，若跨有荆、益，保其岩阻，西和诸戎，南抚\u5937越，外结好孙权，内修政理；天下有变，则命一上将将荆州之军以向宛、洛，将军身率益州之众出于秦川，百姓孰敢不箪食壶浆以迎将军者乎？诚如是，则霸业可成，汉室可兴矣。
`,
         style: wuyan
      },
      "自表1": {
         headline: "自表",
         writer: "季汉 建兴 诸葛亮",
         content: `
    成都有桑八百株，薄田十五顷，子弟衣食，自有馀饶。至於臣在外任，无别调度，随身衣食，悉仰於官，不别治生，以长尺寸。若臣死之日，不使内有馀帛，外有赢财，以负陛下。
`,
         style: siyan
      },
      "出师表": {
         headline: "出师表",
         writer: "季汉 建兴 诸葛亮",
         content: `
    先帝创业未半而中道の崩の殂，今天下三分，益州疲弊，此诚危急存亡之秋也。然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。诚宜开张圣听，以光先帝遗德，恢の弘志士之气，不宜妄自菲薄，引喻失义，以塞忠の谏之路也。n
    宫中府中，俱为一体；陟罚臧否，不宜异同。若有作奸犯科及为忠善者，宜付有司论其刑赏，以昭陛下平明之理，不宜偏私，使内外异法也。n
    侍中、侍郎郭攸之、费祎、董允等，此皆良实，志虑忠纯，是以先帝简拔以遗陛下。愚以为宫中之事，事无大小，悉以咨之，然后施行，必能裨补の阙漏，有所广益。n
    将军向宠，性行の淑均，晓畅军事，试用于昔日，先帝称之曰能，是以众议举宠为督。愚以为营中之事，悉以咨之，必能使行阵和の睦，优劣得所。n
    亲贤臣，远小人，此先汉所以兴隆也；亲小人，远贤臣，此后汉所以倾の颓也。先帝在时，每与臣论此事，未尝不叹息痛恨于桓、灵也。侍中、尚书、长史、参军，此悉贞良死节之臣，愿陛下亲之信之，则汉室之隆，可计日而待也。n
    臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。先帝不以臣卑鄙，の猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。后值倾覆，受任于败军之际，奉命于危难之间，尔来二十有一年矣。n
    先帝知臣谨慎，故临崩寄臣以大事也。受命以来，の夙夜忧叹，恐托付不效，以伤先帝之明；故五月渡泸，深入不毛。今南方已定，兵甲已足，当奖率三军，北定中原，庶竭の驽の钝，の攘除奸凶，兴复汉室，还于旧都。此臣所以报先帝而忠陛下之职分也。至于の斟の酌损益，进尽忠言，则攸之、の祎、允之任也。n
    愿陛下托臣以讨贼兴复之效，不效，则治臣之罪，以告先帝之灵。若无兴德之言，则责攸之、祎、允等之慢，以彰其咎；陛下亦宜自谋，以の咨の诹善道，察纳雅言，深追先帝遗诏。臣不胜受恩感激。今当远离，临表涕零，不知所言。
`,
         style: qiyan
      },
      "诫子书": {
         headline: "诫子书",
         writer: "季汉 建兴 诸葛亮",
         content: `
    夫君子之行，静以修身，俭以养德。非澹泊无以明志，非宁静无以致远。夫学须静也，才须学也，非学无以广才，非志无以成学。\u6deb慢则不能励精，险躁则不能治性。年与时驰，意与日去，遂成枯落，多不接世，悲守穷庐，将复何及！
`,
         style: siyan
      },
      "诫外生书": {
         headline: "诫外生书",
         writer: "季汉 诸葛亮",
         content: `
    夫志当存高远，慕先贤，绝情欲，弃凝滞，使庶几之志，揭然有所存，恻然有所感；忍屈伸，去细碎，广咨问，除嫌吝，虽有淹留，何损于美趣，何患于不济。若志不强毅，意不慷慨，徒碌碌滞于俗，默默束于情，永窜伏于凡庸，不免于下流矣！ 
`,
         style: siyan
      },
      "为袁绍檄豫州": {
         headline: "为袁绍檄豫州",
         writer: "两汉 建安 陈琳",
         content: `
   左将军领豫州刺史郡国相守：盖闻明主图危以制变，忠臣虑难以立权。是以有非常之人，然后有非常之事，有非常之事，然后立非常之功。夫非常者，故非常人所拟也。の曩者强秦弱主，赵高执柄，专制朝权，威福由己，时人迫胁，莫敢正言，终有望\u5937之败，祖宗焚灭，污辱至今，永为世鉴。及の臻吕后季年，产、の禄专政，内兼二军，外统梁、赵，擅断万机，决事省禁，下凌上替，海内寒心。于是の绛侯、朱虚兴兵奋怒，诛\u5937逆暴，尊立太宗，故能王道兴隆，光明显融，此则大臣立权之明表也。n
    司空曹操祖父中常侍腾，与左の悺、徐の璜并作妖孽，の饕の餮放横，伤化虐民。父嵩，乞丐携养，因の赃假位，の舆金の辇璧，输货权门，窃盗鼎司，倾覆重器。操の赘の阉遗丑，本无の懿德，の僄狡锋协，好乱乐祸。幕府董统鹰扬，扫除凶逆。续遇董卓侵官暴国，于是提剑挥鼓，发命东夏。收罗英雄，弃の瑕取用，故遂与操同の谘合谋，授以の裨师，谓其鹰犬之才，爪牙可任。至乃愚の佻短略，轻进易退，伤\u5937折の衄，数丧师徒。幕府辄复分兵命锐，修完补の辑，表行东郡领兖州刺史，被以虎文，奖蹙威柄，冀获秦师一克之报。而操遂承资拔扈，肆行凶の忒，割剥元元，残贤害善。故九江太守边让，英才俊伟，天下知名，直言正色，论不阿の谄，身首被枭悬之诛，妻の孥受灰灭之咎。自是士林愤痛，民怨弥重，一夫奋臂，举州同声，故躬破于徐方，地夺于吕布，彷徨东の裔，の蹈据无所。幕府惟强干弱枝之义，且不登叛人之党，故复援の旌の擐甲，席卷起征，金鼓响振，布众奔沮，拯其死亡之患，复其方伯之位，则幕府无德于兖土之民，而有大造于操也。后会鸾驾反旆，群虏寇攻。时冀州方有北鄙之警，匪遑离局，故使从事中郎徐勋就发遣操，使缮修郊庙，翊卫幼主。操便放志，专行胁迁，当御者禁，卑侮王室，败法乱纪，坐领三台，专制朝政，爵赏由心，刑戮在口，所爱光五宗，所恶灭三族，群谈者受显诛，腹议者蒙隐戮，百の寮钳口，道路以目，尚书记朝会，公卿充员品而已。故太尉杨彪，典历二司，享国极位，操因缘の眦の睚，被以非罪，榜楚参并，五毒备至，触情任忒，不顾宪纲。又议郎赵の彦，忠谏直言，议有可纳。是以圣朝含听，改容加饰，操欲迷夺时明，杜绝言路，檀收立杀，不俟报闻。又梁孝王，先帝母昆，坟陵尊显，桑梓松柏，犹宜肃恭，而操帅将吏士，亲临发掘，破棺裸尸，掠取金宝，至令圣朝流涕，士民伤怀。操又特置发丘中郎将、摸金校尉，所遇の隳突，无の骸不露。身处三公之位，而行桀虏之态，污国虐民，毒施人鬼。加其细政苛惨，科防互设，罾缴充蹊，坑阱塞路，举手挂网罗，动足触机陷，是以兖、豫有无聊之民，帝都有の吁嗟之怨。历观载籍，无道之臣，贪残酷烈，于操为甚。n
    幕府方の诘外奸，未及整训，加の绪含容，冀可弥缝。而操豺狼野心，潜包祸谋，乃欲摧挠栋梁，孤弱汉室，除灭忠正，专为枭雄。往者伐鼓北征公孙瓒，强寇桀逆，拒围一年。操因其未破，阴交书命，外助王师，内相掩袭，故引兵造河，方舟北济。会其行人发露，瓒亦枭\u5937，故使锋芒挫缩，厥图不果。尔乃大军过荡西山，屠各左校，皆束手奉质，争为前登，犬羊残丑，消沦山谷。于是操师震慑，晨夜逋遁，屯据敖仓，阻河为固，欲以の螗の螂之斧，御隆车之隧。幕府奉汉威灵，折冲宇宙，长戟百万，胡骑千群，奋中黄、育、获之士，骋良弓劲弩之势，并州越太行，青州涉济、の漯，大军泛黄河而角其前，荆州下宛、叶而掎其后，雷霆虎步，并集虏庭，若举炎火以の焫飞蓬，覆沧海以沃の熛炭，有何不灭者哉？又操军吏士，其可战者，皆出自幽、冀，或故营部曲，咸怨旷思归，流涕北顾。其馀兖、豫之民，及吕布、张扬之遗众，覆亡迫胁，权时苟从，各被创痍，人为雠敌。若回の旆方の徂，登高罔而击鼓吹，扬素挥以启降路，必土崩瓦解，不俟血刃。方今汉室陵迟，纲维弛绝，圣朝无一介之辅，股の肱无折冲之势，方の畿之内，简练之臣皆垂头拓翼，莫所凭恃，虽有忠义之佐，胁于暴虐之臣，焉能展其节？又操持部曲精兵七百，围守宫阙，外托宿卫，内实拘执，惧其篡逆之萌，因斯而作。此乃忠臣肝脑涂地之秋，烈士立功之会，可不勖哉！n
    操又の矫命称制，遣使发兵，恐边远州郡过听绐与，强寇弱主违众旅叛，举以丧名，为天下笑，则明哲不敢也。即日幽、并、青、冀四州并进。书到，荆州勒见兵，与建忠将军协同声势，州郡各整戎马，罗落境界，举师扬威，并匡社稷，则非常之功于是乎著。其得操首者，封五千户侯，赏钱五千万。部曲偏の裨将校诸吏降者，勿有所问。广宣恩信，班扬符赏，布告天下，咸使知圣朝有拘逼之难，如律令。
`,
         style: siyan
      },
      "阿房宫赋": {
         headline: "阿房宫赋",
         writer: "唐 宝历 杜牧",
         content: `
    六王毕，四海一，蜀山の兀，っ1ē阿っ4páng房出。覆压三百余里，隔离天日。骊山北构而西折，直走咸阳。二川溶溶，流入宫墙。五步一楼，十步一阁；の廊腰の缦回，の檐牙高啄；各抱地势，钩心斗角。盘盘焉，の囷の囷焉，蜂房水の涡，の矗不知其几千万落。长桥卧波，未云何龙？复道行空，不の霁何虹？高低冥迷，不知西东。歌台暖响，春光融融；舞殿冷袖，风雨凄凄。一日之内，一宫之间，而气候不齐。n

    妃の嫔の媵の嫱，王子皇孙，辞楼下殿，の辇来于秦。朝歌夜弦，为秦宫人。明星の荧の荧，开妆镜也；绿云扰扰，梳晓の鬟也；渭流涨の腻，弃脂水也；烟斜雾横，焚の椒兰也。雷霆乍惊，宫车过也；の辘の辘远听，の杳不知其所之也。一肌一容，尽态极の妍，の缦立远视，而望幸焉。有不见者三十六年。燕赵之收藏，韩魏之经营，齐楚之精英，几世几年，の剽掠其人，倚叠如山。一旦不能有，输来其间。鼎っ5chēng铛玉石，金块珠の砾，弃の掷の逦の迤，秦人视之，亦不甚惜。n

    嗟乎！一人之心，千万人之心也。秦爱纷奢，人亦念其家。奈何取之尽の锱铢，用之如泥沙？使负栋之柱，多于南の亩之农夫；架梁之椽，多于机上之工女；钉头の磷磷，多于在の庾之の粟粒；瓦缝参差，多于周身之帛缕；直栏横っ4jiàn槛，多于九土之城郭；管弦の呕の哑，多于市人之言语。使天下之人，不敢言而敢怒。独夫之心，日益骄固。の戍卒叫，函谷举，楚人一の炬，可怜焦土！n

    呜呼！灭六国者六国也，非秦也；族秦者秦也，非天下也。嗟乎！使六国各爱其人，则足以拒秦；使秦复爱六国之人，则递三世可至万世而为君，谁得而族灭也？秦人不の暇自哀，而后人哀之；后人哀之而不鉴之，亦使后人而复哀后人也。
`,
         style: siyan
      },
   },
   lingli: {
      "魂的货币体系": {
         headline: "魂的货币体系",
         writer: "",
         content: `
            A魂的货币类型 n
            魂的世界中，有三种货币：魂币、打卡点和能量。 n
            魂币作为主要的支付手段，用于兑换需要的资源。 n
            打卡点作为沟通起魂币与能量的桥梁，两者的兑换关系是由打卡点与两者间的关系决定的。 n
            能量，反映着系统提供资源的能量。 n
            A基本的转化关系 n
            最重要的一条：1打卡点→520能量。 n
            打卡点与魂币间的兑换关系：由当日的魂币期望决定。 n
            魂币与能量的兑换比例(亦称第〇等率)，不予公布，大概为每日第一等率的1.3倍。n            
            A数据说明 n
            三等率以及浮流率是两个调控因子。n
            三等率的计算方式为：n
            第一等率=第〇等率/1.3;n
            等二等率=第〇等率/3;n
            等三等率=第〇等率/5;n
            浮流率的计算方式为：n
            浮流率=第〇等率*魂币量/能量量 n
            A魂币获取 n
            因击杀、重伤、满足条件、获得称号所获得的魂币不消耗能量。n
            因抽奖和使用铜币与金币而获得的魂币，会根据当前的浮流率扣除能量。具体来说，浮流率越低，扣除能量越高;浮流率越高，扣除能量越低。n
            A魂币花费 n
            解锁养成、变身、触屏击杀在内的功能花费的魂币不变。 n
            魂币商店出售的商品，受到能量与浮流率两个因素的调控。能量越高，则花费的价格越低；浮流率越高，则花费的价格也越高。n
            择木卡以及性转卡,只受到浮流率的调控.浮流率越高,价格越高. n
            A魂币清零 n
            对于魂币数介于0到50这一区间,清零魂币时获得的能量=第〇等率*魂币数-1 n
            对于魂币数介于50到500这一区间,清零魂币时获得的能量=第一等率*魂币数 n
            对于魂币数大于500这一区间,清零魂币时获得的能量=第二等率*魂币数+500 n
            对于魂币数小于0这一区间,清零魂币时失去的能量=abs(第〇等率*魂币数)+100 n
            A打卡点获取 n
            每日首次进入时,自动送3个打卡点 n
            刘徽-祖冲之项目中可以获得打卡点,投资额越大,获得的打卡点的概率越大 n
            以上两种方式获取打卡点均不消耗能量 n
            免费抽奖中获得打卡点需要消耗能量 n
            每日可获取的打卡点最大量为50点,多余的会以第一等率转化为能量 n
            A刘徽-祖冲之项目 n
            除花费魂币本身转化为能量,每个魂币以第二等率回馈能量 n
            A抽奖 n
            当能量为负,也没有魂币的时候,如果进行抽奖,系统会进行一次不消耗能量的抽奖。
            `,
         style: siyan
      },
      "灵力简论": {
         headline: "灵力简论",
         writer: "琪盎特儿",
         content: `
   A常见用语 n
   灵    アLingア n
   自然性 アProperty of value being natural numberア n
   进化性 アTemporarinessア n
   灵力  アLingliア n
   魔力  アMoliア n
   泛灵力 アPan-Lingliア n
   灵量  アAmount of Lingア n
   琪   アChア n
   牌能  アCア n
   命能  アHア n
   动魔子 アActive Moliア n
   静魔子 アPassive Moliア n
   能灵比 アEnergy-to-Amount ratio(Rea)ア n
   灵力场 アLingli Fieldア n
   灵颤  アImaginary Active Lingア n
   灵层  アLing Shell(S)ア n
   米   アmア  n
   赫兹  アHzア n
   A灵的基本属性 n
   1.灵的自然性:我们所定义的和灵有关的量，其绝对值必为自然数倍的最小单位量或者零，其他的数值是无意义的数值。n
   2.灵的进化性:目前关于灵的一切理论都是暂时的理论，灵会自我“进化”。n
   这是一种信念，因为那怕构建出灵的理论体系的人，也不知道他自己是否就是对的。但是，至少我们每一个人都能为之添砖加瓦。n
   nn
   A灵魔关系 n
   1.规定一:灵力和魔力统称为泛灵力。泛灵力的量，即灵力的量或者魔力的量，称为灵量。灵量最小单位量为1Ch。我们用字母L表示灵量。n
   将灵力和魔力统称为泛灵力，仿佛在说魔力只是一种特殊的灵力罢了。实际上，魔力地位并不逊于灵力。不可小看魔力。n
   2.规定二：灵理论中，能量的最小单位量为1C。n
   C称之为牌能，1C等于销毁一张基本牌变化的能量。-1C表示生成一张基本牌变化的能量。n
   H称为命能，减少一点体力/体力上限变化的能量为1H。相对的，增加一点体力/一点体力变化的能量为-1H。n
   且1H=2C n
   3.规定三:n
   若有1Ch泛灵力，其所带能量为1C/0，则其为1Ch魔力。n
   其中，1Ch魔力，所带能量为1C的称为动魔子，所带能量为0为静魔子。 n
   若有1Ch泛灵力，其所带能量为-1C，则其为1Ch灵力。n
   因此我们可以用单位的灵量的泛灵力所带的能量区分它们，我们把E/L称之为能灵比，用Rea表示，其可用于区分泛灵力。n
   Rea=1C/Ch则为动魔子，Rea=0则为静魔子，Rea=-1C/Ch则为灵力。   
   4.灵魔转化的情况: n
   我们用ΔE表示能量变化。 n
   情况1(1Ch动魔子→1Ch灵力): n
   转化关系:-ΔE=H=2C n     
   情况2(1Ch灵力→1Ch静魔子): n
   转化关系:-ΔE=-1C n
   以上两个转化关系只表示初末能量变化，在灵力变为魔力的过程中，会遵循能量守恒规则，伴随所提到的相应事件的发生。n
   值得注意的是，这里的能量变化，是多个事件的能量变化的累加效果，并不是一步到位的。而这些事件一般不会超过三个。  n
   nn
   A灵力场 n
   1.灵力来源于灵力场。灵力场被一种叫灵颤的物质划分为9层，称为灵层，灵层的符号是S。n
   九层依次记为:n
   S0，S1，S2，S3，S4，S5，S6，S7，S8。n
   2.这九层的灵量对应关系是：n
   S0→0Ch n
   S1→2Ch n
   S2→14Ch n
   S3→38Ch n
   S4→74Ch n
   S5→122Ch n
   S6→182Ch n
   S7→254Ch n
   S8→338Ch n     
   3.灵力场中，经过计算得出体积单位最小量为:n
   V=2.0943951×10^3m³n
   经过测量与计算，这九层的体积分别为:n
   S0→0V(一个点) n
   S1→1V n
   S2→7V n
   S3→19V n
   S4→37V n
   S5→61V n
   S6→91V n
   S7→127V n
   S8→169V n     
   经过计算可得，体力V与层数x间关系为：n   
   V(x)=0(x=0) n
   V(x)=3x²-3x+1(x>0) n
   推测：n
   灵力场的形状为一个半径为80m的半球体，每个V内容纳2Ch灵力，S1为半球形，S2-S8为壳形。n
   4.规定:灵力密度为D，D=L/V。n
   D=0.47746485261×10^-3Ch/m³n
   或 n
   D=2Ch/V。n
   灵力场中，灵力密度处处相等。n
   5.灵颤：在两个S间，有一个假想的物质在两个S间来回运动，我们把这种它叫做颤或灵颤，记为W，记8个颤分别为：n
   W1，W2，W3，W4，W5，W6，W7，W8。n
   6.颤会周期性的重复一个运动。我们用频率来表示它的运动快慢。如下：n
   W1:2520Hz n
   W2:420Hz n
   W3:210Hz n
   W4:140Hz n
   W5:105Hz n
   W6:84Hz n
   W7:70Hz n
   W8:60Hz n
   7.颤的频率的最小单位量为1Hz。 n
   8.灵动:n 
   灵颤的频率和灵颤左右层的灵力差之积为一个定值。即ΔLf=5040Ch·Hz。n
   规定：该定值称为灵力的迁移速率，简称灵动，符号为M。
   在灵动不变的情况下，灵颤变化得越频繁，则各层灵力差越小。n
   9.灵动确定原理:一旦环境确定，灵动的值便确定下来。n
   10.灵力场中，灵力差(右-左)分别为:n
   ΔL1=2Ch，ΔL2=12Ch，ΔL3=24Ch，ΔL4=36Ch，ΔL5=48Ch，ΔL6=60Ch，ΔL7=72Ch，ΔL8=84Ch。n
   如果W1左侧那一层的灵力为0Ch，灵力就会呈现像在2中所说的那种关系。n
   11.ΔLf=M推广：n
   灵力分界面上：n
   由ΔLf=M知，n
   (L外-L9)f=(M+M外)/2，n
   (L外-L9)f=(5040Ch/s+M外)/2，n
   故f=(5040Ch/s+M外)/2(L外-L9) n
   测得分界面上f恒为0 n
   可知场外灵动为M=-5040Ch/s n
   12.ΔL=M/f，又L=DV n
   故ΔVD=M/f n
   故ΔV=(M/D)/f n
   令α=M/D=(5040Ch/s)/(2Ch/V)=(2520Hz)·V n
   ΔV=α/f n
   根据该公式:n
   ΔV1=1V;n
   ΔV2=6V;n
   ΔV3=12Vn
   ΔV4=18V;n
   ΔV5=24V;n
   ΔV6=30V;n
   ΔV7=36V;n
   ΔV8=42V。n
   Δ(ΔV)=ΔV2-ΔV1=(α/f2)-(α/f1)=-α(Δf/f1f2) n
   即 Δ(ΔV)·f1f2=α(f1-f2)       n
   13.根据公式 n
   ΔL=M/f n
   ΔL=0 f→+∞ n
   W1 -1V·2520·f2=2520V(2520-f2) n
     -f2=2520-f2 f2无解 n
   W2 -6V·420·f2=2520V(420-f2) n
     -f2=420-f2  f2无解 n
   同理，可知W3-W8均无解n   
   综上，灵力差为0时无解n
   又，灵力差必须为整数倍n
   所以，n
   灵力饱和状态:n
   S0:0Ch,n
   S1:2Ch,n
   S2:4Ch,n
   S3:6Ch,n
   S4:8Ch,n
   S5:10Ch,n
   S6:12Ch,n
   S7:14Ch,n
   S8:16Ch n
   此时灵力总数为72Ch，灵颤频率均为2520Hz n 
   14.灵颤频率-体积表n
   由公式知 n
   Δ(ΔV)·f1f2=α(f1-f2) n
   W1 n
   不能减少体积 n
   W2-W8 n
   xV·f1f2=2520V(f1-f2)n
   xf2=(2520/f1)(f1-f2)n
   令 Ls=2520/f1 n
   xf2=2520-Lsf2 n
   (Ls+x)f2=2520 n
   f2=2520/(Ls+x) n
   因此可得，下表：n
   W2：n
   -1ΔV→504Hz n
   -2ΔV→630Hz n
   -3ΔV→840Hz n
   -4ΔV→1260Hz n
   -5ΔV→-2050Hz n
   W3：n
   -2ΔV→252Hz n
   -3ΔV→280Hz n
   -4ΔV→315Hz n
   -5ΔV→360Hz n
   -6ΔV→420Hz n
   后同W2n
   W4：  n
   -3ΔV→168Hz n
   -4ΔV→180Hz n
   -6ΔV→210Hz n
   后同W3n
   W5：n
   -3ΔV→120Hz n
   -4ΔV→126Hz n
   -6ΔV→140Hz n
   后同W4n
   W6：n
   -2ΔV→90Hz n
   -6ΔV→105Hz n
   后同W5n
   W7：n
   -1ΔV→72Hz n
   -6ΔV→84Hz n
   后同W6n
   W8：n
   -2ΔV：63Hz n
   -6ΔV：70Hz n
   后同W7n   
   A灵力转化原理n
   1.反灵子和反灵子器n   
   反灵子器可以减小灵力场的层的体积，根据灵力密度不变，可以推知灵力变化。n
   2.阵法是天然的反灵子器，卡牌的进入会使阵法区的内部结构被破坏，
   为了恢复这种被破坏的结构，阵法会产生一种环形灵引。环形灵引中央会形成较低的灵势。n
   3.灵力饱和规律： n
   若L>0,不等式：n
   2MlgΣL≥(lgΣL+lgL-1Ch)|M'-M| n
   恒成立n
   ΣL=1024Ch，M=5040Ch/s n
   可知：n
   M'=-5040Ch/s的情况下，超过了10Ch灵力便转变为魔力。n
   即灵力场外，超过10Ch的灵力便转化为魔力。n   
   4.导魔介质n
   导魔介质可以让魔力带上不同性质的能力，从而让其发挥不同的效果，并确定魔力的运动轨道。介质所赋予的能量为C/H。n    
`,
         style: siyan
      }
   },
}
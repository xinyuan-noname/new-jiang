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
      "hun_system": {
         headline: "魂币系统",
         writer: "",
         content: `
            魂币系统是一种交换系统，有如下功能：n
            A商店n
            用于交易特殊卡牌。n
            A变身n
            使用后，ま变成对应的武将ま实际上是获得一个随从ら，自带装备和卡牌。当一名变身武将死亡后才可变身为另外的武将。n
            A养成n
            点击养成功能的各选项即开始养成。n
            A维持魂币系统：n
            在使用系统功能时，会消耗系统能量。n
            消费魂币、刘徽-祖冲之项目投入魂币、清零魂币则会让系统获得能量。n
            n
            A获得魂币：n
            B打卡B：n
            打卡点可用于抽奖。n
            每日登录、投资刘徽-祖冲之项目可以获得打卡点。
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
      "economic": {
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
            魂币与能量的兑换比例(亦称第〇等率)，不予公布。n            
            A数据说明 n
            三等率以及浮流率是两个调控因子。n
            三等率的计算方式为：n
            第一等率=第〇等率/1.3;n
            第二等率=第〇等率/3;n
            第三等率=第〇等率/5;n
            浮流率的计算方式为：n
            浮流率=第〇等率*魂币量/能量量 n
            A魂币获取 n
            因击杀、重伤、满足条件、获得称号可获得魂币，且因制造魂币而消耗能量。n
            因抽奖和使用铜币与金币而获得的魂币，会根据当前的浮流率扣除能量。具体来说，浮流率越低，扣除能量越高;浮流率越高，扣除能量越低。n
            A魂币花费 n
            解锁养成、变身、触屏击杀在内的功能花费的魂币不变。 n
            魂币商店出售的商品，受到能量与浮流率两个因素的调控。能量越高，则花费的价格越低；浮流率越高，则花费的价格也越高。n
            择木卡以及性转卡,只受到浮流率的调控.浮流率越高,价格越高 n
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
            除花费魂币本身以第三等率转化为能量,每个魂币以第二等率回馈能量 n 
            此外的能量部分储存于项目基金会中,当你某个项目投资额达到100时,可以要求按照第三等率反馈魂币,然后扣减相应的魂币数 n
            A抽奖 n
            当能量为负,也没有魂币的时候,如果进行抽奖,系统会进行一次不消耗能量的抽奖。
            `,
         style: siyan
      },
   },
   poem: {
      //曹操
      "短歌行": {
         headline: "短歌行",
         writer: "两汉 建安 曹操",
         content: `
对酒当歌，人生几何！譬如朝露，去日苦多。慨当以慷，忧思难忘。何以解忧？唯有杜康。
青青子衿，悠悠我心。但为君故，沉吟至今。呦呦鹿鸣，食野之苹。我有嘉宾，鼓瑟吹笙。
明明如月，何时可掇？忧从中来，不可断绝。越陌度阡，枉用相存。契阔谈讌，心念旧恩。
月明星稀，乌鹊南飞。绕树三匝，何枝可依？山不厌高，海不厌深。周公吐哺，天下归心。 
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
      //曹植
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
      //曹丕
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
      //诸葛亮
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
      "出师表": {
         headline: "出师表",
         writer: "蜀汉 建兴 诸葛亮",
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
         writer: "蜀汉 建兴 诸葛亮",
         content: `
    夫君子之行，静以修身，俭以养德。非澹泊无以明志，非宁静无以致远。夫学须静也，才须学也，非学无以广才，非志无以成学。\u6deb慢则不能励精，险躁则不能治性。年与时驰，意与日去，遂成枯落，多不接世，悲守穷庐，将复何及！
`,
         style: siyan
      },
      "诫外生书": {
         headline: "诫外生书",
         writer: "蜀汉 诸葛亮",
         content: `
    夫志当存高远，慕先贤，绝情欲，弃凝滞，使庶几之志，揭然有所存，恻然有所感；忍屈伸，去细碎，广咨问，除嫌吝，虽有淹留，何损于美趣，何患于不济。若志不强毅，意不慷慨，徒碌碌滞于俗，默默束于情，永窜伏于凡庸，不免于下流矣！ 
`,
         style: siyan
      },
   },
   lingli: {
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
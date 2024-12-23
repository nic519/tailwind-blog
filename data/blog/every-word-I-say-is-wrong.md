---
title: “我所说的每一句，都是错的”之《主力的思维》读后感
cover: https://s2.loli.net/2024/04/20/jDIyU5TtFbxmWcs.png
categories:
  - 读后感
tags:
  - 底层思维
abbrlink: every-word-I-say-is-wrong
date: 2021-7-12 03:17:28
summary: 写到最后，我好像突然理解了以前一直以为是装逼的一句话：“我所说的每一句，都是错的”
---

## 整体感受以及阅读思路

这本书描写的主人公----**cis**，被称为日本最牛散户，他从短短的16年内，将本金300万变成230亿（日元），发一条推特就能撼动日经指数！

![](https://s2.loli.net/2024/04/20/jDIyU5TtFbxmWcs.png)

这本书很薄，几乎一两天内就能读完，但却给我留下非常深刻的印象：

1. 它整体而言并不是说教的书，更多地是介绍cis这个人在做决策时候的思考过程，以及非常多关于他在成长中大大小小的经历，这是非常重要的，因为我一直都认为别人的成功是不可复制的，每个人的 轨迹经历 / 优势劣势 / 喜恶偏好 都不一样，所以成功的方式就不可能是一样，所以这本书的写作角度，令我觉得挺有诚意。
2. 由于第一点，所以我是谨慎地带着很多质疑去看那些“说教”的部分；但却是细致地去通过他的成长事迹去领悟一些本质的问题

## 从“懒人炒股心经”说起

在这本书封面的背后，有四句“锦囊”，让我在多看了好几眼：

1. 持续上涨的股票就会再涨，持续下跌的股票就会再跌
2. 千万不能在“回档时买进”
3. “摊平”是最差劲的技巧
4. 只顾着“停利”会错失大波段

但其实，一般情况我看到这种简洁的、貌似可执行的浓缩句子，第一反应就是**肯定经不起回测的**。

### 反例1 基本不会有什么精简的策略能经得起数据回测

这不免让我联想到网民们曾经总结过《懒人炒股心经》

- 早盘大跌可加仓
- 早盘大涨要减仓
- 下午大涨只减仓
- 下午大跌次日买

**我先说结果：网民的这个总结，通过数据回测去看，只在2020年有效，其余年份，该法则都是几乎是无效的**

以下为它的量化过程：

1. 把大涨或大跌，量化为涨了2%或跌了2%
2. 美国股市，不算盘前交易，它的正式交易时间为9:30开市，所以“早盘大跌可加仓”，我们把它定义为：如果早上10:00，它的股价相较于9:30跌了2%，则买入/加仓；反之“早盘大涨要减仓”，即10:00相对于9:30，它的股价涨了2%，则卖出/减仓
3. 同理，不算盘后，美国股市在下午4:00结束，“下午大涨要减仓”，我们定义为：如果下午3:00的时候相较于下午2:00涨了2%，则减仓
4. “下午大跌次日买”，我们定义为：如果收盘的价格相较于下午2:00跌了2%，则将于次日9:30开盘的时候无脑买入

**所以我的结论是**：

1. 大多数简单的道理，就像给程序员一个一句话需求一样，比如开发一个实时语音通讯的功能，虽然看似只是在传输音频数据，但实际上关于涉及到耗电的编解码效率的逻辑、丢包补偿，让即使在网络情况很差的情况下，通讯过程不至于断断续续完全听不清等等方面的考虑，都是非常多的，所以要保持敬畏之心。
2. 当还是某领域门外汉的时候，不要轻易去信奉或执行那些被别人总结成精简步骤的话，因为它很可能只是在某个时间段成立而已，不能让你长期立于不败之地。

### 反例2 投资中的“微笑理论”

针对作者说的：**千万不能在“回档时买进”**和**“摊平”是最差劲的技巧**，我们来猜猜下面三个曲线，假设我们以每月定投1次，1次投入2w元的方式去投资，在第六个月，哪一个曲线会赚的最多？

![](https://s2.loli.net/2024/04/20/GVYQ17kBEmiTyIe.webp)

详细计算方法可以看[这里](https://www.jianshu.com/p/d67780b9735c?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)，我直接揭晓答案：**第三种**

它们最后的收益分别为：40.9%、41.7%、**118.75%**，**第三种远高于前两种曲线**

**所以结论是**：在我们预测市场总会回暖，然后该公司是好公司的前提下，越跌越买，是个好策略。

## Cis曾经也开过公司

上面说的案例，貌似不是一些正面的例子，但我说完下面的内容，一切都迎刃而解了。

cis曾经开过一家交易公司，用35万月薪加20%收益提成的方式（从书中推测是在2010年以前的时候），精心挑选了他的五位大学朋友，直接授以他的股票操作方法：心想，当时他的资产已超过20亿元，在股票投资上已经算是有成就了，雇佣更多的人去复制他的方法，去关注那些他无法分身去看的板块，岂不是可以赚到更多钱。

**先说结果：**

我还以为这样能赚很多钱，但完全失算。

每个人都从一千万开始，两年操作下来的结果，只有一个人变成两千四百万，然后是稍微赚一点和稍微赔一点的人，也有人赔了好几百万的。

明明教的东西都一样，买卖的结果却南辕北辙，至少跟cis本人同期的收益率是一个天一个地。

**他的总结是：**

光靠上课是不行的，人的本能会反应在买卖上。再加上激励机制，一扯到金钱，人总是会输给本能，比如：在学校念书或找工作时比较脚踏实地的人，作风会倾向保守，从事利润非常低的买卖；而在校时豪爽的说“明明要考试却不小心睡过头”或“明明是必修科目却挂科”的人，对损益也会比较不上心。

**我的看法是：**

正如书里描述的cis，他从小就是个重度游戏迷，在柑仔店玩抽抽乐的时候，总能以高概率地获得大奖，并且把此作为零花钱的主要来源；也会设计许多“庄家比较有胜算的”游戏，让大伙参与进来玩，同时也知道如何控制“游戏货币”的发行量，来让“货币”值钱。

他从来都注重“如何提高获胜几率”，更加在意在过程中做出最好的判断，当然，这未必是他在这块比较擅长的所有原因，也许也有很多说不上来，需要归功于天赋的那部分。但从我自己身边的观察也发现，一般游戏玩的非常好的人：1、他本身就是个比别人聪明的人 2、这种人很少

试问这样的人，优势伴随着可能是天赋的部分，是可以通过后天简单的复刻出来吗？显然不可能！给我启示就是：

1. 技能 / 知识，一般都是自己学会的，而不是教会的，所以学习别人的时候，不要太注重对方总结的某个细节的知识点，而是去学习他得出结论的思考过程，以及结合他本身优势、性格去看待，比如在股票交易中，cis明显是属于右侧交易者，那假设自己是左侧交易者，是否也要照搬他的方法呢？
2. 反推：我们自身也得了解自己的性格，找到适合自己的方法论体系。

## 我的总结

这是本优秀的书，比较全方位地刻画了一个优秀的人，但我认为无论我怎么在里面去找线索，如果只是用cis的方法，是绝不可能像他那样，在短短的十几年间，把300万变成260个亿。并且他也已经亲自去教过5个人了，都没能成功。

这也是我在回忆这本书的时候，并没有像大家期待的那样，充满什么很奏效的知识点，都是上面那些不是很正面的东西。

炒股（金融）这个领域真的很特殊，它不大可能有一个非常具体的、正确的策略来预测短期内的走势，如果有，它只可能是两个结果：

1. 这个方法考虑的方面足够的多，足够的复杂。这就要求这个人在这块的基础积累地足够多，并且也足够地了解自己，从而去选对策略。
2. 这个方法如果是公开的、大多数人都知道的，那这个方法一定随即就失效。所以永远不要去期望在这块，能在别人身上直接找到答案。

写到这里，我好像突然理解了以前一直以为是装逼的一句话：**“我所说的每一句，都是错的”**

// 直播间商品 + 弹幕语料（原创虚构）
const LIVE_GOODS = [
  { id: 1, name: "冻干咖啡 12 条装", price: 39.9, livePrice: 29.9, stock: 500, soldRate: 0, emoji: "☕", hue: 20,
    point: "冷水也能冲！直播间专属价仅限本场", flash: false },
  { id: 2, name: "加厚瑜伽垫 8mm", price: 99, livePrice: 69, stock: 300, soldRate: 0, emoji: "🧘", hue: 280,
    point: "8mm 加厚防滑，前 100 单送收纳带", flash: false },
  { id: 3, name: "不锈钢保温杯 500ml", price: 89, livePrice: 49.9, stock: 200, soldRate: 0, emoji: "🥤", hue: 200,
    point: "今晚 21:00 秒杀开抢，限量 200 个！", flash: true, flashDuration: 90 },
  { id: 4, name: "三模机械键盘", price: 329, livePrice: 279, stock: 150, soldRate: 0, emoji: "⌨️", hue: 250,
    point: "热插拔 Gasket 结构，办公游戏两开花", flash: false },
  { id: 5, name: "香薰蜡烛礼盒", price: 119, livePrice: 89, stock: 400, soldRate: 0, emoji: "🕯️", hue: 40,
    point: "三种高级香型，送礼自用两相宜", flash: false },
  { id: 6, name: "速干运动毛巾 ×3", price: 59, livePrice: 39, stock: 600, soldRate: 0, emoji: "🏃", hue: 190,
    point: "健身房刚需，三条换洗装", flash: false },
];

const DANMU_TEXTS = [
  "已拍！求快发货", "这个价真的香", "主播讲讲材质", "刚进来，错过了什么",
  "1 号链接还有吗", "买了两单！", "家里一直用这个", "质量怎么样呀",
  "保温杯啥时候开秒", "主播好漂亮", "已下单 3 号", "学生党冲了",
  "颜色还有别的吗", "支持 7 天无理由吗", "抢到了哈哈哈", "蹲一个优惠券",
];

const DANMU_NAMES = ["桃***子", "爱***猫", "山***风", "一***夏", "陈***", "月***光", "小***鹿", "北***岛", "可***乐", "星***辰"];

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  GiCrystalShine, GiBroadsword, GiBookCover, GiBrain, GiLightBulb,
  GiSmartphone, GiServerRack, GiDatabase, GiNetworkBars,
  GiPencil, GiCheckMark, GiTargetArrows, GiTeamIdea,
  GiChart, GiSpellBook, GiTrophyCup, GiDiscussion
} = require("react-icons/gi");
const {
  FaUserFriends, FaRocket, FaShieldAlt, FaLayerGroup,
  FaLayerGroupAlt, FaArrowRight, FaStar, FaCode,
  FaAndroid, FaJava, FaCogs, FaLock, FaWifi
} = require("react-icons/fa");

function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

const C = {
  cream: "FAF8F5",
  dark: "2E2E2E",
  charcoal: "3D3D3D",
  red: "D64545",
  blue: "4A90D9",
  green: "5B9A6B",
  orange: "E8833A",
  purple: "7B5EA7",
  teal: "3D9E9E",
  gray: "6B6B6B",
  lightGray: "A0A0A0",
  white: "FFFFFF",
  warmYellow: "F0D78C",
  warmPink: "E8A2B0",
};

const FONT_HAND = "Segoe Print";
const FONT_HAND_CN = "KaiTi";
const FONT_BODY = "Microsoft YaHei";
const FONT_MONO = "Consolas";

function makeShadow() {
  return { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.12 };
}

function sketchUnderline(slide, x, y, w, color) {
  const h = 0.04;
  slide.addShape(slide._pres ? "rect" : "rect", {
    x, y, w, h: h, fill: { color }, line: { color, width: 0 }
  });
}

async function main() {
  const icons = {};
  const iconDefs = [
    ["sword", GiBroadsword, C.red],
    ["crystal", GiCrystalShine, C.blue],
    ["book", GiBookCover, C.green],
    ["brain", GiBrain, C.purple],
    ["lightbulb", GiLightBulb, C.orange],
    ["phone", GiSmartphone, C.dark],
    ["server", GiServerRack, C.teal],
    ["database", GiDatabase, C.green],
    ["network", GiNetworkBars, C.blue],
    ["pencil", GiPencil, C.red],
    ["check", GiCheckMark, C.green],
    ["target", GiTargetArrows, C.red],
    ["team", GiTeamIdea, C.blue],
    ["chart", GiChart, C.orange],
    ["spell", GiSpellBook, C.purple],
    ["trophy", GiTrophyCup, C.orange],
    ["discuss", GiDiscussion, C.teal],
    ["users", FaUserFriends, C.blue],
    ["rocket", FaRocket, C.red],
    ["shield", FaShieldAlt, C.green],
    ["layer", FaLayerGroup, C.purple],
    ["arrow", FaArrowRight, C.orange],
    ["star", FaStar, C.warmYellow],
    ["code", FaCode, C.teal],
    ["android", FaAndroid, C.green],
    ["java", FaJava, C.orange],
    ["cogs", FaCogs, C.gray],
    ["lock", FaLock, C.dark],
    ["wifi", FaWifi, C.blue],
  ];

  for (const [name, comp, color] of iconDefs) {
    icons[name] = await iconToBase64Png(comp, "#" + color, 256);
  }

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "ARAM Mayhem Team";
  pres.title = "ARAM Mayhem Assistant - 项目演示";

  const slideW = 10;
  const slideH = 5.625;

  function addDoodleDecor(slide, type) {
    if (type === "corner-star") {
      slide.addImage({ data: icons.star, x: 0.3, y: 0.3, w: 0.35, h: 0.35, rotate: 15 });
      slide.addImage({ data: icons.star, x: 9.35, y: 5.0, w: 0.3, h: 0.3, rotate: -12 });
    }
    if (type === "top-squiggle") {
      slide.addShape(pres.ShapeType === undefined ? "rect" : "rect", {
        x: 0.5, y: 0.6, w: 2.0, h: 0.03, fill: { color: C.red }
      });
    }
    if (type === "side-dots") {
      for (let i = 0; i < 4; i++) {
        slide.addShape(pres.ShapeType === undefined ? "rect" : "rect", {
          x: 9.5, y: 1.5 + i * 0.5, w: 0.06, h: 0.06,
          fill: { color: C.orange }
        });
      }
    }
    if (type === "bottom-pencil") {
      slide.addImage({ data: icons.pencil, x: 0.5, y: 5.0, w: 0.3, h: 0.3, rotate: -30 });
    }
  }

  // ===== SLIDE 1: Title =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.dark };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.red }
    });

    slide.addImage({ data: icons.star, x: 0.6, y: 0.5, w: 0.4, h: 0.4, rotate: 20 });
    slide.addImage({ data: icons.star, x: 9.0, y: 0.4, w: 0.35, h: 0.35, rotate: -15 });

    slide.addText("ARAM Mayhem Assistant", {
      x: 1.0, y: 1.2, w: 8.0, h: 0.9,
      fontSize: 40, fontFace: FONT_HAND, color: C.white,
      align: "center", valign: "middle", bold: true, margin: 0
    });

    slide.addText("海克斯大乱斗 · 信息差助手", {
      x: 1.0, y: 2.15, w: 8.0, h: 0.7,
      fontSize: 28, fontFace: FONT_HAND_CN, color: C.warmYellow,
      align: "center", valign: "middle", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 3.5, y: 2.95, w: 3.0, h: 0.03, fill: { color: C.warmYellow }
    });

    slide.addText([
      { text: "Android Native APK", options: { fontSize: 16, color: C.lightGray, breakLine: true } },
      { text: "Java 21  ×  Spring Boot 3.x  ×  MySQL 8.0+", options: { fontSize: 14, color: C.gray } }
    ], {
      x: 1.5, y: 3.3, w: 7.0, h: 1.0,
      align: "center", valign: "top", fontFace: FONT_BODY
    });

    slide.addText("Doodle-Style Presentation  ·  2026", {
      x: 1.0, y: 4.9, w: 8.0, h: 0.4,
      fontSize: 11, fontFace: FONT_BODY, color: C.gray,
      align: "center", valign: "middle", margin: 0
    });
  }

  // ===== SLIDE 2: Problem & Solution =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("为什么需要这个 App？", {
      x: 0.6, y: 0.35, w: 8.0, h: 0.65,
      fontSize: 28, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.05, w: 1.8, h: 0.03, fill: { color: C.red }
    });

    const problems = [
      { icon: "brain", title: "信息差痛点", desc: "ARAM 模式下英雄平衡修正、强化符文搭配等信息分散，玩家难以在 30 秒选择期做出最优决策" },
      { icon: "target", title: "工具缺失", desc: "现有 LoL 工具多为峡谷模式设计，缺乏针对 ARAM 专属平衡、节奏和阵容的智能分析" },
      { icon: "spell", title: "决策焦虑", desc: "棱彩/金/银三层强化符文选择 + 装备路线 + 阵容克制共同作用，新手和进阶玩家均面临认知过载" },
    ];

    problems.forEach((p, i) => {
      const yBase = 1.4 + i * 1.2;
      slide.addImage({ data: icons[p.icon], x: 0.7, y: yBase + 0.05, w: 0.5, h: 0.5 });
      slide.addText(p.title, {
        x: 1.4, y: yBase, w: 3.5, h: 0.4,
        fontSize: 17, fontFace: FONT_HAND_CN, color: C.dark, bold: true, margin: 0
      });
      slide.addText(p.desc, {
        x: 1.4, y: yBase + 0.4, w: 3.5, h: 0.6,
        fontSize: 12, fontFace: FONT_BODY, color: C.charcoal, margin: 0
      });
    });

    const rX = 5.6, rW = 4.0;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: rX, y: 1.3, w: rW, h: 3.6,
      fill: { color: C.white },
      line: { color: C.green, width: 1.5, dashType: "dash" },
      shadow: makeShadow()
    });

    slide.addImage({ data: icons.lightbulb, x: rX + 1.6, y: 1.5, w: 0.55, h: 0.55 });
    slide.addText("我们的解决方案", {
      x: rX + 0.3, y: 2.15, w: rW - 0.6, h: 0.45,
      fontSize: 18, fontFace: FONT_HAND_CN, color: C.dark, bold: true, align: "center", margin: 0
    });

    const solutions = [
      "ARAM 专属知识库",
      "智能推荐引擎",
      "英雄 & 强化 & 出装一站式",
      "30 秒完成最优决策",
    ];
    solutions.forEach((s, i) => {
      slide.addImage({ data: icons.check, x: rX + 0.5, y: 2.7 + i * 0.55, w: 0.22, h: 0.22 });
      slide.addText(s, {
        x: rX + 0.85, y: 2.65 + i * 0.55, w: 2.8, h: 0.35,
        fontSize: 13, fontFace: FONT_BODY, color: C.charcoal, margin: 0
      });
    });

    slide.addText([
      { text: "一键辅助 · 消除 ARAM 信息差", options: { fontSize: 13, fontFace: FONT_HAND_CN, color: C.green, align: "center", margin: 0 } }
    ], {
      x: rX + 0.3, y: 4.5, w: rW - 0.6, h: 0.35,
      fontFace: FONT_HAND_CN, margin: 0
    });

    // slide 2 bottom decoration
    slide.addImage({ data: icons.pencil, x: 0.5, y: 5.0, w: 0.28, h: 0.28, rotate: -25 });
  }

  // ===== SLIDE 3: Core Value & Target Users =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("核心价值", {
      x: 0.6, y: 0.35, w: 4.5, h: 0.6,
      fontSize: 28, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.0, w: 1.5, h: 0.03, fill: { color: C.orange }
    });

    const values = [
      { icon: "trophy", title: "一 站 式", desc: "英雄 + 强化 + 出装\n全链路决策辅助" },
      { icon: "rocket", title: "30 秒快", desc: "匹配选人期\n即可完成最优判断" },
      { icon: "shield", title: "ARAM 专属", desc: "独有平衡修正数据\n非峡谷通用工具" },
      { icon: "users", title: "社区驱动", desc: "UGC 玩法投稿\n投票构建信任" },
    ];

    values.forEach((v, i) => {
      const x = 0.6 + i * 2.2;
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.2, w: 2.0, h: 2.0,
        fill: { color: C.white },
        line: { color: [C.red, C.blue, C.green, C.purple][i], width: 1.2, dashType: "dash" },
        shadow: makeShadow()
      });
      slide.addImage({ data: icons[v.icon], x: x + 0.65, y: 1.35, w: 0.5, h: 0.5 });
      slide.addText(v.title, {
        x: x + 0.1, y: 1.9, w: 1.8, h: 0.35,
        fontSize: 15, fontFace: FONT_HAND_CN, color: C.dark, bold: true, align: "center", margin: 0
      });
      slide.addText(v.desc, {
        x: x + 0.1, y: 2.3, w: 1.9, h: 0.7,
        fontSize: 11, fontFace: FONT_BODY, color: C.charcoal, align: "center", valign: "top", margin: 0
      });
    });

    slide.addText("目标用户群体", {
      x: 0.6, y: 3.5, w: 5.0, h: 0.6,
      fontSize: 24, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.1, w: 1.5, h: 0.03, fill: { color: C.blue }
    });

    const users = [
      { label: "新手玩家", desc: "快速上手英雄\n不踩坑", color: C.green },
      { label: "进阶玩家", desc: "优化选择\n榨取胜率", color: C.blue },
      { label: "硬核数据党", desc: "关注修正\n研究搭配", color: C.purple },
      { label: "社区贡献者", desc: "分享玩法\n获取认可", color: C.orange },
    ];

    users.forEach((u, i) => {
      const x = 0.6 + i * 2.2;
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 4.3, w: 2.0, h: 1.0,
        fill: { color: u.color, transparency: 85 },
        line: { color: u.color, width: 1, dashType: "dash" }
      });
      slide.addText(u.label, {
        x: x + 0.1, y: 4.4, w: 1.8, h: 0.35,
        fontSize: 14, fontFace: FONT_HAND_CN, color: C.dark, bold: true, align: "center", margin: 0
      });
      slide.addText(u.desc, {
        x: x + 0.1, y: 4.75, w: 1.9, h: 0.45,
        fontSize: 10, fontFace: FONT_BODY, color: C.charcoal, align: "center", margin: 0
      });
    });
  }

  // ===== SLIDE 4: Core Features =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("五大核心功能模块", {
      x: 0.6, y: 0.28, w: 6.0, h: 0.55,
      fontSize: 26, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.88, w: 2.0, h: 0.03, fill: { color: C.purple }
    });

    const features = [
      { icon: "sword", title: "英雄梯度", desc: "S+~C 五级梯度 × 胜率 × Ban率 ×ARAM 平衡修正可视化", color: C.red },
      { icon: "crystal", title: "强化符文", desc: "棱彩/金/银 × 按英雄推荐 × 套装进度 × 智能追踪", color: C.blue },
      { icon: "book", title: "玩法社区", desc: "UGC 穿搭投稿 × 投票排行 × 出战前 → 键参考", color: C.green },
      { icon: "chart", title: "版本启示", desc: "版本变更新闻 × 版本陷阱标记 × nerf/buff 提醒", color: C.orange },
      { icon: "discuss", title: "个人中心", desc: "投稿历史 × 收藏夹 × 偏好设置 × 模式切换", color: C.teal },
    ];

    const cols = 5;
    const cardW = 1.7;
    const gap = 0.15;
    const startX = (slideW - (cols * cardW + (cols - 1) * gap)) / 2;

    features.forEach((f, i) => {
      const x = startX + i * (cardW + gap);
      const y = 1.2;

      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 3.9,
        fill: { color: C.white },
        line: { color: f.color, width: 1.3, dashType: "dash" },
        shadow: makeShadow()
      });

      slide.addImage({ data: icons[f.icon], x: x + 0.5, y: y + 0.2, w: 0.55, h: 0.55 });

      slide.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: y + 0.95, w: cardW - 0.3, h: 0.03, fill: { color: f.color }
      });

      slide.addText(f.title, {
        x: x + 0.1, y: y + 1.1, w: cardW - 0.2, h: 0.4,
        fontSize: 14, fontFace: FONT_HAND_CN, color: C.dark, bold: true, align: "center", margin: 0
      });

      slide.addText(f.desc, {
        x: x + 0.1, y: y + 1.6, w: cardW - 0.2, h: 2.1,
        fontSize: 11, fontFace: FONT_BODY, color: C.charcoal, align: "center", valign: "top", margin: 0,
        lineSpacingMultiple: 1.6
      });
    });
  }

  // ===== SLIDE 5: Android Architecture =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("Android 客户端架构", {
      x: 0.6, y: 0.28, w: 6.0, h: 0.55,
      fontSize: 26, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.88, w: 2.0, h: 0.03, fill: { color: C.green }
    });

    const layers = [
      { label: "Presentation Layer", items: "Activity · Fragment · Adapter · Custom View", color: C.red, y: 1.2 },
      { label: "ViewModel Layer", items: "ViewModel · LiveData · State Management", color: C.blue, y: 1.95 },
      { label: "Repository Layer", items: "Repository · Data Mapping · Cache Strategy", color: C.green, y: 2.7 },
      { label: "Data Layer", items: "Retrofit · Room · SharedPreferences · Glide", color: C.orange, y: 3.45 },
      { label: "Core / DI", items: "Hilt · Navigation · RxJava3 · ProGuard", color: C.purple, y: 4.2 },
    ];

    layers.forEach((l) => {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y: l.y, w: 4.8, h: 0.6,
        fill: { color: l.color, transparency: 88 },
        line: { color: l.color, width: 1.2, dashType: "dash" }
      });
      slide.addText(l.label, {
        x: 0.75, y: l.y, w: 2.2, h: 0.6,
        fontSize: 13, fontFace: FONT_HAND, color: C.dark, bold: true, valign: "middle", margin: 0
      });
      slide.addText(l.items, {
        x: 2.9, y: l.y, w: 2.4, h: 0.6,
        fontSize: 10, fontFace: FONT_BODY, color: C.charcoal, valign: "middle", margin: 0
      });
    });

    const techBoxX = 5.8;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: techBoxX, y: 1.2, w: 3.3, h: 3.6,
      fill: { color: C.white },
      line: { color: C.gray, width: 1, dashType: "dash" },
      shadow: makeShadow()
    });

    slide.addText("技术栈", {
      x: techBoxX + 0.3, y: 1.3, w: 2.7, h: 0.4,
      fontSize: 15, fontFace: FONT_HAND_CN, color: C.dark, bold: true, margin: 0
    });

    const stack = [
      "Java 21 · XML Layout",
      "ViewBinding · MVVM",
      "Retrofit2 + OkHttp4",
      "Room 本地数据库",
      "Glide 图片加载",
      "Hilt (Dagger DI)",
      "RxJava3 异步",
      "EncryptedSharedPrefs",
      "Jetpack Navigation",
      "ProGuard 混淆",
    ];

    stack.forEach((s, i) => {
      slide.addText("✏  " + s, {
        x: techBoxX + 0.4, y: 1.75 + i * 0.26, w: 3.0, h: 0.25,
        fontSize: 10, fontFace: FONT_BODY, color: C.charcoal, margin: 0
      });
    });

    slide.addText("minSdk 26 · targetSdk 34 · Java 21", {
      x: techBoxX + 0.3, y: 4.3, w: 3.2, h: 0.25,
      fontSize: 9, fontFace: FONT_MONO, color: C.gray, margin: 0
    });
  }

  // ===== SLIDE 6: Backend Architecture =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("Spring Boot 后端架构", {
      x: 0.6, y: 0.28, w: 6.0, h: 0.55,
      fontSize: 26, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.88, w: 2.0, h: 0.03, fill: { color: C.teal }
    });

    const beLayers = [
      { label: "Controller", detail: "@RestController · @Valid 校验 · 统一 ResponseEntity", color: C.red },
      { label: "Service", detail: "@Service · 业务逻辑 · @Transactional 事务", color: C.blue },
      { label: "Mapper (MyBatis Plus)", detail: "BaseMapper<T> · LambdaWrapper · IPage<T> 分页", color: C.green },
      { label: "Entity / DTO / VO", detail: "@TableName · @TableId · Lombok @Data", color: C.orange },
      { label: "Infrastructure", detail: "Spring Security + JWT · Redis Cache · @Scheduled", color: C.purple },
    ];

    beLayers.forEach((l, i) => {
      const yB = 1.1 + i * 0.82;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y: yB, w: 5.2, h: 0.7,
        fill: { color: l.color, transparency: 88 },
        line: { color: l.color, width: 1.2, dashType: "dash" }
      });
      slide.addText(l.label, {
        x: 0.75, y: yB + 0.02, w: 2.0, h: 0.32,
        fontSize: 13, fontFace: FONT_HAND, color: C.dark, bold: true, margin: 0
      });
      slide.addText(l.detail, {
        x: 0.75, y: yB + 0.34, w: 4.8, h: 0.3,
        fontSize: 10, fontFace: FONT_BODY, color: C.charcoal, margin: 0
      });
    });

    const dbBoxX = 6.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: dbBoxX, y: 1.1, w: 3.2, h: 1.8,
      fill: { color: C.white },
      line: { color: C.green, width: 1.3, dashType: "dash" },
      shadow: makeShadow()
    });

    slide.addImage({ data: icons.database, x: dbBoxX + 1.25, y: 1.2, w: 0.42, h: 0.42 });
    slide.addText("MySQL 8.0+", {
      x: dbBoxX + 0.3, y: 1.68, w: 2.6, h: 0.32,
      fontSize: 14, fontFace: FONT_HAND_CN, color: C.dark, bold: true, align: "center", margin: 0
    });
    slide.addText([
      { text: "tb_user    tb_hero    tb_augment", options: { breakLine: true } },
      { text: "tb_strategy    tb_vote    tb_bulletin", options: { breakLine: true } },
      { text: "utf8mb4    MyBatis Plus   9 tables", options: {} }
    ], {
      x: dbBoxX + 0.3, y: 2.1, w: 2.6, h: 0.7,
      fontSize: 9, fontFace: FONT_BODY, color: C.charcoal, align: "center", valign: "top", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: dbBoxX, y: 3.15, w: 3.2, h: 0.9,
      fill: { color: C.white },
      line: { color: C.orange, width: 1.3, dashType: "dash" },
      shadow: makeShadow()
    });
    slide.addImage({ data: icons.network, x: dbBoxX + 0.5, y: 3.28, w: 0.32, h: 0.32 });
    slide.addText("Redis  Cache", {
      x: dbBoxX + 0.95, y: 3.28, w: 1.8, h: 0.6,
      fontSize: 13, fontFace: FONT_HAND, color: C.dark, bold: true, valign: "middle", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: dbBoxX, y: 4.25, w: 3.2, h: 0.9,
      fill: { color: C.white },
      line: { color: C.purple, width: 1.3, dashType: "dash" },
      shadow: makeShadow()
    });
    slide.addImage({ data: icons.lock, x: dbBoxX + 0.5, y: 4.38, w: 0.32, h: 0.32 });
    slide.addText("Spring Security", {
      x: dbBoxX + 0.95, y: 4.38, w: 1.8, h: 0.32,
      fontSize: 13, fontFace: FONT_HAND, color: C.dark, bold: true, margin: 0
    });
    slide.addText("JWT + BCrypt", {
      x: dbBoxX + 0.95, y: 4.7, w: 1.8, h: 0.28,
      fontSize: 10, fontFace: FONT_BODY, color: C.charcoal, margin: 0
    });
  }

  // ===== SLIDE 7: Full System Architecture =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("全景系统架构", {
      x: 0.5, y: 0.15, w: 5.0, h: 0.5,
      fontSize: 24, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 0.65, w: 1.5, h: 0.03, fill: { color: C.red }
    });

    const boxStyle = (color) => ({
      fill: { color },
      line: { color: C.dark, width: 1.2, dashType: "dash" },
      shadow: makeShadow(),
      rectRadius: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 0.9, w: 4.2, h: 4.0,
      fill: { color: C.green, transparency: 90 },
      line: { color: C.green, width: 0.8, dashType: "dash" }
    });
    slide.addText("Android", {
      x: 0.5, y: 0.9, w: 4.2, h: 0.35,
      fontSize: 12, fontFace: FONT_HAND, color: C.green, align: "center", bold: true, margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: 0.9, w: 4.2, h: 4.0,
      fill: { color: C.teal, transparency: 90 },
      line: { color: C.teal, width: 0.8, dashType: "dash" }
    });
    slide.addText("Spring Boot", {
      x: 5.3, y: 0.9, w: 4.2, h: 0.35,
      fontSize: 12, fontFace: FONT_HAND, color: C.teal, align: "center", bold: true, margin: 0
    });

    const androidComps = [
      { t: "Activity / Fragment", c: C.red, y: 1.45 },
      { t: "ViewModel + LiveData", c: C.blue, y: 2.1 },
      { t: "Repository", c: C.green, y: 2.75 },
      { t: "Retrofit  ·  Room  ·  Glide", c: C.orange, y: 3.4 },
      { t: "Hilt DI  ·  RxJava3", c: C.purple, y: 4.05 },
    ];

    androidComps.forEach((a) => {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.7, y: a.y, w: 3.8, h: 0.48,
        fill: { color: C.white },
        line: { color: a.c, width: 1, dashType: "dash" }
      });
      slide.addText(a.t, {
        x: 0.85, y: a.y, w: 3.5, h: 0.48,
        fontSize: 10, fontFace: FONT_HAND, color: C.dark, valign: "middle", margin: 0
      });
    });

    const beComps = [
      { t: "@RestController   REST API", c: C.red, y: 1.45 },
      { t: "@Service   Business Logic", c: C.blue, y: 2.1 },
      { t: "MyBatis Plus Mapper", c: C.green, y: 2.75 },
      { t: "DB  ·  Redis  ·  Security", c: C.orange, y: 3.4 },
      { t: "@Scheduled  ·  Swagger", c: C.purple, y: 4.05 },
    ];

    beComps.forEach((b) => {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 5.5, y: b.y, w: 3.8, h: 0.48,
        fill: { color: C.white },
        line: { color: b.c, width: 1, dashType: "dash" }
      });
      slide.addText(b.t, {
        x: 5.65, y: b.y, w: 3.5, h: 0.48,
        fontSize: 10, fontFace: FONT_HAND, color: C.dark, valign: "middle", margin: 0
      });
    });

    slide.addText("HTTP  ( Retrofit2  >>>  Spring MVC  RESTful )", {
      x: 1.0, y: 4.55, w: 8.0, h: 0.4,
      fontSize: 12, fontFace: FONT_HAND, color: C.red, bold: true, align: "center", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 3.0, y: 4.68, w: 4.0, h: 0.02, fill: { color: C.red }
    });

    slide.addText([
      { text: "JWT Auth   |   BCrypt   |   ProGuard   |   EncryptedSharedPrefs", options: {} }
    ], {
      x: 0.5, y: 4.85, w: 9.0, h: 0.35,
      fontSize: 9, fontFace: FONT_MONO, color: C.gray, align: "center", margin: 0
    });
  }

  // ===== SLIDE 8: Module Breakdown =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("Android 模块拆分", {
      x: 0.6, y: 0.28, w: 5.0, h: 0.55,
      fontSize: 26, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.88, w: 1.8, h: 0.03, fill: { color: C.red }
    });

    const modules = [
      { name: "app", desc: "Application  ·  MainActivity", color: C.red },
      { name: "core-network", desc: "OkHttp + Retrofit2  + JWT", color: C.blue },
      { name: "core-data", desc: "Room DB  ·  SharedPreferences", color: C.green },
      { name: "core-ui", desc: "Custom Views  ·  Theme  ·  Style", color: C.orange },
      { name: "core-common", desc: "Constants  ·  Result<T>  ·  Enums", color: C.purple },
      { name: "feature-auth", desc: "Login  /  Register", color: C.teal },
      { name: "feature-home", desc: "Home  ·  Quick Entry", color: C.red },
      { name: "feature-hero", desc: "Hero List  +  Detail", color: C.blue },
      { name: "feature-augment", desc: "Augment  +  Synergy", color: C.green },
      { name: "feature-community", desc: "Feed  +  Publish", color: C.orange },
      { name: "feature-profile", desc: "Profile  +  Settings", color: C.purple },
      { name: "navigation", desc: "NavGraph  +  Routes", color: C.teal },
    ];

    const cols = 3, rows = 4;
    const boxW = 2.8, boxH = 0.85;
    const gX = 0.25, gY = 0.16;
    const sX = (slideW - (cols * boxW + (cols - 1) * gX)) / 2;
    const sY = 1.05;

    modules.forEach((m, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = sX + col * (boxW + gX);
      const y = sY + row * (boxH + gY);

      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: boxW, h: boxH,
        fill: { color: C.white },
        line: { color: m.color, width: 1.2, dashType: "dash" },
        shadow: makeShadow()
      });

      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: boxW, h: 0.04, fill: { color: m.color }
      });

      slide.addText(m.name, {
        x: x + 0.15, y: y + 0.1, w: boxW - 0.3, h: 0.32,
        fontSize: 11, fontFace: FONT_MONO, color: C.dark, bold: true, margin: 0
      });
      slide.addText(m.desc, {
        x: x + 0.15, y: y + 0.42, w: boxW - 0.3, h: 0.35,
        fontSize: 9, fontFace: FONT_HAND, color: C.charcoal, valign: "top", margin: 0
      });
    });
  }

  // ===== SLIDE 9: Local Deployment =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.cream };

    slide.addText("本地部署架构", {
      x: 0.6, y: 0.28, w: 5.0, h: 0.55,
      fontSize: 26, fontFace: FONT_HAND_CN, color: C.dark, margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.88, w: 1.8, h: 0.03, fill: { color: C.teal }
    });

    const phoneX = 0.5, phoneW = 3.7;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: phoneX, y: 1.1, w: phoneW, h: 3.8,
      fill: { color: C.green, transparency: 90 },
      line: { color: C.green, width: 0.8, dashType: "dash" }
    });
    slide.addImage({ data: icons.android, x: phoneX + 1.5, y: 1.2, w: 0.4, h: 0.4 });
    slide.addText("Android 手機", {
      x: phoneX, y: 1.65, w: phoneW, h: 0.32,
      fontSize: 12, fontFace: FONT_HAND_CN, color: C.dark, align: "center", bold: true, margin: 0
    });
    slide.addText("APK via ADB · 不上架商店", {
      x: phoneX, y: 2.0, w: phoneW, h: 0.3,
      fontSize: 10, fontFace: FONT_HAND, color: C.charcoal, align: "center", margin: 0
    });

    slide.addText([
      { text: "LAN: http://192.168.101.2:8080", options: { breakLine: true } },
      { text: "EncryptedSharedPrefs + Keystore", options: { breakLine: true } },
      { text: "network_security_config.xml", options: {} }
    ], {
      x: phoneX + 0.5, y: 2.8, w: phoneW - 1.0, h: 1.5,
      fontSize: 10, fontFace: FONT_MONO, color: C.charcoal, align: "center", valign: "top", margin: 0
    });

    const pcX = 5.0, pcW = 4.5;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: pcX, y: 1.1, w: pcW, h: 3.8,
      fill: { color: C.teal, transparency: 90 },
      line: { color: C.teal, width: 0.8, dashType: "dash" }
    });
    slide.addImage({ data: icons.server, x: pcX + 1.85, y: 1.2, w: 0.4, h: 0.4 });
    slide.addText("开发计算机 ( 192.168.101.2 )", {
      x: pcX, y: 1.65, w: pcW, h: 0.32,
      fontSize: 12, fontFace: FONT_HAND_CN, color: C.dark, align: "center", bold: true, margin: 0
    });
    slide.addText("Spring Boot  +  MySQL  +  Redis", {
      x: pcX, y: 2.0, w: pcW, h: 0.3,
      fontSize: 10, fontFace: FONT_HAND, color: C.charcoal, align: "center", margin: 0
    });

    const svcs = [
      { name: "Spring Boot :8080", desc: "java -jar aram-server.jar" },
      { name: "MySQL 9.7 :3306", desc: "utf8mb4  ·  9 tables  ·  local" },
      { name: "Redis :6379", desc: "热点缓存  ·  PONG ✓" },
      { name: "Windows Firewall", desc: "开放 8080  ·  仅 LAN" },
    ];

    svcs.forEach((s, i) => {
      const yy = 2.6 + i * 0.55;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: pcX + 0.3, y: yy, w: pcW - 0.6, h: 0.45,
        fill: { color: C.white },
        line: { color: C.blue, width: 0.8, dashType: "dash" }
      });
      slide.addText(s.name, {
        x: pcX + 0.4, y: yy, w: 1.8, h: 0.45,
        fontSize: 9, fontFace: FONT_MONO, color: C.dark, valign: "middle", bold: true, margin: 0
      });
      slide.addText(s.desc, {
        x: pcX + 2.3, y: yy, w: 1.8, h: 0.45,
        fontSize: 9, fontFace: FONT_HAND, color: C.charcoal, valign: "middle", margin: 0
      });
    });
  }

  // ===== SLIDE 10: Roadmap =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.dark };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.orange }
    });

    slide.addText("开发里程碑路线图", {
      x: 0.5, y: 0.25, w: 9.0, h: 0.65,
      fontSize: 28, fontFace: FONT_HAND_CN, color: C.white, align: "center", margin: 0
    });

    slide.addImage({ data: icons.star, x: 0.5, y: 0.2, w: 0.3, h: 0.3, rotate: 15 });
    slide.addImage({ data: icons.star, x: 9.2, y: 0.2, w: 0.3, h: 0.3, rotate: -15 });

    const milestones = [
      { code: "M1", name: "项目初始化", desc: "Android + Spring Boot 脚手架" },
      { code: "M2", name: "基础架构", desc: "建表 · MyBatis Plus · JWT · 网络配置" },
      { code: "M3", name: "UI 框架", desc: "主题 · Navigation · 通用组件" },
      { code: "M4", name: "英雄模块", desc: "列表 · 详情 · ARAM 修正" },
      { code: "M5", name: "强化符文", desc: "列表 · 套装 · 智能推荐" },
      { code: "M6", name: "玩法社区", desc: "浏览 · 发布 · 投票" },
      { code: "M7", name: "版本公告", desc: "轮播 · 版本陷阱提醒" },
      { code: "M8", name: "个人中心", desc: "设置 · 收藏 · 偏好" },
      { code: "M9", name: "数据管线", desc: "Riot API · 定时同步 · 缓存" },
      { code: "M10", name: "测试集成", desc: "JUnit5 · Espresso · LeakCanary" },
      { code: "M11", name: "本地部署", desc: "APK · start-server.bat · 验证" },
    ];

    const gX = 0.15, gY = 0.1;
    const cW = 2.25, cH = 1.05;
    const cardsPerRow = 4;
    const totalW = cardsPerRow * cW + (cardsPerRow - 1) * gX;
    const sX = (slideW - totalW) / 2;

    milestones.forEach((m, i) => {
      const col = (i < 8) ? (i % 4) : (i - 8);
      const row = (i < 8) ? Math.floor(i / 4) : 2;
      const x = sX + col * (cW + gX);
      const y = 1.25 + row * (cH + gY);

      const colors = [C.red, C.blue, C.green, C.orange, C.purple, C.teal, C.warmPink, C.red, C.blue, C.green, C.orange];
      const c = colors[i % colors.length];

      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: cH,
        fill: { color: C.dark, transparency: 0 },
        line: { color: c, width: 1.3, dashType: "dash" }
      });

      slide.addText(m.code, {
        x: x + 0.1, y: y + 0.08, w: 0.5, h: 0.3,
        fontSize: 11, fontFace: FONT_MONO, color: c, bold: true, margin: 0
      });

      slide.addText(m.name, {
        x: x + 0.1, y: y + 0.38, w: cW - 0.2, h: 0.32,
        fontSize: 13, fontFace: FONT_HAND_CN, color: C.white, bold: true, margin: 0
      });

      slide.addText(m.desc, {
        x: x + 0.1, y: y + 0.68, w: cW - 0.2, h: 0.32,
        fontSize: 9, fontFace: FONT_BODY, color: C.lightGray, margin: 0
      });
    });

    slide.addText([
      { text: "阶段依赖: M1 > M2/M3 > M4~M8 > M9 > M10 > M11", options: { breakLine: true } },
      { text: "预计开发周期: 6~8 周  ·  纯本地部署 · 个人使用", options: {} },
    ], {
      x: 1.0, y: 4.9, w: 8.0, h: 0.55,
      fontSize: 11, fontFace: FONT_BODY, color: C.lightGray, align: "center", margin: 0
    });
  }

  // ===== Save =====
  const outPath = "d:/traeProjects/ARAM_Mayhem_Assistant/presentation/ARAM_Mayhem_Assistant.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("PPT generated: " + outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

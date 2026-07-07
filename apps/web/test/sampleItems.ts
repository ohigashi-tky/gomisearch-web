import type { Municipality, MunicipalityItemsResponse, WasteItem } from "../src/lib/types";

/** iOS 版 MockRepository と同じ、大阪市シードの代表品目 */
export const osaka: Municipality = {
  id: 1,
  name: "大阪市",
  prefecture: "大阪府",
  bulkyWasteApplyUrl: "https://sodai.osaka-kankyojigyo.or.jp/",
  sourceUrl: "https://www.city.osaka.lg.jp/kankyo/page/0000369973.html",
};

export const sampleItems: WasteItem[] = [
  {
    id: 1,
    name: "靴",
    category: "普通ごみ",
    fee: 0,
    instructions: "普通ごみの収集日に中身の見えるごみ袋に入れて出してください。",
    applyUrl: null,
    aliases: ["くつ", "スニーカー", "ブーツ", "革靴", "サンダル"],
  },
  {
    id: 2,
    name: "傘",
    category: "普通ごみ",
    fee: 0,
    instructions: "普通ごみへ。ごみ袋から突き出る場合は「ごみ」と表示して出してください。",
    applyUrl: null,
    aliases: ["かさ", "ビニール傘", "日傘", "折りたたみ傘"],
  },
  {
    id: 17,
    name: "自転車",
    category: "粗大ごみ",
    fee: 400,
    instructions:
      "粗大ごみ (事前申込制)。粗大ごみ処理手数料券400円を貼り、収集日に指定場所へ出してください。",
    applyUrl: "https://sodai.osaka-kankyojigyo.or.jp/",
    aliases: ["じてんしゃ", "チャリ", "ママチャリ", "チャリンコ", "サイクル"],
  },
  {
    id: 18,
    name: "電子レンジ",
    category: "粗大ごみ",
    fee: 400,
    instructions:
      "粗大ごみ (事前申込制)。粗大ごみ処理手数料券400円を貼り、収集日に指定場所へ出してください。",
    applyUrl: "https://sodai.osaka-kankyojigyo.or.jp/",
    aliases: ["でんしれんじ", "レンジ", "オーブンレンジ"],
  },
  {
    id: 19,
    name: "布団",
    category: "粗大ごみ",
    fee: null,
    instructions:
      "粗大ごみ (事前申込制)。手数料は申込時に案内されるため要確認。折りたたんでひもで束ねて出してください。",
    applyUrl: "https://sodai.osaka-kankyojigyo.or.jp/",
    aliases: ["ふとん", "掛け布団", "敷布団", "毛布"],
  },
  {
    id: 34,
    name: "ペットボトル",
    category: "資源",
    fee: 0,
    instructions:
      "キャップとラベルを外して容器包装プラスチックへ。本体は軽くすすぎ、つぶして資源ごみへ出してください。",
    applyUrl: null,
    aliases: ["ぺっとぼとる", "PETボトル"],
  },
  {
    id: 40,
    name: "新聞",
    category: "古紙・衣類",
    fee: 0,
    instructions: "ひもで十字に束ねて古紙・衣類の収集日に出してください。",
    applyUrl: null,
    aliases: ["しんぶん", "新聞紙", "チラシ"],
  },
  {
    id: 41,
    name: "食品トレイ",
    category: "容器包装プラスチック",
    fee: 0,
    instructions: "軽くすすいで容器包装プラスチックの収集日に出してください。",
    applyUrl: null,
    aliases: ["しょくひんとれい", "トレー", "発泡トレイ"],
  },
  {
    id: 46,
    name: "テレビ",
    category: "収集不可",
    fee: null,
    instructions:
      "家電リサイクル法対象のため市では収集できません。購入店・買替店に引き取りを依頼するか、郵便局でリサイクル料金 (要確認) を支払って指定引取場所へ持ち込んでください。",
    applyUrl: null,
    aliases: ["てれび", "液晶テレビ", "ブラウン管テレビ"],
  },
];

export const sampleResponse: MunicipalityItemsResponse = {
  municipality: osaka,
  items: sampleItems,
};

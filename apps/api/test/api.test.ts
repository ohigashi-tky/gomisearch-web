import { env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../src/index";
import { resetRateLimit } from "../src/lib/rateLimit";

const OSAKA_ID = 1;

function get(path: string, headers: Record<string, string> = {}) {
  return app.request(path, { headers }, env);
}

function postRequests(
  body: unknown,
  headers: Record<string, string> = { "CF-Connecting-IP": "203.0.113.1" },
) {
  return app.request(
    "/api/requests",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    },
    env,
  );
}

beforeEach(() => {
  resetRateLimit();
});

describe("GET /api/municipalities", () => {
  it("「大阪」で大阪市がヒットする", async () => {
    const res = await get("/api/municipalities?q=大阪");
    expect(res.status).toBe(200);
    const json = (await res.json()) as { municipalities: { name: string }[] };
    expect(json.municipalities.map((m) => m.name)).toContain("大阪市");
  });

  it("都道府県名でもヒットする", async () => {
    const res = await get("/api/municipalities?q=大阪府");
    const json = (await res.json()) as { municipalities: { name: string }[] };
    expect(json.municipalities.map((m) => m.name)).toContain("大阪市");
  });

  it("該当なしなら空配列", async () => {
    const res = await get("/api/municipalities?q=存在しない市");
    const json = (await res.json()) as { municipalities: unknown[] };
    expect(json.municipalities).toEqual([]);
  });
});

describe("GET /api/search", () => {
  it("alias「スニーカー」で「靴」がヒットする", async () => {
    const res = await get(
      `/api/search?q=${encodeURIComponent("スニーカー")}&municipality_id=${OSAKA_ID}`,
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      items: { name: string; category: string; sourceUrl: string }[];
      suggestions: unknown[];
    };
    expect(json.items.map((i) => i.name)).toContain("靴");
    expect(json.items[0].sourceUrl).toMatch(/^https:\/\//);
  });

  it("ひらがな「じてんしゃ」で自転車 (粗大ごみ・400円・申請URLあり) がヒットする", async () => {
    const res = await get(
      `/api/search?q=${encodeURIComponent("じてんしゃ")}&municipality_id=${OSAKA_ID}`,
    );
    const json = (await res.json()) as {
      items: {
        name: string;
        category: string;
        fee: number | null;
        applyUrl: string | null;
      }[];
    };
    const bicycle = json.items.find((i) => i.name === "自転車");
    expect(bicycle).toBeDefined();
    expect(bicycle?.category).toBe("粗大ごみ");
    expect(bicycle?.fee).toBe(400);
    expect(bicycle?.applyUrl).toMatch(/^https:\/\//);
  });

  it("カタカナ・ひらがなどちらでも同じ結果になる", async () => {
    const hira = await get(
      `/api/search?q=${encodeURIComponent("ふとん")}&municipality_id=${OSAKA_ID}`,
    );
    const kata = await get(
      `/api/search?q=${encodeURIComponent("フトン")}&municipality_id=${OSAKA_ID}`,
    );
    const hiraJson = (await hira.json()) as { items: { name: string }[] };
    const kataJson = (await kata.json()) as { items: { name: string }[] };
    expect(hiraJson.items.map((i) => i.name)).toContain("布団");
    expect(hiraJson.items).toEqual(kataJson.items);
  });

  it("名前の部分一致でもヒットする", async () => {
    const res = await get(
      `/api/search?q=${encodeURIComponent("レンジ")}&municipality_id=${OSAKA_ID}`,
    );
    const json = (await res.json()) as { items: { name: string }[] };
    expect(json.items.map((i) => i.name)).toContain("電子レンジ");
  });

  it("0件時は前方一致の suggestions を返す", async () => {
    // 「じてんしゃぶ」は完全な部分一致では0件だが、前方一致の緩い検索で自転車が候補になる
    const res = await get(
      `/api/search?q=${encodeURIComponent("じてんしゃぶ")}&municipality_id=${OSAKA_ID}`,
    );
    const json = (await res.json()) as {
      items: unknown[];
      suggestions: { id: number; name: string }[];
    };
    expect(json.items).toEqual([]);
    expect(json.suggestions.map((s) => s.name)).toContain("自転車");
  });

  it("まったく一致しない場合は items も suggestions も空", async () => {
    const res = await get(
      `/api/search?q=${encodeURIComponent("qqqqzzzz")}&municipality_id=${OSAKA_ID}`,
    );
    const json = (await res.json()) as {
      items: unknown[];
      suggestions: unknown[];
    };
    expect(json.items).toEqual([]);
    expect(json.suggestions).toEqual([]);
  });

  it("別の自治体 ID では0件", async () => {
    const res = await get(
      `/api/search?q=${encodeURIComponent("スニーカー")}&municipality_id=999`,
    );
    const json = (await res.json()) as { items: unknown[] };
    expect(json.items).toEqual([]);
  });

  it("q がないと 400", async () => {
    const res = await get(`/api/search?municipality_id=${OSAKA_ID}`);
    expect(res.status).toBe(400);
  });

  it("municipality_id がないと 400", async () => {
    const res = await get(`/api/search?q=くつ`);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/suggest", () => {
  it("前方一致で候補を最大10件返す", async () => {
    const res = await get(
      `/api/suggest?q=${encodeURIComponent("でんし")}&municipality_id=${OSAKA_ID}`,
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      suggestions: { id: number; name: string }[];
    };
    expect(json.suggestions.map((s) => s.name)).toContain("電子レンジ");
    expect(json.suggestions.length).toBeLessThanOrEqual(10);
  });

  it("alias の前方一致でも候補を返す", async () => {
    const res = await get(
      `/api/suggest?q=${encodeURIComponent("すに")}&municipality_id=${OSAKA_ID}`,
    );
    const json = (await res.json()) as { suggestions: { name: string }[] };
    expect(json.suggestions.map((s) => s.name)).toContain("靴");
  });

  it("q がないと 400", async () => {
    const res = await get(`/api/suggest?municipality_id=${OSAKA_ID}`);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/municipalities/:id/items (ETag)", () => {
  it("全品目と ETag を返す", async () => {
    const res = await get(`/api/municipalities/${OSAKA_ID}/items`);
    expect(res.status).toBe(200);
    expect(res.headers.get("ETag")).toBeTruthy();
    const json = (await res.json()) as {
      municipality: { name: string };
      items: { name: string; aliases: string[] }[];
    };
    expect(json.municipality.name).toBe("大阪市");
    expect(json.items.length).toBe(50);
    const shoes = json.items.find((i) => i.name === "靴");
    expect(shoes?.aliases).toContain("スニーカー");
  });

  it("If-None-Match が一致すれば 304 を返す", async () => {
    const first = await get(`/api/municipalities/${OSAKA_ID}/items`);
    const etag = first.headers.get("ETag")!;
    const second = await get(`/api/municipalities/${OSAKA_ID}/items`, {
      "If-None-Match": etag,
    });
    expect(second.status).toBe(304);
    expect(second.headers.get("ETag")).toBe(etag);
    expect(await second.text()).toBe("");
  });

  it("ETag が一致しなければ 200 を返す", async () => {
    const res = await get(`/api/municipalities/${OSAKA_ID}/items`, {
      "If-None-Match": '"deadbeef"',
    });
    expect(res.status).toBe(200);
  });

  it("存在しない自治体は 404", async () => {
    const res = await get(`/api/municipalities/999/items`);
    expect(res.status).toBe(404);
  });
});

describe("POST /api/requests", () => {
  it("リクエストを保存して 201 を返す", async () => {
    const res = await postRequests({ municipalityName: "京都市" });
    expect(res.status).toBe(201);
    const json = (await res.json()) as { id: number; municipalityName: string };
    expect(json.municipalityName).toBe("京都市");

    const row = await env.DB.prepare(
      "SELECT municipality_name FROM municipality_requests WHERE id = ?",
    )
      .bind(json.id)
      .first<{ municipality_name: string }>();
    expect(row?.municipality_name).toBe("京都市");
  });

  it("municipalityName がないと 400", async () => {
    const res = await postRequests({});
    expect(res.status).toBe(400);
  });

  it("JSON でないボディは 400", async () => {
    const res = await app.request(
      "/api/requests",
      {
        method: "POST",
        headers: { "CF-Connecting-IP": "203.0.113.9" },
        body: "not json",
      },
      env,
    );
    expect(res.status).toBe(400);
  });

  it("同一 IP から同じ自治体名を連投すると 429", async () => {
    const first = await postRequests({ municipalityName: "神戸市" });
    expect(first.status).toBe(201);
    const second = await postRequests({ municipalityName: "神戸市" });
    expect(second.status).toBe(429);
  });

  it("表記ゆれ (ひらがな/カタカナ) の連投も 429", async () => {
    const first = await postRequests({ municipalityName: "さいたま市" });
    expect(first.status).toBe(201);
    const second = await postRequests({ municipalityName: "サイタマ市" });
    expect(second.status).toBe(429);
  });

  it("同一 IP からの連続リクエストは 60 秒 5 回まで", async () => {
    const names = ["堺市", "岡山市", "広島市", "福岡市", "仙台市", "札幌市"];
    const statuses: number[] = [];
    for (const name of names) {
      const res = await postRequests({ municipalityName: name });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 5)).toEqual([201, 201, 201, 201, 201]);
    expect(statuses[5]).toBe(429);
  });

  it("別 IP からは独立してカウントされる", async () => {
    const a = await postRequests(
      { municipalityName: "名古屋市" },
      { "CF-Connecting-IP": "203.0.113.50" },
    );
    const b = await postRequests(
      { municipalityName: "名古屋市" },
      { "CF-Connecting-IP": "203.0.113.51" },
    );
    expect(a.status).toBe(201);
    expect(b.status).toBe(201);
  });
});

/* 対訳リーダー（汎用） — renders window.BOOK; 可変言語・表示切替・文字サイズ・日本語訳ダウンロード */
(function () {
  var B = window.BOOK;
  if (!B) { document.body.innerHTML = "<p style='padding:2rem'>データを読み込めませんでした。</p>"; return; }

  var LANGNAME = { ja: "日本語", en: "英語", de: "ドイツ語", fr: "フランス語", zh: "中国語", ko: "韓国語", hi: "ヒンディー語" };
  var langs = B.langs || Object.keys(B.parts[0].paras[0]);
  var orig = B.origLangCode;
  function label(code) { return code === orig ? "原文" : (LANGNAME[code] || code); }

  document.title = B.title + " ／ " + (B.englishTitle || "") + " — 対訳文庫";

  // ---- header ----
  var creditLines = (B.sources || []).map(function (s) {
    return esc(s.label) + ": " + esc(s.who) +
      '（<a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.via) + '</a>）';
  });
  creditLines.push("日本語訳: 本サイト（AIの支援により作成）");
  document.getElementById("work-head").innerHTML =
    '<div class="eyebrow">' + esc(B.originalTitle || "") +
      (B.englishTitle && B.englishTitle !== B.originalTitle ? " &nbsp;·&nbsp; " + esc(B.englishTitle) : "") + '</div>' +
    '<h1>' + esc(B.title) + '</h1>' +
    '<div class="author">' + esc(B.author) + '</div>' +
    '<div class="credit">' + creditLines.join("<br>") + '</div>';

  // ---- view buttons ----
  var hasOrig = orig && langs.indexOf(orig) >= 0 && orig !== "ja";
  var btns = "";
  if (hasOrig) btns += '<button data-view="both">対訳</button>';
  langs.forEach(function (c) { btns += '<button data-view="' + c + '">' + esc(label(c)) + '</button>'; });
  document.getElementById("viewbtns").innerHTML = btns;

  // ---- chapter nav (only if labelled parts) ----
  var labelled = B.parts.some(function (p) { return p.label; }) && B.parts.length > 1;
  document.getElementById("chapnav").innerHTML = labelled ? B.parts.map(function (p, i) {
    return '<a href="#ch' + i + '">' + esc(p.label) + '</a>';
  }).join("") : "";

  // ---- body ----
  var html = "";
  B.parts.forEach(function (p, i) {
    html += '<section class="chapter" id="ch' + i + '">';
    if (p.label) {
      html += '<h2 class="chapter-title"><span class="no">' + roman(i + 1) + '</span>' + esc(p.label) + '</h2>' +
        '<div class="chapter-rule"></div>';
    }
    p.paras.forEach(function (pr) {
      html += '<div class="para">';
      langs.forEach(function (c) {
        html += '<div class="col lang-' + c + '" lang="' + c + '">' + esc(pr[c] || "") + '</div>';
      });
      html += '</div>';
    });
    html += '</section>';
  });
  document.getElementById("reader").innerHTML = html;

  // ---- view mode (dynamic stylesheet) ----
  var styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  var defaultView = hasOrig ? "both" : "ja";
  setView(safeGet("tb-view-" + (B.id || "x")) || defaultView);
  document.querySelectorAll("[data-view]").forEach(function (btn) {
    btn.addEventListener("click", function () { setView(btn.getAttribute("data-view")); });
  });
  function setView(v) {
    var visible, cols;
    if (v === "both" && hasOrig) { visible = ["ja", orig]; cols = "1fr 1fr"; }
    else { if (langs.indexOf(v) < 0) v = "ja"; visible = [v]; cols = "1fr"; }
    var css = "#reader .para{grid-template-columns:" + cols + "}\n#reader .col{display:none}\n" +
      visible.map(function (c) { return "#reader .para .lang-" + c + "{display:block}"; }).join("\n");
    styleEl.textContent = css;
    document.body.classList.toggle("solo", visible.length === 1);
    document.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === v);
    });
    safeSet("tb-view-" + (B.id || "x"), v);
  }

  // ---- font size ----
  var SIZES = ["s", "m", "l", "xl"];
  var fs = safeGet("tb-fs") || "m";
  applyFs(fs);
  document.getElementById("fs-inc").addEventListener("click", function () { stepFs(1); });
  document.getElementById("fs-dec").addEventListener("click", function () { stepFs(-1); });
  function stepFs(d) { applyFs(SIZES[Math.max(0, Math.min(SIZES.length - 1, SIZES.indexOf(fs) + d))]); }
  function applyFs(v) { fs = v; document.body.setAttribute("data-fs", v); safeSet("tb-fs", v); }

  // ---- download Japanese translation as .txt ----
  var dl = document.getElementById("dl-ja");
  if (dl) dl.addEventListener("click", function () {
    var lines = [B.title, B.author, "（日本語訳: 対訳文庫 ／ 原文: " + (B.sources && B.sources[0] ? B.sources[0].via : "") + "）", ""];
    B.parts.forEach(function (p) {
      if (p.label) { lines.push("", "── " + p.label + " ──", ""); }
      p.paras.forEach(function (pr) { lines.push(pr.ja); });
    });
    var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (B.id || "book") + "-ja.txt";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });

  // ---- helpers ----
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function roman(n) { return ["", "I", "II", "III", "IV", "V"][n] || String(n); }
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
})();

/* 対訳リーダー — renders window.BOOK into the page */
(function () {
  var B = window.BOOK;
  if (!B) { document.body.innerHTML = "<p style='padding:2rem'>データを読み込めませんでした。</p>"; return; }

  document.title = B.title + " ／ " + B.englishTitle + " — 対訳文庫";

  // ---- header ----
  var head = document.getElementById("work-head");
  head.innerHTML =
    '<div class="eyebrow">' + esc(B.originalTitle) + " &nbsp;·&nbsp; " + esc(B.englishTitle) + '</div>' +
    '<h1>' + esc(B.title) + '</h1>' +
    '<div class="author">' + esc(B.author) + '</div>' +
    '<div class="credit">英訳: ' + esc(B.engTranslator) +
      '（<a href="' + B.sourceUrl + '" target="_blank" rel="noopener">' + esc(B.source) + '</a>／パブリックドメイン）<br>' +
      '日本語訳: 本サイト（AIの支援により作成）</div>';

  // ---- chapter nav ----
  var nav = document.getElementById("chapnav");
  nav.innerHTML = B.parts.map(function (p, i) {
    return '<a href="#ch' + i + '">' + esc(p.label) + '</a>';
  }).join("");

  // ---- body ----
  var main = document.getElementById("reader");
  var html = "";
  B.parts.forEach(function (p, i) {
    html += '<section class="chapter" id="ch' + i + '">';
    html += '<h2 class="chapter-title"><span class="no">' + roman(i + 1) + '</span>' + esc(p.label) + '</h2>';
    html += '<div class="chapter-rule"></div>';
    p.paras.forEach(function (pr) {
      html += '<div class="para">' +
        '<div class="ja">' + esc(pr.ja) + '</div>' +
        '<div class="en">' + esc(pr.en) + '</div>' +
        '</div>';
    });
    html += '</section>';
  });
  main.innerHTML = html;

  // ---- view mode ----
  var VIEWS = ["both", "ja", "en"];
  var saved = safeGet("tb-view") || "both";
  setView(saved);
  document.querySelectorAll("[data-view]").forEach(function (btn) {
    btn.addEventListener("click", function () { setView(btn.getAttribute("data-view")); });
  });
  function setView(v) {
    if (VIEWS.indexOf(v) < 0) v = "both";
    document.body.classList.remove("view-both", "view-ja", "view-en");
    document.body.classList.add("view-" + v);
    document.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === v);
    });
    safeSet("tb-view", v);
  }

  // ---- font size ----
  var SIZES = ["s", "m", "l", "xl"];
  var fs = safeGet("tb-fs") || "m";
  applyFs(fs);
  document.getElementById("fs-inc").addEventListener("click", function () { stepFs(1); });
  document.getElementById("fs-dec").addEventListener("click", function () { stepFs(-1); });
  function stepFs(d) {
    var i = Math.max(0, Math.min(SIZES.length - 1, SIZES.indexOf(fs) + d));
    applyFs(SIZES[i]);
  }
  function applyFs(v) { fs = v; document.body.setAttribute("data-fs", v); safeSet("tb-fs", v); }

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

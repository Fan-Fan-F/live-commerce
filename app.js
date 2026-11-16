// 直播带货间逻辑
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const fmt = (n) => "¥" + n.toFixed(1).replace(/\.0$/, "");

  const goods = LIVE_GOODS.map(g => ({ ...g, remaining: g.stock, flashLeft: g.flash ? g.flashDuration : 0 }));
  let curIdx = 0;
  let viewers = 3240 + Math.floor(Math.random() * 500);
  let likes = 1200;

  /* ---------- 在线人数 & 点赞 ---------- */
  function renderStats() {
    $("#viewerCount").textContent = viewers.toLocaleString();
    $("#likeCount").textContent = likes > 999 ? (likes / 1000).toFixed(1) + "k" : likes;
  }
  setInterval(() => { viewers = Math.max(800, viewers + Math.floor(Math.random() * 41 - 18)); renderStats(); }, 2500);

  $("#likeBtn").addEventListener("click", () => {
    likes += 1;
    renderStats();
    const heart = document.createElement("span");
    heart.className = "fly-heart";
    heart.textContent = ["❤️", "🧡", "💖", "💛"][Math.floor(Math.random() * 4)];
    heart.style.right = Math.random() * 30 + "px";
    $("#likeLayer").appendChild(heart);
    setTimeout(() => heart.remove(), 1400);
  });

  $("#followBtn").addEventListener("click", function () {
    this.classList.add("done");
    this.textContent = "已关注";
  });

  /* ---------- 弹幕 ---------- */
  function pushDanmu() {
    const layer = $("#danmuLayer");
    const el = document.createElement("div");
    el.className = "danmu";
    el.innerHTML = `<b>${DANMU_NAMES[Math.floor(Math.random() * DANMU_NAMES.length)]}：</b>${DANMU_TEXTS[Math.floor(Math.random() * DANMU_TEXTS.length)]}`;
    layer.appendChild(el);
    if (layer.children.length > 6) {
      const first = layer.children[0];
      first.classList.add("out");
      setTimeout(() => first.remove(), 500);
    }
    setTimeout(pushDanmu, 900 + Math.random() * 1800);
  }
  pushDanmu();

  /* ---------- 商品渲染 ---------- */
  function renderHero() {
    const g = goods[curIdx];
    $("#currentIndex").textContent = `${curIdx + 1}/${goods.length}`;
    const soldPct = Math.round((1 - g.remaining / g.stock) * 100);
    $("#heroCard").innerHTML = `
      <span class="hc-emoji" style="background:radial-gradient(circle,hsl(${g.hue},60%,30%),transparent)">${g.emoji}</span>
      <p class="hc-name">${g.name}${g.flash ? `<span class="flash-badge">秒杀中</span>` : ""}</p>
      <p class="hc-point">💡 ${g.point}</p>
      <div class="hc-price"><b>${fmt(g.livePrice)}</b><s>日常价 ${fmt(g.price)}</s>
        ${g.flash && g.flashLeft > 0 ? `<span class="flash-timer" id="flashTimer"></span>` : ""}</div>
      <div class="hc-stock"><i style="width:${soldPct}%"></i></div>
      <p class="hc-stock-txt">已抢 ${soldPct}% · 剩余 ${g.remaining} 件</p>
      <button class="hc-buy" data-buy="${g.id}" ${g.remaining === 0 || (g.flash && g.flashLeft > 0) ? "disabled" : ""}>
        ${g.remaining === 0 ? "已抢光" : g.flash && g.flashLeft > 0 ? "秒杀未开始" : "立即抢购"}
      </button>`;
  }

  function renderList() {
    $("#goodsList").innerHTML = goods.map((g, i) => `
      <div class="g-row ${i === curIdx ? "cur" : ""}" data-idx="${i}">
        <div class="g-emoji">${g.emoji}</div>
        <div class="g-info">
          <p class="g-name">${g.name}</p>
          <p class="g-price">${fmt(g.livePrice)}<s>${fmt(g.price)}</s></p>
        </div>
        <button class="g-buy" data-buy="${g.id}" ${g.remaining === 0 ? "disabled" : ""}>${g.remaining === 0 ? "抢光" : "抢"}</button>
      </div>`).join("");
  }

  /* ---------- 秒杀倒计时 ---------- */
  setInterval(() => {
    goods.forEach(g => {
      if (g.flash && g.flashLeft > 0) g.flashLeft--;
    });
    const g = goods[curIdx];
    const el = $("#flashTimer");
    if (el && g.flash) {
      if (g.flashLeft > 0) {
        const m = String(Math.floor(g.flashLeft / 60)).padStart(2, "0");
        const s = String(g.flashLeft % 60).padStart(2, "0");
        el.textContent = `⏱ ${m}:${s}`;
      } else {
        renderHero(); // 秒杀开始，解锁按钮
      }
    }
  }, 1000);

  /* ---------- 轮换讲解 ---------- */
  setInterval(() => {
    curIdx = (curIdx + 1) % goods.length;
    renderHero();
    renderList();
  }, 12000);

  $("#goodsList").addEventListener("click", (e) => {
    const row = e.target.closest("[data-idx]");
    if (row && !e.target.closest("[data-buy]")) {
      curIdx = +row.dataset.idx;
      renderHero(); renderList();
    }
  });

  /* ---------- 下单 ---------- */
  let pendingGoods = null;
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-buy]");
    if (!btn || btn.disabled) return;
    pendingGoods = goods.find(g => g.id === +btn.dataset.buy);
    $("#orderBody").innerHTML = `
      <div class="p-line"><span>商品</span><b>${pendingGoods.emoji} ${pendingGoods.name}</b></div>
      <div class="p-line"><span>直播价</span><b>${fmt(pendingGoods.livePrice)}</b></div>
      <div class="p-line"><span>日常价</span><s>${fmt(pendingGoods.price)}</s></div>
      <div class="p-line"><span>库存</span><b>剩 ${pendingGoods.remaining} 件</b></div>
      <div class="p-total"><span>应付</span><strong>${fmt(pendingGoods.livePrice)}</strong></div>`;
    $("#orderModal").hidden = false;
  });

  $("#orderCancel").addEventListener("click", () => $("#orderModal").hidden = true);
  $("#orderConfirm").addEventListener("click", () => {
    if (pendingGoods && pendingGoods.remaining > 0) {
      pendingGoods.remaining--;
      $("#orderModal").hidden = true;
      toast(`🎉 抢购成功！「${pendingGoods.name}」剩余 ${pendingGoods.remaining} 件`);
      renderHero(); renderList();
    }
  });

  function toast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.hidden = false;
    setTimeout(() => (t.hidden = true), 2400);
  }

  $("#commentBox").addEventListener("click", () => {
    const text = prompt("发条弹幕：");
    if (text?.trim()) {
      const el = document.createElement("div");
      el.className = "danmu";
      el.innerHTML = `<b>我：</b>${text.trim().replace(/</g, "&lt;")}`;
      $("#danmuLayer").appendChild(el);
    }
  });

  renderStats();
  renderHero();
  renderList();
})();

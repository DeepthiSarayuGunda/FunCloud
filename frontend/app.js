// Premium FunCloud - All Modules

/* ---------- Navigation ---------- */
(function navInit() {
  const navBtns = Array.from(document.querySelectorAll(".navBtn"));
  const pages = {
    quotes: document.getElementById("page-quotes"),
    kids: document.getElementById("page-kids"),
    party: document.getElementById("page-party"),
    chat: document.getElementById("page-chat"),
  };

  function setPage(key) {
    navBtns.forEach(b => b.classList.toggle("isActive", b.dataset.page === key));
    Object.entries(pages).forEach(([k, el]) => {
      if (!el) return;
      el.classList.toggle("isActive", k === key);
    });
  }

  navBtns.forEach(btn => btn.addEventListener("click", () => setPage(btn.dataset.page)));
  setPage("quotes");
})();

/* ---------- QUOTES: Premium Upgrade ---------- */
(function quoteAppInit() {
  const quoteEl = document.getElementById("quote");
  const statusEl = document.getElementById("status");
  const btnQuote = document.getElementById("btnQuote");
  const btnFav = document.getElementById("btnFav");
  const btnShow = document.getElementById("btnShow");
  const panel = document.getElementById("panel");
  const btnClose = document.getElementById("btnClose");
  const btnClear = document.getElementById("btnClear");
  const favList = document.getElementById("favList");
  const categorySel = document.getElementById("category");

  const FAV_KEY = "funcloud_favs_v1";
  let currentQuote = null;

  function getAllQuotes() {
    if (typeof QUOTES === 'undefined') return [];
    const all = [];
    Object.entries(QUOTES).forEach(([cat, items]) => {
      items.forEach(q => all.push({ ...q, category: cat }));
    });
    return all;
  }

  function getDailyQuote() {
    const quotes = getAllQuotes();
    if (!quotes.length) return null;
    const today = new Date().toDateString();
    let seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return quotes[seed % quotes.length];
  }

  function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch { return []; }
  }

  function setFavs(list) {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  }

  function renderFavs() {
    const favs = getFavs();
    favList.innerHTML = "";
    if (favs.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No favourites yet. Save some quotes!";
      favList.appendChild(li);
      return;
    }
    favs.forEach(fav => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${fav.quote}</strong><br/><em>— ${fav.author}</em>`;
      li.style.marginBottom = "12px";
      favList.appendChild(li);
    });
  }

  function pickQuote() {
    const cat = categorySel ? categorySel.value : "all";
    const quotes = getAllQuotes();
    let filtered = quotes;
    if (cat !== "all" && cat) {
      filtered = quotes.filter(q => q.category === cat);
    }
    if (!filtered.length) filtered = quotes;
    const q = filtered[Math.floor(Math.random() * filtered.length)];
    return q;
  }

  function displayQuote(q) {
    if (!q) return;
    currentQuote = q;
    quoteEl.textContent = `"${q.text}"`;
    quoteEl.classList.add("animate-in");
    statusEl.textContent = "";
    setTimeout(() => quoteEl.classList.remove("animate-in"), 300);
  }

  function onNewQuote() { const q = pickQuote(); displayQuote(q); }
  function onCopyQuote() {
    if (!currentQuote) { statusEl.textContent = "Get a quote first!"; return; }
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(text).catch(() => {});
    statusEl.textContent = "Copied! 📋";
  }
  function onShareQuote() {
    if (!currentQuote) { statusEl.textContent = "Get a quote first!"; return; }
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    if (navigator.share) navigator.share({ title: "FunCloud Quote", text });
    else onCopyQuote();
  }
  function onSaveFav() {
    if (!currentQuote) { statusEl.textContent = "Get a quote first!"; return; }
    const favs = getFavs();
    if (favs.find(f => f.quote === currentQuote.text)) { statusEl.textContent = "Already favorited! ⭐"; return; }
    favs.unshift({ quote: currentQuote.text, author: currentQuote.author });
    setFavs(favs);
    statusEl.textContent = "Added to favorites! ❤️";
  }

  if (btnQuote) btnQuote.addEventListener("click", onNewQuote);
  if (btnFav) btnFav.addEventListener("click", onSaveFav);
  if (btnShow) btnShow.addEventListener("click", () => { panel.classList.remove("hidden"); renderFavs(); });
  if (btnClose) btnClose.addEventListener("click", () => panel.classList.add("hidden"));
  if (btnClear) btnClear.addEventListener("click", () => { setFavs([]); renderFavs(); statusEl.textContent = "Cleared! 🗑️"; });
  if (categorySel) categorySel.addEventListener("change", onNewQuote);

  const quoteBtns = document.querySelector(".buttons");
  if (quoteBtns && !document.getElementById("btnCopy")) {
    const btnCopy = document.createElement("button");
    btnCopy.id = "btnCopy";
    btnCopy.className = "btn";
    btnCopy.textContent = "Copy";
    btnCopy.addEventListener("click", onCopyQuote);
    const btnShare = document.createElement("button");
    btnShare.id = "btnShare";
    btnShare.className = "btn";
    btnShare.textContent = "Share";
    btnShare.addEventListener("click", onShareQuote);
    quoteBtns.appendChild(btnCopy);
    quoteBtns.appendChild(btnShare);
  }

  function setupCategories() {
    if (!categorySel) return;
    categorySel.innerHTML = '<option value="all">All Categories</option>';
    if (typeof QUOTES !== 'undefined') {
      Object.keys(QUOTES).forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categorySel.appendChild(opt);
      });
    }
  }

  function renderDailyQuote() {
    const daily = getDailyQuote();
    if (daily) {
      const dailyBox = document.createElement("div");
      dailyBox.className = "daily-quote animate-in";
      dailyBox.innerHTML = `<div class="daily-label">✨ Daily Quote</div><div class="daily-text">"${daily.text}"</div><div class="daily-author">— ${daily.author}</div>`;
      const quoteSection = document.querySelector(".card");
      if (quoteSection) quoteSection.insertBefore(dailyBox, quoteSection.firstChild);
    }
  }

  setupCategories();
  renderDailyQuote();
  onNewQuote();
})();

/* ---------- KIDS ZONE: Story Books, Videos, 3D Topics ---------- */
(function kidsZoneInit() {
  const modal = document.getElementById("kzModal");
  if (!modal) return;

  const storyBook = document.getElementById("storyBooks");
  const videoGrid = document.getElementById("videoGrid");
  const threeGrid = document.getElementById("threeGrid");
  const modalTitle = document.getElementById("kzModalTitle");
  const modalClose = document.getElementById("kzModalClose");
  const modalContent = document.getElementById("modalContent");

  function closeModal() { modal.classList.add("hidden"); modal.setAttribute("aria-hidden", "true"); }

  function openStoryBook(story) {
    modal.classList.remove("hidden");
    let currentPage = 0;
    function renderPage() {
      const page = story.pages[currentPage];
      const numPages = story.pages.length;
      const html = `<div class="storyReader">
        <h3>${story.title}</h3>
        <div class="storyPage">
          <div class="pageImage">${page.image || "📖"}</div>
          <div class="pageContent">${page.text}</div>
          <div class="pageProgress">Page ${currentPage + 1} of ${numPages}</div>
        </div>
        <div class="storyControls">
          ${currentPage > 0 ? '<button class="btn small" id="prevBtn">← Previous</button>' : ''}
          ${currentPage < numPages - 1 ? '<button class="btn small" id="nextBtn">Next →</button>' : ''}
        </div>
      </div>`;
      modalContent.innerHTML = html;
      document.getElementById("nextBtn")?.addEventListener("click", () => { currentPage++; renderPage(); });
      document.getElementById("prevBtn")?.addEventListener("click", () => { currentPage--; renderPage(); });
    }
    modalTitle.textContent = story.title;
    renderPage();
  }

  function openVideo(video) {
    modal.classList.remove("hidden");
    modalContent.innerHTML = `<div class="videoPlayer">
      <div class="playerPlaceholder">
        <div class="playIcon">▶️</div>
        <div class="playerNote">🎬 ${video.title}</div>
        <div style="font-size:11px; color:#999; margin-top:8px;">Add videos to /public/assets/videos/</div>
      </div>
    </div>`;
    modalTitle.textContent = video.title;
  }

  function openThreeTopic(topic) {
    modal.classList.remove("hidden");
    let currentFact = 0;
    function renderFact() {
      const fact = topic.facts[currentFact];
      const html = `<div>
        <div class="threeScene animate-in"><div class="sceneContent">${topic.emoji} ${topic.title}</div></div>
        <div class="factBox"><strong>Fun Fact ${currentFact + 1}:</strong> ${fact}</div>
        <div class="factNav">
          ${currentFact > 0 ? '<button class="btn small" id="prevFact">← Previous</button>' : ''}
          ${currentFact < topic.facts.length - 1 ? '<button class="btn small" id="nextFact">Next →</button>' : ''}
        </div>
      </div>`;
      modalContent.innerHTML = html;
      document.getElementById("nextFact")?.addEventListener("click", () => { currentFact++; renderFact(); });
      document.getElementById("prevFact")?.addEventListener("click", () => { currentFact--; renderFact(); });
    }
    modalTitle.textContent = topic.title;
    renderFact();
  }

  if (storyBook && typeof STORIES !== 'undefined') {
    STORIES.forEach(story => {
      const card = document.createElement("button");
      card.className = "storyBook";
      card.innerHTML = `<div class="bookCover">${story.emoji}</div><div class="bookTitle">${story.title}</div><div class="bookPages">${story.pages.length} pages</div>`;
      card.addEventListener("click", () => openStoryBook(story));
      storyBook.appendChild(card);
    });
  }

  if (videoGrid && typeof VIDEOS !== 'undefined') {
    VIDEOS.forEach(video => {
      const card = document.createElement("button");
      card.className = "videoCard";
      card.innerHTML = `<div class="videoEmoji">${video.emoji}</div><div class="videoTitle">${video.title}</div>`;
      card.addEventListener("click", () => openVideo(video));
      videoGrid.appendChild(card);
    });
  }

  if (threeGrid && typeof THREE_TOPICS !== 'undefined') {
    THREE_TOPICS.forEach(topic => {
      const card = document.createElement("button");
      card.className = "threeCard";
      card.innerHTML = `<div class="threeEmoji">${topic.emoji}</div><div class="threeTitle">${topic.title}</div>`;
      card.addEventListener("click", () => openThreeTopic(topic));
      threeGrid.appendChild(card);
    });
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
})();

/* ---------- PARTY PLANNER: Wizard UI ---------- */
(function partyPlannerInit() {
  const wizardEl = document.getElementById("partyWizard");
  if (!wizardEl) return;

  const PARTY_KEY = "funcloud_party_v1";
  let step = 1;
  const state = { type: null, theme: null, guests: 15, budget: "medium" };

  function saveState() { localStorage.setItem(PARTY_KEY, JSON.stringify(state)); }
  function renderWizard() {
    let html = `<div class="wizard-progress"><div class="wizard-bar" style="width: ${(step / 5) * 100}%"></div></div>`;

    if (step === 1) {
      html += `<div class="wizard-step"><div class="step-header"><div class="step-title">🎉 Step 1: Party Type</div><div class="step-subtitle">What kind of party?</div></div><div class="choiceGrid" id="typeChoices">`;
      if (typeof PARTY_PLANNER !== 'undefined') {
        PARTY_PLANNER.types.forEach(t => { html += `<button class="choice ${state.type === t ? 'isSelected' : ''}">${t}</button>`; });
      }
      html += `</div><div class="step-buttons"><button class="btn" id="nextBtn">Next</button></div></div>`;
      wizardEl.innerHTML = html;
      document.querySelectorAll("#typeChoices .choice").forEach(btn => {
        btn.addEventListener("click", (e) => {
          state.type = e.target.textContent;
          document.querySelectorAll("#typeChoices .choice").forEach(b => b.classList.remove("isSelected"));
          e.target.classList.add("isSelected");
        });
      });
      document.getElementById("nextBtn").addEventListener("click", () => { if (state.type) { step = 2; renderWizard(); } });
    } else if (step === 2) {
      const themes = (typeof PARTY_PLANNER !== 'undefined' && state.type) ? PARTY_PLANNER.themes[state.type] || [] : [];
      html += `<div class="wizard-step"><div class="step-header"><div class="step-title">🎨 Step 2: Theme</div><div class="step-subtitle">Pick a theme</div></div><div class="choiceGrid" id="themeChoices">`;
      themes.forEach(t => { html += `<button class="choice ${state.theme === t ? 'isSelected' : ''}">${t}</button>`; });
      html += `</div><div class="step-buttons"><button class="btn small" id="backBtn">Back</button><button class="btn" id="nextBtn">Next</button></div></div>`;
      wizardEl.innerHTML = html;
      document.querySelectorAll("#themeChoices .choice").forEach(btn => {
        btn.addEventListener("click", (e) => {
          state.theme = e.target.textContent;
          document.querySelectorAll("#themeChoices .choice").forEach(b => b.classList.remove("isSelected"));
          e.target.classList.add("isSelected");
        });
      });
      document.getElementById("nextBtn").addEventListener("click", () => { if (state.theme) { step = 3; renderWizard(); } });
      document.getElementById("backBtn").addEventListener("click", () => { step = 1; renderWizard(); });
    } else if (step === 3) {
      html += `<div class="wizard-step"><div class="step-header"><div class="step-title">👥 Step 3: Guests</div><div class="step-subtitle">Count: ${state.guests}</div></div><input type="range" min="5" max="200" value="${state.guests}" id="guestSlider" style="width:100%; cursor:pointer;"><div class="step-buttons"><button class="btn small" id="backBtn">Back</button><button class="btn" id="nextBtn">Next</button></div></div>`;
      wizardEl.innerHTML = html;
      document.getElementById("guestSlider").addEventListener("input", (e) => {
        state.guests = parseInt(e.target.value);
        document.querySelector(".step-subtitle").textContent = `Count: ${state.guests}`;
      });
      document.getElementById("nextBtn").addEventListener("click", () => { step = 4; renderWizard(); });
      document.getElementById("backBtn").addEventListener("click", () => { step = 2; renderWizard(); });
    } else if (step === 4) {
      html += `<div class="wizard-step"><div class="step-header"><div class="step-title">💰 Step 4: Budget</div><div class="step-subtitle">Choose budget</div></div><div class="choiceGrid" id="budgetChoices">
        <button class="choice ${state.budget === 'low' ? 'isSelected' : ''}">💚 Low</button>
        <button class="choice ${state.budget === 'medium' ? 'isSelected' : ''}">💛 Medium</button>
        <button class="choice ${state.budget === 'high' ? 'isSelected' : ''}">❤️ High</button>
      </div><div class="step-buttons"><button class="btn small" id="backBtn">Back</button><button class="btn" id="nextBtn">Generate!</button></div></div>`;
      wizardEl.innerHTML = html;
      document.querySelectorAll("#budgetChoices .choice").forEach((btn, idx) => {
        btn.addEventListener("click", () => {
          state.budget = ['low', 'medium', 'high'][idx];
          document.querySelectorAll("#budgetChoices .choice").forEach(b => b.classList.remove("isSelected"));
          btn.classList.add("isSelected");
        });
      });
      document.getElementById("nextBtn").addEventListener("click", () => { step = 5; renderWizard(); });
      document.getElementById("backBtn").addEventListener("click", () => { step = 3; renderWizard(); });
    } else if (step === 5) {
      saveState();
      const checklist = typeof PARTY_PLANNER !== 'undefined' ? PARTY_PLANNER.checklists.birthday : [];
      const timeline = typeof PARTY_PLANNER !== 'undefined' ? PARTY_PLANNER.timelines.afternoon : [];
      html += `<div class="wizard-step plan-output animate-fade">
        <div class="step-header"><div class="step-title">🎊 Your Party Plan</div></div>
        <div class="plan-section"><div class="plan-header">📋 Details</div><div style="font-size:13px;">Type: <strong>${state.type}</strong> | Theme: <strong>${state.theme}</strong> | Guests: <strong>${state.guests}</strong> | Budget: <strong>${state.budget}</strong></div></div>
        <div class="plan-section"><div class="plan-header">✓ Checklist</div><ul class="plan-list">${checklist.map(item => `<li>${item}</li>`).join('')}</ul></div>
        <div class="plan-section"><div class="plan-header">⏰ Timeline</div><ul class="plan-list">${timeline.map(item => `<li>${item}</li>`).join('')}</ul></div>
        <div class="step-buttons"><button class="btn" id="printBtn">🖨️ Print</button><button class="btn small" id="regenerateBtn">Again</button></div>
      </div>`;
      wizardEl.innerHTML = html;
      document.getElementById("printBtn").addEventListener("click", () => window.print());
      document.getElementById("regenerateBtn").addEventListener("click", () => {
        step = 1; state.type = null; state.theme = null; state.guests = 15; state.budget = "medium";
        renderWizard();
      });
    }
  }
  renderWizard();
})();

/* ---------- CHAT: Suggestions + Local Responder ---------- */
(function chatInit() {
  const messagesEl = document.getElementById("chatMessages");
  const inputEl = document.getElementById("chatInput");
  const nameEl = document.getElementById("chatName");
  const sendBtn = document.getElementById("sendChatBtn");
  const clearBtn = document.getElementById("clearChatBtn");
  const chipsContainer = document.getElementById("chatChips");
  const MSG_KEY = "funcloud_chat_v1";

  if (!messagesEl) return;

  function loadMsgs() { try { return JSON.parse(localStorage.getItem(MSG_KEY)) || []; } catch { return []; } }
  function saveMsgs(list) { if (list.length > 20) list = list.slice(-20); localStorage.setItem(MSG_KEY, JSON.stringify(list)); }

  function getResponse(text) {
    const lower = text.toLowerCase();
    if (typeof CHAT_RESPONSES !== 'undefined') {
      if (lower.includes("story")) return CHAT_RESPONSES.story[Math.floor(Math.random() * CHAT_RESPONSES.story.length)];
      if (lower.includes("study") || lower.includes("learn")) return CHAT_RESPONSES.study[Math.floor(Math.random() * CHAT_RESPONSES.study.length)];
      if (lower.includes("party")) return CHAT_RESPONSES.party[Math.floor(Math.random() * CHAT_RESPONSES.party.length)];
      if (lower.includes("quote")) return CHAT_RESPONSES.quote[Math.floor(Math.random() * CHAT_RESPONSES.quote.length)];
    }
    return "That's wonderful! 🌟 Keep exploring!";
  }

  function render() {
    const msgs = loadMsgs();
    messagesEl.innerHTML = "";
    if (!msgs.length) {
      const li = document.createElement("li");
      li.textContent = "👋 Try: 'Tell me a story', 'Help me study', 'Plan a party', or 'Give me a quote'!";
      li.style.padding = "8px";
      messagesEl.appendChild(li);
      return;
    }
    msgs.forEach(m => {
      const li = document.createElement("li");
      li.style.cssText = "padding:8px; margin-bottom:8px; border-radius:10px; background:" + (m.isBot ? "#f0f0f0" : "#d7e4f9");
      const header = document.createElement("div");
      header.style.cssText = "font-size:11px; color:#666; margin-bottom:4px";
      header.textContent = `${m.name} ${m.isBot ? '🤖' : '👤'} • ${new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const body = document.createElement("div");
      body.textContent = m.text;
      body.style.fontSize = "13px";
      li.appendChild(header);
      li.appendChild(body);
      messagesEl.appendChild(li);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function send(text = null) {
    const v = (text || inputEl.value || "").trim();
    if (!v) return;
    const list = loadMsgs();
    const name = (nameEl?.value?.trim()) || 'Friend';
    list.push({ text: v, at: new Date().toISOString(), name, isBot: false });
    const response = getResponse(v);
    setTimeout(() => {
      list.push({ text: response, at: new Date().toISOString(), name: 'FunCloud', isBot: true });
      saveMsgs(list);
      render();
    }, 800);
    saveMsgs(list);
    inputEl.value = "";
    render();
  }

  if (chipsContainer) {
    ["Tell me a story", "Help me study", "Plan a party", "Give me a quote"].forEach(sugg => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.textContent = sugg;
      chip.addEventListener("click", () => send(sugg));
      chipsContainer.appendChild(chip);
    });
  }

  if (sendBtn) sendBtn.addEventListener("click", () => send());
  if (inputEl) inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  if (clearBtn) clearBtn.addEventListener("click", () => { localStorage.removeItem(MSG_KEY); render(); });

  render();
})();

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

/* ---------- STORY BOOKS: Advanced 3D-like with Parallax & Three.js ---------- */
(function storyBooksInit() {
  const STORY_KEY = "funcloud_story_v1";
  const storyBooksGrid = document.getElementById("storyBooks");
  const storyReaderModal = document.getElementById("storyReaderModal");
  if (!storyBooksGrid || !storyReaderModal) return;

  let currentStory = null;
  let currentPageIndex = 0;
  let soundOn = true;
  let use3DMode = false;
  let threeScene = null;

  // Initialize Story Books Grid
  if (typeof STORIES !== 'undefined') {
    STORIES.forEach((story, idx) => {
      const card = document.createElement("button");
      card.className = "storyBookCard";
      card.innerHTML = `<div class="storyBookEmoji">${story.emoji}</div><div class="storyBookTitle">${story.title}</div><div class="storyBookDesc">${story.description}</div>`;
      card.addEventListener("click", () => openStory(story));
      storyBooksGrid.appendChild(card);
    });
  }

  function saveProgress() {
    const progress = { lastStory: currentStory?.id, lastPage: currentPageIndex, soundOn, use3DMode };
    localStorage.setItem(STORY_KEY, JSON.stringify(progress));
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORY_KEY)) || {};
      soundOn = saved.soundOn !== false;
      use3DMode = saved.use3DMode === true;
      updateUI();
    } catch (e) {}
  }

  function playSound() {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  function createSparkles(x, y, count = 12) {
    const container = document.getElementById("sparkleContainer");
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      const angle = (i / count) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";
      sparkle.style.setProperty("--tx", tx + "px");
      sparkle.style.setProperty("--ty", ty + "px");
      sparkle.textContent = "✨";
      sparkle.style.fontSize = "16px";
      container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1500);
    }
  }

  function handleParallax(event) {
    const stage = document.getElementById("storyParallaxStage");
    if (!stage || use3DMode) return;
    const rect = stage.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = event.clientX - rect.left || event.touches?.[0].clientX - rect.left || centerX;
    const y = event.clientY - rect.top || event.touches?.[0].clientY - rect.top || centerY;
    const rotX = ((y - centerY) / centerY) * 8;
    const rotY = ((x - centerX) / centerX) * 8;

    const bgLayer = document.getElementById("storyBgLayer");
    const charLayer = document.getElementById("storyCharLayer");
    const fgLayer = document.getElementById("storyFgLayer");

    if (bgLayer) bgLayer.style.transform = `rotateX(${rotX * 0.5}deg) rotateY(${rotY * 0.5}deg) translateZ(-30px)`;
    if (charLayer) charLayer.style.transform = `rotateX(${rotX * 0.7}deg) rotateY(${rotY * 0.7}deg) translateZ(20px)`;
    if (fgLayer) fgLayer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(-15px)`;
  }

  function handleCharacterTap(e) {
    if (use3DMode) return;
    playSound();
    const charLayer = document.getElementById("storyCharLayer");
    if (charLayer) {
      charLayer.classList.remove("jump");
      charLayer.classList.remove("glow");
      void charLayer.offsetWidth;
      charLayer.classList.add("jump", "glow");
      const rect = charLayer.getBoundingClientRect();
      createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }

  function updateUI() {
    const toggle3DBtn = document.getElementById("storyToggle3D");
    const toggleSoundBtn = document.getElementById("storyToggleSound");

    if (toggle3DBtn) {
      toggle3DBtn.textContent = use3DMode ? "📖 2D" : "🎯 3D";
      toggle3DBtn.classList.toggle("active", use3DMode);
    }
    if (toggleSoundBtn) {
      toggleSoundBtn.textContent = soundOn ? "🔊 On" : "🔇 Off";
      toggleSoundBtn.classList.toggle("active", soundOn);
    }
  }

  function init3DScene() {
    if (threeScene) threeScene.renderer.dispose();
    const container = document.getElementById("storyScene3D");
    if (!container) return;
    container.innerHTML = "";

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0xe0f4ff, 0.5);
      container.appendChild(renderer.domElement);

      const page = currentStory.pages[currentPageIndex];
      const geom = new THREE.IcosahedronGeometry(2, 4);
      const mat = new THREE.MeshPhongMaterial({ color: 0xa78bfa, shininess: 100 });
      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
      light1.position.set(5, 5, 5);
      scene.add(light1);
      const light2 = new THREE.PointLight(0x667eea, 0.6);
      light2.position.set(-5, 5, 5);
      scene.add(light2);

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.008;
        mesh.position.y = Math.sin(Date.now() * 0.001) * 0.5;
        renderer.render(scene, camera);
      }
      animate();

      threeScene = { renderer, scene, camera, mesh };
    } catch (e) {
      container.innerHTML = '<div style="color:#999; padding:20px; text-align:center;">WebGL not available</div>';
    }
  }

  function renderPage() {
    const page = currentStory.pages[currentPageIndex];
    const numPages = currentStory.pages.length;
    saveProgress();

    // Update text and indicator
    document.getElementById("storyPageText").textContent = page.text;
    document.getElementById("pageIndicator").textContent = `Page ${currentPageIndex + 1} of ${numPages}`;

    // Update AI prompt
    const aiPromptText = document.getElementById("aiPromptText");
    if (aiPromptText) aiPromptText.textContent = `✨ ${page.aiPrompt}`;

    // Update layers (parallax)
    const bgLayer = document.getElementById("storyBgLayer");
    const charLayer = document.getElementById("storyCharLayer");
    const fgLayer = document.getElementById("storyFgLayer");

    if (bgLayer) bgLayer.textContent = page.imageSlots?.background || "🌌";
    if (charLayer) charLayer.textContent = page.imageSlots?.character || "🦋";
    if (fgLayer) fgLayer.textContent = page.imageSlots?.foreground || "⭐";

    // Remove jump/glow
    if (charLayer) {
      charLayer.classList.remove("jump", "glow");
    }

    // Toggle 3D based on page flag
    const storyParallax = document.getElementById("storyParallaxStage");
    const storyScene3D = document.getElementById("storyScene3D");
    const shouldUse3D = page.use3D && use3DMode;

    if (storyParallax) storyParallax.classList.toggle("hidden", shouldUse3D);
    if (storyScene3D) storyScene3D.classList.toggle("hidden", !shouldUse3D);

    if (shouldUse3D) init3DScene();

    // Update buttons
    document.getElementById("storyPrevBtn").disabled = currentPageIndex === 0;
    document.getElementById("storyNextBtn").disabled = currentPageIndex === numPages - 1;
  }

  function openStory(story) {
    currentStory = story;
    currentPageIndex = 0;
    storyReaderModal.classList.remove("hidden");
    storyReaderModal.setAttribute("aria-hidden", "false");
    document.getElementById("storyTitle").textContent = story.title;

    // Parallax listeners
    const stage = document.getElementById("storyParallaxStage");
    if (stage) {
      stage.addEventListener("mousemove", handleParallax);
      stage.addEventListener("touchmove", handleParallax);
      stage.addEventListener("click", handleCharacterTap);
      stage.addEventListener("touchstart", handleCharacterTap);
    }

    // Button listeners
    document.getElementById("storyNextBtn").onclick = () => { if (currentPageIndex < story.pages.length - 1) { currentPageIndex++; renderPage(); } };
    document.getElementById("storyPrevBtn").onclick = () => { if (currentPageIndex > 0) { currentPageIndex--; renderPage(); } };

    document.getElementById("storyToggle3D").onclick = () => {
      use3DMode = !use3DMode;
      saveProgress();
      updateUI();
      renderPage();
    };

    document.getElementById("storyToggleSound").onclick = () => {
      soundOn = !soundOn;
      saveProgress();
      updateUI();
    };

    document.getElementById("storyReaderClose").onclick = closeStory;

    renderPage();
    updateUI();
  }

  function closeStory() {
    const stage = document.getElementById("storyParallaxStage");
    if (stage) {
      stage.removeEventListener("mousemove", handleParallax);
      stage.removeEventListener("touchmove", handleParallax);
      stage.removeEventListener("click", handleCharacterTap);
    }
    if (threeScene) threeScene.renderer.dispose();
    storyReaderModal.classList.add("hidden");
    storyReaderModal.setAttribute("aria-hidden", "true");
  }

  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !storyReaderModal.classList.contains("hidden")) closeStory(); });

  loadProgress();
})();

/* ---------- KIDS ZONE: Videos & 3D Topics ---------- */
(function kidsZoneInit() {
  // Handle World Explorer category tabs (Animals, Space, Dinosaurs, Ocean)
  const tabs = document.querySelectorAll(".kzTab");
  const panels = document.querySelectorAll(".kzPanel");
  const explorerTitle = document.getElementById("explorerTitle");
  const closeExplorerBtn = document.getElementById("closeExplorerBtn");
  const kidsExplorer = document.getElementById("kidsExplorer");
  const kidsSoundToggle = document.getElementById("kidsSoundToggle");

  const titleMap = {
    animals: "🦁 Animal World Explorer",
    space: "🚀 Space Explorer",
    dinosaurs: "🦖 Dinosaur Explorer",
    ocean: "🐙 Ocean Explorer"
  };

  // Tab click handler
  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      const zone = this.getAttribute("data-zone");

      // Hide all panels
      panels.forEach(panel => panel.classList.add("hidden"));

      // Show selected panel
      const selectedPanel = document.querySelector(`.kzPanel[data-zone="${zone}"]`);
      if (selectedPanel) selectedPanel.classList.remove("hidden");

      // Update active tab styling
      tabs.forEach(t => {
        t.classList.remove("isActive");
        t.setAttribute("aria-selected", "false");
      });
      this.classList.add("isActive");
      this.setAttribute("aria-selected", "true");

      // Update explorer title
      if (explorerTitle) explorerTitle.textContent = titleMap[zone] || "Explorer";
    });
  });

  // Close explorer button
  if (closeExplorerBtn) {
    closeExplorerBtn.addEventListener("click", () => {
      if (kidsExplorer) kidsExplorer.classList.add("hidden");
    });
  }

  // Sound toggle for explorer
  let soundOn = true;
  if (kidsSoundToggle) {
    kidsSoundToggle.addEventListener("click", () => {
      soundOn = !soundOn;
      kidsSoundToggle.textContent = soundOn ? "Sound: On" : "Sound: Off";
      kidsSoundToggle.setAttribute("aria-pressed", soundOn);
    });
  }

  const videoGrid = document.getElementById("videoGrid");
  const threeGrid = document.getElementById("threeGrid");
  const modal = document.getElementById("kzModal");
  if (!modal) return;

  const modalTitle = document.getElementById("kzModalTitle");
  const modalClose = document.getElementById("kzModalClose");
  const modalContent = document.getElementById("modalContent");

  function closeModal() { modal.classList.add("hidden"); modal.setAttribute("aria-hidden", "true"); }

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

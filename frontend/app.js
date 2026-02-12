// Premium FunCloud - All Modules
import { analyzeSEO, sendChatMessage } from "./api.js";

/* ---------- PARTY DECOR & VENDORS DATA ---------- */

const DECOR_CATALOG = [
  { id: "balloons", name: "Balloon Set", price: "$40–$120", img: "assets/party/balloons.jpg" },
  { id: "backdrop", name: "Backdrop Panel", price: "$80–$250", img: "assets/party/backdrop.jpg" },
  { id: "arch", name: "Balloon Arch", price: "$150–$450", img: "assets/party/arches.jpg" },
  { id: "table", name: "Table Decor", price: "$35–$150", img: "assets/party/table-decor.jpg" },
  { id: "cake", name: "Cake Toppers", price: "$10–$45", img: "assets/party/cake-toppers.jpg" },
  { id: "neon", name: "Neon Sign", price: "$120–$350", img: "assets/party/neon-sign.jpg" },
  { id: "photo", name: "Photo Booth Props", price: "$25–$90", img: "assets/party/photo-booth.jpg" },
  { id: "favors", name: "Party Favors", price: "$20–$100", img: "assets/party/party-favors.jpg" }
];

const OTTAWA_VENDORS = [
  { id: "capital", name: "Capital Balloons Co.", specialty: "Balloon Garlands", link: "https://instagram.com" },
  { id: "byward", name: "ByWard Backdrops", specialty: "Backdrops & Neon", link: "https://example.com" },
  { id: "rideau", name: "Rideau Party Rentals", specialty: "Tables & Decor", link: "https://example.com" },
  { id: "photoFun", name: "Ottawa Photo Fun", specialty: "Photo Booths", link: "https://instagram.com" }
];


/* ---------- Ollama Test Hook ---------- */
async function testOllama() {
  const result = await askLLM("Write one short happy sentence for kids.");
  alert(result);
}

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

  // Track currently opened item topic for audio controls
  let currentItemTopic = null;

  // Enhanced closeModal: also stop any playing audio/synth
  function stopSynth() {
    try {
      if (window._kz_synth && window._kz_synth.osc) {
        window._kz_synth.osc.stop();
        window._kz_synth.gain.disconnect();
        window._kz_synth = null;
      }
      if (window._kz_synth_timeout) { clearTimeout(window._kz_synth_timeout); window._kz_synth_timeout = null; }
    } catch (e) { /* ignore */ }
  }

  function stopSoundPlayback() {
    try {
      const audioEl = document.getElementById('kzAudio');
      if (audioEl && !audioEl.paused) {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    } catch (e) {}
    stopSynth();
  }

  function closeModalAndStop() {
    stopSoundPlayback();
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
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

  // Items data: emoji, title, facts, optional sound (assets optional)
  const itemsData = {
    animals: {
      lion: { emoji: '🦁', title: 'Lion', facts: [
        'Lions live in groups called prides.',
        'A lion’s roar can be heard up to 5 miles away.',
        'Male lions often have manes to look bigger and protect their necks.'
      ], sound: '/assets/sounds/lion.mp3' },
      elephant: { emoji: '🐘', title: 'Elephant', facts: [
        'Elephants can smell water from miles away.',
        'They use their trunks to breathe, smell, drink, and grab things.',
        'Elephants are very social and remember friends for years.'
      ], sound: '/assets/sounds/elephant.mp3' },
      dolphin: { emoji: '🐬', title: 'Dolphin', facts: [
        'Dolphins are very smart and can use tools.',
        'They talk to each other using clicks and whistles.',
        'Dolphins sleep with one eye open to watch for danger.'
      ], sound: '/assets/sounds/dolphin.mp3' },
      tiger: { emoji: '🐯', title: 'Tiger', facts: [
        'Tigers have striped skin as well as striped fur.',
        'They are powerful swimmers and love water.',
        'Each tiger’s stripe pattern is unique, like a fingerprint.'
      ] },
      monkey: { emoji: '🐒', title: 'Monkey', facts: [
        'Monkeys use their tails to help balance.',
        'Some monkeys make and use simple tools.',
        'They live in troops and help each other find food.'
      ] },
      penguin: { emoji: '🐧', title: 'Penguin', facts: [
        'Penguins cannot fly but are excellent swimmers.',
        'They huddle together to keep warm in cold weather.',
        'Penguins eat fish, squid, and krill.'
      ] }
    },
    space: {
      rocket: { emoji: '🚀', title: 'Rocket', facts: [
        'Rockets go into space by burning fuel really fast.',
        'Satellites help us with phones, GPS, and weather forecasts.',
        'Astronauts train for years before going to space.'
      ] },
      planet: { emoji: '🪐', title: 'Planet', facts: [
        'Planets orbit stars like the Sun.',
        'Some planets have rings made of ice and rock.',
        'Planets can be gas giants or rocky worlds.'
      ] },
      astronaut: { emoji: '🧑‍🚀', title: 'Astronaut', facts: [
        'Astronauts wear special suits to breathe in space.',
        'They float because there is microgravity in orbit.',
        'Astronauts grow slightly taller in space!' ], sound: '/assets/sounds/astronaut.mp3' },
      comet: { emoji: '☄️', title: 'Comet', facts: [
        'Comets are made of ice, rock, and dust.',
        'When they get close to the Sun they grow glowing tails.',
        'Some comets return to the inner solar system every few years.'
      ] },
      satellite: { emoji: '🛰️', title: 'Satellite', facts: [
        'Satellites orbit the Earth and send us information.',
        'Some satellites take pictures of our planet from space.',
        'We use satellites for communication and navigation.'
      ] },
      moon: { emoji: '🌕', title: 'Moon', facts: [
        'The Moon controls the tides on Earth.',
        'People have walked on the Moon during Apollo missions.',
        'The Moon is covered in dusty soil called regolith.'
      ] }
    },
    dinosaurs: {
      trex: { emoji: '🦖', title: 'T-Rex', facts: [
        'T-Rex had very strong jaws and big teeth.',
        'It lived millions of years ago during the Cretaceous period.',
        'Scientists think it could run fast for short distances.'
      ] },
      sauropod: { emoji: '🦕', title: 'Sauropod', facts: [
        'Sauropods were huge and had long necks to eat leaves high in trees.',
        'Some sauropods were as tall as a three-story building.',
        'They likely moved in herds for safety.'
      ] },
      egg: { emoji: '🥚', title: 'Dino Egg', facts: [
        'Dinosaurs hatched from eggs like birds and reptiles.',
        'Some dinosaur eggs were as big as a basketball or larger.',
        'Fossilized eggs help scientists learn about dinosaur families.'
      ] },
      triceratops: { emoji: '🦕', title: 'Triceratops', facts: [
        'Triceratops had three big horns on its face.',
        'They used their horns to protect themselves from predators.',
        'They were plant-eaters with strong beaks.'
      ] },
      velociraptor: { emoji: '🦖', title: 'Velociraptor', facts: [
        'Velociraptors were fast and clever hunters.',
        'They were about the size of a turkey, not huge like in movies.',
        'They may have had feathers like birds.'
      ] },
      brachiosaurus: { emoji: '🦕', title: 'Brachiosaurus', facts: [
        'Brachiosaurus had very long necks to reach tall trees.',
        'They were herbivores and ate lots of plants.',
        'Their front legs were longer than their back legs.'
      ] }
    },
    ocean: {
      shark: { emoji: '🦈', title: 'Shark', facts: [
        'Sharks have been around longer than dinosaurs.',
        'Some sharks can detect tiny amounts of blood in water.',
        'Sharks come in many sizes, from small to huge.'
      ] },
      octopus: { emoji: '🐙', title: 'Octopus', facts: [
        'Octopuses have three hearts and blue blood.',
        'They can change color to hide from predators.',
        'Octopuses are very clever and use tools sometimes.'
      ] },
      turtle: { emoji: '🐢', title: 'Turtle', facts: [
        'Some sea turtles migrate thousands of miles.',
        'Turtles have shells that protect them from danger.',
        'Many turtles lay eggs on sandy beaches.'
      ] },
      whale: { emoji: '🐋', title: 'Whale', facts: [
        'Whales are the largest animals on Earth.',
        'Some whales sing complex songs to talk to each other.',
        'They eat tiny animals called krill or big fish depending on the species.'
      ] },
      seahorse: { emoji: '🦄', title: 'Seahorse', facts: [
        'Male seahorses carry and give birth to the babies.',
        'Seahorses anchor themselves with their tails to avoid drifting.',
        'They are small and have a horse-like head shape.'
      ] },
      jellyfish: { emoji: '🪼', title: 'Jellyfish', facts: [
        'Jellyfish can glow in the dark in some places.',
        'They drift with ocean currents and don’t have brains like we do.',
        'Some jellyfish stings can hurt, so be careful at the beach.'
      ] }
    }
  };

  // Attach click handlers for all kzItem tiles
  document.querySelectorAll('.kzItem').forEach(btn => {
    btn.addEventListener('click', () => {
      const zone = btn.getAttribute('data-zone');
      const item = btn.getAttribute('data-item');
      const topic = (itemsData[zone] && itemsData[zone][item]) || { emoji: '❓', title: item || 'Item', facts: ['No facts available.'] };
      currentItemTopic = topic;
      try {
        openThreeTopic(topic);
      } catch (err) {
        console.error('Failed to open item modal:', err);
      }

      // Optional sound play if available (initial autoplay attempt)
      try {
        const audioEl = document.getElementById('kzAudio');
        if (topic.sound && soundOn && audioEl) {
          audioEl.src = topic.sound;
          const p = audioEl.play();
          if (p && p.catch) p.catch(() => {});
        }
      } catch (err) {
        // Don't let sound errors break the UI
        console.warn('Sound play failed:', err);
      }
    });
  });

  // Wire play/stop buttons
  const playBtn = document.getElementById('kzPlaySound');
  const stopBtn = document.getElementById('kzStopSound');
  const audioEl = document.getElementById('kzAudio');

  async function playCurrentSound() {
    if (!currentItemTopic) return;
    const src = currentItemTopic.sound;
    if (src && audioEl) {
      try {
        audioEl.src = src;
        await audioEl.play();
      } catch (e) { console.warn('Audio play failed', e); }
      return;
    }

    // Fallback: simple beep via WebAudio
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!window._kz_audio_ctx) window._kz_audio_ctx = new AudioCtx();
      const ctx = window._kz_audio_ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 440;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      o.start();
      window._kz_synth = { osc: o, gain: g };
      window._kz_synth_timeout = setTimeout(() => { stopSynth(); }, 2000);
    } catch (e) { console.warn('Synth failed', e); }
  }

  function stopCurrentSound() {
    try {
      if (audioEl && !audioEl.paused) {
        audioEl.pause(); audioEl.currentTime = 0;
      }
    } catch (e) { }
    stopSynth();
  }

  if (playBtn) playBtn.addEventListener('click', () => { playCurrentSound(); });
  if (stopBtn) stopBtn.addEventListener('click', () => { stopCurrentSound(); });

  // Ensure closing modal stops audio
  if (modalClose) modalClose.addEventListener('click', closeModalAndStop);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModalAndStop(); });
  document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModalAndStop(); });

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
  const state = {
  type: null,
  theme: null,
  guests: 15,
  budget: "medium",
  decor: [],
  vendor: null
};


  function saveState() { localStorage.setItem(PARTY_KEY, JSON.stringify(state)); }
  function renderWizard() {
    const TOTAL_STEPS = 7;
    let html = `<div class="wizard-progress"><div class="wizard-bar" style="width: ${(step / TOTAL_STEPS) * 100}%"></div></div>`;

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
      // Location & Theme
      const locations = [
        "Mooney's Bay Park",
        "Andrew Haydon Park",
        "Vincent Massey Park",
        "Lansdowne Park",
        "Britannia Beach",
        "Museum of Nature (nearby)",
        "Local community center"
      ];

      // Themes - include wider set and emoji placeholders
      const themeChoices = ["Princess", "Superheroes", "Dino", "Space", "Unicorn", "Ocean", "Sports", "Minecraft", "Paw Patrol"];

      html += `<div class="wizard-step"><div class="step-header"><div class="step-title">📍 Step 2: Location & Theme</div><div class="step-subtitle">Choose a location and theme</div></div>`;
      // Locations
      html += `<div class="plan-section"><div class="plan-header">📌 Locations (Ottawa)</div><div class="choiceGrid" id="locationChoices">`;
      locations.forEach(loc => { html += `<button class="choice ${state.location === loc ? 'isSelected' : ''}">${loc}</button>`; });
      html += `</div></div>`;

      // Themes with emoji tiles
      html += `<div class="plan-section"><div class="plan-header">🎭 Theme / Decor</div><div class="choiceGrid" id="themeChoices">`;
      const themeEmojiMap = { Princess: '👑', Superheroes: '🦸‍♂️', Dino: '🦕', Space: '🚀', Unicorn: '🦄', Ocean: '🌊', Sports: '🏀', Minecraft: '🪓', 'Paw Patrol': '🐶' };
      themeChoices.forEach(t => { html += `<button class="choice ${state.theme === t ? 'isSelected' : ''}"><div style="font-size:20px">${themeEmojiMap[t] || '🎨'}</div><div style="font-size:12px; margin-top:6px">${t}</div></button>`; });
      html += `</div></div>`;

      html += `<div class="step-buttons"><button class="btn small" id="backBtn">Back</button><button class="btn" id="nextBtn">Next</button></div></div>`;
      wizardEl.innerHTML = html;

      document.querySelectorAll("#locationChoices .choice").forEach(btn => {
        btn.addEventListener("click", (e) => {
          state.location = e.target.textContent;
          document.querySelectorAll("#locationChoices .choice").forEach(b => b.classList.remove("isSelected"));
          e.target.classList.add("isSelected");
        });
      });

      document.querySelectorAll("#themeChoices .choice").forEach(btn => {
        btn.addEventListener("click", (e) => {
          state.theme = e.target.textContent;
          document.querySelectorAll("#themeChoices .choice").forEach(b => b.classList.remove("isSelected"));
          e.target.classList.add("isSelected");
        });
      });

      document.getElementById("nextBtn").addEventListener("click", () => { step = 3; renderWizard(); });
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
      </div><div class="step-buttons"><button class="btn small" id="backBtn">Back</button><button class="btn" id="nextBtn">Next</button></div></div>`;
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
      // Review & Shopping list
      saveState();
      const shopping = [
        'balloons', 'banner', 'plates/cups', 'table cover', 'party hats', 'cake topper', 'loot bags', 'themed backdrop'
      ];
      html += `<div class="wizard-step plan-output animate-fade">
        <div class="step-header"><div class="step-title">🛒 Shopping List & Review</div></div>
        <div class="plan-section"><div class="plan-header">📋 Details</div><div style="font-size:13px;">Type: <strong>${state.type}</strong> | Location: <strong>${state.location || 'TBD'}</strong> | Theme: <strong>${state.theme || 'TBD'}</strong> | Guests: <strong>${state.guests}</strong> | Budget: <strong>${state.budget}</strong></div></div>
        <div class="plan-section"><div class="plan-header">🧾 Shopping List</div><ul class="plan-list">${shopping.map(item => `<li>${item}</li>`).join('')}</ul></div>
        <div class="step-buttons"><button class="btn small" id="backBtn">Back</button><button class="btn" id="nextBtn">Generate Plan</button></div>
      </div>`;
      wizardEl.innerHTML = html;
      document.getElementById("nextBtn").addEventListener("click", () => { step = 6; renderWizard(); });
      document.getElementById("backBtn").addEventListener("click", () => { step = 4; renderWizard(); });

    } else if (step === 6) {
      // Final Party Plan Summary
      saveState();
      const checklist = ['balloons','banner','plates/cups','table cover','party hats','cake topper','loot bags','themed backdrop'];
      const timeline = typeof PARTY_PLANNER !== 'undefined' ? PARTY_PLANNER.timelines.afternoon : [];
      const inviteTemplate = `You're invited to a ${state.type} party at ${state.location || 'our chosen location'}! Theme: ${state.theme || 'TBD'}. RSVP please!`;

      html += `<div class="wizard-step plan-output animate-fade">
        <div class="step-header"><div class="step-title">🎊 Party Plan Summary</div></div>
        <div class="plan-section"><div class="plan-header">📋 Summary</div>
          <div style="font-size:13px;">Type: <strong>${state.type}</strong></div>
          <div style="font-size:13px;">Location: <strong>${state.location || 'TBD'}</strong></div>
          <div style="font-size:13px;">Theme: <strong>${state.theme || 'TBD'}</strong></div>
          <div style="font-size:13px;">Guests: <strong>${state.guests}</strong></div>
          <div style="font-size:13px;">Budget: <strong>${state.budget}</strong></div>
        </div>
        <div class="plan-section"><div class="plan-header">🧾 Decor Checklist</div><ul class="plan-list">${checklist.map(i => `<li>${i}</li>`).join('')}</ul></div>
        <div class="plan-section"><div class="plan-header">⏰ Schedule</div><ul class="plan-list">${timeline.map(item => `<li>${item}</li>`).join('')}</ul></div>
        <div class="plan-section"><div class="plan-header">✉️ Invitation Template</div><div style="font-size:13px;">${inviteTemplate}</div></div>
        <div class="step-buttons"><button class="btn" id="printBtn">🖨️ Print</button><button class="btn small" id="regenerateBtn">Again</button></div>
      </div>`;
      wizardEl.innerHTML = html;
      document.getElementById("printBtn").addEventListener("click", () => window.print());
      document.getElementById("regenerateBtn").addEventListener("click", () => {
        step = 1; state.type = null; state.theme = null; state.location = null; state.guests = 15; state.budget = "medium";
        renderWizard();
      });
    }
  }
  renderWizard();
})();

/* ---------- CHAT: AI-Powered Chat ---------- */
(function chatInit() {
  const messagesEl = document.getElementById("chatMessages");
  const inputEl = document.getElementById("chatInput");
  const nameEl = document.getElementById("chatName");
  const sendBtn = document.getElementById("sendChatBtn");
  const clearBtn = document.getElementById("clearChatBtn");
  const chipsContainer = document.getElementById("chatChips");
  const MSG_KEY = "funcloud_chat_v1";

  if (!messagesEl) return;

  // Store conversation history for AI context
  let conversationHistory = [];

  function loadMsgs() { try { return JSON.parse(localStorage.getItem(MSG_KEY)) || []; } catch { return []; } }
  function saveMsgs(list) { if (list.length > 50) list = list.slice(-50); localStorage.setItem(MSG_KEY, JSON.stringify(list)); }

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

  async function send(text = null) {
    const v = (text || inputEl.value || "").trim();
    if (!v) return;
    
    const list = loadMsgs();
    const name = (nameEl?.value?.trim()) || 'Friend';
    
    // Add user message
    list.push({ text: v, at: new Date().toISOString(), name, isBot: false });
    saveMsgs(list);
    inputEl.value = "";
    render();

    // Show typing indicator
    const typingLi = document.createElement("li");
    typingLi.id = "typing-indicator";
    typingLi.style.cssText = "padding:8px; margin-bottom:8px; border-radius:10px; background:#f0f0f0";
    typingLi.innerHTML = '<div style="font-size:11px; color:#666;">FunCloud 🤖 is typing...</div>';
    messagesEl.appendChild(typingLi);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      // Build history for AI context (last 10 messages)
      const recentMsgs = list.slice(-10);
      const history = recentMsgs.map(m => ({
        role: m.isBot ? "assistant" : "user",
        content: m.text
      }));

      // Call AI backend
      const response = await sendChatMessage(v, history);
      
      // Remove typing indicator
      const indicator = document.getElementById("typing-indicator");
      if (indicator) indicator.remove();

      // Add AI response
      list.push({ 
        text: response.reply, 
        at: new Date().toISOString(), 
        name: 'FunCloud', 
        isBot: true 
      });
      saveMsgs(list);
      render();

    } catch (err) {
      console.error("Chat error:", err);
      
      // Remove typing indicator
      const indicator = document.getElementById("typing-indicator");
      if (indicator) indicator.remove();

      // Show error message
      list.push({ 
        text: `Sorry, I'm having trouble connecting. ${err.message}`, 
        at: new Date().toISOString(), 
        name: 'FunCloud', 
        isBot: true 
      });
      saveMsgs(list);
      render();
    }
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
  if (clearBtn) clearBtn.addEventListener("click", () => { 
    localStorage.removeItem(MSG_KEY); 
    conversationHistory = [];
    render(); 
  });

  render();
})();

/* ---------- SEO Analyzer: URL Input + ANALYZE Button ---------- */
function wireSeoAnalyzer() {
  const analyzeBtn = document.getElementById("seoAnalyzeBtn");
  const urlInput = document.getElementById("seoUrlInput");
  if (!analyzeBtn || !urlInput) return;

  // Create results container if it doesn't exist
  let resultsContainer = document.getElementById("seoResults");
  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.id = "seoResults";
    resultsContainer.style.cssText = "margin-top: 20px; padding: 20px; background: white; border-radius: 12px; display: none;";
    const seoHero = document.querySelector(".seoHero");
    if (seoHero) {
      seoHero.parentNode.insertBefore(resultsContainer, seoHero.nextSibling);
    }
  }

  analyzeBtn.addEventListener("click", async () => {
    const url = urlInput.value.trim();
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "ANALYZING...";
    resultsContainer.style.display = "none";

    try {
      const result = await analyzeSEO(url);
      
      // Render results
      let html = `
        <h3 style="margin: 0 0 10px 0; color: #667eea;">SEO Analysis Results</h3>
        <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;"><strong>URL:</strong> ${result.url}</p>
        <div style="padding: 15px; background: #f0f4ff; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #667eea;">Summary:</strong>
          <p style="margin: 8px 0 0 0; font-size: 14px;">${result.summary}</p>
        </div>
        <h4 style="margin: 0 0 15px 0; color: #333;">Recommendations:</h4>
      `;

      result.recommendations.forEach((rec, idx) => {
        const priorityColor = rec.priority === "High" ? "#e74c3c" : rec.priority === "Medium" ? "#f39c12" : "#27ae60";
        html += `
          <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid ${priorityColor}; background: #f9f9f9; border-radius: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="color: #333;">${idx + 1}. ${rec.category}</strong>
              <span style="padding: 4px 12px; background: ${priorityColor}; color: white; border-radius: 12px; font-size: 11px; font-weight: bold;">${rec.priority}</span>
            </div>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">${rec.recommendation}</p>
            <p style="margin: 0; font-size: 13px; color: #888;"><em>Impact:</em> ${rec.impact}</p>
          </div>
        `;
      });

      resultsContainer.innerHTML = html;
      resultsContainer.style.display = "block";

    } catch (err) {
      console.error("SEO analysis failed:", err);
      resultsContainer.innerHTML = `
        <div style="padding: 20px; background: #fee; border-radius: 8px; color: #c33;">
          <strong>Analysis Failed</strong>
          <p style="margin: 8px 0 0 0; font-size: 14px;">${err.message}</p>
          <p style="margin: 8px 0 0 0; font-size: 13px;">Make sure the backend is running and OPENAI_API_KEY is set.</p>
        </div>
      `;
      resultsContainer.style.display = "block";
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "ANALYZE";
    }
  });
}
window.onload = () => {
  wireSeoAnalyzer();
};


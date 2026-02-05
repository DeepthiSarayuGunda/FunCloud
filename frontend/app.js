/* ---------- Navigation (Quotes / Kids / Party) ---------- */
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
})();

/* ---------- Quote App ---------- */
(function quoteAppInit() {
  const quoteEl = document.getElementById("quote");
  const statusEl = document.getElementById("status");
  const moodLabel = document.getElementById("moodLabel");

  const btnQuote = document.getElementById("btnQuote");
  const btnFav = document.getElementById("btnFav");
  const btnShow = document.getElementById("btnShow");

  const panel = document.getElementById("panel");
  const btnClose = document.getElementById("btnClose");
  const btnClear = document.getElementById("btnClear");
  const favList = document.getElementById("favList");
  const categorySel = document.getElementById("category");

  const LOCAL_QUOTES = [
    { text: "Small steps every day become big results.", category: "success", mood: "success" },
    { text: "Focus on what you can control.", category: "focus", mood: "focus" },
    { text: "You’ve got this. Keep going.", category: "confidence", mood: "confidence" },
    { text: "Breathe. Slow is smooth, smooth is fast.", category: "calm", mood: "calm" },
    { text: "Progress, not perfection.", category: "all", mood: "calm" }
  ];

  const FAV_KEY = "funcloud_favs_v1";

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
      li.textContent = "No favourites yet.";
      favList.appendChild(li);
      return;
    }
    favs.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      li.style.marginBottom = "8px";
      favList.appendChild(li);
    });
  }

  function setMood(mood) {
    if (!moodLabel) return;
    moodLabel.textContent = mood || "calm";
  }

  function pickLocalQuote() {
    const cat = categorySel ? categorySel.value : "all";
    const filtered = LOCAL_QUOTES.filter(q => cat === "all" ? true : q.category === cat);
    const pool = filtered.length ? filtered : LOCAL_QUOTES;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async function onNewQuote() {
    statusEl.textContent = "";
    const q = pickLocalQuote();
    quoteEl.textContent = q.text;
    setMood(q.mood);
  }

  function onSaveFav() {
    const text = (quoteEl.textContent || "").trim();
    if (!text || text.includes("Click")) {
      statusEl.textContent = "Get a quote first.";
      return;
    }
    const favs = getFavs();
    if (favs.includes(text)) {
      statusEl.textContent = "Already in favourites.";
      return;
    }
    favs.unshift(text);
    setFavs(favs);
    statusEl.textContent = "Saved to favourites ✅";
  }

  function openPanel() {
    panel.classList.remove("hidden");
    renderFavs();
  }

  function closePanel() {
    panel.classList.add("hidden");
  }

  function clearFavs() {
    setFavs([]);
    renderFavs();
  }

  if (btnQuote) btnQuote.addEventListener("click", onNewQuote);
  if (btnFav) btnFav.addEventListener("click", onSaveFav);
  if (btnShow) btnShow.addEventListener("click", openPanel);
  if (btnClose) btnClose.addEventListener("click", closePanel);
  if (btnClear) btnClear.addEventListener("click", clearFavs);

  setMood("calm");
})();

/* ---------- Kids Zone (tabs + modal with animation placeholder) ---------- */
(function kidsZoneInit() {
  const tabs = Array.from(document.querySelectorAll(".kzTab"));
  const panels = Array.from(document.querySelectorAll(".kzPanel"));
  const explorerTitle = document.getElementById("explorerTitle");
  const closeExplorerBtn = document.getElementById("closeExplorerBtn");
  const explorer = document.getElementById("kidsExplorer");
  const soundToggle = document.getElementById("kidsSoundToggle");

  const modal = document.getElementById("kzModal");
  const modalTitle = document.getElementById("kzModalTitle");
  const modalClose = document.getElementById("kzModalClose");
  const animPlaceholder = document.getElementById("kzAnimPlaceholder");

  const gifEl = document.getElementById("kzGif");
  const videoEl = document.getElementById("kzVideo");

  const audioEl = document.getElementById("kzAudio");
  const playSoundBtn = document.getElementById("kzPlaySound");
  const stopSoundBtn = document.getElementById("kzStopSound");
  const factsEl = document.getElementById("kzFacts");

  let soundOn = true;

  const TITLE_BY_ZONE = {
    animals: "Animal World Explorer",
    space: "Space Explorer",
    dinosaurs: "Dino World Explorer",
    ocean: "Ocean Explorer"
  };

  // Map each item to an animation file (gif for now). Later you can swap to video mp4.
  const ITEMS = {
    "animals:lion": {
      title: "Lion",
      animation: "assets/animations/lion.gif",
      sound: "assets/sounds/lion.mp3",
      facts: ["Lions live in groups called prides.", "A lion’s roar can be heard from far away."]
    },
    "animals:elephant": {
      title: "Elephant",
      animation: "assets/animations/elephant.gif",
      sound: "assets/sounds/elephant.mp3",
      facts: ["Elephants use their trunks to drink and grab things.", "They have great memory."]
    },
    "animals:dolphin": {
      title: "Dolphin",
      animation: "assets/animations/dolphin.gif",
      sound: "assets/sounds/dolphin.mp3",
      facts: ["Dolphins communicate with clicks and whistles.", "They love to play and jump."]
    },

    "space:rocket": {
      title: "Rocket",
      animation: "assets/animations/rocket.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Rockets need a lot of thrust to escape Earth’s gravity.", "They carry astronauts and satellites into space."]
    },
    "space:planet": {
      title: "Planet",
      animation: "assets/animations/planet.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Planets orbit around a star.", "Some planets have rings, like Saturn."]
    },
    "space:astronaut": {
      title: "Astronaut",
      animation: "assets/animations/astronaut.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Astronauts train for years.", "In space, you float because of microgravity."]
    },

    "dinosaurs:trex": {
      title: "T-Rex",
      animation: "assets/animations/trex.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["T-Rex had powerful legs.", "It lived millions of years ago."]
    },
    "dinosaurs:sauropod": {
      title: "Sauropod",
      animation: "assets/animations/sauropod.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Sauropods were long-neck dinosaurs.", "Some were as long as a bus!"]
    },
    "dinosaurs:egg": {
      title: "Dino Egg",
      animation: "assets/animations/egg.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Many dinosaurs hatched from eggs.", "Fossil eggs help us learn about dinosaur nests."]
    },

    "ocean:shark": {
      title: "Shark",
      animation: "assets/animations/shark.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Sharks have been around for a very long time.", "They have amazing senses in the ocean."]
    },
    "ocean:octopus": {
      title: "Octopus",
      animation: "assets/animations/octopus.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Octopuses can change color.", "They are very smart and can solve puzzles."]
    },
    "ocean:turtle": {
      title: "Turtle",
      animation: "assets/animations/turtle.gif",
      sound: "assets/sounds/click.mp3",
      facts: ["Sea turtles travel long distances.", "They use flippers to swim."]
    }
  };

  function setActiveZone(zone) {
    tabs.forEach(t => {
      const isOn = t.dataset.zone === zone;
      t.classList.toggle("isActive", isOn);
      t.setAttribute("aria-selected", isOn ? "true" : "false");
    });
    panels.forEach(p => p.classList.toggle("hidden", p.dataset.zone !== zone));
    if (explorerTitle) explorerTitle.textContent = TITLE_BY_ZONE[zone] || "Explorer";
  }

  function openModal() {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    stopSound();
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    gifEl.classList.add("hidden");
    videoEl.classList.add("hidden");
    animPlaceholder.textContent = "Loading…";
  }

  function setFacts(facts) {
    factsEl.innerHTML = "";
    facts.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      factsEl.appendChild(li);
    });
  }

  function stopSound() {
    audioEl.pause();
    audioEl.currentTime = 0;
  }

  function playSound() {
    if (!soundOn) return;
    audioEl.play().catch(() => {});
  }

  function loadAnimation(src) {
    // Use GIF by default. If you later use mp4, just change src to .mp4 and we’ll auto-switch.
    const isVideo = src.toLowerCase().endsWith(".mp4") || src.toLowerCase().endsWith(".webm");

    gifEl.classList.add("hidden");
    videoEl.classList.add("hidden");
    animPlaceholder.classList.remove("hidden");
    animPlaceholder.textContent = "Loading…";

    if (isVideo) {
      videoEl.src = src;
      videoEl.onloadeddata = () => {
        animPlaceholder.classList.add("hidden");
        videoEl.classList.remove("hidden");
      };
      videoEl.onerror = () => {
        animPlaceholder.textContent = "Add animation file in assets/animations to show here.";
      };
    } else {
      gifEl.src = src;
      gifEl.onload = () => {
        animPlaceholder.classList.add("hidden");
        gifEl.classList.remove("hidden");
      };
      gifEl.onerror = () => {
        animPlaceholder.textContent = "Add animation file in assets/animations to show here.";
      };
    }
  }

  function openItem(zone, item) {
    const key = `${zone}:${item}`;
    const data = ITEMS[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    setFacts(data.facts);

    audioEl.src = data.sound || "";
    audioEl.load();

    loadAnimation(data.animation);

    openModal();
    playSound();
  }

  // Events
  tabs.forEach(tab => tab.addEventListener("click", () => setActiveZone(tab.dataset.zone)));

  document.querySelectorAll(".kzItem").forEach(btn => {
    btn.addEventListener("click", () => openItem(btn.dataset.zone, btn.dataset.item));
  });

  if (closeExplorerBtn) {
    closeExplorerBtn.addEventListener("click", () => explorer.classList.toggle("hidden"));
  }

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      soundOn = !soundOn;
      soundToggle.textContent = soundOn ? "Sound: On" : "Sound: Off";
      soundToggle.setAttribute("aria-pressed", soundOn ? "true" : "false");
      if (!soundOn) stopSound();
    });
  }

  if (playSoundBtn) playSoundBtn.addEventListener("click", playSound);
  if (stopSoundBtn) stopSoundBtn.addEventListener("click", stopSound);
  if (modalClose) modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // Default tab
  setActiveZone("animals");
})();

/* ---------- Party Planner (demo booking) ---------- */
(function partyPlannerInit() {
  const choices = Array.from(document.querySelectorAll(".choice"));
  const guestsEl = document.getElementById("guests");
  const dateEl = document.getElementById("date");
  const cityEl = document.getElementById("city");

  const addonCake = document.getElementById("addon-cake");
  const addonBalloons = document.getElementById("addon-balloons");
  const addonGames = document.getElementById("addon-games");
  const addonPhoto = document.getElementById("addon-photo");

  const summaryEl = document.getElementById("partySummary");
  const statusEl = document.getElementById("partyStatus");

  const saveBtn = document.getElementById("saveBookingBtn");
  const viewBtn = document.getElementById("viewBookingBtn");
  const clearBtn = document.getElementById("clearBookingBtn");

  const KEY = "funcloud_booking_v1";

  const state = {
    theme: "Animals",
    decor: "Basic Decor"
  };

  function setSelected(choiceType, value) {
    state[choiceType] = value;
    choices.forEach(btn => {
      if (btn.dataset.choice !== choiceType) return;
      btn.classList.toggle("isSelected", btn.dataset.value === value);
    });
    renderSummary();
  }

  function addonsList() {
    const list = [];
    if (addonCake.checked) list.push("Cake Table");
    if (addonBalloons.checked) list.push("Balloon Arch");
    if (addonGames.checked) list.push("Party Games Host");
    if (addonPhoto.checked) list.push("Photo Booth");
    return list;
  }

  function renderSummary() {
    const guests = guestsEl.value || "20";
    const date = dateEl.value || "Not set";
    const city = (cityEl.value || "Not set").trim();
    const addons = addonsList();

    summaryEl.innerHTML =
      `Theme: ${state.theme}<br/>` +
      `Decor: ${state.decor}<br/>` +
      `Guests: ${guests}<br/>` +
      `Date: ${date}<br/>` +
      `City: ${city}<br/>` +
      `Add-ons: ${addons.length ? addons.join(", ") : "None"}`;
  }

  function saveBooking() {
    const booking = {
      theme: state.theme,
      decor: state.decor,
      guests: Number(guestsEl.value || 20),
      date: dateEl.value || "",
      city: (cityEl.value || "").trim(),
      addons: addonsList(),
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(KEY, JSON.stringify(booking));
    statusEl.textContent = "Booking saved (demo).";
  }

  function viewBooking() {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      statusEl.textContent = "No saved booking yet.";
      return;
    }
    const b = JSON.parse(raw);
    statusEl.textContent =
      `Saved: Theme ${b.theme}, ${b.decor}, ${b.guests} guests, ${b.city || "City not set"}, ${b.date || "Date not set"}.`;
  }

  function clearBooking() {
    localStorage.removeItem(KEY);
    statusEl.textContent = "Saved booking cleared.";
  }

  choices.forEach(btn => {
    btn.addEventListener("click", () => setSelected(btn.dataset.choice, btn.dataset.value));
  });

  [guestsEl, dateEl, cityEl, addonCake, addonBalloons, addonGames, addonPhoto].forEach(el => {
    el.addEventListener("change", renderSummary);
    el.addEventListener("input", renderSummary);
  });

  saveBtn.addEventListener("click", saveBooking);
  viewBtn.addEventListener("click", viewBooking);
  clearBtn.addEventListener("click", clearBooking);

  renderSummary();
})();

/* ---------- Chat (local demo) ---------- */
(function chatInit() {
  const MSG_KEY = "funcloud_chat_v1";
  const messagesEl = document.getElementById("chatMessages");
  const inputEl = document.getElementById("chatInput");
  const nameEl = document.getElementById("chatName");
  const sendBtn = document.getElementById("sendChatBtn");
  const clearBtn = document.getElementById("clearChatBtn");

  function loadMsgs() {
    try { return JSON.parse(localStorage.getItem(MSG_KEY)) || []; }
    catch { return []; }
  }

  function saveMsgs(list) {
    localStorage.setItem(MSG_KEY, JSON.stringify(list));
  }

  function render() {
    const msgs = loadMsgs();
    messagesEl.innerHTML = "";
    if (!msgs.length) {
      const li = document.createElement("li");
      li.className = "note";
      li.textContent = "No messages yet.";
      messagesEl.appendChild(li);
      return;
    }
    msgs.forEach(m => {
      const li = document.createElement("li");
      li.style.padding = "8px";
      li.style.marginBottom = "8px";
      li.style.borderRadius = "10px";
      li.style.background = "#fff";
      const header = document.createElement("div");
      header.style.fontSize = "12px";
      header.style.color = "#444";
      header.style.marginBottom = "6px";
      header.textContent = `${m.name || 'Guest'} • ${new Date(m.at).toLocaleTimeString()}`;
      const body = document.createElement("div");
      body.textContent = m.text;
      li.appendChild(header);
      li.appendChild(body);
      messagesEl.appendChild(li);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function send() {
    const v = (inputEl.value || "").trim();
    if (!v) return;
    const list = loadMsgs();
    const name = (nameEl && nameEl.value && nameEl.value.trim()) || 'Guest';
    list.push({ text: v, at: new Date().toISOString(), name });
    saveMsgs(list);
    inputEl.value = "";
    render();
  }

  function clearMsgs() {
    localStorage.removeItem(MSG_KEY);
    render();
  }

  if (sendBtn) sendBtn.addEventListener("click", send);
  if (inputEl) inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  if (clearBtn) clearBtn.addEventListener("click", clearMsgs);

  render();
})();

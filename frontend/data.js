// Premium FunCloud Content Pack - Global Variables

const QUOTES = {
  motivation: [
    { text: "Every day is a new chance to be awesome!", author: "You" },
    { text: "Believe in yourself, because I believe in you!", author: "Friend" },
    { text: "The only limits are the ones you create.", author: "Wisdom" },
    { text: "Today is the perfect day to start something new.", author: "Hope" },
    { text: "You're braver than you believe and stronger than you seem.", author: "Pooh" },
    { text: "Keep going, you're closer than you think.", author: "Coach" },
    { text: "Your potential is endless.", author: "Dreams" },
    { text: "Every expert was once a beginner.", author: "Learning" },
  ],
  study: [
    { text: "The brain is a muscle, exercise it daily.", author: "Smart" },
    { text: "Questions are the seeds of knowledge.", author: "Curious" },
    { text: "Learning today, leading tomorrow.", author: "Future" },
    { text: "Mistakes are just lessons in disguise.", author: "Teacher" },
    { text: "Reading opens a thousand worlds.", author: "Explorer" },
    { text: "Understanding is better than memorizing.", author: "Wise" },
  ],
  kindness: [
    { text: "Kindness costs nothing, but means everything.", author: "Heart" },
    { text: "Be someone's sunshine on a cloudy day.", author: "Bright" },
    { text: "Small acts of kindness create big changes.", author: "Good" },
    { text: "Helping others is helping yourself.", author: "Together" },
    { text: "Smile, it's contagious!", author: "Joy" },
  ],
  funny: [
    { text: "I'm not lazy, I'm just highly efficient at resting.", author: "Sloth" },
    { text: "Why did the cookie go to school? To get smarter!", author: "Joke" },
    { text: "Socks are like clouds—fun to jump in, sad to lose.", author: "Cloud" },
    { text: "I would avoid staring at your food. It makes it nervous.", author: "Food" },
  ],
  confidence: [
    { text: "You have unique gifts to share with the world.", author: "Special" },
    { text: "Confidence is not about perfection, it's about effort.", author: "Try" },
    { text: "Step out of your comfort zone—that's where magic happens!", author: "Growth" },
    { text: "Your voice matters.", author: "Speak" },
  ],
  morning: [
    { text: "Good morning! Today is yours to conquer.", author: "Day" },
    { text: "Wake up and be amazing!", author: "Rise" },
    { text: "This morning is your fresh start.", author: "Begin" },
    { text: "You've got this!", author: "Power" },
  ],
};

const STORIES = [
  {
    id: "luna-moon",
    emoji: "🌙",
    title: "Luna's Moon Adventure",
    description: "A magical journey to the moon.",
    pages: [
      { text: "Luna the bunny looked up at the bright moon. 'I wonder what it's like up there,' she whispered.", imageSlots: { background: "🌌", character: "🐰", foreground: "⭐" }, aiPrompt: "A curious pink bunny gazing at the night sky from her bedroom window, moonlight streaming in." },
      { text: "That night, a magical silver rope appeared! She climbed higher and higher.", imageSlots: { background: "🌌", character: "🐰", foreground: "🪜" }, aiPrompt: "A bunny climbing a shimmering magical rope through a starry sky, leaving sparkles behind." },
      { text: "On the moon, she met Moonbeam the fairy. 'Welcome!' said Moonbeam with a smile.", imageSlots: { background: "🌙", character: "🧚‍♀️", foreground: "✨" }, aiPrompt: "A cheerful moon fairy greeting a bunny on a crater-covered moon landscape with floating crystals.", use3D: true },
      { text: "They collected stardust together and made wishes. Luna had never been happier.", imageSlots: { background: "🌌", character: "🧚‍♀️", foreground: "💫" }, aiPrompt: "Luna and Moonbeam dancing through clouds of shimmering stardust, with magical particles swirling around them." },
      { text: "Before dawn, Luna slid back down the rope. But she kept the stardust in her pocket.", imageSlots: { background: "🌅", character: "🐰", foreground: "🪜" }, aiPrompt: "A bunny sliding down a rainbow rope toward Earth, clutching a glowing pouch of stardust as dawn breaks." },
      { text: "Luna realized that magic was inside her heart all along.", imageSlots: { background: "🏡", character: "🐰", foreground: "💜" }, aiPrompt: "Luna sitting in her cozy bedroom, a warm glow emanating from her heart, surrounded by peaceful starlight." },
    ],
  },
  {
    id: "ziggy-zoo",
    emoji: "🦁",
    title: "Ziggy's Zoo Friends",
    description: "Making friends at the zoo.",
    pages: [
      { text: "Ziggy the zebra was new to the zoo. 'Will they like me?' she wondered nervously.", imageSlots: { background: "🦁🌳", character: "🦓", foreground: "😟" }, aiPrompt: "A striped zebra standing alone in a sunny savanna landscape, looking uncertain and hopeful." },
      { text: "A friendly elephant trumpeted hello! 'Let's be friends,' he said happily.", imageSlots: { background: "🦁🌳", character: "🐘", foreground: "👋" }, aiPrompt: "A large gray elephant waving its trunk warmly towards a zebra, with a big friendly smile." },
      { text: "Soon, Ziggy met a playful monkey and a wise old tortoise.", imageSlots: { background: "🦁🌳", character: "🐵🐢", foreground: "🎉" }, aiPrompt: "A group of animals—zebra, elephant, monkey, and tortoise—playing together under a tree.", use3D: true },
      { text: "Together, they shared snacks and played games under the warm sun.", imageSlots: { background: "🌞🌳", character: "👥", foreground: "🍎" }, aiPrompt: "All the zoo friends sitting in a circle sharing fruit and laughing under a bright sunny sky." },
      { text: "By sunset, Ziggy had made five new best friends.", imageSlots: { background: "🌅🌳", character: "👥", foreground: "💕" }, aiPrompt: "A group of happy animal friends sitting together watching a beautiful orange and pink sunset." },
      { text: "She learned that being different made her special, not strange.", imageSlots: { background: "🦁🌳", character: "🦓", foreground: "⭐" }, aiPrompt: "A confident zebra surrounded by different animal friends, with hearts and stars celebrating their diversity." },
    ],
  },
  {
    id: "splash-ocean",
    emoji: "🌊",
    title: "Ocean's Secret Treasure",
    description: "A treasure hunt in the coral kingdom.",
    pages: [
      { text: "Splash the dolphin discovered an ancient map in a bottle.", imageSlots: { background: "🌊", character: "🐬", foreground: "🗺️" }, aiPrompt: "A playful dolphin holding a rolled-up treasure map, with bubbles and sunlight filtering down from above." },
      { text: "The map led to a hidden coral kingdom filled with rainbow colors.", imageSlots: { background: "🌊🌈", character: "🐬", foreground: "🏝️" }, aiPrompt: "A vibrant underwater coral reef with purple, pink, yellow, and green corals, and tropical fish swimming around." },
      { text: "Inside lived a friendly sea turtle who had protected the kingdom for a hundred years.", imageSlots: { background: "🌊🏰", character: "🐢", foreground: "👑" }, aiPrompt: "An ancient wise sea turtle with a crown, surrounded by glowing pearls and ancient coral structures." },
      { text: "The treasure wasn't gold or jewels—it was the joy of friendship itself.", imageSlots: { background: "🌊", character: "👥", foreground: "💎" }, aiPrompt: "A group of sea creatures—dolphin, turtle, fish, and starfish—embracing each other with hearts of light around them." },
      { text: "Splash and all her ocean friends celebrated together.", imageSlots: { background: "🌊🎉", character: "👥", foreground: "🎊" }, aiPrompt: "An underwater celebration party with colorful bubbles, dancing fish, and all the ocean friends rejoicing." },
      { text: "She learned that real treasures are the memories we make.", imageSlots: { background: "🌊", character: "🐬", foreground: "💜" }, aiPrompt: "A dreamy underwater scene with a glowing dolphin holding hearts, surrounded by memories turning to sparkles." },
    ],
  },
  {
    id: "sky-clouds",
    emoji: "☁️",
    title: "Sky's Fluffy Cloud Ride",
    description: "A journey through the sky.",
    pages: [
      { text: "Sky the bird found a special cloud soft as a pillow.", imageSlots: { background: "🌤️", character: "🦅", foreground: "☁️" }, aiPrompt: "A curious bird landing on the softest, fluffiest white cloud in a bright sunny sky." },
      { text: "She rode it across the sky, visiting the sun, the moon, and the stars.", imageSlots: { background: "🌌", character: "🦅", foreground: "⭐" }, aiPrompt: "A swift bird soaring on a cloud past glowing celestial bodies—sun, moon, and twinkling stars." },
      { text: "Each place she visited taught her something new about beauty.", imageSlots: { background: "🎨🌈", character: "🦅", foreground: "🌸" }, aiPrompt: "A bird flying through a landscape filled with beautiful colors, flowers, and natural wonders." },
      { text: "A rainbow appeared and invited her to slide down its colors.", imageSlots: { background: "🌈☁️", character: "🦅", foreground: "💫" }, aiPrompt: "A bird sliding down a magnificent rainbow arc, with colorful light trails and joyful expressions." },
      { text: "Sky discovered that she could create beauty wherever she went.", imageSlots: { background: "🌅", character: "🦅", foreground: "✨" }, aiPrompt: "A confident bird flying through sunset skies, leaving trails of beautiful light and color behind." },
      { text: "She returned home knowing the world was full of wonder.", imageSlots: { background: "🏡☁️", character: "🦅", foreground: "💜" }, aiPrompt: "A serene bird returning to its cozy nest with a glowing heart, surrounded by peaceful clouds." },
    ],
  },
  {
    id: "berry-garden",
    emoji: "🌺",
    title: "Berry's Garden of Wonder",
    description: "A magical garden adventure.",
    pages: [
      { text: "Berry the butterfly landed on a magical garden where flowers talked.", imageSlots: { background: "🌳🌸", character: "🦋", foreground: "🌺" }, aiPrompt: "A delicate butterfly with shimmer wings landing on colorful talking flowers in an enchanted garden." },
      { text: "Each flower had a different talent—one sang, one danced, one told jokes.", imageSlots: { background: "🌳", character: "🌸", foreground: "🎵" }, aiPrompt: "Diverse magical flowers with unique personalities—some singing, some dancing, all magical and friendly." },
      { text: "Berry realized she could help them shine by believing in each other.", imageSlots: { background: "🌳", character: "🦋", foreground: "⭐" }, aiPrompt: "A butterfly surrounded by glowing flowers radiating confidence and magic with interconnected light between them." },
      { text: "The garden grew more beautiful because of their friendship.", imageSlots: { background: "🌳🌈", character: "👥", foreground: "🌺" }, aiPrompt: "A blossoming garden filled with vibrant, happy flowers and a butterfly, their friendship making everything glow." },
      { text: "Berry learned that kindness makes the world bloom.", imageSlots: { background: "🌳", character: "🦋", foreground: "💕" }, aiPrompt: "A radiant butterfly surrounded by blooming flowers, representing how kindness spreads and creates beauty." },
      { text: "From that day on, she spread joy to every garden she visited.", imageSlots: { background: "🌍", character: "🦋", foreground: "🌈" }, aiPrompt: "A butterfly flying through multiple gardens worldwide, each one flourishing with beauty and joy because of her visits." },
    ],
  },
  {
    id: "rocket-space",
    emoji: "🚀",
    title: "Rocket's Space Quest",
    description: "An intergalactic adventure.",
    pages: [
      { text: "Rocket the robot dreamed of exploring distant planets.", imageSlots: { background: "🌌", character: "🤖", foreground: "🚀" }, aiPrompt: "A colorful robot with bright lights looking up at space with wonder, dreaming of adventure among the stars." },
      { text: "He built a spaceship and zoomed past the moon, past Mars, past Saturn.", imageSlots: { background: "🌌", character: "🚀", foreground: "🪐" }, aiPrompt: "A speeding spaceship with a robot inside, flying past luminous planets and moons in a vast star field." },
      { text: "On a distant planet, he met friendly aliens who loved dancing and singing.", imageSlots: { background: "🪐🌌", character: "👽", foreground: "🎵" }, aiPrompt: "Colorful, friendly extraterrestrials with unique shapes and features, dancing and celebrating on an alien world.", use3D: true },
      { text: "Rocket realized that friendship knows no boundaries—not even space!", imageSlots: { background: "🌌", character: "🤖👽", foreground: "💫" }, aiPrompt: "A robot and aliens holding hands/appendages, connected by glowing lines of friendship, surrounded by cosmic light." },
      { text: "He invited them to visit Earth, and they became the best of friends.", imageSlots: { background: "🌍🌌", character: "👥", foreground: "🎉" }, aiPrompt: "A joyful group of robot and aliens together, with Earth and space in the background, celebrating their bond." },
      { text: "Rocket learned that adventure is better when shared with friends.", imageSlots: { background: "🌌", character: "🤖", foreground: "💜" }, aiPrompt: "A peaceful robot gazing at stars, with glowing hearts representing the friendships made across the galaxy." },
    ],
  },
];

const VIDEOS = [
  { id: 1, emoji: "🔤", title: "ABC Song", url: "/assets/videos/abc.mp4" },
  { id: 2, emoji: "🔢", title: "Numbers 1-10", url: "/assets/videos/numbers.mp4" },
  { id: 3, emoji: "🪐", title: "Solar System Explained", url: "/assets/videos/space.mp4" },
  { id: 4, emoji: "🦁", title: "Amazing Animals", url: "/assets/videos/animals.mp4" },
  { id: 5, emoji: "🟢", title: "Shapes & Colors", url: "/assets/videos/shapes.mp4" },
  { id: 6, emoji: "🎵", title: "Music Basics", url: "/assets/videos/music.mp4" },
];

const THREE_TOPICS = [
  {
    emoji: "🦁",
    title: "Animals",
    facts: [
      "Some animals sleep standing up, like horses and giraffes!",
      "Dolphins have names for each other and use them to call out.",
      "A penguin's parents recognize their baby by its unique call.",
      "Elephants are so smart they can recognize themselves in mirrors!",
      "Octopuses have three hearts and blue blood.",
      "Some butterflies taste with their feet to find out whether the leaf they sit on is good to eat.",
    ],
  },
  {
    emoji: "🪐",
    title: "Solar System",
    facts: [
      "The Sun is so big that 1.3 million Earths could fit inside it!",
      "Jupiter is so big that all other planets could fit inside it.",
      "A year on Venus is shorter than a day on Venus!",
      "Saturn's rings are made of thousands of chunks of ice and rock.",
      "Mars is called the Red Planet because rust on its surface makes it red.",
      "Neptune has the fastest winds in the entire solar system!",
    ],
  },
  {
    emoji: "🦕",
    title: "Dinosaurs",
    facts: [
      "The T-Rex had arms only 3 feet long but teeth as big as bananas!",
      "A Brachiosaurus was so tall it could look into a 5-story building.",
      "Triceratops had horns, but its closest living relatives today are chickens!",
      "Some dinosaurs like the Velociraptor hunted in packs like wolves.",
      "The Stegosaurus had a brain the size of a walnut.",
      "Dinosaurs ruled Earth for over 165 million years!",
    ],
  },
];

const PARTY_PLANNER = {
  types: ["Birthday", "Picnic", "Carnival", "Sleepover"],
  themes: {
    Birthday: ["Animals", "Space", "Dinosaurs", "Princess", "Superheroes"],
    Picnic: ["Sunshine", "Forest", "Beach", "Camping"],
    Carnival: ["Circus", "Retro Games", "Mini Rides", "Fun Fair"],
    Sleepover: ["Movie Night", "Pajama Party", "Game Night", "Camping"],
  },
  checklists: {
    birthday: [
      "✓ Send invitations 2 weeks before",
      "✓ Order cake 1 week before",
      "✓ Decorate venue day-of",
      "✓ Set up games stations",
      "✓ Prepare party favors",
      "✓ Take photos throughout the party",
      "✓ Send thank-you notes after",
    ],
  },
  timelines: {
    afternoon: [
      "12:00 - Guests arrive & greet",
      "12:15 - Icebreaker games",
      "12:45 - Main activity or crafts",
      "1:15 - Food & refreshments",
      "1:45 - Cake & singing",
      "2:00 - Dance or more games",
      "2:30 - Party favors & goodbyes",
    ],
  },
  shoppingLists: {
    standard: [
      "Cake or cupcakes",
      "Drinks (juice, water, soda)",
      "Snacks (chips, popcorn, candy)",
      "Party plates, cups, napkins",
      "Decorations (balloons, banners, streamers)",
      "Party favors (toys, bookmarks, stickers)",
      "Games or activity supplies",
    ],
  },
};

const CHAT_RESPONSES = {
  story: [
    "🎭 Oh, storytelling is magical! Did you know that stories help our brains grow?",
    "📖 I love stories! They take us to amazing worlds. What's your favorite genre?",
    "✨ Stories are windows to other worlds. What story has inspired you the most?",
    "🌟 Storytelling has been around for thousands of years. Every culture loves a good tale!",
    "🎪 Tales of adventure, mystery, and friendship are the best kind!",
  ],
  study: [
    "📚 Learning is awesome! Our brains grow every time we try something new.",
    "🧠 Did you know? Asking questions is one of the best ways to learn!",
    "💡 Study tip: Take breaks! Your brain learns better when you rest between sessions.",
    "🎯 Every mistake is a learning opportunity. Keep going!",
    "🏆 You're developing superpowers through learning! Keep studying!",
  ],
  party: [
    "🎉 Parties are so much fun! They're about celebrating with friends you love.",
    "🎊 Remember: The best parties are the ones filled with laughter and friendship!",
    "🎈 Party planning is creative! Think about what makes YOUR celebration special.",
    "🎁 Every celebration is a chance to make memories that last forever!",
    "🎪 Parties bring people together. What's your favorite celebration tradition?",
  ],
  quote: [
    "💬 Quotes inspire us to be our best selves. You've got amazing potential!",
    "✨ Wise words from wise people guide us toward our dreams.",
    "🌟 Remember: You're braver than you believe and stronger than you seem!",
    "💪 Let quotes motivate you to do something great today!",
    "🚀 Inspiration comes from everywhere. What motivates you?",
  ],
};

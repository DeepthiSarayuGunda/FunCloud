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
    emoji: "🌙",
    title: "Luna's Moon Adventure",
    pages: [
      { text: "Luna the bunny looked up at the bright moon in the sky. 'I wonder what it's like up there,' she whispered.", image: "🌙✨" },
      { text: "That night, a magical silver rope appeared in her bedroom! She climbed it higher and higher.", image: "🪜✨" },
      { text: "On the moon, she met Moonbeam the fairy. 'Welcome!' said Moonbeam with a smile.", image: "🧚‍♀️💫" },
      { text: "They collected stardust together and made wishes. Luna had never been happier.", image: "⭐✨" },
      { text: "Before dawn, Luna slid back down the rope. But she kept the stardust in her pocket.", image: "🐰✨" },
      { text: "Luna realized that magic was inside her heart all along.", image: "💜🌙" },
    ],
  },
  {
    emoji: "🦁",
    title: "Ziggy's Zoo Friends",
    pages: [
      { text: "Ziggy the zebra was new to the zoo. 'Will they like me?' she wondered nervously.", image: "🦓😟" },
      { text: "A friendly elephant trumpeted hello! 'Let's be friends,' he said happily.", image: "🐘👋" },
      { text: "Soon, Ziggy met a playful monkey and a wise old tortoise.", image: "🐵🐢" },
      { text: "Together, they shared snacks and played games under the sun.", image: "🌞🎉" },
      { text: "By sunset, Ziggy had made five new best friends.", image: "👥💕" },
      { text: "She learned that being different made her special, not strange.", image: "🦓✨" },
    ],
  },
  {
    emoji: "🌊",
    title: "Ocean's Secret Treasure",
    pages: [
      { text: "Splash the dolphin discovered an ancient map in a bottle.", image: "🐬🗺️" },
      { text: "The map led to a hidden coral kingdom filled with rainbow colors.", image: "🌈🏝️" },
      { text: "Inside lived a friendly sea turtle who had protected the kingdom for a hundred years.", image: "🐢👑" },
      { text: "The treasure wasn't gold or jewels—it was the joy of friendship itself.", image: "💎💕" },
      { text: "Splash and all her ocean friends celebrated together.", image: "🐠🐟🦑" },
      { text: "She learned that real treasures are the memories we make.", image: "🌊💜" },
    ],
  },
  {
    emoji: "☁️",
    title: "Sky's Fluffy Cloud Ride",
    pages: [
      { text: "Sky the bird found a special cloud soft as a pillow.", image: "☁️🪶" },
      { text: "She rode it across the sky, visiting the sun, the moon, and the stars.", image: "⭐🌞🌙" },
      { text: "Each place she visited taught her something new about beauty.", image: "🎨✨" },
      { text: "A rainbow appeared and invited her to slide down its colors.", image: "🌈" },
      { text: "Sky discovered that she could create beauty wherever she went.", image: "🦅💫" },
      { text: "She returned home knowing the world was full of wonder.", image: "🏠💕" },
    ],
  },
  {
    emoji: "🌺",
    title: "Berry's Garden of Wonder",
    pages: [
      { text: "Berry the butterfly landed on a magical garden where flowers talked.", image: "🦋🌻" },
      { text: "Each flower had a different talent—one sang, one danced, one told jokes.", image: "🌸🎵" },
      { text: "Berry realized she could help them shine by believing in each other.", image: "🌺💫" },
      { text: "The garden grew more beautiful because of their friendship.", image: "🌻🌷🌹" },
      { text: "Berry learned that kindness makes the world bloom.", image: "🦋✨" },
      { text: "From that day on, she spread joy to every garden she visited.", image: "🌈🦋" },
    ],
  },
  {
    emoji: "🚀",
    title: "Rocket's Space Quest",
    pages: [
      { text: "Rocket the robot dreamed of exploring distant planets.", image: "🤖🚀" },
      { text: "He built a spaceship and zoomed past the moon, past Mars, past Saturn.", image: "🪐⭐" },
      { text: "On a distant planet, he met friendly aliens who loved dancing and singing.", image: "👽🎵" },
      { text: "Rocket realized that friendship knows no boundaries—not even space!", image: "👥💕" },
      { text: "He invited them to visit Earth, and they became the best of friends.", image: "🌍🚀" },
      { text: "Rocket learned that adventure is better when shared with friends.", image: "🤖👽✨" },
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

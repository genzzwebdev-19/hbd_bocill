/**
 * THE GRAND BIRTHDAY EXPERIENCE — CONFIGURATION
 * Edit this file to easily personalize all content across the entire website.
 */

window.BIRTHDAY_CONFIG = {
  // Personal Identifiers
  recipient: {
    nickname: "Bocil",
    fullName: "Bocil Tersayang", // shown in hero or title
    birthDate: "Today & Always", // e.g., "22 November"
    zodiac: "✨ Starborn",
  },
  sender: {
    nickname: "Abg",
  },

  // Main Concept & Taglines
  concept: {
    title: "THE WORLD IS A LITTLE MORE BEAUTIFUL WITH YOU",
    subtitle: "A little universe, created just for you.",
  },

  // Audio Configuration
  audio: {
    // Relative path to your custom MP3 file (e.g. assets/audio/birthday.mp3)
    src: "assets/audio/birthday.mp3",
    // If the MP3 file is not found or fails to load,
    // the built-in gentle Web Audio ambient music synthesizer automatically plays!
    enableSynthesizerFallback: true,
    volume: 0.65,
  },

  // Scene 01: The Invitation
  scene1: {
    line1: "Somewhere in this universe,",
    line1Sub: "there is someone worth celebrating.",
    line2: "And today, that someone is you.",
    cta: "Open your little surprise",
  },

  // Scene 02: A Little Universe
  scene2: {
    eyebrow: "A Little Universe Just For You",
    greeting: "Happy Birthday",
    celebrateText: "Today, the universe celebrates you.",
    scrollPrompt: "Scroll down or press continue",
    cta: "Step into the warmth",
  },

  // Scene 03: The Little Things
  scene3: {
    title: "Things I Hope for You",
    subtitle: "Doa-doa kecil yang diam-diam selalu abg bisikkan untukmu",
    hopes: [
      {
        number: "01",
        title: "Alasan untuk Tersenyum",
        text: "Semoga hari-harimu selalu punya alasan untuk tersenyum.",
        icon: "smile",
      },
      {
        number: "02",
        title: "Kekuatan Melewati Rasa Takut",
        text: "Semoga hal-hal yang kamu takutkan perlahan menjadi lebih mudah.",
        icon: "feather",
      },
      {
        number: "03",
        title: "Tempat Pulang & Bercerita",
        text: "Semoga kamu selalu menemukan tempat untuk pulang, tempat untuk bercerita, dan seseorang yang mau mendengarkan.",
        icon: "home",
      },
      {
        number: "04",
        title: "Kasih Sayang Pada Diri Sendiri",
        text: "Semoga kamu tidak terlalu keras pada dirimu sendiri.",
        icon: "heart",
      },
      {
        number: "05",
        title: "Doa yang Terkabul",
        text: "Semoga setiap doa yang kamu simpan diam-diam menemukan jalannya untuk menjadi nyata.",
        icon: "sparkle",
      },
      {
        number: "06",
        title: "Kebaikan Semesta",
        text: "Dan semoga dunia selalu punya cara untuk memperlakukanmu dengan baik.",
        icon: "sun",
      },
    ],
    cta: "Open a special letter for you",
  },

  // Scene 04: A Letter From Abg
  scene4: {
    eyebrow: "Personal Note",
    title: "Something I wanted to tell you.",
    ctaOpen: "Read my little letter",
    skipTyping: "Baca Langsung",
    letterGreeting: "Selamat ulang tahun ya, bocil.",
    paragraphs: [
      "Hari ini adalah hari kamu, jadi abg berharap kamu bisa menikmati setiap hal kecil yang membuat kamu bahagia.",
      "Semoga panjang umur, sehat selalu, dilancarkan rezekinya, dimudahkan segala urusannya, dan semoga semua yang sedang kamu usahakan bisa menemukan hasil terbaiknya.",
      "Abg berharap di umur yang baru ini kamu bisa lebih banyak tersenyum, lebih sedikit menyimpan sedih, dan nggak terlalu keras sama diri sendiri.",
      "Kalau suatu hari kamu capek, istirahatlah.\nKalau lagi sedih, nggak apa-apa untuk nggak selalu terlihat kuat.\nKalau banyak hal terasa nggak berjalan sesuai keinginan, semoga kamu tetap percaya bahwa akan ada hari-hari yang jauh lebih baik.",
      "Abg mungkin nggak selalu pandai mengungkapkan apa yang abg rasakan, dan mungkin nggak semua hal bisa disampaikan lewat kata-kata.",
      "Tapi untuk hari ini, abg cuma ingin kamu tahu kalau kehadiran kamu adalah sesuatu yang menyenangkan.",
      "Terima kasih sudah menjadi kamu, dengan segala tingkah, cerita, keras kepala, manjanya, dan hal-hal kecil yang mungkin nggak kamu sadari, tapi bisa membuat hari seseorang menjadi lebih berwarna.",
      "Jangan lupa jaga diri baik-baik, ya, bocil.\nJangan suka telat makan.\nJangan terlalu banyak overthinking.\nJangan terlalu sering begadang.\nJangan lupa istirahat.\nDan jangan kehilangan senyum kamu.",
      "Semoga tahun ini membawa banyak kebahagiaan, pengalaman baru, orang-orang baik, dan hal-hal yang selama ini kamu tunggu.",
      "Happy birthday, bocil. Semoga semesta selalu baik sama kamu.",
    ],
    signature: "— Abg",
    ctaNext: "Before Your Wishes Come True",
  },

  // Scene 05: Wishes For Your New Age
  scene5: {
    eyebrow: "Five Sacred Stars",
    title: "Before Your Wishes Come True",
    subtitle: "Sentuh setiap bintang harapan untuk membuka pesannya",
    wishes: [
      {
        id: "health",
        icon: "✦",
        title: "Good Health",
        short: "Kesehatan & Ketenangan",
        desc: "Semoga selalu diberikan kesehatan, tubuh yang kuat, dan hati yang tenang di setiap langkahmu.",
        detail: "Kesehatanmu adalah hal yang paling berharga. Jangan lupa istirahat yang cukup dan sayangi tubuhmu.",
      },
      {
        id: "days",
        icon: "✧",
        title: "Beautiful Days",
        short: "Hari-Hari Penuh Warna",
        desc: "Semoga lebih banyak hari indah datang menghampiri kamu.",
        detail: "Bahkan di hari yang mendung, semoga selalu ada pelangi kecil yang membuat harimu bersinar.",
      },
      {
        id: "dreams",
        icon: "⋆",
        title: "Your Dreams",
        short: "Impian & Tujuan Hidup",
        desc: "Semoga satu per satu impian kamu menemukan jalannya.",
        detail: "Percaya pada setiap proses dan langkah kecilmu. Abg percaya kamu bisa mencapainya.",
      },
      {
        id: "peace",
        icon: "✺",
        title: "Peace",
        short: "Kedamaian Jiwa",
        desc: "Semoga kamu selalu menemukan ketenangan bahkan di tengah dunia yang ramai.",
        detail: "Ketika dunia terasa bising dan melelahkan, semoga hatimu tetap memiliki ruang yang tenang dan damai.",
      },
      {
        id: "happiness",
        icon: "✹",
        title: "Little Happiness",
        short: "Bahagia dari Hal Sederhana",
        desc: "Semoga hal-hal kecil selalu cukup untuk membuat kamu bahagia.",
        detail: "Secangkir minuman hangat, semilir angin sore, atau canda tawa sederhana—semoga selalu membahagiakanmu.",
      },
    ],
    ctaNext: "Make a wish to the sky",
  },

  // Scene 06: A Sky Full of Wishes
  scene6: {
    eyebrow: "The Wishing Star",
    title: "Close your eyes & make a wish",
    subtitle: "Langit malam ini siap mendengarkan apa pun yang kamu bisikkan dalam hati",
    cta: "Make a wish",
    wishingText: "Tutup matamu dan ucapkan permohonanmu...",
    afterWish: {
      quote: "Whatever your wish is,\nI hope life finds a beautiful way to make it happen.",
      note: "Keep that little wish close to your heart.",
      cta: "Open your little gift",
    },
  },

  // Scene 07: The Gift
  scene7: {
    eyebrow: "A Little Token",
    title: "I have one more little thing for you.",
    subtitle: "Sebuah kotak kecil yang menyimpan sesuatu yang berharga",
    cta: "Unwrap your gift",
    reveal: {
      headline: "Your existence is already a beautiful gift to this world.",
      subtext: "Never forget how precious you are.",
      cta: "Enter the final moment",
    },
  },

  // Scene 08: The Final Moment
  scene8: {
    title: "Happy Birthday, Bocil.",
    prayers: [
      "Semoga panjang umur.",
      "Semoga bahagia.",
      "Semoga semua hal baik menemukan jalan menuju kamu.",
    ],
    quote: "Stay happy, little one.\nThe world is a little more beautiful with you in it.",
    signatureBadge: "With a little affection,",
    signatureName: "Abg.",
    ctaReplay: "Replay your little universe",
  },
};

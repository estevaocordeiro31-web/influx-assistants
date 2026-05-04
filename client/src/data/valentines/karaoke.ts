// Valentine's Karaoke - "Qual é a Música?" Game Data
// Uses Deezer API for 30-second audio previews

export type KaraokeSong = {
  id: string;
  title: string;
  artist: string;
  decade: '80s' | '90s' | '2000s' | '2020s';
  deezerId: number;
  albumCover: string;
  lyricsHint: string; // Famous lyrics snippet as hint
  lyricsContinuation: string; // Next part of the lyrics (shown after correct answer)
  funFact: string; // Fun fact about the song
  acceptedAnswers: string[]; // Multiple accepted answers (title variations)
};

export const KARAOKE_SONGS: KaraokeSong[] = [
  // === 80s ===
  {
    id: '80s-1',
    title: 'I Want to Know What Love Is',
    artist: 'Foreigner',
    decade: '80s',
    deezerId: 540528,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/5e7e6c8b1e59e0b5e6e3c6e1a0e3c6e1/250x250-000000-80-0-0.jpg',
    lyricsHint: '"I want to know what love is... I want you to _____ me"',
    lyricsContinuation: '"I want you to show me\nI want to feel what love is\nI know you can show me"',
    funFact: 'This 1984 hit reached #1 in the US and UK. The gospel choir in the song was the New Jersey Mass Choir!',
    acceptedAnswers: ['i want to know what love is', 'want to know what love is', 'foreigner'],
  },
  {
    id: '80s-2',
    title: 'Take My Breath Away',
    artist: 'Berlin',
    decade: '80s',
    deezerId: 676025,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Watching every motion in my foolish lover\'s game... Take my _____ away"',
    lyricsContinuation: '"Take my breath away\nWatching, I keep waiting\nStill anticipating love"',
    funFact: 'Won the Oscar for Best Original Song in 1987 for the movie Top Gun with Tom Cruise!',
    acceptedAnswers: ['take my breath away', 'breath away', 'berlin', 'top gun'],
  },
  {
    id: '80s-3',
    title: 'Endless Love',
    artist: 'Lionel Richie & Diana Ross',
    decade: '80s',
    deezerId: 2308961,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"My love, there\'s only you in my life... The only thing that\'s _____"',
    lyricsContinuation: '"The only thing that\'s right\nMy first love\nYou\'re every breath that I take\nYou\'re every step I make"',
    funFact: 'This duet spent 9 weeks at #1 in 1981 and was the theme song for the movie "Endless Love"!',
    acceptedAnswers: ['endless love', 'lionel richie', 'diana ross'],
  },
  {
    id: '80s-4',
    title: 'Time After Time',
    artist: 'Cyndi Lauper',
    decade: '80s',
    deezerId: 4065022,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"If you\'re lost you can look and you will find me... Time after _____"',
    lyricsContinuation: '"Time after time\nIf you fall I will catch you\nI\'ll be waiting\nTime after time"',
    funFact: 'Cyndi Lauper wrote this song in her mother\'s kitchen. Miles Davis loved it so much he covered it!',
    acceptedAnswers: ['time after time', 'cyndi lauper'],
  },
  {
    id: '80s-5',
    title: 'Careless Whisper',
    artist: 'George Michael',
    decade: '80s',
    deezerId: 2157348,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"I\'m never gonna dance again... Guilty feet have got no _____"',
    lyricsContinuation: '"Guilty feet have got no rhythm\nThough it\'s easy to pretend\nI know you\'re not a fool"',
    funFact: 'George Michael wrote this iconic sax riff when he was just 17 years old on a bus!',
    acceptedAnswers: ['careless whisper', 'george michael'],
  },
  {
    id: '80s-6',
    title: 'Every Breath You Take',
    artist: 'The Police',
    decade: '80s',
    deezerId: 471912,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Every breath you take, every move you make... I\'ll be watching _____"',
    lyricsContinuation: '"I\'ll be watching you\nEvery single day\nEvery word you say\nEvery game you play"',
    funFact: 'Sting wrote this song about obsessive surveillance, not romance! It\'s actually about jealousy and control.',
    acceptedAnswers: ['every breath you take', 'the police', 'sting'],
  },

  // === 90s ===
  {
    id: '90s-1',
    title: 'I Will Always Love You',
    artist: 'Whitney Houston',
    decade: '90s',
    deezerId: 842288,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"And I... will always _____ you"',
    lyricsContinuation: '"I will always love you\nI will always love you\nYou, my darling you"',
    funFact: 'Originally written by Dolly Parton in 1973, Whitney\'s version from The Bodyguard became the best-selling single by a woman!',
    acceptedAnswers: ['i will always love you', 'always love you', 'whitney houston', 'bodyguard'],
  },
  {
    id: '90s-2',
    title: 'My Heart Will Go On',
    artist: 'Celine Dion',
    decade: '90s',
    deezerId: 540534,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Near, far, wherever you are... My heart will go _____"',
    lyricsContinuation: '"My heart will go on\nOnce more you open the door\nAnd you\'re here in my heart\nAnd my heart will go on and on"',
    funFact: 'Celine Dion initially didn\'t want to record this Titanic theme song! James Horner had to convince her.',
    acceptedAnswers: ['my heart will go on', 'heart will go on', 'celine dion', 'titanic'],
  },
  {
    id: '90s-3',
    title: "I Don't Want to Miss a Thing",
    artist: 'Aerosmith',
    decade: '90s',
    deezerId: 633547,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"I don\'t wanna close my eyes... I don\'t wanna _____ a thing"',
    lyricsContinuation: '"I don\'t wanna miss a thing\n\'Cause even when I dream of you\nThe sweetest dream would never do\nI\'d still miss you, baby"',
    funFact: 'Written by Diane Warren for the movie Armageddon (1998), starring Liv Tyler — Steven Tyler\'s daughter!',
    acceptedAnswers: ['i dont want to miss a thing', "i don't want to miss a thing", 'miss a thing', 'aerosmith', 'armageddon'],
  },
  {
    id: '90s-4',
    title: 'Unchained Melody',
    artist: 'The Righteous Brothers',
    decade: '90s',
    deezerId: 1109731,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Oh, my love, my darling... I\'ve hungered for your _____"',
    lyricsContinuation: '"I\'ve hungered for your touch\nA long, lonely time\nTime goes by so slowly\nAnd time can do so much"',
    funFact: 'Originally from 1965, it became a massive hit again in 1990 after the movie Ghost with Demi Moore and Patrick Swayze!',
    acceptedAnswers: ['unchained melody', 'righteous brothers', 'ghost'],
  },
  {
    id: '90s-5',
    title: 'Nothing Compares 2 U',
    artist: "Sinéad O'Connor",
    decade: '90s',
    deezerId: 2309155,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"It\'s been seven hours and fifteen days... Since you took your love _____"',
    lyricsContinuation: '"Since you took your love away\nSince you been gone\nI can do whatever I want\nI can see whomever I choose"',
    funFact: 'Written by Prince in 1985, Sinéad O\'Connor\'s version became a worldwide #1 hit in 1990. The music video was shot in one take!',
    acceptedAnswers: ['nothing compares 2 u', 'nothing compares to you', 'sinead oconnor', "sinead o'connor"],
  },
  {
    id: '90s-6',
    title: 'Kiss from a Rose',
    artist: 'Seal',
    decade: '90s',
    deezerId: 2309157,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4a3e132b6f72670141257286a4a63c5c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Baby, I compare you to a kiss from a _____ on the grey"',
    lyricsContinuation: '"A kiss from a rose on the grey\nOoh, the more I get of you\nThe stranger it feels, yeah\nAnd now that your rose is in bloom"',
    funFact: 'Featured on the Batman Forever soundtrack (1995), this song won 3 Grammy Awards including Record of the Year!',
    acceptedAnswers: ['kiss from a rose', 'seal', 'batman forever'],
  },

  // === 2000s ===
  {
    id: '2000s-1',
    title: 'A Thousand Miles',
    artist: 'Vanessa Carlton',
    decade: '2000s',
    deezerId: 3148781,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/990e08407e928abdbb14db86e5563ed0/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Making my way downtown, walking fast... And I need you, and I _____ you"',
    lyricsContinuation: '"And I miss you\nAnd now I wonder\nIf I could fall into the sky\nDo you think time would pass me by?"',
    funFact: 'The iconic piano riff was written when Vanessa Carlton was just 14! The song was later featured in the movie White Chicks.',
    acceptedAnswers: ['a thousand miles', 'thousand miles', 'vanessa carlton'],
  },
  {
    id: '2000s-2',
    title: 'Beautiful',
    artist: 'Christina Aguilera',
    decade: '2000s',
    deezerId: 909622,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/ddfba44fe751639d7d8606cbdbec47dc/250x250-000000-80-0-0.jpg',
    lyricsHint: '"I am beautiful, no matter what they say... Words can\'t bring me _____"',
    lyricsContinuation: '"Words can\'t bring me down\nI am beautiful in every single way\nYes, words can\'t bring me down\nOh no, so don\'t you bring me down today"',
    funFact: 'Written by Linda Perry, this empowerment anthem won the Grammy for Best Female Pop Vocal Performance in 2004!',
    acceptedAnswers: ['beautiful', 'christina aguilera'],
  },
  {
    id: '2000s-3',
    title: 'Crazy in Love',
    artist: 'Beyoncé',
    decade: '2000s',
    deezerId: 64804583,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/1ea1a631aa5235bbd0063643beb96fa8/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Uh oh, uh oh, uh oh, oh no no... Got me looking so _____ right now"',
    lyricsContinuation: '"Got me looking so crazy right now\nYour love\'s got me looking so crazy right now\nGot me looking so crazy right now\nYour touch got me looking so crazy right now"',
    funFact: 'The horn sample is from the Chi-Lites\' 1970 song "Are You My Woman?" Jay-Z wrote his verse in just one take!',
    acceptedAnswers: ['crazy in love', 'beyonce', 'beyoncé'],
  },
  {
    id: '2000s-4',
    title: "You're Beautiful",
    artist: 'James Blunt',
    decade: '2000s',
    deezerId: 1039357,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/8b701ce9a0c1cdddf43a42638d0610b3/250x250-000000-80-0-0.jpg',
    lyricsHint: '"You\'re beautiful, you\'re beautiful... You\'re beautiful, it\'s _____"',
    lyricsContinuation: '"You\'re beautiful, it\'s true\nI saw your face in a crowded place\nAnd I don\'t know what to do\n\'Cause I\'ll never be with you"',
    funFact: 'James Blunt wrote this song about seeing his ex-girlfriend on the London Underground with her new boyfriend!',
    acceptedAnswers: ["you're beautiful", 'youre beautiful', 'james blunt', 'beautiful its true'],
  },
  {
    id: '2000s-5',
    title: 'Halo',
    artist: 'Beyoncé',
    decade: '2000s',
    deezerId: 2489560,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/7cf0bdc409e7a7898c745bf0244df312/250x250-000000-80-0-0.jpg',
    lyricsHint: '"Baby, I can see your _____... You know you\'re my saving grace"',
    lyricsContinuation: '"Baby, I can see your halo\nYou know you\'re my saving grace\nYou\'re everything I need and more\nIt\'s written all over your face"',
    funFact: 'Co-written by Ryan Tedder (OneRepublic), Beyoncé recorded this song in just one take!',
    acceptedAnswers: ['halo', 'beyonce halo', 'beyoncé'],
  },
  {
    id: '2000s-6',
    title: 'Just the Way You Are',
    artist: 'Bruno Mars',
    decade: '2000s',
    deezerId: 7874819,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/5b59dc18e109515420f8237719bd2186/250x250-000000-80-0-0.jpg',
    lyricsHint: '"When I see your face... There\'s not a thing that I would _____"',
    lyricsContinuation: '"There\'s not a thing that I would change\n\'Cause you\'re amazing\nJust the way you are\nAnd when you smile"',
    funFact: 'This was Bruno Mars\' debut single that launched his career! It spent 4 weeks at #1 on the Billboard Hot 100.',
    acceptedAnswers: ['just the way you are', 'bruno mars'],
  },

  // === 2020s ===
  {
    id: '2020s-1',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    decade: '2020s',
    deezerId: 2957498621,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/4bd5903f4ce8f2601916bfadb44efe8a/250x250-000000-80-0-0.jpg',
    lyricsHint: '"If the world was ending, I\'d wanna be next to you... Wherever we go, we go with a _____"',
    lyricsContinuation: '"Wherever we go, we go with a smile\nWe can cry on the way home\nBut tonight, we die with a smile"',
    funFact: 'Released in 2024, this duet between Lady Gaga and Bruno Mars broke streaming records and became a global #1 hit!',
    acceptedAnswers: ['die with a smile', 'lady gaga', 'bruno mars', 'lady gaga bruno mars'],
  },
  {
    id: '2020s-2',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    decade: '2020s',
    deezerId: 2606505542,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/5d284b31cb9ddeb1a0c79aede5a94e1c/250x250-000000-80-0-0.jpg',
    lyricsHint: '"I want you to stay... \'Til I\'m in the grave, \'til I rot _____"',
    lyricsContinuation: '"\'Til I rot away, dead and gone\n\'Til I\'m in the casket you carry\nBirds of a feather\nWe should stick together"',
    funFact: 'From Billie Eilish\'s 2024 album "Hit Me Hard and Soft", this became one of her biggest love songs ever!',
    acceptedAnswers: ['birds of a feather', 'billie eilish'],
  },
  {
    id: '2020s-3',
    title: 'Lover',
    artist: 'Taylor Swift',
    decade: '2020s',
    deezerId: 723326052,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/6111c5ab9729c8eac47883e4e50e9cf8/250x250-000000-80-0-0.jpg',
    lyricsHint: '"My heart\'s been borrowed and yours has been blue... All\'s well that ends well to end up with _____"',
    lyricsContinuation: '"All\'s well that ends well to end up with you\nSwear to be overdramatic and true\nTo my lover"',
    funFact: 'Taylor Swift wrote this as a love letter to her partner. The song features a waltz time signature (3/4), rare in pop music!',
    acceptedAnswers: ['lover', 'taylor swift'],
  },
  {
    id: '2020s-4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    decade: '2020s',
    deezerId: 908604432,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/fd00ebd6d30d7253f813dba3bb1c66a9/250x250-000000-80-0-0.jpg',
    lyricsHint: '"I said ooh, I\'m blinded by the lights... No, I can\'t sleep until I feel your _____"',
    lyricsContinuation: '"No, I can\'t sleep until I feel your touch\nI said ooh, I\'m drowning in the night\nOh, when I\'m like this, you\'re the one I trust"',
    funFact: 'Released in 2020, this became the #1 most-streamed song on Spotify ever at the time, with its 80s synth-pop sound!',
    acceptedAnswers: ['blinding lights', 'the weeknd', 'weeknd'],
  },
  {
    id: '2020s-5',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    decade: '2020s',
    deezerId: 144872866,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/000a9228cecfcc7c2093d9cd7bb66447/250x250-000000-80-0-0.jpg',
    lyricsHint: '"\'Cause we were just kids when we fell in love... Baby, I\'m dancing in the _____ with you"',
    lyricsContinuation: '"Baby, I\'m dancing in the dark with you\nBetween my arms\nBarefoot on the grass\nListening to our favourite song"',
    funFact: 'Ed Sheeran wrote this about his wife Cherry Seaborn. The duet version with Beyoncé reached #1 worldwide!',
    acceptedAnswers: ['perfect', 'ed sheeran'],
  },
  {
    id: '2020s-6',
    title: 'All of Me',
    artist: 'John Legend',
    decade: '2020s',
    deezerId: 65764684,
    albumCover: 'https://cdn-images.dzcdn.net/images/cover/e9a170ca0ae06918f9baa6cb109fb321/250x250-000000-80-0-0.jpg',
    lyricsHint: '"\'Cause all of me loves all of _____... All your curves and all your edges"',
    lyricsContinuation: '"All of me loves all of you\nAll your curves and all your edges\nAll your perfect imperfections\nGive your all to me, I\'ll give my all to you"',
    funFact: 'John Legend wrote this for his wife Chrissy Teigen. The music video was filmed during their real wedding in Italy!',
    acceptedAnswers: ['all of me', 'john legend'],
  },
];

// Karaoke celebration images
export const KARAOKE_CELEBRATION_IMAGES = {
  lucas: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-karaoke-celebration-SgYhqwVMUxn7su4udBxW7y.webp',
  emily: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-karaoke-celebration-ZKQVe6cxVdc8JjiqTmjygy.webp',
  aiko: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-karaoke-celebration-aPhbyVKwdyhNsFPPBWe2hF.webp',
};

// Decade info for UI
export const DECADE_INFO = {
  '80s': { label: '80s', emoji: '🎸', color: '#9C27B0', gradient: 'from-purple-600 to-pink-500' },
  '90s': { label: '90s', emoji: '💿', color: '#2196F3', gradient: 'from-blue-600 to-cyan-500' },
  '2000s': { label: '2000s', emoji: '📱', color: '#FF9800', gradient: 'from-orange-500 to-yellow-500' },
  '2020s': { label: '2020s', emoji: '🎧', color: '#4CAF50', gradient: 'from-green-500 to-emerald-500' },
};

// Get songs by decade
export const getSongsByDecade = (decade: string) => KARAOKE_SONGS.filter(s => s.decade === decade);

// Get random songs for a round (pick N from a decade)
export const getRandomSongs = (decade: string, count: number = 4) => {
  const songs = getSongsByDecade(decade);
  const shuffled = [...songs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

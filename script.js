"use strict";

const nav = document.getElementById("mainNav");
const header = document.querySelector(".header");
const publisherBar = document.querySelector(".publisher-bar");

let albums = [];
let watchedAlbums = [];
let cartAlbums = [];
let filteredAlbumsGlobal = [];
let scenarioAlbumPool = [];

function getFilteredPool(albums, selectedScope, selectedGenre, watchedAlbums) {
  // 1️⃣ Scope – does it consider the entire store or just the watched list?
  const scoped =
    selectedScope === "watched"
      ? albums.filter((a) => watchedAlbums.includes(a.id))
      : albums;

  // 2️⃣ Genre filter – samo ako nije izabran "all"
  const genreFiltered =
    selectedGenre.toLowerCase() === "all"
      ? scoped
      : scoped.filter(
          (a) =>
            typeof a.genre === "string" &&
            a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
        );

  return genreFiltered;
}

document.addEventListener("DOMContentLoaded", () => {
  // Sticky odmah ako smo već skrolovani
  if (window.scrollY > header.offsetHeight - 150) {
    nav.classList.add("sticky");
    publisherBar.classList.add("after-sticky");
    nav.style.opacity = "1";
    nav.style.transform = "translate(-50%, 0)";
    mainNav.style.transform = "none";
  }

  // Cart dugme
  const cartNavBtn = document.querySelector(".cart-btn a");
  const cartPanel = document.getElementById("cartPanel");

  if (cartNavBtn && cartPanel) {
    cartNavBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cartPanel.classList.toggle("hidden");
      renderCart();
    });
  }

  // Klik van Cart panela = zatvaranje
  document.addEventListener("click", (e) => {
    const isClickInsidePanel = cartPanel?.contains(e.target);
    const isClickOnButton = cartNavBtn?.contains(e.target);

    if (!isClickInsidePanel && !isClickOnButton) {
      cartPanel?.classList.add("hidden");
    }
  });
});

// 2. Reaguj na skrol — dodaj/ukloni sticky klasu
window.addEventListener("scroll", () => {
  if (window.scrollY > header.offsetHeight - 150) {
    nav.classList.add("sticky");
    publisherBar.classList.add("after-sticky");
  } else {
    nav.classList.remove("sticky");
    publisherBar.classList.remove("after-sticky");
  }
});

// Jednom pokreni fadeIn animaciju, zatim ukloni da se ne dešava ponovo
nav.addEventListener("animationend", (e) => {
  if (e.animationName === "fadeInNav") {
    if (!nav.classList.contains("sticky")) {
      nav.classList.add("animated-once");
      nav.style.animation = "none";
      nav.style.opacity = "1";
    }
  }
});

// ALBUMI //
// const albums = [
//   {
//     id: 1,
//     title: "The Honeydrippers - Volume 1",
//     format: "Vinyl",
//     genre: "Rock, Blues",
//     price: 30,
//     stock: 5,
//     cover: "images/covers-thumbs/the-honeydrippers-volume-one-front-thumb.jpg",
//     rating: 0.326,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 2,
//     title: "FunkDoobiest - Which Doobie U B?",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 15,
//     stock: 5,
//     cover: "images/covers-thumbs/funkdoobiest-which-doobie-u-b-front-thumb.jpg",
//     rating: 0.321,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 3,
//     title: "Robben Ford - Bringinig it Back Home",
//     format: "Vinyl",
//     genre: "Blues, Rock",
//     price: 32,
//     stock: 4,
//     cover:
//       "images/covers-thumbs/robben-ford-bringing-it-back-home-front-thumb.jpg",
//     rating: 0.35,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 4,
//     title: "House Of Pain - Fine Malt Lyrics",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 28,
//     stock: 9,
//     cover:
//       "images/covers-thumbs/house-of-pain-fine-malt-lyrics-front-thumb.jpg",
//     rating: 0.319,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 5,
//     title: "Tom Waits - Rain Dogs",
//     format: "Vinyl",
//     genre: "Other, Blues, Rock",
//     price: 22,
//     stock: 11,
//     cover: "images/covers-thumbs/tom-waits-rain-dogs-front-thumb.jpg",
//     rating: 0.404,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 6,
//     title: "Cypress Hill - 1991",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 10,
//     stock: 12,
//     cover: "images/covers-thumbs/cypress-hill-1991-front-thumb.jpg",
//     rating: 0.349,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 7,
//     title: "Etta James - Tell Mama",
//     format: "CD",
//     genre: "Jazz",
//     price: 10,
//     stock: 12,
//     cover: "images/covers-thumbs/etta-james-tell-mama-Cover-Art_result.webp",
//     rating: 0.382,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 8,
//     title: "Pearl Jam - Ten",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 20,
//     stock: 20,
//     cover: "images/covers-thumbs/pearl-jam-ten-front-front-thumb.jpg",
//     rating: 0.374,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 9,
//     title: "Black Crowes - Shake Your Money Maker",
//     format: "CD",
//     genre: "Rock, Blues",
//     price: 9,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/the-black-crowes-shake-your-money-maker-front-thumb.jpg",
//     rating: 0.354,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 10,
//     title: "Stan Getz & João Gilberto - Getz / Gilberto",
//     format: "CD",
//     genre: "Jazz",
//     price: 9,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/stan-getz-and-joao-gilberto-featuring-antonio-carlos-jobim-getz-gilberto-Cover-Art_result.webp",
//     rating: 0.401,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 11,
//     title: "Stevie Ray Vaughan - Texas Flood",
//     format: "Vinyl",
//     genre: "Blues, Rock",
//     price: 28,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/stevie-ray-vaughan-and-double-double-texas-flood-front-thumb.jpg",
//     rating: 0.376,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 12,
//     title: "Wu-Tang Clan - Enter The Wu Tang",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 24,
//     stock: 17,
//     cover:
//       "images/covers-thumbs/wu-tang-clan-enter-the-wu-tang-front-thumb.jpg",
//     rating: 0.423,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 13,
//     title: "Chet Baker - Chet",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 21,
//     stock: 7,
//     cover: "images/covers-thumbs/chet-baker-chet-front-thumb.jpg",
//     rating: 0.363,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 14,
//     title: "Bruce Springsteen - Darkness on the Edge of Town0.392",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 25,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/bruce-springsteen-darkness-on-the-edge-of-town-Cover-Art_result.webp",
//     rating: 0.392,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 15,
//     title: "Judgement night - Soundtrack",
//     format: "Vinyl",
//     genre: "Other, Rock, Hip-Hop",
//     price: 25,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/judgment-night-music-from-the-motion-picture-front-thumb.jpg",
//     rating: 0.354,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 16,
//     title: "Count Basie - Basie",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 32,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/count-basie-orchestra-neal-hefti-arrangements-basie-Cover-Art_result.webp",
//     rating: 0.364,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 17,
//     title: "Rage Against The Machine - Rage Against The Machine",
//     format: "CD",
//     genre: "Rock",
//     price: 11,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/rage-against-the-machine-rage-against-the-machine-front-thumb.jpg",
//     rating: 0.399,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 18,
//     title: "Black Crowes - Shake Your Money Maker",
//     format: "Vinyl",
//     genre: "Rock, Blues",
//     price: 28,
//     stock: 6,
//     cover:
//       "images/covers-thumbs/the-black-crowes-shake-your-money-maker-front-thumb.jpg",
//     rating: 0.354,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 19,
//     title: "AC/DC - Back In Black",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 25,
//     stock: 15,
//     cover: "images/covers-thumbs/ac-dc-back-in-black-front-thumb.jpg",
//     rating: 0.344,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 20,
//     title: "Alice Clark - Alice Clark",
//     format: "Vinyl",
//     genre: "Other",
//     price: 35,
//     stock: 2,
//     cover: "images/covers-thumbs/alice-clark-alice-clark-front-thumb.jpg",
//     rating: 0.351,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 21,
//     title: "Radiohead - OK Computer",
//     format: "CD",
//     genre: "Rock",
//     price: 12,
//     stock: 15,
//     cover: "images/covers-thumbs/radiohead-ok-computer-front-thumb.jpg",
//     rating: 0.43,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 22,
//     title: "Sade - Promise",
//     format: "CD",
//     genre: "Other",
//     price: 7,
//     stock: 22,
//     cover: "images/covers-thumbs/sade-promise-Cover-Art_result.webp",
//     rating: 0.396,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 23,
//     title: "Beastie Boys - Check Your Head",
//     format: "Vinyl",
//     genre: "Hip-Hop, Rock, Other",
//     price: 28,
//     stock: 6,
//     cover:
//       "images/covers-thumbs/beastie-boys-check-your-head-Cover-Art_result.webp",
//     rating: 0.372,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 24,
//     title: "Nas - Illmatic",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 22,
//     stock: 18,
//     cover: "images/covers-thumbs/nas-illmatic-front-thumb.jpg",
//     rating: 0.427,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 25,
//     title: "Neil Young - On the Beach",
//     format: "CD",
//     genre: "Rock",
//     price: 10,
//     stock: 16,
//     cover: "images/covers-thumbs/neil-young-on-the-beach-Cover-Art_result.webp",
//     rating: 0.408,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 26,
//     title: "Mos Def - Black on Both Sides",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 8,
//     stock: 20,
//     cover:
//       "images/covers-thumbs/mos-def-black-on-both-sides-Cover-Art_result.webp",
//     rating: 0.407,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 27,
//     title: "Pink Floyd - The Dark Side of The Moon",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 29,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/pink-floyd–the-dark-side-of-the-moon-front-thumb.jpg",
//     rating: 0.426,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 28,
//     title: "Cypress Hill - 1991",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 25,
//     stock: 12,
//     cover: "images/covers-thumbs/cypress-hill-1991-front-thumb.jpg",
//     rating: 0.349,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 29,
//     title: "Miles Davis - Kind of Blue",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 22,
//     stock: 20,
//     cover: "images/covers-thumbs/miles-davis-kind-of-blue-front-thumb.jpg",
//     rating: 0.424,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 30,
//     title: 'Julian "Cannonball" Adderley - Somethin\' Else',
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 23,
//     stock: 9,
//     cover:
//       "images/covers-thumbs/julian-cannonball-adderley-somethin-else-front-thumb.jpg",
//     rating: 0.392,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 31,
//     title: "Chet Baker - Chet",
//     format: "CD",
//     genre: "Jazz",
//     price: 8,
//     stock: 8,
//     cover: "images/covers-thumbs/chet-baker-chet-front-thumb.jpg",
//     rating: 0.363,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 32,
//     title: "The Meters -The Meters",
//     format: "CD",
//     genre: "Other",
//     price: 12,
//     stock: 6,
//     cover: "images/covers-thumbs/the-meters-the-meters-front-thumb.jpg",
//     rating: 0.369,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 33,
//     title: "Dave Brubeck - Time Out",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 22,
//     stock: 11,
//     cover: "images/covers-thumbs/dave-brubeck-time-out-front-thumb.jpg",
//     rating: 0.394,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 34,
//     title: "Wu-Tang Clan - Enter The Wu Tang",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 9,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/wu-tang-clan-enter-the-wu-tang-front-thumb.jpg",
//     rating: 0.423,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 35,
//     title: "Rage Against The Machine - Rage Against The Machine",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 26,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/rage-against-the-machine-rage-against-the-machine-front-thumb.jpg",
//     rating: 0.399,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 36,
//     title: "N.W.A. - Niggaz4Life",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 10,
//     stock: 10,
//     cover: "images/covers-thumbs/nwa-niggaz4life-front-thumb.jpg",
//     rating: 0.332,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 37,
//     title: "Radiohead - OK Computer",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 27,
//     stock: 12,
//     cover: "images/covers-thumbs/radiohead-ok-computer-front-thumb.jpg",
//     rating: 0.43,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 38,
//     title: "Bob Dylan - Highway 61 Revisited",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 22,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/bob-dylan-highway-61-revisited-front-thumb.jpg",
//     rating: 0.416,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 39,
//     title: "Alice Clark - Alice Clark",
//     format: "CD",
//     genre: "Other",
//     price: 17,
//     stock: 4,
//     cover: "images/covers-thumbs/alice-clark-alice-clark-front-thumb.jpg",
//     rating: 0.351,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 40,
//     title: "Muddy Waters - Folk Singer",
//     format: "CD",
//     genre: "Blues",
//     price: 10,
//     stock: 5,
//     cover: "images/covers-thumbs/muddy-waters-folk-singer-front-thumb.jpg",
//     rating: 0.376,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 41,
//     title: "Robert Cray - Strong Persuader",
//     format: "CD",
//     genre: "Blues",
//     price: 8,
//     stock: 18,
//     cover:
//       "images/covers-thumbs/robert-cray-strong-persuader-Cover-Art_result.webp",
//     rating: 0.363,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 42,
//     title: "The Meters -The Meters",
//     format: "Vinyl",
//     genre: "Other",
//     price: 26,
//     stock: 5,
//     cover: "images/covers-thumbs/the-meters-the-meters-front-thumb.jpg",
//     rating: 0.369,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 43,
//     title: "Snoop Doggy Dogg - Doggystyle",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 11,
//     stock: 14,
//     cover: "images/covers-thumbs/snoop-doggy-dogg-doggystyle-front-thumb.jpg",
//     rating: 0.386,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 44,
//     title: "John Scofield - Quiet",
//     format: "CD",
//     genre: "Jazz, Rock",
//     price: 14,
//     stock: 3,
//     cover: "images/covers-thumbs/john-scofield-quiet-Cover-Art_result.webp",
//     rating: 0.367,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 45,
//     title: "Herbie Hancock - Head Hunters",
//     format: "CD",
//     genre: "Jazz",
//     price: 10,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/herbie-hancock-head-hunters-Cover-Art_result.webp",
//     rating: 0.403,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 46,
//     title: "John Coltrane and Johnny Hartman",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 29,
//     stock: 6,
//     cover:
//       "images/covers-thumbs/john-coltrane-and-johnny-hartman-john-coltrane-and-johnny-hartman-front-thumb.jpg",
//     rating: 0.37,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 47,
//     title: "Public Enemy - Fear of a Black Planet",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 7,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/public-enemy-fear-of-a-black-planet-front-thumb.jpg",
//     rating: 0.385,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 48,
//     title: "Miles Davis - Kind of Blue",
//     format: "CD",
//     genre: "Jazz",
//     price: 9,
//     stock: 18,
//     cover: "images/covers-thumbs/miles-davis-kind-of-blue-front-thumb.jpg",
//     rating: 0.424,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 49,
//     title: "Public Enemy - Fear of a Black Planet",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 25,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/public-enemy-fear-of-a-black-planet-front-thumb.jpg",
//     rating: 0.385,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 50,
//     title: "The Notorious BIG - Ready To Die",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 10,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/the-notorious-big-ready-to-die-front-thumb.jpg",
//     rating: 0.404,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 51,
//     title: "Dave Brubeck - Time Out",
//     format: "CD",
//     genre: "Jazz",
//     price: 9,
//     stock: 12,
//     cover: "images/covers-thumbs/dave-brubeck-time-out-front-thumb.jpg",
//     rating: 0.394,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 52,
//     title: "Bob Marley & The Wailers- Burnin'",
//     format: "CD",
//     genre: "Other",
//     price: 7,
//     stock: 23,
//     cover:
//       "images/covers-thumbs/bob-marley-the-wailers-burnin-Cover-Art_result.webp",
//     rating: 0.379,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 53,
//     title: 'Julian "Cannonball" Adderley - Somethin\' Else',
//     format: "CD",
//     genre: "Jazz",
//     price: 9,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/julian-cannonball-adderley-somethin-else-front-thumb.jpg",
//     rating: 0.392,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 54,
//     title: "John Coltrane - Giant Steps",
//     format: "CD",
//     genre: "Jazz",
//     price: 8,
//     stock: 15,
//     cover: "images/covers-thumbs/john-coltrane-giant-steps-front-thumb.jpg",
//     rating: 0.411,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 55,
//     title: "Muddy Waters - Folk Singer",
//     format: "Vinyl",
//     genre: "Blues",
//     price: 26,
//     stock: 7,
//     cover: "images/covers-thumbs/muddy-waters-folk-singer-front-thumb.jpg",
//     rating: 0.376,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 56,
//     title: "The Notorious BIG - Ready To Die",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 28,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/the-notorious-big-ready-to-die-front-thumb.jpg",
//     rating: 0.404,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 57,
//     title: "Judgement night - Soundtrack",
//     format: "CD",
//     genre: "Other, Rock, Hip-Hop",
//     price: 10,
//     stock: 11,
//     cover:
//       "images/covers-thumbs/judgment-night-music-from-the-motion-picture-front-thumb.jpg",
//     rating: 0.354,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 58,
//     title: "Pantera - Vulgar Display of Power",
//     format: "CD",
//     genre: "Rock, Other",
//     price: 9,
//     stock: 18,
//     cover:
//       "images/covers-thumbs/pantera-vulgar-display-of-power-Cover-Art_result.webp",
//     rating: 0.361,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 59,
//     title: "Jimmy Smith - Root Down",
//     format: "CD",
//     genre: "Jazz",
//     price: 12,
//     stock: 6,
//     cover: "images/covers-thumbs/jimmy-smith-root-down-front-thumb.jpg",
//     rating: 0.394,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 60,
//     title: "Stevie Ray Vaughan - Texas Flood",
//     format: "CD",
//     genre: "Blues, Rock",
//     price: 8,
//     stock: 13,
//     cover:
//       "images/covers-thumbs/stevie-ray-vaughan-and-double-double-texas-flood-front-thumb.jpg",
//     rating: 0.376,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 61,
//     title: "John Coltrane and Johnny Hartman",
//     format: "CD",
//     genre: "Jazz",
//     price: 12,
//     stock: 5,
//     cover:
//       "images/covers-thumbs/john-coltrane-and-johnny-hartman-john-coltrane-and-johnny-hartman-front-thumb.jpg",
//     rating: 0.37,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 62,
//     title: "Bob Dylan - Highway 61 Revisited",
//     format: "CD",
//     genre: "Rock",
//     price: 8,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/bob-dylan-highway-61-revisited-front-thumb.jpg",
//     rating: 0.416,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 63,
//     title: "Cypress Hill - III (Temples of Boom)",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 9,
//     stock: 18,
//     cover:
//       "images/covers-thumbs/cypress-hill-iii-temples-of-boom-Cover-Art_result.webp",
//     rating: 0.366,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 64,
//     title: "Red Hot Chili Peppers - Blood Sugar Sex Magik",
//     format: "CD",
//     genre: "Rock",
//     price: 8,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/red-hot-chili-peppers-blood-sugar-sex-magik-Cover-Art_result.webp",
//     rating: 0.356,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 65,
//     title: "Amy Winehouse - Back to Black",
//     format: "Vinyl",
//     genre: "Other",
//     price: 26,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/amy-winehouse-back-to-black-Cover-Art_result.webp",
//     rating: 0.386,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 66,
//     title: "Alice in Chains - Jar of Flies",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 22,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/alice-in-chains-jar-of-flies-Cover-Art_result.webp",
//     rating: 0.403,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 67,
//     title: "Tom Petty - Full Moon Fever",
//     format: "CD",
//     genre: "Rock",
//     price: 8,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/tom-petty-full-moon-fever-Cover-Art_result.webp",
//     rating: 0.375,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 68,
//     title: "Mobb Deep - The Infamous",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 13,
//     stock: 12,
//     cover: "images/covers-thumbs/mobb-deep-the-infamous-Cover-Art_result.webp",
//     rating: 0.411,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 69,
//     title: "The Derek Trucks Band - Songlines",
//     format: "CD",
//     genre: "Rock, Blues",
//     price: 10,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/the-derek-trucks-band-songlines-Cover-Art_result.webp",
//     rating: 0.353,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 70,
//     title: "The Doors - The Doors",
//     format: "CD",
//     genre: "Rock, Other",
//     price: 12,
//     stock: 24,
//     cover: "images/covers-thumbs/the-doors-the-doors-Cover-Art_result.webp",
//     rating: 0.409,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 71,
//     title: "Led Zeppelin - Led Zeppelin II",
//     format: "CD",
//     genre: "Rock",
//     price: 8,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/led-zeppelin-led-zeppelin-ii-Cover-Art_result.webp",
//     rating: 0.391,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 72,
//     title: "Guru - Jazzmatazz Volume: 1",
//     format: "Vinyl",
//     genre: "Hip-Hop, Jazz",
//     price: 27,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/guru-jazzmatazz-volume-1-Cover-Art_result.webp",
//     rating: 0.369,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 73,
//     title: "Ella Fitzgerald & Louis Armstrong - Ella and Louis",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 24,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/ella-fitzgerald-and-louis-armstrong-ella-and-louis-Cover-Art_result.webp",
//     rating: 0.38,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 74,
//     title: "Nas - Illmatic",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 8,
//     stock: 17,
//     cover: "images/covers-thumbs/nas-illmatic-front-thumb.jpg",
//     rating: 0.427,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 75,
//     title: "Sonny Rollins - Saxophone Colossus",
//     format: "CD",
//     genre: "Jazz",
//     price: 8,
//     stock: 20,
//     cover:
//       "images/covers-thumbs/sonny-rollins-saxophone-colossus-Cover-Art_result.webp",
//     rating: 0.395,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 76,
//     title: "AC/DC - Back In Black",
//     format: "CD",
//     genre: "Rock",
//     price: 8,
//     stock: 12,
//     cover: "images/covers-thumbs/ac-dc-back-in-black-front-thumb.jpg",
//     rating: 0.344,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 77,
//     title: "The Neville Brothers - Yellow Moon",
//     format: "CD",
//     genre: "Other",
//     price: 10,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/the-neville-brothers-yellow-moon-Cover-Art_result.webp",
//     rating: 0.356,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 78,
//     title: "Barry White - Stone Gon'",
//     format: "Vinyl",
//     genre: "Other",
//     price: 26,
//     stock: 15,
//     cover: "images/covers-thumbs/barry-white-stone-gon-Cover-Art_result.webp",
//     rating: 0.367,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 79,
//     title: "Albert Collins, Robert Cray & Johnny Copeland - Showdown!",
//     format: "CD",
//     genre: "Blues",
//     price: 12,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/albert-collins-robert-cray-and-johnny-copeland-showdown-Cover-Art_result.webp",
//     rating: 0.365,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 80,
//     title: "Sean Price - Monkey Barz",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 30,
//     stock: 10,
//     cover: "images/covers-thumbs/sean-price-monkey-barz-Cover-Art_result.webp",
//     rating: 0.374,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 81,
//     title: "Billie Holiday - Lady Sings the Blues ",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 26,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/billie-holiday-lady-sings-the-blues-Cover-Art_result.webp",
//     rating: 0.378,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 82,
//     title: "House Of Pain - Fine Malt Lyrics",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 9,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/house-of-pain-fine-malt-lyrics-front-thumb.jpg",
//     rating: 0.319,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 83,
//     title: "Body Count - Body Count",
//     format: "Vinyl",
//     genre: "Rock, Hip-Hop, Other",
//     price: 30,
//     stock: 8,
//     cover: "images/covers-thumbs/body-count-body-count-Cover-Art_result.webp",
//     rating: 0.331,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 84,
//     title: "John Lee Hooker - It Serve You Right to Suffer",
//     format: "Vinyl",
//     genre: "Blues",
//     price: 26,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/john-lee-hooker-it-serve-you-right-to-suffer-Cover-Art_result.webp",
//     rating: 0.379,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 85,
//     title: "N.W.A. - Niggaz4Life",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 26,
//     stock: 9,
//     cover: "images/covers-thumbs/nwa-niggaz4life-front-thumb.jpg",
//     rating: 0.332,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 86,
//     title: "Johnny 'Guitar' Watson - A Real Mother for Ya",
//     format: "Vinyl",
//     genre: "Blues, Other",
//     price: 29,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/johnny-guitar-watson-a-real-mother-for-ya-Cover-Art_result.webp",
//     rating: 0.364,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 87,
//     title: "Lynyrd Skynyrd - (pronounced 'lĕh-'nérd 'skin-'nérd)",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 29,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/lynyrd-skynyrd-pronounced-leh-nerd-skin-nerd-Cover-Art_result.webp",
//     rating: 0.377,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 88,
//     title: "A Tribe Called Quest - The Low End Theory",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 12,
//     stock: 13,
//     cover:
//       "images/covers-thumbs/a-tribe-called-quest-the-low-end-theory-Cover-Art_result.webp",
//     rating: 0.416,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 89,
//     title: "The Who - Who's Next",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 25,
//     stock: 20,
//     cover: "images/covers-thumbs/the-who-whos-next-Cover-Art_result.webp",
//     rating: 0.391,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 90,
//     title: "Art Blakey - The Jazz Messengers",
//     format: "CD",
//     genre: "Jazz",
//     price: 12,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/the-jazz-messengers-the-jazz-messengers-Cover-Art_result.webp",
//     rating: 0.374,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 91,
//     title: "Snoop Doggy Dogg - Doggystyle",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 29,
//     stock: 12,
//     cover: "images/covers-thumbs/snoop-doggy-dogg-doggystyle-front-thumb.jpg",
//     rating: 0.386,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 92,
//     title: "Screamin' Jay Hawkins - At Home With Screamin' Jay Hawkins",
//     format: "Vinyl",
//     genre: "Blues, Other",
//     price: 25,
//     stock: 18,
//     cover:
//       "images/covers-thumbs/screamin-jay-hawkins-at-home-with-screamin-jay-hawkins-Cover-Art_result.webp",
//     rating: 0.35,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 93,
//     title: "Bill Evans - Waltz for Debby",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 30,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/bill-evans-trio-waltz-for-debby-Cover-Art_result.webp",
//     rating: 0.404,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 94,
//     title: "Reflection Eternal - Train of Thought",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 12,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/reflection-eternal-train-of-thought-Cover-Art_result.webp",
//     rating: 0.378,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 95,
//     title: "Pink Floyd - The Dark Side of The Moon",
//     format: "CD",
//     genre: "Rock",
//     price: 10,
//     stock: 17,
//     cover:
//       "images/covers-thumbs/pink-floyd–the-dark-side-of-the-moon-front-thumb.jpg",
//     rating: 0.426,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 96,
//     title: "Dr. Dre - The Chronic",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 28,
//     stock: 16,
//     cover: "images/covers-thumbs/dr-dre-the-chronic-Cover-Art_result.webp",
//     rating: 0.383,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 97,
//     title: "Dire Straits - Dire Straits",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 27,
//     stock: 21,
//     cover:
//       "images/covers-thumbs/dire-straits-dire-straits-Cover-Art_result.webp",
//     rating: 0.366,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 98,
//     title: "De La Soul - 3 Feet High and Rising",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 25,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/de-la-soul-3-feet-high-and-rising-Cover-Art_result.webp",
//     rating: 0.383,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 99,
//     title: "Marvin Gaye - What's Going On",
//     format: "Vinyl",
//     genre: "Other",
//     price: 25,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/marvin-gaye-whats-going-on-Cover-Art_result.webp",
//     rating: 0.42,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 100,
//     title: "Robben Ford - Bringinig it Back Home",
//     format: "CD",
//     genre: "Blues, Rock",
//     price: 15,
//     stock: 3,
//     cover:
//       "images/covers-thumbs/robben-ford-bringing-it-back-home-front-thumb.jpg",
//     rating: 0.35,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 101,
//     title: "2Pac - Me Against the World",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 26,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/2pac-me-against-the-world-Cover-Art_result.webp",
//     rating: 0.378,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 102,
//     title: "Metallica - Master of Puppets",
//     format: "CD",
//     genre: "Rock, Other",
//     price: 8,
//     stock: 18,
//     cover:
//       "images/covers-thumbs/metallica-master-of-puppets-Cover-Art_result.webp",
//     rating: 0.404,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 103,
//     title: "Curtis Mayfield - Superfly",
//     format: "CD",
//     genre: "Other",
//     price: 6,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/curtis-mayfield-superfly-Cover-Art_result.webp",
//     rating: 0.408,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 104,
//     title: "Fleetwood Mac - Tango in the Night",
//     format: "Vinyl",
//     genre: "Rock, Other",
//     price: 24,
//     stock: 22,
//     cover:
//       "images/covers-thumbs/fleetwood-mac-tango-in-the-night-Cover-Art_result.webp",
//     rating: 0.369,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 105,
//     title: "FunkDoobiest - Which Doobie U B?",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 28,
//     stock: 4,
//     cover: "images/covers-thumbs/funkdoobiest-which-doobie-u-b-front-thumb.jpg",
//     rating: 0.321,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 106,
//     title: "Jimi Hendrix - Are You Experienced",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 28,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/the-jimi-hendrix-experience-are-you-experienced-Cover-Art_result.webp",
//     rating: 0.41,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 107,
//     title: "Danzing - Danzing",
//     format: "Vinyl",
//     genre: "Rock, Other",
//     price: 31,
//     stock: 8,
//     cover: "images/covers-thumbs/danzig-danzig-cover-art_result.webp",
//     rating: 0.366,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 108,
//     title: "Keith Jarrett - The Köln Concert",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 31,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/keith-jarrett-the-koln-concert-Cover-Art_result.webp",
//     rating: 0.404,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 109,
//     title: "Mark Knopfler - Sailing to Philadelphia",
//     format: "CD",
//     genre: "Rock",
//     price: 10,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/mark-knopfler-sailing-to-philadelphia-Cover-Art_result.webp",
//     rating: 0.356,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 110,
//     title: "OutKast - ATLiens",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 12,
//     stock: 12,
//     cover: "images/covers-thumbs/outkast-atliens-Cover-Art_result.webp",
//     rating: 0.406,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 111,
//     title: "The Beatles - Abbey Road",
//     format: "CD",
//     genre: "Rock, Other",
//     price: 9,
//     stock: 22,
//     cover: "images/covers-thumbs/the-beatles-abbey-road-Cover-Art_result.webp",
//     rating: 0.429,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 112,
//     title: "The Ben Webster Quintet - Soulville",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 28,
//     stock: 11,
//     cover:
//       "images/covers-thumbs/the-ben-webster-quintet-soulville-Cover-Art_result.webp",
//     rating: 0.368,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 113,
//     title: "Scarface - The Diary",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 9,
//     stock: 8,
//     cover: "images/covers-thumbs/scarface-the-diary-Cover-Art_result.webp",
//     rating: 0.384,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 114,
//     title: "Erykah Badu - Baduizm",
//     format: "CD",
//     genre: "Other",
//     price: 6,
//     stock: 24,
//     cover: "images/covers-thumbs/erykah-badu-baduizm-Cover-Art_result.webp",
//     rating: 0.386,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 115,
//     title: "Bobby Womack - Across 110th Street",
//     format: "Vinyl",
//     genre: "Other",
//     price: 28,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/bobby-womack-j_j-johnson-across-110th-street-Cover-Art_result.webp",
//     rating: 0.358,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 116,
//     title: "Pearl Jam - Ten",
//     format: "CD",
//     genre: "Rock",
//     price: 6,
//     stock: 19,
//     cover: "images/covers-thumbs/pearl-jam-ten-front-front-thumb.jpg",
//     rating: 0.374,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 117,
//     title: "Tha Dogg Pound - Dogg Food",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 29,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/tha-dogg-pound-dogg-food-Cover-Art_result.webp",
//     rating: 0.358,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 118,
//     title: "John Mayall with Eric Clapton - Blues Breakers",
//     format: "Vinyl",
//     genre: "Rock, Blues",
//     price: 28,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/john-mayall-with-eric-clapton-blues-breakers-Cover-Art_result.webp",
//     rating: 0.36,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 119,
//     title: "Canned Heat & John Lee Hooker - Hooker 'n Heat",
//     format: "CD",
//     genre: "Blues, Rock",
//     price: 10,
//     stock: 16,
//     cover:
//       "images/covers-thumbs/canned-heat-and-john-lee-hooker-hooker-n-heat-cover-art_result.webp",
//     rating: 0.372,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 120,
//     title: "Chet Baker - Chet Baker Sings",
//     format: "CD",
//     genre: "Jazz",
//     price: 10,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/chet-baker-chet-baker-sings-Cover-Art_result.webp",
//     rating: 0.385,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 121,
//     title: "Faith No More - Angel Dust",
//     format: "Vinyl",
//     genre: "Rock",
//     price: 29,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/faith-no-more-angel-dust-Cover-Art_result.webp",
//     rating: 0.385,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 122,
//     title: "Chick Corea - Return to Forever",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 28,
//     stock: 4,
//     cover:
//       "images/covers-thumbs/chick-corea-return-to-forever-Cover-Art_result.webp",
//     rating: 0.378,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 123,
//     title: "Oasis - (What's the Story) Morning Glory?",
//     format: "Vinyl",
//     genre: "Rock, Other",
//     price: 28,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/oasis-whats-the-story-morning-glory-Cover-Art_result.webp",
//     rating: 0.371,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 124,
//     title: "Tom Waits - Rain Dogs",
//     format: "CD",
//     genre: "Other, Blues, Rock",
//     price: 8,
//     stock: 12,
//     cover: "images/covers-thumbs/tom-waits-rain-dogs-front-thumb.jpg",
//     rating: 0.404,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 125,
//     title: "GZA/Genius - Liquid Swords",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 30,
//     stock: 9,
//     cover: "images/covers-thumbs/gza-liquid-swordz_result.webp",
//     rating: 0.411,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 126,
//     title: "Smif-n-Wessun - Dah Shinin'",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 15,
//     stock: 7,
//     cover:
//       "images/covers-thumbs/smif-n-wessun-dah-shinin-Cover-Art_result.webp",
//     rating: 0.378,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 127,
//     title: "Jamiroquai - The Return of the Space Cowboy",
//     format: "CD",
//     genre: "Other",
//     price: 9,
//     stock: 20,
//     cover:
//       "images/covers-thumbs/jamiroquai-the-return-of-the-space-cowboy-Cover-Art_result.webp",
//     rating: 0.366,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 128,
//     title: "Dr. John - Gris-Gris",
//     format: "Vinyl",
//     genre: "Blues, Other",
//     price: 28,
//     stock: 14,
//     cover:
//       "images/covers-thumbs/dr-john-the-night-tripper-gris-gris-Cover-Art_result.webp",
//     rating: 0.37,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 129,
//     title: "The Pharcyde - Bizarre Ride II the Pharcyde",
//     format: "CD",
//     genre: "Hip-Hop, Jazz",
//     price: 10,
//     stock: 11,
//     cover: "images/covers-thumbs/the-pharcyde-bizare-ride_result.jpg",
//     rating: 0.389,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 130,
//     title: "Grace Jones - Nightclubbing",
//     format: "CD",
//     genre: "Other",
//     price: 9,
//     stock: 15,
//     cover:
//       "images/covers-thumbs/grace-jones-nightclubbing-Cover-Art_result.webp",
//     rating: 0.365,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 131,
//     title: "EPMD - Strictly Business",
//     format: "CD",
//     genre: "Hip-Hop",
//     price: 12,
//     stock: 8,
//     cover: "images/covers-thumbs/epmd-strictly-business-Cover-Art_result.webp",
//     rating: 0.372,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 132,
//     title: "Ice Cube - Death Certificate",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 28,
//     stock: 10,
//     cover:
//       "images/covers-thumbs/ice-cube-death-certificate-Cover-Art_result.webp",
//     rating: 0.379,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 133,
//     title: "The Honeydrippers - Volume 1",
//     format: "CD",
//     genre: "Rock, Blues",
//     price: 15,
//     stock: 4,
//     cover: "images/covers-thumbs/the-honeydrippers-volume-one-front-thumb.jpg",
//     rating: 0.326,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 134,
//     title: "Buddy Guy - Stone Crazy!",
//     format: "CD",
//     genre: "Blues",
//     price: 11,
//     stock: 15,
//     cover: "images/covers-thumbs/buddy-guy-stone-crazy-Cover-Art_result.webp",
//     rating: 0.379,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 135,
//     title: "John Mayer - Continum",
//     format: "Vinyl",
//     genre: "Rock, Other",
//     price: 26,
//     stock: 12,
//     cover: "images/covers-thumbs/john-mayer-continuum-Cover-Art_result.webp",
//     rating: 0.355,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 136,
//     title: "James Brown - Get Up Offa That Thing",
//     format: "Vinyl",
//     genre: "Other",
//     price: 27,
//     stock: 20,
//     cover:
//       "images/covers-thumbs/james-brown-get-up-offa-that-thing-Cover-Art_result.webp",
//     rating: 0.375,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 137,
//     title: "Nick Cave & The Bad Seeds - Let Love In",
//     format: "Vinyl",
//     genre: "Rock, Other",
//     price: 28,
//     stock: 18,
//     cover:
//       "images/covers-thumbs/nick-cave-and-the-bad-seeds-let-love-in-Cover-Art_result.webp",
//     rating: 0.394,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 138,
//     title: "Nirvana - Bleach",
//     format: "CD",
//     genre: "Rock",
//     price: 7,
//     stock: 9,
//     cover: "images/covers-thumbs/nirvana-bleach-Cover-Art_result.webp",
//     rating: 0.355,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 139,
//     title: "Guns n' Roses - Appetite for Destruction",
//     format: "CD",
//     genre: "Rock",
//     price: 9,
//     stock: 20,
//     cover:
//       "images/covers-thumbs/guns--n-roses-appetite-for-destruction_result.webp",
//     rating: 0.344,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 140,
//     title: "Onyx - All We Got Iz Us",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 26,
//     stock: 12,
//     cover: "images/covers-thumbs/onyx-all-we-got-iz-us-Cover-Art_result.webp",
//     rating: 0.375,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 141,
//     title: "Paris - Guerrilla Funk",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 34,
//     stock: 2,
//     cover: "images/covers-thumbs/paris-guerrilla-funk-Cover-Art_result.webp",
//     rating: 0.354,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 142,
//     title: "Dinosaur Jr - Bug",
//     format: "CD",
//     genre: "Rock",
//     price: 12,
//     stock: 7,
//     cover: "images/covers-thumbs/dinosaur-jr-bug-Cover-Art_result.webp",
//     rating: 0.373,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 143,
//     title: "Bill Withers - Just as I Am",
//     format: "Vinyl",
//     genre: "Other",
//     price: 26,
//     stock: 12,
//     cover:
//       "images/covers-thumbs/bill-withers-just-as-i-am-Cover-Art_result.webp",
//     rating: 0.381,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 144,
//     title: "The Roots - Illadelph Halflife",
//     format: "Vinyl",
//     genre: "Hip-Hop",
//     price: 28,
//     stock: 8,
//     cover:
//       "images/covers-thumbs/the-roots-illadelph-halflife-Cover-Art_result.webp",
//     rating: 0.386,
//     boost: 0,
//     bbScore: 0,
//   },
//   {
//     id: 145,
//     title: "Jimmy Smith - Root Down",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 28,
//     stock: 7,
//     cover: "images/covers-thumbs/jimmy-smith-root-down-front-thumb.jpg",
//     rating: 0.394,
//     boost: 0,
//     bbScore: 0,
//   },

//   {
//     id: 146,
//     title: "John Coltrane - Giant Steps",
//     format: "Vinyl",
//     genre: "Jazz",
//     price: 27,
//     stock: 12,
//     cover: "images/covers-thumbs/john-coltrane-giant-steps-front-thumb.jpg",
//     rating: 0.411,
//     boost: 0,
//     bbScore: 0,
//   },
// ];

/////////////////// PAGINATION ///////////////////////

const albumsPerPage = 25;
let currentPage = 1;

function renderAlbums(page, albumList = albums) {
  const albumGrid = document.getElementById("albumGrid");
  albumGrid.innerHTML = "";

  const startIndex = (page - 1) * albumsPerPage;
  const endIndex = startIndex + albumsPerPage;
  const albumsToDisplay = albumList.slice(startIndex, endIndex);

  albumsToDisplay.forEach((album) => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");
    albumCard.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" class="album-cover" />
      <h3 class="album-title">${album.title}</h3>
      <p>Format: ${album.format}</p>
      <p>Genre: ${album.genre}</p>
      <p>Price: €${album.price}</p>
      <p>Available: ${album.stock}</p>

      <div class="album-actions">
 <button class="album-watch-btn ${
   watchedAlbums.includes(album.id) ? "active-watch" : ""
 }">

    Watch
  </button>
  <button class="album-cart-btn ${
    cartAlbums.includes(album.id) ? "active-cart" : ""
  }">

    Cart
  </button>
</div>


    `;

    const watchBtn = albumCard.querySelector(".album-watch-btn");
    watchBtn.addEventListener("click", () => toggleWatch(album.id));

    const cartBtn = albumCard.querySelector(".album-cart-btn");
    cartBtn.addEventListener("click", () => toggleCart(album.id));

    albumGrid.appendChild(albumCard);
  });
}

function renderFilteredAlbums(filtered) {
  const albumGrid = document.getElementById("albumGrid");
  albumGrid.innerHTML = ""; // očisti prethodni prikaz

  filtered.forEach((album) => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");
    albumCard.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" class="album-cover" />
      <h3 class="album-title">${album.title}</h3>
      <p>Format: ${album.format}</p>
      <p>Genre: ${album.genre}</p>
      <p>Price: €${album.price}</p>
      <p>Available: ${album.stock}</p>

      <div class="album-actions">
        <button class="album-watch-btn ${
          watchedAlbums.includes(album.id) ? "active" : ""
        }">👁️</button>
        <button class="album-cart-btn ${
          cartAlbums.includes(album.id) ? "active" : ""
        }">🛒</button>
      </div>
    `;

    const watchBtn = albumCard.querySelector(".album-watch-btn");
    watchBtn.addEventListener("click", () => toggleWatch(album.id));

    const cartBtn = albumCard.querySelector(".album-cart-btn");
    cartBtn.addEventListener("click", () => toggleCart(album.id));

    albumGrid.appendChild(albumCard);
  });
}

function renderGenresFilteredAlbums() {
  const activeGenres = [
    ...document.querySelectorAll(".genres-menu a.active"),
  ].map((link) => link.textContent.trim());

  let filteredAlbums;

  if (activeGenres.includes("All")) {
    filteredAlbums = albums; // prikaz svih ako je "All"
  } else {
    filteredAlbums = albums.filter((album) =>
      activeGenres.some((genre) =>
        album.genre.toLowerCase().includes(genre.toLowerCase())
      )
    );
  }

  renderFilteredAlbums(filteredAlbums);
}

function toggleCart(id) {
  if (cartAlbums.includes(id)) {
    cartAlbums = cartAlbums.filter((item) => item !== id);
  } else {
    cartAlbums.push(id);
  }
  renderAlbums(currentPage, filteredAlbumsGlobal); // koristi trenutno filtrirani prikaz
  updateCartCount();
}
function renderCart() {
  const cartPanel = document.getElementById("cartPanel");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // Ako je korpa prazna:
  if (cartAlbums.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerHTML = "";
    return;
  }

  // Pronađi albume u korpi
  const albumsInCart = albums.filter((album) => cartAlbums.includes(album.id));

  // Prikaz stavki
  cartItems.innerHTML = albumsInCart
    .map(
      (album) => `
    <div class="cart-item">
      <img src="${album.cover}" alt="${album.title}" width="50" />
     <span>${album.title} - ${album.format} — €${album.price}</span>
<button class="remove-btn" data-id="${album.id}"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></button>

    </div>
  `
    )
    .join("");

  // Izračunaj ukupnu cenu
  const total = albumsInCart.reduce((sum, album) => sum + album.price, 0);
  cartTotal.innerHTML = `<strong>Total:</strong> €${total}`;
  const removeButtons = cartItems.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      cartAlbums = cartAlbums.filter((item) => item !== id);
      renderAlbums(currentPage);
      renderCart();
      updateCartCount();
    });
  });
}

function renderWatched() {
  const watchPanel = document.getElementById("watchPanel");
  const watchItems = document.getElementById("watchItems");

  if (watchedAlbums.length === 0) {
    watchItems.innerHTML = "<p>No albums watched yet.</p>";
    return;
  }

  const albumsWatched = albums.filter((album) =>
    watchedAlbums.includes(album.id)
  );

  watchItems.innerHTML = albumsWatched
    .map(
      (album) => `
      <div class="cart-item">
        <img src="${album.cover}" alt="${album.title}" width="50" />
        <span>${album.title} - ${album.format} — €${album.price}</span>
        <button class="remove-btn" data-id="${album.id}"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></button>
      </div>
    `
    )
    .join("");

  const removeButtons = watchItems.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      watchedAlbums = watchedAlbums.filter((item) => item !== id);
      renderAlbums(currentPage);
      renderWatched();
      updateWatchCount();
    });
  });
}
function updateWatchCount() {
  const countSpan = document.getElementById("watchCount");
  const watchIconMain = document.querySelector(".nav-item.watched"); // main-nav
  const watchIconSide = document.querySelector(
    ".mobile-watch-btn .nav-item.watched"
  ); // side-menu

  const count = watchedAlbums.length;
  if (countSpan) {
    countSpan.textContent = count > 0 ? `(${count})` : "";
  }

  [watchIconMain, watchIconSide].forEach((icon) => {
    if (!icon) return;
    if (count > 0) {
      icon.classList.add("icon-active");
    } else {
      icon.classList.remove("icon-active");
    }
  });
}

function updateCartCount() {
  const cartCount = cartAlbums.length;

  const cartIconMain = document.querySelector(".cart-btn .nav-item.cart");
  const cartIconSide = document.querySelector(".mobile-cart-btn svg");

  if (cartIconMain) {
    cartIconMain.classList.toggle("icon-active", cartCount > 0);
  }

  if (cartIconSide) {
    cartIconSide.classList.toggle("icon-active", cartCount > 0);
  }

  const countBadge = document.getElementById("cartCount");
  if (countBadge) {
    countBadge.textContent = cartCount > 0 ? `(${cartCount})` : "";
  }
}

function toggleWatch(id) {
  if (watchedAlbums.includes(id)) {
    watchedAlbums = watchedAlbums.filter((item) => item !== id);
  } else {
    watchedAlbums.push(id);
  }
  renderAlbums(currentPage, filteredAlbumsGlobal);
  // koristi trenutno filtrirani prikaz
  updateWatchCount();
}

/////////////////// PAGINATION ////////////////////////
function setupPagination(albumList = albums) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(albumList.length / albumsPerPage);

  const scrollToAlbumGridTop = () => {
    const albumGrid = document.getElementById("albumGrid");
    const y = albumGrid.getBoundingClientRect().top + window.scrollY - 180; // offset prema sticky nav
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="pagination-icon">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
`;

    prevBtn.addEventListener("click", () => {
      currentPage--;
      renderAlbums(currentPage, albumList);
      setupPagination(albumList);
      scrollToAlbumGridTop();
    });
    paginationContainer.appendChild(prevBtn);
  }

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderAlbums(currentPage, albumList);
      setupPagination(albumList);
      scrollToAlbumGridTop();
    });
    paginationContainer.appendChild(btn);
  }

  if (currentPage < pageCount) {
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="pagination-icon">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
`;

    nextBtn.addEventListener("click", () => {
      currentPage++;
      renderAlbums(currentPage, albumList);
      setupPagination(albumList);
      scrollToAlbumGridTop();
    });
    paginationContainer.appendChild(nextBtn);
  }
}

renderAlbums(currentPage);
setupPagination();

const cartNavBtn = document.querySelector(".cart-btn");

if (cartNavBtn) {
  cartNavBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const panel = document.getElementById("cartPanel");
    panel.classList.toggle("hidden");
    renderCart(); // svaki put kad otvoriš da bude ažurno
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const cartNavBtn = document.querySelector(".cart-btn a");
  const cartPanel = document.getElementById("cartPanel");

  if (cartNavBtn && cartPanel) {
    cartNavBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cartPanel.classList.toggle("hidden");
      renderCart();
    });
  }

  // ✅ Zatvori cartPanel kada se klikne van njega
  document.addEventListener("click", (e) => {
    const isClickInsidePanel = cartPanel.contains(e.target);
    const isClickOnButton = cartNavBtn.contains(e.target);

    if (!isClickInsidePanel && !isClickOnButton) {
      cartPanel.classList.add("hidden");
    }
  });
});

/////////////// poziva fadein za BB /////////////
function handleStickyNav() {
  const header = document.querySelector("header");
  const nav = document.getElementById("mainNav");
  const publisherBar = document.querySelector(".publisher-bar");
  const navLinks = nav.querySelectorAll("a"); // SVI linkovi u nav

  if (window.scrollY > header.offsetHeight - 150) {
    nav.classList.add("sticky");
    publisherBar.classList.add("after-sticky");
    nav.style.opacity = "1";
    nav.style.transform = "translate(-50%, 0)";
    nav.style.transform = "none";

    navLinks.forEach((link) => {
      link.classList.add("fadeInLink");
    });
  } else {
    nav.classList.remove("sticky");
    publisherBar.classList.remove("after-sticky");

    navLinks.forEach((link) => {
      link.classList.remove("fadeInLink");
    });
  }
}
document.addEventListener("DOMContentLoaded", handleStickyNav);
window.addEventListener("scroll", handleStickyNav);

// =======================
// 📌 ABOUT US SEKCIJA
// =======================

const aboutUsBtn = document.querySelector(".about a");
const aboutUsPanel = document.getElementById("aboutUsPanel");
const scrollToShop = document.querySelector(".scroll-to-shop");
const fadeLayer = document.getElementById("aboutFadeLayer");

// Klik na "About Us" dugme
aboutUsBtn.addEventListener("click", (e) => {
  e.preventDefault();

  fadeLayer.classList.remove("hidden");
  setTimeout(() => {
    fadeLayer.classList.add("visible");
  }, 10);

  setTimeout(() => {
    aboutUsPanel.classList.remove("hidden");
    setTimeout(() => {
      aboutUsPanel.classList.add("show");
      // ⏺️ Dodaj wheel i touch event ponovo svaki put kad se otvori
      aboutUsPanel.addEventListener("wheel", closeAboutPanelAndScroll, {
        once: true,
      });
      aboutUsPanel.addEventListener("touchstart", closeAboutPanelAndScroll, {
        once: true,
      });
      // 👇 Space zatvaranje
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.code === "Space") {
            e.preventDefault();
            closeAboutPanelAndScroll();
          }
        },
        { once: true }
      );
    }, 100);
  }, 800);
});

// Klik na "Scroll to Shop -STRELICA NA DOLE" dugme
scrollToShop.addEventListener("click", () => {
  closeAboutPanelAndScroll();
});

// ✅ Klik bilo gde u About Us panelu
aboutUsPanel.addEventListener("click", () => {
  closeAboutPanelAndScroll();
});
// Detekcija točkića miša (desktop)
aboutUsPanel.addEventListener(
  "wheel",
  () => {
    closeAboutPanelAndScroll();
  },
  { once: true }
);

// Detekcija početka swipe-a (mobilni/touchscreen)
aboutUsPanel.addEventListener(
  "touchstart",
  () => {
    closeAboutPanelAndScroll();
  },
  { once: true }
);

// ✅ Zajednička funkcija za zatvaranje i skrol
function closeAboutPanelAndScroll() {
  aboutUsPanel.classList.remove("show");
  fadeLayer.classList.remove("visible");

  setTimeout(() => {
    aboutUsPanel.classList.add("hidden");
    fadeLayer.classList.add("hidden");

    const albumGrid = document.getElementById("albumGrid");
    const yOffset = -350; // prilagodi po osećaju
    const y =
      albumGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, 1200);
}

// =======================
// 📌 CONTACT SEKCIJA
// =======================

const contactBtn = document.querySelector(".contact a");
const contactPanel = document.getElementById("contactPanel");
const contactFadeLayer = document.getElementById("contactFadeLayer");
const contactCloseBtn = contactPanel.querySelector(".scroll-to-shop");

// Klik na "Contact" dugme
contactBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // 1. Fade sloj se prikazuje i počinje zatamnjenje
  contactFadeLayer.classList.remove("hidden");
  setTimeout(() => {
    contactFadeLayer.classList.add("visible");
  }, 10);

  // 2. Sa zakašnjenjem se pojavljuje Contact panel
  setTimeout(() => {
    contactPanel.classList.remove("hidden");

    // 3. Pokreće se fade-in animacija panela
    setTimeout(() => {
      contactPanel.classList.add("show");
      contactPanel.addEventListener("wheel", closeContactPanelAndScroll, {
        once: true,
      });
      contactPanel.addEventListener("touchstart", closeContactPanelAndScroll, {
        once: true,
      });
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.code === "Space") {
            e.preventDefault();
            closeContactPanelAndScroll();
          }
        },
        { once: true }
      );
    }, 100);
  }, 800);
});

// Klik na "Continue to Store" iz Contact panela
contactCloseBtn.addEventListener("click", () => {
  closeContactPanelAndScroll();
});

contactPanel.addEventListener("click", () => {
  closeContactPanelAndScroll();
});

function closeContactPanelAndScroll() {
  contactPanel.classList.remove("show");
  contactFadeLayer.classList.remove("visible");

  setTimeout(() => {
    contactPanel.classList.add("hidden");
    contactFadeLayer.classList.add("hidden");

    const albumGrid = document.getElementById("albumGrid");
    const yOffset = -350; // prilagodi po osećaju
    const y =
      albumGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, 1200);
}

////////////////// BB INTRO SEKCIJA //////////////////////

// =======================
// 📌 BUDGET BUTTON – INTRO PANEL (TYPEWRITER MOD)
// =======================

const bbIntroBtn = document.getElementById("bbIntroBtn");
const bbIntroPanel = document.getElementById("bbIntroPanel");
const bbIntroFadeLayer = document.getElementById("bbIntroFadeLayer");
const bbScrollBtn = document.querySelector("#bbIntroPanel .scroll-to-shop");

if (bbIntroBtn) {
  bbIntroBtn.addEventListener("click", (e) => {
    e.preventDefault();

    bbIntroFadeLayer.classList.remove("hidden");
    setTimeout(() => bbIntroFadeLayer.classList.add("visible"), 10);

    setTimeout(() => {
      bbIntroPanel.classList.remove("hidden");
      setTimeout(() => bbIntroPanel.classList.add("show"), 100);
      // 🌀 RESETUJ ANIMACIJE
      const bbLines = document.querySelectorAll(".bb-line");
      bbLines.forEach((line) => {
        line.style.animation = "none";
        void line.offsetWidth; // 👈 trigger reflow
        line.style.animation = ""; // 👈 pokreni opet
      });
    }, 800);
  });

  bbIntroPanel.addEventListener("click", () => closeBBIntroPanelAndScroll());
  bbScrollBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeBBIntroPanelAndScroll();
  });

  bbIntroPanel.addEventListener("wheel", () => closeBBIntroPanelAndScroll(), {
    once: true,
  });
  bbIntroPanel.addEventListener(
    "touchstart",
    () => closeBBIntroPanelAndScroll(),
    { once: true }
  );
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        closeBBIntroPanelAndScroll();
      }
    },
    { once: true }
  );
}

function closeBBIntroPanelAndScroll() {
  bbIntroPanel.classList.remove("show");
  bbIntroFadeLayer.classList.remove("visible");
  setTimeout(() => {
    bbIntroPanel.classList.add("hidden");
    bbIntroFadeLayer.classList.add("hidden");

    const albumGrid = document.getElementById("albumGrid");
    const y = albumGrid.getBoundingClientRect().top + window.pageYOffset - 350;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, 1200);
}

/////////////////////// FORMATS MENU  /////////////////////////
// 🎯 FORMATS MENU INTERAKCIJA
document.addEventListener("DOMContentLoaded", () => {
  const formatsDropdown = document.querySelector(".formats-dropdown");
  const formatsLinks = formatsDropdown.querySelectorAll(".formats-menu a");
  const formatsToggle = document.querySelector(".formats-toggle");

  // Klik na toggle dugme → otvori ili zatvori dropdown
  formatsToggle.addEventListener("click", (e) => {
    e.preventDefault();

    if (formatsDropdown.classList.contains("keep-open")) {
      formatsDropdown.classList.remove("keep-open");
    } else {
      formatsDropdown.classList.add("keep-open");
    }
  });

  // Klik na stavku u dropdown meniju
  formatsLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Ukloni aktivnu klasu sa svih i dodaj na kliknuti link
      formatsLinks.forEach((el) => el.classList.remove("active"));
      link.classList.add("active");

      // Ažuriraj tekst na dugmetu
      const selectedFormat = link.textContent.trim();
      const formatValue =
        selectedFormat === "All"
          ? "All"
          : selectedFormat === "Vinyls"
          ? "Vinyl"
          : selectedFormat === "CDs"
          ? "CD"
          : "";

      if (formatsToggle) {
        const label = formatsToggle.querySelector(".formats-label");
        if (label) {
          label.textContent =
            formatValue === "All" ? "Formats" : selectedFormat;
        }
      }

      // Zatvori meni
      formatsDropdown.classList.remove("keep-open");

      // Scroll ako si pri vrhu
      if (window.scrollY < 500) {
        document
          .querySelector(".header")
          .scrollIntoView({ behavior: "smooth" });
      }

      // Aktiviraj filtere
      applyCombinedFilters();
    });
  });

  // Klik van menija → uvek zatvori dropdown
  document.addEventListener("click", (e) => {
    if (
      !formatsDropdown.contains(e.target) &&
      !formatsToggle.contains(e.target)
    ) {
      formatsDropdown.classList.remove("keep-open");
    }
  });
});

// 🎯 GENRES MENU INTERAKCIJA
document.addEventListener("DOMContentLoaded", () => {
  const genresDropdown = document.querySelector(".genres-dropdown");
  const genresToggle = document.querySelector(".genres-toggle");
  const genresLinks = genresDropdown.querySelectorAll(".genres-menu a");

  // Klik na toggle → otvori/zatvori meni
  genresToggle.addEventListener("click", (e) => {
    e.preventDefault();
    genresDropdown.classList.toggle("keep-open");
  });

  // Klik na žanrove
  genresLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const selectedGenre = link.textContent.trim();

      if (selectedGenre === "All") {
        genresLinks.forEach((el) => el.classList.remove("active"));
        link.classList.add("active");
      } else {
        link.classList.toggle("active");
        const allLink = [...genresLinks].find(
          (el) => el.textContent.trim() === "All"
        );
        if (allLink) allLink.classList.remove("active");
      }

      const isAnySelected = [...genresLinks].some((el) =>
        el.classList.contains("active")
      );
      if (!isAnySelected) {
        const allLink = [...genresLinks].find(
          (el) => el.textContent.trim() === "All"
        );
        if (allLink) allLink.classList.add("active");
      }

      genresDropdown.classList.remove("keep-open");

      if (window.scrollY < 500) {
        document
          .querySelector(".header")
          .scrollIntoView({ behavior: "smooth" });
      }

      applyCombinedFilters();
      updateGenresToggleText();
    });
  });

  // Klik van menija → zatvori
  document.addEventListener("click", (e) => {
    if (
      !genresDropdown.contains(e.target) &&
      !genresToggle.contains(e.target)
    ) {
      genresDropdown.classList.remove("keep-open");
    }
  });

  // Inicijalni render
  filteredAlbumsGlobal = [...albums];
  renderAlbums(currentPage, filteredAlbumsGlobal);
  setupPagination(filteredAlbumsGlobal);
  updateGenresToggleText();
});

updateGenresToggleText();
document.addEventListener("DOMContentLoaded", () => {
  filteredAlbumsGlobal = [...albums];
  renderAlbums(currentPage, filteredAlbumsGlobal);
  setupPagination(filteredAlbumsGlobal);
});

function applyCombinedFilters() {
  const activeFormatLink = document.querySelector(".formats-menu a.active");
  const selectedFormat = activeFormatLink
    ? activeFormatLink.textContent.trim()
    : "All";

  let formatValue = null;
  if (selectedFormat === "Vinyls") formatValue = "Vinyl";
  else if (selectedFormat === "CDs") formatValue = "CD";

  const activeGenres = [
    ...document.querySelectorAll(".genres-menu a.active"),
  ].map((link) => link.textContent.trim());
  const useAllGenres =
    activeGenres.includes("All") || activeGenres.length === 0;

  const filteredAlbums = albums.filter((album) => {
    const formatMatch = !formatValue || album.format === formatValue;
    const genreMatch =
      useAllGenres ||
      activeGenres.some((genre) =>
        album.genre.toLowerCase().includes(genre.toLowerCase())
      );
    return formatMatch && genreMatch;
  });

  filteredAlbumsGlobal = filteredAlbums;
  currentPage = 1;
  renderAlbums(currentPage, filteredAlbumsGlobal);
  setupPagination(filteredAlbumsGlobal);
  updateGenresToggleText();
}

function updateGenresToggleText() {
  const genresToggle = document.querySelector(".genres-toggle");
  if (!genresToggle) return;

  const labelSpan = genresToggle.querySelector(".genres-label");
  if (!labelSpan) return;

  const activeGenreLinks = document.querySelectorAll(".genres-menu a.active");

  const activeGenres = [...activeGenreLinks]
    .map((link) => link.textContent.trim())
    .filter((text) => text !== "All");

  if (activeGenres.length === 0) {
    labelSpan.textContent = "Genres";
  } else if (activeGenres.length === 1) {
    labelSpan.textContent = activeGenres[0];
  } else if (activeGenres.length === 2) {
    labelSpan.textContent = `${activeGenres[0]}, ${activeGenres[1]}`;
  } else {
    labelSpan.textContent = `${activeGenres.length} genres`;
  }
}

// 🎛️ BUDGET BUTTON – STICKY PANEL ACTIVATION
const bbStickyBtn = document.getElementById("bbStickyBtn");
const bbBudgetPanel = document.getElementById("bbBudgetPanel");
const bbBudgetFadeLayer = document.getElementById("bbBudgetFadeLayer");

if (bbStickyBtn && bbBudgetPanel && bbBudgetFadeLayer) {
  bbStickyBtn.addEventListener("click", (e) => {
    e.preventDefault();

    bbBudgetFadeLayer.classList.remove("hidden");
    setTimeout(() => bbBudgetFadeLayer.classList.add("visible"), 10);

    setTimeout(() => {
      bbBudgetPanel.classList.remove("hidden");
      setTimeout(() => bbBudgetPanel.classList.add("show"), 100);
    }, 300);
  });

  bbBudgetFadeLayer.addEventListener("click", () => closeBBBudgetPanel());
  bbBudgetPanel.addEventListener("click", () => closeBBBudgetPanel());

  document.querySelector(".bb-budget-center").addEventListener("click", (e) => {
    e.stopPropagation();
  });

  function closeBBBudgetPanel() {
    bbBudgetPanel.classList.remove("show");
    bbBudgetFadeLayer.classList.remove("visible");

    setTimeout(() => {
      bbBudgetPanel.classList.add("hidden");
      bbBudgetFadeLayer.classList.add("hidden");
    }, 800);
  }
}

// =====================
// 🔥 BB BUTTON HANDLER (Smoke It! klik)
// =====================

const bbResultsPanel = document.getElementById("bbResultsPanel");
const bbResultsFadeLayer = document.getElementById("bbResultsFadeLayer");
const confirmBudgetBtn = document.getElementById("confirmBudgetBtn");
const budgetInput = document.getElementById("budgetInput");

if (budgetInput) {
  budgetInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmBudgetBtn.click();
    }
  });
}
if (confirmBudgetBtn) {
  confirmBudgetBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // 🔢 Čitanje unetog budžeta i izabranih opcija (Scope / Format / Genre)
    const budget = parseFloat(document.getElementById("budgetInput").value);
    const selectedScope = document.querySelector(
      'input[name="scope"]:checked'
    )?.value;
    const selectedFormat = document.querySelector(
      'input[name="format"]:checked'
    )?.value;
    const selectedGenre = document.querySelector(
      'input[name="genre"]:checked'
    )?.value;

    // 🧭 Mapiranje kombinacije na scenario broj
    let currentScenario = null;

    if (
      selectedScope === "all" &&
      selectedFormat === "all" &&
      selectedGenre === "all"
    ) {
      currentScenario = 1;
    } else if (
      selectedScope === "all" &&
      selectedFormat === "vinyl" &&
      selectedGenre === "all"
    ) {
      currentScenario = 2;
    } else if (
      selectedScope === "all" &&
      selectedFormat === "cd" &&
      selectedGenre === "all"
    ) {
      currentScenario = 3;
    } else if (
      selectedScope === "all" &&
      selectedFormat === "all" &&
      selectedGenre !== "all"
    ) {
      currentScenario = 4;
    } else if (
      selectedScope === "all" &&
      selectedFormat === "vinyl" &&
      selectedGenre !== "all"
    ) {
      currentScenario = 5;
    } else if (
      selectedScope === "all" &&
      selectedFormat === "cd" &&
      selectedGenre !== "all"
    ) {
      currentScenario = 6;
    } else if (
      selectedScope === "watched" &&
      selectedFormat === "all" &&
      selectedGenre === "all"
    ) {
      currentScenario = 7;
    } else if (
      selectedScope === "watched" &&
      selectedFormat === "vinyl" &&
      selectedGenre === "all"
    ) {
      currentScenario = 8;
    } else if (
      selectedScope === "watched" &&
      selectedFormat === "cd" &&
      selectedGenre === "all"
    ) {
      currentScenario = 9;
    } else if (
      selectedScope === "watched" &&
      selectedFormat === "all" &&
      selectedGenre !== "all"
    ) {
      currentScenario = 10;
    } else if (
      selectedScope === "watched" &&
      selectedFormat === "vinyl" &&
      selectedGenre !== "all"
    ) {
      currentScenario = 11;
    } else if (
      selectedScope === "watched" &&
      selectedFormat === "cd" &&
      selectedGenre !== "all"
    ) {
      currentScenario = 12;
    } else {
      console.warn("❌ Nedefinisana kombinacija za scenario.");
    }

    // 📦 Odabir početnog skupa albuma
    const pool = getFilteredPool(
      albums,
      selectedScope,
      selectedGenre,
      watchedAlbums
    );

    const shuffledOnce = [...pool].sort(() => Math.random() - 0.5);
    // pravi shuffle  //
    scenarioAlbumPool = [...shuffledOnce]; // Pamti fiksiran niz za sve predloge

    const filtered = albums.filter((a) =>
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
    );

    // 🔁 Inicijalizacija praćenja broja pojavljivanja po naslovu
    const scenarioUsedTitles = new Map();
    const MAX_OCCURRENCES_PER_TITLE = 2;

    // 🧹 Čišćenje prethodnih rezultata
    function clearBBResults() {
      for (let i = 1; i <= 5; i++) {
        const albumsContainer = document.querySelector(
          `#bbPick${i} .bb-pick-albums`
        );
        const totalDisplay = document.querySelector(`#bbPick${i} .bb-pick-sum`);

        if (albumsContainer) albumsContainer.innerHTML = "";
        if (totalDisplay) totalDisplay.textContent = "0.00";
      }
    }
    ///////////////////////////////////////////////////////////
    // 🧠 Scenario selekcija
    switch (currentScenario) {
      case 1: {
        clearBBResults();
        const pick1 = bbScenario1Pick1(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick2 = bbScenario1Pick2(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick3 = bbScenario1Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick4 = bbScenario1Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );

        // ✅ SMART PICK ako postoji nešto u watched
        const pick5 =
          watchedAlbums.length > 0
            ? bbScenario1SmartPick5(
                albums, // Whole store
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE,
                watchedAlbums
              )
            : bbScenario1Pick5(
                scenarioAlbumPool,
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE
              );

        renderBBScenario1Pick1(pick1);
        renderBBScenario1Pick2(pick2);
        renderBBScenario1Pick3(pick3);
        renderBBScenario1Pick4(pick4);
        renderBBScenario1Pick5(pick5);
        break;
      }

      case 2: {
        clearBBResults();
        const pick1 = bbScenario2Pick1(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick2 = bbScenario2Pick2(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick3 = bbScenario2Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick4 = bbScenario2Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );

        const pick5 =
          watchedAlbums.length > 0
            ? bbScenario2SmartPick5(
                albums, // whole store
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE,
                watchedAlbums
              )
            : bbScenario2Pick5(
                scenarioAlbumPool,
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE
              );

        renderBBScenario2Pick1(pick1);
        renderBBScenario2Pick2(pick2);
        renderBBScenario2Pick3(pick3);
        renderBBScenario2Pick4(pick4);
        renderBBScenario2Pick5(pick5);
        break;
      }

      case 3: {
        clearBBResults();
        const pick1 = bbScenario3Pick1(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick2 = bbScenario3Pick2(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick3 = bbScenario3Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick4 = bbScenario3Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );

        const pick5 =
          watchedAlbums.length > 0
            ? bbScenario3SmartPick5(
                albums,
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE,
                watchedAlbums
              )
            : bbScenario3Pick5(
                scenarioAlbumPool,
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE
              );

        renderBBScenario3Pick1(pick1);
        renderBBScenario3Pick2(pick2);
        renderBBScenario3Pick3(pick3);
        renderBBScenario3Pick4(pick4);
        renderBBScenario3Pick5(pick5);
        break;
      }

      case 4: {
        clearBBResults();
        const pick1 = bbScenario4Pick1(
          shuffledOnce,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario4Pick2(
          shuffledOnce,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick3 = bbScenario4Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick4 = bbScenario4Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick5 =
          watchedAlbums.length > 0
            ? bbScenario4SmartPick5(
                albums,
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE,
                watchedAlbums,
                selectedGenre
              )
            : bbScenario4Pick5(
                scenarioAlbumPool,
                budget,
                scenarioUsedTitles,
                MAX_OCCURRENCES_PER_TITLE,
                selectedGenre
              );

        renderBBScenario4Pick1(pick1);
        renderBBScenario4Pick2(pick2);
        renderBBScenario4Pick3(pick3);
        renderBBScenario4Pick4(pick4);
        renderBBScenario4Pick5(pick5);
        break;
      }

      case 5: {
        clearBBResults();
        const pick1 = bbScenario5Pick1(
          shuffledOnce, ///P1P2-Split-Filter logika///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario5Pick2(
          shuffledOnce, /// P1P2-Split-Filter logika ///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick3 = bbScenario5Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick4 = bbScenario5Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick5 = bbScenario5Pick5(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        renderBBScenario5Pick1(pick1);
        renderBBScenario5Pick2(pick2);
        renderBBScenario5Pick3(pick3);
        renderBBScenario5Pick4(pick4);
        renderBBScenario5Pick5(pick5);
        break;
      }

      case 6: {
        clearBBResults();
        const pick1 = bbScenario6Pick1(
          shuffledOnce, ///P1P2-Split-Filter logika///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario6Pick2(
          shuffledOnce, /// P1P2-Split-Filter logika ///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick3 = bbScenario6Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick4 = bbScenario6Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick5 = bbScenario6Pick5(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        renderBBScenario6Pick1(pick1);
        renderBBScenario6Pick2(pick2);
        renderBBScenario6Pick3(pick3);
        renderBBScenario6Pick4(pick4);
        renderBBScenario6Pick5(pick5);
        break;
      }

      case 7: {
        clearBBResults();
        const pick1 = bbScenario7Pick1(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick2 = bbScenario7Pick2(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick3 = bbScenario7Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE
        );
        const pick4 = bbScenario7Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums // za predloge koji imaju watched a imaju predlog koji koriste filter formats / genre u whole store
        );
        const pick5 = bbScenario7Pick5(
          albums,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums // za predloge koji imaju watched a imaju predlog koji koriste filter formats / genre u whole store
        );

        renderBBScenario7Pick1(pick1);
        renderBBScenario7Pick2(pick2);
        renderBBScenario7Pick3(pick3);
        renderBBScenario7Pick4(pick4);
        renderBBScenario7Pick5(pick5);
        break;
      }
      case 8: {
        clearBBResults();
        const pick1 = bbScenario8Pick1(
          shuffledOnce, ///P1P2-Split-Filter logika///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario8Pick2(
          shuffledOnce, /// P1P2-Split-Filter logika ///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick3 = bbScenario8Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick4 = bbScenario8Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick5 = bbScenario8Pick5(
          albums, // ← celokupan store!,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums // za predloge koji imaju watched a imaju predlog koji koriste filter formats / genre u whole store
        );

        renderBBScenario8Pick1(pick1);
        renderBBScenario8Pick2(pick2);
        renderBBScenario8Pick3(pick3);
        renderBBScenario8Pick4(pick4);
        renderBBScenario8Pick5(pick5);
        break;
      }
      case 9: {
        clearBBResults();
        const pick1 = bbScenario9Pick1(
          shuffledOnce, ///P1P2-Split-Filter logika///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario9Pick2(
          shuffledOnce, /// P1P2-Split-Filter logika ///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick3 = bbScenario9Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick4 = bbScenario9Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick5 = bbScenario9Pick5(
          albums, // ← celokupan store!,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums // za predloge koji imaju watched a imaju predlog koji koriste filter formats / genre u whole store
        );

        renderBBScenario9Pick1(pick1);
        renderBBScenario9Pick2(pick2);
        renderBBScenario9Pick3(pick3);
        renderBBScenario9Pick4(pick4);
        renderBBScenario9Pick5(pick5);
        break;
      }
      case 10: {
        clearBBResults();
        const pick1 = bbScenario10Pick1(
          shuffledOnce, ///P1P2-Split-Filter logika///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario10Pick2(
          shuffledOnce, /// P1P2-Split-Filter logika ///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick3 = bbScenario10Pick3(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick4 = bbScenario10Pick4(
          scenarioAlbumPool,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );
        const pick5 = bbScenario10Pick5(
          albums, // ← celokupan store!,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums, // za predloge koji imaju watched a imaju predlog koji koriste filter formats / genre u whole store
          selectedGenre
        );

        renderBBScenario10Pick1(pick1);
        renderBBScenario10Pick2(pick2);
        renderBBScenario10Pick3(pick3);
        renderBBScenario10Pick4(pick4);
        renderBBScenario10Pick5(pick5);
        break;
      }
      case 11: {
        clearBBResults();

        const pick1 = bbScenario11Pick1(
          shuffledOnce, // ← prva polovina radnje (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario11Pick2(
          shuffledOnce, // ← druga polovina radnje (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick3 = bbScenario11Pick3(
          scenarioAlbumPool, // ← cela radnja
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick4 = bbScenario11Pick4(
          scenarioAlbumPool, // ← cela radnja
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick5 = bbScenario11Pick5(
          albums, // ← cela prodavnica
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre // koristi se za filtriranje po žanru
        );

        renderBBScenario11Pick1(pick1);
        renderBBScenario11Pick2(pick2);
        renderBBScenario11Pick3(pick3);
        renderBBScenario11Pick4(pick4);
        renderBBScenario11Pick5(pick5);

        break;
      }
      case 12: {
        clearBBResults();

        const pick1 = bbScenario12Pick1(
          shuffledOnce, // ← prva polovina radnje (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario12Pick2(
          shuffledOnce, // ← druga polovina radnje (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick3 = bbScenario12Pick3(
          scenarioAlbumPool, // ← cela radnja
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick4 = bbScenario12Pick4(
          scenarioAlbumPool, // ← cela radnja
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick5 = bbScenario12Pick5(
          albums, // ← cela prodavnica
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre // koristi se za filtriranje po žanru
        );

        renderBBScenario12Pick1(pick1);
        renderBBScenario12Pick2(pick2);
        renderBBScenario12Pick3(pick3);
        renderBBScenario12Pick4(pick4);
        renderBBScenario12Pick5(pick5);

        break;
      }

      default:
        console.warn("⚠️ Scenario nije prepoznat ili nije još implementiran.");
    }

    // 📤 Prikaz rezultata
    openBBResultsPanel();
  });
}

// Funkcija za otvaranje panela (pozivaće se kad završimo obradu budžeta)
function openBBResultsPanel() {
  if (!bbResultsPanel || !bbResultsFadeLayer) return;

  // Fade sloj
  bbResultsFadeLayer.classList.remove("hidden");
  setTimeout(() => {
    bbResultsFadeLayer.classList.add("visible");
  }, 10);

  // Panel
  setTimeout(() => {
    bbResultsPanel.classList.remove("hidden");
    setTimeout(() => {
      bbResultsPanel.classList.add("show");
    }, 100);
  }, 300);
}

// Funkcija za zatvaranje (klik na pozadinu ili escape)
// Funkcija za zatvaranje BB Results panela
function closeBBResultsPanel() {
  const bbResultsPanel = document.getElementById("bbResultsPanel");
  const bbResultsFadeLayer = document.getElementById("bbResultsFadeLayer");
  const bbResultsGrid = document.getElementById("bbResultsGrid");
  const bbBudgetPanel = document.getElementById("bbBudgetPanel");
  const bbBudgetFadeLayer = document.getElementById("bbBudgetFadeLayer");
  const albumGrid = document.getElementById("albumGrid");
  const header = document.querySelector(".header");

  if (!bbResultsPanel || !bbResultsFadeLayer) return;

  // ⏹️ Zatvori odmah oba panela (bez animacije)
  bbBudgetPanel?.classList.remove("show");
  bbBudgetFadeLayer?.classList.remove("visible");
  bbResultsPanel.classList.remove("show");
  bbResultsFadeLayer.classList.remove("visible");

  // 🧹 Posle 1s očisti sve i skroluj nazad
  setTimeout(() => {
    bbResultsPanel.classList.add("hidden");
    bbResultsFadeLayer.classList.add("hidden");
    bbBudgetPanel?.classList.add("hidden");
    bbBudgetFadeLayer?.classList.add("hidden");

    // bbResultsGrid.innerHTML = "";

    // 🧭 Skroluj do albumGrid sa sticky offsetom
    const offset = 550; // koristi istu vrednost kao za intro
    const y =
      albumGrid.getBoundingClientRect().top +
      window.pageYOffset -
      header.offsetHeight +
      offset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }, 1000);
}

// Dodavanje event listener-a za X dugme (izvan funkcije)
const closeBBResultsBtn = document.getElementById("closeBBResultsBtn");
if (closeBBResultsBtn) {
  closeBBResultsBtn.addEventListener("click", closeBBResultsPanel);
}

function calculateBBScore(
  album,
  selectedScope,
  selectedFormat,
  selectedGenre,
  budget
) {
  let score = 0;
  console.log(`💡 Calculating BB score for: ${album.title}`);

  // 1️⃣ SCOPE

  // 2️⃣ FORMAT
  if (selectedFormat === "vinyl") {
    score += 1.1;
  } else if (selectedFormat === "cd") {
    score += 0.84;
  } else {
    // All formats selektovan → obradi format ručno
    score += album.format.toLowerCase() === "vinyl" ? 1.04 : 0.84;
  }

  // 3️⃣ GENRE

  let genrePoints = 1.0; // F - default za "all"

  if (selectedGenre !== "all") {
    const albumGenres = album.genre
      .toLowerCase()
      .split(",")
      .map((g) => g.trim().replace(/[\s-]/g, "")); // npr: "hip hop" → "hiphop"

    const cleanedSelected = selectedGenre.toLowerCase().replace(/[\s-]/g, "");
    //// Bonus izbora po zanru. ako izaberes rock, svi rock albumi u startu imaju 1.23////
    if (albumGenres.includes(cleanedSelected)) {
      genrePoints = 1.23; // G
    } else {
      genrePoints = 0; // nije poklapanje
    }
  }

  score += genrePoints;

  // 4️⃣ STOCK
  const stock = album.stock;
  if (stock > 30) score += 0.0;
  else if (stock > 19) score += 0.2;
  else if (stock > 9) score += 0.4;
  else if (stock > 3) score += 0.6;
  else if (stock >= 1) score += 0.9;

  // 5️⃣ PRICE
  const price = album.price;
  if (price > 30) score += 0.32;
  else if (price > 19) score += 0.33;
  else if (price > 9) score += 0.34;
  else score += 0.35; // P (<10)

  // 6️⃣ BOOST
  score += album.boost ?? 0;
  // 🔁 SCOPE MULTIPLIKATOR PO ALBUMU KADA SU WATCHED
  const scopeMultiplier = watchedAlbums.includes(album.id) ? 1.3 : 1.0;
  score *= scopeMultiplier;
  console.log(
    `▶️ ${album.title} → price: ${album.price}, stock: ${
      album.stock
    }, score: ${score.toFixed(2)}`
  );

  return score;
}
function renderBBResults(results) {
  if (results.length === 0) {
    console.warn("🚨 Nema albuma koji ispunjavaju sve kriterijume!");
  }

  const grid = document.getElementById("bbResultsGrid");
  grid.innerHTML = "";

  if (results.length === 0) {
    grid.innerHTML =
      "<p style='color:white; text-align:center;'>No albums found for this budget.</p>";
    return;
  }

  results.forEach((album) => {
    const card = document.createElement("div");
    card.classList.add("bb-results-card");

    card.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <h4>${album.title}</h4>
      <p>${album.format} • ${album.genre}</p>
      <p class="price">$${album.price}</p>
      <p>In stock: ${album.stock}</p>
    `;

    grid.appendChild(card);
  });
}

// =====================
// 🔥 processBBResults() – centralna logika za prikaz BB scenarija
// =====================
function processBBResults() {
  const budget = parseFloat(document.getElementById("budgetInput").value);

  // 🔁 Ograničenje broja pojavljivanja istog albuma u jednom scenariju
  const MAX_OCCURRENCES_PER_TITLE = 2;
  // const scenarioUsedTitles = new Map();

  // ❌ Zatvori Budget Panel i Fade Layer ako su još uvek aktivni
  document.getElementById("bbBudgetFadeLayer")?.classList.add("hidden");
  document.getElementById("bbBudgetFadeLayer")?.classList.remove("visible");
  document.getElementById("bbBudgetPanel")?.classList.add("hidden");
  document.getElementById("bbBudgetPanel")?.classList.remove("show");

  const scope = document.querySelector('input[name="scope"]:checked').value;
  const format = document.querySelector('input[name="format"]:checked').value;
  const genre = document.querySelector('input[name="genre"]:checked').value;

  const sourceAlbums =
    scope === "watched"
      ? albums.filter((a) => watchedAlbums.includes(a.id))
      : albums;

  openBBResultsPanel();
}

/////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////  Ubacivanje u 5 BB kartica   ///////////////

//////////////////////////////////////////////////
function renderBBScenario1Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}

function renderBBScenario1Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}

function renderBBScenario1Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}

function renderBBScenario1Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}

function renderBBScenario1Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario2Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario2Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario2Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario2Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario2Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario3Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario3Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario3Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario3Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario3Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario4Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario4Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario4Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario4Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario4Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario5Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario5Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario5Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario5Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario5Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario6Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario6Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario6Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario6Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario6Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario7Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario7Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario7Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario7Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario7Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario8Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario8Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario8Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario8Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario8Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario9Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario9Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario9Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario9Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario9Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario10Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario10Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario10Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario10Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario10Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario11Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario11Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario11Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario11Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario11Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario12Pick1(albums) {
  const container = document.querySelector("#bbPick1 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick1 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario12Pick2(albums) {
  const container = document.querySelector("#bbPick2 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick2 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario12Pick3(albums) {
  const container = document.querySelector("#bbPick3 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick3 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario12Pick4(albums) {
  const container = document.querySelector("#bbPick4 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick4 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function renderBBScenario12Pick5(albums) {
  const container = document.querySelector("#bbPick5 .bb-pick-albums");
  const totalDisplay = document.querySelector("#bbPick5 .bb-pick-sum");

  container.innerHTML = "";
  let total = 0;

  albums.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("bb-pick-album");

    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" />
      <div class="bb-pick-info">
        <span><strong>${album.title}</strong></span>
        <span>${album.format} • ${album.genre}</span>
        <span>$${album.price} • ${album.stock} in stock</span>
      </div>
    `;

    container.appendChild(albumDiv);
    total += album.price;
  });

  totalDisplay.textContent = total.toFixed(2);
}
///////////////////////////////////////////////////
//////////////////////////////////////////////////
////////////      FORMULE    ///////////////////////

// SCENARIO 1 / PICK  1
// WHERE: Whole store / All formats / All genres
// METHOD: PRF (alternating Vinyl/CD, sorted by rating DESC)

function bbScenario1Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  // Priprema odvojenih i sortiranih lista po formatu
  const vinylsByRating = albums
    .filter(
      (a) => a.format.toLowerCase() === "vinyl" && typeof a.rating === "number"
    )
    .sort((a, b) => b.rating - a.rating);

  const cdsByRating = albums
    .filter(
      (a) => a.format.toLowerCase() === "cd" && typeof a.rating === "number"
    )
    .sort((a, b) => b.rating - a.rating);

  const selected = [];
  const usedTitles = new Set(); // samo za ovaj predlog
  let total = 0;
  let vIndex = 0;
  let cIndex = 0;

  while (vIndex < vinylsByRating.length || cIndex < cdsByRating.length) {
    // 1. VINYL pokušaj
    while (vIndex < vinylsByRating.length) {
      const vinyl = vinylsByRating[vIndex];
      vIndex++;

      const alreadyUsed = scenarioUsedTitles.get(vinyl.title) || 0;

      if (
        !usedTitles.has(vinyl.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + vinyl.price <= budget
      ) {
        selected.push(vinyl);
        usedTitles.add(vinyl.title);
        scenarioUsedTitles.set(vinyl.title, alreadyUsed + 1);
        total += vinyl.price;
        break; // uzmi jedan vinil pa idi na CD
      }
    }

    // 2. CD pokušaj
    while (cIndex < cdsByRating.length) {
      const cd = cdsByRating[cIndex];
      cIndex++;

      const alreadyUsed = scenarioUsedTitles.get(cd.title) || 0;

      if (
        !usedTitles.has(cd.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + cd.price <= budget
      ) {
        selected.push(cd);
        usedTitles.add(cd.title);
        scenarioUsedTitles.set(cd.title, alreadyUsed + 1);
        total += cd.price;
        break; // uzmi jedan CD pa idi na sledeći ciklus
      }
    }
  }

  return selected;
}

// SCENARIO 1 / PREDLOG 2
// WHERE: Whole store / All formats / All genres
// METHOD: PRF (alternating Vinyl/CD, sorted by LOWEST stock)

function bbScenario1Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  // Priprema vinila i diskova sortiranih po najmanjem stocku
  const vinylsByStock = albums
    .filter((a) => a.format.toLowerCase() === "vinyl" && a.stock > 0)
    .sort((a, b) => a.stock - b.stock);

  const cdsByStock = albums
    .filter((a) => a.format.toLowerCase() === "cd" && a.stock > 0)
    .sort((a, b) => a.stock - b.stock);

  const selected = [];
  const usedTitles = new Set(); // samo za ovaj predlog
  let total = 0;
  let vIndex = 0;
  let cIndex = 0;

  while (vIndex < vinylsByStock.length || cIndex < cdsByStock.length) {
    // 1. VINYL pokušaj
    while (vIndex < vinylsByStock.length) {
      const vinyl = vinylsByStock[vIndex];
      vIndex++;

      const alreadyUsed = scenarioUsedTitles.get(vinyl.title) || 0;

      if (
        !usedTitles.has(vinyl.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + vinyl.price <= budget
      ) {
        selected.push(vinyl);
        usedTitles.add(vinyl.title);
        scenarioUsedTitles.set(vinyl.title, alreadyUsed + 1);
        total += vinyl.price;
        break; // pređi na CD
      }
    }

    // 2. CD pokušaj
    while (cIndex < cdsByStock.length) {
      const cd = cdsByStock[cIndex];
      cIndex++;

      const alreadyUsed = scenarioUsedTitles.get(cd.title) || 0;

      if (
        !usedTitles.has(cd.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + cd.price <= budget
      ) {
        selected.push(cd);
        usedTitles.add(cd.title);
        scenarioUsedTitles.set(cd.title, alreadyUsed + 1);
        total += cd.price;
        break; // pređi na sledeći ciklus
      }
    }
  }

  return selected;
}

// SCENARIO 1 / PREDLOG 3
// WHERE: Whole store / All formats / All genres
// METHOD: SCORING (scoring, first half of the store)///
function bbScenario1Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  // Uzimamo samo prvu polovinu albuma
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  // Računanje BB score-a
  const scored = firstHalf
    .map((album) => {
      const score = calculateBBScore(album, "all", "all", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set(); // lokalna kontrola duplikata u predlogu
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 1 / PREDLOG 4
// WHERE: Whole store / All formats / All genres
// METHOD: SCORING (scoring, second half of the store)///
function bbScenario1Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  // Uzimamo samo drugu polovinu albuma
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  // Računanje BB score-a
  const scored = secondHalf
    .map((album) => {
      const score = calculateBBScore(album, "all", "all", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set(); // lokalna kontrola duplikata u predlogu
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 1 / SMART PICK 5
// WHERE: Whole store / All formats / All genres
// METHOD: PRF (Dominant Genre Filter → Whole store → Scoring by BB score)
// Ako je nerešeno – ide random genre iz watched liste

function bbScenario1SmartPick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  // ✅ Provera watched liste
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu žanra.");
    return [];
  }

  // 🔍 Analiza žanrova iz watched
  const genreCount = {};
  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album?.genre) {
      album.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .forEach((g) => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
    }
  });

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  if (sortedGenres.length === 0) {
    console.warn("🚫 Nema pronađenih žanrova.");
    return [];
  }

  const topCount = sortedGenres[0][1];
  const topGenres = sortedGenres
    .filter(([_, count]) => count === topCount)
    .map(([g]) => g);
  const dominantGenre =
    topGenres.length === 1
      ? topGenres[0]
      : topGenres[Math.floor(Math.random() * topGenres.length)];

  // 🎯 Filter: ceo store + svi formati + dominantni žanr
  const filtered = albums
    .filter(
      (a) =>
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(dominantGenre.toLowerCase()) &&
        a.price <= budget
    )
    .map((album) => ({
      ...album,
      bbScore: calculateBBScore(
        album,
        "all",
        album.format.toLowerCase(),
        dominantGenre,
        budget
      ),
    }))
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 1 / PICK 5
// WHERE: Whole store / All formats / All genres
// METHOD: PRF (sorted by: higher rating → lower stock→ lower price)
function bbScenario1Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  // 🎯 Filtriraj sve koji imaju rejting i staju u budžet
  const sorted = albums
    .filter((a) => typeof a.rating === "number" && a.price <= budget)
    .sort((a, b) => {
      // 1. Najviši rejting
      if (a.rating !== b.rating) return b.rating - a.rating;

      // 2. Najmanji stock
      if (a.stock !== b.stock) return a.stock - b.stock;

      // 3. Najniža cena
      return a.price - b.price;
    });

  const selected = [];
  const usedTitles = new Set(); // lokalna kontrola duplikata
  let total = 0;

  for (const album of sorted) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 2 / PICK 1
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario2Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const vinyls = albums.filter((a) => a.format.toLowerCase() === "vinyl");
  const halfway = Math.ceil(vinyls.length / 2);
  const firstHalf = vinyls.slice(0, halfway);

  const scored = firstHalf
    .map((album) => {
      const score = calculateBBScore(album, "whole", "vinyl", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 2 / PICK 2
// METHOD: SCORING (pure scoring, second half of the store)
function bbScenario2Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const vinyls = albums.filter((a) => a.format.toLowerCase() === "vinyl");
  const halfway = Math.ceil(vinyls.length / 2);
  const secondHalf = vinyls.slice(halfway);

  const scored = secondHalf
    .map((album) => {
      const score = calculateBBScore(album, "whole", "vinyl", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 2 / PICK 3
// WHERE: Whole store / Vinyls / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar bbscore)
function bbScenario2Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const vinyls = albums.filter((a) => a.format.toLowerCase() === "vinyl");
  const tercileSize = Math.ceil(vinyls.length / 3);

  const first = vinyls.slice(0, tercileSize);
  const second = vinyls.slice(tercileSize, 2 * tercileSize);
  const third = vinyls.slice(2 * tercileSize);

  const allScored = [first, second, third].map((group, i) =>
    group
      .map((album) => {
        const score = calculateBBScore(album, "whole", "vinyl", "all", budget);
        return { ...album, bbScore: score };
      })
      .sort((a, b) => b.bbScore - a.bbScore)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allScored[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 2 / PICK 4
// WHERE: Whole store / Vinyls / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar price)
function bbScenario2Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const vinyls = albums.filter((a) => a.format.toLowerCase() === "vinyl");
  const tercileSize = Math.ceil(vinyls.length / 3);

  const first = vinyls.slice(0, tercileSize);
  const second = vinyls.slice(tercileSize, 2 * tercileSize);
  const third = vinyls.slice(2 * tercileSize);

  const allSorted = [first, second, third].map((group, i) =>
    group.filter((a) => a.price <= budget).sort((a, b) => a.price - b.price)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allSorted[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 2 / SMART PICK 5
// WHERE: Whole store / Vinyls / All genres
// METHOD: PRF (Dominant Genre Filter → Whole store → Vinyls → Scoring by BB score)
// Ako je genre nerešeno – ide random genre iz watched liste

function bbScenario2SmartPick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu žanra.");
    return [];
  }

  const genreCount = {};
  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album?.genre) {
      album.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .forEach((g) => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
    }
  });

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  if (sortedGenres.length === 0) return [];

  const topCount = sortedGenres[0][1];
  const topGenres = sortedGenres
    .filter(([_, count]) => count === topCount)
    .map(([g]) => g);

  const dominantGenre =
    topGenres.length === 1
      ? topGenres[0]
      : topGenres[Math.floor(Math.random() * topGenres.length)];

  // 🎯 Filter: ceo store → samo vinyl + dominantni žanr
  const filtered = albums
    .filter(
      (a) =>
        a.format?.toLowerCase() === "vinyl" &&
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(dominantGenre.toLowerCase()) &&
        a.price <= budget
    )
    .map((album) => ({
      ...album,
      bbScore: calculateBBScore(album, "all", "vinyl", dominantGenre, budget),
    }))
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 2 / PICK 5
// WHERE: Whole store / Vinyls / All genres
// METHOD: PRF (stock → price → rating)
function bbScenario2Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const filtered = albums
    .filter(
      (a) =>
        a.format.toLowerCase() === "vinyl" && a.stock > 0 && a.price <= budget
    )
    .sort((a, b) => {
      // 1. Najmanji stock
      if (a.stock !== b.stock) return a.stock - b.stock;
      // 2. Najniža cena
      if (a.price !== b.price) return a.price - b.price;
      // 3. Najveći rating
      return (b.rating || 0) - (a.rating || 0);
    });

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 3 / PICK 1
// WHERE: Whole store / CDs / All genres
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario3Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const cds = albums.filter((a) => a.format.toLowerCase() === "cd");
  const halfway = Math.ceil(cds.length / 2);
  const firstHalf = cds.slice(0, halfway);

  const scored = firstHalf
    .map((album) => {
      const score = calculateBBScore(album, "whole", "cd", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 3 / PICK 2
// WHERE: Whole store / CDs / All genres
// METHOD: SCORING (pure scoring, second half of the store)
function bbScenario3Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const cds = albums.filter((a) => a.format.toLowerCase() === "cd");
  const halfway = Math.ceil(cds.length / 2);
  const secondHalf = cds.slice(halfway);

  const scored = secondHalf
    .map((album) => {
      const score = calculateBBScore(album, "whole", "cd", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 3 / PICK 3
// WHERE: Whole store / CDs / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar bbscore)
function bbScenario3Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const cds = albums.filter((a) => a.format.toLowerCase() === "cd");
  const tercileSize = Math.ceil(cds.length / 3);

  const first = cds.slice(0, tercileSize);
  const second = cds.slice(tercileSize, 2 * tercileSize);
  const third = cds.slice(2 * tercileSize);

  const allScored = [first, second, third].map((group, i) =>
    group
      .map((album) => {
        const score = calculateBBScore(album, "whole", "cd", "all", budget);
        return { ...album, bbScore: score };
      })
      .sort((a, b) => b.bbScore - a.bbScore)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allScored[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 3 / PICK 4
// WHERE: Whole store / CDs / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar price)
function bbScenario3Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const cds = albums.filter((a) => a.format.toLowerCase() === "cd");
  const tercileSize = Math.ceil(cds.length / 3);

  const first = cds.slice(0, tercileSize);
  const second = cds.slice(tercileSize, 2 * tercileSize);
  const third = cds.slice(2 * tercileSize);

  const allSorted = [first, second, third].map((group, i) =>
    group.filter((a) => a.price <= budget).sort((a, b) => a.price - b.price)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allSorted[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 3 / SMART PICK 5
// WHERE: Whole store / CDs / All genres
// METHOD: PRF (Dominant Genre Filter → Whole store → CDs → Scoring by BB score)

function bbScenario3SmartPick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu žanra.");
    return [];
  }

  // 🔍 Analiza žanrova iz watched
  const genreCount = {};
  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album?.genre) {
      album.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .forEach((g) => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
    }
  });

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  if (sortedGenres.length === 0) return [];

  const topCount = sortedGenres[0][1];
  const topGenres = sortedGenres
    .filter(([_, count]) => count === topCount)
    .map(([g]) => g);

  const dominantGenre =
    topGenres.length === 1
      ? topGenres[0]
      : topGenres[Math.floor(Math.random() * topGenres.length)];

  // 🎯 Filter: ceo store → samo CD + dominantni žanr
  const filtered = albums
    .filter(
      (a) =>
        a.format?.toLowerCase() === "cd" &&
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(dominantGenre.toLowerCase()) &&
        a.price <= budget
    )
    .map((album) => ({
      ...album,
      bbScore: calculateBBScore(album, "all", "cd", dominantGenre, budget),
    }))
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 3 / PICK 5
// WHERE: Whole store / CDs / All genres
// METHOD: PRF (stock → price → rating)
function bbScenario3Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const filtered = albums
    .filter(
      (a) => a.format.toLowerCase() === "cd" && a.stock > 0 && a.price <= budget
    )
    .sort((a, b) => {
      if (a.stock !== b.stock) return a.stock - b.stock;
      if (a.price !== b.price) return a.price - b.price;
      return (b.rating || 0) - (a.rating || 0);
    });

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 4 / PICK 1 /
// WHERE: Whole store / All formats / Chosen genre /
// METHOD: SCORING (pure scoring, first half of the store) /
function bbScenario4Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  const scored = firstHalf
    .map((album) => {
      const score = calculateBBScore(
        album,
        "whole",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 4 / PICK 2 /
// WHERE: Whole store / All formats / Chosen genre /
// METHOD: SCORING (pure scoring, second half of the store, sa filtriranjem duplikata) /
function bbScenario4Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  // ❗ Isključi naslove koji su već bili korišćeni u prethodnim Pickovima
  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  const filteredSecondHalf = secondHalf.filter(
    (album) => !titlesAlreadyUsedInPreviousPicks.has(album.title)
  );

  // 🔢 Računanje bbScore za preostale albume
  const scored = filteredSecondHalf
    .map((album) => {
      const score = calculateBBScore(
        album,
        "whole",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set(); // lokalna provera unutar ovog picka
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 4 / PICK 3 /
// WHERE: Whole store / All formats / Chosen genre /
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar bbscore) /
function bbScenario4Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreAlbums = albums.filter(
    (a) =>
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );
  const tercileSize = Math.ceil(genreAlbums.length / 3);

  const first = genreAlbums.slice(0, tercileSize);
  const second = genreAlbums.slice(tercileSize, 2 * tercileSize);
  const third = genreAlbums.slice(2 * tercileSize);

  const allScored = [first, second, third].map((group) =>
    group
      .map((album) => {
        const score = calculateBBScore(
          album,
          "whole",
          album.format.toLowerCase(),
          selectedGenre,
          budget
        );
        return { ...album, bbScore: score };
      })
      .sort((a, b) => b.bbScore - a.bbScore)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allScored[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 4 / PICK 4 /
// WHERE: Whole store / All formats / Chosen genre /
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar price) /
function bbScenario4Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreAlbums = albums.filter(
    (a) =>
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );
  const tercileSize = Math.ceil(genreAlbums.length / 3);

  const first = genreAlbums.slice(0, tercileSize);
  const second = genreAlbums.slice(tercileSize, 2 * tercileSize);
  const third = genreAlbums.slice(2 * tercileSize);

  const allSorted = [first, second, third].map((group) =>
    group.filter((a) => a.price <= budget).sort((a, b) => a.price - b.price)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allSorted[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 4 / SMART PICK 5
// WHERE: Whole store / All formats / Chosen genre
// METHOD: PRF (Dominant Format Filter → Whole store → Genre → BB score)

function bbScenario4SmartPick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums,
  selectedGenre
) {
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu formata.");
    return [];
  }

  // 🔍 Analiza formata iz watched
  const formatCount = {};
  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album?.format) {
      const format = album.format.toLowerCase();
      formatCount[format] = (formatCount[format] || 0) + 1;
    }
  });

  const sortedFormats = Object.entries(formatCount).sort((a, b) => b[1] - a[1]);
  if (sortedFormats.length === 0) return [];

  const topCount = sortedFormats[0][1];
  const topFormats = sortedFormats
    .filter(([_, count]) => count === topCount)
    .map(([f]) => f);

  const dominantFormat =
    topFormats.length === 1
      ? topFormats[0]
      : topFormats[Math.floor(Math.random() * topFormats.length)];

  // 🎯 Filter: ceo store → samo dominantni format + izabrani žanr
  const filtered = albums
    .filter(
      (a) =>
        a.format?.toLowerCase() === dominantFormat &&
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
        a.price <= budget
    )
    .map((album) => ({
      ...album,
      bbScore: calculateBBScore(
        album,
        "all",
        dominantFormat,
        selectedGenre,
        budget
      ),
    }))
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 4 / PICK 5 /
// WHERE: Whole store / All formats / Chosen genre /
// METHOD: PRF (stock → price → rating) /
function bbScenario4Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const filtered = albums
    .filter(
      (a) =>
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
        a.stock > 0 &&
        a.price <= budget
    )
    .sort((a, b) => {
      if (a.stock !== b.stock) return a.stock - b.stock;
      if (a.price !== b.price) return a.price - b.price;
      return (b.rating || 0) - (a.rating || 0);
    });

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 5 / PICK 1 /
// WHERE: Whole store / Vinyls / Chosen genre /
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario5Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  // Filter po format i zanr
  const filtered = firstHalf.filter(
    (a) =>
      a.format.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "whole",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 5 / PICK 2 /
// WHERE: Whole store / Vinyls / Chosen genre /
// METHOD: SCORING (pure scoring, second half of the store, sa filtriranjem duplikata)
function bbScenario5Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  // Filter po format i zanr
  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  const filteredSecondHalf = secondHalf.filter(
    (a) =>
      a.format.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      !titlesAlreadyUsedInPreviousPicks.has(a.title)
  );

  const scored = filteredSecondHalf
    .map((album) => {
      const score = calculateBBScore(
        album,
        "whole",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 5 / PICK 3 /
// WHERE: Whole store / Vinyls / Chosen genre /
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest stock)
function bbScenario5Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreVinylAlbums = albums.filter(
    (a) =>
      a.format.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const sortedByStock = [...genreVinylAlbums].sort((a, b) => a.stock - b.stock);
  const tercileSize = Math.ceil(sortedByStock.length / 3);

  const first = sortedByStock.slice(0, tercileSize);
  const second = sortedByStock.slice(tercileSize, 2 * tercileSize);
  const third = sortedByStock.slice(2 * tercileSize);

  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 5 / PICK 4 /
// WHERE: Whole store / Vinyls / Chosen genre /
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar bbscore)
function bbScenario5Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreVinylAlbums = albums.filter(
    (a) =>
      a.format.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const tercileSize = Math.ceil(genreVinylAlbums.length / 3);
  const first = genreVinylAlbums.slice(0, tercileSize);
  const second = genreVinylAlbums.slice(tercileSize, 2 * tercileSize);
  const third = genreVinylAlbums.slice(2 * tercileSize);

  const allScored = [first, second, third].map((group) =>
    group
      .map((album) => {
        const score = calculateBBScore(
          album,
          "whole",
          album.format.toLowerCase(),
          selectedGenre,
          budget
        );
        return { ...album, bbScore: score };
      })
      .sort((a, b) => b.bbScore - a.bbScore)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allScored[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 5 / PICK 5 /
// WHERE: Whole store / Vinyls / Chosen genre /
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest price)
function bbScenario5Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreVinylAlbums = albums.filter(
    (a) =>
      a.format.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const tercileSize = Math.ceil(genreVinylAlbums.length / 3);
  const first = genreVinylAlbums.slice(0, tercileSize);
  const second = genreVinylAlbums.slice(tercileSize, 2 * tercileSize);
  const third = genreVinylAlbums.slice(2 * tercileSize);

  const allSorted = [first, second, third].map((group) =>
    group.filter((a) => a.price <= budget).sort((a, b) => a.price - b.price)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allSorted[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 6 / PICK 1
// WHERE: Whole store / CDs / Chosen genre
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario6Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  const filtered = firstHalf.filter(
    (a) =>
      a.format.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "whole",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 6 / PICK 2
// WHERE: Whole store / CDs / Chosen genre
// METHOD: SCORING (pure scoring, second half of the store, sa filtriranjem duplikata)
function bbScenario6Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  const filteredSecondHalf = secondHalf.filter(
    (a) =>
      a.format.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      !titlesAlreadyUsedInPreviousPicks.has(a.title)
  );

  const scored = filteredSecondHalf
    .map((album) => {
      const score = calculateBBScore(
        album,
        "whole",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 6 / PICK 3
// WHERE: Whole store / CDs / Chosen genre
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest stock)
function bbScenario6Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreCDAlbums = albums.filter(
    (a) =>
      a.format.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const sortedByStock = [...genreCDAlbums].sort((a, b) => a.stock - b.stock);
  const tercileSize = Math.ceil(sortedByStock.length / 3);

  const first = sortedByStock.slice(0, tercileSize);
  const second = sortedByStock.slice(tercileSize, 2 * tercileSize);
  const third = sortedByStock.slice(2 * tercileSize);

  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 6 / PICK 4
// WHERE: Whole store / CDs / Chosen genre
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar bbscore)
function bbScenario6Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreCDAlbums = albums.filter(
    (a) =>
      a.format.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const tercileSize = Math.ceil(genreCDAlbums.length / 3);
  const first = genreCDAlbums.slice(0, tercileSize);
  const second = genreCDAlbums.slice(tercileSize, 2 * tercileSize);
  const third = genreCDAlbums.slice(2 * tercileSize);

  const allScored = [first, second, third].map((group) =>
    group
      .map((album) => {
        const score = calculateBBScore(
          album,
          "whole",
          album.format.toLowerCase(),
          selectedGenre,
          budget
        );
        return { ...album, bbScore: score };
      })
      .sort((a, b) => b.bbScore - a.bbScore)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allScored[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 6 / PICK 5
// WHERE: Whole store / CDs / Chosen genre
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest price)
function bbScenario6Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const genreCDAlbums = albums.filter(
    (a) =>
      a.format.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  const tercileSize = Math.ceil(genreCDAlbums.length / 3);
  const first = genreCDAlbums.slice(0, tercileSize);
  const second = genreCDAlbums.slice(tercileSize, 2 * tercileSize);
  const third = genreCDAlbums.slice(2 * tercileSize);

  const allSorted = [first, second, third].map((group) =>
    group.filter((a) => a.price <= budget).sort((a, b) => a.price - b.price)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allSorted[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 7 / PICK 1
// WHERE: Watched / All formats / All genres
// METHOD: METHOD: PRF (Scoring cycle: 1st → 2nd → 3rd → bbScore)
function bbScenario7Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const tercileSize = Math.ceil(albums.length / 3);

  const first = albums.slice(0, tercileSize);
  const second = albums.slice(tercileSize, 2 * tercileSize);
  const third = albums.slice(2 * tercileSize);

  const allScored = [first, second, third].map((group) =>
    group
      .map((album) => {
        const score = calculateBBScore(
          album,
          "watched", // jer je watched scope
          album.format.toLowerCase(),
          "all", // all genres
          budget
        );
        return { ...album, bbScore: score };
      })
      .sort((a, b) => b.bbScore - a.bbScore)
  );

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allScored[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 7 / PICK 2
// WHERE: Watched / All formats / All genres
// METHOD: PRF (Scoring cycle: 1st → 2nd → 3rd → lowest stock)
function bbScenario7Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const sortedByStock = [...albums].sort((a, b) => a.stock - b.stock);
  const tercileSize = Math.ceil(sortedByStock.length / 3);

  const first = sortedByStock.slice(0, tercileSize);
  const second = sortedByStock.slice(tercileSize, 2 * tercileSize);
  const third = sortedByStock.slice(2 * tercileSize);

  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 7 / PICK 3
// WHERE: Watched / All formats / All genres
// METHOD: PRF (Scoring cycle: 1st → 2nd → 3rd → lowest price)
function bbScenario7Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const sortedByPrice = [...albums].sort((a, b) => a.price - b.price);
  const tercileSize = Math.ceil(sortedByPrice.length / 3);

  const first = sortedByPrice.slice(0, tercileSize);
  const second = sortedByPrice.slice(tercileSize, 2 * tercileSize);
  const third = sortedByPrice.slice(2 * tercileSize);

  const allSorted = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allSorted[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 7 / PICK 4
// WHERE: Watched (za analizu) → Whole store (za predlog)
// METHOD: PRF-DF-Rating (Dominant Format → Whole Store → Scoring by rating) - Ako je nerešeno (npr. 2 CD + 2 Vinyl) → random format

function bbScenario7Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  if (!watchedAlbums || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu formata.");
    return [];
  }

  // 🔍 Analiza formata u watched
  const watchedFormats = watchedAlbums
    .map((id) => {
      const album = albums.find((a) => a.id === id);
      return album ? album.format.toLowerCase() : null;
    })
    .filter(Boolean);

  const formatCount = {};
  watchedFormats.forEach((format) => {
    formatCount[format] = (formatCount[format] || 0) + 1;
  });

  const formats = Object.entries(formatCount).sort((a, b) => b[1] - a[1]);
  const topCount = formats[0][1];
  const topFormats = formats
    .filter(([_, count]) => count === topCount)
    .map(([f]) => f);

  // 🎲 Ako je nerešeno (npr. 2 vinyl + 2 cd), izaberi random
  const dominantFormat =
    topFormats.length === 1
      ? topFormats[0]
      : topFormats[Math.floor(Math.random() * topFormats.length)];

  // 🎯 Filteruj celu radnju po dominantnom formatu
  const filtered = albums
    .filter(
      (a) =>
        a.format.toLowerCase() === dominantFormat &&
        a.rating !== undefined &&
        a.rating !== null &&
        a.price <= budget
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // sort po ratingu

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 7 / PICK 5
// WHERE: Watched (za analizu) → Whole store (za predlog)
// METHOD: PRF-DG-Rating - (Dominant Genre → Whole Store → Scoring by rating) - Ako je nerešeno (npr. 2 Jazz + 2 Rock) → random
function bbScenario7Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  if (!watchedAlbums || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu žanra.");
    return [];
  }

  // 🔍 Izvuci sve žanrove iz watched albuma
  const genreCount = {};

  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album && album.genre) {
      const genres = album.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim());
      genres.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    }
  });

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  const topCount = sortedGenres[0][1];
  const topGenres = sortedGenres
    .filter(([_, count]) => count === topCount)
    .map(([g]) => g);

  // 🎲 Ako je nerešeno, izaberi nasumično
  const dominantGenre =
    topGenres.length === 1
      ? topGenres[0]
      : topGenres[Math.floor(Math.random() * topGenres.length)];

  // 🎯 Filteruj celu radnju po dominantnom žanru
  const filtered = albums
    .filter(
      (a) =>
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(dominantGenre) &&
        a.rating !== undefined &&
        a.rating !== null &&
        a.price <= budget
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // sort po ratingu

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 8 / PICK 1
// WHERE: Watched / Vinyls / All genres
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario8Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  // 🎯 Filter: samo vinyl
  const filtered = firstHalf.filter((a) => a.format.toLowerCase() === "vinyl");

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        "all",
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 8 / PICK 2
// WHERE: Watched / Vinyls / All genres
// METHOD: SCORING (pure scoring, second half of the store, sa filtriranjem duplikata)
function bbScenario8Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  // 🎯 Filter: samo vinyl i bez naslova koji su već korišćeni
  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  const filtered = secondHalf.filter(
    (a) =>
      a.format.toLowerCase() === "vinyl" &&
      !titlesAlreadyUsedInPreviousPicks.has(a.title)
  );

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        "all",
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 8 / PICK 3
// WHERE: Watched / Vinyls / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest stock)
function bbScenario8Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  // 🎯 Filter: samo vinyl
  const filtered = albums.filter((a) => a.format.toLowerCase() === "vinyl");

  // 🔢 Sortiranje po stocku
  const sortedByStock = [...filtered].sort((a, b) => a.stock - b.stock);
  const tercileSize = Math.ceil(sortedByStock.length / 3);

  const first = sortedByStock.slice(0, tercileSize);
  const second = sortedByStock.slice(tercileSize, 2 * tercileSize);
  const third = sortedByStock.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 8 / PICK 4
// WHERE: Watched / Vinyls / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest price)
function bbScenario8Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  // 🎯 Filter: samo vinyl
  const filtered = albums.filter(
    (a) => a.format.toLowerCase() === "vinyl" && a.price <= budget
  );

  // 🔢 Sortiranje po ceni
  const sortedByPrice = [...filtered].sort((a, b) => a.price - b.price);
  const tercileSize = Math.ceil(sortedByPrice.length / 3);

  const first = sortedByPrice.slice(0, tercileSize);
  const second = sortedByPrice.slice(tercileSize, 2 * tercileSize);
  const third = sortedByPrice.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 8 / PICK 5
// WHERE: Watched / Vinyls / All genres
// METHOD: PRF (Dominant Genre Filter → Whole store → Vinyl → Scoring by rating)
function bbScenario8Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu žanra.");
    return [];
  }

  // 🔍 Izvuci sve žanrove iz watched albuma
  const genreCount = {};
  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album?.genre) {
      album.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .forEach((g) => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
    }
  });

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  if (sortedGenres.length === 0) {
    console.warn("🚫 Nema pronađenih žanrova.");
    return [];
  }

  const topCount = sortedGenres[0][1];
  const topGenres = sortedGenres
    .filter(([_, count]) => count === topCount)
    .map(([g]) => g);
  const dominantGenre =
    topGenres.length === 1
      ? topGenres[0]
      : topGenres[Math.floor(Math.random() * topGenres.length)];

  // 🎯 Filtriraj celu radnju po Vinyl + dominantni žanr
  const filtered = albums
    .filter((a) => {
      const isVinyl = a.format?.toLowerCase() === "vinyl";
      const genreMatch =
        typeof a.genre === "string" &&
        a.genre
          .toLowerCase()
          .split(",")
          .map((g) => g.trim())
          .includes(dominantGenre.toLowerCase());
      const priceOK = a.price <= budget;
      return isVinyl && genreMatch && priceOK;
    })
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 9 / PICK 1
// WHERE: Watched / CDs / All genres
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario9Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  const filtered = firstHalf.filter((a) => a.format.toLowerCase() === "cd");

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        "all",
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 9 / PICK 2
// WHERE: Watched / CDs / All genres
// METHOD: SCORING (pure scoring, second half of the store, sa filtriranjem duplikata)
function bbScenario9Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  const filtered = secondHalf.filter(
    (a) =>
      a.format.toLowerCase() === "cd" &&
      !titlesAlreadyUsedInPreviousPicks.has(a.title)
  );

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        "all",
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 9 / PICK 3
// WHERE: Watched / CDs / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest stock)
function bbScenario9Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const filtered = albums.filter((a) => a.format.toLowerCase() === "cd");
  const sortedByStock = [...filtered].sort((a, b) => a.stock - b.stock);
  const tercileSize = Math.ceil(sortedByStock.length / 3);

  const first = sortedByStock.slice(0, tercileSize);
  const second = sortedByStock.slice(tercileSize, 2 * tercileSize);
  const third = sortedByStock.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 9 / PICK 4
// WHERE: Watched / CDs / All genres
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest price)
function bbScenario9Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE
) {
  const filtered = albums.filter(
    (a) => a.format.toLowerCase() === "cd" && a.price <= budget
  );

  const sortedByPrice = [...filtered].sort((a, b) => a.price - b.price);
  const tercileSize = Math.ceil(sortedByPrice.length / 3);

  const first = sortedByPrice.slice(0, tercileSize);
  const second = sortedByPrice.slice(tercileSize, 2 * tercileSize);
  const third = sortedByPrice.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 9 / PICK 5
// WHERE: Watched / CDs / All genres
// METHOD: PRF (Dominant Genre Filter → Whole store → CD → Scoring by rating)
function bbScenario9Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu žanra.");
    return [];
  }

  const genreCount = {};
  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album?.genre) {
      album.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .forEach((g) => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
    }
  });

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  if (sortedGenres.length === 0) {
    console.warn("🚫 Nema pronađenih žanrova.");
    return [];
  }

  const topCount = sortedGenres[0][1];
  const topGenres = sortedGenres
    .filter(([_, count]) => count === topCount)
    .map(([g]) => g);
  const dominantGenre =
    topGenres.length === 1
      ? topGenres[0]
      : topGenres[Math.floor(Math.random() * topGenres.length)];

  const filtered = albums
    .filter((a) => {
      const isCD = a.format?.toLowerCase() === "cd";
      const genreMatch =
        typeof a.genre === "string" &&
        a.genre
          .toLowerCase()
          .split(",")
          .map((g) => g.trim())
          .includes(dominantGenre.toLowerCase());
      const priceOK = a.price <= budget;
      return isCD && genreMatch && priceOK;
    })
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 10 / PICK 1
// WHERE: Watched / All formats / Chosen genre
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario10Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  // 🎯 Filter: samo žanr
  const filtered = firstHalf.filter((a) => {
    return (
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
    );
  });

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        "all",
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 10 / PICK 2
// WHERE: Watched / All formats / Chosen genre
// METHOD: SCORING (pure scoring, second half of the store, bez duplikata iz Pick1)
function bbScenario10Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  // 🎯 Filter: samo žanr + bez duplikata iz Pick1
  const filtered = secondHalf.filter(
    (a) =>
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      !titlesAlreadyUsedInPreviousPicks.has(a.title)
  );

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        "all",
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 10 / PICK 3
// WHERE: Watched / All formats / Chosen genre
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lower stock)
function bbScenario10Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  // 🎯 Filter: po žanru
  const filtered = albums.filter(
    (a) =>
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  // 🔢 Sort po stock
  const sortedByStock = [...filtered].sort((a, b) => a.stock - b.stock);
  const tercileSize = Math.ceil(sortedByStock.length / 3);

  const first = sortedByStock.slice(0, tercileSize);
  const second = sortedByStock.slice(tercileSize, 2 * tercileSize);
  const third = sortedByStock.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 10 / PICK 4
// WHERE: Watched / All formats / Chosen genre
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lowest price)
function bbScenario10Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  // 🎯 Filter: po žanru i budžetu
  const filtered = albums.filter(
    (a) =>
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      a.price <= budget
  );

  // 🔢 Sortiranje po ceni
  const sortedByPrice = [...filtered].sort((a, b) => a.price - b.price);
  const tercileSize = Math.ceil(sortedByPrice.length / 3);

  const first = sortedByPrice.slice(0, tercileSize);
  const second = sortedByPrice.slice(tercileSize, 2 * tercileSize);
  const third = sortedByPrice.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}
// SCENARIO 10 / PICK 5
// WHERE: Watched / All formats / Chosen genre
// METHOD: PRF (Dominant format Filter → Whole store → Scoring by rating)

function bbScenario10Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums,
  selectedGenre
) {
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 Nema watched albuma za analizu formata.");
    return [];
  }

  // 🧠 Detekcija dominantnog formata iz watched liste
  const formatCount = {};
  watchedAlbums.forEach((id) => {
    const album = albums.find((a) => a.id === id);
    if (album?.format) {
      const format = album.format.toLowerCase();
      formatCount[format] = (formatCount[format] || 0) + 1;
    }
  });

  const sortedFormats = Object.entries(formatCount).sort((a, b) => b[1] - a[1]);
  if (sortedFormats.length === 0) {
    console.warn("🚫 Nema pronađenih formata.");
    return [];
  }

  const topCount = sortedFormats[0][1];
  const topFormats = sortedFormats
    .filter(([_, count]) => count === topCount)
    .map(([f]) => f);

  const dominantFormat =
    topFormats.length === 1
      ? topFormats[0]
      : topFormats[Math.floor(Math.random() * topFormats.length)];

  // 🎯 Filter: whole store → dominantni format + izabrani žanr
  const filtered = albums
    .filter((a) => {
      const formatMatch = a.format?.toLowerCase() === dominantFormat;
      const genreMatch =
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      const priceOK = a.price <= budget;
      return formatMatch && genreMatch && priceOK;
    })
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 11 / PICK 1
// WHERE: Watched / Vinyls / Chosen genre
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario11Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  // 🎯 Filter: vinyl + izabrani žanr
  const filtered = firstHalf.filter((a) => {
    const isVinyl = a.format?.toLowerCase() === "vinyl";
    const hasGenre = typeof a.genre === "string";
    const genreMatch =
      hasGenre &&
      a.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .includes(selectedGenre.toLowerCase());
    return isVinyl && genreMatch;
  });

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 11 / PICK 2
// WHERE: Watched / Vinyls / Chosen genre
// METHOD: SCORING (pure scoring, second half of the store)
function bbScenario11Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  // 🎯 Filter: samo vinyl i izabrani žanr, bez već korišćenih
  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  const filtered = secondHalf.filter(
    (a) =>
      a.format?.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      !titlesAlreadyUsedInPreviousPicks.has(a.title)
  );

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 11 / PICK 3
// WHERE: Watched / Vinyls / Chosen genre
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lower stock)
function bbScenario11Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const filtered = albums.filter(
    (a) =>
      a.format?.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      a.price <= budget
  );

  const sortedByStock = [...filtered].sort((a, b) => a.stock - b.stock);
  const tercileSize = Math.ceil(sortedByStock.length / 3);

  const first = sortedByStock.slice(0, tercileSize);
  const second = sortedByStock.slice(tercileSize, 2 * tercileSize);
  const third = sortedByStock.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 11 / PICK 4
// WHERE: Watched / Vinyls / Chosen genre
// METHOD: PRF (Scoring cycle: 1st tercile → 2nd → 3rd... rotation parametar lower price)
function bbScenario11Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const filtered = albums.filter(
    (a) =>
      a.format?.toLowerCase() === "vinyl" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      a.price <= budget
  );

  const sortedByPrice = [...filtered].sort((a, b) => a.price - b.price);
  const tercileSize = Math.ceil(sortedByPrice.length / 3);

  const first = sortedByPrice.slice(0, tercileSize);
  const second = sortedByPrice.slice(tercileSize, 2 * tercileSize);
  const third = sortedByPrice.slice(2 * tercileSize);
  const allTerciles = [first, second, third];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const groupIndex = cycle % 3;
    const group = allTerciles[groupIndex];
    let added = false;

    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }

    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 11 / PICK 5
// WHERE: Watched / Vinyls / Chosen genre
// METHOD: PRF (Whole store → Vinyls → Chosen genre → Scoring by rating)
function bbScenario11Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const filtered = albums
    .filter(
      (a) =>
        a.format?.toLowerCase() === "vinyl" &&
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
        a.price <= budget
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}
// SCENARIO 12 / PICK 1
// WHERE: Watched / CDs / Chosen genre
// METHOD: SCORING (pure scoring, first half of the store)
function bbScenario12Pick1(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  const filtered = firstHalf.filter((a) => {
    const isCD = a.format?.toLowerCase() === "cd";
    const genreMatch =
      typeof a.genre === "string" &&
      a.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .includes(selectedGenre.toLowerCase());
    return isCD && genreMatch;
  });

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 12 / PICK 2
// WHERE: Watched / CDs / Chosen genre
// METHOD: SCORING (second half of the store, CD + genre filter)
function bbScenario12Pick2(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  const titlesAlreadyUsed = new Set([...scenarioUsedTitles.keys()]);

  const filtered = secondHalf.filter(
    (a) =>
      a.format?.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      !titlesAlreadyUsed.has(a.title)
  );

  const scored = filtered
    .map((album) => {
      const score = calculateBBScore(
        album,
        "watched",
        album.format.toLowerCase(),
        selectedGenre,
        budget
      );
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of scored) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;

    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

// SCENARIO 12 / PICK 3
// WHERE: Watched / CDs / Chosen genre
// METHOD: PRF (stock kroz tercile)
function bbScenario12Pick3(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const filtered = albums.filter(
    (a) =>
      a.format?.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      a.price <= budget
  );

  const sorted = [...filtered].sort((a, b) => a.stock - b.stock);
  const size = Math.ceil(sorted.length / 3);
  const terciles = [
    sorted.slice(0, size),
    sorted.slice(size, 2 * size),
    sorted.slice(2 * size),
  ];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const group = terciles[cycle % 3];
    let added = false;
    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }
    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 12 / PICK 4
// WHERE: Watched / CDs / Chosen genre
// METHOD: PRF (price kroz tercile)
function bbScenario12Pick4(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const filtered = albums.filter(
    (a) =>
      a.format?.toLowerCase() === "cd" &&
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      a.price <= budget
  );

  const sorted = [...filtered].sort((a, b) => a.price - b.price);
  const size = Math.ceil(sorted.length / 3);
  const terciles = [
    sorted.slice(0, size),
    sorted.slice(size, 2 * size),
    sorted.slice(2 * size),
  ];

  const selected = [];
  const usedTitles = new Set();
  let total = 0;
  let cycle = 0;

  while (total < budget) {
    const group = terciles[cycle % 3];
    let added = false;
    for (const album of group) {
      const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
      if (
        !usedTitles.has(album.title) &&
        alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
        total + album.price <= budget
      ) {
        selected.push(album);
        usedTitles.add(album.title);
        scenarioUsedTitles.set(album.title, alreadyUsed + 1);
        total += album.price;
        added = true;
        break;
      }
    }
    if (!added) break;
    cycle++;
  }

  return selected;
}

// SCENARIO 12 / PICK 5
// WHERE: Watched / CDs / Chosen genre
// METHOD: PRF (whole store → CDs → chosen genre → scoring by rating)
function bbScenario12Pick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  selectedGenre
) {
  const filtered = albums
    .filter(
      (a) =>
        a.format?.toLowerCase() === "cd" &&
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
        a.price <= budget
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const selected = [];
  const usedTitles = new Set();
  let total = 0;

  for (const album of filtered) {
    const alreadyUsed = scenarioUsedTitles.get(album.title) || 0;
    if (
      !usedTitles.has(album.title) &&
      alreadyUsed < MAX_OCCURRENCES_PER_TITLE &&
      total + album.price <= budget
    ) {
      selected.push(album);
      usedTitles.add(album.title);
      scenarioUsedTitles.set(album.title, alreadyUsed + 1);
      total += album.price;
    }
  }

  return selected;
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////
// HAMBURGER MENU + Apply Filters + Linkovi 🎯
document.addEventListener("DOMContentLoaded", () => {
  // HAMBURGER MENU + Apply Filters + Linkovi 🎯
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const overlay = document.querySelector(".mobile-overlay");
  const applyFiltersBtn = document.querySelector(".apply-filters-btn");
  const formatLinks = document.querySelectorAll("#sideMenu [data-format]");
  const genreLinks = document.querySelectorAll("#sideMenu [data-genre]");

  // Hamburger dugme
  hamburgerBtn.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    overlay.classList.toggle("hidden");
    updateCartCount();
    updateWatchCount();
  });

  // Klik na overlay zatvara meni
  overlay.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    overlay.classList.add("hidden");
  });

  // Klik na format linkove
  formatLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const clickedValue = link.getAttribute("data-format");
      formatLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Klik na genre linkove
  genreLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const genre = link.getAttribute("data-genre");

      if (genre === "All") {
        genreLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      } else {
        const allLink = document.querySelector('[data-genre="All"]');
        allLink?.classList.remove("active");
        link.classList.toggle("active");
      }
    });
  });

  // Reset dugme
  const resetFiltersBtn = document.querySelector(".reset-filters-btn");
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      document
        .querySelectorAll("#sideMenu .side-submenu li a.active")
        .forEach((el) => el.classList.remove("active"));
      document.querySelector('[data-format="All"]')?.classList.add("active");
      document.querySelector('[data-genre="All"]')?.classList.add("active");

      filteredAlbumsGlobal = albums;
      currentPage = 1;
      renderAlbums(currentPage, filteredAlbumsGlobal);
      setupPagination(filteredAlbumsGlobal);

      document.body.classList.remove("menu-open");
      overlay.classList.add("hidden");
    });
  }

  // Apply Filters dugme
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      const selectedFormat =
        document
          .querySelector(".side-submenu li a.active[data-format]")
          ?.getAttribute("data-format") || "All";

      let selectedGenres = [
        ...document.querySelectorAll(".side-submenu li a.active[data-genre]"),
      ].map((el) => el.getAttribute("data-genre"));

      if (selectedGenres.includes("All")) {
        selectedGenres = [];
      }

      const formatValue = selectedFormat === "All" ? null : selectedFormat;

      const filtered = albums.filter((album) => {
        const formatMatch = !formatValue || album.format === formatValue;
        const genreMatch =
          selectedGenres.length === 0 ||
          selectedGenres.some((genre) =>
            album.genre.toLowerCase().includes(genre.toLowerCase())
          );
        return formatMatch && genreMatch;
      });

      filteredAlbumsGlobal = filtered;
      currentPage = 1;
      renderAlbums(currentPage, filteredAlbumsGlobal);
      setupPagination(filteredAlbumsGlobal);

      document.body.classList.remove("menu-open");
      overlay.classList.add("hidden");
    });
  }

  // Dugmad i paneli (desktop + mobile)
  const watchNavBtn = document.querySelector(".watch-btn .nav-item.watched");

  const cartNavBtn = document.querySelector(".cart-btn");

  const mobileWatchBtn = document.querySelector(".mobile-watch-btn");
  const mobileBBBtn = document.querySelector(".mobile-bb-btn");
  const mobileCartBtn = document.querySelector(".mobile-cart-btn");

  const watchPanel = document.getElementById("watchPanel");
  const cartPanel = document.getElementById("cartPanel");
  const bbPanel = document.getElementById("bbBudgetPanel");

  function closeAllPanels() {
    if (watchPanel) {
      watchPanel.classList.add("hidden");
      watchPanel.style.display = "none";
    }
    if (cartPanel) {
      cartPanel.classList.add("hidden");
      cartPanel.style.display = "none";
    }
    if (bbPanel) {
      bbPanel.classList.add("hidden");
      bbPanel.classList.remove("show");
    }
  }

  document.addEventListener("click", (e) => {
    const isClickInsideWatch = watchPanel?.contains(e.target);
    const isClickInsideCart = cartPanel?.contains(e.target);
    const isWatchBtn =
      e.target.closest(".mobile-watch-btn") || e.target.closest(".watch-btn");
    const isCartBtn =
      e.target.closest(".mobile-cart-btn") || e.target.closest(".cart-btn");

    if (!isClickInsideWatch && !isWatchBtn) {
      watchPanel?.classList.add("hidden");
      watchPanel.style.display = "none";
    }

    if (!isClickInsideCart && !isCartBtn) {
      cartPanel?.classList.add("hidden");
      cartPanel.style.display = "none";
    }
  });

  // ✅ Klik na main-nav WATCH dugme (toggle)
  watchNavBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const isVisible = !watchPanel.classList.contains("hidden");

    closeAllPanels();

    if (!isVisible) {
      watchPanel.classList.remove("hidden");
      watchPanel.style.display = "block";
      renderWatched();
    }
  });

  // ✅ Klik na main-nav CART dugme (toggle)
  cartNavBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    const isVisible =
      !cartPanel.classList.contains("hidden") &&
      cartPanel.style.display !== "none";

    if (isVisible) {
      // Ako je već vidljivo, zatvori
      cartPanel.classList.add("hidden");
      cartPanel.style.display = "none";
    } else {
      // Inače otvori
      cartPanel.classList.remove("hidden");
      cartPanel.style.display = "block";
      renderCart();
    }
  });

  mobileWatchBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllPanels();
    watchPanel?.classList.remove("hidden");
    watchPanel.style.display = "block";
    renderWatched();
    document.body.classList.remove("menu-open");
    overlay?.classList.add("hidden");
  });

  mobileCartBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllPanels();
    cartPanel?.classList.remove("hidden");
    cartPanel.style.display = "block";
    renderCart();
    document.body.classList.remove("menu-open");
    overlay?.classList.add("hidden");
  });

  mobileBBBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllPanels();
    bbPanel?.classList.remove("hidden");
    bbPanel?.classList.add("show");
    document.body.classList.remove("menu-open");
    overlay?.classList.add("hidden");
  });
});
////////// JSON pozivanje const albums  ///////////////

fetch("albums.json")
  .then((res) => res.json())
  .then((data) => {
    albums = data;
    filteredAlbumsGlobal = albums;

    renderAlbums(1, albums);
    setupPagination(albums);
  })
  .catch((err) => console.error("Greška pri učitavanju JSON fajla:", err));

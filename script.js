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

  // 2️⃣ Genre filter – Only if "All" is not selected"
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
  // Activate sticky immediately if already scrolled
  if (window.scrollY > header.offsetHeight - 150) {
    nav.classList.add("sticky");
    publisherBar.classList.add("after-sticky");
    nav.style.opacity = "1";
    nav.style.transform = "translate(-50%, 0)";
    mainNav.style.transform = "none";
  }

  // Cart button
  const cartNavBtn = document.querySelector(".cart-btn a");
  const cartPanel = document.getElementById("cartPanel");

  if (cartNavBtn && cartPanel) {
    cartNavBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cartPanel.classList.toggle("hidden");
      renderCart();
    });
  }

  // Click outside the Cart panel = close it
  document.addEventListener("click", (e) => {
    const isClickInsidePanel = cartPanel?.contains(e.target);
    const isClickOnButton = cartNavBtn?.contains(e.target);

    if (!isClickInsidePanel && !isClickOnButton) {
      cartPanel?.classList.add("hidden");
    }
  });
});

// 2. React to scroll — add/remove the sticky class
window.addEventListener("scroll", () => {
  if (window.scrollY > header.offsetHeight - 150) {
    nav.classList.add("sticky");
    publisherBar.classList.add("after-sticky");
  } else {
    nav.classList.remove("sticky");
    publisherBar.classList.remove("after-sticky");
  }
});

// Trigger fadeIn animation once, then remove to prevent repeat
nav.addEventListener("animationend", (e) => {
  if (e.animationName === "fadeInNav") {
    if (!nav.classList.contains("sticky")) {
      nav.classList.add("animated-once");
      nav.style.animation = "none";
      nav.style.opacity = "1";
    }
  }
});

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
  albumGrid.innerHTML = ""; // Clear previous display

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
    filteredAlbums = albums; // Display all items if "All" is selected
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
  renderAlbums(currentPage, filteredAlbumsGlobal); // Use the currently filtered view prikaz
  updateCartCount();
}
function renderCart() {
  const cartPanel = document.getElementById("cartPanel");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // If the cart is empty:
  if (cartAlbums.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerHTML = "";
    return;
  }

  // Find albums in the cart
  const albumsInCart = albums.filter((album) => cartAlbums.includes(album.id));

  // Display cart items
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

  // Calculate total price
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
  // Use the currently filtered view
  updateWatchCount();
}

/////////////////// PAGINATION ////////////////////////
function setupPagination(albumList = albums) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(albumList.length / albumsPerPage);

  const scrollToAlbumGridTop = () => {
    const albumGrid = document.getElementById("albumGrid");
    const y = albumGrid.getBoundingClientRect().top + window.scrollY - 180; // Offset relative to sticky navigation
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
    renderCart(); //  Always update on each open
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

  // Close cartPanel when clicking outside of it
  document.addEventListener("click", (e) => {
    const isClickInsidePanel = cartPanel.contains(e.target);
    const isClickOnButton = cartNavBtn.contains(e.target);

    if (!isClickInsidePanel && !isClickOnButton) {
      cartPanel.classList.add("hidden");
    }
  });
});

/////////////// Trigger fadeIn animation for Budget Button panel /////////////
function handleStickyNav() {
  const header = document.querySelector("header");
  const nav = document.getElementById("mainNav");
  const publisherBar = document.querySelector(".publisher-bar");
  const navLinks = nav.querySelectorAll("a"); // All links in nav

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
// 📌 ABOUT US SECTION
// =======================

const aboutUsBtn = document.querySelector(".about a");
const aboutUsPanel = document.getElementById("aboutUsPanel");
const scrollToShop = document.querySelector(".scroll-to-shop");
const fadeLayer = document.getElementById("aboutFadeLayer");

// Click on "About Us" button
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
      // Add wheel and touch events again each time it's opened
      aboutUsPanel.addEventListener("wheel", closeAboutPanelAndScroll, {
        once: true,
      });
      aboutUsPanel.addEventListener("touchstart", closeAboutPanelAndScroll, {
        once: true,
      });
      // Space closing
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

// Click on "Scroll to Shop - DOWN ARROW" button
scrollToShop.addEventListener("click", () => {
  closeAboutPanelAndScroll();
});

// Click anywhere inside the About Us panel
aboutUsPanel.addEventListener("click", () => {
  closeAboutPanelAndScroll();
});
// Detect mouse wheel event (desktop)
aboutUsPanel.addEventListener(
  "wheel",
  () => {
    closeAboutPanelAndScroll();
  },
  { once: true }
);

// Detect swipe start (mobile/touchscreen)
aboutUsPanel.addEventListener(
  "touchstart",
  () => {
    closeAboutPanelAndScroll();
  },
  { once: true }
);

// Shared function for closing and scrolling
function closeAboutPanelAndScroll() {
  aboutUsPanel.classList.remove("show");
  fadeLayer.classList.remove("visible");

  setTimeout(() => {
    aboutUsPanel.classList.add("hidden");
    fadeLayer.classList.add("hidden");

    const albumGrid = document.getElementById("albumGrid");
    const yOffset = -350; // Adjust based on visual feel
    const y =
      albumGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, 1200);
}

// =======================
// 📌 CONTACT SECTION
// =======================

const contactBtn = document.querySelector(".contact a");
const contactPanel = document.getElementById("contactPanel");
const contactFadeLayer = document.getElementById("contactFadeLayer");
const contactCloseBtn = contactPanel.querySelector(".scroll-to-shop");

// Click on the "Contact" button
contactBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // 1.  Fade layer appears and starts dimming
  contactFadeLayer.classList.remove("hidden");
  setTimeout(() => {
    contactFadeLayer.classList.add("visible");
  }, 10);

  // 2. Contact panel appears with a delay
  setTimeout(() => {
    contactPanel.classList.remove("hidden");

    // 3. Trigger fade-in animation for the panel
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

// Click on "Continue to Store" ARROW DOWN BUTTON from the Contact panel
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
    const yOffset = -350; // Adjust based on feel (fine-tune visually)
    const y =
      albumGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, 1200);
}

////////////////// BB INTRO SECTION //////////////////////

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
      // 🌀 RESET ANIMATION
      const bbLines = document.querySelectorAll(".bb-line");
      bbLines.forEach((line) => {
        line.style.animation = "none";
        void line.offsetWidth; //  trigger reflow
        line.style.animation = ""; // start again
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
// 🎯 FORMATS MENU INTERACTION
document.addEventListener("DOMContentLoaded", () => {
  const formatsDropdown = document.querySelector(".formats-dropdown");
  const formatsLinks = formatsDropdown.querySelectorAll(".formats-menu a");
  const formatsToggle = document.querySelector(".formats-toggle");

  // Click on toggle button → open or close dropdown
  formatsToggle.addEventListener("click", (e) => {
    e.preventDefault();

    if (formatsDropdown.classList.contains("keep-open")) {
      formatsDropdown.classList.remove("keep-open");
    } else {
      formatsDropdown.classList.add("keep-open");
    }
  });

  //  Click on item in dropdown menu
  formatsLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all and add to clicked link
      formatsLinks.forEach((el) => el.classList.remove("active"));
      link.classList.add("active");

      // Update button text
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

      // Close menu
      formatsDropdown.classList.remove("keep-open");

      // Scroll if at the top
      if (window.scrollY < 500) {
        document
          .querySelector(".header")
          .scrollIntoView({ behavior: "smooth" });
      }

      // Activate filters
      applyCombinedFilters();
    });
  });

  // Click outside the menu → always close dropdown
  document.addEventListener("click", (e) => {
    if (
      !formatsDropdown.contains(e.target) &&
      !formatsToggle.contains(e.target)
    ) {
      formatsDropdown.classList.remove("keep-open");
    }
  });
});

// 🎯 GENRES MENU INTERACTION
document.addEventListener("DOMContentLoaded", () => {
  const genresDropdown = document.querySelector(".genres-dropdown");
  const genresToggle = document.querySelector(".genres-toggle");
  const genresLinks = genresDropdown.querySelectorAll(".genres-menu a");

  // Click on toggle → open/close menu
  genresToggle.addEventListener("click", (e) => {
    e.preventDefault();
    genresDropdown.classList.toggle("keep-open");
  });

  // Click on genres
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

  // Click outside the menu → close it
  document.addEventListener("click", (e) => {
    if (
      !genresDropdown.contains(e.target) &&
      !genresToggle.contains(e.target)
    ) {
      genresDropdown.classList.remove("keep-open");
    }
  });

  // Initial render
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
// 🔥 BB BUTTON HANDLER (Smoke It! click)
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

    //  Read entered budget and selected options (Scope / Format / Genre)
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

    //  Map the combination to a scenario number
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
      console.warn("❌ Undefined combination for scenario.");
    }

    // Select the initial set of albums
    const pool = getFilteredPool(
      albums,
      selectedScope,
      selectedGenre,
      watchedAlbums
    );

    const shuffledOnce = [...pool].sort(() => Math.random() - 0.5);
    // make shuffle  //
    scenarioAlbumPool = [...shuffledOnce]; // Store the fixed array for all suggestions

    const filtered = albums.filter((a) =>
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
    );

    //  Initialize tracking of the number of occurrences per title
    const scenarioUsedTitles = new Map();
    const MAX_OCCURRENCES_PER_TITLE = 2;

    //  Clear previous results
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
    // 🧠 Scenario selection
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

        //  SMART PICK if there's anything in the watched list
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
          shuffledOnce, ///P1P2-Split-Filter logic///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario5Pick2(
          shuffledOnce, /// P1P2-Split-Filter logic ///
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
          shuffledOnce, ///P1P2-Split-Filter logic///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario6Pick2(
          shuffledOnce, /// P1P2-Split-Filter logic ///
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
          watchedAlbums // For suggestions that include watched items and use format/genre filters in whole store
        );
        const pick5 = bbScenario7Pick5(
          albums,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums // For suggestions that include watched items and use format/genre filters in whole store
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
          shuffledOnce, ///P1P2-Split-Filter logic///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario8Pick2(
          shuffledOnce, /// P1P2-Split-Filter logic ///
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
          albums, // ← whole store!,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums //For suggestions that include watched items and use format/genre filters in whole store
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
          shuffledOnce, ///P1P2-Split-Filter logic///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario9Pick2(
          shuffledOnce, /// P1P2-Split-Filter logic ///
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
          albums, // ← whole store!,
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          watchedAlbums // For suggestions that include watched items and use format/genre filters in whole store
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
          shuffledOnce, ///P1P2-Split-Filter logic///
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario10Pick2(
          shuffledOnce, /// P1P2-Split-Filter logic ///
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
          watchedAlbums, // For suggestions that include watched items and use format/genre filters in whole store
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
          shuffledOnce, // ← First half of the store (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario11Pick2(
          shuffledOnce, // ← second half of the store (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick3 = bbScenario11Pick3(
          scenarioAlbumPool, // ← whole store
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick4 = bbScenario11Pick4(
          scenarioAlbumPool, // ← whole store
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick5 = bbScenario11Pick5(
          albums, // ← whole store
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre // genres filter
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
          shuffledOnce, // ← First half of the store (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick2 = bbScenario12Pick2(
          shuffledOnce, // ← Second half of the store (P1P2-Split-Filter)
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick3 = bbScenario12Pick3(
          scenarioAlbumPool, // ← whole store
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick4 = bbScenario12Pick4(
          scenarioAlbumPool, // ← whole store
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre
        );

        const pick5 = bbScenario12Pick5(
          albums, // ← whole store
          budget,
          scenarioUsedTitles,
          MAX_OCCURRENCES_PER_TITLE,
          selectedGenre // genres filter
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

    // 📤 DISPLAY RESULTS
    openBBResultsPanel();
  });
}

// Function to open the panel (will be called after budget processing is complete)
function openBBResultsPanel() {
  if (!bbResultsPanel || !bbResultsFadeLayer) return;

  // Fade layer
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

// Function to close (on background click or escape)
// Function to close the BB Results panel
function closeBBResultsPanel() {
  const bbResultsPanel = document.getElementById("bbResultsPanel");
  const bbResultsFadeLayer = document.getElementById("bbResultsFadeLayer");
  const bbResultsGrid = document.getElementById("bbResultsGrid");
  const bbBudgetPanel = document.getElementById("bbBudgetPanel");
  const bbBudgetFadeLayer = document.getElementById("bbBudgetFadeLayer");
  const albumGrid = document.getElementById("albumGrid");
  const header = document.querySelector(".header");

  if (!bbResultsPanel || !bbResultsFadeLayer) return;

  // Immediately close both panels (no animation)
  bbBudgetPanel?.classList.remove("show");
  bbBudgetFadeLayer?.classList.remove("visible");
  bbResultsPanel.classList.remove("show");
  bbResultsFadeLayer.classList.remove("visible");

  // Clear everything and scroll back after 1 second
  setTimeout(() => {
    bbResultsPanel.classList.add("hidden");
    bbResultsFadeLayer.classList.add("hidden");
    bbBudgetPanel?.classList.add("hidden");
    bbBudgetFadeLayer?.classList.add("hidden");

    // Scroll to albumGrid with sticky offset
    const offset = 550; // Use the same value as for intro
    const y =
      albumGrid.getBoundingClientRect().top +
      window.pageYOffset -
      header.offsetHeight +
      offset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }, 1000);
}

// Add event listener for the X button (outside the function)
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
    // "All formats" selected → handle format manually
    score += album.format.toLowerCase() === "vinyl" ? 1.04 : 0.84;
  }

  // 3️⃣ GENRE

  let genrePoints = 1.0; // F - default for "all"

  if (selectedGenre !== "all") {
    const albumGenres = album.genre
      .toLowerCase()
      .split(",")
      .map((g) => g.trim().replace(/[\s-]/g, "")); //  "hip hop" → "hiphop"

    const cleanedSelected = selectedGenre.toLowerCase().replace(/[\s-]/g, "");
    //// // Bonus selection by genre. If "Rock" is chosen, all Rock albums start with 1.23 boost ////
    if (albumGenres.includes(cleanedSelected)) {
      genrePoints = 1.23;
    } else {
      genrePoints = 0; // Not matching
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
  if (price > 30) score += 0.31;
  else if (price > 19) score += 0.33;
  else if (price > 9) score += 0.36;
  else score += 0.39; // P (<10)

  // 6️⃣ BOOST
  score += album.boost ?? 0;
  // 🔁 Scope multiplier per album when it's watched
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
    console.warn("No albums match all criteria!");
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
// 🔥 processBBResults() – Central logic for rendering BB scenarios
// =====================
function processBBResults() {
  const budget = parseFloat(document.getElementById("budgetInput").value);

  // 🔁 Limit the number of occurrences of the same album in one scenario
  const MAX_OCCURRENCES_PER_TITLE = 2;

  // ❌ Close Budget Panel and Fade Layer if still active
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
///////////  Inserting into 5 BB cards   ///////////////

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
  // Preparing separate and sorted lists by format
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
  const usedTitles = new Set(); // Only for this suggestion
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
        break; // Take one vinyl then move on to CD
      }
    }

    // 2. Attempt CD
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
        break; // Take one CD then move to the next cycle
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
  // Prepare vinyls and CDs sorted by lowest stock
  const vinylsByStock = albums
    .filter((a) => a.format.toLowerCase() === "vinyl" && a.stock > 0)
    .sort((a, b) => a.stock - b.stock);

  const cdsByStock = albums
    .filter((a) => a.format.toLowerCase() === "cd" && a.stock > 0)
    .sort((a, b) => a.stock - b.stock);

  const selected = [];
  const usedTitles = new Set(); // Only for this suggestion
  let total = 0;
  let vIndex = 0;
  let cIndex = 0;

  while (vIndex < vinylsByStock.length || cIndex < cdsByStock.length) {
    // 1. VINYL Attempt
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
        break; // Switch to CD
      }
    }

    // 2. CD Attempt
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
        break; // move to the next cycle
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
  // We take only the first half of the albums
  const halfway = Math.ceil(albums.length / 2);
  const firstHalf = albums.slice(0, halfway);

  // Calculating BB score
  const scored = firstHalf
    .map((album) => {
      const score = calculateBBScore(album, "all", "all", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set(); // Local duplicate control in suggestions
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
  //  We take only the second half of the albums
  const halfway = Math.ceil(albums.length / 2);
  const secondHalf = albums.slice(halfway);

  // Calculating BB score
  const scored = secondHalf
    .map((album) => {
      const score = calculateBBScore(album, "all", "all", "all", budget);
      return { ...album, bbScore: score };
    })
    .filter((a) => a.price <= budget)
    .sort((a, b) => b.bbScore - a.bbScore);

  const selected = [];
  const usedTitles = new Set(); //  Local duplicate control in suggestions
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
  // ✅ Check watched list
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("🚫 No watched albums available for genre analysis.");
    return [];
  }

  // Analysis of genres from watched
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
    console.warn("🚫 No genres found");
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

  // 🎯 Filter: whole store + all formats + dominant genre
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
  // 🎯 Filter all with rating that fit within the budget
  const sorted = albums
    .filter((a) => typeof a.rating === "number" && a.price <= budget)
    .sort((a, b) => {
      // 1. Highest rating
      if (a.rating !== b.rating) return b.rating - a.rating;

      // 2. Lowest stock
      if (a.stock !== b.stock) return a.stock - b.stock;

      // 3. Lowest price
      return a.price - b.price;
    });

  const selected = [];
  const usedTitles = new Set(); // Local duplicate control
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
// WHERE: Whole store / Vinyls / All genres
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
// WHERE: Whole store / Vinyls / All genres
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
// If there's a draw — select a random genre from the watched list

function bbScenario2SmartPick5(
  albums,
  budget,
  scenarioUsedTitles,
  MAX_OCCURRENCES_PER_TITLE,
  watchedAlbums
) {
  if (!Array.isArray(watchedAlbums) || watchedAlbums.length === 0) {
    console.warn("No albums for genres analyzing.");
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

  // 🎯 Filter: whole store → only vinyl + dominant genre
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
      // 1. Lowest stock
      if (a.stock !== b.stock) return a.stock - b.stock;
      // 2. Lowest price
      if (a.price !== b.price) return a.price - b.price;
      // 3. Highest rating
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
    console.warn("No watched albums available for genre analysis.");
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

  // 🎯 Filter: whole store → only CD + dominant genre
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

  /// Exclude titles already used in previous Picks
  const titlesAlreadyUsedInPreviousPicks = new Set([
    ...scenarioUsedTitles.keys(),
  ]);

  const filteredSecondHalf = secondHalf.filter(
    (album) => !titlesAlreadyUsedInPreviousPicks.has(album.title)
  );

  // 🔢 Calculating bbScore for the rest albums
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
  const usedTitles = new Set(); // Local check within this pick
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
    console.warn("🚫 No watched albums available for format analysis");
    return [];
  }

  // 🔍 Format analysis from watched
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

  // 🎯 Filter: whole store → only dominant format + chosen genre
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

  // Filter by format and genre
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

  // Filter by format and genre
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
          "watched", // Because watched is the scope
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
    console.warn("No watched albums available for formats analysis..");
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

  // If there's a tie (e.g., 2 vinyl + 2 CD), pick randomly
  const dominantFormat =
    topFormats.length === 1
      ? topFormats[0]
      : topFormats[Math.floor(Math.random() * topFormats.length)];

  // Filter entire store by dominant format
  const filtered = albums
    .filter(
      (a) =>
        a.format.toLowerCase() === dominantFormat &&
        a.rating !== undefined &&
        a.rating !== null &&
        a.price <= budget
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // sort by rating

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
    console.warn("🚫");
    return [];
  }

  // 🔍 Extract all genres from watched albums
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

  // If there's a tie , pick randomly
  const dominantGenre =
    topGenres.length === 1
      ? topGenres[0]
      : topGenres[Math.floor(Math.random() * topGenres.length)];

  // Filter entire store by dominant genre
  const filtered = albums
    .filter(
      (a) =>
        typeof a.genre === "string" &&
        a.genre.toLowerCase().includes(dominantGenre) &&
        a.rating !== undefined &&
        a.rating !== null &&
        a.price <= budget
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // sort by rating

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

  // 🎯 Filter: only vinyl
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

  // 🎯 Filter: Only vinyl and exclude titles already used
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
  // 🎯 Filter: only vinyl
  const filtered = albums.filter((a) => a.format.toLowerCase() === "vinyl");

  // 🔢 Sorting by stock
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
  // 🎯 Filter: only vinyl
  const filtered = albums.filter(
    (a) => a.format.toLowerCase() === "vinyl" && a.price <= budget
  );

  // 🔢 Sorting by price
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
    console.warn("🚫 No watched albums available for genre analysis");
    return [];
  }

  //  Extract all genres from watched albums
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
    console.warn("🚫 No genres found.");
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

  // 🎯 Filtring whole store by Vinyl + dominant genre
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
    console.warn("🚫");
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
    console.warn("🚫 No genres found");
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

  // 🎯 Filter: only genre
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
  // 🎯 Filter: by genre
  const filtered = albums.filter(
    (a) =>
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase())
  );

  // 🔢 Sort by stock
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
  // 🎯 Filter: by genre and budget
  const filtered = albums.filter(
    (a) =>
      typeof a.genre === "string" &&
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) &&
      a.price <= budget
  );

  // 🔢 Sorting by price
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
    console.warn("🚫 No watched albums available for format analysis");
    return [];
  }

  // Detect dominant format from the watched list
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
    console.warn("🚫 No formats found.");
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

  // 🎯 Filter: whole store → dominant format + chosen genre
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

  // 🎯 Filter: vinyl + chosen genre
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

  // Filter: only vinyl and selected genre, excluding already used
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
// HAMBURGER MENU + Apply Filters + Links 🎯
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const overlay = document.querySelector(".mobile-overlay");
  const applyFiltersBtn = document.querySelector(".apply-filters-btn");
  const formatLinks = document.querySelectorAll("#sideMenu [data-format]");
  const genreLinks = document.querySelectorAll("#sideMenu [data-genre]");

  // Hamburger button
  hamburgerBtn.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    overlay.classList.toggle("hidden");
    updateCartCount();
    updateWatchCount();
  });

  // Click on overlay closes the menu
  overlay.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    overlay.classList.add("hidden");
  });

  // Click on format links
  formatLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const clickedValue = link.getAttribute("data-format");
      formatLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Click on genre links
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

  // Reset button
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

  // Apply Filters button
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

  // Buttons and panels (desktop + mobile)
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

  //  Click on main-nav WATCH button (toggle)
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

  //  Click on main-nav CART button (toggle)
  cartNavBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    const isVisible =
      !cartPanel.classList.contains("hidden") &&
      cartPanel.style.display !== "none";

    if (isVisible) {
      // If already visible, close it
      cartPanel.classList.add("hidden");
      cartPanel.style.display = "none";
    } else {
      //  Otherwise, open it
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
////////// JSON call for const albums  ///////////////

fetch("albums.json")
  .then((res) => res.json())
  .then((data) => {
    albums = data;
    filteredAlbumsGlobal = albums;

    renderAlbums(1, albums);
    setupPagination(albums);
  })
  .catch((err) => console.error("Error loading JSON file:", err));

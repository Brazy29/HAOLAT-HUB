/* ===========================
       PRODUCT DATA & IMAGE LINKS
       Using Unsplash dynamic source queries so the visuals match each category.
       These are stable public image source endpoints (Unsplash's Source API).
       ============================ */
const products = [
  {
    id: "jersey-scarf",
    title: "Jersey Scarfs / Scarf Bouquet",
    desc: "Soft jersey scarves arranged in an elegant bouquet style. Pastel palette, delicate drape.",
    img: "/assets/jersey.jpg",
  },
  {
    id: "all-scarfs",
    title: "All Kinds of Scarfs",
    desc: "A curated variety of patterned and plain scarves — perfect for every look.",
    img: "https://m.media-amazon.com/images/I/81Bl0GgU+AL._AC_SL1500_.jpg",
  },
  {
    id: "abaya",
    title: "Abaya",
    desc: "Minimal, premium abaya displayed gracefully — timeless and modest.",
    img: "https://i.ytimg.com/vi/vvYu6WD8GgI/maxresdefault.jpg",
  },
  {
    id: "jalab",
    title: "Jalab / Jalabiya",
    desc: "Traditional jalab outfit, richly textured and elegantly styled.",
    img: "https://s.alicdn.com/@sc04/kf/H4ebb19c5120748ea83aa69ec9dad202bn/CCY-2025-Jalabiya-Islamic-Clothes-Embroidery-Moroccan-Robes-Designer-Muslim-Saudi-Arab-Long-Kaftan-Jubah-Thobe-for-Men.jpg",
  },
  {
    id: "cosmetics",
    title: "Cosmetics & Toiletries",
    desc: "Luxury creams, perfumes and lipsticks arranged on a marble surface.",
    img: "https://www.shutterstock.com/image-photo/vienna-austria-august-11-2015-600nw-383584168.jpg",
  },
  {
    id: "perfumes",
    title: "Perfumes",
    desc: "Luxury perfume bottles with gold accents and refined presentation.",
    img: "https://hips.hearstapps.com/hmg-prod/images/elm120118btyfragrance-006-1543439911.jpg?crop=0.864xw:0.692xh;0,0.308xh&resize=640:*",
  },
  {
    id: "ready-to-wear",
    title: "Ready to Wear",
    desc: "Modest ready-to-wear outfit flatlay — effortless everyday elegance.",
    img: "https://kimatv.com/resources/media2/16x9/full/1015/center/80/5c41ac05-b13f-4848-82f0-dbd2137c1fc0-large16x9_a.jpg",
  },
  {
    id: "tote-bags",
    title: "Tote Bags",
    desc: "Stylish tote bags presented against a clean background.",
    img: "https://pictures-nigeria.jijistatic.net/149881662_NjIwLTcyOC0xNDY4M2E3ZThiLTE.webp",
  },
];

/* ---------- Populate slider & grid ---------- */
const slider = document.getElementById("slider");
const grid = document.getElementById("grid");
const dotsWrap = document.getElementById("dots");

function createSlide(product) {
  const s = document.createElement("div");
  s.className = "slide";
  s.dataset.id = product.id;
  s.innerHTML = `
        <img src="${product.img}" alt="${escapeHtml(
    product.title
  )}" loading="lazy">
        <div class="overlay">${escapeHtml(product.title)}</div>
      `;
  // click opens modal
  s.addEventListener("click", () => openModal(product));
  return s;
}

function createCard(product) {
  const c = document.createElement("div");
  c.className = "card";
  c.dataset.id = product.id;
  c.innerHTML = `
        <img src="${product.img}" alt="${escapeHtml(
    product.title
  )}" loading="lazy">
        <div class="meta">
          <h4>${escapeHtml(product.title)}</h4>
          <p>${escapeHtml(product.desc)}</p>
        </div>
      `;
  c.addEventListener("click", () => openModal(product));
  return c;
}

// safety helper
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

// fill slider with slides
products.forEach((p) => slider.appendChild(createSlide(p)));
// duplicate slides to help smooth infinite feeling (we'll manage looping with index)
products.forEach((p) => slider.appendChild(createSlide(p)));

// fill grid
products.forEach((p) => grid.appendChild(createCard(p)));

/* ---------- Slider Logic (auto-scroll every 1s) ---------- */
let currentIndex = 0; // index within products
const slideWidth = () => {
  // width of a slide (including gap)
  const firstSlide = slider.querySelector(".slide");
  if (!firstSlide) return 340;
  const style = getComputedStyle(firstSlide);
  const margin = 12; // gap set in CSS
  return firstSlide.offsetWidth + margin;
};

// set transform position based on currentIndex
function goToIndex(i, animate = true) {
  const w = slideWidth();
  const x = -(i * w);
  if (!animate) slider.style.transition = "none";
  else slider.style.transition = "transform 600ms cubic-bezier(.2,.9,.3,1)";
  slider.style.transform = `translateX(${x}px)`;
  setTimeout(() => {
    if (!animate) slider.style.transition = "";
  }, 40);
  updateDots(i % products.length);
}

// dots
function setupDots() {
  for (let i = 0; i < products.length; i++) {
    const d = document.createElement("div");
    d.className = "dot";
    d.addEventListener("click", () => {
      currentIndex = i;
      goToIndex(currentIndex);
      restartAutoScroll();
    });
    dotsWrap.appendChild(d);
  }
  updateDots(0);
}
function updateDots(active) {
  const ds = dotsWrap.querySelectorAll(".dot");
  ds.forEach((el, idx) => el.classList.toggle("active", idx === active));
}

setupDots();

// auto-scroll timer
let autoTimer = null;
function startAutoScroll() {
  stopAutoScroll();
  autoTimer = setInterval(() => {
    currentIndex++;
    // To keep movement smooth we allow index to go up to products.length*2 - 1 (since we duplicated slides)
    const maxIndex = products.length * 2 - 1;
    if (currentIndex > maxIndex) {
      // snap back without animation to the start duplicate
      goToIndex(products.length - 1, false);
      currentIndex = products.length;
      requestAnimationFrame(() => goToIndex(currentIndex)); // then animate to next
    } else {
      goToIndex(currentIndex);
    }
  }, 1000); // 1 second per your requirement
}
function stopAutoScroll() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}
function restartAutoScroll() {
  stopAutoScroll();
  startAutoScroll();
}

// prev/next buttons
document.getElementById("prevBtn").addEventListener("click", () => {
  currentIndex = Math.max(0, currentIndex - 1);
  goToIndex(currentIndex);
  restartAutoScroll();
});
document.getElementById("nextBtn").addEventListener("click", () => {
  currentIndex++;
  goToIndex(currentIndex);
  restartAutoScroll();
});

// pause on hover
const sliderWrap = document.getElementById("sliderWrap");
sliderWrap.addEventListener("mouseenter", stopAutoScroll);
sliderWrap.addEventListener("mouseleave", startAutoScroll);

// make slider draggable on touch / mouse
(function addDragSupport() {
  let isDown = false,
    startX,
    scrollStart;
  let startTransformX = 0;
  slider.addEventListener("pointerdown", (e) => {
    isDown = true;
    slider.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startTransformX = getCurrentTranslateX();
    stopAutoScroll();
  });
  window.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    slider.style.transition = "none";
    slider.style.transform = `translateX(${startTransformX + dx}px)`;
  });
  window.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;
    slider.releasePointerCapture(e.pointerId);
    slider.style.transition = "";
    // settle to nearest slide
    const w = slideWidth();
    const curTranslate = -getCurrentTranslateX();
    const idx = Math.round(curTranslate / w);
    currentIndex = Math.max(0, idx);
    goToIndex(currentIndex);
    restartAutoScroll();
  });

  function getCurrentTranslateX() {
    const st = getComputedStyle(slider).transform;
    if (st === "none") return 0;
    const m = new DOMMatrixReadOnly(st);
    return m.m41;
  }
})();

// helper: read matrix value to compute visible index quickly
function getVisibleIndex() {
  const tx = getComputedStyle(slider).transform;
  if (tx === "none") return 0;
  const m = new DOMMatrixReadOnly(tx);
  const w = slideWidth();
  return Math.round(-m.m41 / w);
}

// init
currentIndex = 0;
goToIndex(0, false);
startAutoScroll();

// ensure slider reflows on resize
window.addEventListener("resize", () => {
  goToIndex(getVisibleIndex(), false);
});

/* ---------- Modal ---------- */
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
document.getElementById("year").textContent = new Date().getFullYear();

function openModal(p) {
  modalContent.innerHTML = `
        <div style="display:flex;gap:18px;flex-direction:row;align-items:stretch">
          <div style="flex:1;min-width:240px">
            <img src="${p.img}" alt="${p.title}" style="width:100%;height:420px;object-fit:cover;border-radius:8px;display:block" />
          </div>
          <div style="flex:1;padding:6px 0">
            <h2 style="margin:0 0 8px">${p.title}</h2>
            <p style="margin:0 0 12px">${p.desc}</p>
            <p style="font-weight:800;margin:8px 0">₦ — price on request</p>
            <button class="cta" style="margin-top:10px" onclick="alert('Buy flow simulated — integrate payment gateway (JazzCash/Easypaisa) server-side')">Buy Now</button>
          </div>
        </div>
      `;
  modalBackdrop.style.display = "flex";
  modalBackdrop.setAttribute("aria-hidden", "false");
}
closeModal.addEventListener("click", () => {
  modalBackdrop.style.display = "none";
  modalBackdrop.setAttribute("aria-hidden", "true");
});
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) {
    modalBackdrop.style.display = "none";
    modalBackdrop.setAttribute("aria-hidden", "true");
  }
});

/* ---------- Theme Toggle ---------- */
const themeBtn = document.getElementById("themeToggle");
function applyTheme(theme) {
  if (theme === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
  localStorage.setItem("haolat_theme", theme);
}
themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  applyTheme(isDark ? "dark" : "light");
});
// initial
const savedTheme =
  localStorage.getItem("haolat_theme") ||
  (window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
applyTheme(savedTheme);

/* ---------- Explore button scroll ---------- */
document.getElementById("exploreBtn").addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Accessibility small improvements ---------- */
// keyboard left/right for slider
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    document.getElementById("prevBtn").click();
  }
  if (e.key === "ArrowRight") {
    document.getElementById("nextBtn").click();
  }
  if (e.key === "Escape") {
    modalBackdrop.style.display = "none";
    modalBackdrop.setAttribute("aria-hidden", "true");
  }
});


import { BRAND_INFO, HERO_SLIDES, DRESSES_CATALOG, CATEGORIES } from './data/dressesData.js';

// ==========================================================================
// GLOBAL APPLICATION STATE
// ==========================================================================
class AppState {
  constructor() {
    this.brand = BRAND_INFO;
    this.heroSlides = HERO_SLIDES;
    this.catalog = DRESSES_CATALOG;
    this.categories = CATEGORIES;

    // Active state
    this.currentHeroIndex = 0;
    this.activeCategory = "All Dresses";
    this.searchQuery = "";
    
    // User selections
    this.wishlist = new Set(["dress-guinness"]);
    this.cart = [
      {
        id: "cart-init-guinness",
        dressId: "dress-kanchipuram",
        title: "Royal Crimson Kanchipuram Silk Saree",
        price: 2850,
        size: "Standard Saree (6.3m)",
        color: "Crimson Red & Gold",
        quantity: 1,
        image: "images/kanchipuram_red.jpg"
      }
    ];

    // Modals & Drawers
    this.selectedDress = null;
    this.selectedThumbnailIndex = 0;
    this.selectedSize = "Standard Saree (6.3m)";
    this.selectedColorIndex = 0;
    this.detailQuantity = 1;
    this.customFitNote = "";

    this.isCartOpen = false;
    this.isWishlistOpen = false;
    this.isSizeGuideOpen = false;
    this.isHistoryModalOpen = false;
    this.toastMessage = null;
    this.toastTimeout = null;

    // Postal shipping calculator state
    this.postalCode = "";
    this.shippingEstimate = null;

    // Autoplay timer
    this.heroTimer = null;
  }

  // --- Wishlist Methods ---
  toggleWishlist(dressId) {
    if (this.wishlist.has(dressId)) {
      this.wishlist.delete(dressId);
      this.showToast("Removed from Favourites ♡");
    } else {
      this.wishlist.add(dressId);
      this.showToast("Added to Favourites! ♥");
    }
    renderApp();
  }

  // --- Cart Methods ---
  addToCart(dress, size = "M", color = "Default", qty = 1, fitNote = "") {
    const existingIndex = this.cart.findIndex(
      item => item.dressId === dress.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += qty;
    } else {
      this.cart.push({
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        dressId: dress.id,
        title: dress.title,
        price: dress.price,
        size: size,
        color: color,
        quantity: qty,
        image: dress.mainImage,
        fitNote: fitNote
      });
    }

    this.showToast(`Added "${dress.title}" to Shopping Bag! 🛒`);
    renderApp();
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(item => item.id !== cartItemId);
    this.showToast("Item removed from Bag");
    renderApp();
  }

  updateCartQuantity(cartItemId, delta) {
    const item = this.cart.find(i => i.id === cartItemId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(cartItemId);
        return;
      }
    }
    renderApp();
  }

  moveToCartFromWishlist(dressId) {
    const dress = this.catalog.find(d => d.id === dressId);
    if (dress) {
      this.addToCart(dress, dress.sizes[0] || "Standard", dress.colors[0]?.name || "Default", 1);
      this.wishlist.delete(dressId);
    }
  }

  // --- Detail Modal Methods ---
  openDetailModal(dressId) {
    const dress = this.catalog.find(d => d.id === dressId);
    if (dress) {
      this.selectedDress = dress;
      this.selectedThumbnailIndex = 0;
      this.selectedSize = dress.sizes[0] || "M";
      this.selectedColorIndex = 0;
      this.detailQuantity = 1;
      this.customFitNote = "";
      this.shippingEstimate = null;
      renderApp();
    }
  }

  closeDetailModal() {
    this.selectedDress = null;
    renderApp();
  }

  // --- Shipping Calculator ---
  calculateShipping(zip) {
    if (!zip || zip.trim().length < 3) {
      this.shippingEstimate = { error: "Please enter a valid postal / ZIP code" };
    } else {
      this.shippingEstimate = {
        postal: zip,
        timeframe: "2 - 4 Business Days",
        courier: "The Chennai Silks Express Luxury Courier",
        cost: "$0.00 (Complimentary Showroom Delivery)"
      };
    }
    renderApp();
  }

  // --- Toast Notification ---
  showToast(msg) {
    this.toastMessage = msg;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
      renderApp();
    }, 3200);
  }

  // --- Hero Controls ---
  nextSlide() {
    this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroSlides.length;
    renderApp();
  }

  prevSlide() {
    this.currentHeroIndex = (this.currentHeroIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
    renderApp();
  }

  startHeroAutoplay() {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.heroTimer = setInterval(() => {
      this.nextSlide();
    }, 7000);
  }

  stopHeroAutoplay() {
    if (this.heroTimer) clearInterval(this.heroTimer);
  }
}

export const state = new AppState();
state.startHeroAutoplay();

// ==========================================================================
// RENDER ENGINE
// ==========================================================================
export function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const filteredDresses = state.catalog.filter(dress => {
    const matchesCategory = state.activeCategory === "All Dresses" || dress.category === state.activeCategory;
    const matchesSearch = !state.searchQuery || 
      dress.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      dress.tag.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      dress.fabric.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.size;

  root.innerHTML = `
    <div class="min-h-screen bg-[#0b0c10] text-[#f5f5f7]">
      <!-- TOP HERITAGE STRIP -->
      ${renderTopHeritageBar()}

      <!-- HEADER -->
      ${renderHeader(cartCount, wishlistCount)}

      <!-- HERO SLIDER SECTION -->
      ${renderHeroSlider()}

      <!-- HERITAGE SPOTLIGHT BANNER -->
      ${renderGuinnessSpotlight()}

      <!-- MAIN CONTENT FEED -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- CATEGORY & SEARCH FILTER BAR -->
        ${renderFilterBar(filteredDresses.length)}

        <!-- DRESS FEED GRID -->
        ${renderDressGrid(filteredDresses)}
      </main>

      <!-- FOOTER -->
      ${renderFooter()}

      <!-- DETAIL COLLECTION MODAL -->
      ${state.selectedDress ? renderDetailModal() : ''}

      <!-- CART SLIDE-OVER DRAWER -->
      ${state.isCartOpen ? renderCartDrawer() : ''}

      <!-- WISHLIST SLIDE-OVER DRAWER -->
      ${state.isWishlistOpen ? renderWishlistDrawer() : ''}

      <!-- BRAND HISTORY MODAL -->
      ${state.isHistoryModalOpen ? renderHistoryModal() : ''}

      <!-- SIZE GUIDE MODAL -->
      ${state.isSizeGuideOpen ? renderSizeGuideModal() : ''}

      <!-- TOAST NOTIFICATION -->
      ${state.toastMessage ? renderToast() : ''}
    </div>
  `;

  bindEvents();
}

// ==========================================================================
// TOP HERITAGE ANNOUNCEMENT STRIP
// ==========================================================================
function renderTopHeritageBar() {
  return `
    <div class="bg-gradient-to-r from-[#0b0c10] via-[#d4af37]/20 to-[#0b0c10] border-b border-[#d4af37]/30 text-xs py-2 px-4 text-center text-[#d4af37] font-medium flex items-center justify-center gap-4">
      <span>🏆 <strong>Guinness World Record Holder</strong>: $100,021 Most Expensive Silk Saree</span>
      <span class="hidden md:inline">•</span>
      <span class="hidden md:inline">Est. 1962 by Thiru. A. Kulandaivel Mudaliar</span>
      <button id="btn-open-history" class="underline text-white hover:text-[#d4af37] text-[11px] ml-2">Read Heritage Story →</button>
    </div>
  `;
}

// ==========================================================================
// HEADER COMPONENT
// ==========================================================================
function renderHeader(cartCount, wishlistCount) {
  return `
    <header class="sticky top-0 z-40 glass-nav transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Brand Logo -->
        <div class="flex items-center gap-3">
          <a href="#" class="flex flex-col">
            <span class="font-serif text-xl sm:text-2xl font-bold tracking-widest text-white uppercase">
              The Chennai <span class="gold-gradient-text">Silks</span>
            </span>
            <span class="text-[9px] tracking-[0.3em] text-[#d4af37] uppercase font-sans -mt-1 font-semibold">
              Heritage Textiles & Silk Showroom
            </span>
          </a>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#feed" class="text-white hover:text-[#d4af37] transition-colors">Silk Collections</a>
          <a href="#guinness-spotlight" class="text-[#d4af37] hover:underline transition-colors font-semibold">Guinness Record</a>
          <button id="btn-nav-history" class="text-[#9ba1b0] hover:text-[#d4af37] transition-colors">Our History</button>
          <a href="#contact" class="text-[#9ba1b0] hover:text-[#d4af37] transition-colors">Showrooms</a>
        </nav>

        <!-- Header Controls (Search, Wishlist, Cart) -->
        <div class="flex items-center gap-4">
          <!-- Search Bar -->
          <div class="relative hidden sm:block w-48 lg:w-64">
            <input 
              type="text" 
              id="search-input"
              placeholder="Search Kanchipuram, Zari..." 
              value="${state.searchQuery}"
              class="w-full bg-[#15171e] border border-white/10 text-xs text-white rounded-full py-2 pl-9 pr-4 focus:outline-none focus:border-[#d4af37] transition-colors placeholder-[#9ba1b0]"
            />
            <svg class="w-4 h-4 text-[#9ba1b0] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- Wishlist Drawer Trigger -->
          <button id="btn-open-wishlist" class="relative p-2 text-white hover:text-[#e63946] transition-colors flex items-center justify-center">
            <svg class="w-6 h-6" fill="${wishlistCount > 0 ? '#e63946' : 'none'}" stroke="${wishlistCount > 0 ? '#e63946' : 'currentColor'}" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            ${wishlistCount > 0 ? `
              <span class="absolute -top-1 -right-1 bg-[#e63946] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                ${wishlistCount}
              </span>
            ` : ''}
          </button>

          <!-- Cart Drawer Trigger -->
          <button id="btn-open-cart" class="relative btn-gold py-2 px-4 text-xs font-semibold rounded-full flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span class="hidden sm:inline">Bag</span>
            <span class="bg-black/40 text-white px-2 py-0.5 rounded-full text-[10px]">
              ${cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  `;
}

// ==========================================================================
// HERO CAROUSEL SLIDER COMPONENT
// ==========================================================================
function renderHeroSlider() {
  const currentSlide = state.heroSlides[state.currentHeroIndex];
  const dress = state.catalog.find(d => d.id === currentSlide.dressId) || state.catalog[0];
  const isFav = state.wishlist.has(dress.id);

  return `
    <section id="hero" class="relative w-full h-[600px] sm:h-[700px] overflow-hidden bg-[#0b0c10]">
      <!-- Background Image with Dark Vignette Overlay -->
      <div class="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img 
          src="${currentSlide.image}" 
          alt="${currentSlide.title}" 
          class="w-full h-full object-cover object-center scale-105 transition-transform duration-[8000ms] ease-out"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/60"></div>
      </div>

      <!-- Slide Content -->
      <div class="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div class="max-w-2xl animate-fade-in space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] text-xs font-semibold tracking-widest uppercase">
            <span class="w-2 h-2 rounded-full bg-[#d4af37] animate-ping"></span>
            ${currentSlide.tag}
          </div>

          <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            ${currentSlide.title}
          </h1>

          <p class="text-sm sm:text-base text-[#9ba1b0] leading-relaxed max-w-xl">
            ${currentSlide.subtitle}
          </p>

          <div class="flex items-center gap-4 pt-2">
            <span class="text-2xl sm:text-3xl font-bold font-serif text-white">
              $${currentSlide.price.toLocaleString()}
            </span>
            ${currentSlide.originalPrice ? `
              <span class="text-sm text-[#9ba1b0] line-through">
                $${currentSlide.originalPrice.toLocaleString()}
              </span>
            ` : ''}
          </div>

          <!-- Hero Actions (Add to Cart, Favourite, View Details) -->
          <div class="flex flex-wrap items-center gap-4 pt-4">
            <!-- View Collection Detail -->
            <button 
              data-dress-id="${dress.id}" 
              class="btn-detail-trigger btn-gold"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Explore Collection
            </button>

            <!-- Quick Add to Cart -->
            <button 
              data-hero-cart-id="${dress.id}" 
              class="btn-hero-cart btn-outline"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Add to Bag
            </button>

            <!-- Add to Favourite -->
            <button 
              data-fav-id="${dress.id}" 
              class="btn-fav heart-btn ${isFav ? 'active' : ''}" 
              title="Add to Favourites"
            >
              <svg class="w-5 h-5" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        id="btn-prev-hero" 
        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-[#d4af37] text-white hover:text-black border border-white/10 flex items-center justify-center transition-all"
      >
        &#10094;
      </button>

      <button 
        id="btn-next-hero" 
        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-[#d4af37] text-white hover:text-black border border-white/10 flex items-center justify-center transition-all"
      >
        &#10095;
      </button>

      <!-- Slide Indicator Dots -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        ${state.heroSlides.map((slide, index) => `
          <button 
            data-hero-dot="${index}" 
            class="h-2 rounded-full transition-all duration-300 ${index === state.currentHeroIndex ? 'w-8 bg-[#d4af37]' : 'w-2 bg-white/40 hover:bg-white'}"
          ></button>
        `).join('')}
      </div>
    </section>
  `;
}

// ==========================================================================
// GUINNESS RECORD SPOTLIGHT SECTION
// ==========================================================================
function renderGuinnessSpotlight() {
  return `
    <section id="guinness-spotlight" class="py-12 bg-gradient-to-b from-[#0b0c10] via-[#15171e] to-[#0b0c10] border-y border-[#d4af37]/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel p-8 rounded-2xl border border-[#d4af37]/40 shadow-2xl">
          
          <div class="lg:col-span-7 space-y-4">
            <div class="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-widest">
              <span>🏆 World Record Achievement</span>
            </div>

            <h2 class="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Guinness World Record: The Most Expensive Silk Saree
            </h2>

            <p class="text-xs sm:text-sm text-[#9ba1b0] leading-relaxed">
              In 2007, <strong>The Chennai Silks</strong> created history by producing the world's most valuable silk saree, valued at <strong>$100,021 (£50,679 / ₹41 Lakhs)</strong>. Hand-woven over 4,760 artisan hours, it incorporates gold zari reproductions of 11 masterpiece paintings by legendary artist <strong>Raja Ravi Varma</strong>, featuring the centerpiece <em>'Galaxy of Musicians'</em>.
            </p>

            <div class="grid grid-cols-3 gap-4 pt-2">
              <div class="p-3 bg-black/40 rounded-xl border border-white/10 text-center">
                <span class="block font-serif text-lg font-bold text-[#d4af37]">$100,021</span>
                <span class="text-[10px] text-[#9ba1b0] uppercase">Official Valuation</span>
              </div>
              <div class="p-3 bg-black/40 rounded-xl border border-white/10 text-center">
                <span class="block font-serif text-lg font-bold text-[#d4af37]">4,760 Hrs</span>
                <span class="text-[10px] text-[#9ba1b0] uppercase">Master Handloom</span>
              </div>
              <div class="p-3 bg-black/40 rounded-xl border border-white/10 text-center">
                <span class="block font-serif text-lg font-bold text-[#d4af37]">11 Artworks</span>
                <span class="text-[10px] text-[#9ba1b0] uppercase">Raja Ravi Varma</span>
              </div>
            </div>

            <div class="pt-4 flex items-center gap-4">
              <button data-dress-id="dress-guinness" class="btn-detail-trigger btn-gold text-xs">
                View Guinness Saree Details
              </button>
              <button id="btn-open-history-2" class="btn-outline text-xs">
                Our 1962 History
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl border border-white/20">
            <img src="images/guinness.jpg" alt="Guinness World Record Saree" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span class="text-xs text-[#d4af37] font-serif font-bold">Raja Ravi Varma 'Galaxy of Musicians' Silk Saree</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// CATEGORY & FILTER BAR
// ==========================================================================
function renderFilterBar(resultCount) {
  return `
    <div id="feed" class="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
      <!-- Category Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
        ${state.categories.map(cat => `
          <button 
            data-category="${cat}" 
            class="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${state.activeCategory === cat ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' : 'bg-[#15171e] text-[#9ba1b0] hover:text-white border border-white/10'}"
          >
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Result Stats -->
      <div class="text-xs text-[#9ba1b0] tracking-wide">
        Showing <span class="text-white font-bold">${resultCount}</span> Curated Dresses & Silk Sarees
      </div>
    </div>
  `;
}

// ==========================================================================
// DRESS FEED GRID & CARDS
// ==========================================================================
function renderDressGrid(dresses) {
  if (dresses.length === 0) {
    return `
      <div class="py-20 text-center space-y-4">
        <p class="text-lg text-[#9ba1b0]">No dresses match your current filter.</p>
        <button id="btn-reset-filters" class="btn-outline text-xs">Reset All Filters</button>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
      ${dresses.map(dress => renderDressCard(dress)).join('')}
    </div>
  `;
}

function renderDressCard(dress) {
  const isFav = state.wishlist.has(dress.id);

  return `
    <div class="group glass-panel rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-[#d4af37]/40 hover:shadow-2xl hover:shadow-[#d4af37]/10">
      <!-- Card Image & Overlay Actions -->
      <div class="relative aspect-[3/4] overflow-hidden bg-[#15171e]">
        <img 
          src="${dress.mainImage}" 
          alt="${dress.title}" 
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        <!-- Category Tag -->
        <span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]">
          ${dress.tag}
        </span>

        <!-- Favourite Heart Toggle Button -->
        <button 
          data-fav-id="${dress.id}" 
          class="btn-fav absolute top-4 right-4 heart-btn ${isFav ? 'active' : ''}" 
          title="Add to Favourites"
        >
          <svg class="w-4 h-4" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>

        <!-- Quick View Overlay Button -->
        <div class="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button 
            data-dress-id="${dress.id}" 
            class="btn-detail-trigger flex-1 bg-black/80 hover:bg-[#d4af37] text-white hover:text-black py-2.5 px-4 text-xs font-semibold rounded-lg backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            Quick View
          </button>
          <button 
            data-card-cart-id="${dress.id}" 
            class="btn-quick-cart bg-[#d4af37] text-black p-2.5 rounded-lg hover:bg-white transition-colors"
            title="Quick Add to Bag"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Card Details -->
      <div class="p-6 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs text-[#9ba1b0] uppercase tracking-wider font-medium">${dress.category}</span>
          <div class="flex items-center gap-1 text-xs text-[#d4af37]">
            ★ <span class="text-white font-semibold">${dress.rating}</span>
            <span class="text-[#9ba1b0]">(${dress.reviewsCount})</span>
          </div>
        </div>

        <h3 
          data-dress-id="${dress.id}" 
          class="btn-detail-trigger font-serif text-lg font-bold text-white hover:text-[#d4af37] cursor-pointer transition-colors line-clamp-1"
        >
          ${dress.title}
        </h3>

        <div class="flex items-baseline justify-between pt-2 border-t border-white/5">
          <div class="flex items-baseline gap-2">
            <span class="font-serif text-xl font-bold text-white">$${dress.price.toLocaleString()}</span>
            ${dress.originalPrice ? `<span class="text-xs text-[#9ba1b0] line-through">$${dress.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <span class="text-[11px] text-[#9ba1b0]">${dress.stock}</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// DETAILED COLLECTION VIEW (DYNAMIC MODAL)
// ==========================================================================
function renderDetailModal() {
  const dress = state.selectedDress;
  if (!dress) return '';

  const isFav = state.wishlist.has(dress.id);
  const activeImage = dress.thumbnails[state.selectedThumbnailIndex] || dress.mainImage;

  return `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div class="relative w-full max-w-6xl glass-panel rounded-2xl overflow-hidden border border-white/15 my-auto max-h-[90vh] overflow-y-auto">
        
        <!-- Close Modal Button -->
        <button 
          id="btn-close-detail" 
          class="sticky top-4 right-4 z-10 float-right w-10 h-10 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all"
        >
          ✕
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
          
          <!-- LEFT: GALLERY WITH ZOOM & THUMBNAILS (6 cols) -->
          <div class="lg:col-span-6 space-y-4">
            <div class="zoom-container aspect-[3/4] bg-[#15171e] rounded-xl border border-white/10 relative">
              <img 
                src="${activeImage}" 
                alt="${dress.title}" 
                id="main-zoom-img"
              />
              <span class="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-[#9ba1b0]">
                Hover to Zoom 🔍
              </span>
            </div>

            <!-- Multi-Angle Thumbnails -->
            <div class="flex items-center gap-3 overflow-x-auto pb-2">
              ${dress.thumbnails.map((thumb, idx) => `
                <button 
                  data-thumb-idx="${idx}" 
                  class="btn-thumb-select w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === state.selectedThumbnailIndex ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}"
                >
                  <img src="${thumb}" class="w-full h-full object-cover" />
                </button>
              `).join('')}
            </div>

            <!-- SUB-COLLECTION MATCHING LOOKS & ACCESSORIES -->
            ${dress.subCollections && dress.subCollections.length > 0 ? `
              <div class="pt-4 border-t border-white/10 space-y-3">
                <h4 class="text-xs uppercase font-semibold text-[#d4af37] tracking-wider">Matching Accessories & Temple Jewelry</h4>
                <div class="grid grid-cols-2 gap-3">
                  ${dress.subCollections.map(acc => `
                    <div class="p-3 rounded-lg bg-[#15171e] border border-white/5 flex items-center gap-3">
                      <img src="${acc.image}" class="w-12 h-12 object-cover rounded-md" />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-white truncate">${acc.name}</p>
                        <p class="text-[11px] text-[#9ba1b0]">$${acc.price}</p>
                      </div>
                      <button 
                        data-add-acc-id="${acc.id}" 
                        data-acc-title="${acc.name}" 
                        data-acc-price="${acc.price}"
                        class="btn-add-acc text-xs text-[#d4af37] hover:underline font-semibold"
                      >
                        + Add
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- RIGHT: COMPREHENSIVE PURCHASING & DETAIL PANEL (6 cols) -->
          <div class="lg:col-span-6 space-y-6">
            <div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">${dress.tag}</span>
                <span class="text-xs text-[#9ba1b0]">${dress.stock}</span>
              </div>
              <h2 class="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">${dress.title}</h2>
              <div class="flex items-center gap-2 mt-2 text-sm text-[#d4af37]">
                ★ <span class="font-bold text-white">${dress.rating}</span>
                <span class="text-[#9ba1b0]">(${dress.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <!-- Pricing -->
            <div class="flex items-baseline gap-3 pb-4 border-b border-white/10">
              <span class="font-serif text-3xl font-bold text-white">$${dress.price.toLocaleString()}</span>
              ${dress.originalPrice ? `<span class="text-base text-[#9ba1b0] line-through">$${dress.originalPrice.toLocaleString()}</span>` : ''}
              <span class="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">Complimentary Worldwide Insured Delivery</span>
            </div>

            <!-- Description -->
            <p class="text-xs sm:text-sm text-[#9ba1b0] leading-relaxed">
              ${dress.description}
            </p>

            <!-- COLOR SWATCH PICKER -->
            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-[#9ba1b0] flex items-center justify-between">
                <span>Color Swatch: <strong class="text-white">${dress.colors[state.selectedColorIndex]?.name}</strong></span>
              </label>
              <div class="flex items-center gap-3">
                ${dress.colors.map((color, idx) => `
                  <button 
                    data-color-idx="${idx}" 
                    class="btn-color-select w-8 h-8 rounded-full border-2 transition-all relative ${idx === state.selectedColorIndex ? 'border-[#d4af37] scale-110 shadow-lg shadow-[#d4af37]/30' : 'border-white/20'}"
                    style="background-color: ${color.hex};"
                    title="${color.name}"
                  >
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- INTERACTIVE SIZE SELECTOR -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold uppercase tracking-wider text-[#9ba1b0]">
                  Select Size: <strong class="text-white">${state.selectedSize}</strong>
                </label>
                <button id="btn-open-sizeguide" class="text-xs text-[#d4af37] hover:underline font-medium">
                  Size & Measurement Guide
                </button>
              </div>

              <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                ${dress.sizes.map(size => `
                  <button 
                    data-size="${size}" 
                    class="btn-size-select py-2.5 text-xs font-semibold rounded-lg border transition-all ${state.selectedSize === size ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-[#15171e] text-white border-white/10 hover:border-white/40'}"
                  >
                    ${size}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- CUSTOM FIT OPTION NOTE -->
            ${state.selectedSize === "Custom Fit" ? `
              <div class="p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 space-y-2 animate-fade-in">
                <label class="text-xs font-semibold text-[#d4af37] block">Bespoke Custom Measurements</label>
                <input 
                  type="text" 
                  id="custom-fit-input" 
                  placeholder="Enter Saree Blouse / Gown Bust, Waist, Hips in inches..." 
                  value="${state.customFitNote}"
                  class="w-full bg-[#15171e] border border-white/15 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            ` : ''}

            <!-- QUANTITY SELECTOR & PRIMARY CTAS -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center gap-4">
                <label class="text-xs font-semibold uppercase tracking-wider text-[#9ba1b0]">Quantity:</label>
                <div class="flex items-center border border-white/15 rounded-lg bg-[#15171e]">
                  <button id="btn-qty-minus" class="w-9 h-9 flex items-center justify-center text-white hover:text-[#d4af37]">-</button>
                  <span class="w-10 text-center text-sm font-semibold">${state.detailQuantity}</span>
                  <button id="btn-qty-plus" class="w-9 h-9 flex items-center justify-center text-white hover:text-[#d4af37]">+</button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <!-- Add to Cart Primary -->
                <button id="btn-modal-add-cart" class="btn-gold py-3 text-xs w-full">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Add to Bag
                </button>

                <!-- Add to Favourite Secondary -->
                <button 
                  data-fav-id="${dress.id}" 
                  class="btn-fav btn-outline py-3 text-xs w-full ${isFav ? 'border-[#e63946] text-[#e63946]' : ''}"
                >
                  <svg class="w-4 h-4" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  ${isFav ? 'In Favourites' : 'Add to Favourite'}
                </button>
              </div>
            </div>

            <!-- SHIPPING ESTIMATOR & ACCORDIONS -->
            <div class="pt-4 border-t border-white/10 space-y-3 text-xs">
              <div class="p-4 rounded-xl bg-[#15171e] border border-white/5 space-y-3">
                <h5 class="font-semibold text-white uppercase tracking-wider">Shipping & Delivery Estimator</h5>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    id="postal-input" 
                    placeholder="Enter ZIP / Postal code..." 
                    value="${state.postalCode}"
                    class="flex-1 bg-[#0b0c10] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                  <button id="btn-calc-shipping" class="btn-outline py-2 px-3 text-xs">Calculate</button>
                </div>
                ${state.shippingEstimate ? `
                  <div class="p-3 rounded bg-black/40 text-xs space-y-1">
                    ${state.shippingEstimate.error ? `
                      <p class="text-rose-400">${state.shippingEstimate.error}</p>
                    ` : `
                      <p class="text-emerald-400 font-semibold">Estimated Delivery: ${state.shippingEstimate.timeframe}</p>
                      <p class="text-[#9ba1b0]">${state.shippingEstimate.courier} | ${state.shippingEstimate.cost}</p>
                    `}
                  </div>
                ` : ''}
              </div>

              <!-- Product Details Accordion -->
              <details class="group p-3 rounded-xl bg-[#15171e] border border-white/5">
                <summary class="font-semibold text-white cursor-pointer flex justify-between items-center">
                  <span>Fabric & Handloom Care</span>
                  <span class="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="pt-3 text-[#9ba1b0] space-y-1">
                  <p><strong>Fabric:</strong> ${dress.fabric}</p>
                  <p><strong>Care Instructions:</strong> ${dress.care}</p>
                </div>
              </details>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;
}

// ==========================================================================
// BRAND HISTORY MODAL
// ==========================================================================
function renderHistoryModal() {
  return `
    <div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div class="bg-[#15171e] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
        
        <div class="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 class="font-serif text-2xl font-bold text-white">The Chennai Silks</h3>
            <p class="text-xs text-[#d4af37] tracking-widest uppercase">A Legacy in Every Stitch • Est. 1962</p>
          </div>
          <button id="btn-close-history" class="text-white hover:text-[#d4af37] text-xl">✕</button>
        </div>

        <div class="space-y-4 text-xs sm:text-sm text-[#9ba1b0] leading-relaxed">
          <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <h4 class="font-bold text-white text-sm">Origins & History</h4>
            <p>
              Founded by <strong>Thiru. A. Kulandaivel Mudaliar</strong>, who entered the textile business in 1962 from a small village near Avinashi. In 1991, the first retail showroom was established in Tirupur as <em>"Kumaran Silks"</em>, later renamed to <strong>"The Chennai Silks"</strong> in 2001.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <h4 class="font-bold text-white text-sm">Guinness World Record (2007)</h4>
            <p>
              In 2007, The Chennai Silks entered the Guinness World Records by weaving the <strong>Most Expensive Silk Saree in history</strong>, valued at $100,021 (₹41 Lakhs). It features hand-woven gold zari reproductions of 11 famous paintings by Indian master <strong>Raja Ravi Varma</strong>, led by his masterpiece <em>'Galaxy of Musicians'</em>.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <h4 class="font-bold text-white text-sm">Global Manufacturing & Exports</h4>
            <p>
              Beyond South India's premier retail chain, The Chennai Silks exports garments across the United States and Europe for leading global retail chains including <strong>Decathlon</strong>, <strong>Carrefour</strong>, and <strong>Hanes</strong>.
            </p>
            <p class="text-xs text-[#d4af37]">
              ⚡ <strong>November 2025 Expansion:</strong> Partnered with the Tamil Nadu Government to establish a state-of-the-art ₹50 crore garment manufacturing unit near Mannargudi.
            </p>
          </div>
        </div>

        <div class="text-center pt-2">
          <button id="btn-close-history-2" class="btn-gold py-2.5 px-6 text-xs">
            Close & Continue Shopping
          </button>
        </div>

      </div>
    </div>
  `;
}

// ==========================================================================
// CART & WISHLIST DRAWERS
// ==========================================================================
function renderCartDrawer() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 500 ? 0 : 45;
  const total = subtotal + shippingCost;

  return `
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fade-in">
      <div class="w-full max-w-md h-full bg-[#15171e] border-l border-white/10 flex flex-col justify-between p-6 overflow-y-auto">
        
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 class="font-serif text-xl font-bold text-white flex items-center gap-2">
              <span>Shopping Bag</span>
              <span class="text-xs font-sans text-[#d4af37] font-normal">(${state.cart.length} items)</span>
            </h3>
            <button id="btn-close-cart" class="text-[#9ba1b0] hover:text-white p-2 text-lg">✕</button>
          </div>

          ${state.cart.length === 0 ? `
            <div class="py-20 text-center space-y-4">
              <p class="text-[#9ba1b0]">Your shopping bag is currently empty.</p>
              <button id="btn-cart-continue" class="btn-gold text-xs">Explore Collections</button>
            </div>
          ` : `
            <div class="divide-y divide-white/5 py-4">
              ${state.cart.map(item => `
                <div class="py-4 flex gap-4">
                  <img src="${item.image}" class="w-20 h-24 object-cover rounded-lg bg-black/40 flex-shrink-0" />
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <div class="flex justify-between items-start">
                        <h4 class="text-sm font-semibold text-white font-serif line-clamp-1">${item.title}</h4>
                        <button data-cart-remove="${item.id}" class="btn-cart-remove text-xs text-[#9ba1b0] hover:text-rose-400">✕</button>
                      </div>
                      <p class="text-xs text-[#9ba1b0] mt-0.5">Size: <strong class="text-white">${item.size}</strong></p>
                      ${item.fitNote ? `<p class="text-[10px] text-[#d4af37] mt-0.5">Custom Fit: ${item.fitNote}</p>` : ''}
                    </div>

                    <div class="flex items-center justify-between mt-2">
                      <div class="flex items-center border border-white/10 rounded bg-[#0b0c10]">
                        <button data-cart-qty-minus="${item.id}" class="btn-cart-minus px-2 text-xs text-[#9ba1b0] hover:text-white">-</button>
                        <span class="px-2 text-xs font-semibold">${item.quantity}</span>
                        <button data-cart-qty-plus="${item.id}" class="btn-cart-plus px-2 text-xs text-[#9ba1b0] hover:text-white">+</button>
                      </div>
                      <span class="font-serif text-sm font-bold text-white">$${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        ${state.cart.length > 0 ? `
          <div class="pt-4 border-t border-white/10 space-y-4">
            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-[#9ba1b0]">
                <span>Subtotal</span>
                <span class="text-white font-semibold">$${subtotal.toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-[#9ba1b0]">
                <span>Insured Express Shipping</span>
                <span class="text-white font-semibold">${shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost}`}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                <span>Total Amount</span>
                <span class="font-serif text-lg text-[#d4af37]">$${total.toLocaleString()}</span>
              </div>
            </div>

            <button id="btn-checkout" class="btn-gold w-full py-3.5 text-xs uppercase tracking-wider">
              Proceed to Secure Checkout 🔒
            </button>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}

function renderWishlistDrawer() {
  const favoritedDresses = state.catalog.filter(d => state.wishlist.has(d.id));

  return `
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fade-in">
      <div class="w-full max-w-md h-full bg-[#15171e] border-l border-white/10 flex flex-col justify-between p-6 overflow-y-auto">
        
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 class="font-serif text-xl font-bold text-white flex items-center gap-2">
              <span>Saved Favourites</span>
              <span class="text-xs font-sans text-[#e63946] font-normal">♥ (${favoritedDresses.length})</span>
            </h3>
            <button id="btn-close-wishlist" class="text-[#9ba1b0] hover:text-white p-2 text-lg">✕</button>
          </div>

          ${favoritedDresses.length === 0 ? `
            <div class="py-20 text-center space-y-4">
              <p class="text-[#9ba1b0]">You haven't saved any dresses yet.</p>
              <button id="btn-wishlist-explore" class="btn-outline text-xs">Browse Collections</button>
            </div>
          ` : `
            <div class="divide-y divide-white/5 py-4">
              ${favoritedDresses.map(dress => `
                <div class="py-4 flex gap-4 items-center">
                  <img src="${dress.mainImage}" class="w-20 h-24 object-cover rounded-lg bg-black/40 flex-shrink-0" />
                  <div class="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div class="flex justify-between items-start">
                        <h4 class="text-sm font-semibold text-white font-serif line-clamp-1">${dress.title}</h4>
                        <button data-fav-id="${dress.id}" class="btn-fav text-xs text-[#9ba1b0] hover:text-rose-400">✕</button>
                      </div>
                      <p class="text-xs text-[#d4af37] font-serif font-bold mt-1">$${dress.price.toLocaleString()}</p>
                    </div>

                    <button 
                      data-wishlist-move-id="${dress.id}" 
                      class="btn-wishlist-move btn-gold py-1.5 px-3 text-[11px] w-full"
                    >
                      Move to Bag 🛒
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}

function renderSizeGuideModal() {
  return `
    <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-[#15171e] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-white/10">
          <h3 class="font-serif text-lg font-bold text-white">Size & Measurement Guide</h3>
          <button id="btn-close-sizeguide" class="text-white hover:text-[#d4af37]">✕</button>
        </div>

        <table class="w-full text-xs text-left text-[#9ba1b0]">
          <thead class="text-white uppercase bg-white/5 border-b border-white/10">
            <tr>
              <th class="p-2.5">Size</th>
              <th class="p-2.5">Bust / Chest (in)</th>
              <th class="p-2.5">Waist (in)</th>
              <th class="p-2.5">Saree Length</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr><td class="p-2.5 font-bold text-white">Standard Saree</td><td class="p-2.5">Unstitched Blouse</td><td class="p-2.5">Free Size</td><td class="p-2.5">6.3 Meters</td></tr>
            <tr><td class="p-2.5 font-bold text-white">S (Small)</td><td class="p-2.5">32-34</td><td class="p-2.5">25-27</td><td class="p-2.5">Gown Floor Length</td></tr>
            <tr><td class="p-2.5 font-bold text-white">M (Medium)</td><td class="p-2.5">35-37</td><td class="p-2.5">28-30</td><td class="p-2.5">Gown Floor Length</td></tr>
            <tr><td class="p-2.5 font-bold text-white">L (Large)</td><td class="p-2.5">38-40</td><td class="p-2.5">31-33</td><td class="p-2.5">Gown Floor Length</td></tr>
            <tr><td class="p-2.5 font-bold text-white">Custom Fit</td><td class="p-2.5">Tailored</td><td class="p-2.5">Tailored</td><td class="p-2.5">Bespoke Fit</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderToast() {
  return `
    <div class="fixed bottom-6 right-6 z-50 bg-[#15171e] border border-[#d4af37] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
      <span class="text-lg">✨</span>
      <span class="text-xs font-semibold tracking-wide">${state.toastMessage}</span>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer id="contact" class="border-t border-white/10 bg-[#0b0c10] py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div class="space-y-4">
          <span class="font-serif text-xl font-bold tracking-widest text-white uppercase">
            The Chennai <span class="gold-gradient-text">Silks</span>
          </span>
          <p class="text-xs text-[#9ba1b0] leading-relaxed">
            Leading retail textile chain across South India, established in 1962 by Thiru. A. Kulandaivel Mudaliar. Home of the Guinness World Record Saree.
          </p>
        </div>

        <div>
          <h5 class="text-xs uppercase font-bold text-white tracking-widest mb-4">Showroom Collections</h5>
          <ul class="space-y-2 text-xs text-[#9ba1b0]">
            <li><a href="#guinness-spotlight" class="hover:text-[#d4af37]">Guinness World Record Saree</a></li>
            <li><a href="#feed" class="hover:text-[#d4af37]">Pure Kanchipuram Silk Sarees</a></li>
            <li><a href="#feed" class="hover:text-[#d4af37]">Haute Couture Silk Gowns</a></li>
            <li><a href="#feed" class="hover:text-[#d4af37]">Bridal Trousseau Collections</a></li>
          </ul>
        </div>

        <div>
          <h5 class="text-xs uppercase font-bold text-white tracking-widest mb-4">Global Manufacturing</h5>
          <ul class="space-y-2 text-xs text-[#9ba1b0]">
            <li><span class="text-white font-medium">Export Partners:</span> Decathlon, Carrefour, Hanes</li>
            <li><span class="text-white font-medium">New Facility:</span> ₹50 Crore Unit at Mannargudi</li>
            <li><span class="text-white font-medium">Tirupur Origins:</span> Est. 1991 (Kumaran Silks)</li>
          </ul>
        </div>

        <div class="space-y-4">
          <h5 class="text-xs uppercase font-bold text-white tracking-widest">Showroom Insider</h5>
          <p class="text-xs text-[#9ba1b0]">Subscribe for exclusive launches and silk trousseau preview invites.</p>
          <div class="flex">
            <input type="email" placeholder="Enter email address..." class="bg-[#15171e] border border-white/15 text-xs text-white px-3 py-2 rounded-l-lg focus:outline-none focus:border-[#d4af37] w-full" />
            <button class="btn-gold text-xs rounded-r-lg rounded-l-none px-4">Subscribe</button>
          </div>
        </div>
      </div>
      <div class="mt-12 text-center text-[11px] text-[#9ba1b0] pt-6 border-t border-white/5">
        © 2026 The Chennai Silks. All Rights Reserved. Guinness World Record Certified.
      </div>
    </footer>
  `;
}

// ==========================================================================
// EVENT BINDINGS
// ==========================================================================
function bindEvents() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderApp();
      const newInput = document.getElementById('search-input');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    });
  }

  // Drawers Toggles
  document.getElementById('btn-open-cart')?.addEventListener('click', () => { state.isCartOpen = true; renderApp(); });
  document.getElementById('btn-close-cart')?.addEventListener('click', () => { state.isCartOpen = false; renderApp(); });
  document.getElementById('btn-cart-continue')?.addEventListener('click', () => { state.isCartOpen = false; renderApp(); });
  
  document.getElementById('btn-open-wishlist')?.addEventListener('click', () => { state.isWishlistOpen = true; renderApp(); });
  document.getElementById('btn-close-wishlist')?.addEventListener('click', () => { state.isWishlistOpen = false; renderApp(); });
  document.getElementById('btn-wishlist-explore')?.addEventListener('click', () => { state.isWishlistOpen = false; renderApp(); });

  // History Modal
  const openHist = () => { state.isHistoryModalOpen = true; renderApp(); };
  const closeHist = () => { state.isHistoryModalOpen = false; renderApp(); };
  document.getElementById('btn-open-history')?.addEventListener('click', openHist);
  document.getElementById('btn-open-history-2')?.addEventListener('click', openHist);
  document.getElementById('btn-nav-history')?.addEventListener('click', openHist);
  document.getElementById('btn-close-history')?.addEventListener('click', closeHist);
  document.getElementById('btn-close-history-2')?.addEventListener('click', closeHist);

  // Hero Slider Navigation
  document.getElementById('btn-prev-hero')?.addEventListener('click', () => state.prevSlide());
  document.getElementById('btn-next-hero')?.addEventListener('click', () => state.nextSlide());
  
  document.querySelectorAll('[data-hero-dot]').forEach(dot => {
    dot.addEventListener('click', (e) => {
      state.currentHeroIndex = parseInt(e.currentTarget.getAttribute('data-hero-dot'));
      renderApp();
    });
  });

  document.querySelectorAll('.btn-hero-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dressId = e.currentTarget.getAttribute('data-hero-cart-id');
      const dress = state.catalog.find(d => d.id === dressId);
      if (dress) state.addToCart(dress);
    });
  });

  // Category Filter Tabs
  document.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.activeCategory = e.currentTarget.getAttribute('data-category');
      renderApp();
    });
  });

  document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
    state.activeCategory = "All Dresses";
    state.searchQuery = "";
    renderApp();
  });

  // Detail Modal Open Triggers
  document.querySelectorAll('.btn-detail-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-dress-id');
      if (id) state.openDetailModal(id);
    });
  });

  document.getElementById('btn-close-detail')?.addEventListener('click', () => state.closeDetailModal());

  // Favourite Heart Buttons
  document.querySelectorAll('.btn-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute('data-fav-id');
      if (id) state.toggleWishlist(id);
    });
  });

  // Quick Cart Add on Cards
  document.querySelectorAll('.btn-quick-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute('data-card-cart-id');
      const dress = state.catalog.find(d => d.id === id);
      if (dress) state.addToCart(dress);
    });
  });

  // Modal Gallery Thumbnails Selection
  document.querySelectorAll('.btn-thumb-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.selectedThumbnailIndex = parseInt(e.currentTarget.getAttribute('data-thumb-idx'));
      renderApp();
    });
  });

  // Color & Size Selectors inside Detail Modal
  document.querySelectorAll('.btn-color-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.selectedColorIndex = parseInt(e.currentTarget.getAttribute('data-color-idx'));
      renderApp();
    });
  });

  document.querySelectorAll('.btn-size-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.selectedSize = e.currentTarget.getAttribute('data-size');
      renderApp();
    });
  });

  const fitInput = document.getElementById('custom-fit-input');
  if (fitInput) {
    fitInput.addEventListener('input', (e) => {
      state.customFitNote = e.target.value;
    });
  }

  document.getElementById('btn-qty-minus')?.addEventListener('click', () => {
    if (state.detailQuantity > 1) {
      state.detailQuantity--;
      renderApp();
    }
  });

  document.getElementById('btn-qty-plus')?.addEventListener('click', () => {
    state.detailQuantity++;
    renderApp();
  });

  document.getElementById('btn-modal-add-cart')?.addEventListener('click', () => {
    if (state.selectedDress) {
      const colorName = state.selectedDress.colors[state.selectedColorIndex]?.name || "Default";
      state.addToCart(state.selectedDress, state.selectedSize, colorName, state.detailQuantity, state.customFitNote);
      state.closeDetailModal();
      state.isCartOpen = true;
    }
  });

  // Add Sub-collection Accessory
  document.querySelectorAll('.btn-add-acc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const title = e.currentTarget.getAttribute('data-acc-title');
      const price = parseFloat(e.currentTarget.getAttribute('data-acc-price'));
      const id = e.currentTarget.getAttribute('data-add-acc-id');

      state.addToCart({
        id: id,
        title: title,
        price: price,
        mainImage: "images/kanchipuram_red.jpg"
      }, "Standard", "Default", 1);
    });
  });

  // Shipping Calculator
  const postalInput = document.getElementById('postal-input');
  if (postalInput) {
    postalInput.addEventListener('input', (e) => { state.postalCode = e.target.value; });
  }

  document.getElementById('btn-calc-shipping')?.addEventListener('click', () => {
    state.calculateShipping(state.postalCode);
  });

  // Size Guide Modal Toggles
  document.getElementById('btn-open-sizeguide')?.addEventListener('click', () => { state.isSizeGuideOpen = true; renderApp(); });
  document.getElementById('btn-close-sizeguide')?.addEventListener('click', () => { state.isSizeGuideOpen = false; renderApp(); });

  // Cart Items Actions
  document.querySelectorAll('.btn-cart-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.removeFromCart(e.currentTarget.getAttribute('data-cart-remove'));
    });
  });

  document.querySelectorAll('.btn-cart-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.updateCartQuantity(e.currentTarget.getAttribute('data-cart-qty-minus'), -1);
    });
  });

  document.querySelectorAll('.btn-cart-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.updateCartQuantity(e.currentTarget.getAttribute('data-cart-qty-plus'), 1);
    });
  });

  document.querySelectorAll('.btn-wishlist-move').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dressId = e.currentTarget.getAttribute('data-wishlist-move-id');
      state.moveToCartFromWishlist(dressId);
    });
  });

  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    alert("✨ Thank you for choosing The Chennai Silks! Redirecting to secure SSL Luxury Concierge Checkout...");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

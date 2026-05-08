/* ═══════════════════════════════════════════════════════════════
   Lloyd Davage — Personal Homepage
   main.js
   ═══════════════════════════════════════════════════════════════ */

/**
 * Show a named page panel and update the active nav button.
 * @param {string} pageId  - The id of the <div class="page"> to show
 * @param {HTMLElement} btn - The nav button that was clicked
 */
window.showPage = function(pageId, btn) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(function(p) {
        p.classList.remove('active');
    });

    // Show the requested page
    document.getElementById(pageId).classList.add('active');

    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    if (btn) { btn.classList.add('active'); }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 820) {
        document.getElementById('sidebar').classList.remove('open');
    }
};

/**
 * Toggle the mobile sidebar open/closed.
 */
window.toggleSidebar = function() {
    document.getElementById('sidebar').classList.toggle('open');
};

/**
 * Close the sidebar when clicking outside it on mobile.
 */
document.addEventListener('click', function(e) {
    var sidebar    = document.getElementById('sidebar');
    var hamburger  = document.getElementById('hamburger');

    if (window.innerWidth <= 820 &&
        !sidebar.contains(e.target) &&
        !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

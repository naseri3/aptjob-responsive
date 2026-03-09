/* ======================
   변수
====================== */
const menuLinks = document.querySelectorAll(".mypage-menu__link");

/* ======================
   클릭 시 active
====================== */
menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        menuLinks.forEach(el =>
            el.classList.remove("is-active")
        );
        link.classList.add("is-active");
    });
});


/* ======================
   현재 페이지 자동 active
====================== */
const currentPath = window.location.pathname;
menuLinks.forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
        link.classList.add("is-active");
    }
});



function loadStats() {
  const resume = localStorage.getItem("resumeCount") || 0;
  const apply = localStorage.getItem("applyCount") || 0;
  const favorite = localStorage.getItem("favoriteCount") || 0;
  const recent = localStorage.getItem("recentCount") || 0;

  const statResume = document.getElementById("statResume");
  const statApply = document.getElementById("statApply");
  const statFavorite = document.getElementById("statFavorite");
  const statRecent = document.getElementById("statRecent");

  if (statResume) statResume.textContent = resume;
  if (statApply) statApply.textContent = apply;
  if (statFavorite) statFavorite.textContent = favorite;
  if (statRecent) statRecent.textContent = recent;
}

loadStats();
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
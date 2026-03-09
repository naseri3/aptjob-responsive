// assets/js/common.js
(function () {
    document.addEventListener("DOMContentLoaded", () => {
        loadHeader();
        loadFooter();
        loadTopButton();
        loadBottomNav();
        loadApplyModal();
    });


    function loadHeader() {
        const headerEl = document.getElementById("headerWrap");
        if (!headerEl) return;

        const headerType = document.body.dataset.header || "main";

        const headerMap = {
            main: "/assets/components/header-main.html",
            sub: "/assets/components/header-sub.html",
        };

        const url = headerMap[headerType] || headerMap.main;

        fetch(url, { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error("Header fetch failed: " + res.status);
                return res.text();
            })
            .then((html) => {
                // 1️⃣ header 삽입
                headerEl.innerHTML = html;
                // 2️⃣ 로그인 UI 실행 🔥
                if (typeof checkLoginUI === "function") {
                    checkLoginUI();
                }

            })
            .catch((err) => console.error(err));
    }



    function loadFooter() {
        const footerEl = document.getElementById("footer");
        if (!footerEl) return;

        fetch("/assets/components/footer.html", { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error("Footer fetch failed: " + res.status);
                return res.text();
            })
            .then((html) => {
                footerEl.innerHTML = html;
            })
            .catch((err) => console.error(err));
    }

    function loadTopButton() {
        const wrap = document.getElementById("backToTopWrap");
        if (!wrap) return;

        fetch("/assets/components/topButton.html", { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error("TopButton fetch failed: " + res.status);
                return res.text();
            })
            .then((html) => {
                wrap.innerHTML = html;
                initBackToTop(); // ✅ 로드 후 초기화
            })
            .catch((err) => console.error(err));
    }

    function initBackToTop() {
        const btn = document.getElementById("backToTop");
        if (!btn) return;

        const onScroll = () => {
            if (window.scrollY > 300) btn.classList.add("is-show");
            else btn.classList.remove("is-show");
        };

        window.addEventListener("scroll", onScroll);
        onScroll(); // ✅ 처음 로드 시에도 상태 반영

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
})();


function loadBottomNav() {
    const wrap = document.getElementById("bottomNavWrap");
    if (!wrap) return;

    fetch("/assets/components/bottomNav.html", { cache: "no-store" })
        .then(res => {
            if (!res.ok) throw new Error("BottomNav load failed");
            return res.text();
        })
        .then(html => {
            wrap.innerHTML = html;
            setActiveBottomNav(); // 🔥 페이지별 활성 처리
        })
        .catch(err => console.error(err));
}

function setActiveBottomNav() {
    const page = document.body.dataset.page;

    document
        .querySelectorAll(".bottom-nav__item")
        .forEach(item => item.classList.remove("is-active"));

    if (page === "index") {
        document.querySelector(".bottom-nav__item--home")?.classList.add("is-active");
    }

    if (page === "search") {
        document.querySelector(".bottom-nav__item--search")?.classList.add("is-active");
    }

    if (page === "partner") {
        document.querySelector(".bottom-nav__item--partner")?.classList.add("is-active");
    }

    if (page === "service-center") {
        document.querySelector(".bottom-nav__item--cs")?.classList.add("is-active");
    }

    if (page === "mypage") {
        document.querySelector(".bottom-nav__item--mypage")?.classList.add("is-active");
    }
}


function loadApplyModal() {
    fetch("/assets/components/apply-modal.html", { cache: "no-store" })
        .then(res => {
            if (!res.ok) throw new Error("Apply modal load failed");
            return res.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
        })
        .catch(err => console.error(err));
}

document.addEventListener("click", function (e) {
    const btn = e.target.closest("#mypageBtn");
    if (!btn) return;
    e.preventDefault();
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin === "true") {
        window.location.href = "/myPage/mypage.html";
    } else {
        window.location.href = "/subPage/login.html";
    }
});
/* =================================================
    PC 즐겨찾기
==================================================== */
const favoriteBtn = document.getElementById("favoriteBtn");

favoriteBtn.addEventListener("click", () => {
    favoriteBtn.classList.toggle("is-active");

    favoriteBtn.textContent =
        favoriteBtn.classList.contains("is-active") ? "★" : "★";
});


/* =================================================
    모바일 즐겨찾기
==================================================== */
const mobileFavoriteBtn = document.getElementById("mobileFavoriteBtn");

mobileFavoriteBtn?.addEventListener("click", () => {
    mobileFavoriteBtn.classList.toggle("is-active");
    mobileFavoriteBtn.textContent =
        mobileFavoriteBtn.classList.contains("is-active") ? "★" : "★";
});


/* =========================================================
   지원하기 로직 (로그인 체크 + 리다이렉트 + 모달)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const applyBtns = document.querySelectorAll(".btn-apply, .mobile-apply__btn");
    const applyModalEl = document.getElementById("applyModal");

    //   if (!applyModalEl) return;
    let applyModal = null;

    if (applyModalEl) {
        applyModal = new bootstrap.Modal(applyModalEl);
    }

    //   const applyModal = new bootstrap.Modal(applyModalEl);

    const modalTitle = document.getElementById("applyModalTitle");
    const modalDesc = document.getElementById("applyModalDesc");
    const applyConfirmBtn = document.getElementById("applyConfirmBtn");

    /* ===============================
       1️⃣ 지원 버튼 클릭
    =============================== */

    applyBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            const isLogin = localStorage.getItem("isLogin") === "true";

            // 🔹 로그인 안 된 경우
            if (!isLogin) {

                // 현재 페이지 저장
                sessionStorage.setItem("redirectAfterLogin", window.location.href);

                // 로그인 후 모달 자동 오픈용
                sessionStorage.setItem("openApplyModal", "true");

                // 로그인 페이지 이동
                window.location.href = "/subpage/login.html";
                return;
            }

            // 🔹 로그인 된 경우 → 바로 모달 오픈
            openApplyModal();
        });
    });


    /* ===============================
       2️⃣ 로그인 후 자동 모달 오픈
    =============================== */

    const shouldOpen = sessionStorage.getItem("openApplyModal");

    if (shouldOpen === "true") {
        sessionStorage.removeItem("openApplyModal");
        openApplyModal();
    }


    /* ===============================
       3️⃣ 모달 내용 세팅 함수
    =============================== */

    function openApplyModal() {

        modalTitle.textContent = "지원하기";
        modalDesc.textContent = "해당 공고에 지원하시겠습니까?";
        applyConfirmBtn.textContent = "지원하기";

        applyConfirmBtn.onclick = () => {
            applyModal.hide();

            // 👉 현재는 UI 단계라 더미 처리
            setTimeout(() => {
                alert("지원이 완료되었습니다. (UI 더미)");
            }, 300);
        };

        applyModal.show();
    }

});
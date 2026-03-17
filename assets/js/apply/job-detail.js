/* ======================================================
   즐겨찾기
====================================================== */

const favoriteBtn = document.getElementById("favoriteBtn");
favoriteBtn?.addEventListener("click", () => {
    favoriteBtn.classList.toggle("is-active");
});

const mobileFavoriteBtn = document.getElementById("mobileFavoriteBtn");
mobileFavoriteBtn?.addEventListener("click", () => {
    mobileFavoriteBtn.classList.toggle("is-active");
});

favoriteBtn?.addEventListener("click", () => {
    favoriteBtn.classList.toggle("is-active");

    favoriteBtn.textContent =
        favoriteBtn.classList.contains("is-active")
        ? "★"
        : "★";
});

/* ======================================================
   지원하기 로직 (최종 안정 버전)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const applyBtns = document.querySelectorAll(".btn-apply, .mobile-apply__btn");
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("id");

    /* =========================
       지원 상태 관리
    ========================== */

    function getAppliedList() {
        return JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    }

    function isApplied() {
        if (!jobId) return false;
        return getAppliedList().includes(jobId);
    }

    function setApplied() {
        if (!jobId) return;
        let list = getAppliedList();
        if (!list.includes(jobId)) {
            list.push(jobId);
            localStorage.setItem("appliedJobs", JSON.stringify(list));
        }
    }

    function updateApplyButtonUI() {
        if (isApplied()) {
            applyBtns.forEach(btn => {
                btn.textContent = "지원완료";
                btn.disabled = true;
            });
        }
    }

    updateApplyButtonUI();

    /* =========================
       지원 버튼 클릭
    ========================== */

    applyBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {

            e.preventDefault();

            if (isApplied()) return;

            const isLogin = localStorage.getItem("isLogin") === "true";

            if (!isLogin) {
                sessionStorage.setItem("redirectAfterLogin", window.location.href);
                window.location.href = "/subpage/login.html";
                return;
            }

            const applyModalEl = document.getElementById("applyModal");

            if (!applyModalEl) {
                console.warn("applyModal 없음 - 모달 HTML 로딩 확인 필요");
                return;
            }

            const applyModal = new bootstrap.Modal(applyModalEl);
            applyModal.show();
        });
    });

    /* =========================
       모달 안 지원하기 클릭
    ========================== */

    document.addEventListener("click", (e) => {

        if (!e.target.matches("#applyConfirmBtn")) return;

        const applyModalEl = document.getElementById("applyModal");
        const applyDoneModalEl = document.getElementById("applyDoneModal");

        if (!applyModalEl || !applyDoneModalEl) {
            console.warn("모달 요소 없음");
            return;
        }

        const applyModalInstance = bootstrap.Modal.getInstance(applyModalEl);

        if (applyModalInstance) {
            applyModalInstance.hide();
        }

        setApplied();
        updateApplyButtonUI();

        const doneModal = new bootstrap.Modal(applyDoneModalEl);
        doneModal.show();
    });

});


/* ======================================================
   이전 목록보기 (최종 안정 버전)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const backBtn = document.getElementById("backToListBtn");
    const mobileBackBtn = document.getElementById("mobileBackToListBtn");

    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const companyId = params.get("companyId");

    function goBack() {
        switch (from) {
            case "index":
                window.location.href = "/index.html";
                break;
            case "search":
                // search에서 필터 유지하려면 query 그대로 넘기기 가능
                window.location.href = "/subpage/search.html";
                break;
            case "company":
                if (companyId) {
                    window.location.href = `/subpage/company-detail.html?id=${companyId}`;
                } else {
                    window.location.href = "/index.html";
                }
                break;
            default:
                window.location.href = "/index.html";
        }
    }
    backBtn?.addEventListener("click", goBack);
    mobileBackBtn?.addEventListener("click", goBack);

});


/* ======================================================
   🧪 테스트용 초기화 함수
====================================================== */
function resetApplied() {
    localStorage.removeItem("appliedJobs");
    alert("지원내역 초기화 완료");
    location.reload();
}
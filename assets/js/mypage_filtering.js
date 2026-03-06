/*====================================================
  지원현황 필터 + 페이지네이션 유지 (완성본)
=====================================================*/

// ✅ 현재 화면에 적용 중인 데이터(필터 결과가 저장되는 곳)
let currentApplied = Array.isArray(appliedList) ? [...appliedList] : [];

// ✅ applied 영역 렌더 함수(항상 currentApplied 기준으로만 렌더)
function renderApplied(page = 1) {
    state.appliedPage = page;

    renderSection(
        currentApplied,
        "appliedList",
        "appliedPagination",
        state.appliedPage,
        (p) => renderApplied(p),
        "applied"
    );

    if (typeof bindCancelButtons === "function") {
        bindCancelButtons();
    }
}

// ✅ 최초 1회: 혹시 filtering.js가 늦게 로드되면, 렌더를 한번 보장
renderApplied(1);

/* -----------------------------
   1) 기간 필터 버튼
------------------------------*/
const filterBtns = document.querySelectorAll("[data-filter]");

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.filter;

        // active 처리
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // ✅ 전체
        if (type === "all") {
            currentApplied = [...appliedList];
            return renderApplied(1);
        }

        // ✅ 1/2/3개월
        const months = Number(type);
        if (!Number.isFinite(months)) return;

        const now = new Date();
        currentApplied = appliedList.filter((item) => {
            // "2026.02.26" -> "2026-02-26"
            const appliedDate = new Date(String(item.date).replace(/\./g, "-"));
            const diffDays =
                (now - appliedDate) / (1000 * 60 * 60 * 24);
            return diffDays <= months * 30;
        });
        renderApplied(1);
    });
});

/* -----------------------------
   2) 날짜 직접 필터
------------------------------*/
const dateBtn = document.getElementById("dateFilterBtn");

if (dateBtn) {
    dateBtn.addEventListener("click", () => {
        const startEl = document.getElementById("startDate");
        const endEl = document.getElementById("endDate");

        if (!startEl?.value || !endEl?.value) {
            // 입력 안 했으면 아무것도 안 바꾸게(또는 alert)
            return;
        }

        const start = new Date(startEl.value);
        const end = new Date(endEl.value);
        end.setHours(23, 59, 59, 999); // ✅ end 날짜 포함되게

        currentApplied = appliedList.filter((item) => {
            const appliedDate = new Date(String(item.date).replace(/\./g, "-"));
            return appliedDate >= start && appliedDate <= end;
        });

        // 버튼 active 풀기(선택 UX)
        filterBtns.forEach((b) => b.classList.remove("active"));

        renderApplied(1);
    });
}

/*====================================================
    관심공고 정렬
=====================================================*/
const sortBtns = document.querySelectorAll("[data-sort]");
sortBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.sort;
        if (type === "latest") {
            favoritesList.sort((a, b) =>
                new Date(b.deadline) - new Date(a.deadline)
            );
        }
        if (type === "deadlineSoon") {
            favoritesList.sort((a, b) =>
                new Date(a.deadline) - new Date(b.deadline)
            );
        }
        if (type === "deadlineLate") {
            favoritesList.sort((a, b) =>
                new Date(b.deadline) - new Date(a.deadline)
            );
        }
        init(); // 리스트 다시 렌더
    });
});
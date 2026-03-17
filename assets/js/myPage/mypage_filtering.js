const now = new Date();

/*====================================================
  공통 유틸
=====================================================*/
function parseDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function isClosed(deadline) {
    if (deadline === "채용시까지") return false;
    const d = parseDate(deadline);
    return d && d < now;
}

function isOpen(deadline) {
    if (deadline === "채용시까지") return true;
    const d = parseDate(deadline);
    return d && d >= now;
}

/*====================================================
  지원현황 필터
=====================================================*/

if (typeof appliedList !== "undefined" && typeof renderSection === "function") {
    const appliedState = {
        source: [...appliedList],
        filtered: [...appliedList],
        page: 1
    };

    function applyAppliedFilter(type, startDate, endDate) {
        if (type === "range") {
            appliedState.filtered = appliedState.source.filter(item => {
                const d = parseDate(String(item.date).replace(/\./g, "-"));
                return d >= startDate && d <= endDate;
            });
            return;
        }
        if (type === "all") {
            appliedState.filtered = [...appliedState.source];
            return;
        }

        const months = Number(type);
        appliedState.filtered = appliedState.source.filter(item => {
            const d = parseDate(String(item.date).replace(/\./g, "-"));
            const diffDays = (now - d) / (1000 * 60 * 60 * 24);
            return diffDays <= months * 30;
        });
    }

    function renderApplied(page = 1) {
        appliedState.page = page;
        renderSection(
            appliedState.filtered,
            "appliedList",
            "appliedPagination",
            appliedState.page,
            p => renderApplied(p),
            "applied"
        );
        if (typeof bindCancelButtons === "function") {
            bindCancelButtons();
        }
    }
    renderApplied(1);

    const filterBtns = document.querySelectorAll("[data-filter]");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            applyAppliedFilter(type);
            renderApplied(1);
        });
    });

    const dateBtn = document.getElementById("dateFilterBtn");
    if (dateBtn) {
        dateBtn.addEventListener("click", () => {
            const startEl = document.getElementById("startDate");
            const endEl = document.getElementById("endDate");

            if (!startEl?.value || !endEl?.value) return;

            const start = new Date(startEl.value);
            const end = new Date(endEl.value);
            end.setHours(23, 59, 59, 999);

            applyAppliedFilter("range", start, end);
            filterBtns.forEach(b => b.classList.remove("active"));
            renderApplied(1);
        });
    }
}


/*====================================================
  관심공고 정렬
=====================================================*/
if (typeof favoritesList !== "undefined" && typeof renderSection === "function") {
    const favoritesState = {
        source: [...favoritesList],
        sorted: [...favoritesList],
        sort: "latest",
        page: 1
    };

    function getDeadlineValue(deadline) {
        // 채용시까지 → 항상 마지막
        if (deadline === "채용시까지") return Number.MAX_SAFE_INTEGER;
        const date = parseDate(deadline);
        // 날짜 parsing 실패 시 뒤로
        if (!date) return Number.MAX_SAFE_INTEGER;
        return date;
    }

    function applyFavoriteSort() {
        let result = [...favoritesState.source];
        switch (favoritesState.sort) {
            case "latest":
                result.sort((a, b) => {
                    const aDate = parseDate(a.savedAt);
                    const bDate = parseDate(b.savedAt);
                    return (bDate || 0) - (aDate || 0);
                });
                break;

            case "deadlineSoon":
                result = result
                    .filter(item => isOpen(item.deadline))
                    .sort((a, b) => {
                        return getDeadlineValue(a.deadline) - getDeadlineValue(b.deadline);
                    });
                break;

            case "deadlineLate":
                result = result
                    .filter(item => isClosed(item.deadline))
                    .sort((a, b) =>
                        parseDate(b.deadline) - parseDate(a.deadline)
                    );
                break;

        }
        favoritesState.sorted = result;
    }

    function renderFavorites(page = 1) {
        favoritesState.page = page;
        renderSection(
            favoritesState.sorted,
            "favoritesList",
            "favoritesPagination",
            favoritesState.page,
            p => renderFavorites(p)
        );
        if (typeof bindFavoriteButtons === "function") {
            bindFavoriteButtons();
        }
        if (typeof updateAppliedUIInFavorites === "function") {
            updateAppliedUIInFavorites();
        }
    }

    const favoritesSort = document.getElementById("favoritesSort");

    if (favoritesSort) {
        favoritesSort.addEventListener("change", function () {

            favoritesState.sort = this.value;

            applyFavoriteSort();
            renderFavorites(1);

        });
    }
}
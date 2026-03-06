const PAGE_SIZE = 12;

/* 더미 데이터 */
let recentJobs = [
    { id: 901, complexName: "래미안 강남 프레스티지", title: "시설관리 기사 모집", area: "서울 강남구", salary: "월급 320만원", deadline: "2026-03-20", viewedAt: "2026-03-06T09:10:00" },
    { id: 902, complexName: "힐스테이트 송파", title: "관리소장 채용", area: "서울 송파구", salary: "월급 520만원", deadline: "2026-03-18", viewedAt: "2026-03-06T08:30:00" },
    { id: 903, complexName: "자이 마포 리버뷰", title: "시설관리 기사 모집", area: "서울 마포구", salary: "월급 300만원", deadline: "2026-03-15", viewedAt: "2026-03-05T22:00:00" },
    { id: 904, complexName: "푸르지오 인천 센트럴", title: "경리 담당자 채용", area: "인천 연수구", salary: "월급 340만원", deadline: "2026-03-12", viewedAt: "2026-03-05T21:20:00" },
    { id: 905, complexName: "롯데캐슬 대구 시그니처", title: "설비 기사 모집", area: "대구 수성구", salary: "월급 310만원", deadline: "2026-03-25", viewedAt: "2026-03-05T20:10:00" },
    { id: 906, complexName: "더샵 센트럴파크", title: "관리소장 채용", area: "대전 서구", salary: "월급 500만원", deadline: "2026-03-14", viewedAt: "2026-03-05T18:00:00" },
    { id: 907, complexName: "e편한세상 광교", title: "전기기사 모집", area: "경기 수원시", salary: "월급 330만원", deadline: "2026-03-28", viewedAt: "2026-03-05T16:00:00" },
    /*
    { id: 908, complexName: "아이파크 삼성", title: "시설관리 주임 채용", area: "서울 강남구", salary: "월급 310만원", deadline: "2026-03-19", viewedAt: "2026-03-05T15:00:00" },
    { id: 909, complexName: "한화 포레나 인천연수", title: "아파트 경리 채용", area: "인천 연수구", salary: "월급 350만원", deadline: "2026-03-21", viewedAt: "2026-03-05T13:00:00" },
    { id: 910, complexName: "래미안 서초 에스티지", title: "시설관리 기사", area: "서울 서초구", salary: "월급 320만원", deadline: "2026-03-24", viewedAt: "2026-03-05T12:10:00" },
    { id: 911, complexName: "힐스테이트 광교", title: "설비 관리 기사", area: "경기 수원시", salary: "월급 305만원", deadline: "2026-03-11", viewedAt: "2026-03-05T11:30:00" },
    { id: 912, complexName: "자이 용산 더센트럴", title: "관리소장 모집", area: "서울 용산구", salary: "월급 550만원", deadline: "2026-03-30", viewedAt: "2026-03-05T10:30:00" },
    { id: 913, complexName: "푸르지오 센트럴파크", title: "시설관리 모집", area: "경기 성남시", salary: "월급 315만원", deadline: "2026-03-23", viewedAt: "2026-03-04T21:00:00" },
    { id: 914, complexName: "롯데캐슬 골드파크", title: "경리 직원 채용", area: "서울 금천구", salary: "월급 330만원", deadline: "2026-03-16", viewedAt: "2026-03-04T19:00:00" },
    { id: 915, complexName: "더샵 강남", title: "시설관리 주임 모집", area: "서울 강남구", salary: "월급 340만원", deadline: "2026-03-13", viewedAt: "2026-03-04T17:00:00" },
    { id: 916, complexName: "아이파크 해운대", title: "전기기사 채용", area: "부산 해운대구", salary: "월급 360만원", deadline: "2026-03-22", viewedAt: "2026-03-04T15:30:00" },
    { id: 917, complexName: "e편한세상 대전", title: "시설관리 모집", area: "대전 유성구", salary: "월급 300만원", deadline: "2026-03-17", viewedAt: "2026-03-04T13:00:00" },
    { id: 918, complexName: "힐스테이트 광주", title: "관리소장 채용", area: "광주 서구", salary: "월급 510만원", deadline: "2026-03-27", viewedAt: "2026-03-04T11:00:00" },
    { id: 919, complexName: "자이 판교", title: "설비 기사 모집", area: "경기 성남시", salary: "월급 320만원", deadline: "2026-03-26", viewedAt: "2026-03-04T09:30:00" },
    { id: 920, complexName: "푸르지오 세종", title: "시설관리 채용", area: "세종시", salary: "월급 310만원", deadline: "2026-03-29", viewedAt: "2026-03-04T08:00:00" }
     */
];
const state = {
    page: 1
};

function updateRecentCount(count) {
    const title = document.getElementById("recentJobsTitle");
    title.textContent = `최근 본 공고 (${count})`;
}

/* 날짜 파싱 */
function parseDate(date) {
    return new Date(date);
}

/* 마감 여부 */
function isClosed(deadline) {
    return parseDate(deadline) < new Date();
}

/* D-Day 계산 */
function getDday(deadline) {
    const today = new Date();
    const end = parseDate(deadline);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "마감";
    if (diff === 1) return "D-Day";
    return `D-${diff}`;
}

/* 최근 본 시간 */
function getViewedTime(viewedAt) {
    const now = new Date();
    const viewed = new Date(viewedAt);
    const diff = Math.floor((now - viewed) / (1000 * 60 * 60));
    if (diff < 1) return "방금 전";
    if (diff < 24) return `${diff}시간 전`;
    const days = Math.floor(diff / 24);
    return `${days}일 전`;
}

/* 카드 생성 */
function createCard(job) {
    return `
        <div class="recent-card">
            <div class="recent-card__top">
                <div class="recent-card__header">
                <div class="recent-card__complexName">${job.complexName}</div>
                <button class="recent-card__favorite ${job.favorite ? "is-active" : ""}" data-id="${job.id}">
                    ${job.favorite ? "★" : "★"}
                </button>
                </div>
                <div class="recent-card__title">${job.title}</div>
                <div class="recent-card__meta"> ${job.area}</div>
                <div class="recent-card__salary">${job.salary}</div>
            </div>
            <div class="recent-card__bottom">
                <span class="recent-card__deadline">${getDday(job.deadline)}</span>
                <a href="/subPage/job-detail.html?id=${job.id}" class="recent-card__btn">
                공고확인
                </a>
            </div>
            <div class="recent-card__viewed">
               ${getViewedTime(job.viewedAt)} 조회
            </div>
        </div>
    `;
}
/* 즐겨찾기 이벤트 */
function bindFavoriteButtons() {
    document.querySelectorAll(".recent-card__favorite")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                const id = Number(btn.dataset.id)
                const job = recentJobs.find(j => j.id === id)
                job.favorite = !job.favorite
                init()
            })
        })
}

/* 리스트 렌더 */
function renderList(data, page) {
    const container = document.getElementById("recentJobsList");
    if (!data.length) {
        container.classList.add("is-empty");
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-file-lines"></i>
                <p>최근 지원한 공고가 없습니다</p>
                <a href="/subPage/search.html" class="empty-state__btn">
                공고 보러가기
                </a>
            </div>
        `;
        return;
    }
    container.classList.remove("is-empty");
    const start = (page - 1) * PAGE_SIZE;
    const list = data.slice(start, start + PAGE_SIZE);
    container.innerHTML = list.map(createCard).join("");
}


/* 페이지네이션 */
function renderPagination(data, page) {
    const container = document.getElementById("recentJobsPagination");
    const total = Math.ceil(data.length / PAGE_SIZE);
    if (total <= 1) {
        container.innerHTML = "";
        return;
    }
    container.innerHTML = Array.from({ length: total }, (_, i) => {
        return `
            <button class="pagination-btn ${i + 1 === page ? "is-active" : ""}" data-page="${i + 1}">
                ${i + 1}
            </button>
        `;
    }).join("");
    container.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
            state.page = Number(btn.dataset.page);
            init();
        };
    });
}

/* 초기 실행 */
function init() {
    const filtered = recentJobs
        .filter(job => !isClosed(job.deadline))
        .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));

    // ⭐ 카운트 업데이트
    updateRecentCount(filtered.length);
    renderList(filtered, state.page);
    renderPagination(filtered, state.page);
}
init();

/* 전체 삭제 버튼 */
const clearBtn = document.getElementById("clearRecentJobs");
clearBtn.addEventListener("click", () => {
    const confirmDelete = confirm("최근 본 공고를 모두 삭제하시겠습니까?");
    if (!confirmDelete) return;
    // 데이터 삭제
    recentJobs = [];
    // 페이지 초기화
    state.page = 1;
    // 다시 렌더링
    init();
});
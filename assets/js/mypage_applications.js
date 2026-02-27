const PAGE_SIZE = 5;

let appliedList = [
    { id: 501, title: "서울_경리(회계)", date: "2026.02.26" },
    { id: 502, title: "서울_서무직", date: "2026.02.26" },
    { id: 503, title: "부산_시설관리", date: "2026.02.25" },
    { id: 504, title: "인천_경비", date: "2026.02.24" },
    { id: 505, title: "대전_관리소장", date: "2026.02.23" },
    { id: 506, title: "광주_전기기사", date: "2026.02.22" },
    { id: 507, title: "대구_설비", date: "2026.02.21" },
    { id: 508, title: "울산_시설", date: "2026.02.20" }
];

let cancelledList = [];
const state = { appliedPage: 1, cancelledPage: 1 };

init();

function init() {
    renderSection(appliedList, "appliedList", "appliedPagination", state.appliedPage, p => { state.appliedPage = p; init(); }, "applied");
    renderSection(cancelledList, "cancelledList", "cancelledPagination", state.cancelledPage, p => { state.cancelledPage = p; init(); }, "cancelled");
    bindCancelButtons();
}

function renderSection(data, listId, paginationId, page, onPageChange, type) {
    const listEl = document.getElementById(listId), paginationEl = document.getElementById(paginationId);
    if (!listEl) return;
    const totalPage = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    if (page > totalPage) { onPageChange(totalPage); return; }
    renderList(data, listEl, page, type);
    renderPagination(data, paginationEl, page, onPageChange);
}

function renderList(data, container, page, type) {
    if (!data.length) {
        container.innerHTML = type === "cancelled"
            ? `<div class="empty-state__text">지원 취소한 공고가 없었습니다.</div>`
            : getEmptyHTML(); return;
    }
    const start = (page - 1) * PAGE_SIZE;
    container.innerHTML = data.slice(start, start + PAGE_SIZE)
        .map(item => type === "cancelled" ? createCancelledCard(item) : createAppliedCard(item)).join("");
}

function createAppliedCard(item) {
    return `<div class="application-card">
    <div class="application-card__left">
      <div class="application-card__info">
        <div class="application-card__title-wrap">
          <span class="application-card__title">${item.title}</span>
          <span class="application-card__status application-card__status--applied">지원완료</span>
        </div>
        <div class="application-card__meta"><i class="fa-regular fa-calendar"></i> 지원일 ${item.date}</div>
      </div>
    </div>
    <div class="application-card__actions">
      <a href="/subPage/job-detail.html?id=${item.id}" class="btn btn-sm btn-outline-secondary">공고보기</a>
      <button class="btn btn-sm btn-outline-danger cancel-btn" data-id="${item.id}">지원취소</button>
    </div>
  </div>`;
}

function createCancelledCard(item) {
    return `<div class="application-card application-card--cancelled">
    <div class="application-card__left">
      <div class="application-card__info">
        <div class="application-card__title-wrap">
          <span class="application-card__title">${item.title}</span>
          <span class="application-card__status application-card__status--cancelled">지원취소</span>
        </div>
        <div class="application-card__meta"><i class="fa-regular fa-calendar-xmark"></i> 지원취소일 ${item.cancelDate}</div>
      </div>
    </div>
    <div class="application-card__actions">
      <a href="/subPage/job-detail.html?id=${item.id}" class="btn btn-sm btn-outline-secondary">공고보기</a>
    </div>
  </div>`;
}

function bindCancelButtons() {
    document.querySelectorAll(".cancel-btn").forEach(btn => {
        btn.onclick = () => {
            const id = +btn.dataset.id, index = appliedList.findIndex(j => j.id === id);
            if (index === -1) return;
            const removed = appliedList.splice(index, 1)[0];
            cancelledList.unshift({ ...removed, cancelDate: new Date().toISOString().slice(0, 10) });
            const maxPage = Math.ceil(appliedList.length / PAGE_SIZE) || 1;
            if (state.appliedPage > maxPage) state.appliedPage = maxPage;
            init();
        };
    });
}

function getEmptyHTML() {
    return `<div class="empty-state">
    <i class="fa-regular fa-file-lines empty-state__icon"></i>
    <p class="empty-state__text">지원한 공고가 없습니다</p>
    <a href="/subPage/search.html" class="empty-state__btn">공고 보러가기</a>
  </div>`;
}

function renderPagination(data, container, currentPage, onPageChange) {
    if (!container) return;
    const total = Math.ceil(data.length / PAGE_SIZE);
    if (total <= 1) { container.innerHTML = ""; return; }
    container.innerHTML = Array.from({ length: total }, (_, i) =>
        `<button class="pagination-btn ${i + 1 === currentPage ? "is-active" : ""}" data-page="${i + 1}">${i + 1}</button>`
    ).join("");
    container.querySelectorAll("button").forEach(btn => btn.onclick = () => onPageChange(+btn.dataset.page));
}
import { jobList } from "./jobList.js";

/* =================================================
   상태
================================================= */
const state = {
  sort: "latest",
  limit: 20,
  page: 1,
};



/* =================================================
   유틸
================================================= */
function isMobile() {
  return window.matchMedia("(max-width: 991.98px)").matches;
}

function calcDDay(deadline) {
  if (!deadline) return "";
  if (deadline === "채용시까지") return "채용시까지";

  const [y, m, d] = deadline.split("-").map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(y, m - 1, d);
  endDate.setHours(0, 0, 0, 0);

  const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "오늘 마감";
  return "마감";
}

function getDDayNumber(deadline) {
  if (deadline === "채용시까지") return Infinity;
  return Number(calcDDay(deadline).replace("D-", "")) || Infinity;
}

/* =================================================
   페이지 기준 리스트
================================================= */
function getJobListByPage() {
  const pageType = document.body.dataset.page;

  // index
  if (pageType === "index") {
    return jobList
      .filter(job => calcDDay(job.deadline) !== "마감")
      .slice(0, 10);
  }

  // search
  return jobList;
}

/* =================================================
   정렬
================================================= */
function sortJobs(list, type) {
  const copied = [...list];

  switch (type) {
    case "latest":
      return copied.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    case "deadline":
      return copied.sort(
        (a, b) => getDDayNumber(a.deadline) - getDDayNumber(b.deadline)
      );

    case "urgent":
      return copied
        .filter(job => getDDayNumber(job.deadline) <= 7)
        .sort((a, b) => getDDayNumber(a.deadline) - getDDayNumber(b.deadline));

    default:
      return copied;
  }
}

/* =================================================
   Pagination
================================================= */
function paginate(list, page, perPage) {
  const start = (page - 1) * perPage;
  return list.slice(start, start + perPage);
}

/* =================================================
   Render : PC
================================================= */
function renderJobListPC(list) {
  const container = document.getElementById("jobListPC");
  if (!container) return;

  container.innerHTML = list.map(job => `
    <div class="job-row">
      <span class="job-fav ${job.isFav ? "is-active" : ""}" data-id="${job.id}">★</span>
      <span class="job-row__tag">${calcDDay(job.deadline)}</span>
      <span class="job-row__badge">${job.title}</span>
      <span class="job-row__info">
        <span class="job-row__complex">${job.complexName}</span>
        <span class="job-row__divider">|</span>
        ${job.area.replace(">", "·")}
      </span>
      <span class="job-row__salary">${job.salary}(세전)</span>
      <a href="/job/detail.html?id=${job.id}" class="job-row__link">
        상세보기 ›
      </a>
    </div>
  `).join("");
}

/* =================================================
   Render : Mobile
================================================= */
function renderJobListMobile(list) {
  const container = document.getElementById("jobListMobile");
  if (!container) return;

  container.innerHTML = list.map(job => `
    <div class="job-card" data-link="/job/detail.html?id=${job.id}">
      <span class="job-fav ${job.isFav ? "is-active" : ""}" data-id="${job.id}">★</span>
      <div class="job-card__head">
        <span class="job-card__badge">${calcDDay(job.deadline)}</span>
        <span class="job-card__complex">${job.complexName}</span>
      </div>
      <h3 class="job-card__title">${job.title}</h3>
      <p class="job-card__area">${job.area.replace(">", "·")}</p>
      <p class="job-card__salary"><strong>월급 ${job.salary.replace("월급 ", "")}(세전)</strong></p>
      <span class="job-card__btn">상세보기 ›</span>
    </div>
  `).join("");
}

/* =================================================
   Pagination Render
================================================= */
function renderPagination(totalCount, perPage) {
  const container = document.getElementById("pagination");
  if (!container) return;

  const totalPage = Math.ceil(totalCount / perPage);

  if (totalPage <= 1) {
    container.innerHTML = "";
    return;
  }

  const maxPageBtn = isMobile() ? 5 : totalPage;

  let start = Math.max(
    1,
    state.page - Math.floor(maxPageBtn / 2)
  );
  let end = Math.min(totalPage, start + maxPageBtn - 1);

  // 끝쪽 보정
  if (end - start + 1 < maxPageBtn) {
    start = Math.max(1, end - maxPageBtn + 1);
  }

  let html = `<ul class="pagination justify-content-center">`;

  // 이전
  html += `
    <li class="page-item ${state.page === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${state.page - 1}">‹</a>
    </li>
  `;

  // 숫자 버튼
  for (let i = start; i <= end; i++) {
    html += `
      <li class="page-item ${state.page === i ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // 다음
  html += `
    <li class="page-item ${state.page === totalPage ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${state.page + 1}">›</a>
    </li>
  `;

  html += `</ul>`;
  container.innerHTML = html;
}


/* =================================================
   Main Render
================================================= */
function renderRealtimeJobs() {
  const baseList = getJobListByPage();            // 전체 50개
  const sorted = sortJobs(baseList, state.sort); // 정렬만

  const perPage = state.limit;                   // ⭐ 핵심
  const pageList = paginate(sorted, state.page, perPage);

  renderJobListPC(pageList);
  renderJobListMobile(pageList);
  renderPagination(sorted.length, perPage);

  bindFavoriteToggle();
  bindMobileCardLink();
}



/* =================================================
   Events
================================================= */
function bindFavoriteToggle() {
  document.querySelectorAll(".job-fav").forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();

      const id = Number(el.dataset.id);
      const job = jobList.find(j => j.id === id);
      if (!job) return;

      job.isFav = !job.isFav;
      renderRealtimeJobs();
    };
  });
}

function bindMobileCardLink() {
  document.querySelectorAll(".job-card").forEach(card => {
    card.onclick = (e) => {
      if (e.target.closest(".job-fav")) return;
      location.href = card.dataset.link;
    };
  });
}

/* =================================================
   Init
================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sortSelect")?.addEventListener("change", e => {
    state.sort = e.target.value;
    state.page = 1;
    renderRealtimeJobs();
  });

  document.getElementById("countSelect")?.addEventListener("change", e => {
    state.limit = Number(e.target.value);
    state.page = 1;
    renderRealtimeJobs();
  });

  document.addEventListener("click", e => {
    const btn = e.target.closest(".page-btn");
    if (!btn) return;
    state.page = Number(btn.dataset.page);
    renderRealtimeJobs();
  });

  window.addEventListener("resize", () => {
    state.page = 1;
    renderRealtimeJobs();
  });

  renderRealtimeJobs();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".page-link");
  if (!btn || btn.closest(".disabled") || btn.closest(".active")) return;

  e.preventDefault();
  state.page = Number(btn.dataset.page);
  renderRealtimeJobs();
});
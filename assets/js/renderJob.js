import { jobList } from "./jobList.js";

function getJobListByPage() {
    const pageType = document.body.dataset.page;

    // index 페이지
    if (pageType === "index") {
        return jobList
            .filter(job => {
                const dday = calcDDay(job.deadline);
                return dday !== "마감";
            })
            .slice(0, 10);
    }

    // 지역/직무 검색 페이지
    if (pageType === "search") {
        return jobList; // 전체 + 마감 포함
    }

    // 기본
    return jobList;
}


/* ===============================
   Render : PC
================================ */
function renderJobListPC(list) {
    const container = document.getElementById("jobListPC");
    if (!container) return;

    container.innerHTML = list.map(job => `
    <div class="job-row">
    <!-- ⭐ 즐겨찾기 -->
      <span 
        class="job-fav ${job.isFav ? "is-active" : ""}" 
        data-id="${job.id}" 
        role="button" 
        aria-label="즐겨찾기"
      >★</span>
       <span class="job-row__tag">
        ${calcDDay(job.deadline)}
      </span>
      <span class="job-row__badge">${job.title}</span>
      <span class="job-row__info">
        <span class="job-row__complex">${job.complexName}</span>
        <span class="job-row__divider">|</span>
        ${job.area.replace('>', '·')}
      </span>
      <span class="job-row__salary">${job.salary}</span>
      <a href="/job/detail.html?id=${job.id}" class="job-row__link">
        상세보기 ›
      </a>
    </div>
  `).join("");
}

/* ===============================
   Render : Mobile (Card)
================================ */
function renderJobListMobile(list) {
    const container = document.getElementById("jobListMobile");
    if (!container) return;

    container.innerHTML = list.map(job => `
    <div class="job-card" data-link="/job/detail.html?id=${job.id}">
      <!-- ⭐ 즐겨찾기 -->
      <span 
        class="job-fav ${job.isFav ? "is-active" : ""}" 
        data-id="${job.id}"
        role="button"
        aria-label="즐겨찾기"
      >★</span>
      <div class="job-card__head">
        <span class="job-card__badge">
            ${calcDDay(job.deadline)}
        </span>
        <span class="job-card__complex">
            ${job.complexName}
        </span>
      </div>
      <h3 class="job-card__title">${job.title}</h3>
      <p class="job-card__area">${job.area.replace('>', '·')}</p>
      <p class="job-card__salary">
        <strong>${job.salary.replace('월급 ', '')}</strong>
      </p>
      <span class="job-card__btn">상세보기 ›</span>
    </div>
  `).join("");
}
function calcDDay(deadline) {
    if (!deadline) return "";
    // deadline: "2026-01-31"
    const [y, m, d] = deadline.split("-").map(Number);
    // 오늘 (시간 제거)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 마감일
    const endDate = new Date(y, m - 1, d);
    endDate.setHours(0, 0, 0, 0);
    const diff =
        Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "오늘 마감";
    return "마감";
}



/* ===============================
   카드 전체 클릭 이벤트
================================ */
function bindMobileCardLink() {
    document.querySelectorAll(".job-card").forEach(card => {
        card.addEventListener("click", (e) => {
            // ⭐ 즐겨찾기 클릭 시 이동 방지
            if (e.target.closest(".job-fav")) return;

            const link = card.dataset.link;
            if (link) {
                location.href = link;
            }
        });
    });
}


/* ===============================
   Favorite Toggle (공통)
================================ */
function bindFavoriteToggle() {
    document.querySelectorAll(".job-fav").forEach(el => {
        el.addEventListener("click", () => {
            const id = Number(el.dataset.id);
            const job = jobList.find(item => item.id === id);
            if (!job) return;

            // 즐겨찾기 토글
            job.isFav = !job.isFav;

            // ✅ 페이지 기준 리스트 다시 계산
            const pageJobList = getJobListByPage();

            // ✅ 다시 렌더링 (페이지 기준 유지)
            renderJobListPC(pageJobList);
            renderJobListMobile(pageJobList);
            // 이벤트 다시 바인딩
            bindFavoriteToggle();
        });
    });
}


/* ===============================
   Init
================================ */
document.addEventListener("DOMContentLoaded", () => {
    const pageJobList = getJobListByPage();
    renderJobListPC(pageJobList);
    renderJobListMobile(pageJobList);
    bindFavoriteToggle();
    bindMobileCardLink();
});

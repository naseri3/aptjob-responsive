import { jobList } from "./jobList.js";

function getJobListByPage() {
  const pageType = document.body.dataset.page;

  // index 페이지
  if (pageType === "index") {
    return jobList
      .filter(job => !job.isClosed) // 마감 제외
      .slice(0, 10);                // 10개만
  }

  // 지역/직무 검색 페이지
  if (pageType === "search") {
    return jobList; // 전체 + 마감 포함
  }

  // 기본
  return jobList;
}


/* ===============================
   Render : PC (Table)
================================ */
function renderJobListPC(list) {
  const tbody = document.getElementById("jobListPC");
  if (!tbody) return;

  tbody.innerHTML = list.map(job => `
    <tr>
      <td class="text-center">
        <span 
          class="job-fav ${job.isFav ? "is-active" : ""}" 
          data-id="${job.id}"
          role="button"
          aria-label="즐겨찾기"
        >★</span>
      </td>
      <td class="job-title">${job.title}</td>
      <td>${job.area}</td>
      <td>${job.position}</td>
      <td>${job.salary}</td>
      <td>${job.complexName}</td>
      <td>${job.complexSize}</td>
      <td class="job-deadline ${!job.isClosed ? "is-soon" : ""}">
        ${job.deadline}
      </td>
      <td>
        ${
          job.isClosed
            ? `<span class="btn btn-secondary btn-ml job-detail-btn job-detail-btn--closed">마감</span>`
            : `<a href="/job/detail.html?id=${job.id}" class="btn btn-primary btn-ml job-detail-btn">상세보기</a>`
        }
      </td>
    </tr>
  `).join("");
}

/* ===============================
   Render : Mobile (Card)
================================ */
function renderJobListMobile(list) {
  const container = document.getElementById("jobListMobile");
  if (!container) return;

  container.innerHTML = list.map(job => `
    <div 
      class="job-card ${job.isClosed ? "is-closed" : ""}" 
      data-link="/job/detail.html?id=${job.id}"
      role="button"
      tabindex="0"
    >
      <div class="job-card__header">
        <h3 class="job-card__title">${job.title}</h3>
        <span 
          class="job-fav ${job.isFav ? "is-active" : ""}" 
          data-id="${job.id}"
          role="button"
          aria-label="즐겨찾기"
        >★</span>
      </div>

      <ul class="job-card__info">
        <li><strong>지역 :</strong> ${job.area} | <strong>직무 :</strong> ${job.position}</li>
        <li><strong>급여 :</strong> ${job.salary}</li>
      </ul>

      <div class="job-card__footer">
        <span class="job-card__deadline ${!job.isClosed ? "is-soon" : ""}">
          ${job.deadline}
        </span>
        ${
          job.isClosed
            ? `<span class="btn btn-secondary btn-ml job-detail-btn job-detail-btn--closed">마감</span>`
            : `<span class="btn btn-primary btn-ml job-detail-btn">상세보기</span>`
        }
      </div>
    </div>
  `).join("");
}

/* ===============================
   카드 전체 클릭 이벤트
================================ */
function bindMobileCardLink() {
  document.querySelectorAll(".job-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // 즐겨찾기 클릭은 카드 이동 막기
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

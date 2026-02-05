import { recommendedList } from "./recommendedList.js";

const grid = document.querySelector(".main-job__grid");

const COLS = 3;       // PC 기준 3칸
const MAX_ROWS = 3;   // 최대 3줄
const MAX_COUNT = COLS * MAX_ROWS;

/* deadline 기준 D-day 계산 */
function getDDayByDeadline(deadline) {
  if (deadline === "채용시까지") return null;

  const now = new Date();
  const end = new Date(deadline);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

/* Recommended 조건 */
let validList = recommendedList.filter(item => {
  if (item.isClosed) return false;
  if (item.deadline === "채용시까지") return true;

  const dday = getDDayByDeadline(item.deadline);
  return dday > 0 && dday <= 14;
});

/* 최대 9개까지만 */
validList = validList.slice(0, MAX_COUNT);

/* 마지막 줄 계산 */
const remainder = validList.length % COLS;

let html = "";

/* ===== 실제 공고 카드 ===== */
validList.forEach(item => {
  html += `
    <div class="col-12 col-lg-4">
      <a href="/detail/${item.id}" class="job-card">

        <div class="job-card__header">
          <span class="job-card__label">${item.complexName}</span>
          <button class="job-card__favorite" aria-pressed="false">★</button>
        </div>

        <h3 class="job-card__title">${item.title}</h3>

        <div class="job-card__meta">
          <span class="badge">${item.position}</span>
          <span class="badge">${item.area}</span>
          <span class="salary">${item.salary}</span>
        </div>

        <div class="job-card__footer">
          <span class="job-card__deadline">
            ${
              item.deadline === "채용시까지"
                ? "상시채용"
                : `D-${getDDayByDeadline(item.deadline)}`
            }
          </span>
          <span class="job-card__detail">상세보기 &gt;</span>
        </div>

      </a>
    </div>
  `;
});

/* ===== 마지막 줄 준비중 카드 채우기 ===== */
if (remainder !== 0) {
  const emptyCount = COLS - remainder;

  for (let i = 0; i < emptyCount; i++) {
    html += `
      <div class="col-12 col-lg-4">
        <div class="job-card job-card--empty">
          <img class="job-card__img" src="/assets/images/brandBox_logo.png" />
          <span class="job-card__empty-text">공고 준비 중입니다.</span>
        </div>
      </div>
    `;
  }
}

grid.innerHTML = html;

// 즐겨찾기 클릭 처리 (이벤트 위임) - 캡처 단계에서 먼저 막기
grid.addEventListener(
  "click",
  (e) => {
    const favBtn = e.target.closest(".job-card__favorite");
    if (!favBtn) return;

    // ✅ 링크 이동 완전 차단 (모바일에서 특히 중요)
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") {
      e.stopImmediatePropagation();
    }

    // 즐겨찾기 토글
    const isActive = favBtn.classList.toggle("is-active");
    favBtn.setAttribute("aria-pressed", isActive);

    console.log("즐겨찾기 상태:", isActive ? "ON" : "OFF");
  },
  true // ⭐ 캡처 단계
);





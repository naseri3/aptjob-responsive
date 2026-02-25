import { recommendedList } from "./recommendedList.js";

/* =========================================================
   DOM
========================================================= */
const grid = document.querySelector(".main-job__grid");

if (!grid) {
  console.warn("main-job__grid 없음");
}

/* =========================================================
   설정값
========================================================= */
const COLS = 3;        // PC 기준 3칸
const MAX_ROWS = 3;   // 최대 3줄
const MAX_COUNT = COLS * MAX_ROWS; // 최대 9개

/* =========================================================
   D-Day 계산 (안전 버전)
========================================================= */
function getDDayByDeadline(deadline) {
  if (!deadline) return null;
  if (deadline === "채용시까지") return null;

  const [y, m, d] = deadline.split("-").map(Number);

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const end = new Date(y, m - 1, d);

  return Math.ceil(
    (end - today) / (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   Recommended 필터 조건
   - 마감 안됨
   - 상시채용
========================================================= */
let validList = recommendedList.filter(item => {
  if (item.isClosed) return false;
  if (item.deadline === "채용시까지") return true;
  const dday = getDDayByDeadline(item.deadline);
  return dday > 0;

});

/* =========================================================
   최대 9개 제한
========================================================= */
validList = validList.slice(0, MAX_COUNT);

/* =========================================================
   카드 렌더링
========================================================= */
let html = "";

/* ===== 실제 공고 카드 ===== */
validList.forEach(item => {

  const dday =
    item.deadline === "채용시까지"
      ? "상시채용"
      : `D-${getDDayByDeadline(item.deadline)}`;

  html += `
    <div class="col-12 col-lg-4">
      <a href="/subpage/job-detail.html?id=${item.id}&from=search" class="job-card">
        <!-- 헤더 -->
        <div class="job-card__header">
          <span class="job-card__label">
            ${item.complexName}
          </span>
          <button
            class="job-card__favorite"
            aria-pressed="false"
            data-id="${item.id}"
          >
            ★
          </button>
        </div>

        <!-- 제목 -->
        <h3 class="job-card__title">
          ${item.title}
        </h3>

        <!-- 메타 -->
        <div class="job-card__meta">
          <span class="badge">${item.position}</span>
          <span class="badge">${item.area}</span>
          <span class="salary">${item.salary}</span>
        </div>

        <!-- 푸터 -->
        <div class="job-card__footer">
          <span class="job-card__deadline">
            ${dday}
          </span>
          <span class="job-card__detail">
            상세보기 &gt;
          </span>
        </div>

      </a>

    </div>
  `;
});

/* =========================================================
   마지막 줄 빈 카드 채우기
========================================================= */
const remainder = validList.length % COLS;

if (remainder !== 0) {

  const emptyCount = COLS - remainder;

  for (let i = 0; i < emptyCount; i++) {

    html += `
      <div class="col-12 col-lg-4">

        <div class="job-card job-card--empty">

          <img
            class="job-card__img"
            src="/assets/images/brandBox_logo.png"
            alt="준비중"
          />

          <span class="job-card__empty-text">
            공고 준비 중입니다.
          </span>

        </div>

      </div>
    `;
  }
}

/* =========================================================
   렌더링
========================================================= */
if (grid) {
  grid.innerHTML = html;
}

/* =========================================================
   즐겨찾기 이벤트 (이벤트 위임)
========================================================= */
if (grid) {

  grid.addEventListener(
    "click",
    (e) => {

      const favBtn = e.target.closest(
        ".job-card__favorite"
      );

      if (!favBtn) return;

      // 링크 이동 차단
      e.preventDefault();
      e.stopPropagation();

      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }

      // 토글
      const isActive =
        favBtn.classList.toggle("is-active");

      favBtn.setAttribute(
        "aria-pressed",
        isActive
      );

      console.log(
        "즐겨찾기 상태:",
        isActive ? "ON" : "OFF"
      );
    },
    true // 캡처 단계
  );
}

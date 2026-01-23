import { premiumList } from "./premiumList.js";

const grid = document.querySelector(".premium__grid");
const MAX_COUNT = 8;

/* =========================
   날짜 관련 함수
========================= */
function getDDay(period) {
  const endDate = period.split('~')[1].trim(); // 01.23
  const [month, day] = endDate.split('.').map(Number);

  const now = new Date();
  const year = now.getFullYear();
  const end = new Date(year, month - 1, day);

  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
}

/* =========================
   1. 마감 안 된 공고만 필터
========================= */
const activeList = premiumList.filter(item => getDDay(item.period) > 0);

/* =========================
   2. 카드 HTML 생성
========================= */
const jobCards = activeList.slice(0, MAX_COUNT).map(item => `
  <a href="${item.link}" class="premium-card">
    <div class="premium-card__badge">${item.complex}</div>

    <h3 class="premium-card__title">${item.complex}</h3>

    <p class="premium-card__tags">
      <span class="tag tag--region">
        ${item.location.split('>')[0].trim()}
      </span>
      <span class="tag tag--job">${item.job}</span>
      <span class="tag tag--career">
        ${item.experience.replace('이상', '↑')}
      </span>
    </p>

    <div class="premium-card__footer">
        <span class="premium-card__detail">상세보기</span>
        <span class="premium-card__deadline">
            채용 마감 D-${getDDay(item.period)}
        </span>
    </div>
  </a>
`);

/* =========================
   3. 부족한 수만큼 준비중 카드 생성
========================= */
const emptyCount = MAX_COUNT - jobCards.length;

const placeholderCards = Array.from({ length: emptyCount }, () => `
  <div class="premium-card premium-card--placeholder">
    <div class="placeholder-content">
      <img src="/assets/images/brandBox_logo.png" alt="아파트잡" />
      <p class="placeholder-text">
        <strong>공고 준비 중입니다.</strong>
      </p>
    </div>
  </div>
`);

/* =========================
   4. 렌더링
========================= */
grid.innerHTML = [...jobCards, ...placeholderCards].join("");

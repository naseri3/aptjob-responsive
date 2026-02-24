import { premiumList } from "./premiumList.js";

const grid = document.querySelector(".premium__grid");
const MAX_COUNT = 8;

/* =========================
   날짜 계산 함수 (D-Day)
========================= */
function getDDay(period) {
  const endDate = period.split("~")[1].trim();
  const [month, day] = endDate.split(".").map(Number);

  const now = new Date();
  const year = now.getFullYear();
  const end = new Date(year, month - 1, day);

  return Math.ceil(
    (end - now) / (1000 * 60 * 60 * 24)
  );
}

/* =========================
   1. 마감 안 된 공고 필터
========================= */
const activeList = premiumList.filter(
  item => getDDay(item.period) > 0
);

/* =========================
   2. 즐겨찾기 가져오기
========================= */
function getFavorites() {
  return JSON.parse(
    localStorage.getItem("favorites")
  ) || [];
}

/* =========================
   3. 카드 HTML 생성
========================= */
const jobCards = activeList
  .slice(0, MAX_COUNT)
  .map(item => {

    const favorites = getFavorites();
    const isFav = favorites.includes(item.id);

    return `
      <div class="premium-card">

        <!-- ⭐ 카드 전체 링크 -->
        <a href="${item.link}&from=index" 
           class="premium-card__link"></a>

        <!-- ⭐ 즐겨찾기 -->
        <button 
          type="button"
          class="premium-card__favorite ${isFav ? "is-active" : ""}"
          data-id="${item.id}">
          <span class="star">★</span>
        </button>

        <div class="premium-card__badge">
          ${item.complex}
        </div>

        <h3 class="premium-card__title">
          ${item.complex}
        </h3>

        <p class="premium-card__tags">
          <span class="tag tag--region">
            ${item.location}
          </span>
          <span class="tag tag--job">
            ${item.job}
          </span>
          <span class="tag tag--career">
            ${item.experience.replace("이상", "↑")}
          </span>
        </p>

        <div class="premium-card__footer">
          <span class="premium-card__detail">
            상세보기
          </span>
          <span class="premium-card__deadline">
            D-${getDDay(item.period)}
          </span>
        </div>

      </div>
    `;
  });

/* =========================
   4. Placeholder 카드
========================= */
const emptyCount = MAX_COUNT - jobCards.length;

const placeholderCards = Array.from(
  { length: emptyCount },
  () => `
    <div class="premium-card premium-card--placeholder">
      <div class="placeholder-content">
        <img 
          src="/assets/images/brandBox_logo.png"
          alt="아파트잡"
        />
      </div>
    </div>
  `
);

/* =========================
   5. 렌더링
========================= */
grid.innerHTML = [
  ...jobCards,
  ...placeholderCards
].join("");

/* =========================
   6. 즐겨찾기 클릭 이벤트
========================= */
grid.addEventListener("click", e => {

  const btn = e.target.closest(
    ".premium-card__favorite"
  );
  if (!btn) return;

  const id = Number(btn.dataset.id);

  toggleFavorite(btn, id);
});

/* =========================
   7. 즐겨찾기 토글
========================= */
function toggleFavorite(btn, id) {

  let favorites = getFavorites();

  if (favorites.includes(id)) {

    favorites = favorites.filter(
      favId => favId !== id
    );

    btn.classList.remove("is-active");

  } else {

    favorites.push(id);

    btn.classList.add("is-active");
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  console.log("현재 즐겨찾기:", favorites);
}

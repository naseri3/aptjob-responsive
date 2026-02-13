import { directorList } from "./directorList.js";
const now = new Date();

/* ===============================
   컨테이너 선택
=============================== */
const container = document.querySelector(
  ".director-card-list"
);

/* ===============================
   마감 여부 체크
=============================== */
function isExpired(dateStr) {
  const endDate = new Date(
    dateStr + "T23:59:59"
  );
  return now > endDate;
}


/* ===============================
   D-Day 계산
=============================== */
function getDDayText(dateStr) {
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endDate = new Date(
    dateStr + "T23:59:59"
  );
  const diff = Math.ceil(
    (endDate - today) /
    (1000 * 60 * 60 * 24)
  );
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-오늘마감";
  return "마감";
}


/* ===============================
   반응형 열 개수 계산
=============================== */
function getColumnCount() {
  const width = window.innerWidth;
  if (width >= 992) return 3;   // PC (lg)
  return 2;                     // 모바일 / 태블릿
}


/* ===============================
   카드 렌더링
=============================== */
function renderDirectorCards(list) {
  if (!container) return;
  container.innerHTML = "";
  if (!list || list.length === 0) return;

  /* ---------- 마감 공고 제외 ---------- */
  const filteredList = list.filter(item => {
    if (item.isClosed) return false;
    if (isExpired(item.deadline))
      return false;
    return true;
  });
  if (filteredList.length === 0) return;

  /* ===============================
     카드 생성
  =============================== */
  filteredList.forEach(item => {
    const ddayText =
      getDDayText(item.deadline);
    const cardHTML = `
      <div class="col-6 col-md-6 col-lg-4">
        <a href="/job-detail.html?id=${item.id}"
           class="director-card-link text-decoration-none">
          <div class="director-card">
            <!-- 즐겨찾기 -->
            <button class="director-card__favorite"
              aria-label="즐겨찾기" data-id="${item.id}">
              ★
            </button>
            <!-- 상단 -->
            <div class="director-card__top">
              <span class="director-card__company"> ${item.complexName} </span>
            </div>
            <!-- 제목 -->
            <h3 class="director-card__title"> ${item.title} </h3>
            <!-- 태그 -->
            <div class="director-card__tags">
              <span class="tag director-card__tag"> | ${item.area} </span>
              <span class="tag director-card__tag"> | ${item.experience} </span>
            </div>
            <div class="director-card__tags">
              <span class="tag director-card__tag"> | ${item.salary} </span>
            </div>
            <!-- 하단 -->
            <div class="director-card__bottom">
              <span class="director-card__dday"> ${ddayText} </span>
              <span class="director-card__detail"> 상세보기 > </span>
            </div>
          </div>
        </a>
      </div>
    `;
    container.insertAdjacentHTML(
      "beforeend",
      cardHTML
    );
  });


  /* ===============================
     빈 카드 계산 (반응형 대응)
  =============================== */
  const columnCount = getColumnCount();
  const remainder = filteredList.length % columnCount;
  let emptyCount = 0;
  if (remainder !== 0) {
    emptyCount = columnCount - remainder;
  }

  /* ===============================
     빈 카드 생성
  =============================== */
  for (let i = 0; i < emptyCount; i++) {
    const emptyHTML = `
      <div class="col-6 col-md-6 col-lg-4">
        <div class="director-card director-card--empty">
          <div class="director-card__empty">
            <img class="director-card__empty-img"
              src="/assets/images/brandBox_logo.png" alt="공고 준비중" />
            <span class="director-card__empty-text">
              공고 준비 중입니다.
            </span>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML(
      "beforeend",
      emptyHTML
    );
  }
}


/* ===============================
   즐겨찾기 클릭 이벤트
   - 페이지 이동 방지
=============================== */
document.addEventListener("click", (e) => {
  const favBtn = e.target.closest(
      ".director-card__favorite"
    );
  if (!favBtn) return;

  /* 링크 이동 방지 */
  e.preventDefault();
  e.stopPropagation();

  /* active 토글 */
  favBtn.classList.toggle("is-active");
  /* (선택) id 가져오기 */
  const id = favBtn.dataset.id;
  console.log("즐겨찾기:", id);
});

/* ===============================
   최초 실행
=============================== */
document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderDirectorCards(
      directorList
    );
  }
);

/* ===============================
   리사이즈 대응
=============================== */
window.addEventListener(
  "resize",
  () => {
    renderDirectorCards(
      directorList
    );
  }
);

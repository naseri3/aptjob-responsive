const PAGE_SIZE = 6;

let favoritesList = [
    { id: 801, complexName: "래미안 강남 프레스티지", title: "아파트 시설관리 기사 모집 (전기 선임 가능자 우대 / 경력 3년 이상)", area: "서울 강남구", experience: "경력 3년 이상", salary: "월급 320만원", deadline: "2026-03-20" },
    { id: 802, complexName: "힐스테이트 송도 더스카이", title: "관리소장 채용 (주택관리사 필수)", area: "인천 연수구", experience: "경력 8년 이상", salary: "월급 500만원", deadline: "2026-03-05" },
    { id: 803, complexName: "자이 마포 리버뷰", title: "시설관리 기사 모집", area: "서울 마포구", experience: "신입", salary: "월급 280만원", deadline: "채용시까지" },
    { id: 804, complexName: "푸르지오 센트럴", title: "경리 담당자 채용", area: "경기 성남시", experience: "경력무관", salary: "월급 380만원", deadline: "2026-02-20" },
    { id: 805, complexName: "롯데캐슬 시그니처", title: "설비 기사 모집", area: "대구 수성구", experience: "경력무관", salary: "월급 300만원", deadline: "2026-03-15" },
    { id: 806, complexName: "더샵 센트럴파크", title: "관리소장 채용", area: "대전 서구", experience: "경력 8년 이상", salary: "월급 520만원", deadline: "2026-02-23" },
    { id: 807, complexName: "e편한세상 광교 에듀포레", title: "아파트 전기기사 모집 (전기산업기사 이상 / 선임 가능자)", area: "경기 수원시", experience: "신입", salary: "월급 340만원", deadline: "2026-03-28" },
    { id: 808, complexName: "아이파크 삼성", title: "공동주택 시설관리 주임 채용 (기계설비 유지관리)", area: "서울 강남구", experience: "경력무관", salary: "월급 310만원", deadline: "채용시까지" },
    { id: 809, complexName: "한화 포레나 인천연수", title: "아파트 경리 및 회계 담당자 모집", area: "인천 연수구", experience: "경력 3년 이상", salary: "월급 360만원", deadline: "2026-02-10" }
];

const state = { page: 1 };

init();


/* ======================
   D-day 계산
====================== */
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

function isClosed(deadline) {
    return calcDDay(deadline) === "마감";
}


/* ======================
   초기 실행
====================== */
function init() {
    renderSection(
        favoritesList,
        "favoritesList",
        "favoritesPagination",
        state.page,
        page => {
            state.page = page;
            init();
        }
    );
    bindFavoriteButtons();
}


/* ======================
   섹션 렌더
====================== */
function renderSection(data, listId, paginationId, page, onPageChange) {
    const listEl = document.getElementById(listId);
    const paginationEl = document.getElementById(paginationId);
    if (!listEl) return;

    const totalPage = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    if (page > totalPage) {
        onPageChange(totalPage);
        return;
    }

    renderList(data, listEl, page);
    renderPagination(data, paginationEl, page, onPageChange);
}


/* ======================
   리스트 렌더
====================== */
function renderList(data, container, page) {
    if (!data.length) {
        container.innerHTML = getEmptyHTML();
        return;
    }
    const start = (page - 1) * PAGE_SIZE;
    container.innerHTML = data
        .slice(start, start + PAGE_SIZE)
        .map(createFavoriteCard)
        .join("");
}


/* ======================
   카드 생성
====================== */
function createFavoriteCard(item) {
    const dday = calcDDay(item.deadline);
    const closed = isClosed(item.deadline);

    return `
    <div class="favorite-card">
      <div class="favorite-card__top">
        <span class="favorite-card__company">${item.complexName}</span>
        <button class="favorite-btn is-active" data-id="${item.id}">★</button>
      </div>
      <div class="favorite-card__title"> ${item.title} </div>
      <div class="favorite-card__meta">
        <span>${item.area}</span>
        <span>|</span>
        <span>${item.experience}</span>
        <span>|</span>
        <span>${item.salary}</span>
        <span>|</span>
        <span class="favorite-card__dday ${closed ? "is-closed" : ""}">
          ${dday}
        </span>
      </div>

      <div class="favorite-card__actions">
        <a href="/subPage/job-detail.html?id=${item.id}" class="btn btn-outline-secondary favorite-card__view-btn">
          공고보기
        </a>
        ${closed
            ? ""
            : `<button class="btn btn-primary favorite-card__apply-btn" data-id="${item.id}">
              지원하기
            </button>`
        }
      </div>

    </div>
  `;
}


/* ======================
   즐겨찾기 해제
====================== */
function bindFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach(btn => {
        btn.onclick = () => {
            const id = Number(btn.dataset.id);
            const index = favoritesList.findIndex(item => item.id === id);
            if (index === -1) return;

            favoritesList.splice(index, 1);

            const maxPage = Math.ceil(favoritesList.length / PAGE_SIZE) || 1;
            if (state.page > maxPage) state.page = maxPage;

            init();
        };
    });
}


/* ======================
   empty
====================== */
function getEmptyHTML() {
    return `
    <div class="empty-state">
      <i class="fa-regular fa-star empty-state__icon"></i>
      <p class="empty-state__text">관심 공고가 없습니다</p>
      <a href="/subPage/search.html" class="empty-state__btn">공고 보러가기</a>
    </div>
  `;
}


/* ======================
   pagination
====================== */
function renderPagination(data, container, currentPage, onPageChange) {
    if (!container) return;

    const total = Math.ceil(data.length / PAGE_SIZE);

    if (total <= 1) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
    <div class="pagination-inner">
      ${Array.from({ length: total }, (_, i) => `
          <button
            class="pagination-btn ${i + 1 === currentPage ? "is-active" : ""}"
            data-page="${i + 1}">
            ${i + 1}
          </button>
        `).join("")
        }
    </div>
  `;

    container.querySelectorAll(".pagination-btn").forEach(btn => {
        btn.onclick = () => onPageChange(Number(btn.dataset.page));
    });
}


/* ======================================================
   관심공고 - 지원하기 모달 (job-detail 재사용)
====================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  await ensureApplyModalsLoaded();

  document.addEventListener("click", (e) => {
    const applyBtn = e.target.closest(".favorite-card__apply-btn");
    if (!applyBtn) return;

    e.preventDefault();

    const card = applyBtn.closest(".favorite-card");
    const jobId = applyBtn.dataset.id || card?.querySelector(".favorite-btn")?.dataset.id;

    if (!jobId) return;

    if (isApplied(jobId)) return;

    const isLogin = localStorage.getItem("isLogin") === "true";
    if (!isLogin) {
      sessionStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "/subpage/login.html";
      return;
    }

    const applyModalEl = document.getElementById("applyModal");
    if (!applyModalEl) return;

    applyModalEl.dataset.jobId = jobId; // ✅ 어떤 공고를 지원하는지 저장
    new bootstrap.Modal(applyModalEl).show();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.matches("#applyConfirmBtn")) return;

    const applyModalEl = document.getElementById("applyModal");
    const doneModalEl = document.getElementById("applyDoneModal");
    if (!applyModalEl || !doneModalEl) return;

    const jobId = applyModalEl.dataset.jobId;
    if (!jobId) return;

    bootstrap.Modal.getInstance(applyModalEl)?.hide();

    setApplied(jobId);
    updateAppliedUIInFavorites(jobId);

    new bootstrap.Modal(doneModalEl).show();
  });

  // ✅ 페이지 로드 시 이미 지원한 공고는 “지원완료” 처리
  updateAppliedUIInFavorites();
});


/* =========================
   모달 HTML 로드(중복 방지)
========================= */
async function ensureApplyModalsLoaded() {
  if (document.getElementById("applyModal") && document.getElementById("applyDoneModal")) return;

  try {
    const res = await fetch("/assets/components/apply-modal.html");
    const html = await res.text();
    document.body.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.warn("apply-modal 로드 실패", err);
  }
}


/* =========================
   지원 상태(localStorage)
========================= */
function getAppliedList() {
  return JSON.parse(localStorage.getItem("appliedJobs") || "[]");
}
function isApplied(jobId) {
  return getAppliedList().includes(String(jobId));
}
function setApplied(jobId) {
  const id = String(jobId);
  const list = getAppliedList();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem("favorites", JSON.stringify(favoritesList));
  }
}


/* =========================
   UI 반영 (지원완료 처리)
========================= */
function updateAppliedUIInFavorites(targetJobId) {
  const appliedSet = new Set(getAppliedList());
  document.querySelectorAll(".favorite-card__apply-btn").forEach((btn) => {
    const id = String(btn.dataset.id);
    if (targetJobId && id !== String(targetJobId)) return;

    if (appliedSet.has(id)) {
      btn.textContent = "지원완료";
      btn.disabled = true;
      btn.classList.add("is-applied");
    }
  });
}
import { appliedList } from "./appliedList.js";

const track = document.getElementById("appliedJobGrid");
const prev = document.getElementById("appliedPrev");
const next = document.getElementById("appliedNext");

const MAX = 10;
const data = appliedList.slice(0, MAX);
let index = 0;

/* D-DAY */
function getDDay(deadline) {
  if (!deadline) return "";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(deadline);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return "마감";
}

/* 카드 생성 */
function createAppliedCard(job) {
  const dday = getDDay(job.deadline);
  const card = document.createElement("div");
  card.className = "applied-card";
  card.innerHTML = `
    <div class="applied-card__badge">${dday}</div>
    <div class="applied-card__complexName">${job.complexName}</div>
    <div class="applied-card__title">${job.title}</div>
    <div class="applied-card__meta">${job.area}</div>
    <div class="applied-card__salary">${job.salary}</div>
    <div class="applied-card__btn">공고보기 ></div>
  `;
  card.onclick = () => location.href = `/subPage/job-detail.html?id=${job.id}`;
  return card;
}

/* 렌더 */
function render() {
  if (!track) return;
  track.innerHTML = "";

  /* 공고 없음 */
  if (data.length === 0) {
    track.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-file-lines"></i>
        <p>최근 지원한 공고가 없습니다</p>
        <a href="/subPage/search.html" class="empty-state__btn">
          공고 보러가기
        </a>
      </div>
    `;
    track.style.width = "100%";
    track.style.display = "flex";
    track.style.justifyContent = "center";
    return;
  }
  /* 공고 있음 */
  data.forEach(job => track.appendChild(createAppliedCard(job)));
}

/* 카드 width */
function getCardWidth() {
  const card = track.querySelector(".applied-card");
  if (!card) return 0;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  return card.offsetWidth + gap;
}

/* track width 보정 */
function fixTrackWidth() {
  const w = getCardWidth();
  if (!w) return;
  track.style.width = `${w * data.length}px`;
  track.style.display = "flex";
  track.style.margin = "0";
  track.style.padding = "0";
  track.style.transition = "transform .3s ease";
}

/* 보이는 카드 수 */
function visibleCount() {
  const w = getCardWidth();
  return w ? Math.floor(track.parentElement.offsetWidth / w) : 1;
}

/* 슬라이드 업데이트 */
function update() {
  const w = getCardWidth();
  if (!w) return;

  const maxIndex = Math.max(data.length - visibleCount(), 0);
  index = Math.min(Math.max(index, 0), maxIndex);

  track.style.transform = `translateX(-${index * w}px)`;

  if (prev) prev.style.display = index === 0 ? "none" : "flex";
  if (next) next.style.display = index >= maxIndex ? "none" : "flex";
}

/* 버튼 */
prev?.addEventListener("click", () => { index = Math.max(index - 1, 0); update(); });
next?.addEventListener("click", () => { index = Math.min(index + 1, data.length - visibleCount()); update(); });

/* 드래그 */
let startX = 0, isDown = false;
track.addEventListener("mousedown", e => { isDown = true; startX = e.clientX; });
track.addEventListener("mouseup", e => {
  if (!isDown) return;
  isDown = false;

  const diff = e.clientX - startX;
  const maxIndex = Math.max(data.length - visibleCount(), 0);

  if (diff < -50) index = Math.min(index + 1, maxIndex);
  if (diff > 50) index = Math.max(index - 1, 0);

  update();
});

/* 초기화 */
function init() {
  render();
  requestAnimationFrame(() => { fixTrackWidth(); update(); });
}

init();
window.addEventListener("resize", () => { fixTrackWidth(); update(); });
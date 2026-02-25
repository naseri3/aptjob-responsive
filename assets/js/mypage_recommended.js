import { directorList } from "./directorList.js";

const track = document.getElementById("recommendedJobGrid");
const prev = document.getElementById("recommendedPrev");
const next = document.getElementById("recommendedNext");

const MAX = 10;
const data = directorList.slice(0, MAX);
let index = 0;

/* 카드 생성 */
function createCard(job) {
  const card = document.createElement("div");
  card.className = "recommended-card";
  card.innerHTML = `
    <div class="recommended-card__badge">추천 공고</div>
    <div class="recommended-card__complexName">${job.complexName}</div>
    <div class="recommended-card__title">${job.title}</div>
    <div class="recommended-card__meta">${job.area}</div>
    <div class="recommended-card__salary">${job.salary}</div>
    <div class="recommended-card__btn">공고확인 ></div>`;
  card.onclick = () => location.href = `/subPage/job-detail.html?id=${job.id}`;
  return card;
}

/* 렌더 */
function render() {
  track.innerHTML = "";
  data.forEach(job => track.appendChild(createCard(job)));
}

/* 카드 width 계산 */
function getCardWidth() {
  const card = track.querySelector(".recommended-card");
  if (!card) return 0;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  return card.offsetWidth + gap;
}

/* track width 강제 설정 (빈 공간 제거 핵심) */
function fixTrackWidth() {
  const w = getCardWidth();
  if (!w) return;
  track.style.width = (w * data.length) + "px";
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

/* 슬라이드 */
function update() {
  const w = getCardWidth();
  if (!w) return;
  track.style.transform = `translateX(-${index * w}px)`;
  const visible = visibleCount();
  if (prev) prev.style.display = index === 0 ? "none" : "flex";
  if (next) next.style.display = index >= data.length - visible ? "none" : "flex";
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
  if (diff < -50) index = Math.min(index + 1, data.length - visibleCount());
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
import { appliedList } from "./appliedList.js";

/* ===============================
   DOM
=============================== */
const track = document.getElementById("appliedJobGrid");
const prev = document.getElementById("appliedPrev");
const next = document.getElementById("appliedNext");

const cameraBtn = document.getElementById("cameraBtn");
const profileInput = document.getElementById("profileInput");
const profileImage = document.getElementById("profileImage");

/* ===============================
   프로필 이미지 업로드
=============================== */
if (cameraBtn && profileInput && profileImage) {
    cameraBtn.addEventListener("click", () => profileInput.click());

    profileInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const imgSrc = e.target.result;
            profileImage.src = imgSrc;
            localStorage.setItem("profileImage", imgSrc);
        };
        reader.readAsDataURL(file);
    });

    const saved = localStorage.getItem("profileImage");
    if (saved) profileImage.src = saved;
}

/* ===============================
   데이터
=============================== */
const MAX = 10;
const data = appliedList.slice(0, MAX);
let index = 0;

/* ===============================
   D-DAY
=============================== */
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

/* ===============================
   카드 생성
=============================== */
function createAppliedCard(job) {
    const card = document.createElement("div");
    card.className = "applied-card";
    card.innerHTML = `
    <div class="applied-card__badge">${getDDay(job.deadline)}</div>
    <div class="applied-card__complexName">${job.complexName}</div>
    <div class="applied-card__title">${job.title}</div>
    <div class="applied-card__meta">${job.area}</div>
    <div class="applied-card__salary">${job.salary}</div>
    <div class="applied-card__btn">공고보기 ></div>
  `;
    card.onclick = () => location.href = `/subPage/job-detail.html?id=${job.id}`;
    return card;
}

/* ===============================
   렌더
=============================== */
function render() {
    if (!track) return;
    track.innerHTML = "";

    if (data.length === 0) {
        if (prev) prev.style.display = "none";
        if (next) next.style.display = "none";

        track.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-file-lines"></i>
        <p>최근 지원한 공고가 없습니다</p>
        <a href="/subPage/search.html" class="empty-state__btn">공고 보러가기</a>
      </div>
    `;
        track.style.width = "100%";
        track.style.display = "flex";
        track.style.justifyContent = "center";
        return;
    }

    if (prev) prev.style.display = "";
    if (next) next.style.display = "";

    data.forEach(job => track.appendChild(createAppliedCard(job)));
}

/* ===============================
   슬라이더 계산
=============================== */
function getCardWidth() {
    const card = track.querySelector(".applied-card");
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
}

function fixTrackWidth() {
    const w = getCardWidth();
    if (!w) return;
    track.style.width = `${w * data.length}px`;
    track.style.display = "flex";
    track.style.transition = "transform .3s ease";
}

function visibleCount() {
    const w = getCardWidth();
    return w ? Math.floor(track.parentElement.offsetWidth / w) : 1;
}

function update() {
    const w = getCardWidth();
    if (!w) return;

    const maxIndex = Math.max(data.length - visibleCount(), 0);
    index = Math.min(Math.max(index, 0), maxIndex);
    track.style.transform = `translateX(-${index * w}px)`;

    if (prev) prev.style.display = index === 0 ? "none" : "flex";
    if (next) next.style.display = index >= maxIndex ? "none" : "flex";
}

/* ===============================
   이벤트
=============================== */
prev?.addEventListener("click", () => {
    index = Math.max(index - 1, 0);
    update();
});

next?.addEventListener("click", () => {
    index = Math.min(index + 1, data.length - visibleCount());
    update();
});

/* 드래그 */
let startX = 0, isDown = false;

track?.addEventListener("mousedown", e => {
    isDown = true;
    startX = e.clientX;
});

track?.addEventListener("mouseup", e => {
    if (!isDown) return;
    isDown = false;

    const diff = e.clientX - startX;
    const maxIndex = Math.max(data.length - visibleCount(), 0);

    if (diff < -50) index = Math.min(index + 1, maxIndex);
    if (diff > 50) index = Math.max(index - 1, 0);

    update();
});

/* ===============================
   초기화
=============================== */
function init() {
    render();
    requestAnimationFrame(() => {
        fixTrackWidth();
        update();
    });
}

init();
window.addEventListener("resize", () => {
    fixTrackWidth();
    update();
});
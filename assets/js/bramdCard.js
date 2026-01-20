const track = document.querySelector('.company-slider__track');
let cards = Array.from(document.querySelectorAll('.company-card'));

const prevBtn = document.querySelector('.slider-btn--prev');
const nextBtn = document.querySelector('.slider-btn--next');

let index = 0;
let isDown = false;
let startX = 0;
let currentTranslate = 0;

const GAP = 16; // 카드 gap(px)

/* 카드 1칸 width */
function getCardWidth() {
    return cards[0].offsetWidth + GAP;
}

/* 화면에 보이는 카드 개수 */
function getVisibleCount() {
    const viewport = document.querySelector('.company-slider__viewport');
    return Math.floor(viewport.offsetWidth / getCardWidth());
}

/* 이동 가능한 최대 index */
function getMaxIndex() {
    return Math.max(cards.length - getVisibleCount(), 0);
}

/* 이동 적용 */
function moveTo(newIndex) {
    index = Math.min(Math.max(newIndex, 0), getMaxIndex());
    track.style.transition = 'transform 0.35s ease';
    track.style.transform = `translateX(-${getCardWidth() * index}px)`;
    updateButtons();
}

/* 버튼 상태 */
function updateButtons() {
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === getMaxIndex();
}

/* 버튼 이벤트 */
nextBtn.addEventListener('click', () => moveTo(index + 1));
prevBtn.addEventListener('click', () => moveTo(index - 1));

/* =========================
   Drag Logic
========================= */
track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX;
    track.style.transition = 'none';
});

window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;

    index = Math.round(currentTranslate / getCardWidth());
    moveTo(index);
});

window.addEventListener('mousemove', e => {
    if (!isDown) return;

    const diff = e.pageX - startX;
    const move = getCardWidth() * index - diff;

    const maxMove = getCardWidth() * getMaxIndex();
    currentTranslate = Math.min(Math.max(move, 0), maxMove);

    track.style.transform = `translateX(-${currentTranslate}px)`;
});

/* =========================
   Random Shuffle (1분)
========================= */
function shuffleCards() {
    const shuffled = cards
        .map(card => ({ card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.card);

    track.innerHTML = '';
    shuffled.forEach(card => track.appendChild(card));

    cards = shuffled;
    index = 0;
    moveTo(0);
}
/* 60초마다 랜덤 정렬 */
setInterval(shuffleCards, 60000);
/* 초기 세팅 */
updateButtons();
window.addEventListener('resize', () => moveTo(index));
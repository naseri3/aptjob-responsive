/* ==================================================
   Mobile Search Bar Drag Scroll
================================================== */
function bindDragScrollForMobileSearchBar(root = document) {
    const slider = root.querySelector('.mobile-search-bar');
    if (!slider) return;

    // ✅ 중복 바인딩 방지
    if (slider.dataset.dragBound === "true") return;
    slider.dataset.dragBound = "true";

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

    const start = (e) => {
        isDown = true;
        slider.classList.add('is-dragging');
        startX = getX(e);
        scrollLeft = slider.scrollLeft;
    };

    const move = (e) => {
        if (!isDown) return;
        // ✅ 터치에서 스크롤 튀는 것 방지(가로 드래그 UX)
        if (e.cancelable) e.preventDefault();

        const x = getX(e);
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
    };

    const end = () => {
        isDown = false;
        slider.classList.remove('is-dragging');
    };

    // Mouse
    slider.addEventListener('mousedown', start);
    slider.addEventListener('mousemove', move);
    slider.addEventListener('mouseleave', end);
    slider.addEventListener('mouseup', end);

    // Touch
    slider.addEventListener('touchstart', start, { passive: true });
    slider.addEventListener('touchmove', move, { passive: false });
    slider.addEventListener('touchend', end);
}

/**
 * 검색 영역 로더
 * - PC / Mobile 검색 HTML 분리 로드
 * - fetch 기반 DOM 대응
 */
(function () {
    const pcTarget = document.getElementById('pcSearch');
    const mobileTarget = document.getElementById('mobileSearch');
    if (!pcTarget || !mobileTarget) return;

    const PC_URL = '/assets/components/search/search.pc.html';
    const MOBILE_URL = '/assets/components/search/search.mobile.html';

    const isMobile = () =>
        window.matchMedia('(max-width: 991.98px)').matches;

    const loadHTML = async (target, url) => {
        if (target.dataset.loaded === 'true') return;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.status);
            const html = await res.text();

            target.innerHTML = html;
            target.dataset.loaded = 'true';

            // ✅ 여기! HTML 주입이 끝난 뒤 드래그 바인딩
            bindDragScrollForMobileSearchBar(target);

        } catch (e) {
            console.error('[Search Loader]', e);
        }
    };

    const init = () => {
        if (isMobile()) loadHTML(mobileTarget, MOBILE_URL);
        else loadHTML(pcTarget, PC_URL);
    };

    init();

    let prev = isMobile();
    window.addEventListener('resize', () => {
        const now = isMobile();
        if (now !== prev) {
            prev = now;
            init();
        }
    });
})();

/* ==================================================
   공통 유틸 : 상단 검색 버튼 텍스트
================================================== */
function setFilterLabel(type, text) {
    const btn = document.querySelector(`.search-btn[data-type="${type}"]`);
    if (!btn) return;

    btn.querySelector('.label').textContent = text;
    btn.classList.add('is-active');
}

function resetFilterLabel(type, defaultText) {
    const btn = document.querySelector(`.search-btn[data-type="${type}"]`);
    if (!btn) return;

    btn.querySelector('.label').textContent = defaultText;
    btn.classList.remove('is-active');
}

/* ==================================================
   모바일 검색 버튼 → Offcanvas
================================================== */
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.search-btn');
    if (!btn) return;

    const map = {
        region: 'regionSheet',
        job: 'jobSheet',
        salary: 'salarySheet',
        career: 'careerSheet',
        status: 'statusSheet'
    };

    const id = map[btn.dataset.type];
    if (!id) return;

    const sheet = document.getElementById(id);
    if (!sheet) return;

    bootstrap.Offcanvas.getOrCreateInstance(sheet).show();
});

/* ==================================================
   지역 (다중 선택 → 개수 + 태그)
================================================== */
(() => {
    const MAX = 8;
    const selected = new Map();

    /* depth1 */
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.region-depth1 .list-group-item');
        if (!item) return;

        document
            .querySelectorAll('.region-depth1 .list-group-item')
            .forEach(i => i.classList.remove('active'));

        item.classList.add('active');

        const key = item.dataset.district;
        document
            .querySelectorAll('.region-depth2')
            .forEach(l => l.classList.add('d-none'));

        document
            .querySelector(`.region-depth2.${key}`)
            ?.classList.remove('d-none');
    });

    /* depth2 */
    document.addEventListener('click', (e) => {
        const li = e.target.closest('.region-depth2 .list-group-item');
        if (!li) return;

        const code = li.dataset.district;
        const city =
            document.querySelector('.region-depth1 .active')?.textContent.trim();
        const name = li.childNodes[0].textContent.trim();
        const label = `${city} > ${name}`;

        if (!li.classList.contains('selected')) {
            if (selected.size >= MAX) {
                alert('지역은 최대 8개까지 선택할 수 있어요.');
                return;
            }
            li.classList.add('selected');
            selected.set(code, label);
        } else {
            li.classList.remove('selected');
            selected.delete(code);
        }

        render();
    });

    function render() {
        const wrap = document.querySelector('.selected-region-tags');
        const count = document.querySelector('.region-selected-fixed .text-primary');
        if (!wrap || !count) return;

        wrap.innerHTML = '';

        selected.forEach((label, code) => {
            const tag = document.createElement('span');
            tag.className = 'badge rounded-pill selected-region';
            tag.innerHTML = `
        ${label}
        <button class="btn-close region-remove-btn" data-code="${code}"></button>
      `;
            wrap.appendChild(tag);
        });

        count.textContent = selected.size;
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.region-remove-btn');
        if (!btn) return;

        const code = btn.dataset.code;
        selected.delete(code);

        document
            .querySelectorAll(`.region-depth2 .list-group-item[data-district="${code}"]`)
            .forEach(li => li.classList.remove('selected'));

        render();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.region-reset-btn')) return;

        selected.clear();
        document
            .querySelectorAll('.region-depth2 .list-group-item.selected')
            .forEach(li => li.classList.remove('selected'));

        render();
        resetFilterLabel('region', '지역');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.region-save-btn')) return;

        selected.size > 0
            ? setFilterLabel('region', `지역 ${selected.size}`)
            : resetFilterLabel('region', '지역');

        bootstrap.Offcanvas.getInstance(
            document.getElementById('regionSheet')
        )?.hide();
    });
})();

/* ==================================================
   직무 선택 (fetch 대응 / document 이벤트 위임)
================================================== */
(() => {
    const MAX_SELECT = 3;
    const selectedJobs = new Map(); // code -> label

    /* =========================
       직무 클릭 (1depth + 2depth)
    ========================= */
    document.addEventListener('click', (e) => {
        const item = e.target.closest('#jobSheet .list-group-item');
        if (!item) return;

        const sheet = document.getElementById('jobSheet');
        if (!sheet || !sheet.contains(item)) return;

        const code = item.dataset.job;
        if (!code) return;

        const label = item.childNodes[0].textContent.trim();

        // 이미 선택된 경우 → 해제
        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
            selectedJobs.delete(code);
            render();
            return;
        }

        // 최대 3개 제한
        if (selectedJobs.size >= MAX_SELECT) {
            alert('직무는 최대 3개까지 선택할 수 있어요.');
            return;
        }

        // 선택
        item.classList.add('selected');
        selectedJobs.set(code, label);
        render();
    });

    /* =========================
       선택된 직무 렌더링
    ========================= */
    function render() {
        const sheet = document.getElementById('jobSheet');
        if (!sheet) return;

        const countEl = sheet.querySelector('.job-selected-fixed .text-primary');
        const tagWrap = sheet.querySelector('.selected-job-tags');

        if (!countEl || !tagWrap) return;

        countEl.textContent = selectedJobs.size;
        tagWrap.innerHTML = '';

        selectedJobs.forEach((label, code) => {
            const tag = document.createElement('span');
            tag.className = 'selected-job d-flex align-items-center gap-1';
            tag.textContent = label;

            const removeBtn = document.createElement('i');
            removeBtn.className = 'fa-solid fa-xmark job-remove-btn';
            removeBtn.style.cursor = 'pointer';

            removeBtn.addEventListener('click', () => {
                selectedJobs.delete(code);

                document
                    .querySelectorAll(`#jobSheet [data-job="${code}"]`)
                    .forEach(el => el.classList.remove('selected'));

                render();
            });

            tag.appendChild(removeBtn);
            tagWrap.appendChild(tag);
        });
    }

    /* =========================
       초기화 버튼
    ========================= */
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.job-reset-btn')) return;

        const sheet = document.getElementById('jobSheet');
        if (!sheet) return;

        selectedJobs.clear();

        sheet
            .querySelectorAll('.list-group-item.selected')
            .forEach(el => el.classList.remove('selected'));

        render();
        resetFilterLabel('job', '직무');
    });

    /* =========================
       저장 버튼
    ========================= */
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.job-save-btn')) return;

        const sheet = document.getElementById('jobSheet');
        if (!sheet) return;

        selectedJobs.size > 0
            ? setFilterLabel('job', `직무 ${selectedJobs.size}`)
            : resetFilterLabel('job', '직무');

        bootstrap.Offcanvas.getInstance(sheet)?.hide();
    });
})();

/* ==================================================
   급여 (단일 조건)
================================================== */
/* =========================
   1. 숫자만 입력 가능
========================= */
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('salary-inline-input')) {
        // 숫자만 허용
        let value = e.target.value.replace(/[^0-9]/g, '');
        // 최대 4자리 제한
        value = value.slice(0, 4);
        e.target.value = value;
    }
});
/* =========================
   2. 버튼 이벤트 (초기화 / 선택완료)
========================= */
document.addEventListener('click', (e) => {
    /* ---------- 초기화 ---------- */
    if (e.target.classList.contains('salary-reset-btn')) {
        const input = document.querySelector('.salary-inline-input');
        if (!input) return;
        input.value = '';
        // 상단 급여 버튼 리셋
        resetFilterLabel('salary', '급여');
        return;
    }
    /* ---------- 선택완료 ---------- */
    if (e.target.classList.contains('salary-save-btn')) {
        const input = document.querySelector('.salary-inline-input');
        if (!input) return;

        const value = input.value.trim();
        if (value) {
            // 상단 급여 버튼에 반영
            setFilterLabel('salary', `월 ${value}만원 이상`);
        } else {
            resetFilterLabel('salary', '급여');
        }
        // offcanvas 닫기
        const sheet = document.getElementById('salarySheet');
        const instance = bootstrap.Offcanvas.getInstance(sheet);
        instance?.hide();
    }

});


/* ==================================================
   경력 (문구 분기)
================================================== */
let selectedCareerType = null;
document.addEventListener('click', (e) => {
    /* ---------- 경력 버튼 선택 ---------- */
    if (e.target.classList.contains('career-btn')) {
        const buttons = document.querySelectorAll('.career-btn');
        const inputRow = document.querySelector('.career-input-row');
        const input = document.querySelector('.career-inline-input');

        buttons.forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');

        selectedCareerType = e.target.dataset.value;

        // 경력 선택 시 입력 노출
        if (selectedCareerType === '경력') {
            inputRow.classList.remove('d-none');
            input?.focus();
        } else {
            inputRow.classList.add('d-none');
            if (input) input.value = '';
        }
    }

    /* ---------- 초기화 ---------- */
    if (e.target.classList.contains('salary-reset-btn')) {
        document
            .querySelectorAll('.career-btn')
            .forEach(btn => btn.classList.remove('selected'));

        const input = document.querySelector('.career-inline-input');
        const inputRow = document.querySelector('.career-input-row');

        if (input) input.value = '';
        inputRow?.classList.add('d-none');

        selectedCareerType = null;
        resetFilterLabel('career', '경력');
    }

    /* ---------- 선택완료 ---------- */
    if (e.target.classList.contains('salary-save-btn')) {
        const input = document.querySelector('.career-inline-input');
        let label = '경력';

        if (selectedCareerType === '신입') {
            label = '신입';
        }

        if (selectedCareerType === '경력무관') {
            label = '경력무관';
        }

        if (selectedCareerType === '경력') {
            const year = input?.value.trim();
            label = year ? `경력 ${year}년 이상` : '경력';
        }

        if (label === '경력') {
            resetFilterLabel('career', '경력');
        } else {
            setFilterLabel('career', label);
        }

        // offcanvas 닫기
        const sheet = document.getElementById('careerSheet');
        bootstrap.Offcanvas.getInstance(sheet)?.hide();
    }
});

/* =========================
   숫자만 입력 (경력 연수)
========================= */
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('career-inline-input')) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }
});


/* ==================================================
   상태 (단일 선택)
================================================== */
let selectedStatus = null;

document.addEventListener('click', (e) => {
    /* =========================
        상태 버튼 선택
    ========================= */
    const statusBtn = e.target.closest('#statusSheet .status-btn');
    if (statusBtn) {
        document
            .querySelectorAll('#statusSheet .status-btn')
            .forEach(b => b.classList.remove('selected'));

        statusBtn.classList.add('selected');
        selectedStatus = statusBtn.dataset.value;
        return;
    }

    /* =========================
        초기화
    ========================= */
    if (e.target.closest('#statusSheet .status-reset-btn')) {
        document
            .querySelectorAll('#statusSheet .status-btn')
            .forEach(b => b.classList.remove('selected'));

        selectedStatus = null;
        resetFilterLabel('status', '상태');
        return;
    }

    /* =========================
        선택완료
    ========================= */
    if (e.target.closest('#statusSheet .status-save-btn')) {
        if (!selectedStatus) {
            resetFilterLabel('status', '상태');
        } else {
            setFilterLabel('status', selectedStatus);
        }

        // offcanvas 닫기
        const sheet = document.getElementById('statusSheet');
        bootstrap.Offcanvas.getInstance(sheet)?.hide();
    }
});



/* ==================================================
   지역 초기값 세팅 (전국 / 전체)
================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1️⃣ depth1: 전국 active
    const defaultDepth1 = document.querySelector(
        '.region-depth1 .list-group-item[data-district="all"]'
    );

    if (defaultDepth1) {
        document
            .querySelectorAll('.region-depth1 .list-group-item')
            .forEach(i => i.classList.remove('active'));

        defaultDepth1.classList.add('active');
    }

    // 2️⃣ depth2: 전국 전체 노출
    document
        .querySelectorAll('.region-depth2')
        .forEach(list => list.classList.add('d-none'));

    const defaultDepth2 = document.querySelector('.region-depth2.all');
    if (defaultDepth2) {
        defaultDepth2.classList.remove('d-none');
    }
});

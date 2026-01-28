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
   1️⃣ 지역 (다중 선택 → 개수 + 태그)
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
   2️⃣ 직무 (다중 선택 → 개수)
================================================== */
(() => {
  const selectedJobs = new Set();

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.job-item');
    if (!item) return;

    const code = item.dataset.code;
    item.classList.toggle('selected');

    item.classList.contains('selected')
      ? selectedJobs.add(code)
      : selectedJobs.delete(code);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.job-save-btn')) return;

    selectedJobs.size > 0
      ? setFilterLabel('job', `직무 ${selectedJobs.size}`)
      : resetFilterLabel('job', '직무');

    bootstrap.Offcanvas.getInstance(
      document.getElementById('jobSheet')
    )?.hide();
  });
})();

/* ==================================================
   3️⃣ 급여 (단일 조건)
================================================== */
(() => {
  let salaryMin = null;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-salary]');
    if (btn) salaryMin = Number(btn.dataset.salary);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.salary-save-btn')) return;

    salaryMin
      ? setFilterLabel('salary', `급여 ${salaryMin}만원 이상`)
      : resetFilterLabel('salary', '급여');

    bootstrap.Offcanvas.getInstance(
      document.getElementById('salarySheet')
    )?.hide();
  });
})();

/* ==================================================
   4️⃣ 경력 (문구 분기)
================================================== */
(() => {
  let careerValue = null; // 'none' | 'new' | number

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-career]');
    if (btn) careerValue = btn.dataset.career;
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.career-save-btn')) return;

    let text = '경력';
    if (careerValue === 'none') text = '경력 무관';
    else if (careerValue === 'new') text = '신입';
    else if (!isNaN(careerValue)) text = `경력 ${careerValue}년 이상`;

    text !== '경력'
      ? setFilterLabel('career', text)
      : resetFilterLabel('career', '경력');

    bootstrap.Offcanvas.getInstance(
      document.getElementById('careerSheet')
    )?.hide();
  });
})();

/* ==================================================
   5️⃣ 상태 (라디오 단일 선택)
================================================== */
(() => {
  let statusValue = null;
  const map = {
    all: '전체',
    open: '채용중',
    closed: '마감'
  };

  document.addEventListener('change', (e) => {
    if (e.target.name === 'status') {
      statusValue = e.target.value;
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.status-save-btn')) return;

    statusValue
      ? setFilterLabel('status', map[statusValue])
      : resetFilterLabel('status', '상태');

    bootstrap.Offcanvas.getInstance(
      document.getElementById('statusSheet')
    )?.hide();
  });
})();


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

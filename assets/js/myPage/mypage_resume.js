const resumeListEl = document.getElementById("resumeList");

/* ===============================
   더미 데이터
=============================== */
let resumeData = [
    { id: 1, title: "시설관리 경력직 이력서", photo: "/assets/images/profile-user.png", updatedAt: "2026.02.26", isMain: true, represent: true },
    { id: 2, title: "아파트 관리소장 지원 이력서", photo: "/assets/images/profile-default.png", updatedAt: "2026.02.24", isMain: false, represent: false },
    // { id: 3, title: "이력서 테스트", photo: "/assets/images/profile-default.png", updatedAt: "2026.03.01", isMain: false}
];


function updateResumeCount(count) {

    const title = document.getElementById("resumeTitle");

    if (!title) return;

    title.textContent = `이력서 관리 (${count})`;
}


/* ===============================
   빈 상태 UI
=============================== */
function renderEmpty() {
    resumeListEl.innerHTML = `
        <div class="resume-empty text-center py-5">
            <i class="fa-regular fa-file-lines mb-3" style="font-size:40px;"></i>
            <p class="mb-3">등록된 이력서가 없습니다.</p>
        </div>
    `;
}


/* ===============================
   이력서 목록 UI
=============================== */
function renderResumeList(list) {
    resumeListEl.innerHTML = list.map(item => `
        <div class="resume-card">
            <div class="resume-card__left">
                <img src="${item.photo}" class="resume-card__photo">
                <div class="resume-card__info">
                    <div class="resume-card__title">
                        ${item.title}  ${item.isMain ? '<span class="resume-main-badge">대표</span>' : ''}
                    </div>
                    <div class="resume-card__meta">
                        최근 수정일 ${item.updatedAt}
                    </div>
                </div>
            </div>
            <div class="resume-card__actions">
                <a href="/myPage/resume-view.html?id=${item.id}" class="btn btn-sm btn-outline-secondary">
                   보기
                </a>
                <a href="/myPage/resume-form.html?id=${item.id}" class="btn btn-sm btn-outline-primary">
                   수정
                </a>
                <button class="btn btn-sm btn-outline-danger resume-delete-btn" data-id="${item.id}">
                    삭제
                </button>
            </div>
        </div>
    `).join("");


    /* ===============================
       삭제 이벤트
    =============================== */
    document.querySelectorAll(".resume-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            // 삭제 확인
            const isConfirm = confirm("이력서를 삭제하시겠습니까?");
            if (!isConfirm) return;
            /* 데이터 삭제 */
            resumeData = resumeData.filter(item => item.id !== id);
            /* 다시 렌더 */
            render();
        });
    });
}

/* ===============================
   이력서 정렬
=============================== */
const sortSelect = document.getElementById("resumeSort");

sortSelect.addEventListener("change", function () {
    const type = this.value;
    if (type === "latest") {
        resumeData.sort((a, b) => {
            return new Date(b.updatedAt.replace(/\./g, "-")) - new Date(a.updatedAt.replace(/\./g, "-"));
        });
    }
    if (type === "oldest") {
        resumeData.sort((a, b) => {
            return new Date(a.updatedAt.replace(/\./g, "-")) - new Date(b.updatedAt.replace(/\./g, "-"));
        });
    }
    if (type === "represent") {
        resumeData.sort((a, b) => b.isMain - a.isMain);
    }
    render();
});


/* ===============================
   전체 렌더 함수
=============================== */
function render() {
    updateResumeCount(resumeData.length);
    localStorage.setItem("resumeCount", resumeData.length);

    if (resumeData.length === 0) {
        renderEmpty();
    } else {
        renderResumeList(resumeData);
    }
}

function parseDate(dateStr) {
  return new Date(dateStr.replace(/\./g, "-"));
}
resumeData.sort((a,b)=> parseDate(b.updatedAt) - parseDate(a.updatedAt));

/* ===============================
   최초 실행
=============================== */
render();
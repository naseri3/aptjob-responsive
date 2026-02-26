const resumeListEl = document.getElementById("resumeList");

const resumeData = [
    { id: 1, title: "시설관리 경력직 이력서", photo: "/assets/images/profile-user.png" },
    { id: 2, title: "아파트 관리소장 지원 이력서", photo: "/assets/images/profile-default.png" }
];

function renderEmpty() {
    resumeListEl.innerHTML = `
        <div class="resume-empty text-center py-5">
            <i class="fa-regular fa-file-lines mb-3" style="font-size:40px;"></i>
            <p class="mb-3">등록된 이력서가 없습니다.</p>
            <a href="/subPage/resume-create.html" class="btn btn-outline-primary">이력서 등록하기</a>
        </div>`;
}

function renderResumeList(list) {
    resumeListEl.innerHTML = list.map(item => `
        <div class="resume-card">
            <div class="resume-card__left">
                <img src="${item.photo}" class="resume-card__photo">
                <div class="resume-card__info">
                    <div class="resume-card__title">${item.title}</div>
                    <div class="resume-card__meta">최근 수정일 2026.02.26</div>
                </div>
                </div>
                <div class="resume-card__actions">
                    <a href="/subPage/resume-view.html?id=${item.id}" class="btn btn-sm btn-outline-secondary">보기</a>
                    <a href="/subPage/resume-edit.html?id=${item.id}" class="btn btn-sm btn-outline-primary">수정</a>
                <button class="btn btn-sm btn-outline-danger resume-delete-btn" data-id="${item.id}">삭제</button>
            </div>
        </div>
`).join("");

    document.querySelectorAll(".resume-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const newList = resumeData.filter(item => item.id !== id);
            if (newList.length === 0) { renderEmpty(); } else { renderResumeList(newList); }
        });
    });
}

if (resumeData.length === 0) { renderEmpty(); } else { renderResumeList(resumeData); }
/* ====================================================
   DOM
==================================================== */
const educationList = document.getElementById("educationList");
const careerList = document.getElementById("careerList");

const addEducationBtn = document.getElementById("addEducationBtn");
const addCareerBtn = document.getElementById("addCareerBtn");

const profileInput = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");

const titleInput = document.getElementById("resumeTitle");
const titleBtn = document.getElementById("resumeTitleSaveBtn");

const basicEditBtn = document.getElementById("resumeBasicEdit");
const basicSection = document.getElementById("resume-basic");

const postcodeBtn = document.querySelector(".resume-btn-postcode");

const trainingList = document.getElementById("trainingList");
const licenseList = document.getElementById("licenseList");

const addTrainingBtn = document.getElementById("addTrainingBtn");
const addLicenseBtn = document.getElementById("addLicenseBtn");


/* ====================================================
   1️⃣ 프로필 이미지 미리보기
==================================================== */
profileInput?.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        profilePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
});


/* ====================================================
   2️⃣ 이력서 제목 수정
==================================================== */
let isTitleEdit = true;
const titleIcon = titleBtn?.querySelector("i");

titleBtn?.addEventListener("click", function () {
    const value = titleInput.value.trim();

    if (isTitleEdit) {
        if (!value) {
            alert("이력서 제목을 입력해주세요.");
            return;
        }
        titleInput.setAttribute("readonly", true);
        titleIcon.className = "fa-solid fa-pen";
        isTitleEdit = false;
    } else {
        titleInput.removeAttribute("readonly");
        titleIcon.className = "fa-solid fa-floppy-disk";
        isTitleEdit = true;
    }
});

titleInput?.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        titleBtn.click();
    }
});


/* ====================================================
   3️⃣ 기본정보 수정
==================================================== */
const basicFields = basicSection?.querySelectorAll(
    ".resume-form__input, .resume-form__select"
);

let isBasicEdit = false;

basicEditBtn?.addEventListener("click", function () {
    isBasicEdit = !isBasicEdit;

    basicFields?.forEach(field => {
        if (isBasicEdit) {
            field.removeAttribute("readonly");
            field.removeAttribute("disabled");
        } else {
            field.setAttribute("readonly", true);
            field.setAttribute("disabled", true);
        }
    });

    const icon = basicEditBtn.querySelector("i");
    icon.className = isBasicEdit
        ? "fa-solid fa-floppy-disk"
        : "fa-solid fa-pen";
});


document.addEventListener("DOMContentLoaded", function () {
    basicFields?.forEach(field => {
        field.setAttribute("readonly", true);
        field.setAttribute("disabled", true);
    });
});


/* ====================================================
   5️⃣ 주소 검색
==================================================== */
postcodeBtn?.addEventListener("click", function () {
    new daum.Postcode({
        oncomplete: function (data) {
            let addr = "";
            if (data.userSelectedType === "R") {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            document.getElementById("postcode").value = data.zonecode;
            document.getElementById("address").value = addr;
            document.getElementById("detailAddress").focus();

        }
    }).open();
});


/* ====================================================
   6️⃣ 섹션 수정 버튼
==================================================== */
document.querySelectorAll(".resume-edit-btn").forEach(button => {

    const icon = button.querySelector("i");
    const section = button.closest(".resume-section");

    let isEditMode = !window.hasResumeData;

    icon.className = isEditMode
        ? "fa-solid fa-floppy-disk"
        : "fa-solid fa-pen";

    button.addEventListener("click", function () {

        isEditMode = !isEditMode;

        const fields = section.querySelectorAll(
            "input, select, textarea"
        );

        fields.forEach(field => {
            if (field.type === "button") return;

            if (isEditMode) {
                field.removeAttribute("readonly");
                field.removeAttribute("disabled");
            } else {
                field.setAttribute("readonly", true);
                field.setAttribute("disabled", true);
            }
        });

        icon.className = isEditMode
            ? "fa-solid fa-floppy-disk"
            : "fa-solid fa-pen";

    });

});

/* ====================================================
   대입검정고시 체크
==================================================== */
document.addEventListener("change", function (e) {
    if (e.target.classList.contains("ged-check") || e.target.id.startsWith("gedCheck")) {
        const item = e.target.closest(".education-item");
        const schoolInput = item.querySelector(
            'input[placeholder="학교명을 입력해주세요"]'
        );
        const graduationLabel = item.querySelector(".graduation-label");
        if (e.target.checked) {
            // 학교명 자동 입력
            schoolInput.value = "대입자격검정고시";
            // label 변경
            graduationLabel.innerHTML = '<span class="resume-required">*</span>합격년월';
        } else {
            // 학교명 초기화
            schoolInput.value = "";
            // label 원래대로
            graduationLabel.innerHTML =
                '<span class="resume-required">*</span>졸업년월';
        }
    }
});


/* ====================================================
   중학교 졸업 이하 체크
==================================================== */
function toggleEducationByMiddleSchool() {
    if (!middleSchoolCheck || !educationList || !addEducationBtn) return;

    const isChecked = middleSchoolCheck.checked;

    if (isChecked) {
        educationList.style.display = "none";
        addEducationBtn.style.display = "none";
    } else {
        educationList.style.display = "";
        addEducationBtn.style.display = "";
    }
}

middleSchoolCheck?.addEventListener("change", toggleEducationByMiddleSchool);

document.addEventListener("DOMContentLoaded", function () {
    toggleEducationByMiddleSchool();
});


/* ====================================================
   7️⃣ 학력 추가
==================================================== */
addEducationBtn?.addEventListener("click", function () {
    const count = educationList.querySelectorAll(".education-item").length;
    if (count >= 4) {
        alert("학력을 추가할 수 없습니다.");
        return;
    }

    const nextNumber = count + 1;

    const item = document.createElement("div");
    item.className = "resume-group education-item";
    item.innerHTML = `
    <div class="resume-group__header">
      <h3 class="resume-group__title">학력 ${nextNumber}</h3>
      <button type="button" class="resume-remove-btn remove-education-btn">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="row g-2">
      <div class="col-12 col-md-3 resume-form__field">
        <label class="resume-form__label">
          <span class="resume-required">*</span>학교구분
        </label>
        <select class="form-select resume-form__select">
          <option>전문대학(2~3년제)</option>
          <option>대학교(4년제)</option>
          <option>대학원</option>
        </select>
      </div>

      <div class="col-12 col-md-4 resume-form__field">
        <label class="resume-form__label">
          <span class="resume-required">*</span>학교명
        </label>
        <input type="text"
          class="form-control resume-form__input"
          placeholder="학교명을 입력해주세요">
      </div>

      <div class="col-12 col-md-5 resume-form__field">
        <label class="resume-form__label">전공</label>
        <input type="text"
          class="form-control resume-form__input"
          placeholder="예: 컴퓨터공학">
      </div>

      <div class="col-6 col-md-3 resume-form__field">
        <label class="resume-form__label">입학년도</label>
        <input type="month"
          class="form-control resume-form__input">
      </div>

      <div class="col-6 col-md-3 resume-form__field">
        <label class="resume-form__label">졸업년도</label>
        <input type="month"
          class="form-control resume-form__input">
      </div>

      <div class="col-12 col-md-3 resume-form__field">
        <label class="resume-form__label">졸업상태</label>
        <select class="form-select resume-form__select">
          <option>졸업</option>
          <option>재학중</option>
          <option>휴학</option>
          <option>중퇴</option>
        </select>
      </div>
    </div>
    `;

    educationList.appendChild(item);
    updateEducationTitles();
});


/* ====================================================
   8️⃣ 경력 추가
==================================================== */
addCareerBtn?.addEventListener("click", function () {
    const count = careerList.querySelectorAll(".career-item").length;
    const nextNumber = count + 1;
    const checkboxId = `currentWork${nextNumber}`;

    const item = document.createElement("div");
    item.className = "resume-group career-item";

    item.innerHTML = `
    <div class="resume-group__header">
        <h3 class="resume-group__title">경력 ${nextNumber}</h3>
        <button type="button" class="resume-remove-btn remove-career-btn">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <div class="row">
        <div class="col-12 col-md-6 col-lg-4 resume-form__field">
            <label class="resume-form__label">
                <span class="resume-required">*</span>회사명
            </label>
            <input type="text" class="form-control resume-form__input" placeholder="회사명을 입력해주세요" />
        </div>

        <div class="col-12 col-md-6 col-lg-4 resume-form__field">
            <label class="resume-form__label">
                <span class="resume-required">*</span>직무 / 부서
            </label>
            <input type="text" class="form-control resume-form__input" placeholder="예: 프론트엔드 / 개발팀" />
        </div>

        <div class="col-12 col-md-6 col-lg-4 resume-form__field">
            <label class="resume-form__label">
                담당 업무
            </label>
            <input type="text" class="form-control resume-form__input" placeholder="예: 웹 퍼블리싱, UI 개발" />
        </div>

        <div class="col-12 col-md-6 col-lg-3 resume-form__field">
            <label class="resume-form__label">
                <span class="resume-required">*</span>입사년월
            </label>
            <input type="month" class="form-control resume-form__input career-start-date" />
        </div>

        <div class="col-12 col-md-6 col-lg-3 resume-form__field">
            <label class="resume-form__label">
                퇴사년월
            </label>
            <input type="month" class="form-control resume-form__input career-end-date" />
        </div>

        <div class="col-12 col-md-6 col-lg-3 resume-form__field">
            <label class="resume-form__label">재직여부</label>
            <div class="resume-inline-check">
                <input class="form-check-input current-work-check" type="checkbox" id="${checkboxId}" />
                <label class="form-check-label" for="${checkboxId}">
                    현재 재직중
                </label>
            </div>
        </div>

        <div class="col-12 col-lg-3 resume-form__field">
            <label class="resume-form__label">고용형태</label>
            <select class="form-select resume-form__select">
                <option value="">선택</option>
                <option>정규직</option>
                <option>계약직</option>
                <option>인턴</option>
                <option>프리랜서</option>
            </select>
        </div>
    </div>
    `;

    careerList.appendChild(item);
    updateCareerTitles();
});

/* ====================================================
   현재 재직중 체크
==================================================== */
document.addEventListener("change", function (e) {
    if (e.target.classList.contains("current-work-check")) {
        const item = e.target.closest(".career-item");
        const endDate = item.querySelector(".career-end-date");

        if (e.target.checked) {
            endDate.value = "";
            endDate.disabled = true;
        } else {
            endDate.disabled = false;
        }
    }
});


/* ====================================================
   9️⃣ 경력 정렬
==================================================== */
function sortCareerByStartDate() {
    const items = Array.from(
        careerList.querySelectorAll(".career-item")
    );

    items.sort((a, b) => {
        const dateA = a.querySelector(".career-start-date").value;
        const dateB = b.querySelector(".career-start-date").value;

        if (!dateA) return 1;
        if (!dateB) return -1;

        return new Date(dateB) - new Date(dateA);
    });
    items.forEach(item => careerList.appendChild(item));
    updateCareerTitles();
}

document.addEventListener("change", function (e) {
    if (e.target.classList.contains("career-start-date")) {
        sortCareerByStartDate();
    }
});


/* ====================================================
   교육 추가
==================================================== */
addTrainingBtn?.addEventListener("click", function () {
    const count = trainingList.querySelectorAll(".training-item").length;
    const nextNumber = count + 1;

    const item = document.createElement("div");
    item.className = "resume-group training-item";

    item.innerHTML = `
    <div class="resume-group__header">
        <h3 class="resume-group__title">교육 ${nextNumber}</h3>
        <button type="button"
            class="resume-remove-btn remove-training-btn">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <div class="row">
        <div class="col-12 col-md-4 resume-form__field">
            <label class="resume-form__label">교육명</label>
            <input type="text"
            class="form-control resume-form__input">
        </div>

        <div class="col-12 col-md-4 resume-form__field">
            <label class="resume-form__label">교육기관</label>
            <input type="text"
            class="form-control resume-form__input">
        </div>

        <div class="col-12 col-md-4 resume-form__field">
            <label class="resume-form__label">수료년월</label>
            <input type="month"
            class="form-control resume-form__input">
        </div>
    </div>
    `;

    trainingList.appendChild(item);
    updateTrainingTitles();
});

/* ====================================================
   자격증 추가
==================================================== */
addLicenseBtn?.addEventListener("click", function () {
    const count = licenseList.querySelectorAll(".license-item").length;
    const nextNumber = count + 1;

    const item = document.createElement("div");
    item.className = "resume-group license-item";

    item.innerHTML = `
    <div class="resume-group__header">
        <h3 class="resume-group__title">자격증 ${nextNumber}</h3>
        <button type="button"
            class="resume-remove-btn remove-license-btn">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <div class="row">
        <div class="col-12 col-md-4 resume-form__field">
            <label class="resume-form__label">자격증명</label>
            <input type="text"
            class="form-control resume-form__input">
        </div>

        <div class="col-12 col-md-4 resume-form__field">
            <label class="resume-form__label">발급기관</label>
            <input type="text"
            class="form-control resume-form__input">
        </div>

        <div class="col-12 col-md-4 resume-form__field">
            <label class="resume-form__label">취득년월</label>
            <input type="month"
            class="form-control resume-form__input">
        </div>
    </div>
    `;
    licenseList.appendChild(item);
    updateLicenseTitles();
});


/* ====================================================
   삭제
==================================================== */
document.addEventListener("click", function (e) {
    const eduRemove = e.target.closest(".remove-education-btn");
    const careerRemove = e.target.closest(".remove-career-btn");
    const trainingRemove = e.target.closest(".remove-training-btn");
    const licenseRemove = e.target.closest(".remove-license-btn");

    if (eduRemove) {
        eduRemove.closest(".education-item").remove();
        updateEducationTitles();
    }
    if (careerRemove) {
        careerRemove.closest(".career-item").remove();
        updateCareerTitles();
    }
    if (trainingRemove) {
        trainingRemove.closest(".training-item").remove();
        updateTrainingTitles();
    }
    if (licenseRemove) {
        licenseRemove.closest(".license-item").remove();
        updateLicenseTitles();
    }
});


/* ====================================================
   제목 재정렬
==================================================== */
function updateEducationTitles() {
    const items = educationList.querySelectorAll(".education-item");
    items.forEach((item, index) => {
        item.querySelector(".resume-group__title")
            .textContent = `학력 ${index + 1}`;
    });
}

function updateCareerTitles() {
    const items = careerList.querySelectorAll(".career-item");
    items.forEach((item, index) => {
        item.querySelector(".resume-group__title")
            .textContent = `경력 ${index + 1}`;
    });
}

function updateTrainingTitles() {
    const items = trainingList.querySelectorAll(".training-item");
    items.forEach((item, index) => {
        item.querySelector(".resume-group__title")
            .textContent = `교육 ${index + 1}`;
    });
}

function updateLicenseTitles() {
    const items = licenseList.querySelectorAll(".license-item");
    items.forEach((item, index) => {
        item.querySelector(".resume-group__title")
            .textContent = `자격증 ${index + 1}`;
    });
}


/* ====================================================
   Aside 메뉴 active 처리 (Scroll Spy)
==================================================== */
const sections = document.querySelectorAll(".resume-section");
const menuItems = document.querySelectorAll(".resume-menu__item");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    menuItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});


/* ====================================================
   취업우대 / 병역
==================================================== */
const disabilityCheck = document.getElementById("benefitDisabled");
const disabilityWrap = document.getElementById("disabilityGradeWrap");

const militaryCheck = document.getElementById("militaryCheck");
const militaryWrap = document.getElementById("militaryWrap");

const militaryStatus = document.getElementById("militaryStatus");
const militaryPeriod = document.getElementById("militaryPeriod");

/* 초기 상태 */
if (militaryWrap) militaryWrap.style.display = "none";
if (militaryPeriod) militaryPeriod.style.display = "none";
if (disabilityWrap) disabilityWrap.style.display = "none";


/* 장애 */
disabilityCheck?.addEventListener("change", function () {
    disabilityWrap.style.display =
        this.checked ? "block" : "none";
});


/* 병역 체크 */
militaryCheck?.addEventListener("change", function () {
    if (this.checked) {
        militaryWrap.style.display = "block";
    } else {
        militaryWrap.style.display = "none";
        militaryPeriod.style.display = "none";
        if (militaryStatus) {
            militaryStatus.value = "";
        }
    }
});


/* 군필 여부 */
militaryStatus?.addEventListener("change", function () {
    if (this.value === "done") {
        militaryPeriod.style.display = "grid";
    } else {
        militaryPeriod.style.display = "none";
    }
});


document.getElementById("cancelResumeBtn")
  .addEventListener("click", function () {
    location.href = "/myPage/mypage-resume.html";
});
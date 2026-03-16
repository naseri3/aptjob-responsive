async function loadResume() {
    const res = await fetch("/assets/data/resume-dummy.json");
    const data = await res.json();

    document.getElementById("resumeTitle").textContent = data.title;
    document.getElementById("createdAt").textContent = data.createdAt;

    /* 기본정보 */
    document.getElementById("profileImage").src = data.basic.profileImage;
    document.getElementById("name").textContent = data.basic.name;
    document.getElementById("birth").textContent = data.basic.birthDate;
    document.getElementById("phone").textContent = data.basic.phone;
    document.getElementById("email").textContent = data.basic.email;

    document.getElementById("address").textContent =
        data.basic.address + " " + data.basic.detailAddress;


    /* 학력 */
    const educationList = document.getElementById("educationList");
    data.education.forEach(e => {
        educationList.innerHTML += `
      <div class="resume-view-item">
        <strong>${e.schoolName}</strong>
        <div class="d-flex justify-content-between">
            <span>${e.schoolType}</span>
            <span>${e.graduationDate} (${e.status})</span>
        </div>
      </div>
    `;

    });


    /* 경력 */
    const careerList = document.getElementById("careerList");
    data.career.forEach(c => {
        careerList.innerHTML += `
      <div class="resume-view-item">
        <strong>${c.company}</strong>
        <div class="d-flex justify-content-between">
            <span>${c.position} / ${c.department}</span>
            <span>${c.startDate} ~ ${c.isCurrent ? "재직중" : c.endDate}</span>
        </div>
        <p>${c.task}</p>
      </div>
    `;

    });


    /* 교육 */
    const trainingList = document.getElementById("trainingList");
    data.training.forEach(t => {
        trainingList.innerHTML += `
      <div class="resume-view-item">
        <strong>${t.name}</strong>
        <div class="d-flex justify-content-between">
            <span>${t.organization}</span>
            <span>${t.date}</span>
        </div>
      </div>
    `;
    });


    /* 자격증 */
    const licenseList = document.getElementById("licenseList");
    data.license.forEach(l => {
        licenseList.innerHTML += `
      <div class="resume-view-item">
        <strong>${l.name}</strong>
        <div class="d-flex justify-content-between">
            <span>${l.organization}</span>
            <span>${l.date}</span>
        </div>
      </div>
    `;
    });


    /* 취업 우대 및 병역 */
    const badgesWrap = document.getElementById("preferenceBadges");
    const militaryCard = document.getElementById("militaryCard");
    let badgesHTML = "";
    /* 보훈 */
    if (data.preferences.veteran) {
        badgesHTML += `<span>보훈대상</span>`;
    }
    /* 취업보호 */
    if (data.preferences.protected) {
        badgesHTML += `<span>취업보호대상</span>`;
    }
    /* 고용지원 */
    if (data.preferences.support) {
        badgesHTML += `<span>고용지원금대상</span>`;
    }
    /* 장애 */
    if (data.preferences.disabled) {
        const grade = data.preferences.disabilityGrade
            ? ` ${data.preferences.disabilityGrade}`
            : "";
        badgesHTML += `<span>장애${grade}</span>`;
    }
    badgesWrap.innerHTML = badgesHTML;

    /* 병역 */
    const m = data.preferences.military;
    if (m && m.status === "done") {
            militaryCard.innerHTML = `
        <div class="resume-military-card d-flex justify-content-between">
        <div class="resume-military-card__title">병역</div>
        <div class="resume-military-card__date">
            ${m.startDate.replace("-", ".")} ~ ${m.endDate.replace("-", ".")}
        </div>
        </div>
    `;
    }

    /* 자기소개 */
    document.getElementById("intro").textContent = data.intro;
}

loadResume();
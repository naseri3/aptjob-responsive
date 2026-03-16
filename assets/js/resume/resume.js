// 전역 변수
window.hasResumeData = false;

async function loadResumeDummy() {

    const res = await fetch("/assets/data/resume-dummy.json");
    const data = await res.json();

    if (data) {
        window.hasResumeData = true;
    }

    /* 이력서 제목 */
    document.getElementById("resumeTitle").value = data.title;

    /* 프로필 이미지 */
    document.getElementById("profilePreview").src = data.basic.profileImage;

    /* 기본정보 */
    document.getElementById("userName").value = data.basic.name;
    document.getElementById("birthDate").value = data.basic.birthDate;
    document.getElementById("phone").value = data.basic.phone;
    document.getElementById("email").value = data.basic.email;

    document.getElementById("postcode").value = data.basic.postcode;
    document.getElementById("address").value = data.basic.address;
    document.getElementById("detailAddress").value = data.basic.detailAddress;

    /* 자기소개 */
    document.getElementById("intro").value = data.intro;
}

loadResumeDummy();
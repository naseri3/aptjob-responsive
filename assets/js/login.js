/* ======================================================================
   공통 설정
====================================================================== */

const LOGIN_REDIRECT_URI =
    "https://portfolio-aptjob.netlify.app/subpage/login.html";


/* ======================================================================
   1️⃣ 구글 로그인
====================================================================== */
const GOOGLE_CLIENT_ID =
    "24355175704-aviumsce0orbnutandgjjsruphqca8g5.apps.googleusercontent.com";

const GOOGLE_AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=" + GOOGLE_CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(LOGIN_REDIRECT_URI) +
    "&response_type=code" +
    "&scope=openid email profile";

const googleBtn = document.querySelector(".google_login");

if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        window.location.href = GOOGLE_AUTH_URL;
    });
}


/* ======================================================================
   2️⃣ 네이버 로그인
====================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof naver_id_login !== "undefined") {
        var naverLogin = new naver_id_login(
            "hLO6jennO8FmeKMz2ntZ",
            LOGIN_REDIRECT_URI
        );

        var state = naverLogin.getUniqState();

        naverLogin.setButton("white", 2, 40);
        naverLogin.setDomain("https://portfolio-aptjob.netlify.app");
        naverLogin.setState(state);
        naverLogin.init_naver_id_login();
    }
});


/* ======================================================================
   3️⃣ 카카오 로그인
====================================================================== */

function loginWithKakao() {
    Kakao.Auth.authorize({
        redirectUri: LOGIN_REDIRECT_URI,
    });
}


/* ======================================================================
   4️⃣ 소셜 로그인 성공 처리
====================================================================== */
(function () {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1))
        .get("access_token");

    if (code || accessToken) {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("userName", "소셜회원");
        localStorage.setItem("userPhoto", "/assets/images/profile-user.png");

        alert("소셜 로그인 성공!");

        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

        if (redirectUrl) {
            sessionStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectUrl;
        } else {
            window.location.href = "/";
        }
    }
})();


/* ======================================================================
   5️⃣ 로그인 상태 UI
====================================================================== */

function checkLoginUI() {

    const isLogin = localStorage.getItem("isLogin") === "true";
    const area = document.getElementById("authArea");

    if (!area) return;

    if (isLogin) {
        const name = localStorage.getItem("userName") || "회원";
        const photo = localStorage.getItem("userPhoto") || "/assets/images/profile-user.png";

        area.innerHTML = `
            <div class="user-profile">
                <img src="${photo}" class="user-profile__img">
                <span class="user-profile__name">${name}님</span>
                <button id="logoutBtn" class="btn btn-sm btn-outline-secondary">로그아웃</button>
            </div>
        `;

    } else {
        area.innerHTML = `
            <a href="/subPage/login.html" class="site-user__btn text-decoration-none">
                <button id="loginBtn" class="btn btn-sm btn-outline-secondary">
                <i class="fa-regular fa-user"></i> 로그인
                </button>
            </a>
        `;
    }
}


/* ======================================================================
   6️⃣ 로그아웃
====================================================================== */
document.addEventListener("click", function (e) {
    if (e.target.id === "logoutBtn") {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");

        alert("로그아웃 되었습니다.");

        location.reload();
    }
});


/* ======================================================================
   알림 데이터
====================================================================== */
const ALARM_STORAGE_KEY = "aptjob_alarms";

function getAlarms() {
    const data = localStorage.getItem(ALARM_STORAGE_KEY);
    if (data) {
        const parsed = JSON.parse(data);
        // 데이터 구조 보정
        return parsed.map(a => ({
            id: a.id,
            style: a.style || "fa-regular",
            icon: a.icon || "fa-bell",
            text: a.text,
            read: a.read || false
        }));
    }
    const defaultAlarms = [
        { id: 1, style: "fa-regular", icon: "fa-bell", text: "지원 결과가 업데이트되었습니다", read: false },
        { id: 2, style: "fa-solid", icon: "fa-bullhorn", text: "새 공고가 등록되었습니다", read: false },
        { id: 3, style: "fa-regular", icon: "fa-clock", text: "마감 임박 공고가 있습니다", read: false }
    ];

    localStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(defaultAlarms));

    return defaultAlarms;
}

function saveAlarms(list) {
    localStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(list));
}

function unreadCount() {
    return getAlarms().filter(a => !a.read).length;
}


/* ======================================================================
   알람
====================================================================== */
function renderAlarmUI() {
    const area = document.getElementById("alarmArea");
    if (!area) return;

    const isLogin = localStorage.getItem("isLogin") === "true";

    // 로그인 안했을 때
    if (!isLogin) {
        area.innerHTML = `
      <button class="alarm-btn">
        <i class="fa-regular fa-bell"></i>
      </button>
    `;
        return;
    }

    const alarms = getAlarms();
    const alarmItems = alarms.map(a => {
        return `
    <div class="alarm-item ${a.read ? "" : "alarm-new"}" data-id="${a.id}">
      <i class="${a.style} ${a.icon} alarm-icon"></i>
      <span>${a.text}</span>
      ${!a.read ? `<span class="alarm-new-badge">NEW</span>` : ""}
    </div>
  `;
    }).join("");

    const alarmContent = `
    <div class="alarm-list">
      ${alarmItems}
      <div class="alarm-footer">
        <a href="/mypage/alarms.html">전체 알림 보기</a>
      </div>
    </div>
  `;

    const count = unreadCount();

    area.innerHTML = `
    <button class="alarm-btn">
      <i class="fa-regular fa-bell"></i>
      ${count > 0 ? `<span class="alarm-badge">${count}</span>` : ""}
    </button>
  `;

    const btn = area.querySelector(".alarm-btn");

    const pop = new bootstrap.Popover(btn, {
        html: true,
        placement: "bottom",
        trigger: "click",
        content: alarmContent
    });

    // 클릭하면 읽음 처리
    setTimeout(() => {
        document.querySelectorAll(".alarm-item").forEach(item => {
            item.addEventListener("click", () => {
                const id = Number(item.dataset.id);
                const list = getAlarms();
                const target = list.find(a => a.id === id);
                if (target) target.read = true;
                saveAlarms(list);
                renderAlarmUI();
            });
        });
    }, 200);
}

/* ======================================================================
   7️⃣ 테스트 로그인
====================================================================== */
function testLogin() {
    const idEl = document.getElementById("testId");
    const pwEl = document.getElementById("testPw");

    if (!idEl || !pwEl) return;

    const id = idEl.value;
    const pw = pwEl.value;

    if (id === "admin" && pw === "1234") {

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("userName", "홍길동");
        localStorage.setItem("userPhoto", "/assets/images/profile-user.png");

        alert("로그인 성공!");
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
            sessionStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectUrl;
        } else {
            window.location.href = "/";

        }
    } else {
        alert("아이디 / 비밀번호 틀림");
    }
}


/* ======================================================================
   8️⃣ 헤더 로드 후 실행
====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        checkLoginUI();
        renderAlarmUI();
    }, 300);
});
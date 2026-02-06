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
   네이버 Access Token 처리
====================================================================== */
/*
(function () {
  const hash = window.location.hash;

  if (hash.includes("access_token")) {
    const token = new URLSearchParams(hash.substring(1))
      .get("access_token");

    console.log("네이버 토큰:", token);

    // 포폴용 로그인 처리
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userName", "네이버회원");

    alert("네이버 로그인 성공!");

    // hash 제거
    window.location.href = "/";
  }
})();
*/

/* ======================================================================
   3️⃣ 카카오 로그인
====================================================================== */

function loginWithKakao() {
  Kakao.Auth.authorize({
    redirectUri: LOGIN_REDIRECT_URI,
  });
}

/* ======================================================================
   4️⃣ 소셜 로그인 Redirect 처리
   (인가코드 수신 → 로그인 처리)
====================================================================== */

(function () {
  const params = new URLSearchParams(window.location.search);

  const code = params.get("code");
  const kakaoCode = params.get("code"); // 카카오도 동일 파라미터 사용

  if (code || kakaoCode) {
    console.log("인가코드 수신:", code);

    // 👉 포폴용 로그인 처리
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userName", "소셜회원");

    alert("소셜 로그인 성공!");

    // 메인으로 이동
    window.location.href = "/";
  }
})();

/* ======================================================================
   5️⃣ 로그인 상태 UI 제어
====================================================================== */

function checkLoginUI() {
  const isLogin = localStorage.getItem("isLogin") === "true";

  const btn = document.getElementById("authBtn");
  const icon = document.getElementById("authIcon");
  const text = document.getElementById("authText");

  if (!btn || !icon || !text) return;

  if (isLogin) {
    btn.href = "#";
    icon.classList.replace("fa-right-from-bracket", "fa-user");
    text.textContent = "로그아웃";
  } else {
    btn.href = "/subpage/login.html";
    icon.classList.replace("fa-right-from-bracket", "fa-user");
    text.textContent = "로그인";
  }
}

/* ======================================================================
   6️⃣ 로그아웃
====================================================================== */

document.addEventListener("click", (e) => {
  const btn = e.target.closest("#authBtn");
  if (!btn) return;

  const isLogin = localStorage.getItem("isLogin") === "true";

  if (!isLogin) return;

  e.preventDefault();

  localStorage.removeItem("isLogin");
  localStorage.removeItem("userName");

  alert("로그아웃 되었습니다.");
  location.reload();
});

/* ======================================================================
   7️⃣ 테스트 로그인 (일반 로그인)
====================================================================== */

function testLogin() {
  const idEl = document.getElementById("testId");
  const pwEl = document.getElementById("testPw");

  if (!idEl || !pwEl) return;

  const id = idEl.value;
  const pw = pwEl.value;

  if (id === "admin" && pw === "1234") {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userName", "관리자");

    alert("로그인 성공!");
    location.href = "/";
  } else {
    alert("아이디 / 비밀번호 틀림");
  }
}

/* ======================================================================
   8️⃣ 헤더 로드 후 로그인 UI 실행
====================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  checkLoginUI();
});



/* ======================================================================
   소셜 로그인 성공여부
====================================================================== */
(function () {
  /* query */
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  /* hash */
  const hash = window.location.hash;
  const accessToken = new URLSearchParams(hash.substring(1))
    .get("access_token");

  if (code || accessToken) {

    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userName", "소셜회원");

    alert("소셜 로그인 성공!");
    window.location.href = "/";
  }

})();

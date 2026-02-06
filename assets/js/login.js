/* ======================================================================
   구글 로그인 (OAuth2 Authorization Code)
====================================================================== */
const GOOGLE_CLIENT_ID = "24355175704-aviumsce0orbnutandgjjsruphqca8g5.apps.googleusercontent.com";

const REDIRECT_URI =
    "http://127.0.0.1:5500/subPage/login.html";

const GOOGLE_AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=" + GOOGLE_CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&response_type=code" +
    "&scope=openid email profile";

const googleBtn = document.querySelector(".google_login");

if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        window.location.href = GOOGLE_AUTH_URL;
    });
}

const params = new URLSearchParams(window.location.search);
const authCode = params.get("code");

if (authCode) {
    localStorage.setItem("isLogin", "true");
    alert("로그인 성공!");
    location.href = "/";
}



/* ======================================================================
   네이버 로그인
   - 로그인 페이지에서만/버튼 영역이 있을 때만 초기화
   - 중복 init 제거
====================================================================== */
var naver_id_login = new naver_id_login("hLO6jennO8FmeKMz2ntZ", "https://portfolio-aptjob.netlify.app/");
        var state = naver_id_login.getUniqState();
        naver_id_login.setButton("white", 2,40);
        naver_id_login.setDomain("https://portfolio-aptjob.netlify.app/subpage/login");
        naver_id_login.setState(state);
        naver_id_login.setPopup();
        naver_id_login.init_naver_id_login();

  // 접근 토큰 값 출력
  alert(naver_id_login.oauthParams.access_token);
  // 네이버 사용자 프로필 조회
  naver_id_login.get_naver_userprofile("naverSignInCallback()");
  // 네이버 사용자 프로필 조회 이후 프로필 정보를 처리할 callback function
  function naverSignInCallback() {
    alert(naver_id_login.getProfileData('email'));
    alert(naver_id_login.getProfileData('nickname'));
    alert(naver_id_login.getProfileData('age'));
  }

/* ======================================================================
   카카오 로그인
   - SDK가 있는 페이지에서만 동작하도록 가드
====================================================================== */
(function initKakao() {
  if (!window.Kakao) return;
  const KAKAO_JS_KEY =
    "1aeb3e9a49e983e68615734accc31d91"; // JS 키만 사용
  if (!Kakao.isInitialized()) {
    Kakao.init(KAKAO_JS_KEY);
    console.log("Kakao SDK initialized");
  }
})();

function loginWithKakao() {
  if (!window.Kakao) {
    alert("카카오 SDK 로드 안됨");
    return;
  }
  const REDIRECT_URI =
    window.location.origin + "/subpage/login.html";

  Kakao.Auth.authorize({
    redirectUri: REDIRECT_URI,
  });
}
/* ======================================================================
   KAKAO LOGIN SUCCESS
====================================================================== */

(function kakaoLoginSuccess() {

  if (!window.Kakao) return;

  const hash = window.location.hash;

  if (!hash.includes("access_token")) return;

  const token = new URLSearchParams(
    hash.replace("#", "")
  ).get("access_token");

  if (!token) return;

  Kakao.Auth.setAccessToken(token);

  Kakao.API.request({
    url: "/v2/user/me",

    success: function (res) {

      const name =
        res.kakao_account.profile.nickname;

      console.log("카카오 로그인:", name);

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("userName", name);

      alert("카카오 로그인 성공!");

      location.href = "/";
    },

    fail: function (error) {
      console.error(error);
    },

  });

})();







/* ======================================================================
   로그인 상태 UI 제어
   - common.js에서 header 로드 후 checkLoginUI() 호출됨 :contentReference[oaicite:1]{index=1}
====================================================================== */
function checkLoginUI() {
    const isLogin = localStorage.getItem("isLogin") === "true";

    const btn = document.getElementById("authBtn");
    const icon = document.getElementById("authIcon");
    const text = document.getElementById("authText");
    if (!btn || !icon || !text) return;

    if (isLogin) {
        btn.href = "#";
        icon.classList.replace("fa-user", "fa-right-from-bracket");
        text.textContent = "로그아웃";
    } else {
        btn.href = LOGIN_PATH;
        icon.classList.replace("fa-right-from-bracket", "fa-user");
        text.textContent = "로그인";
    }
}


/* ======================================================================
   로그아웃 이벤트
====================================================================== */
document.addEventListener("click", (e) => {
    const btn = e.target.closest("#authBtn");
    if (!btn) return;

    const isLogin = localStorage.getItem("isLogin") === "true";

    // 로그인 안 한 상태면 그냥 링크 이동
    if (!isLogin) return;

    e.preventDefault();

    const confirmLogout = confirm("로그아웃 하시겠습니까?");
    if (!confirmLogout) return;

    // ✅ 필요한 키만 제거 (clear 금지)
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userName");

    alert("로그아웃 되었습니다.");
    location.reload();
});


/* ======================================================================
   테스트 로그인
====================================================================== */
function testLogin() {
    const idEl = document.getElementById("testId");
    const pwEl = document.getElementById("testPw");
    if (!idEl || !pwEl) return;

    const id = idEl.value;
    const pw = pwEl.value;

    if (id === "admin" && pw === "1234") {
        localStorage.setItem("isLogin", "true");
        alert("로그인 성공!");
        location.href = "/";
    } else {
        alert("아이디/비밀번호 틀림");
    }
}



/* ======================================================
   NAVER LOGIN SUCCESS
====================================================== */
window.addEventListener("load", function () {
    if (typeof naver_id_login === "undefined") return;
    const NAVER_REDIRECT_URI =
        window.location.origin + "/subpage/login.html";
    const naverLogin = new naver_id_login(
        "hLO6jennO8FmeKMz2ntZ",
        NAVER_REDIRECT_URI
    );
    /* 🔥 사용자 정보 요청 */
    naverLogin.get_naver_userprofile("naverSignInCallback()");

});

/* 콜백 함수 */
function naverSignInCallback() {
    const email = naver_id_login.getProfileData("email");
    const name = naver_id_login.getProfileData("name");
    console.log("네이버 로그인 성공:", email, name);
    /* 로그인 상태 저장 */
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userName", name);
    alert("네이버 로그인 성공!");
    /* 메인 이동 */
    location.href = "/";
}

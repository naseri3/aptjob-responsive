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
(function initNaverLogin() {

  /* SDK 체크 */
  if (typeof naver_id_login === "undefined") return;

  /* 로그인 페이지 아니면 종료 */
  const naverWrap = document.getElementById("naver_id_login");
  if (!naverWrap) return;

  /* 🔥 네이버 전용 Redirect URI */
  const NAVER_REDIRECT_URI =
    window.location.origin + "/subpage/login.html";

  try {

    const naverLogin = new naver_id_login(
      "hLO6jennO8FmeKMz2ntZ",
      NAVER_REDIRECT_URI
    );

    const state = naverLogin.getUniqState();

    naverLogin.setButton("white", 2, 40);
    naverLogin.setState(state);
    naverLogin.setPopup();
    naverLogin.init_naver_id_login();

  } catch (e) {
    console.error("[NAVER LOGIN INIT ERROR]", e);
  }

})();


/* ======================================================================
   카카오 로그인
   - SDK가 있는 페이지에서만 동작하도록 가드
====================================================================== */
function loginWithKakao() {
  if (!window.Kakao) {
    alert("카카오 SDK가 로드되지 않았습니다. (로그인 페이지에서 시도해주세요)");
    return;
  }

  Kakao.Auth.authorize({
    redirectUri: REDIRECT_URI,
  });
}

/* (데모용) 토큰 표시 - 카카오 SDK 있을 때만 실행 */
(function safeDisplayKakaoToken() {
  if (!window.Kakao) return;

  try {
    displayToken();
  } catch (e) {
    // 데모영역 없거나 SDK 상태 이슈면 무시
  }
})();

function displayToken() {
  const token = getCookie("authorize-access-token");
  if (!token) return;

  Kakao.Auth.setAccessToken(token);

  Kakao.Auth.getStatusInfo()
    .then(function (res) {
      if (res.status === "connected") {
        const el = document.getElementById("token-result");
        if (el) {
          el.innerText = "login success, token: " + Kakao.Auth.getAccessToken();
        }
      }
    })
    .catch(function () {
      Kakao.Auth.setAccessToken(null);
    });
}

function getCookie(name) {
  const parts = document.cookie.split(name + "=");
  if (parts.length === 2) return parts[1].split(";")[0];
}


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
     icon.classList.replace("fa-right-from-bracket", "fa-user");
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

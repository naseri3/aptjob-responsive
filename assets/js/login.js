/** 구글 로그인 API */
const GOOGLE_CLIENT_ID = "24355175704-aviumsce0orbnutandgjjsruphqca8g5.apps.googleusercontent.com";
const REDIRECT_URI = "https://portfolio-aptjob.netlify.app/subpage/login.html";

const GOOGLE_AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=" + GOOGLE_CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&response_type=code" +
    "&scope=openid email profile";

const googleBtn = document.querySelector(".google_login");

googleBtn.addEventListener("click", () => {
    window.location.href = GOOGLE_AUTH_URL;
});
const params = new URLSearchParams(window.location.search);
const authCode = params.get("code");

if (authCode) {
    console.log("로그인 성공, code:", authCode);
    alert("로그인 성공!");
}


/** 네이버 로그인 API */
document.addEventListener("DOMContentLoaded", function () {
  var naver_id_login = new naver_id_login(
    "hLO6jennO8FmeKMz2ntZ",
    "https://portfolio-aptjob.netlify.app/subpage/login.html"
  );

  var state = naver_id_login.getUniqState();
  naver_id_login.setButton("white", 2, 40);
  naver_id_login.setState(state);
  naver_id_login.setPopup();
  naver_id_login.init_naver_id_login();
});
var naver_id_login = new naver_id_login("hLO6jennO8FmeKMz2ntZ", "https://portfolio-aptjob.netlify.app/subpage/login.html");
        var state = naver_id_login.getUniqState();
        naver_id_login.setButton("white", 2,40);
        naver_id_login.setDomain("https://portfolio-aptjob.netlify.app");
        naver_id_login.setState(state);
        naver_id_login.setPopup();
        naver_id_login.init_naver_id_login();


/** 카카오 로그인 API */
function loginWithKakao() {
    Kakao.Auth.authorize({
      redirectUri: 
      'https://portfolio-aptjob.netlify.app/subpage/login.html'
      // 앱에 등록된 카카오 로그인에서 사용할 Redirect URI 입력
    });
  }

  // 아래는 데모를 위한 UI 코드입니다.
  displayToken()
  function displayToken() {
    var token = getCookie('authorize-access-token');

    if(token) {
      Kakao.Auth.setAccessToken(token);
      Kakao.Auth.getStatusInfo()
        .then(function(res) {
          if (res.status === 'connected') {
            document.getElementById('token-result').innerText
              = 'login success, token: ' + Kakao.Auth.getAccessToken();
          }
        })
        .catch(function(err) {
          Kakao.Auth.setAccessToken(null);
        });
    }
  }

  function getCookie(name) {
    var parts = document.cookie.split(name + '=');
    if (parts.length === 2) { return parts[1].split(';')[0]; }
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

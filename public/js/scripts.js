window.addEventListener("load", function () {
    const mediaQuery = window.matchMedia("(max-width: 1000px)");
    const page = document.getElementById("pageShow");
    if (page) {
        if (mediaQuery.matches) {
            document.getElementById("pageShow").style.display = "none";
        } else {
            document.getElementById("pageShow").style.display = "block";
        }
    }
});

window.addEventListener("load", function () {
    setTimeout(() => {
        const msg = document.getElementById("msg");
        if (msg) {
            document.getElementById("msg").style.display = "none";
        }
    }, 2000)
});

window.addEventListener("load", function () {
    let style = document.getElementById("style");
    let cookie = getCookie("style");
    if (style) {
        if (cookie == false) {
            document.cookie = "style=/css/styles.css";
        } else {
            style.href = cookie;
        }
    }
});

window.addEventListener("load", function () {
    const pswInput = document.getElementById("psw");
    const letter = document.getElementById("letter");
    const capital = document.getElementById("capital");
    const number = document.getElementById("number");
    const special = document.getElementById("special");
    const length = document.getElementById("length");

    if (pswInput) {
        pswInput.onfocus = function () {
            document.getElementById("req-psw").style.display = "block";
        };

        pswInput.onblur = function () {
            document.getElementById("req-psw").style.display = "none";
        };

        pswInput.onkeyup = function () {
            const lowerCaseLetters = /[a-z]/g;
            if (pswInput.value.match(lowerCaseLetters)) {
                letter.classList.remove("invalid");
                letter.classList.add("valid");
            } else {
                letter.classList.remove("valid");
                letter.classList.add("invalid");
            }
            const upperCaseLetters = /[A-Z]/g;
            if (pswInput.value.match(upperCaseLetters)) {
                capital.classList.remove("invalid");
                capital.classList.add("valid");
            } else {
                capital.classList.remove("valid");
                capital.classList.add("invalid");
            }
            const numbers = /[0-9]/g;
            if (pswInput.value.match(numbers)) {
                number.classList.remove("invalid");
                number.classList.add("valid");
            } else {
                number.classList.remove("valid");
                number.classList.add("invalid");
            }
            const specials = /[$&+,:;=?@#|'<>.^*()%!-]/g;
            if (pswInput.value.match(specials)) {
                special.classList.remove("invalid");
                special.classList.add("valid");
            } else {
                special.classList.remove("valid");
                special.classList.add("invalid");
            }
            if (pswInput.value.length >= 8) {
                length.classList.remove("invalid");
                length.classList.add("valid");
            } else {
                length.classList.remove("valid");
                length.classList.add("invalid");
            }

            const psw1 = document.getElementById("psw").value;
            const psw2 = document.getElementById("pswConf").value;
            if (psw2.length > 0) {
                if (psw1 !== psw2) {
                    document.getElementById("pswOk").style.display = "block";
                } else {
                    document.getElementById("pswOk").style.display = "none";
                }
            }
        };
    }
});

window.addEventListener("load", function () {
    const pswOk = document.getElementById("pswOk");
    const pswConf = document.getElementById("pswConf");

    if (pswOk) {
        pswConf.addEventListener("keyup", function (e) {
            const psw1 = document.getElementById("psw").value;
            const psw2 = document.getElementById("pswConf").value;
            if (psw1.length > 0) {
                if (psw1 !== psw2) {
                    pswOk.style.display = "block";
                } else {
                    pswOk.style.display = "none";
                }
            }
        });
    }
});

window.addEventListener("load", function () {
    const senhaCaps = document.getElementById("psw");
    const messageCaps = document.getElementById("messageCapsLock");
    const senhaCapsConf = document.getElementById("pswConf");
    const messageCapsConf = document.getElementById("messageCapsLockConf");
    if (senhaCaps) {
        senhaCaps.addEventListener("click", function (e) {
            if (e.getModifierState("CapsLock")) {
                messageCaps.textContent = "Caps Lock Ativado!";
            }
        });
        senhaCaps.addEventListener("blur", function (e) {
            messageCaps.textContent = "";
        });
    }
    if (senhaCapsConf) {
        senhaCapsConf.addEventListener("click", function (e) {
            if (e.getModifierState("CapsLock")) {
                messageCapsConf.textContent = "Caps Lock Ativado!";
            }
        });
        senhaCapsConf.addEventListener("blur", function (e) {
            messageCapsConf.textContent = "";
        });
    }
});

window.addEventListener("pageshow", function () {
    if (window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) { location.reload(); }
});

window.addEventListener("pageshow", function () {
    fetch(location.href).then(response => (response.status == 404) ? this.document.getElementById("btnRight").style.display = "none" : this.document.getElementById("btnRight").style.display = "block")
});

window.onbeforeunload = function (event) {
    if (performance.navigation.type === 1) {
        loading();
    }
};

window.addEventListener("submit", function () {
    loading();
});

$(function () {
    $("#time").mask("00:00")
});

function loading() {
    const content = document.getElementById("content");
    const loading = document.getElementById("loading");
    if (content) {
        content.style.display = "none";
        loading.style.display = "block";
        document.addEventListener("DOMContentLoaded", () => {
            content.style.display = "block";
            loading.style.display = "none";
        });
        setTimeout(() => {
            content.style.display = "block";
            loading.style.display = "none";
        }, 10000)
    }
}

function checkboxPassword() {
    let checkValue = document.getElementById("checkPassword")
    const password = document.getElementById("psw");
    const passwordConf = document.getElementById("pswConf");
    if (password) {
        if (checkValue.checked == true) {
            password.type = "text";
        } else {
            password.type = "password";
        }
    }
    if (passwordConf) {
        if (checkValue.checked == true) {
            passwordConf.type = "text";
        } else {
            passwordConf.type = "password";
        }
    }
}

function hideNav() {
    let toggleAble = document.getElementById("navbar");
    toggleAble.classList.toggle("navVisible");
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    let [cookieName, cookieValue] = '';
    for (let i = 0; i < cookies.length; i++) {
        [cookieName, cookieValue] = cookies[i].split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return false;
}

function darkMode() {
    let style = getCookie("style");
    if (style == "/css/styles.css") {
        document.cookie = "style=/css/styles2.css; path=/";
        window.location.reload();
    } else if (style == "/css/styles2.css") {
        document.cookie = "style=/css/styles.css; path=/";
        window.location.reload();
    }
}

function capsLock() {
    const senhaCaps = document.getElementById("psw");
    const messageCaps = document.getElementById("messageCapsLock");
    if (senhaCaps) {
        senhaCaps.addEventListener("keyup", function (e) {
            if (e.getModifierState("CapsLock")) {
                messageCaps.textContent = "Caps Lock Ativado!";
            } else {
                messageCaps.textContent = "";
            }
        });
    };
}

function capsLockConf() {
    const senhaCapsConf = document.getElementById("pswConf");
    const messageCapsConf = document.getElementById("messageCapsLockConf");
    if (senhaCapsConf) {
        senhaCapsConf.addEventListener("keyup", function (e) {
            if (e.getModifierState("CapsLock")) {
                messageCapsConf.textContent = "Caps Lock Ativado!";
            } else {
                messageCapsConf.textContent = "";
            }
        })
    };
}
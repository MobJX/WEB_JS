/**
 * Login management
 */

(function () { // avoid variables ending up in the global scope

    document.getElementById("login").addEventListener('click', (e) => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'CheckLogin', e.target.closest("form"),
                function (x) {
                    if (x.readyState == XMLHttpRequest.DONE) {
                        var message = x.responseText;
                        switch (x.status) {
                            case 200:
                                sessionStorage.setItem('username', message);

                                // Check if user is new or existing
                                // Set isNewUser cookie
                                let username = message.replace(/\r?\n|\r/g, '');

                                // Check if user is new or existing
                                let k = getCookie(username);
                                if (k == null) {
                                    setCookie('isNewUser', 'true', 30)
                                } else {
                                    setCookie('isNewUser', 'false', 30);
                                }

                                setCookie(username, 'true', 30);
                                window.location.href = "homePage.html";
                                break;
                            case 400: // bad request
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 401: // unauthorized
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 500: // server error
                                document.getElementById("errormessage").textContent = message;
                                break;
                        }
                    }
                }
            );
        } else {
            form.reportValidity();
        }
    });

    function setCookie(cookieName, cookieValue, daysToExpire) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);
        const expirationUTCString = expirationDate.toUTCString();
        document.cookie = `${cookieName}=${cookieValue}; expires=${expirationUTCString}; path=/`;
    }
    function getCookie(cookieName) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return null;
    }

})();

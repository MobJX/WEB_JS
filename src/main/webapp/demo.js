(function () {
    document.getElementById("loginbutton").addEventListener("click", function (e) {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var req = new XMLHttpRequest();
        req.open("POST", "/login");
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    window.location.href = req.getResponseHeader("homePage");
                    window.sessionStorage.setItem('username', username);
                } else {
                    document.getElementById("alert").textContent = "Wrong username or password";
                }
            }
        }
        req.send("username=" + username + "&password=" + password);
    }, false  )
})
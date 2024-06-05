(function () {
    window.addEventListener('load', init);

    function init() {
        window.addEventListener("resize", res);
        document.addEventListener("keydown", move);
        document.getElementById("theme").addEventListener("click", theme);
        document.getElementById("pink").addEventListener("click", pink);
        document.getElementById("set").addEventListener("click", settings);
        document.getElementById("rez").addEventListener("click", rating);
        document.getElementById("clset").addEventListener("click", clsettings);
        document.getElementById("clrez").addEventListener("click", clrating);
        document.getElementById("starbut").addEventListener("click", start);
        document.getElementById("name").addEventListener("keyup", prov);
        document.getElementById("pause").addEventListener("click", pause);
        document.getElementById("con").addEventListener("click", con);
        for (let i = 0; i < document.getElementsByName("diff").length; i++) {
            document.getElementsByName("diff")[i].addEventListener("click", change);
        }
        themeLoc();
        begin();

        let pl = document.createElement('div');
        pl.className = "player";
        w = document.body.clientWidth * 0.2;
        pl.style.left = w + 'px';
        pl.style.top = 400 + 'px';
        document.body.append(pl);
        first();
    }

    let ua = 1, up = 1;

    function change() {
        alert(this.value);
        ua = this.value;
        a *= ua;
        up = this.value;
    }

    let y;
    let ssp, sa, sv;

    function pause() {
        ssp = sp;
        sa = a;
        sv = vy;
        sp = 0;
        a = 0;
        vy = 0;
        clearInterval(t);
        clearInterval(gr);
        clearInterval(ob);
        begin();
        this.blur();
        document.getElementById("con").disabled = false;
    }

    function con() {
        sp = ssp;
        a = sa;
        vy = sv;
        t = setInterval(score, 400);
        gr = setInterval(grav, 30);
        ob = setInterval(obstacle, 10);
        let st = document.getElementById("start");
        st.close();
        this.blur();
    }

    function prov() {
        let butt = document.getElementById("starbut");

        if (this.value.length < 3 || this.value.length > 8) {
            butt.disabled = true;
        } else {
            butt.disabled = false;
        }
    }

    async function first() {
        try {
            const response = await fetch('https://totodor.github.io/Totodor-github.io/dt', {
                method: 'GET',
                headers: {
                    Accept: 'base/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const obj = await response.json();
            JSON.parse(localStorage.getItem("players"));
            let A = new coolRating(obj.player[0].name, obj.player[0].score);
            localStorage.setItem("players", JSON.stringify([A, new coolRating(0, 0)]));
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    let sp, a, hj;
    function begin() {
        let st = document.getElementById("start");
        st.showModal();
        sp = 0;
        a = 0;
    }

    let t, gr, ob;

    function res() {
        let pl = document.getElementsByClassName("player")[0];
        if (pl.offsetHeight == 70) {
            sp = 2;
            a = 0.03 * ua;
            hj = -8;
        } else {
            sp = 4;
            a = 0.05 * ua;
            hj = -12;
        }
        let obj = document.getElementsByClassName("obs");
        for (let i = 0; i < obj.length; i++) {
            obj[i].remove();
        }
    }

    function start() {
        let st = document.getElementById("start");
        let pl = document.getElementsByClassName("player")[0];
        st.close();
        if (pl.offsetHeight == 70) {
            sp = 2;
            a = 0.03;
            hj = -8;
        } else {
            sp = 4;
            a = 0.05;
            hj = -12;
        }

        document.getElementById("score").innerText = "000000";
        pl.className = "player";
        pl.style.top = window.innerHeight - 150 - pl.offsetHeight - 30 + "px";
        clearInterval(t);
        t = setInterval(score, 400);
        let obj = document.getElementsByClassName("obs");
        for (let i = 0; i < obj.length; i++) {
            obj[i].remove();
        }

        document.getElementsByClassName("player")[0].style.top = window.innerHeight * 0.5;
        clearInterval(gr);
        clearInterval(ob);
        gr = setInterval(grav, 30);
        ob = setInterval(obstacle, 10);
    }

    function score() {
        let sc = document.getElementById("score");
        let s = parseInt(sc.innerText) + 1;
        if (s >= 100) {
            document.getElementById("pink").disabled = false;
        }
        sc.innerText = String(s).padStart(6, '0');
        sp += a;
    }

    function rating() {
        pause();
        let rat = document.getElementById("rating");
        rat.showModal();
        show();
    }

    function clrating() {
        con();
        let rez = document.getElementById("rating");
        document.getElementById("rez").blur();
        document.getElementById("clrez").blur();
        rez.close();
    }

    async function show() {
        let rat = document.getElementById("rat");
        rat.innerHTML = "";
        let rt = document.createElement('span');
        rt.innerText = "Rating";
        rt.className = "head";
        rat.append(rt);
        const loc = JSON.parse(localStorage.getItem("players"));
        for (let i = 0; i < loc.length - 1; i++) {
            let pl1 = document.createElement('div');
            pl1.classList = "rating";
            nm = document.createElement('span');
            nm.append(loc[i].name);
            nm.classList = "name";
            sc = document.createElement('span');
            sc.classList = "score";
            sc.append(loc[i].score);
            pl1.append(nm, sc);
            rat.append(pl1);
        }
    }

    function obstacle() {
        let obs = document.getElementsByClassName("obs")[0];
        let pl = document.getElementsByClassName("player")[0];
        if (obs == null) {
            spawn();
        } else {
            var l = parseInt(obs.style.left) || 0;
            if (l < -80) {
                obs.remove();
            } else {
                obs.style.left = l - sp + "px";
            }
            var plt = parseInt(pl.style.top) || 0;
            var pll = (parseInt(pl.style.left) || 0);
            var plh = parseInt(pl.offsetHeight) || 0;
            var plw = parseInt(pl.offsetWidth) || 0;
            if (plt + plh * 0.9 + "px" > obs.style.top &&
                (pll + plw * 0.8 > parseInt(obs.style.left) || 0) &&
                (pll - obs.offsetWidth * 0.7 < parseInt(obs.style.left) || 0)) {
                death();
            }
        }
    }

    function compare(a, b) {
        if (a.score > b.score) return -1;
        if (a.score == b.score) return 0;
        if (a.score < b.score) return 1; // если первое значение меньше второго
    }

    function death() {
        let pl = document.getElementsByClassName("player")[0];
        pl.className += " death";
        sp = 0;
        a = 0;
        vy = 0;
        clearInterval(t);
        let name = document.getElementById("name").value;
        let sc = document.getElementById("score").innerText;
        let b = new coolRating(name, sc);

        let locp = JSON.parse(localStorage.getItem("players"));
        let user = locp.find(item => item.name == name);
        if (user == undefined) {
            locp.push(b);
            locp.sort(compare);
        } else {
            if (user.score < sc) {
                user.score = sc;
            }
        }

        localStorage.players = JSON.stringify(locp);
        clearInterval(gr);
        clearInterval(ob);
        let k1 = 0;
        let r = setInterval(() => {
            if (k1 < 20) {
                playtop = parseInt(pl.style.top) || 0;
                pl.style.top = playtop - 5 + "px";
                k1++;
            } else {
                clearInterval(r);
            }
        }, 20);
        setTimeout(() => {
            setInterval(() => {
                if (k1 < 80) {
                    playtop = parseInt(pl.style.top) || 0;
                    pl.style.top = playtop + 10 + "px";
                    k1++;
                } else {
                    clearInterval(r);
                }
            }, 20);
        }, 400);
        y = setTimeout(start, 2000);
    }

    function spawn() {
        let obj = document.createElement('div');
        obj.className = "obs";
        if (Math.random() < 0.5) {
            obj.classList += " min";
        } else {
            obj.classList += " max";
        }
        document.body.append(obj);
        obj.style.top = window.innerHeight - obj.offsetHeight - 150 + "px";
        obj.style.left = document.body.clientWidth + Math.floor(Math.random() * (500 / up)) + "px";
    }

    function settings() {
        pause();
        let di = document.getElementById("di");
        document.getElementById("set").blur();
        di.showModal();
    }

    function clsettings() {
        con();
        let di = document.getElementById("di");
        document.getElementById("set").blur();
        document.getElementById("clset").blur();
        di.close();
    }

    let x0;
    window.addEventListener("resize", function () {
        x0 = document.body.clientWidth * 0.1;
    })

    let vy = 0;
    let g = .4;
    let jump = false;
    function grav() {
        let pl = document.getElementsByClassName("player")[0];
        var h = parseInt(pl.offsetHeight) || 0;
        var floor = window.innerHeight - 150 - h + "px";
        var top = parseInt(pl.style.top) || 0;
        pl.style.top = top + vy + "px";
        pl.style.left = x0 + "px";
        if (pl.style.top < floor) {
            vy += g;
        }
        if (jump && vy >= 0) {
            document.getElementsByClassName("player")[0].className = "player jumpDown";
        }
        if (pl.style.top >= floor) {
            pl.style.top = floor;
            vy = 0;
            jump = false;
            document.getElementsByClassName("player")[0].className = "player";
        }
    }

    function move(event) {
        if (!jump) {
            let key = event.code;
            if (key == 'ArrowUp' || key == "Space") {
                vy = hj;
            }
            jump = true;
            document.getElementsByClassName("player")[0].className = "player jumpUp";
        }
    }

    function theme() {
        if (document.body.getAttribute("data-theme") == "dark") {
            document.body.removeAttribute("data-theme");
            localStorage.theme = "";
        } else {
            document.body.setAttribute('data-theme', "dark");
            localStorage.theme = "dark";
        }
        document.getElementById("theme").blur();
    }

    function pink() {
        if (document.body.getAttribute("data-theme") == "pink") {
            document.body.setAttribute("data-theme", localStorage.theme);
        } else {
            document.body.setAttribute('data-theme', "pink");
        }
        document.getElementById("pink").blur();
    }

    function themeLoc() {
        if (window.localStorage) {
            t = localStorage.theme;
            if (t == "dark") {
                document.body.setAttribute('data-theme', "dark");
            } else {
                document.body.removeAttribute("data-theme");
            }
        }
    }
})();

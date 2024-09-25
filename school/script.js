function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

window.onload = function() {
    console.log(getCookie('token'))
    if(getCookie('token') != undefined)
    {
        fetch(`http://127.0.0.1:8000/checkToken?token=${getCookie('token')}`, {
            method: "GET",
        })
        .then((response) => {
            if (!response.ok) {
                return false;
            }
            return response.json();
          })
        .then((data) => {
            console.log(data);
    
            if (data["Successfully"] == true) {
                var container = document.getElementById('container'); 
                var loginWindow = document.getElementById('login_window'); 
                container.classList.toggle("unblur")
        
                loginWindow.classList.toggle("hide")
            }
            });
    }
}


function onClickLoginButton() {
    fetch(`http://127.0.0.1:8000/login?login=${document.getElementById("login_input").value}&password=${document.getElementById("password_input").value}`, {
        method: "GET",
    })
    .then((response) => {
        if (!response.ok) {
            return false;
        }
        return response.json();
      })
    .then((data) => {
        console.log(data);

        if (data["Successfully"] == true) {
            var container = document.getElementById('container'); 
            var loginWindow = document.getElementById('login_window'); 
            container.classList.toggle("unblur")
    
            loginWindow.classList.toggle("hide")

            document.cookie = `token=${data['Token']}`

            onClickBarButton('Schedule')
        }
        else
        {
            openPopup()
        }
      });    
}

function loadSchedule() {
    fetch(`http://127.0.0.1:8000/schedule`, {
        method: "GET",
    })
    .then((response) => {
        if (!response.ok) {
            return false;
        }
        return response.json();
      })
    .then((data) => {
        // console.log(data);

        var schedule_grid = document.getElementById("schedule_cards")

        for (day = 1; day <= 5; day++)
        {
            // console.log(data[day])
            // console.log(Object.keys(data[day]).length)
            for (lesson = 1; lesson <= Object.keys(data[day]).length; lesson++)
            {
                // console.log(data[i][lesson])
                var lesson_text = document.createElement("p")
                lesson_text.textContent = `${lesson}. ${data[day][lesson]}`

                document.getElementById(`schedule${day}`).append(lesson_text)
            }
        }
      });   
}

function onClickBarButton(name) {
    
    document.getElementById('schedule_page').style.display = 'none'; 
    document.getElementById('broadcast_page').style.display = 'none'; 
    document.getElementById('dz_page').style.display = 'none'; 

    document.getElementById("dz_button").style.border = "1px solid grey";
    document.getElementById("schedule_button").style.border = "1px solid grey";
    document.getElementById("broadcast_button").style.border = "1px solid grey";

    switch(name)
    {
        case "DZ":
            document.getElementById('dz_page').style.display = 'block'; 
            document.getElementById("dz_button").style.border = "1px solid aqua";
            LoadDZPage()
            break

        case "Schedule":
            console.log("schedule1")
            document.getElementById('schedule_page').style.display = 'block'; 
            document.getElementById("schedule_button").style.border = "1px solid aqua";

            if (document.getElementById(`schedule1`).children.length < 2) {
                loadSchedule()
            }
            break

        case "Broadcast":
            console.log("broadcast1")
            document.getElementById('broadcast_page').style.display = 'block'; 
            document.getElementById("broadcast_button").style.border = "1px solid aqua";
            LoadBroadcastPage()
            break
    }
}

function loadDZDate() {
    console.log("loadDzDate")
}

function LoadDZPage() {
    var this_page = document.getElementById('dz_page')

    let date = document.getElementById("select_date")

    date.addEventListener("change", function(event) {console.log(date.value)});

    var adminStatus = fetch(`http://127.0.0.1:8000/checkAdmin?token=${getCookie('token')}`, {
        method: "GET",
    })
    .then((response) => {
        if (!response.ok) {
            return false;
        }
        return response.json();
      })
    if (adminStatus)
    {
        if (document.getElementById("dz_cards").children.length == 0)
        {
            let newCard = document.createElement("div")
            newCard.innerHTML = "<div class='addCard'><h3>Добавить дз</h3><img src='cyrcle.png' alt='+'></img></div>" 
            
            document.getElementById("dz_cards").append(newCard)
        }
    }
    else
    {
        if (this_page.children.length == 0)
        {
            console.log("dz")
            let text = document.createElement('h1')
            text.textContent = "Сдесь пока что ничего нету!"
            text.style = "text-align: center; justify-content: center; color: white"
    
            this_page.append(text)
        }
    }
}

function LoadBroadcastPage() {
    document.getElementById('broadcast_page').style.display = 'block'; 
    document.getElementById('dz_page').style.display = 'none'; 
    document.getElementById('schedule_page').style.display = 'none'; 
}

function addTask() {
    var window = document.getElementById("addTask")
    

    console.log(window.children.getElementById("LessonName").value)
    console.log(window.children.getElementById("Task").value)
    console.log(window.children.getElementById("DateTaskGet").value)
    console.log(window.children.getElementById("DateTaskPut").value)
}

function openPopup() {
    // document.getElementById("login_window_text")[0].textContent = "Неверные данные!";
}

let mainHost = "https://freesheld.com"
let adminStatus = false;

function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getYesterdayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate() + 1).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function loseConnetion() {
    console.error("Connection is lose")

    let connectionInterval = 1000; //! In ms
    let connectionLosePopup = document.getElementById("connetion-lose");
    let container = document.getElementById("container");
    
    connectionLosePopup.classList.toggle("show")

    container.style = 'filter: blur(5px);';

    let loseConnetionInterval = setInterval(function() {
        console.debug('Pinging main server...')

        fetch(`${mainHost}/ping`, {method: "GET",})
        .then((response) => {
            if (!response.ok) {
                console.error("Fail conection on the main server");
            }   
            return response.json();
        })
        .then((data) => {
            if (data["ping"]) {
                connectionLosePopup.classList.remove("show")

                console.debug("Successful connection!");

                container.style = "filter: blur(0px)";

                clearTimeout(loseConnetionInterval)
            }
        }); 
    }, connectionInterval);
}

window.onload = function () {
    console.debug('Pinging main server...')
    
    fetch(`${mainHost}/ping`, {
        method: "GET",
    })
    .then((response) => {
        if (!response.ok) {
            let errorText = document.createElement("h3");
            errorText.textContent = "Сервер не ответил. \n Проверте свой интернет";
            
            console.error("Fail conection on the main server");

            document.getElementById("loading-window").append(error_text);
        }
        else {
            return response.json();
        }
    })
    .then((data) => {
        if (data["ping"]) {
            setTimeout(() => {
                document.getElementById("loading-window").style = "display: none;";

                console.debug("Successful connection!");

                loadLoginWindow();
            }, 1000)
        }
    }); 

    addEvents();
}

function addEvents() {
    let dp_select_date = document.getElementById("dp-select-date")
    let dp_select_date_two = document.getElementById("dp-select-date-two")


    dp_select_date.value = getYesterdayDate()
    dp_select_date_two.value = getYesterdayDate()

    dp_select_date.addEventListener("change", () => {loadDZPage()});
    dp_select_date_two.addEventListener("change", () => {loadDZPage()});
    
    document.getElementById("dp-mode-select").addEventListener("change", () => {loadDZPage()})

    document.getElementById('dp-range-select').addEventListener("change", () => {
    if (document.getElementById('dp-range-select').value == "range") 
        document.getElementById('dp-select-date-two').style = 'display: vis'
    else 
        document.getElementById('dp-select-date-two').style = 'display: none'

    loadDZPage()
    })

    document.getElementById('cnf-yes').addEventListener("click", () => {
        deleteTask(document.getElementById("cnf-delete-index").textContent);
        document.getElementById('confirm-window').classList.remove("show");
    })
    document.getElementById('cnf-no').addEventListener("click", () => {
        document.getElementById('confirm-window').classList.remove("show");
    })
}

function loadLoginWindow() {
    console.debug("Loading login window");

    let loginWindow = document.getElementById("login-window");
    
    loginWindow.classList.toggle("show");

    document.getElementById("login-window").querySelectorAll("input").forEach(element => {
        element.addEventListener("focusout", checkCorrectDataLogin)
    })

    
    if (getCookie('token') != undefined) {
        fetch(`${mainHost}/checkToken?token=${getCookie('token')}`, {method: "GET",})
        .then((response) => {
            if (!response.ok) {
                loseConnetion()
            }

            return response.json();
        })
        .then((data) => {
            if (data["Successfully"]) {
                console.debug("Token is verified")

                loginWindow.classList.remove("show") 

                loadMainWindow();
            }
        })
    }
}

function checkCorrectDataLogin() {
    document.getElementById("login-window").querySelectorAll("input").forEach(element => {
        if (element.value == "") {
            element.style = "border-color: red;"
        }
        else {
            element.style = "border-color: white;"
        }
    });  
}

function onClickLoginButton() {
    let in_login = (document.getElementById("lw-login-input").value).replace(" ", "")
    let in_password = (document.getElementById("lw-password-input").value).replace(" ", "")

    console.debug(`Input login: ${in_login} \nInput password: ${in_password}`)

    fetch(`${mainHost}/login?login=${in_login}&password=${in_password}`, {
        method: "GET",
    })
    .then((response) => {
        if (!response.ok) {
            loseConnetion();
        }
        return response.json();
      })
    .then((data) => {  
        if (data["Successfully"] == true) { 
            document.getElementById("login-window").classList.remove("show") 

            document.cookie = `token=${data['Token']}`

            loadMainWindow()
        }
        else
        {
          console.warn("Data not verified");

          document.getElementById('lw-error-text').textContent = "Неверные данные"; 
        }
      }); 
}

function loadMainWindow() {
    console.debug("Load MainWindow");

    fetch(`${mainHost}/checkAdmin?token=${getCookie('token')}`, {
        method: "GET",
    })

    .then((response) => {
        if (!response.ok) {
            loseConnetion();
            return;
        }
        return response.json();
    })
    .then((data) => {
        adminStatus = data["Successfully"]

        if (adminStatus) {
            document.getElementById("console-button").style = "background-image: url('console.png'); display: unset;"
            console.debug("root role activated!")
        } 
    })

    document.getElementById('container').classList.toggle("show");

    //Load default

    loadSchedulePage();
}

function hideAllPages() {
    document.getElementById('dz-page').classList.remove("show");
    document.getElementById('schedule-page').classList.remove("show"); 
    document.getElementById('textbooks-page').classList.remove("show"); 
    document.getElementById('estimation-page').classList.remove("show");
    document.getElementById('console-page').classList.remove("show");

    document.getElementById("dz-button").classList.remove("select");
    document.getElementById("schedule-button").classList.remove("select");
    document.getElementById("textbooks-button").classList.remove("select");
    document.getElementById("estimation-button").classList.remove("select");
    document.getElementById("console-button").classList.remove("select");

    console.debug("hideAllPages")
}

//*Func of the load pages
function loadDZPage() {
    hideAllPages();

    console.debug("load dz-page");

    let dz_cards = document.getElementById("dz-cards")

    document.getElementById("dz-page").classList.toggle("show")
    document.getElementById("dz-button").classList.toggle("select");

    dz_cards.querySelectorAll("div").forEach(child => {child.remove()});
    dz_cards.querySelectorAll("h1").forEach(child => {child.remove()});

    if (adminStatus) {
        let addCard = document.createElement("div")
        addCard.className = 'addCard'
        addCard.id = 'addCard'
        addCard.innerHTML = "<h3>Добавить дз</h3><img src='cyrcle.png' alt='+'></img>" 
        
        addCard.addEventListener("click", () => {document.getElementById("dp-add-task").classList.toggle("show"); document.getElementById("container").classList.remove("show");});
        
        dz_cards.append(addCard)

        console.debug("show add card")
    }

    //!Load dz cards

    var url
    
    dp_select_date = document.getElementById("dp-select-date").value;
    dp_select_date_two = document.getElementById("dp-select-date-two").value;

    if (document.getElementById('dp-range-select').value == "range") 
        url = `${mainHost}/homeworks/range_date?token=${getCookie('token')}&one_date=${dp_select_date}&two_date=${dp_select_date_two}`;
    else {
        if (document.getElementById("dp-mode-select").value == "due_date")
            url = `${mainHost}/homeworks/due_date/${dp_select_date}?token=${getCookie('token')}`;
        else
            url = `${mainHost}/homeworks/task_date/${dp_select_date}?token=${getCookie('token')}`;
    }
    

    fetch(url, {method: "GET",})
    .then((response) => {
        if (!response.ok) {
            loseConnetion();
            return;
        }
        return response.json();
      })

      .then((data) => {
        if (data['found']) {
          for(var index in data['data']) {
              var task = data['data'][index];

              let newCard = document.createElement("div");

              if (adminStatus) {
                newCard.innerHTML = `<div class='dzCard' id='dz_card'>
                <h3>${task["lesson_name"]}</h3>
                <h6>${task["task"]}</h6>
                <h6>Задали: ${task["due_date"]}</h6>
                <h6>Сделать к: ${task["task_date"]}</h6>
                <button class="delete"><img src="deletelogo.png" onClick="confirm(${task["id"]})"></img></button>
                </div>`;
              }
              else {
                newCard.innerHTML = `<div class='dzCard' id='dz_card'>
                <h3>${task["lesson_name"]}</h3>
                <h6>${task["task"]}</h6>
                <h6>Задали: ${task["task_date"]}</h6>
                <h6>Сделать к: ${task["due_date"]}</h6>
                </div>`;
              }
          
              document.getElementById("dz-cards").append(newCard);

              console.debug("add dz card")
          }
        }
        else {
            let text = document.createElement('h1');
            text.textContent = "Сдесь пока что ничего нету!";
        
            document.getElementById("dz-cards").append(text);

            console.debug("Homework not found!")
        }
      });
}

function addHomework() {
    const Task = document.getElementById("dp-add-homework");
    let DateTaskGet = document.getElementById("dp-add-date-get");
    let DateTaskPut = document.getElementById("dp-add-date-put");

    console.debug(`
        task-name: ${document.getElementById("dp-add-lesson-name").value}
        task: ${Task.value}
        date-get: ${DateTaskPut.value} 
        date-put: ${DateTaskGet.value} 
        `)

    if (Task.value == "") {
        DateTaskPut.style = "border: 1px solid red";
        closeDpAddTaskWindow();
        return;
    }
    else 
        Task.style = "border: 1px solid white; height: 250px;";

    if (DateTaskGet.value == "") {
        DateTaskPut.style = "border: 1px solid red";
        closeDpAddTaskWindow();
        return;
    }
    else 
        DateTaskGet.style = "border: 1px solid white";

    if (DateTaskPut.value == "") {
        DateTaskPut.style = "border: 1px solid red";
        closeDpAddTaskWindow();
        return;
    }
    else 
        DateTaskPut.style = "border: 1px solid white";

    const data = {
        "lesson_name": document.getElementById("dp-add-lesson-name").value,
        "task": Task.value,
        "task_date": DateTaskPut.value,
        "due_date": DateTaskGet.value
    };

    fetch(`https://freesheld.com/homeworks/?token=${getCookie('token')}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (!response.ok) {
            loseConnetion();
            return;
        }
        return response.json();
      })
    .then((data) => {
        loadDZPage()
        closeDpAddTaskWindow();
    });
    
}

function closeDpAddTaskWindow() {  
    let addTaskWindow = document.getElementById("dp-add-task");

    addTaskWindow.querySelectorAll("input").forEach(element => {element.value = ""});  

    document.getElementById("dp-add-lesson-name").value = "Русский язык"
    document.getElementById("dp-add-homework").value = ""
    
    addTaskWindow.classList.remove("show")
    document.getElementById("container").classList.toggle("show");
}

function confirm(index) {
    document.getElementById('confirm-window').classList.toggle("show"); 

    document.getElementById("cnf-delete-index").textContent = index;

    document.getElementById('confirm-window').querySelector("h3").value = `Вы уверенны что хотите удалить дз №${index}`
}

function deleteTask(id) {
    fetch(`https://freesheld.com/homeworks?homework_id=${id}&token=${getCookie('token')}`, {
        method: "DELETE",
    })

    .then((response) => {
        if (!response.ok) {
            return false;
        }
        return response.json();
    })
    .then((data) => {
        loadDZPage()
    })
}

function loadSchedulePage() {

    hideAllPages()

    document.getElementById("schedule-page").classList.toggle("show");
    document.getElementById("schedule-button").classList.toggle("select");

    console.debug("schedule load");

    if (document.getElementById("schedule-cards").childElementCount > 0) {
        console.debug("schedule is loading")

        return;
    }

    fetch(`${mainHost}/schedule?token=${getCookie('token')}`, {
        method: "GET",
    })
    .then((response) => {
        if (!response.ok) {
            loseConnetion();
        }
        
        return response.json();
    })
    .then((data) => {
        let scheduleCards = document.getElementById("schedule-cards")

        for (const day in data) {
            let dayCard = document.createElement("div");
            dayCard.className = "card";

            dayCard.innerHTML = `<h3>${day}</h3>`;

            for(let lesson in data[day]) {
                var lesson_text = document.createElement("p");

                lesson_text.textContent = `${lesson}. ${data[day][lesson]}`;

                dayCard.append(lesson_text);
            }

            scheduleCards.append(dayCard);
        }
    })
}

function loadTextBooksPage() {
    hideAllPages()

    document.getElementById("textbooks-page").classList.toggle("show")
    document.getElementById("textbooks-button").classList.toggle("select")
}

function loadConsolePage() {
    hideAllPages()

    document.getElementById("console-page").classList.toggle("show")
    document.getElementById("console-button").classList.toggle("select")

    fetch(`${mainHost}/console?token=${getCookie('token')}`, {
        method: "GET",
    })

    .then((response) => {
        if (!response.ok) {
            loseConnetion();
            return;
        }
        return response.json();
    })
    .then((data) => {
        if(document.getElementById("classbook-table").children.length <= 1) {
            const length = data.names.length;
            
            for (let i = 0; i < length; i++) {
                let newRow = document.createElement("tr");
                newRow.innerHTML = `<td>${data['names'][i]}</td><td><input type="checkbox"></td>`;
                
                document.getElementById('classbook-table').append(newRow);
            }
        }

        if(document.getElementById("averange-table").children.length <= 1) {
            const length = ((data.averange.length) - 1);
            console.debug(length)
            
            for (let i = 0; i < length; i++) {
                let newRow = document.createElement("tr");
                console.debug(data['averange'][i])
                newRow.innerHTML = `<tr><td>${data['averange'][i]['name']}</td><td>${data['averange'][i]['averange']}</td></tr>`;
                
                document.getElementById('averange-table').append(newRow);
            }
        }
    });
}

function loadEstimationPage() {
    hideAllPages()

    document.getElementById("estimation-page").classList.toggle("show")
    document.getElementById("estimation-button").classList.toggle("select")

    fetch(`${mainHost}/estimation?token=${getCookie('token')}`, {
        method: "GET",
    })

    .then((response) => {
        if (!response.ok) {
            loseConnetion();
            return;
        }
        return response.json();
    })
    .then((data) => {
        if(document.getElementById("est-table").children.length <= 1) {
            const length = data.lesson.length;
            
            for (let i = 0; i < length; i++) {
                const lesson = data.lesson[i];
                const estimations = data.estimation[i];
                const overage = data.average[i];
                const fourth = data.fourth[i];
                const omissions = data.omissions[i];
                
                let newRow = document.createElement("tr");
                newRow.innerHTML = `<td>${lesson}</td><td>${estimations}</td><td>${overage}</td><td>${fourth}</td><td>${omissions}</td>`;
                
                document.getElementById('est-table').append(newRow);
            }
        }
    });

    fetch(`${mainHost}/profile?token=${getCookie('token')}`, {
        method: "GET",
    })

    .then((response) => {
        if (!response.ok) {
            loseConnetion();
            return;
        }
        return response.json();
    })
    .then((data) => {
        console.debug(data['name'])
        document.getElementById("pr-name-text").textContent = `${data['name']}`
        document.getElementById("pr-ls-name-text").textContent = `${data['last_name']}`
        document.getElementById("pr-class").textContent = `${data['class']} класс`
    })
}
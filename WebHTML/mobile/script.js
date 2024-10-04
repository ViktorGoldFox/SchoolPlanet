function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
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
          fetch(`https://freesheld.com/checkToken?token=${getCookie('token')}`, {
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
  
      console.log("lestener add")
  
      const Task = document.getElementById("Task")
      const DateTaskGet = document.getElementById("DateTaskGet")
      const DateTaskPut = document.getElementById("DateTaskPut")
  
      Task.addEventListener('blur', () => {
          if (Task.value == "") { 
          Task.style = "border: 1px solid red; height: 250px;"
      } else {Task.style = "border: 1px solid white; height: 250px;"}
      });
  
      DateTaskGet.addEventListener('blur', () => {
          if (DateTaskGet.value == "") { 
          DateTaskGet.style = "border: 1px solid red"
      } else {DateTaskGet.style = "border: 1px solid white"}
      });
  
      DateTaskPut.addEventListener('blur', () => {
          if (DateTaskPut.value == "") { 
          DateTaskPut.style = "border: 1px solid red"
      } else {DateTaskPut.style = "border: 1px solid white"}
      });
  
      loadSchedule()
  
      let date = document.getElementById("select_date")
      date.addEventListener("change", function(event) {LoadDZPage()});
      document.getElementById('RangeSoloSelect').addEventListener("change", () => {
      if (document.getElementById('RangeSoloSelect').value == "Range")
      {
          document.getElementById('select_date_two').style = 'display: vis'
          document.getElementById('LessonNameSelect').style = 'display: vis'
      }
      else
      {
          document.getElementById('select_date_two').style = 'display: none'
          document.getElementById('LessonNameSelect').style = 'display: none'
      }
      LoadDZPage()
      })
      document.getElementById("TaskDateOrDueDate").addEventListener("change", () => {
          LoadDZPage()
      })
      document.getElementById("select_date_two").addEventListener("change", () => {
          LoadDZPage()
      })
  
      document.getElementById('Yes').addEventListener("click", () => {
          DeleteTask(document.getElementById("DeleteIndex").textContent)
          document.getElementById('Append_window').style.display = 'none'})
  }
  
  
  function onClickLoginButton() {
      fetch(`https://freesheld.com/login?login=${document.getElementById("login_input").value}&password=${document.getElementById("password_input").value}`, {
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
      
              loginWindow.style = "display: none"
  
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
      fetch(`https://freesheld.com/schedule`, {
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
      // document.getElementById("broadcast_button").style.border = "1px solid grey";
  
      switch(name)
      {
          case "DZ":
              document.getElementById('dz_page').style.display = 'block'; 
              document.getElementById("dz_button").style.border = "1px solid aqua";
              document.getElementById("select_date").value = getTodayDate()
              document.getElementById("select_date_two").value = getTodayDate()
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
  
  function Append(index) {
      document.getElementById('Append_window').style.display = 'block'; 
  
      document.getElementById("DeleteIndex").textContent = index;
  
      document.getElementById('Append_window').querySelector("h3").value = `Вы уверенны что хотите удалить дз №${index}`
  }
  
  function DeleteTask(index) {
      fetch(`https://freesheld.com/homeworks/${index}`, {
          method: "DELETE",
      })
  
      .then((response) => {
          if (!response.ok) {
              return false;
          }
          return response.json();
      })
      .then((data) => {
          console.log(data)
          LoadDZPage()
      })
  
  }
  
  function LoadDZPage() {
      var this_page = document.getElementById('dz_page')
  
      const elements = document.getElementById("dz_cards").querySelectorAll("div")
      elements.forEach(child => {
          console.log(child)
          child.remove()
      })
  
      const elements1 = document.getElementById("dz_cards").querySelectorAll("h1")
      elements1.forEach(child => {
          console.log(child)
          child.remove()
      })
  
      var adminStatus = true
  
      fetch(`https://freesheld.com/checkAdmin?token=${getCookie('token')}`, {
          method: "GET",
      })
  
      .then((response) => {
          if (!response.ok) {
              return false;
          }
          return response.json();
      })
      .then((data) => {
          if (data["Successfully"])
          {
              let newCard = document.createElement("div")
              newCard.innerHTML = "<div class='addCard' id='addCard'><h3>Добавить дз</h3><img src='cyrcle.png' alt='+'></img></div>" 
          
              document.getElementById("dz_cards").append(newCard)
  
              document.getElementById("addCard").addEventListener("click", function(event) {
              document.getElementById("addTask").style = "display: block"
              })
          }
          adminStatus = data["Successfully"]
      })
      
      var url
  
      if (document.getElementById('RangeSoloSelect').value == "Range") {
          url = `https://freesheld.com/homeworks/range_date?one_date=${document.getElementById("select_date").value}&two_date=${document.getElementById("select_date_two").value}`
      } 
      else {
          if (document.getElementById("TaskDateOrDueDate").value == "due_date")
          {
              url = `https://freesheld.com/homeworks/due_date/${document.getElementById("select_date").value}`
          }
          else
          {
              url = `https://freesheld.com/homeworks/task_date/${document.getElementById("select_date").value}`
          }
  }
  
  
      fetch(url, {
          method: "GET",
          })
      .then((response) => {
          if (!response.ok) {
              let text = document.createElement('h1')
              text.textContent = "Сдесь пока что ничего нету!"
              text.style = "text-align: center; justify-content: center; color: white"
          
              document.getElementById("dz_cards").append(text) 
          }
          return response.json()
        })
  
        .then((data) => {
  
          console.log(Object.keys(data).length)
      if (data['detail'] != "No homework found for the given date")
        {
            for(var index in data)
            {
                var task = data[index]
                console.log(task)
                let newCard = document.createElement("div")
                if (adminStatus)   
                {
                  newCard.innerHTML = `<div class='dzCard' id='dz_card'>
                      <h3>${task["lesson_name"]}</h3>
                      <h6>${task["task"]}</h6>
                      <h6>Задали: ${task["task_date"]}</h6>
                      <h6>Сделать к: ${task["due_date"]}</h6>
                      <button class="delete"><img src="deletelogo.png" onClick="Append(${task["id"]})"></img>></button>
                  </div>`
                }
                else
                {
                  newCard.innerHTML = `<div class='dzCard' id='dz_card'>
                                <h3>${task["lesson_name"]}</h3>
                                <h6>${task["task"]}</h6>
                                <h6>Задали: ${task["task_date"]}</h6>
                                <h6>Сделать к: ${task["due_date"]}</h6>
                            </div>`
                }
            
                document.getElementById("dz_cards").append(newCard)
            }
          }
        })
      }
  
  function LoadBroadcastPage() {
      document.getElementById('broadcast_page').style.display = 'block'; 
      document.getElementById('dz_page').style.display = 'none'; 
      document.getElementById('schedule_page').style.display = 'none'; 
  }
  
  // document.getElementById("addTask").onload = function() {
      
  // }
  
  function CheckTask() {    
      const Task = document.getElementById("Task")
      const DateTaskGet = document.getElementById("DateTaskGet")
      const DateTaskPut = document.getElementById("DateTaskPut")
  
      console.log(DateTaskGet.value)
      if (Task.value == "") { 
          Task.style = "border: 1px solid red; height: 250px;"
      } else {Task.style = "border: 1px solid white; height: 250px;"}
  
      if (DateTaskGet.value == "") { 
          DateTaskGet.style = "border: 1px solid red"
      } else {DateTaskGet.style = "border: 1px solid white"}
  
      if (DateTaskPut.value == "") { 
          DateTaskPut.style = "border: 1px solid red"
      } else {DateTaskPut.style = "border: 1px solid white"}
  
      if(Task.value != "" & DateTaskGet.value != "" & DateTaskPut.value != "") {
          const data = {
              "lesson_name": document.getElementById("LessonName").value,
              "task": Task.value,
              "task_date": DateTaskGet.value,
              "due_date": DateTaskPut.value
          }
  
          fetch(`https://freesheld.com/homeworks`, {
          method: "POST",
          headers: {
          'Content-Type': 'application/json' // Set the content type to JSON
          },
          body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
          })
      .then((response) => {
          if (!response.ok) {
              return false;
          }
          return response.json();
        })
      .then((data) => {
          LoadDZPage()
          CloseAddTaskMenu()
      })
      }
  }
  
  
  function CloseAddTaskMenu() {  
      const elements = document.getElementById("addTask").querySelectorAll("input")
  
      elements.forEach(element => {
          console.log(element.value)
          element.value = ""
      });  
  
      document.getElementById("LessonName").value = "Russian lang"
      document.getElementById("Task").value = ""
      document.getElementById("addTask").style = "display: none"
  }
  
  function openPopup() {
      // document.getElementById("login_window_text")[0].textContent = "Неверные данные!";
  }
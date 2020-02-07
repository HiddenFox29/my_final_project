document.addEventListener('DOMContentLoaded', function () {
tryLogin();

let chooseQuest = document.getElementById("container-${$(this)}");
let question_list = document.getElementById('question_list');
let question = document.getElementById('question');
let form = document.getElementById('form_for_question');
let answer = document.getElementById('answer');
let form_answer = document.getElementById('form_for_answer');
let divSearch = document.getElementById('div_search');

renderHomePage();
// =========================================================================================
// отображение вопросов на главной странице
function renderHomePage () {

    question_list.style.display = 'block';
    question.style.display = 'none';
    answer.style.display = 'none';
    form_answer.style.display = 'none';
    form.style.display = 'block';
    divSearch.style.display = 'none';
//==========================================================================================
    // запрос к серверу для получения объекта с вопросами которые уже опубликованы
    let req = fetch('http://localhost:1337/question');
    let jsonResponse = '';
    let questionList = document.getElementById('question_list');


    req.then((response) => {
        jsonResponse = response.json();
        jsonResponse.then((data) => {
            console.log(data);

            questionList.innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                // let title_i = data[i].title;
                let description_i = data[i].description;
                let number_i = i + 1;
                let tag_i = data[i].tag;
                let id_i = data[i].id;

                // debugger

                questionList.insertAdjacentHTML('beforeEnd',
                    `<div id="${id_i}" class="card m-5 question-container">
                            <div id="card-body" class="card-body">
                                <h5 id="title_card" class="card-title">${number_i}. ${row.title}.</h5>
                                <a id="link_question" href="#" >
                                    <p class="card-text">${description_i}</p>
                                </a>
                                <span>${tag_i}</span>
                            </div>
                    </div>`);
            }
            updateOnClick();
        });
    });

}

//========================================================================================
// добовление вопросов
document.getElementById('btn_form').onclick =  function(event){
    event.preventDefault();

    let createTitle = document.getElementById('title_input').value;
    let createDescription = document.getElementById('desc_input').value;
    let createTag = document.getElementById('tag_input').value;
//========================================================================================
    // запрос к серверу для получения объекта с вопросами и добавления новых в объект

        fetch('http://localhost:1337/question', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            title: createTitle,
            description: createDescription,
            tag: createTag,

        })

    }).then(res => {
        res.json().then(data => console.log(data));
        renderHomePage();
        createTitle = '';
        createDescription = '';
        createTag = '';
});
};
// =========================================================================================
// переход по ссылки на вопрос и отображение ответов
const updateOnClick = function() {
    let reiting = 0;
    const elements = document.getElementsByClassName('question-container');
    for (let i in elements) {
        elements[i].onclick = (event) => {
            if(elements[i].onclick){
                reiting += 1
            }
        console.log('reiting:', reiting)
        event.preventDefault();
        // debugger
        const questionId = event.target.parentElement.parentElement.parentElement.id; // получаем id вопроса
// ============================================================================================
        // манипуляция с контейнерами div html для создания илюзии перехода к другим страницам
        question_list.style.display = 'none';
        question.style.display = 'block';
        answer.style.display = 'block';
        form_answer.style.display = 'block';
        form.style.display = 'none';
        divSearch.style.display = 'none';
// ============================================================================================
        console.log(chooseQuest)
// ============================================================================================
        // запрос к серверу для получения объекта с вопросами,
        // отрисовка выбранного вопроса и всех принадлежащих ответов этому вопросу

        let request = fetch('http://localhost:1337/question/' + questionId);
        let jsonResponse = '';

        answer.innerHTML = "";
        request.then((response) => {
            jsonResponse = response.json();
            jsonResponse.then((data_question) => {
                // console.log('this is', data_question);
//=============================================================================================
                // отображение выбраного вопроса
                question.innerHTML = `<div id="${data_question.id}" class="card m-5 question-container">
                                        <div id="card-body" class="card-body">
                                            <h5 id="title_card" class="card-title">${questionId}. ${data_question.title}.</h5>
                                            <a id="link_question" href="#" >
                                                <p class="card-text">${data_question.description}</p>
                                            </a>

                                            <span>Tag# ${data_question.tag}</span><br>
                                            <button id = "ch" class = "btn btn_dialog_close" >Change</button>
                                        </div>
                                    </div>`
// ============================================================================================
                        changeQuestion(data_question)
//=============================================================================================
                // отрисовка всех пренадлежащих ответов
                for (let i = 0; i < data_question.answers.length; i++) {
                    let number_i = i + 1;
                    let text = data_question.answers[i].text;

                    answer.insertAdjacentHTML('beforeEnd',
                        `<div id="contaner" class="card m-5">
                                <div id="card-body" class="card-body">
                                    <h5 id="title_card" class="card-title">Answer № ${number_i}.</h5>
                                    <p class="card-text">${text}</p>
                                </div>
                        </div>`);
                    }

            });
        });
// ===========================================================================================

        // форма отправки ответов на сервер
        document.getElementById('btn_form_answer').onclick = (event) => {
            event.preventDefault();

            let createAnswer = document.getElementById('answer_input').value;

            fetch('http://localhost:1337/answer', {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    text: createAnswer,
                    question: questionId,

                }),

            }).then(res => {

                res.json().then(data => console.log(data));

                updateOnClick();
                createAnswer = '';

            });
        };

        }
    }
}
// ===============================================================================================
// форма регистрации

document.getElementById('reg').onclick = (event) => {
    event.preventDefault();
//===============================================================================================
    // модальное окно формы регистрации
    let dialog = document.getElementById('dialog_reg');
    dialog.showModal();
    document.getElementById('close_reg').onclick = function () {
        dialog.close();
    };
//===============================================================================================
    // отправка данных введенных юзером для регистрации на сервер
    document.getElementById('btn_form_register').onclick = async () => {
        // debugger
        let user = document.getElementById('email_input').value;
        let psw = document.getElementById('password').value;
        let psw_again = document.getElementById('password_again').value;
        if (psw !== psw_again) {
            alert('Ваши пароли не совподают')
            return;
        }
// ===============================================================================================

        try{
            await request("http://localhost:1337/user", "POST", {
                            username: user,
                            password: psw
                        });
            await request("http://localhost:1337/user/login", "POST", {
                            username: user,
                            password: psw
                        });
                dialog.close();
                changeLogoIn();
                alert('Добро пожаловать ' + user);

        } catch(err){
            alert('Что-то пошло не так');
            console.error(err.message);
            return;
        };

    }
}

// ===============================================================================================
// вход в систему для зарегистрированных пользователей
document.getElementById('log_in').onclick = (event) => {
//===============================================================================================
    // модальное окно для входа в систему
    event.preventDefault();
    let dialog = document.getElementById('dialog_login');
    dialog.showModal();
    document.getElementById('close').onclick = function () {
        dialog.close();
    };
// ===============================================================================================
    document.getElementById('btn_form_login').onclick = async () => {
        let user = document.getElementById('login_email').value;
        let psw = document.getElementById('login_psw').value;
        try{
            await request("http://localhost:1337/user/login", "POST", {
                username: user,
                password: psw,

            });
                user.innerHTML = '';
                psw.innerHTML = '';
                dialog.close();
                changeLogoIn();

                alert('Добро пожаловать ' + user)
        }catch(err){
            alert('Неверное имя пользователя или пароль')
            console.error(err.message)

        };

    }

}
//===============================================================================================
// выход пользователя из своего акаунта
document.getElementById('log_out').onclick = async () => {
    changeLogoOut();
    alert('До новых встречь');
    renderHomePage();
    await request("http://localhost:1337/user/logout", "POST",{});

}


// ===============================================================================================
// при нажатии на логотип переход на главную страницу
document.getElementById('nav_vault').onclick = () => {
    renderHomePage();
    console.log(window.history);
}

function changeLogoIn () {
    document.getElementById('log_out').hidden = false;
    document.getElementById('user_icon').hidden = false;
    document.getElementById('log_in').hidden = true;
    document.getElementById('reg').hidden = true;
}
function changeLogoOut() {
    document.getElementById('log_out').hidden = true;
    document.getElementById('user_icon').hidden = true;
    document.getElementById('log_in').hidden = false;
    document.getElementById('reg').hidden = false;
}
//===============================================================================================
// функция запроса к серверу
async function request(path = "", method = "GET", data = {

    }) {
    let options = {
        method,
        credentials:"include" // fetch имеет особый параметр для обектов , для отсылки ключа
    };

    if (method === "POST") options.body = JSON.stringify(data);
    if (method === "PUT") options.body = JSON.stringify(data);

    let result = await fetch(path, options);

    return await result.json();
}
// await request(user, "POST", {username: user, password: pass})
// ===============================================================================================
// Функция поиска
document.getElementById('btn_search').onclick = async(event) => {
    event.preventDefault();
    divSearch.innerHTML = ''
    let searchTemp = document.getElementById('inpt_search').value;
    let jsonResponse = '';
    if(searchTemp === ''){
        alert('Заполните поле ввода')
        return
    }
    try{
        jsonResponse = await request('http://localhost:1337/question/search?query=' + searchTemp, 'GET');
        question_list.style.display = 'none';
        question.style.display = 'none';
        answer.style.display = 'none';
        form_answer.style.display = 'none';
        form.style.display = 'none';
        divSearch.style.display = 'block';

        console.log('===', jsonResponse)
        for (let i = 0; i < jsonResponse.length; i++) {
            let description_i = jsonResponse[i].description;
            let title_i = jsonResponse[i].title;
            let tag_i = jsonResponse[i].tag;
            let id_i = jsonResponse[i].id;
            let number_i = i + 1;

            divSearch.insertAdjacentHTML('beforeEnd', `<div id="${id_i}" class="card m-5 question-container">
                                        <div id="card-body" class="card-body">
                                            <h5 id="title_card" class="card-title">${number_i}. ${title_i}.</h5>
                                            <a id="link_question" href="#" >
                                                <p class="card-text">${description_i}</p>
                                            </a>
                                            <span>Tag# ${tag_i}</span>
                                        </div>
                                    </div>`);
        }
        updateOnClick();


    }catch(err){
        console.error('Поиск не найден');
    }

}
// ===============================================================================================
// функция проверки авторизации после перезагрузки
async function tryLogin() {
    try {
        await request('http://localhost:1337/user/me', 'GET');
        changeLogoIn();
    } catch(err){
        console.error(err.message)
    }
};

//=============================================================================================
//редактироание вопросов
async function changeQuestion(dataQuest){
    // проверка наличия прав для изменения вопроса
    let user = await request("http://localhost:1337/user/me", 'GET')
    console.log('This is check', user.id, dataQuest.user.id)
    if (dataQuest.user.id !== user.id) {
        document.getElementById('ch').hidden = true;
        return
    } else{
    document.getElementById('ch').onclick = async(event) => {
        let descript = '';
        let title = '';
        let id = '';
        let textArea = document.getElementById('desc_ch_input');
        let inputTitle = document.getElementById('ch_title');
//================================================================================================
        // модальное окно редактирования вопросов
        event.preventDefault();
        let dialog = document.getElementById('change_question');
        dialog.showModal();

        document.getElementById('close_ch').onclick = function () {
            dialog.close();
        };
//=======================================================================================================
        try {
            descript = dataQuest.description;
            title = dataQuest.title;
            id = dataQuest.id

            console.log('id: ', id)

            inputTitle.innerHTML = title;
            console.log('title: ', title);

            textArea.innerHTML = descript;
            console.log('discript: ',descript);


    // =======================================================================================================
            document.getElementById('btn_form_ch').onclick = async() => {
                let chanDescript = document.getElementById('desc_ch_input').value;
                let chanTitle = document.getElementById('ch_title').value;
                console.log('100', chanDescript)

                    await request('http://localhost:1337/question/'+ id, 'PUT',{
                        title: chanTitle,
                        description: chanDescript,

                    })
                    dialog.close();
                }
            } catch(err){
                console.error(err.message)
            }
        };
    };
    };
//======================================================================================================================

});
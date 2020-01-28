document.addEventListener('DOMContentLoaded', function () {
// localStorage.clear();
let chooseQuest = document.getElementById("container-${$(this)}");
// chooseQuest = document.getElementById('contaner')
let question_list = document.getElementById('question_list');
let question = document.getElementById('question');
let form = document.getElementById('form_for_question');
let answer = document.getElementById('answer');
let form_answer = document.getElementById('form_for_answer');
let form_for_register = document.getElementById('form_for_register');
// console.log(localStorage)
renderHomePage();
// ============================================================================================
// отображение вопросов на главной странице
function renderHomePage () {

    question_list.style.display = 'block';
    question.style.display = 'none';
    answer.style.display = 'none';
    form_answer.style.display = 'none';
    form.style.display = 'block';
    // form_for_register.style.display = 'none';
//==========================================================================================
    // запрос к серверу для получения объекта с вопросами которые уже опубликованы
    let request = fetch('http://localhost:1337/question');
    let jsonResponse = '';
    let questionList = document.getElementById('question_list');


    request.then((response) => {
        jsonResponse = response.json();
        jsonResponse.then((data) => {
            // console.log(data)

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

//===========================================================================================================================
// функция создания html тегов принемает параметры (str(tag, nameClass)) для создания элементов
    // function createTagHtml(tagName, nameClass, html, element = document.body){
    //     let tag = document.createElement(tagName);
    //     tag.className = nameClass;
    //     element.append(tag);
    //     tag.innerHTML += html;
    // };
//============================================================================================================================
// добовление вопросов
document.getElementById('btn_form').onclick =  function(event){
    event.preventDefault();

    let createTitle = document.getElementById('title_input').value;
    let createDescription = document.getElementById('desc_input').value;
    let createTag = document.getElementById('tag_input').value;
//=========================================================================================================================
    // запрос к серверу для получения объекта с вопросами и добавления новых в объект

         fetch('http://localhost:1337/question', {
        method: 'POST',

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
// ================================================================================================================
// переход по ссылки на вопрос и отображение ответов
const updateOnClick = function() {
    const elements = document.getElementsByClassName('question-container');
    for (let i in elements) {
        elements[i].onclick = (event) => {
        event.preventDefault()
        // debugger
        const questionId = event.target.parentElement.parentElement.parentElement.id; // получаем id вопроса
    // ====================================================================================================
        // манипуляция с контейнерами div html для создания илюзии перехода к другим страницам
        question_list.style.display = 'none';
        question.style.display = 'block';
        answer.style.display = 'block';
        form_answer.style.display = 'block';
        form.style.display = 'none';
        // form_for_register.style.display = 'none';
    // ====================================================================================================
        console.log(chooseQuest)
    // ====================================================================================================
        // запрос к серверу для получения объекта с вопросами,
        // отрисовка выбранного вопроса и всех принадлежащих ответов этому вопросу

        let request = fetch('http://localhost:1337/question/' + questionId);
        let jsonResponse = '';

        answer.innerHTML = "";
        request.then((response) => {
            jsonResponse = response.json();
            jsonResponse.then((data_question) => {
                console.log('this is', data_question)
    //=========================================================================================================
                // отображение выбраного вопроса
                question.innerHTML = `<div id="${data_question.id}" class="card m-5 question-container">
                                        <div id="card-body" class="card-body">
                                            <h5 id="title_card" class="card-title">${questionId}. ${data_question.title}.</h5>
                                            <a id="link_question" href="#" >
                                                <p class="card-text">${data_question.description}</p>
                                            </a>
                                            <span>${data_question.tag}</span>
                                        </div>
                                    </div>`
    //============================================================================================================
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
    //======================================================================================================================
        // форма отправки ответов на сервер
        document.getElementById('btn_form_answer').onclick = function (event) {
            event.preventDefault();

            let createAnswer = document.getElementById('answer_input').value;

            fetch('http://localhost:1337/answer', {
                method: 'POST',

                body: JSON.stringify({
                    text: createAnswer,
                    question: questionId
                })

            }).then(res => {
                res.json().then(data => console.log(data));
                updateOnClick();
                createAnswer = '';
            });
        };

        }
    }
}
// =======================================================================================================================
// форма регистрации
document.getElementById('reg').onclick = (event) => {
    event.preventDefault();
//========================================================================================================================
    // модальное окно формы регистрации
    let dialog = document.getElementById('dialog_reg');
    dialog.showModal();
    document.getElementById('close_reg').onclick = function () {
        dialog.close();
    };
//===================================================================================================================
    // отправка данных введенных юзером для регистрации на сервер
    document.getElementById('btn_form_register').onclick = async () => {
        let email = document.getElementById('email_input').value;
        let psw = document.getElementById('password').value;
        let psw_again = document.getElementById('password_again').value;
        if (psw !== psw_again) {
            alert('Ваши пароли не совподают')
            return
        }
// ==================================================================================================================
        // проверка существующего email при регистрации
        try{
        await request("user", "POST",{
                        username: email,
                        password: psw
                    });
                        document.getElementById('email_input').value = '';
                        document.getElementById('password').value = '';
                        document.getElementById('password_again').value = '';
                        dialog.close();
                        changeLogo()
        } catch(err){
            alert('Что-то пошло не так')
            console.error(err.message)
            return
        }



    }
}

// ===================================================================================================================
// вход в систему для зарегистрированных пользователей
document.getElementById('log_in').onclick = (event) => {
//====================================================================================================================
    // модальное окно для входа в систему
    event.preventDefault();
    let dialog = document.getElementById('dialog_login');
    dialog.showModal();
    document.getElementById('close').onclick = function () {
        dialog.close();
    };
// ===================================================================================================================
    document.getElementById('btn_form_login').onclick = async () => {
        let email = document.getElementById('login_email').value;
        let psw = document.getElementById('login_psw').value;
        try{
            await request("user/login", "POST", {
                username: email,
                password: psw
            });
                document.getElementById('login_email').value = '';
                document.getElementById('login_psw').value = '';
                dialog.close();
                changeLogo()
                alert('Добро пожаловать ' + email)
        }catch(err){
            alert('Неверное имя пользователя или пароль')
            console.error(err.message)
        }

        // }
    }
// });

// });
}
// }


// ===================================================================================================================
// при нажатии на логотип переход на главную страницу
document.getElementById('nav_vault').onclick = () => {
    renderHomePage();
    console.log(window.history);
}

function changeLogo () {
    document.getElementById('log_out').hidden = false;
    document.getElementById('user_icon').hidden = false;
    document.getElementById('log_in').hidden = true;
    document.getElementById('reg').hidden = true;
}
// функция запроса к серверу
async function request(path = "", method = "GET", data = {

    }) {
    let options = {
        method
    };

    if (method === 'POST') options.body = JSON.stringify(data);

    let result = await fetch("http://localhost:1337/" + path, options);

    return await result.json();
}


// await request(user, "POST", {username: user, password: pass})
// =====================================================================================================================






































});
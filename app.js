document.addEventListener('DOMContentLoaded', function () {
renderQuestion();

function renderQuestion () {

    let request = fetch('http://localhost:1337/question');
    let jsonResponse = '';
    let questionList = document.getElementById('question_list');
    request.then(function (response) {
        jsonResponse = response.json();
        jsonResponse.then(function (data) {
            console.log(data)

            questionList.innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                let title_i = JSON.stringify(data[i].title);
                let description_i = JSON.stringify(data[i].description);
                let number_i = i + 1;
                let tag_i = JSON.stringify(data[i].tag);

                questionList.insertAdjacentHTML('beforeEnd',
                    `<div id="contaner" class="card m-5">
                                <div id="card-body" class="card-body">
                                <h5 id="title_card" class="card-title">${number_i}. ${title_i}.</h5>
                                <a href="#">
                                <p class="card-text">${description_i}</p>
                                </a>
                                <span>${tag_i}</span>
                            </div>
                        </div>`);
            }
        });
    });

}
    // request.then(function (response) {
    //     jsonResponse = response.json();
    //     jsonResponse.then(function (data) {
    //         console.log(data)
    //         for(let i = 0; i < data.length; i++) {
    //             let title_i = JSON.stringify(data[i].title);
    //             let description_i = JSON.stringify(data[i].description);
    //             let number_i = i + 1;
    //             let tag_i = JSON.stringify(data[i].tag);

    //             document.body.insertAdjacentHTML('beforeEnd',
    //                     `<div id="contaner" class="card m-5">
    //                             <div id="card-body" class="card-body">
    //                             <h5 id="title_card" class="card-title">${number_i}. ${title_i}.</h5>
    //                             <a href="#">
    //                             <p class="card-text">${description_i}</p>
    //                             </a>
    //                             <span>${tag_i}</span>
    //                         </div>
    //                     </div>`);
    //         }
    //     });
    // });
//===========================================================================================================================
// функция создания html тегов принемает параметры (str(tag, nameClass)) для создания элементов
    // function createTagHtml(tagName, nameClass, html, element = document.body){
    //     let tag = document.createElement(tagName);
    //     tag.className = nameClass;
    //     element.append(tag);
    //     tag.innerHTML += html;
    // };
//============================================================================================================================
function formCreateNewQuestions() {
    let createTitle = document.getElementById('title_input').value;
    let createDescription = document.getElementById('desc_input').value;
    let createTag = document.getElementById('tag_input').value;
}

document.getElementById('btn_form').onclick =  function(event){
    event.preventDefault();

    let createTitle = document.getElementById('title_input').value;
    let createDescription = document.getElementById('desc_input').value;
    let createTag = document.getElementById('tag_input').value;

    fetch('http://localhost:1337/question', {
    method: 'POST',

    body: JSON.stringify({
        title: createTitle,
        description: createDescription,
        tag: createTag,
    })
}).then(res => {
    res.json().then(data => console.log(data));
    renderQuestion();
    createTitle = '';
    createDescription = '';
    createTag = '';
});
};








































});
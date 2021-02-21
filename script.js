function createInput(type, name, className){
    let input = document.createElement("input");
    input.type = type;
    type === "button" ? input.value = name: input.placeholder = name;
    input.className = className;
    return input;
}


function createWrapper(className, ...elems){
    let div = document.createElement("div");
    div.className = className;
    if(elems) elems.forEach(elem => div.append(elem));
    return div;
}


window.onload = function(){
    let search = createInput("search", "Search", "search");
    search.addEventListener("keydown", (e)=> {
       if(e.code === "Enter") performSearch(e); 
    });
    let icon = document.createElement("i");
    icon.className = "fas fa-search";
    icon.addEventListener("click", performSearch);
    let search__wrapper = createWrapper("search__wrapper", search);
    search__wrapper.append(icon);


    let add__task = createInput("button", "Add new task", "add__task");
    let add__task__wrapper = createWrapper("add__task__wrapper", add__task);
    add__task__wrapper.addEventListener("click", addTask);
    let list__wrapper = createWrapper("list__wrapper");
    let container = createWrapper("container");
    container.append(search__wrapper, add__task__wrapper, list__wrapper);
    document.body.append(container);
}


function performSearch(e) {
    let input = e.target.closest(".search__wrapper").querySelector('input');
    if(!input || !input.value.length) return;
    let contentsArr = [...document.body.querySelectorAll(".content")];
    if(!contentsArr.length) return;
    let target = input.value;
    contentsArr = clearMarks(contentsArr);
    let filtered = markSearchResult(contentsArr, target);
    handleSearchRes(filtered, input);
    input.addEventListener("mousedown", clearSearchField);
}

function clearMarks(arr) {
    arr.forEach(elem => {
        let str = elem.innerHTML.replaceAll("<mark>", "").replaceAll("</mark>", "");
        elem.innerHTML = str;
   });
    return arr;
}

function markSearchResult(arr, target) {
    let filtered = []
    arr.forEach(elem => {
        let str = elem.innerHTML;
        if(str.includes(target)){   
            let markedStr = str.replaceAll(`${target}`, `<mark>${target}</mark>`);
            elem.innerHTML = markedStr;
            clone = elem.cloneNode(true);
            clone.addEventListener("click", ()=>elem.scrollIntoView(true));
            filtered.push(clone);
        }
    });
    return filtered;
}

function handleSearchRes(arr, input) {
    if(!arr.length) {
        let message__box = addMessage(input);
        document.querySelector(".search__wrapper").append(message__box);
    }else {
        let searchResultBox = document.createElement("div");
        searchResultBox.className = "searchResultBox";
        arr.forEach(elem => searchResultBox.append(elem));
        document.querySelector(".search__wrapper").append(searchResultBox);
    }
}

function addMessage(input){
    let p = document.createElement("p");
    p.innerHTML = "No match. Would you like to add a new list?";
    let span = createSpan("+")
    span.className = "message__add__span";
    span.addEventListener("click", ()=> createListItem(input));

    let message__wrapper = createWrapper("message__wrapper", p, span);
    return message__wrapper;
}

function clearSearchField(){
    if(document.querySelector(".message__wrapper")){
      document.querySelector(".message__wrapper").remove();
    }
    if(document.querySelector(".searchResultBox")){
      document.querySelector(".searchResultBox").remove();
    }
  
}


function addTask(e){
    let add__task__wrapper = e.target.closest(".add__task__wrapper");
    if(add__task__wrapper.querySelector("input[type = textarea]")){
        handleNewInput(add__task__wrapper.querySelector("input[type = textarea]"));
    }else{
        let add__task__input = createInput('textarea', "Textarea","textarea");
        add__task__wrapper.append(add__task__input);
        add__task__input.focus();
    }
}


function handleNewInput(input){
    if(!input.value.length){
        input.remove();
        return;
    }
    createListItem(input);
    input.remove();
}


function createListItem(input){
    let content = convertToDiv(input);
    let index = assignIndex();
    let editBtn = createSpan("Edit");
    let removeBtn = createSpan("X")
    let span__wrapper = createWrapper('span__wrapper', editBtn, removeBtn);
    span__wrapper.addEventListener("click", handleChange);
    let list__items__wrapper = createWrapper("list__items__wrapper", index, content, span__wrapper);
    let list__wrapper = document.body.querySelector(".list__wrapper")
    list__wrapper.append(list__items__wrapper);
}

function handleChange(e){
    let target = e.target;
    if(target.tagName !== "SPAN") return;
    target.innerHTML === "Edit"? convertToTextarea (e) : removeList (e);
}


function convertToDiv(textarea){
    let content = createWrapper("content");
    content.innerHTML = textarea.value;
    return content;
}

function createSpan(str){
    let span = document.createElement("span");
    span.innerHTML = str;
    return span;
}

function assignIndex(){
    let list__wrapper = document.body.querySelector(".list__wrapper");
    let index = document.createElement("p");
    index.innerHTML = list__wrapper.children.length + 1;
    return index;
}

function updateIndex(){
    let childDivs = document.body.querySelectorAll(".list__items__wrapper");
    childDivs.forEach(function(div,index){
        let num = div.querySelector("p");
        num.innerHTML = index + 1;
    });
}

function convertToTextarea(e){
    let textarea = document.createElement("textarea");
    let div = e.target.closest(".list__items__wrapper").querySelector(".content");
    if(!div) return;
    textarea.value = div.innerHTML;
    textarea.addEventListener("mousedown", ()=> removeErrorMessage(textarea));
    let saveBtn = createSaveBtn(textarea);
    let textarea__wrapper = createWrapper("textarea__wrapper", textarea, saveBtn);
    div.replaceWith(textarea__wrapper);
}

function createSaveBtn(input){
    let saveBtn = createInput("button", "Save", "save__btn");
    saveBtn.addEventListener("click", ()=> updateContent(input));
    return saveBtn;
}

function updateContent(input){
    let content = convertToDiv(input);
    if(input.value.length){
      input.parentNode.replaceWith(content);
    }else{
       appendErrorMessage(input);
    }
}

function appendErrorMessage(input) {
    let p = document.createElement("p");
    p.innerHTML = "*Field can not be empty";
    p.className = "error__msg";
    input.parentNode.append(p);
}

function removeErrorMessage(input) {
    if(input.parentNode.querySelector(".error__msg")){
        input.parentNode.querySelector(".error__msg").remove();
    }
}


function removeList(e){
    let list = e.target.closest(".list__items__wrapper")
    list.remove();
    let list__wrapper = document.body.querySelector(".list__wrapper");
    if(list__wrapper.children.length){
        updateIndex(list__wrapper)
    }
}


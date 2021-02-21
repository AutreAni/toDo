function createDiv(className, ...elems){
    let div = document.createElement("div");
    div.className = className;
    if(elems) elems.forEach(elem => div.append(elem));
    return div;
}


window.onload = function(){
    let search = document.createElement("input");
    search.type = "text";
    search.maxLength = "40";
    search.placeholder = "Search...";
    search.className = "search"
    search.addEventListener("keydown", (e)=> {
       if(e.code === "Enter") performSearch(); 
    });
    let icon = document.createElement("i");
    icon.className = "fas fa-search";
    icon.addEventListener("click", performSearch);
    let search__wrapper = createDiv("search__wrapper", search, icon);


    let add__task = document.createElement("button");
    add__task.innerHTML = "Add New Task";
    add__task.className = "add__task";
    let add__task__wrapper = createDiv("add__task__wrapper", add__task);
    add__task__wrapper.addEventListener("click", addTask);

    let list__wrapper = createDiv("list__wrapper");
    let container = createDiv("container");
    container.append(search__wrapper, add__task__wrapper, list__wrapper);
    document.body.append(container);
}


function performSearch() {
    let input = document.querySelector('.search');
    if(!input || !input.value.length) return;
    let contentsArr = [...document.body.querySelectorAll(".content")];
    if(!contentsArr.length) return;
    let target = input.value;
    contentsArr = clearMarks(contentsArr);
    let filtered = markSearchResult(contentsArr, target);
    handleSearchRes(filtered, input);
    input.onfocus = () => {
        clearSearchField();
    }
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
        let searchResultBox = createDiv("searchResultBox", ...arr)
        if(!document.querySelector(".searchResultBox")){
         document.querySelector(".search__wrapper").append(searchResultBox);
        }
    }
}

function addMessage(input){
    let p = document.createElement("p");
    let str = `No match for <span class = "marked">${input.value}</span>. Would you like to add a new list?`;
    p.innerHTML = str;
    let span = createSpan("+");
    span.className = "message__add__span";
    let message__wrapper = createDiv("message__wrapper", p, span);
    span.addEventListener("click", ()=> {
                                        createListItem(input.value);
                                        input.value = ""
                                        message__wrapper.remove();
                                       let arr = document.querySelectorAll(".content");
                                       arr[arr.length-1].scrollIntoView(true);
                                    });
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


function addTask(){
    let editable = document.querySelector(".editable");
    if(editable){
        handleInput(editable);
    }else{
        createEditableDiv();        
    } 
}

function createEditableDiv(){
    let editable = createDiv("editable");
    editable.contentEditable = "true";  
    document.querySelector(".add__task__wrapper").append(editable);
    editable.focus();
    editable.addEventListener("keydown", (e)=>{
        if(e.code === "Enter"){
            editable.contentEditable = "false";
            createListItem(editable.innerHTML);
            editable.remove();
        }
    });
}


function handleInput(elem){
    if(!elem.innerHTML.length){
        elem.remove();
        return;
    }
    createListItem(elem.innerHTML);
    elem.remove();
}


function createListItem(input){
    if(!input.length) return;
    let content = createDiv("content");
    content.innerHTML = input;
    let index = assignIndex();
    let editBtn = createSpan("Edit");
    let removeBtn = createSpan("x");
    let span__wrapper = createDiv('span__wrapper', editBtn, removeBtn);
    span__wrapper.addEventListener("click", handleChange);
    let list__items__wrapper = createDiv("list__items__wrapper", index, content, span__wrapper);
    let list__wrapper = document.body.querySelector(".list__wrapper")
    list__wrapper.append(list__items__wrapper);
}

function handleChange(e){
    let target = e.target;
    if(target.tagName !== "SPAN") return;
    target.innerHTML === "Edit"? enableChange(e) : removeList(e);
}


function createSpan(str){
    let span = document.createElement("span");
    span.innerHTML = str;
    return span;
}

function assignIndex(){
    let list__wrapper = document.body.querySelector(".list__wrapper");
    let index = document.createElement("p");
    index.innerHTML = list__wrapper.children.length + 1 + ".";
    return index;
}

function updateIndex(){
    let childDivs = document.body.querySelectorAll(".list__items__wrapper");
    childDivs.forEach(function(div,index){
        let num = div.querySelector("p");
        num.innerHTML = index + 1 + ".";
    });
}

function enableChange(e){
    let parent = e.target.closest(".list__items__wrapper");
    let target = parent.querySelector("div");
    if(target.querySelector(".error__msg")){
        target.querySelector(".error__msg").remove();
    }
    target.contentEditable = "true";
    target.focus();
    target.addEventListener("keydown", (e) =>{
        if(e.code === "Enter") disableEdit(target);
    })
}

function disableEdit(elem){
    elem.contentEditable = "false";
    if(!elem.innerHTML.length) {
        let error = createErrorMessage();
        elem.append(error);
        elem.contentEditable = "true";
        elem.addEventListener("focus", ()=> {
            error.remove();
            elem.focus();
        })
    }
}

function createErrorMessage() {
    let p = document.createElement("p");
    p.innerHTML = "*Field can not be empty";
    p.className = "error__msg";
    return p;
}

function removeList(e){
    let list = e.target.closest(".list__items__wrapper")
    list.remove();
    let list__wrapper = document.body.querySelector(".list__wrapper");
    if(list__wrapper.children.length){
        updateIndex(list__wrapper)
    }
}


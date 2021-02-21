function createInput(type, name, className){
    let input = document.createElement("input");
    input.type = type;
    type === "button" ? input.value = name:input.placeholder  = name;
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
    let icon = document.createElement("i");
    icon.className = "fas fa-search";
    icon.addEventListener("click", performSearch)

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
    if(!input) return;
    let contents = document.body.querySelectorAll(".content");
    let clones = [];
    [...contents].forEach((content, index) => content.id = index);
    [...contents].forEach(content => clones.push(content.cloneNode(true)));
    clones.forEach((clone,index) => {
        clone.addEventListener("click", function(){
            document.getElementById(`${index}`).scrollIntoView(true);
            clone.remove();
        })
    })

    let target = input.value;
    let filtered = clones.filter( content => {
        let str =content.innerHTML;
        if(str.includes("<mark>") || str.includes("</mark>")){
            let newStr = str.replaceAll("<mark>", "").replaceAll("</mark>", "")
            str = content.innerHTML = newStr;
        }
       
        if(str.includes(target)){   
            let newStr = str.replaceAll(`${target}`, `<mark>${target}</mark>`);
            content.innerHTML = newStr;
            return content;
        }
            
     });
     console.log(filtered);
     if(!filtered.length) {
       addMessage(input);
     }else{
         filtered.forEach(div => document.querySelector(".search__wrapper").append(div))
     }
     input.addEventListener("mousedown", function(){
         if(document.querySelector(".message__wrapper")){
         document.querySelector(".message__wrapper").remove();
         }
     });
}

function addMessage(input){
    let p = document.createElement("p");
    p.innerHTML = "No match. Would you like to add a new list?";
    let span = document.createElement("span");
    span.innerHTML = "+";
    span.className = "message__add__span";
    let message__wrapper = createWrapper("message__wrapper", p, span);
    document.querySelector(".search__wrapper").append(message__wrapper);
    span.addEventListener("click", ()=> createListItem(input));
}

// function markSearchResult(str, target) {
//     let indexArr = [];
//     let pos = -1;
//     let start = 0;
//     while ((pos = str.indexOf(target, pos + 1)) != -1) {
//       indexArr.push(pos);
//     }
//     if(indexArr){
//         console.log(indexArr);
//         let length = target.length
//         let stringArr = [];
//         indexArr.forEach(index => {
//             let substr = str.slice(start, index);
//             console.log(substr,index, length);
//             let searchRes = str.substr(index, length);
//             console.log(searchRes);
//             let marked = `<mark>${searchRes}</mark>`;
//             console.log(marked);
//             stringArr.push(substr,marked);
//             start = index + length;
//             console.log(stringArr);
//         });
//         if(start < str.length) {
//             stringArr.push(str.slice(start, str.length));
//         }
//         return [...stringArr].join("");
//     }

// }

// function clearSearchResult(str, target){
//     let indexArr = [];
//     let stringArr = [];
//     let pos = -1;
//     let start = 0;
//     while ((pos = str.indexOf(target, pos + 1)) != -1) {
//         indexArr.push(pos);
//     }
//     console.log(indexArr);
//     if(indexArr){ 
//         indexArr.forEach(index => {
//           let subStr = str.slice(start, index);
//           stringArr.push(subStr);
//           start = index + target.length;
//         });
//         if(start < str.length){
//             stringArr.push(str.slice(start, str.length))
//         }
       
//       return [...stringArr].join("");
      
//     }

// }


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
    let editBtn = createEditBtn();
    let removeBtn = createRemoveBtn()
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

function createEditBtn(){
    let edit = document.createElement("span");
    edit.innerHTML = "Edit"
    return edit;
}

function createRemoveBtn(){
    let remove = document.createElement("span");
    remove.innerHTML = "X";
    return remove;
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
    }
}


function removeList(e){
    let list = e.target.closest(".list__items__wrapper")
    let content = list.querySelector('.content');
    if(!content) return; 
    list.remove();
    let list__wrapper = document.body.querySelector(".list__wrapper");
    if(list__wrapper.children.length){
        updateIndex(list__wrapper)
    }
}


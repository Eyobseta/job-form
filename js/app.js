let formSection_one=document.createElement('section');
    formSection_one.setAttribute("class","form-step");
    formSection_one.setAttribute("id","step-1");

//fullname
let fullNameContainer=document.createElement("div");
   fullNameContainer.setAttribute("class","wrapper");
     
let fullName_label=document.createElement('label');
    fullName_label.setAttribute("class","labels");
    fullName_label.setAttribute("for","fullName"); 
    fullName_label.textContent="Full Name (required)";    
let fullName=document.createElement('input');
    fullName.setAttribute("type","text");
    fullName.setAttribute("value","");
    fullName.setAttribute("id","fullName");
    fullName.setAttribute("placeholder","Jhon Doe");

    fullNameContainer.appendChild(fullName_label);
     fullNameContainer.appendChild(fullName);


    //email
let emailContainer=document.createElement("div");
    emailContainer.setAttribute("class","wrapper");   

let email_label=document.createElement('label');
    email_label.setAttribute("class","labels");
    email_label.setAttribute("for","email");   
    email_label.textContent="Gmail (required)";    
let email=document.createElement('input');   
    email.setAttribute("type","mail");
    email.setAttribute("value",""); 
    email.setAttribute("id","email");
    email.setAttribute("placeholder","eyobseta%0@gamil.com");

    emailContainer.appendChild(email_label);
    emailContainer.appendChild(email);


//companney name
let companeyContainer=document.createElement("div");
    companeyContainer.setAttribute("class","wrapper");

let companey_label=document.createElement('label');
    companey_label.setAttribute("class","labels");
    companey_label.setAttribute("for","companey");    
    companey_label.textContent="Companey Name (optional)";   
let companey=document.createElement('input');
    companey.setAttribute("type","text");
    companey.setAttribute("value","");
    companey.setAttribute("id","companey");
    companey.setAttribute("placeholder","Meta");

    companeyContainer.appendChild(companey_label);
    companeyContainer.appendChild(companey);


    //country name
let countryContainer=document.createElement("div");
    countryContainer.setAttribute("class","wrapper");  

let country_label=document.createElement('label');
    country_label.setAttribute("class","labels");
    country_label.setAttribute("for","country"); 
    country_label.textContent="Country Name (optional)"  
let country=document.createElement('input');
    country.setAttribute("type","text");
    country.setAttribute("value","");
    country.setAttribute("id","country");
    country.setAttribute("placeholder","eg:-Canada");

    countryContainer.appendChild(country_label);
    countryContainer.appendChild(country);


//buttom for all section
let buttonContainer=document.createElement("div");
    buttonContainer.setAttribute("class","buttonContainer");

let backBtn=document.createElement('button');
    backBtn.setAttribute("class","back-btn");
    backBtn.textContent="Back";
let nextBtn= document.createElement('button');
    nextBtn.setAttribute("class","next-btn");
    nextBtn.textContent="Next";   

buttonContainer.appendChild(backBtn);
buttonContainer.appendChild(nextBtn);


//append to section
formSection_one.appendChild(fullNameContainer);
formSection_one.appendChild(emailContainer);
formSection_one.appendChild(companeyContainer);
formSection_one.appendChild(countryContainer);
formSection_one.appendChild(buttonContainer);


//form container
let formContainer=document.querySelector(".form-container");
let startBtn=document.querySelector("#start-btn");
startBtn.addEventListener("click",(e)=>{
            formContainer.style.borderColor="#0818fcff";
            formContainer.innerHTML="";
            formContainer.append(formSection_one);
       })       



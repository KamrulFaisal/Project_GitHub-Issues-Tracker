const API="https://phi-lab-server.vercel.app/api/v1/lab/issues";

let issues=[];

const loginForm=document.getElementById("loginForm");
const tabs=document.querySelectorAll(".tab");

loginForm.addEventListener("submit",login);

document.getElementById("closeModal").onclick=closeModal;

tabs.forEach(tab=>{
tab.onclick=()=>{
tabs.forEach(t=>t.classList.remove("active"));
tab.classList.add("active");
filterIssues(tab.dataset.type);
};
});

function login(e){

e.preventDefault();

const user=document.getElementById("username").value;
const pass=document.getElementById("password").value;

if(user==="admin" && pass==="admin123"){

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("mainPage").classList.remove("hidden");

loadIssues();

}else{

document.getElementById("loginError").innerText="Invalid credentials";

}

}

async function loadIssues(){

const res=await fetch(API);
const data=await res.json();

issues=data.data||[];

renderIssues(issues);

}

function renderIssues(list){

const container=document.getElementById("issueContainer");

container.innerHTML="";

document.getElementById("issueCount").innerText=list.length+" Issues";

list.forEach(issue=>{

const status=(issue.status||"").toLowerCase();
const priority=(issue.priority||"").toLowerCase();

const card=document.createElement("div");

card.className="card "+(status==="open"?"openBorder":"closedBorder");

card.innerHTML=`

<div class="cardTop">

<img class="statusIcon" src="assets/${status==="open"?"Open-Status.png":"Closed- Status .png"}">

<span class="priority ${priority}">${issue.priority||""}</span>

</div>

<div class="cardTitle">
Fix Navigation Menu On Mobile Devices
</div>

<div class="cardDesc">
The navigation menu doesn't collapse properly in mobile devices...
</div>

<div class="labelRow">

<span class="label bug">BUG</span>

<span class="label help">HELP WANTED</span>

</div>

<div class="cardFooter">

#1 by john_doe<br>
1/15/2024

</div>

`;

card.onclick=()=>openModal(issue);

container.appendChild(card);

});

}

function filterIssues(type){

if(type==="all") renderIssues(issues);

if(type==="open")
renderIssues(issues.filter(i=>String(i.status).toLowerCase()==="open"));

if(type==="closed")
renderIssues(issues.filter(i=>String(i.status).toLowerCase()==="closed"));

}

function openModal(issue){

document.getElementById("modalTitle").innerText=issue.title;
document.getElementById("modalDesc").innerText=issue.description;

document.getElementById("modalStatus").innerText=issue.status;
document.getElementById("modalAuthor").innerText=issue.author||"N/A";
document.getElementById("modalPriority").innerText=issue.priority||"N/A";
document.getElementById("modalLabel").innerText=issue.label||"N/A";
document.getElementById("modalCreated").innerText=issue.createdAt||"N/A";

document.getElementById("modal").classList.add("show");

}

function closeModal(){
document.getElementById("modal").classList.remove("show");
}
/* ------------------ API ------------------ */

const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let issues = [];


/* ------------------ ELEMENTS ------------------ */

const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const issueContainer = document.getElementById("issueContainer");
const issueCount = document.getElementById("issueCount");

const loader = document.getElementById("loader");

const tabs = document.querySelectorAll(".tab");

const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");


/* ------------------ LOGIN ------------------ */

loginForm.addEventListener("submit", function(e){

e.preventDefault();

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(username === "admin" && password === "admin123"){

loginPage.classList.add("hidden");
mainPage.classList.remove("hidden");

loadIssues();

}else{

document.getElementById("loginError").innerText = "Invalid credentials";

}

});


/* ------------------ LOAD ISSUES ------------------ */

async function loadIssues(){

showLoader();

try{

const response = await fetch(API_URL);
const data = await response.json();

issues = data.data || [];

renderIssues(issues);

}catch(error){

console.error("Error loading issues:", error);

}

hideLoader();

}


/* ------------------ RENDER ISSUES ------------------ */

function renderIssues(issueList){

issueContainer.innerHTML = "";

issueCount.innerText = issueList.length + " Issues";

issueList.forEach(issue => {

const status = (issue.status || "").toLowerCase();

const card = document.createElement("div");

card.className = "card " + (status === "open" ? "openBorder" : "closedBorder");

card.innerHTML = `
<h3>${issue.title || "No Title"}</h3>

<p>${issue.description || ""}</p>

<p>Status: ${issue.status || ""}</p>
`;

card.addEventListener("click", () => openModal(issue));

issueContainer.appendChild(card);

});

}


/* ------------------ TABS FILTER ------------------ */

tabs.forEach(tab => {

tab.addEventListener("click", () => {

tabs.forEach(t => t.classList.remove("active"));
tab.classList.add("active");

const type = tab.dataset.type;

filterIssues(type);

});

});


function filterIssues(type){

if(type === "all"){

renderIssues(issues);

}

if(type === "open"){

const openIssues = issues.filter(issue => issue.status === "OPEN");

renderIssues(openIssues);

}

if(type === "closed"){

const closedIssues = issues.filter(issue => issue.status === "CLOSED");

renderIssues(closedIssues);

}

}


/* ------------------ SEARCH ------------------ */

searchBtn.addEventListener("click", searchIssues);

async function searchIssues(){

const text = searchInput.value.trim();

if(!text){

renderIssues(issues);
return;

}

try{

showLoader();

const response = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
);

const data = await response.json();

renderIssues(data.data || []);

}catch(error){

console.error("Search error:", error);

}

hideLoader();

}


/* ------------------ MODAL ------------------ */

function openModal(issue){

document.getElementById("modalTitle").innerText = issue.title || "";
document.getElementById("modalDesc").innerText = issue.description || "";

document.getElementById("modalStatus").innerText = issue.status || "";
document.getElementById("modalAuthor").innerText = issue.author || "N/A";
document.getElementById("modalPriority").innerText = issue.priority || "N/A";
document.getElementById("modalLabel").innerText = issue.label || "N/A";
document.getElementById("modalCreated").innerText = issue.createdAt || "N/A";

modal.classList.add("show");

}


closeModalBtn.addEventListener("click", closeModal);

function closeModal(){

modal.classList.remove("show");

}


/* ------------------ LOADER ------------------ */

function showLoader(){

loader.classList.add("show");

}

function hideLoader(){

loader.classList.remove("show");

}
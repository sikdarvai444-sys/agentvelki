/* =========================================
   AGENT DATA
========================================= */

const STORAGE_KEY = "velki_agents_v1";

const defaultAgents = [
    {
        id: "1001",
        name: "Demo Master Agent",
        phone: "01700000001",
        type: "master",
        status: "Active"
    },
    {
        id: "2001",
        name: "Demo Super Agent",
        phone: "01700000002",
        type: "super",
        status: "Active"
    },
    {
        id: "3001",
        name: "Demo Sub Admin",
        phone: "01700000003",
        type: "admin",
        status: "Active"
    }
];


function getAgents(){

    const saved = localStorage.getItem(STORAGE_KEY);

    if(saved){
        try{
            return JSON.parse(saved);
        }catch(error){
            return defaultAgents;
        }
    }

    return defaultAgents;
}


/* =========================================
   MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

if(menuBtn){

    menuBtn.addEventListener("click",()=>{
        mobileMenu.classList.add("show");
    });

}

if(closeMenu){

    closeMenu.addEventListener("click",()=>{
        mobileMenu.classList.remove("show");
    });

}


/* =========================================
   SUB MENU
========================================= */

const agentMenuBtn = document.getElementById("agentMenuBtn");
const agentSubmenu = document.getElementById("agentSubmenu");

if(agentMenuBtn){

    agentMenuBtn.addEventListener("click",()=>{

        agentSubmenu.classList.toggle("show");

    });

}


/* =========================================
   MENU LINKS
========================================= */

document.querySelectorAll(".mobile-menu a").forEach(link=>{

    link.addEventListener("click",()=>{

        mobileMenu.classList.remove("show");

    });

});


/* =========================================
   SEARCH BY ID
========================================= */

const searchAgentBtn = document.getElementById("searchAgentBtn");

if(searchAgentBtn){

    searchAgentBtn.addEventListener("click",searchAgent);

}


function searchAgent(){

    const type = document.getElementById("agentType").value;

    const id = document
        .getElementById("agentId")
        .value
        .trim()
        .toLowerCase();

    const result = document.getElementById("searchResult");

    if(!id){

        result.innerHTML = `
            <div class="not-found">
                দয়া করে Agent ID লিখুন।
            </div>
        `;

        return;
    }


    const agents = getAgents();

    const found = agents.find(agent =>

        String(agent.id).toLowerCase() === id &&
        agent.type === type

    );


    if(!found){

        result.innerHTML = `
            <div class="not-found">
                ❌ এই Agent ID পাওয়া যায়নি।
            </div>
        `;

        return;
    }


    result.innerHTML = createResult(found);

}


/* =========================================
   SEARCH BY PHONE
========================================= */

const phoneSearchBtn = document.getElementById("phoneSearchBtn");

if(phoneSearchBtn){

    phoneSearchBtn.addEventListener("click",searchPhone);

}


function searchPhone(){

    const phone = document
        .getElementById("phoneNumber")
        .value
        .trim();

    const result = document.getElementById("phoneResult");

    if(!phone){

        result.innerHTML = `
            <div class="not-found">
                দয়া করে ফোন নাম্বার লিখুন।
            </div>
        `;

        return;
    }


    const agents = getAgents();

    const cleanPhone = phone.replace(/\D/g,"");

    const found = agents.find(agent =>

        String(agent.phone)
        .replace(/\D/g,"")
        .includes(cleanPhone)

    );


    if(!found){

        result.innerHTML = `
            <div class="not-found">
                ❌ এই ফোন নাম্বারের Agent পাওয়া যায়নি।
            </div>
        `;

        return;
    }


    result.innerHTML = createResult(found);

}


/* =========================================
   RESULT CARD
========================================= */

function createResult(agent){

    const typeName = getTypeName(agent.type);

    const phone = String(agent.phone)
        .replace(/\D/g,"");

    return `

        <div class="result-card">

            <h3>${escapeHTML(agent.name)}</h3>

            <div class="result-row">
                <span>Agent ID</span>
                <strong>${escapeHTML(agent.id)}</strong>
            </div>

            <div class="result-row">
                <span>Agent Type</span>
                <strong>${typeName}</strong>
            </div>

            <div class="result-row">
                <span>Phone</span>
                <strong>${escapeHTML(agent.phone)}</strong>
            </div>

            <div class="result-row">
                <span>Status</span>
                <strong>${escapeHTML(agent.status)}</strong>
            </div>

            <a class="call-btn"
               href="tel:${phone}">

                <i class="fa-solid fa-phone"></i>
                কল করুন

            </a>

            <a class="whatsapp-btn"
               target="_blank"
               href="https://wa.me/${phone}">

                <i class="fa-brands fa-whatsapp"></i>
                WhatsApp

            </a>

        </div>
    `;
}


/* =========================================
   AGENT LIST
========================================= */

let currentFilter = "all";

function renderAgents(){

    const container =
        document.getElementById("agentListContainer");

    if(!container) return;

    let agents = getAgents();

    if(currentFilter !== "all"){

        agents = agents.filter(agent =>
            agent.type === currentFilter
        );

    }


    if(agents.length === 0){

        container.innerHTML = `
            <div class="empty">
                কোনো Agent পাওয়া যায়নি।
            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div class="agent-grid">

            ${agents.map(agent => createAgentCard(agent)).join("")}

        </div>

    `;
}


function createAgentCard(agent){

    const phone =
        String(agent.phone).replace(/\D/g,"");

    return `

        <div class="agent-card">

            <span class="agent-type">
                ${getTypeName(agent.type)}
            </span>

            <h3>
                ${escapeHTML(agent.name)}
            </h3>

            <div class="agent-info">

                <div>
                    <strong>Agent ID:</strong>
                    ${escapeHTML(agent.id)}
                </div>

                <div>
                    <strong>Phone:</strong>
                    ${escapeHTML(agent.phone)}
                </div>

                <div>
                    <strong>Status:</strong>
                    ${escapeHTML(agent.status)}
                </div>

            </div>

            <a href="tel:${phone}" class="call-btn">
                <i class="fa-solid fa-phone"></i>
                Call
            </a>

            <a href="https://wa.me/${phone}"
               target="_blank"
               class="whatsapp-btn">

                <i class="fa-brands fa-whatsapp"></i>
                WhatsApp

            </a>

        </div>

    `;
}


/* =========================================
   FILTER
========================================= */

document.querySelectorAll(".filter-btn").forEach(button=>{

    button.addEventListener("click",()=>{

        document
            .querySelectorAll(".filter-btn")
            .forEach(btn=>btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderAgents();

    });

});


/* =========================================
   TYPE NAME
========================================= */

function getTypeName(type){

    if(type === "master"){
        return "মাস্টার এজেন্ট";
    }

    if(type === "super"){
        return "সুপার এজেন্ট";
    }

    if(type === "admin"){
        return "সাব এডমিন";
    }

    return "এজেন্ট";
}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(value){

    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =========================================
   MENU AGENT FILTER
========================================= */

document.querySelectorAll(".submenu a").forEach(link=>{

    link.addEventListener("click",()=>{

        const type = link.dataset.type;

        currentFilter = type;

        document
            .querySelectorAll(".filter-btn")
            .forEach(btn=>{

                btn.classList.toggle(
                    "active",
                    btn.dataset.filter === type
                );

            });

        setTimeout(()=>{

            renderAgents();

        },100);

    });

});


/* =========================================
   LOAD
========================================= */

document.addEventListener("DOMContentLoaded",()=>{

    renderAgents();

});
/* =========================================================
   VELKI.COM
   MAIN SCRIPT
   Agent List System
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "velki_agents_v2";


/* =========================================================
   DEFAULT AGENTS
   প্রথমবার ওয়েবসাইটে দেখানোর জন্য
========================================================= */

const DEFAULT_AGENTS = [

    {
        id: "101",
        type: "super",
        typeName: "SUPER",
        phone: "+855961234567",
        brands: [
            "VELKI",
            "9XBET",
            "BAAJIWALA"
        ],
        status: "active"
    },

    {
        id: "102",
        type: "super",
        typeName: "SUPER",
        phone: "+855969876543",
        brands: [
            "VELKI",
            "9XBET"
        ],
        status: "active"
    },

    {
        id: "103",
        type: "super",
        typeName: "SUPER",
        phone: "+855965555555",
        brands: [
            "VELKI",
            "9XBET"
        ],
        status: "active"
    },

    {
        id: "104",
        type: "super",
        typeName: "SUPER",
        phone: "+855966666666",
        brands: [
            "VELKI",
            "9XBET",
            "BAAJIWALA"
        ],
        status: "active"
    },

    {
        id: "105",
        type: "super",
        typeName: "SUPER",
        phone: "+855967777777",
        brands: [
            "VELKI"
        ],
        status: "active"
    },

    {
        id: "106",
        type: "master",
        typeName: "MASTER",
        phone: "+855968888888",
        brands: [
            "VELKI",
            "9XBET"
        ],
        status: "active"
    },

    {
        id: "107",
        type: "admin",
        typeName: "SUB ADMIN",
        phone: "+855969999999",
        brands: [
            "VELKI",
            "9XBET"
        ],
        status: "active"
    }

];


/* =========================================================
   AGENT DATA
========================================================= */

let agents = [];


/* =========================================================
   LOAD AGENTS
========================================================= */

function loadAgents(){

    try{

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if(saved){

            const parsed =
                JSON.parse(saved);


            if(Array.isArray(parsed)){

                agents = parsed;

            }else{

                agents = [...DEFAULT_AGENTS];

                saveAgents();

            }

        }else{

            agents = [...DEFAULT_AGENTS];

            saveAgents();

        }

    }catch(error){

        console.error(
            "Agent data load error:",
            error
        );

        agents = [...DEFAULT_AGENTS];

    }

}


/* =========================================================
   SAVE AGENTS
========================================================= */

function saveAgents(){

    try{

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(agents)
        );

    }catch(error){

        console.error(
            "Agent data save error:",
            error
        );

    }

}


/* =========================================================
   GET AGENT TYPE NAME
========================================================= */

function getTypeName(type){

    switch(type){

        case "master":
            return "MASTER";

        case "super":
            return "SUPER";

        case "admin":
            return "SUB ADMIN";

        default:
            return "AGENT";

    }

}


/* =========================================================
   ESCAPE HTML
   নিরাপত্তার জন্য
========================================================= */

function escapeHTML(value){

    if(value === null ||
       value === undefined){

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   NORMALIZE ID
========================================================= */

function normalizeID(value){

    return String(value || "")
        .trim()
        .toLowerCase();

}


/* =========================================================
   NORMALIZE PHONE
========================================================= */

function normalizePhone(value){

    return String(value || "")
        .trim()
        .replace(/[^\d+]/g, "");

}


/* =========================================================
   CREATE PHONE LINK
========================================================= */

function createPhoneLink(phone){

    const safePhone =
        escapeHTML(phone);


    const telPhone =
        String(phone || "")
        .replace(/[^\d+]/g, "");


    if(!telPhone){

        return `<span>-</span>`;

    }


    return `
        <a
            href="tel:${escapeHTML(telPhone)}">

            ${safePhone}

        </a>
    `;

}


/* =========================================================
   CREATE BRAND HTML
========================================================= */

function createBrands(brands){

    if(!Array.isArray(brands)){

        return "";

    }


    return brands
        .filter(Boolean)
        .map(function(brand){

            return `

                <div class="agent-brand-row">

                    <a
                        href="#"
                        class="agent-brand"
                        onclick="return false;">

                        ${escapeHTML(
                            brand
                        )}

                    </a>

                    <span
                        class="agent-check">

                        ✓

                    </span>

                </div>

            `;

        })
        .join("");

}


/* =========================================================
   CREATE AGENT ROW
========================================================= */

function createAgentRow(agent){

    const row =
        document.createElement("div");


    row.className =
        "agent-row";


    row.dataset.id =
        agent.id || "";


    row.dataset.type =
        agent.type || "";


    const id =
        escapeHTML(
            agent.id || ""
        );


    const type =
        escapeHTML(
            agent.typeName ||
            getTypeName(
                agent.type
            )
        );


    const phone =
        agent.phone || "";


    const brands =
        Array.isArray(agent.brands)
        ? agent.brands
        : [];


    row.innerHTML = `

        <!-- ID -->

        <div class="agent-id-box">

            <a
                href="#"
                onclick="return false;">

                ${id}

            </a>

        </div>


        <!-- TYPE -->

        <div class="agent-type-box">

            ${type}

        </div>


        <!-- BRAND -->

        <div class="agent-info">

            ${
                brands.length
                ? createBrands(brands)
                : `
                    <span>
                        -
                    </span>
                  `
            }

        </div>


        <!-- PHONE -->

        <div class="agent-phone">

            ${createPhoneLink(phone)}

        </div>


        <!-- ACTION -->

        <div class="agent-action">

            <a
                href="#"
                onclick="
                    complaint(
                        '${String(
                            agent.id || ""
                        ).replace(
                            /'/g,
                            "\\'"
                        )}'
                    );
                    return false;
                ">

                অভিযোগ

            </a>


            <a
                href="tel:${escapeHTML(
                    normalizePhone(phone)
                )}">

                যোগ

            </a>

        </div>

    `;


    return row;

}


/* =========================================================
   RENDER AGENTS
========================================================= */

function renderAgents(
    filter = "all"
){

    const container =
        document.getElementById(
            "agentListContainer"
        );


    if(!container){

        return;

    }


    container.innerHTML = "";


    let filtered =
        agents.filter(function(agent){

            if(
                agent.status &&
                agent.status !== "active"
            ){

                return false;

            }


            if(filter === "all"){

                return true;

            }


            return agent.type === filter;

        });


    /* SORT BY ID */

    filtered.sort(function(a,b){

        return String(a.id || "")
            .localeCompare(
                String(b.id || ""),
                undefined,
                {
                    numeric:true
                }
            );

    });


    if(filtered.length === 0){

        container.innerHTML = `

            <div class="no-agent">

                <i
                    class="fa-solid
                    fa-circle-exclamation">
                </i>

                <br><br>

                কোনো এজেন্ট পাওয়া যায়নি।

            </div>

        `;

        return;

    }


    filtered.forEach(function(agent){

        container.appendChild(
            createAgentRow(agent)
        );

    });

}


/* =========================================================
   UPDATE LIST TITLE
========================================================= */

function updateListTitle(
    filter
){

    const title =
        document.getElementById(
            "agentListTitle"
        );


    if(!title){

        return;

    }


    switch(filter){

        case "master":

            title.textContent =
                "ALL MASTER AGENT LIST";

            break;


        case "super":

            title.textContent =
                "ALL SUPER AGENT LIST";

            break;


        case "admin":

            title.textContent =
                "ALL SUB ADMIN LIST";

            break;


        default:

            title.textContent =
                "ALL AGENT LIST";

    }

}


/* =========================================================
   SET FILTER
========================================================= */

function setAgentFilter(
    filter
){

    document
        .querySelectorAll(".filter-btn")
        .forEach(function(button){

            button.classList.remove(
                "active"
            );


            if(
                button.dataset.filter ===
                filter
            ){

                button.classList.add(
                    "active"
                );

            }

        });


    updateListTitle(filter);

    renderAgents(filter);

}


/* =========================================================
   SEARCH AGENT
========================================================= */

function searchAgent(){

    const input =
        document.getElementById(
            "agentId"
        );


    const typeSelect =
        document.getElementById(
            "agentType"
        );


    const result =
        document.getElementById(
            "searchResult"
        );


    if(!input || !result){

        return;

    }


    const id =
        normalizeID(
            input.value
        );


    const type =
        typeSelect
        ? typeSelect.value
        : "all";


    if(!id){

        result.innerHTML = `

            <div class="no-agent">

                Agent ID লিখুন।

            </div>

        `;

        return;

    }


    let found =
        agents.find(function(agent){

            return (
                normalizeID(agent.id) === id
                &&
                (
                    type === "all" ||
                    agent.type === type
                )
                &&
                (
                    !agent.status ||
                    agent.status === "active"
                )
            );

        });


    /* যদি type অনুযায়ী না পাওয়া যায়,
       একই ID অন্য type-এ আছে কিনা */

    if(!found){

        const sameID =
            agents.find(function(agent){

                return (
                    normalizeID(agent.id) === id
                    &&
                    (
                        !agent.status ||
                        agent.status === "active"
                    )
                );

            });


        if(sameID){

            result.innerHTML = `

                <div class="no-agent">

                    এই Agent ID অন্য Agent Type-এর।

                    <br>

                    Agent Type সঠিকভাবে নির্বাচন করুন।

                </div>

            `;

            return;

        }


        result.innerHTML = `

            <div class="no-agent">

                <i
                    class="fa-solid
                    fa-circle-xmark">
                </i>

                <br><br>

                এই Agent ID পাওয়া যায়নি।

            </div>

        `;

        return;

    }


    /* RESULT */

    result.innerHTML = "";


    const title =
        document.createElement("div");


    title.style.cssText = `
        margin-bottom:10px;
        text-align:center;
        font-weight:800;
        font-size:16px;
    `;


    title.textContent =
        "Agent Found";


    result.appendChild(title);


    result.appendChild(
        createAgentRow(found)
    );


    /* Scroll result */

    setTimeout(function(){

        result.scrollIntoView({
            behavior:"smooth",
            block:"center"
        });

    },100);

}


/* =========================================================
   COMPLAINT
========================================================= */

function complaint(id){

    const agent =
        agents.find(function(item){

            return normalizeID(item.id)
                === normalizeID(id);

        });


    const phone =
        agent
        ? agent.phone
        : "";


    const message =
        phone
        ? 
        "Agent ID: " +
        id +
        "\n\n" +
        "Agent Phone: " +
        phone +
        "\n\n" +
        "অভিযোগ করার জন্য Customer Service-এর সাথে যোগাযোগ করুন।"
        :
        "Agent ID: " +
        id +
        "\n\n" +
        "অভিযোগ করার জন্য Customer Service-এর সাথে যোগাযোগ করুন।";


    alert(message);

}


/* =========================================================
   TOP SEARCH
========================================================= */

function performTopSearch(){

    const input =
        document.getElementById(
            "topSearchInput"
        );


    const mainInput =
        document.getElementById(
            "agentId"
        );


    const findSection =
        document.getElementById(
            "findAgent"
        );


    if(!input){

        return;

    }


    const value =
        input.value.trim();


    if(!value){

        input.focus();

        return;

    }


    if(mainInput){

        mainInput.value =
            value;

    }


    if(findSection){

        findSection.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

    }


    setTimeout(function(){

        searchAgent();

    },500);

}


/* =========================================================
   MENU
========================================================= */

function initMenu(){

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const closeMenu =
        document.getElementById(
            "closeMenu"
        );


    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    const menuOverlay =
        document.getElementById(
            "menuOverlay"
        );


    function openMenu(){

        if(mobileMenu){

            mobileMenu.classList.add(
                "show"
            );

        }


        if(menuOverlay){

            menuOverlay.classList.add(
                "show"
            );

        }


        document.body.classList.add(
            "menu-open"
        );

    }


    function closeMobileMenu(){

        if(mobileMenu){

            mobileMenu.classList.remove(
                "show"
            );

        }


        if(menuOverlay){

            menuOverlay.classList.remove(
                "show"
            );

        }


        document.body.classList.remove(
            "menu-open"
        );

    }


    if(menuBtn){

        menuBtn.addEventListener(
            "click",
            openMenu
        );

    }


    if(closeMenu){

        closeMenu.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    if(menuOverlay){

        menuOverlay.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    /* CLOSE WHEN LINK CLICK */

    document
        .querySelectorAll(
            ".mobile-menu a"
        )
        .forEach(function(link){

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });


    /* SUBMENU */

    const agentMenuBtn =
        document.getElementById(
            "agentMenuBtn"
        );


    const agentSubmenu =
        document.getElementById(
            "agentSubmenu"
        );


    const agentMenuArrow =
        document.getElementById(
            "agentMenuArrow"
        );


    if(agentMenuBtn){

        agentMenuBtn.addEventListener(
            "click",
            function(){

                if(!agentSubmenu){

                    return;

                }


                agentSubmenu.classList.toggle(
                    "show"
                );


                if(
                    agentSubmenu.classList.contains(
                        "show"
                    )
                ){

                    if(agentMenuArrow){

                        agentMenuArrow.style.transform =
                            "rotate(180deg)";

                    }

                }else{

                    if(agentMenuArrow){

                        agentMenuArrow.style.transform =
                            "rotate(0deg)";

                    }

                }

            }
        );

    }

}


/* =========================================================
   TOP SEARCH INIT
========================================================= */

function initTopSearch(){

    const button =
        document.getElementById(
            "topSearchBtn"
        );


    const box =
        document.getElementById(
            "topSearchBox"
        );


    const input =
        document.getElementById(
            "topSearchInput"
        );


    const submit =
        document.getElementById(
            "topSearchSubmit"
        );


    if(button && box){

        button.addEventListener(
            "click",
            function(){

                box.classList.toggle(
                    "show"
                );


                if(
                    box.classList.contains(
                        "show"
                    )
                ){

                    setTimeout(function(){

                        if(input){

                            input.focus();

                        }

                    },100);

                }

            }
        );

    }


    if(submit){

        submit.addEventListener(
            "click",
            performTopSearch
        );

    }


    if(input){

        input.addEventListener(
            "keydown",
            function(event){

                if(event.key === "Enter"){

                    performTopSearch();

                }

            }
        );

    }

}


/* =========================================================
   FILTER INIT
========================================================= */

function initFilters(){

    document
        .querySelectorAll(".filter-btn")
        .forEach(function(button){

            button.addEventListener(
                "click",
                function(){

                    setAgentFilter(
                        this.dataset.filter ||
                        "all"
                    );

                }
            );

        });

}


/* =========================================================
   SEARCH INIT
========================================================= */

function initSearch(){

    const button =
        document.getElementById(
            "searchAgentBtn"
        );


    const input =
        document.getElementById(
            "agentId"
        );


    if(button){

        button.addEventListener(
            "click",
            searchAgent
        );

    }


    if(input){

        input.addEventListener(
            "keydown",
            function(event){

                if(event.key === "Enter"){

                    event.preventDefault();

                    searchAgent();

                }

            }
        );

    }

}


/* =========================================================
   AUTO UPDATE
   অন্য tab-এ Admin পরিবর্তন করলে
   বর্তমান page refresh ছাড়াই update হবে
========================================================= */

window.addEventListener(
    "storage",
    function(event){

        if(
            event.key === STORAGE_KEY
        ){

            loadAgents();

            const activeButton =
                document.querySelector(
                    ".filter-btn.active"
                );


            const filter =
                activeButton
                ? (
                    activeButton.dataset.filter ||
                    "all"
                  )
                : "all";


            renderAgents(filter);

        }

    }
);


/* =========================================================
   EXPOSE FUNCTIONS
   Admin panel থেকেও ব্যবহার করা যাবে
========================================================= */

window.VelkiAgentSystem = {

    getAgents: function(){

        return agents;

    },


    setAgents: function(data){

        if(!Array.isArray(data)){

            return false;

        }


        agents = data;

        saveAgents();

        renderAgents("all");

        return true;

    },


    addAgent: function(agent){

        if(!agent){

            return false;

        }


        if(!agent.id){

            return false;

        }


        const exists =
            agents.some(function(item){

                return (
                    normalizeID(item.id) ===
                    normalizeID(agent.id)
                );

            });


        if(exists){

            return false;

        }


        agent.typeName =
            agent.typeName ||
            getTypeName(agent.type);


        agent.brands =
            Array.isArray(agent.brands)
            ? agent.brands
            : [];


        agent.status =
            agent.status ||
            "active";


        agents.push(agent);

        saveAgents();

        renderAgents("all");

        return true;

    },


    updateAgent: function(id, updated){

        const index =
            agents.findIndex(function(agent){

                return (
                    normalizeID(agent.id) ===
                    normalizeID(id)
                );

            });


        if(index === -1){

            return false;

        }


        agents[index] = {

            ...agents[index],
            ...updated

        };


        agents[index].typeName =
            agents[index].typeName ||
            getTypeName(
                agents[index].type
            );


        saveAgents();

        renderAgents("all");

        return true;

    },


    deleteAgent: function(id){

        const before =
            agents.length;


        agents =
            agents.filter(function(agent){

                return (
                    normalizeID(agent.id) !==
                    normalizeID(id)
                );

            });


        if(
            agents.length === before
        ){

            return false;

        }


        saveAgents();

        renderAgents("all");

        return true;

    },


    resetAgents: function(){

        agents =
            [...DEFAULT_AGENTS];

        saveAgents();

        renderAgents("all");

    }

};


/* =========================================================
   INITIALIZE
========================================================= */

function initializeVelki(){

    loadAgents();

    initMenu();

    initTopSearch();

    initFilters();

    initSearch();

    renderAgents("all");

}


/* =========================================================
   DOM READY
========================================================= */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initializeVelki
    );

}else{

    initializeVelki();

}


/* =========================================================
   END
========================================================= */
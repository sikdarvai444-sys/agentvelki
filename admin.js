"use strict";


/* =========================================================
   VELKI.COM ADMIN SYSTEM
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const AGENT_KEY =
    "velki_agents_v2";


const PIN_KEY =
    "velki_admin_pin_v2";


const DEFAULT_PIN =
    "123456";


/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_AGENTS = [

    {
        id:"101",
        type:"super",
        typeName:"SUPER",
        phone:"+855961234567",
        brands:[
            "VELKI",
            "9XBET",
            "BAAJIWALA"
        ],
        status:"active"
    },

    {
        id:"102",
        type:"super",
        typeName:"SUPER",
        phone:"+855969876543",
        brands:[
            "VELKI",
            "9XBET"
        ],
        status:"active"
    },

    {
        id:"103",
        type:"super",
        typeName:"SUPER",
        phone:"+855965555555",
        brands:[
            "VELKI",
            "9XBET"
        ],
        status:"active"
    },

    {
        id:"104",
        type:"super",
        typeName:"SUPER",
        phone:"+855966666666",
        brands:[
            "VELKI",
            "9XBET",
            "BAAJIWALA"
        ],
        status:"active"
    },

    {
        id:"105",
        type:"super",
        typeName:"SUPER",
        phone:"+855967777777",
        brands:[
            "VELKI"
        ],
        status:"active"
    },

    {
        id:"106",
        type:"master",
        typeName:"MASTER",
        phone:"+855968888888",
        brands:[
            "VELKI",
            "9XBET"
        ],
        status:"active"
    },

    {
        id:"107",
        type:"admin",
        typeName:"SUB ADMIN",
        phone:"+855969999999",
        brands:[
            "VELKI",
            "9XBET"
        ],
        status:"active"
    }

];


/* =========================================================
   STATE
========================================================= */

let agents = [];

let currentBrands = [];


/* =========================================================
   DOM
========================================================= */

const form =
    document.getElementById(
        "agentForm"
    );


const agentIdInput =
    document.getElementById(
        "agentId"
    );


const agentTypeInput =
    document.getElementById(
        "agentType"
    );


const agentPhoneInput =
    document.getElementById(
        "agentPhone"
    );


const agentStatusInput =
    document.getElementById(
        "agentStatus"
    );


const brandInput =
    document.getElementById(
        "brandInput"
    );


const brandsList =
    document.getElementById(
        "brandsList"
    );


const editOriginalId =
    document.getElementById(
        "editOriginalId"
    );


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(value){

    return String(
        value ?? ""
    )
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


/* =========================================================
   TYPE NAME
========================================================= */

function getTypeName(type){

    if(type === "master"){
        return "MASTER";
    }

    if(type === "super"){
        return "SUPER";
    }

    if(type === "admin"){
        return "SUB ADMIN";
    }

    return "AGENT";

}


/* =========================================================
   LOAD DATA
========================================================= */

function loadAgents(){

    try{

        const saved =
            localStorage.getItem(
                AGENT_KEY
            );


        if(saved){

            const parsed =
                JSON.parse(saved);


            if(Array.isArray(parsed)){

                agents = parsed;

            }else{

                agents =
                    [...DEFAULT_AGENTS];

                saveAgents();

            }

        }else{

            agents =
                [...DEFAULT_AGENTS];

            saveAgents();

        }

    }catch(error){

        console.error(error);

        agents =
            [...DEFAULT_AGENTS];

    }

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveAgents(){

    localStorage.setItem(
        AGENT_KEY,
        JSON.stringify(agents)
    );

}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(
    message,
    type="success"
){

    const box =
        document.getElementById(
            "formMessage"
        );


    box.style.display =
        "block";


    box.className =
        "notice " +
        (
            type === "error"
            ? "error-message"
            : "success-message"
        );


    box.textContent =
        message;


    setTimeout(function(){

        box.style.display =
            "none";

    },3000);

}


/* =========================================================
   RENDER BRANDS
========================================================= */

function renderBrands(){

    brandsList.innerHTML = "";


    currentBrands.forEach(
        function(brand,index){

            const tag =
                document.createElement(
                    "div"
                );


            tag.className =
                "brand-tag";


            tag.innerHTML = `

                ${escapeHTML(brand)}

                <button
                    type="button"
                    class="brand-remove"
                    data-index="${index}">

                    ×

                </button>

            `;


            brandsList.appendChild(
                tag
            );

        }
    );


    document
    .querySelectorAll(
        ".brand-remove"
    )
    .forEach(function(button){

        button.addEventListener(
            "click",
            function(){

                const index =
                    Number(
                        this.dataset.index
                    );


                currentBrands.splice(
                    index,
                    1
                );


                renderBrands();

            }
        );

    });

}


/* =========================================================
   ADD BRAND
========================================================= */

function addBrand(){

    const value =
        brandInput.value.trim();


    if(!value){

        return;

    }


    const exists =
        currentBrands.some(
            function(item){

                return item.toLowerCase()
                    === value.toLowerCase();

            }
        );


    if(exists){

        brandInput.value = "";

        return;

    }


    currentBrands.push(
        value.toUpperCase()
    );


    brandInput.value = "";

    renderBrands();

}


/* =========================================================
   CLEAR FORM
========================================================= */

function clearForm(){

    form.reset();


    editOriginalId.value =
        "";


    currentBrands = [];


    renderBrands();


    document
    .getElementById(
        "formTitle"
    )
    .textContent =
        "নতুন Agent যোগ করুন";


    document
    .getElementById(
        "saveButtonText"
    )
    .textContent =
        "Save Agent";


    agentTypeInput.value =
        "master";


    agentStatusInput.value =
        "active";

}


/* =========================================================
   ADD / UPDATE AGENT
========================================================= */

function saveAgent(event){

    event.preventDefault();


    const id =
        agentIdInput.value.trim();


    const type =
        agentTypeInput.value;


    const phone =
        agentPhoneInput.value.trim();


    const status =
        agentStatusInput.value;


    const oldId =
        editOriginalId.value.trim();


    if(!id){

        showMessage(
            "Agent ID দিন।",
            "error"
        );

        return;

    }


    if(!phone){

        showMessage(
            "Phone Number দিন।",
            "error"
        );

        return;

    }


    /* EDIT */

    if(oldId){

        const index =
            agents.findIndex(
                function(agent){

                    return String(agent.id)
                    .toLowerCase()
                    ===
                    oldId.toLowerCase();

                }
            );


        if(index === -1){

            showMessage(
                "Agent পাওয়া যায়নি।",
                "error"
            );

            return;

        }


        /* ID change হলে duplicate check */

        if(
            id.toLowerCase()
            !==
            oldId.toLowerCase()
        ){

            const duplicate =
                agents.some(
                    function(agent){

                        return String(
                            agent.id
                        ).toLowerCase()
                        ===
                        id.toLowerCase();

                    }
                );


            if(duplicate){

                showMessage(
                    "এই Agent ID আগে থেকেই আছে।",
                    "error"
                );

                return;

            }

        }


        agents[index] = {

            ...agents[index],

            id:id,

            type:type,

            typeName:
                getTypeName(type),

            phone:phone,

            brands:[
                ...currentBrands
            ],

            status:status

        };


        saveAgents();


        showMessage(
            "Agent সফলভাবে আপডেট হয়েছে।"
        );


        clearForm();

        renderAll();

        return;

    }


    /* ADD */

    const exists =
        agents.some(
            function(agent){

                return String(agent.id)
                .toLowerCase()
                ===
                id.toLowerCase();

            }
        );


    if(exists){

        showMessage(
            "এই Agent ID আগে থেকেই আছে।",
            "error"
        );

        return;

    }


    const newAgent = {

        id:id,

        type:type,

        typeName:
            getTypeName(type),

        phone:phone,

        brands:[
            ...currentBrands
        ],

        status:status

    };


    agents.push(
        newAgent
    );


    saveAgents();


    showMessage(
        "নতুন Agent সফলভাবে যোগ হয়েছে।"
    );


    clearForm();

    renderAll();

}


/* =========================================================
   EDIT AGENT
========================================================= */

function editAgent(id){

    const agent =
        agents.find(
            function(item){

                return String(item.id)
                .toLowerCase()
                ===
                String(id)
                .toLowerCase();

            }
        );


    if(!agent){

        return;

    }


    editOriginalId.value =
        agent.id;


    agentIdInput.value =
        agent.id;


    agentTypeInput.value =
        agent.type || "super";


    agentPhoneInput.value =
        agent.phone || "";


    agentStatusInput.value =
        agent.status || "active";


    currentBrands =
        Array.isArray(agent.brands)
        ? [...agent.brands]
        : [];


    renderBrands();


    document
    .getElementById(
        "formTitle"
    )
    .textContent =
        "Agent Edit করুন";


    document
    .getElementById(
        "saveButtonText"
    )
    .textContent =
        "Update Agent";


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/* =========================================================
   DELETE AGENT
========================================================= */

function deleteAgent(id){

    const agent =
        agents.find(
            function(item){

                return String(item.id)
                .toLowerCase()
                ===
                String(id)
                .toLowerCase();

            }
        );


    if(!agent){

        return;

    }


    const confirmDelete =
        confirm(
            "Agent ID " +
            agent.id +
            " মুছে ফেলতে চান?"
        );


    if(!confirmDelete){

        return;

    }


    agents =
        agents.filter(
            function(item){

                return String(item.id)
                .toLowerCase()
                !==
                String(id)
                .toLowerCase();

            }
        );


    saveAgents();


    renderAll();


    showMessage(
        "Agent মুছে ফেলা হয়েছে।"
    );

}


/* =========================================================
   TOGGLE STATUS
========================================================= */

function toggleStatus(id){

    const agent =
        agents.find(
            function(item){

                return String(item.id)
                .toLowerCase()
                ===
                String(id)
                .toLowerCase();

            }
        );


    if(!agent){

        return;

    }


    agent.status =
        agent.status === "active"
        ? "disabled"
        : "active";


    saveAgents();


    renderAll();

}


/* =========================================================
   FILTER DATA
========================================================= */

function getFilteredAgents(){

    const search =
        document
        .getElementById(
            "tableSearch"
        )
        .value
        .trim()
        .toLowerCase();


    const filter =
        document
        .getElementById(
            "tableFilter"
        )
        .value;


    return agents.filter(
        function(agent){

            const brands =
                Array.isArray(
                    agent.brands
                )
                ? agent.brands.join(" ")
                : "";


            const searchable =
                (
                    String(
                        agent.id || ""
                    )
                    + " " +
                    String(
                        agent.phone || ""
                    )
                    + " " +
                    brands
                    + " " +
                    String(
                        agent.typeName || ""
                    )
                )
                .toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(search);


            let matchesFilter =
                true;


            if(
                filter === "master" ||
                filter === "super" ||
                filter === "admin"
            ){

                matchesFilter =
                    agent.type === filter;

            }


            if(filter === "active"){

                matchesFilter =
                    (
                        !agent.status ||
                        agent.status === "active"
                    );

            }


            if(filter === "disabled"){

                matchesFilter =
                    agent.status === "disabled";

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        }
    );

}


/* =========================================================
   RENDER TABLE
========================================================= */

function renderTable(){

    const tbody =
        document.getElementById(
            "agentTableBody"
        );


    const filtered =
        getFilteredAgents();


    tbody.innerHTML = "";


    document
    .getElementById(
        "visibleCount"
    )
    .textContent =
        filtered.length +
        " জন";


    if(!filtered.length){

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                    text-align:center;
                    padding:30px;">

                    কোনো Agent পাওয়া যায়নি।

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(
        function(agent){

            const tr =
                document.createElement(
                    "tr"
                );


            const brands =
                Array.isArray(
                    agent.brands
                )
                ? agent.brands
                : [];


            const brandHTML =
                brands.length
                ? brands
                    .map(
                        function(brand){

                            return `
                                <span
                                    style="
                                    display:inline-block;
                                    margin:2px;
                                    padding:4px 6px;
                                    background:#eee;
                                    border-radius:4px;
                                    font-size:11px;">

                                    ${escapeHTML(
                                        brand
                                    )}

                                </span>
                            `;

                        }
                    )
                    .join("")
                : "-";


            const status =
                (
                    !agent.status ||
                    agent.status === "active"
                )
                ? "Active"
                : "Disabled";


            const statusClass =
                status === "Active"
                ? "status-active"
                : "status-disabled";


            tr.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            agent.id
                        )}
                    </strong>
                </td>


                <td>

                    <span
                        class="type-badge">

                        ${escapeHTML(
                            agent.typeName ||
                            getTypeName(
                                agent.type
                            )
                        )}

                    </span>

                </td>


                <td>

                    <a
                        href="tel:${escapeHTML(
                            agent.phone
                        )}">

                        ${escapeHTML(
                            agent.phone
                        )}

                    </a>

                </td>


                <td>
                    ${brandHTML}
                </td>


                <td>

                    <span
                        class="status-badge
                        ${statusClass}">

                        ${status}

                    </span>

                </td>


                <td>

                    <div
                        class="action-buttons">


                        <button
                            class="edit-btn"
                            onclick="editAgent('${escapeHTML(agent.id)}')">

                            <i
                                class="fa-solid
                                fa-pen">
                            </i>

                        </button>


                        <button
                            class="toggle-btn"
                            onclick="toggleStatus('${escapeHTML(agent.id)}')">

                            <i
                                class="fa-solid
                                fa-power-off">
                            </i>

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteAgent('${escapeHTML(agent.id)}')">

                            <i
                                class="fa-solid
                                fa-trash">
                            </i>

                        </button>


                    </div>

                </td>

            `;


            tbody.appendChild(tr);

        }
    );

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStats(){

    const total =
        agents.length;


    const master =
        agents.filter(
            a => a.type === "master"
        ).length;


    const superCount =
        agents.filter(
            a => a.type === "super"
        ).length;


    const admin =
        agents.filter(
            a => a.type === "admin"
        ).length;


    document
    .getElementById(
        "totalCount"
    )
    .textContent =
        total;


    document
    .getElementById(
        "masterCount"
    )
    .textContent =
        master;


    document
    .getElementById(
        "superCount"
    )
    .textContent =
        superCount;


    document
    .getElementById(
        "adminCount"
    )
    .textContent =
        admin;

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll(){

    renderStats();

    renderTable();

}


/* =========================================================
   EXPORT JSON
========================================================= */

function exportData(){

    const data = {

        version:2,

        exportedAt:
            new Date()
            .toISOString(),

        agents:[
            ...agents
        ]

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            "a"
        );


    const date =
        new Date()
        .toISOString()
        .slice(0,10);


    a.href = url;

    a.download =
        "velki-agent-backup-" +
        date +
        ".json";


    document.body.appendChild(a);

    a.click();

    a.remove();


    URL.revokeObjectURL(url);

}


/* =========================================================
   IMPORT JSON
========================================================= */

function importData(event){

    const file =
        event.target.files[0];


    if(!file){

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(){

            try{

                const parsed =
                    JSON.parse(
                        reader.result
                    );


                let imported;


                if(
                    Array.isArray(
                        parsed
                    )
                ){

                    imported =
                        parsed;

                }else if(
                    Array.isArray(
                        parsed.agents
                    )
                ){

                    imported =
                        parsed.agents;

                }else{

                    throw new Error(
                        "Invalid data"
                    );

                }


                const valid =
                    imported.filter(
                        function(agent){

                            return (
                                agent &&
                                agent.id
                            );

                        }
                    )
                    .map(
                        function(agent){

                            return {

                                id:String(
                                    agent.id
                                ),

                                type:
                                    agent.type ||
                                    "super",

                                typeName:
                                    agent.typeName ||
                                    getTypeName(
                                        agent.type ||
                                        "super"
                                    ),

                                phone:
                                    agent.phone ||
                                    "",

                                brands:
                                    Array.isArray(
                                        agent.brands
                                    )
                                    ? agent.brands
                                    : [],

                                status:
                                    agent.status ===
                                    "disabled"
                                    ? "disabled"
                                    : "active"

                            };

                        }
                    );


                if(!valid.length){

                    throw new Error(
                        "No valid agents"
                    );

                }


                const ok =
                    confirm(
                        valid.length +
                        " জন Agent Import হবে।\n\n" +
                        "বর্তমান data replace করবেন?"
                    );


                if(!ok){

                    return;

                }


                agents =
                    valid;


                saveAgents();

                renderAll();


                showMessage(
                    "Agent data সফলভাবে Import হয়েছে।"
                );


            }catch(error){

                console.error(error);


                showMessage(
                    "ভুল JSON ফাইল।",
                    "error"
                );

            }

        };


    reader.readAsText(file);


    event.target.value = "";

}


/* =========================================================
   RESET DATA
========================================================= */

function resetData(){

    const ok =
        confirm(
            "সতর্কতা!\n\n" +
            "বর্তমান Agent data মুছে Default data ফিরিয়ে আনা হবে।\n\n" +
            "আপনি কি নিশ্চিত?"
        );


    if(!ok){

        return;

    }


    agents =
        JSON.parse(
            JSON.stringify(
                DEFAULT_AGENTS
            )
        );


    saveAgents();

    renderAll();

    clearForm();


    showMessage(
        "Default Agent data ফিরিয়ে আনা হয়েছে।"
    );

}


/* =========================================================
   CHANGE PIN
========================================================= */

function changePin(){

    const newPin =
        document
        .getElementById(
            "newPin"
        )
        .value
        .trim();


    const confirmPin =
        document
        .getElementById(
            "confirmPin"
        )
        .value
        .trim();


    if(!newPin){

        alert(
            "নতুন PIN দিন।"
        );

        return;

    }


    if(newPin.length < 4){

        alert(
            "PIN কমপক্ষে ৪ সংখ্যার হতে হবে।"
        );

        return;

    }


    if(newPin !== confirmPin){

        alert(
            "দুইটি PIN একই নয়।"
        );

        return;

    }


    localStorage.setItem(
        PIN_KEY,
        newPin
    );


    document
    .getElementById(
        "newPin"
    )
    .value = "";


    document
    .getElementById(
        "confirmPin"
    )
    .value = "";


    alert(
        "Admin PIN সফলভাবে পরিবর্তন হয়েছে।"
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout(){

    sessionStorage.removeItem(
        "velki_admin_logged_in"
    );


    sessionStorage.removeItem(
        "velki_admin_login_time"
    );


    window.location.href =
        "admin.html";

}


/* =========================================================
   AUTH CHECK
========================================================= */

function checkLogin(){

    const logged =
        sessionStorage.getItem(
            "velki_admin_logged_in"
        );


    if(logged !== "yes"){

        window.location.href =
            "admin.html";

        return false;

    }


    return true;

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

document
.getElementById(
    "addBrandBtn"
)
.addEventListener(
    "click",
    addBrand
);


brandInput
.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){

            event.preventDefault();

            addBrand();

        }

    }
);


form.addEventListener(
    "submit",
    saveAgent
);


document
.getElementById(
    "clearFormBtn"
)
.addEventListener(
    "click",
    clearForm
);


document
.getElementById(
    "tableSearch"
)
.addEventListener(
    "input",
    renderTable
);


document
.getElementById(
    "tableFilter"
)
.addEventListener(
    "change",
    renderTable
);


document
.getElementById(
    "exportBtn"
)
.addEventListener(
    "click",
    exportData
);


document
.getElementById(
    "importFile"
)
.addEventListener(
    "change",
    importData
);


document
.getElementById(
    "resetDataBtn"
)
.addEventListener(
    "click",
    resetData
);


document
.getElementById(
    "changePinBtn"
)
.addEventListener(
    "click",
    changePin
);


document
.getElementById(
    "logoutBtn"
)
.addEventListener(
    "click",
    logout
);


/* =========================================================
   STORAGE EVENT
========================================================= */

window.addEventListener(
    "storage",
    function(event){

        if(
            event.key === AGENT_KEY
        ){

            loadAgents();

            renderAll();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

if(checkLogin()){

    loadAgents();

    renderAll();

    renderBrands();

}
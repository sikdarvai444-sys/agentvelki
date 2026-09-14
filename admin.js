/* =========================================
   SETTINGS
========================================= */

const AGENT_KEY = "velki_agents_v1";
const PIN_KEY = "velki_admin_pin_v1";

let editingId = null;


/* =========================================
   DEFAULT PIN
========================================= */

function getPin(){

    let pin = localStorage.getItem(PIN_KEY);

    if(!pin){

        pin = "123456";

        localStorage.setItem(PIN_KEY,pin);

    }

    return pin;
}


/* =========================================
   GET AGENTS
========================================= */

function getAgents(){

    const data = localStorage.getItem(AGENT_KEY);

    if(!data){
        return [];
    }

    try{

        return JSON.parse(data);

    }catch(error){

        return [];

    }
}


/* =========================================
   SAVE AGENTS
========================================= */

function saveAgents(agents){

    localStorage.setItem(
        AGENT_KEY,
        JSON.stringify(agents)
    );

}


/* =========================================
   LOGIN
========================================= */

document.getElementById("loginBtn")
.addEventListener("click",login);


document.getElementById("adminPin")
.addEventListener("keydown",(e)=>{

    if(e.key === "Enter"){
        login();
    }

});


function login(){

    const pin =
        document.getElementById("adminPin").value;

    const error =
        document.getElementById("loginError");


    if(pin === getPin()){

        sessionStorage.setItem(
            "velki_admin_logged",
            "yes"
        );

        document.getElementById("loginSection")
            .style.display = "none";

        document.getElementById("adminSection")
            .style.display = "block";

        renderAdminAgents();

    }else{

        error.textContent =
            "❌ ভুল PIN! আবার চেষ্টা করুন।";

    }

}


/* =========================================
   CHECK LOGIN
========================================= */

document.addEventListener("DOMContentLoaded",()=>{

    if(
        sessionStorage.getItem(
            "velki_admin_logged"
        ) === "yes"
    ){

        document.getElementById("loginSection")
            .style.display = "none";

        document.getElementById("adminSection")
            .style.display = "block";

        renderAdminAgents();

    }

});


/* =========================================
   SAVE AGENT
========================================= */

document.getElementById("saveAgentBtn")
.addEventListener("click",saveAgent);


function saveAgent(){

    const type =
        document.getElementById("formType").value;

    const id =
        document.getElementById("formId")
        .value.trim();

    const name =
        document.getElementById("formName")
        .value.trim();

    const phone =
        document.getElementById("formPhone")
        .value.trim();

    const status =
        document.getElementById("formStatus").value;


    if(!id || !name || !phone){

        showMessage(
            "সব তথ্য পূরণ করুন।",
            "error"
        );

        return;
    }


    let agents = getAgents();


    /* EDIT */

    if(editingId !== null){

        const index =
            agents.findIndex(
                agent => agent.id === editingId
            );


        if(index !== -1){

            agents[index] = {
                id:id,
                name:name,
                phone:phone,
                type:type,
                status:status
            };

        }

        editingId = null;

        document.getElementById("formTitle")
            .textContent =
            "নতুন Agent যোগ করুন";

        document.getElementById("saveAgentBtn")
            .innerHTML =
            '<i class="fa-solid fa-plus"></i> Agent Save';

        document.getElementById("cancelEditBtn")
            .style.display = "none";

    }

    /* ADD */

    else{

        const exists =
            agents.some(agent => agent.id === id);

        if(exists){

            showMessage(
                "এই Agent ID ইতোমধ্যে আছে।",
                "error"
            );

            return;
        }


        agents.push({

            id:id,
            name:name,
            phone:phone,
            type:type,
            status:status

        });

    }


    saveAgents(agents);

    clearForm();

    renderAdminAgents();

    showMessage(
        "Agent সফলভাবে Save হয়েছে।",
        "success"
    );

}


/* =========================================
   RENDER ADMIN AGENTS
========================================= */

function renderAdminAgents(){

    const container =
        document.getElementById("adminAgentList");

    const agents = getAgents();


    if(agents.length === 0){

        container.innerHTML = `
            <div class="empty">
                এখনো কোনো Agent যোগ করা হয়নি।
            </div>
        `;

        return;
    }


    container.innerHTML =
        agents.map(agent => `

        <div class="agent-admin-card">

            <h3>
                ${escapeHTML(agent.name)}
            </h3>

            <div class="agent-admin-info">

                <div>
                    <strong>Agent ID:</strong>
                    ${escapeHTML(agent.id)}
                </div>

                <div>
                    <strong>Type:</strong>
                    ${getTypeName(agent.type)}
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


            <div class="admin-actions">

                <button
                    class="admin-btn edit"
                    onclick="editAgent('${encodeURIComponent(agent.id)}')">

                    <i class="fa-solid fa-pen"></i>
                    Edit

                </button>


                <button
                    class="admin-btn delete"
                    onclick="deleteAgent('${encodeURIComponent(agent.id)}')">

                    <i class="fa-solid fa-trash"></i>
                    Delete

                </button>

            </div>

        </div>

    `).join("");

}


/* =========================================
   EDIT
========================================= */

function editAgent(encodedId){

    const id = decodeURIComponent(encodedId);

    const agents = getAgents();

    const agent =
        agents.find(a => a.id === id);


    if(!agent) return;


    document.getElementById("formType").value =
        agent.type;

    document.getElementById("formId").value =
        agent.id;

    document.getElementById("formName").value =
        agent.name;

    document.getElementById("formPhone").value =
        agent.phone;

    document.getElementById("formStatus").value =
        agent.status;


    editingId = agent.id;


    document.getElementById("formTitle")
        .textContent =
        "Agent Edit করুন";

    document.getElementById("saveAgentBtn")
        .innerHTML =
        '<i class="fa-solid fa-save"></i> Update Agent';

    document.getElementById("cancelEditBtn")
        .style.display = "inline-block";


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


/* =========================================
   CANCEL EDIT
========================================= */

document.getElementById("cancelEditBtn")
.addEventListener("click",()=>{

    editingId = null;

    clearForm();

    document.getElementById("formTitle")
        .textContent =
        "নতুন Agent যোগ করুন";

    document.getElementById("saveAgentBtn")
        .innerHTML =
        '<i class="fa-solid fa-plus"></i> Agent Save';

    document.getElementById("cancelEditBtn")
        .style.display = "none";

});


/* =========================================
   DELETE
========================================= */

function deleteAgent(encodedId){

    const id = decodeURIComponent(encodedId);


    if(!confirm(
        "আপনি কি এই Agent Delete করতে চান?"
    )){
        return;
    }


    let agents = getAgents();

    agents =
        agents.filter(agent => agent.id !== id);


    saveAgents(agents);

    renderAdminAgents();

    showMessage(
        "Agent Delete করা হয়েছে।",
        "success"
    );

}


/* =========================================
   DELETE ALL
========================================= */

document.getElementById("deleteAllBtn")
.addEventListener("click",()=>{

    const agents = getAgents();

    if(agents.length === 0){

        alert("Delete করার মতো কোনো Agent নেই।");

        return;
    }


    const confirmDelete =
        prompt(
            "সব Agent Delete করতে YES লিখুন:"
        );


    if(confirmDelete === "YES"){

        localStorage.removeItem(AGENT_KEY);

        renderAdminAgents();

        alert("সব Agent Delete হয়েছে।");

    }

});


/* =========================================
   CHANGE PIN
========================================= */

document.getElementById("changePinBtn")
.addEventListener("click",()=>{

    const newPin =
        document.getElementById("newPin")
        .value.trim();


    if(newPin.length < 4){

        alert(
            "PIN কমপক্ষে ৪ সংখ্যার হতে হবে।"
        );

        return;
    }


    localStorage.setItem(
        PIN_KEY,
        newPin
    );


    document.getElementById("newPin")
        .value = "";


    alert("নতুন PIN সফলভাবে সেট হয়েছে।");

});


/* =========================================
   BACKUP
========================================= */

document.getElementById("backupBtn")
.addEventListener("click",()=>{

    const data = {

        agents:getAgents(),

        backupDate:
            new Date().toISOString()

    };


    const blob =
        new Blob(
            [JSON.stringify(data,null,2)],
            {type:"application/json"}
        );


    const url =
        URL.createObjectURL(blob);


    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "velki-agent-backup.json";

    a.click();


    URL.revokeObjectURL(url);

});


/* =========================================
   RESTORE
========================================= */

document.getElementById("restoreBtn")
.addEventListener("click",()=>{

    document.getElementById("restoreFile")
        .click();

});


document.getElementById("restoreFile")
.addEventListener("change",(event)=>{

    const file =
        event.target.files[0];

    if(!file) return;


    const reader = new FileReader();


    reader.onload = function(e){

        try{

            const data =
                JSON.parse(e.target.result);


            if(!Array.isArray(data.agents)){

                alert(
                    "Backup file সঠিক নয়।"
                );

                return;
            }


            saveAgents(data.agents);

            renderAdminAgents();


            alert(
                "Backup সফলভাবে Restore হয়েছে।"
            );


        }catch(error){

            alert(
                "Backup file পড়া যায়নি।"
            );

        }

    };


    reader.readAsText(file);

});


/* =========================================
   LOGOUT
========================================= */

document.getElementById("logoutBtn")
.addEventListener("click",()=>{

    sessionStorage.removeItem(
        "velki_admin_logged"
    );

    location.reload();

});


/* =========================================
   CLEAR FORM
========================================= */

function clearForm(){

    document.getElementById("formId").value = "";

    document.getElementById("formName").value = "";

    document.getElementById("formPhone").value = "";

    document.getElementById("formStatus").value =
        "Active";

}


/* =========================================
   MESSAGE
========================================= */

function showMessage(text,type){

    const box =
        document.getElementById("adminMessage");

    box.textContent = text;

    box.className =
        "admin-message show";

    if(type === "error"){

        box.style.background = "#ffecec";
        box.style.color = "#b00000";

    }else{

        box.style.background = "#e9fff0";
        box.style.color = "#08752b";

    }


    setTimeout(()=>{

        box.classList.remove("show");

    },3000);

}


/* =========================================
   TYPE
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
   ESCAPE HTML
========================================= */

function escapeHTML(value){

    return String(value)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}
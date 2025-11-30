const loadFileInput = document.getElementById("loadFileInput");
const passwordsDiv = document.getElementById("passwordsDiv");
const deletePasswordsDiv = document.getElementById("deletePasswordsDiv");

let storedData = [];
let passwordData = [];

let currentPasswordDivToDelete = [{
    instance: null,
    index: null
}];




function createPassword() { ////////// CREATE PASSWORD SECTION //////////
    const newDiv = document.createElement("div");

    newDiv.className = "passwordDiv";
    newDiv.innerHTML = `
    <div class="passwordLabel" style="width: 25%;">Password Name:</div>
    <textarea maxlength="100" style="height: 85%; width: 25%; font-size: calc(1.3vw + 1.3vh);" id="passwordName" class="passwordInput"></textarea>


    <textarea maxlength="50" id="label1" class="passwordLabel">Password:</textarea>
    <textarea maxlength="100" id="content1" class="passwordInput"></textarea>

    <textarea maxlength="50" id="label2" class="passwordLabel">Username:</textarea>
    <textarea maxlength="100" id="content2" class="passwordInput"></textarea>

    <textarea maxlength="50" id="label3" class="passwordLabel">EMail:</textarea>
    <textarea maxlength="100" id="content3" class="passwordInput"></textarea>

    <textarea maxlength="50" id="label4" class="passwordLabel"></textarea>
    <textarea maxlength="100" id="content4" class="passwordInput"></textarea>


    <div class="passwordLabel" style="width: 25%;">Additional Notes:</div>
    <textarea maxlength="500" style="height: 85%; width: 25%;" id="additionalNotes" class="passwordInput"></textarea>

    <button onclick="showDeletePasswordDiv(this.parentElement)" class="passwordDeleteButton">DELETE</button>
    `;

    passwordData.push
    ({
        passwordName: newDiv.querySelector("#passwordName"),

        content1: newDiv.querySelector("#content1"),
        label1: newDiv.querySelector("#label1"),

        content2: newDiv.querySelector("#content2"),
        label2: newDiv.querySelector("#label2"),

        content3: newDiv.querySelector("#content3"),
        label3: newDiv.querySelector("#label3"),

        content4: newDiv.querySelector("#content4"),
        label4: newDiv.querySelector("#label4"),

        additionalNotes: newDiv.querySelector("#additionalNotes")
    });

    passwordsDiv.appendChild(newDiv);
}




function loadJSON() { ////////// JSON LOADING/SAVING SECTION //////////
    const file = loadFileInput.files[0];

    if (!file) return alert("Choose a file first");

    for (let i = 0; i < passwordData.length; i++) {
        passwordsDiv.firstChild.remove();
    }


    passwordData = []

    const reader = new FileReader();

    reader.onload = rFile => {
        try {
            storedData = JSON.parse(rFile.target.result);


            for (let i = 0; i < storedData.length; i++) {
                createPassword();

                passwordData[i].passwordName.value = storedData[i].passwordName;

                passwordData[i].content1.value = storedData[i].content1;
                passwordData[i].label1.value = storedData[i].label1;

                passwordData[i].content2.value = storedData[i].content2;
                passwordData[i].label2.value = storedData[i].label2;

                passwordData[i].content3.value = storedData[i].content3;
                passwordData[i].label3.value = storedData[i].label3;

                passwordData[i].content4.value = storedData[i].content4;
                passwordData[i].label4.value = storedData[i].label4;

                passwordData[i].additionalNotes.value = storedData[i].additionalNotes;
            }

        } catch {
            alert("Invalid JSON file");
        }
    }

    reader.readAsText(file);

    loadFileInput.value = "";
}


async function saveJSON() {
    storedData = [];

    for (let i = 0; i < passwordData.length; i++) {
        storedData.push({
            passwordName: passwordData[i].passwordName.value,

            content1: passwordData[i].content1.value,
            label1: passwordData[i].label1.value,

            content2: passwordData[i].content2.value,
            label2: passwordData[i].label2.value,

            content3: passwordData[i].content3.value,
            label3: passwordData[i].label3.value,

            content4: passwordData[i].content4.value,
            label4: passwordData[i].label4.value,

            additionalNotes: passwordData[i].additionalNotes.value
        });
    }

    const blob = new Blob(
        [JSON.stringify(storedData)], 
        { type: "application/json" }
    );

    if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
            suggestedName: "save.json",
            types: [
                {
                    description: "JSON Files",
                    accept: { "application/json": [".json"] }
                }
            ]
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

    } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "save.json";
        a.click();
        URL.revokeObjectURL(url);
    }
}




function searchBoxCheck(element) { ////////// SEARCHBOX SECTION //////////
    let elementValue = element.value.toLowerCase();

    for (let i = 0; i < passwordData.length; i++) {
        let passwordNameValue = passwordData[i].passwordName.value.toLowerCase();

        if (passwordNameValue.includes(elementValue) === true) {
            passwordData[i].passwordName.parentNode.style.display = "flex"
        } else {
            passwordData[i].passwordName.parentNode.style.display = "none"
        }
    }
}




function showDeletePasswordDiv(parentDiv) { ////////// PASSWORD DELETION SECTION //////////
    document.querySelector(".deletionInput").value = null;

    currentPasswordDivToDelete.instance = parentDiv;
    currentPasswordDivToDelete.index = Array.from(passwordsDiv.children).indexOf(parentDiv);


    if (passwordData[currentPasswordDivToDelete.index].passwordName.value === "") {
        deletePassword();
    } else {
        deletePasswordDiv.style.display = "block";
    }
}


function cancelDeletion() {
    deletePasswordDiv.style.display = "none";
}


function confirmDeletion() {
    const textbox = document.querySelector(".deletionInput");

    if (textbox.value === passwordData[currentPasswordDivToDelete.index].passwordName.value) {
        deletePassword();
    }
}


function deletePassword() {
    passwordData.splice(currentPasswordDivToDelete.index, 1);
    currentPasswordDivToDelete.instance.remove();

    deletePasswordDiv.style.display = "none";
}
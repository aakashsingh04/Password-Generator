const inputSlider = document.querySelector("[data-lengthSlider]");  //acccessing custom attributes 
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generate-password");
const indicator = document.querySelector("[data-indicator]");
const allCheckBox = document.querySelectorAll("input[type=checkbox] ");

const symbols = "~!@#$%^&*()_+{}[]<>?/";

let password = " ";
let passwordLength = 10;
let checkCount = 0;
//set default circle color to grey
setIndicator("#ccc");

function handleSlider() {         //used to reflect password length in UI
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const max = inputSlider.max;
    const min = inputSlider.min;
    inputSlider.style.backgroundSize = (passwordLength - min)*100/(max - min) + "% 100%" 
}

handleSlider();

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';
}

function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;  //floor function approximate number
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97,123));  //String.fromCharCode function convert ASCII value to the character
    //ASCII value of a=93, z=123
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    } 
    else if((hasUpper || hasLower) && (hasNum || hasSym) &&  passwordLength >= 5) {
        setIndicator("#ff0");
    } 
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);   //This function used to  copy text to clipboard
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


//Very Important
function shufflePassword(array) {
    //Fisheer Yates Method
    for(let i = array.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
})


inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener("click", () => {
    //none of the checke=box are selected
    if(checkCount === 0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Starting the journey");
    password = "";

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }

    let funArr = [];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funArr.push(generateSymbols);
    }

    //Compulsory Addition
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }
    console.log("Compulsory Addition done");
    
    //remaining addition
    for(let i=0; i<passwordLength-funArr.length; i++){
        let randIndex = getRndInteger(0, funArr.length);
        console.log("randomIndex", randIndex);
        password += funArr[randIndex]();
    }
    console.log("Remaining Addition done");

    //shuffle password
    password = shufflePassword(Array.from(password));
    console.log("shuffle password done");
    //show password
    passwordDisplay.value = password;
    console.log("password ready");
    //calculate strength
    calcStrength();

});








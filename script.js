const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]"); 
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!#$%^&*~`:";><?|/';

// initial default conditions
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength color to grey
setIndicator("#ccc");

//set passwordlength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength -  min)*100 / (max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;   //Math.random ka answer 0-1 me aata hai
                                //Math.random()*(max-min) se answer 0-(max-min) me aata hai
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum  = getRndInteger(0, symbols.length); 
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    let hasNum = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolsCheck.checked) hasSym = true;
    if(numbersCheck.checked) hasNum = true;

    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }else if(( hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6 ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){   //async function as copyContent asynchronous hai, or async use karne par hi hum await ka use kr payege, jab tk copy nhi hoyega hum aage nahi badege
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);  //navigator wala method clipboard par copy kar raha hai or promise return karta hai
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";   
    }

    //to make copy wala span visible 
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array){
        // Fisher yates method
        for(let i = array.length - 1; i>0; i--){
            //
            const j = Math.floor(Math.random() * (i+1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    
        let str = "";
        array.forEach( (el) => (str+=el) );
        return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
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
        checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', function(){
    if(passwordDisplay.value){ 
        copyContent();
    }
})

generateBtn.addEventListener('click', ()=>{

    //none of the checkbox are selected
    if(checkCount == 0) return;

    if(passwordLength<checkCount) 
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // lets start the new journey to generate password
    console.log(" Starting the journey");
    // remove old password
    password = "";

    // lets put the stuff mentioned by the checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("compulsory addition done");

    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done");

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");

    // show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    // calculate strength
    calcStrength();

}); 







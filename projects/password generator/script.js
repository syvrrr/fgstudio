const result = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercase = document.getElementById('uppercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const generate = document.getElementById('generate');
const clipboard = document.getElementById('clipboard');
const strengthMeter = document.querySelector('.strength-meter-fill');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

clipboard.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = result.innerText;

    if (!password) return;

    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    
    clipboard.textContent = 'copied!';
    setTimeout(() => {
        clipboard.textContent = 'copy';
    }, 2000);
});

generate.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasUpper = uppercase.checked;
    const hasNumber = numbers.checked;
    const hasSymbol = symbols.checked;

    result.innerText = generatePass(length, hasUpper, hasNumber, hasSymbol);
    updateStrengthMeter(length, hasUpper, hasNumber, hasSymbol);
});

function generatePass(length, hasUpper, hasNumber, hasSymbol) {
    let generatedPassword = '';
    const typesArr = [{ lower: true }];
    
    if (hasUpper) typesArr.push({ upper: true });
    if (hasNumber) typesArr.push({ number: true });
    if (hasSymbol) typesArr.push({ symbol: true });
    
    if (typesArr.length === 0) {
        return '';
    }

    for (let i = 0; i < typesArr.length; i++) {
        const funcName = Object.keys(typesArr[i])[0];
        generatedPassword += randomFunc[funcName]();
    }

    for (let i = generatedPassword.length; i < length; i++) {
        const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
        const funcName = Object.keys(randomType)[0];

        generatedPassword += randomFunc[funcName]();
    }

    generatedPassword = generatedPassword
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return generatedPassword;
}

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateStrengthMeter(length, hasUpper, hasNumber, hasSymbol) {
    let strength = 0;
    
    strength += Math.min(length / 20, 1) * 50;
    
    const typeCount = 1 + hasUpper + hasNumber + hasSymbol;
    strength += (typeCount / 4) * 50;

    strengthMeter.style.width = strength + '%';
    
    if (strength < 40) {
        strengthMeter.style.background = '#ef4444';
    }
    else if (strength < 70) {
        strengthMeter.style.background = '#eab308';
    }
    else {
        strengthMeter.style.background = '#22c55e';
    }
}

generate.click();
document.getElementById("generate").addEventListener( "click", () => {
    const min_length = parseInt(document.getElementById("minLength").value); //parseInt zamienia nam stringa na Inta 
    const max_length = parseInt(document.getElementById("maxLength").value);
    const upper_case = document.getElementById("uppercase").checked;
    const include_numbers = document.getElementById("numbers").checked;
    const use_special_chars = document.getElementById("specialChars").checked;
    // isNaN - Not-a-Number
    if (isNaN(min_length) || isNaN(max_length) || min_length < 1 || max_length < 1 || min_length > max_length) {
		alert("Podaj poprawny zakres długości hasła!");
		return;
	}
    const password = generatePassword(min_length,max_length,upper_case,include_numbers,use_special_chars)
    // The alert() method displays an alert box with a message and an OK button.
    alert("Twoje wygenerowane hasło: " + " " + password +  "     Stay safe :)")

})

function generatePassword(min_length,max_length,upper_case,include_numbers,use_special_chars) {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (upper_case) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if (include_numbers) charset += "0123456789";
	if (use_special_chars) charset += "-_=+[]{}|;:',.<>?/`~!@#$%^&*()";
    const password_length = Math.floor(Math.random() * (max_length - min_length + 1)) + min_length;
    let password = ""
    for(let i = 0; i < password_length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];

    }
    return password
}


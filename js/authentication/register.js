var strength = {
    0: "Worst",
    1: "Bad",
    2: "Weak",
    3: "Good",
    4: "Strong"
  }
var password = document.getElementById('inputPassword');
var confirmPassword = document.getElementById('confirmPassword');
var meter = document.getElementById('password-strength-meter');
var text = document.getElementById('password-strength-text');
var meterConfirm = document.getElementById('confirmPassword-strength-meter');
var textConfirm = document.getElementById('confirmPassword-strength-text');
password.addEventListener('input', function() {
  var val = password.value;
  var result = zxcvbn(val);

  // Update the password strength meter
  meter.value = result.score;

  // Update the text indicator
  if (val !== "") {
    text.innerHTML = "Strength: " + strength[result.score]; 
  } else {
    text.innerHTML = "";
  }
});
confirmPassword.addEventListener('input', function() {
    var val = confirmPassword.value;
    var result = zxcvbn(val);
  
    // Update the password strength meter
    meterConfirm.value = result.score;
  
    // Update the text indicator
    if (val !== "") {
      textConfirm.innerHTML = "Strength: " + strength[result.score]; 
    } else {
      textConfirm.innerHTML = "";
    }
  });
  function submitForm()
  {
    var password = document.getElementById('inputPassword');
    var confirmPassword = document.getElementById('confirmPassword');
    var textConfirm = document.getElementById('confirmPassword-strength-text');
    
    var val = password.value;
    var result = zxcvbn(val); 

    if(password.value !== confirmPassword.value)
    {
        
        textConfirm.innerHTML = "Passwords should be same";
        return false;
    }
    else if(result.score <=2)
    {
       
        return false;
    }
    return true;
  }
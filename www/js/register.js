firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Uzytkownik zalogowany.

    document.getElementById("alreadysigned_div").style.display = "block";
    document.getElementById("signup_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Witaj : " + email_id;

    }

  } else {
    // Niezalogowany.

    document.getElementById("alreadysigned_div").style.display = "none";
    document.getElementById("signup_div").style.display = "block";

  }
});



function register(){
	
	
	var registerEmail = document.getElementById("email_register").value;
	var registerPass = document.getElementById("password_register").value;
	
firebase.auth().createUserWithEmailAndPassword(registerEmail, registerPass).catch(function(error) {
  // Errors.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  
  window.alert("Error : " + errorMessage);
  
  
  
});
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("alreadysigned_div").style.display = "block";
    document.getElementById("signup_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

    }

  } else {
    // No user is signed in.

    document.getElementById("alreadysigned_div").style.display = "none";
    document.getElementById("signup_div").style.display = "block";

  }
});



function register(){
	
	
	var registerEmail = document.getElementById("email_register").value;
	var registerPass = document.getElementById("password_register").value;
	
firebase.auth().createUserWithEmailAndPassword(registerEmail, registerPass).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  
  window.alert("Error : " + errorMessage);
  
  
  
});
}

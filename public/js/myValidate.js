console.log("validate works");

$("#form-login").validate({
  rules:{
    "login-email": {
      required: true
    },
    "login-password":{
      required: true
    } 
  },
  messages: {
    "login-email":{
      required: "Email is required."
    },
    "login-password":{
      required: "Password is required."
    }
  }
});

$("#formSignUp").validate({
  rules:{
    signUpEmail: {
      required: true
    },
    signUpUsername:{
      required: true
    },
    signUpPassword:{
      required: true
    },
    signUpPassword2:{
      required: true,
      equalTo: "#signUpPassword"
    } 
  },
  messages: {
    signUpUsername:{
      required: "Username is required."
    },
    signUpEmail:{
      required: "Email is required."
    },
    signUpPassword:{
      required: "Password is required."
    },
    signUpPassword2:{
      required: "Password needs to match."
    }
  }
});

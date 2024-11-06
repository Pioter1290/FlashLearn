function Validation(values) {
    let error = {};
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  
    if (values.email === "") {
      error.email = "Email should not be empty!";
    }else {
      error.email = "";
    }
  
    if (values.password === "") {
      error.password = "Password should not be empty!";
    }  else {
      error.password = "";
    }
  
    return error;
  }
  
  export default Validation;
  
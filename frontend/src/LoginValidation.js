function Validation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.email === ""){
        error.email = "Email should not be empty."
    }else if(!email_pattern.test(values.email)){
        error.email = "Email is Incorrect."
    }else{
        error.email = ""
    }

    if(values.password === ""){
        error.password = "Password should not be empty"
    }else if(!password_pattern.test(values.password)){
        error.password = "Password should be eight chracters long, have one capital letter, one number, and one lowercase letter."
    }else{
        error.password = ""
    }

    return error;
}

export default Validation;
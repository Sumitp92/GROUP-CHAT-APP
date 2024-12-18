document.getElementById('signupform')?.addEventListener('submit' , async(e) =>{
    e.preventDefault();

    const name = document.getElementById('name')?.value ;
    const email = document.getElementById('email').value ; 
    const phone = document.getElementById('phone').value ; 
    const password = document.getElementById('password').value ; 
    
    if(!name || !email || !phone || !password){
        alert('All Field Are Require') ; 
        return;
    }
    try{
        const response = await axios.post('http://localhost:3000/api/signup' , {name , email , phone , password });

        if(response.data.success){
            alert('Signup Succesfull');
            window.location.href = 'login.html';
        }
        else{
            response.data.message ; 
        }
    }
    catch(err){
        console.log('Error During Signup' , err);
        alert('Signup Failed') ; 
    }
});

document.getElementById('loginform')?.addEventListener('submit' , async(e) =>{
    e.preventDefault() ; 

    const email = document.getElementById('email').value ; 
    const password = document.getElementById('password').value ; 

    if(!email || !password){
        alert('User Not Found')
    }

    try{
    const response = await axios.post('http://localhost:3000/api/login' , {email , password}) ; 

    if(response.data.success){
        alert("User Login Successfully");
    }
    else{
        response.data.message ; 
    }
}
    catch(err){
         console.log("Error in Login",err) ; 
         alert('User Login Failed') ; 
    }
}); 


// Switch to Signup page from Login page
document.getElementById('newUserBtn')?.addEventListener('click', () => {
    window.location.href = 'signup.html';
});

// Switch to Login page from Signup page
document.getElementById('loginBtn')?.addEventListener('click', () => {
    window.location.href = 'login.html';
});
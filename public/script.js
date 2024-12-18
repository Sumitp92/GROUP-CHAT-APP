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
const resetPassForm = document.querySelector('#resetPassForm');
resetPassForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#emailRecuperacion').value;
    if(email != ""){
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            alert('Se ha enviado el correo.');
        }).catch((error) =>{
            console.log(error.message);
        });
    }else{
        document.querySelector('#mensaje').style.display='block';
    }
    console.log(email);
});
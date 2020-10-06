
const signinForm = document.querySelector('#signin');



signinForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const email= document.querySelector('#email').value;
    const pass = document.querySelector('#pass').value;
    firebase.auth()
        .signInWithEmailAndPassword(email, pass)
        .then(({user}) => {
            return user.getIdToken().then((idToken) => {
                const email = user.email;
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({idToken, email}),    
                });
            });
        })
        .then(() => {
            return firebase.auth().signOut();
        })
        .then(() => {
            window.location.assign("/inicio");
        })
        .catch((error) => {
            document.querySelector('#input-botton').style.display='25px 20px 5px 20x';
            document.querySelector('#boton').style.margin='0 20px 12px 20px';
            document.querySelector('#mensaje').style.display='block';
            console.log(error);
        });
    
    return false;
});
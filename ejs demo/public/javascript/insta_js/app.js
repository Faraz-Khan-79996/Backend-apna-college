const btns = document.querySelectorAll('button')

for(const button of btns){
    button.addEventListener('click' , ()=>{
        console.log("button was clicked");
    })
}
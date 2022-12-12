const navbar = document.querySelector('.navbar');
const navbarToggle = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
navbar.addEventListener('click',function (e) {
    if(e.target.classList.contains('nav-link')){
        if(!navbarToggle.classList.contains('collapsed')){
            navbarToggle.classList.remove('collapsed');
            navbarCollapse.classList.remove('show');
        }
    }
})
// Reveal Animation on Scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Initial reveal on load
document.addEventListener("DOMContentLoaded", reveal);

// Web3Forms AJAX Submission
const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    result.innerHTML = "Enviando...";

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            result.innerHTML = "Mensagem enviada com sucesso! Entraremos em contato em breve.";
            result.style.color = "#E3C053";
            form.reset();
        } else {
            console.log(response);
            result.innerHTML = json.message;
            result.style.color = "red";
        }
    })
    .catch(error => {
        console.log(error);
        result.innerHTML = "Algo deu errado! Tente novamente mais tarde.";
        result.style.color = "red";
    })
    .then(function() {
        setTimeout(() => {
            result.innerHTML = "";
        }, 5000);
    });
});

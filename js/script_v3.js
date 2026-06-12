/**
 * DEV ALBK - Formulário de Contato com Web3Forms
 * v3.0 - Com Redirecionamento Automático para WhatsApp (Notificação Direta)
 */

// ===== CONFIGURAÇÃO DO SEU WHATSAPP =====
const SEU_NUMERO_WHATSAPP = "5581992493400"; // Seu número no formato internacional

// ===== REVEAL ANIMATION ON SCROLL =====
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
document.addEventListener("DOMContentLoaded", reveal);

// ===== WHATSAPP FORMATTING (INPUT) =====
function formatWhatsApp(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        if (value.length <= 2) {
            value = value;
        } else if (value.length <= 7) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }
    }
    input.value = value;
}

// ===== WEB3FORMS SUBMISSION & REDIRECT =====
const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar campos obrigatórios
    const requiredFields = ['name', 'email', 'whatsapp', 'company', 'service', 'budget', 'marketing_invested', 'best_time', 'message'];
    let isValid = true;
    
    for (let field of requiredFields) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            input.style.borderColor = '#FF6B6B';
            isValid = false;
        } else {
            input.style.borderColor = '#444';
        }
    }
    
    if (!isValid) {
        result.innerHTML = "⚠️ Por favor, preencha todos os campos obrigatórios!";
        result.className = "form-status error";
        return;
    }
    
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    result.innerHTML = "📤 Enviando dados e preparando notificação...";
    result.className = "form-status";

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status == 200) {
            result.innerHTML = "✅ Lead registrado! Abrindo WhatsApp para notificação...";
            result.className = "form-status success";
            
            // --- LÓGICA DE REDIRECIONAMENTO PARA O SEU WHATSAPP ---
            const mensagem = encodeURIComponent(
                `🚀 *NOVO LEAD - DEV ALBK*\n\n` +
                `👤 *Nome:* ${object.name}\n` +
                `🏢 *Empresa:* ${object.company}\n` +
                `📱 *WhatsApp:* ${object.whatsapp}\n` +
                `📧 *Email:* ${object.email}\n` +
                `🛠️ *Serviço:* ${object.service}\n` +
                `💰 *Orçamento:* ${object.budget}\n` +
                `📈 *Já investiu:* ${object.marketing_invested}\n` +
                `🕒 *Melhor horário:* ${object.best_time}\n` +
                `📝 *Detalhes:* ${object.message}`
            );

            const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${mensagem}`;
            
            // Pequeno delay para o usuário ver a mensagem de sucesso antes de abrir o zap
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                form.reset();
            }, 2000);

        } else {
            result.innerHTML = "❌ " + (jsonResponse.message || "Erro ao enviar.");
            result.className = "form-status error";
        }
    })
    .catch(error => {
        console.log(error);
        result.innerHTML = "❌ Erro de conexão. Tente novamente.";
        result.className = "form-status error";
    });
});

// Inicializar formatação de WhatsApp
let scrollIndicator;
document.addEventListener('DOMContentLoaded', function() {
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function() {
            formatWhatsApp(this);
        });
    }

    scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.classList.remove('visible', 'pulse');
    }

    reveal();

    setTimeout(() => {
        if (window.scrollY < 50) showIndicator();
    }, 2000);
});
/**
 * Lógica do Indicador de Scroll Inteligente
 */
let scrollTimeout;
let idleInterval;

// Função para mostrar o indicador
function showIndicator() {
    if (!scrollIndicator) return;
    if (window.scrollY < 50) { // Só mostra se estiver no topo da página
        scrollIndicator.classList.add('visible', 'pulse');
    }
}

// Função para esconder o indicador
function hideIndicator() {
    if (!scrollIndicator) return;
    scrollIndicator.classList.remove('visible', 'pulse');
}

// Lógica de tempo
function resetIdleTimer() {
    hideIndicator();
    clearTimeout(scrollTimeout);
    clearInterval(idleInterval);

    // Se o usuário parar no topo, agenda para mostrar após 10 segundos
    if (window.scrollY < 50) {
        scrollTimeout = setTimeout(() => {
            showIndicator();
        }, 10000); // 10 segundos de inatividade
    }
}

// Eventos
window.addEventListener('scroll', resetIdleTimer);
window.addEventListener('mousemove', resetIdleTimer);
window.addEventListener('touchstart', resetIdleTimer);
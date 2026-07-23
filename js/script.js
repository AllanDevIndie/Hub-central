const botaoTema = document.querySelector('.botao-tema');
const logo = document.querySelector('.logo');
const fotoPerfil = document.querySelector('.foto-perfil');

// Configurações de Ativos
const ASSETS = {
    dark: {
        logo: 'assets/logo.png',
        foto: 'assets/perfil01.jpg'
    },
    light: {
        logo: 'assets/logo2.png',
        foto: 'assets/perfil04.jpg'
    }
};

// Função para aplicar o tema
function aplicarTema(tema, comTransicao = true) {
    const isLight = tema === 'light';
    
    // Aplica a classe no HTML
    if (isLight) {
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
    }

    // Atualiza Ativos com transição
    if (comTransicao) {
        if (fotoPerfil) {
            fotoPerfil.style.opacity = '0';
        }

        setTimeout(() => {
            if (logo) {
                logo.src = isLight ? ASSETS.light.logo : ASSETS.dark.logo;
            }
            if (fotoPerfil) {
                fotoPerfil.src = isLight ? ASSETS.light.foto : ASSETS.dark.foto;
                fotoPerfil.style.opacity = '1';
            }
        }, 200);
    } else {
        if (logo) {
            logo.src = isLight ? ASSETS.light.logo : ASSETS.dark.logo;
        }
        if (fotoPerfil) {
            fotoPerfil.src = isLight ? ASSETS.light.foto : ASSETS.dark.foto;
        }
    }

    // Salva preferência
    localStorage.setItem('tema', tema);
    
    // Atualiza Acessibilidade
    if (botaoTema) {
        botaoTema.setAttribute('aria-label', isLight ? 'Alternar para modo escuro' : 'Alternar para modo claro');
    }
}

// Verifica tema salvo ou preferência do sistema
const temaSalvo = localStorage.getItem('tema');
const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (temaSalvo) {
    aplicarTema(temaSalvo, false);
} else if (!prefereDark) {
    aplicarTema('light', false);
}

// Evento de Clique
botaoTema.addEventListener('click', () => {
    const novoTema = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    aplicarTema(novoTema);
});

// Adiciona animação de entrada nos cards
const cards = document.querySelectorAll('.opcoes');
cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 400 + (index * 100));
});

// Anima imagens conforme o usuário rola a página
const elementosScroll = document.querySelectorAll('.animar-scroll');
let scrollAnimacaoPendente = false;

function limitarValor(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

function animarElementosNoScroll() {
    elementosScroll.forEach((elemento) => {
        const posicao = elemento.getBoundingClientRect();
        const inicio = window.innerHeight;
        const fim = window.innerHeight * 0.35;
        const progresso = limitarValor((inicio - posicao.top) / (inicio - fim), 0, 1);
        const deslocamento = 90 - (progresso * 90);

        elemento.style.opacity = progresso;
        elemento.style.transform = `translateY(${deslocamento}px)`;
    });

    scrollAnimacaoPendente = false;
}

function solicitarAnimacaoScroll() {
    if (!scrollAnimacaoPendente) {
        requestAnimationFrame(animarElementosNoScroll);
        scrollAnimacaoPendente = true;
    }
}

if (elementosScroll.length > 0) {
    animarElementosNoScroll();
    window.addEventListener('scroll', solicitarAnimacaoScroll);
    window.addEventListener('resize', solicitarAnimacaoScroll);
}

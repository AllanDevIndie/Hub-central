const botaoTema = document.querySelector('.botao-tema');
const logo = document.querySelector('.logo');
const fotoPerfil = document.querySelector('.foto-perfil');
const temaSalvo = localStorage.getItem('tema');
const logoDark = 'assets/logo.png';
const logoLight = 'assets/logo2.png';
const fotoDark = 'assets/perfil01.jpg';
const fotoLight = 'assets/perfil04.jpg';

function atualizarLogo(modoClaroAtivo) {
    logo.setAttribute('src', modoClaroAtivo ? logoLight : logoDark);
}

function atualizarFotoPerfil(modoClaroAtivo, comTransicao = true) {
    const novaFoto = modoClaroAtivo ? fotoLight : fotoDark;

    if (fotoPerfil.getAttribute('src') === novaFoto) {
        return;
    }

    if (!comTransicao) {
        fotoPerfil.setAttribute('src', novaFoto);
        return;
    }

    fotoPerfil.classList.add('trocando');

    setTimeout(() => {
        fotoPerfil.setAttribute('src', novaFoto);
        fotoPerfil.classList.remove('trocando');
    }, 300);
}

if (temaSalvo === 'light') {
    document.documentElement.classList.add('light');
    botaoTema.setAttribute('aria-label', 'Alternar para modo escuro');
    atualizarLogo(true);
    atualizarFotoPerfil(true, false);
}

botaoTema.addEventListener('click', () => {
    const modoClaroAtivo = document.documentElement.classList.toggle('light');

    localStorage.setItem('tema', modoClaroAtivo ? 'light' : 'dark');
    atualizarLogo(modoClaroAtivo);
    atualizarFotoPerfil(modoClaroAtivo);
    botaoTema.setAttribute(
        'aria-label',
        modoClaroAtivo ? 'Alternar para modo escuro' : 'Alternar para modo claro'
    );
});

let imagemBase64 = null;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const fotoPreview = document.getElementById('foto-preview');
const btnTirarFoto = document.getElementById('btn-tirar-foto');
const btnBater = document.getElementById('btn-bater');

// Iniciar a câmara automaticamente ao abrir a página
async function iniciarCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        video.style.display = 'block';
        fotoPreview.style.display = 'none';
        btnTirarFoto.innerText = 'Tirar Selfie';
    } catch (err) {
        alert('Erro ao acessar a câmera. Certifique-se de permitir o acesso nas configurações do navegador.');
    }
}

function tirarFoto() {
    if (!video.srcObject) {
        iniciarCamera();
        return;
    }
    
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converte para Base64 compactado em JPEG
    imagemBase64 = canvas.toDataURL('image/jpeg', 0.7);
    
    fotoPreview.src = imagemBase64;
    fotoPreview.style.display = 'block';
    video.style.display = 'none';
    
    btnTirarFoto.innerText = 'Tirar Outra Foto';
    
    // Habilita o botão de bater ponto
    btnBater.disabled = false;
    btnBater.style.opacity = '1';
    btnBater.style.cursor = 'pointer';
}

async function baterPonto() {
    const matricula = document.getElementById('matricula').value.trim();
    const mensagemEl = document.getElementById('mensagem');

    if (!matricula) {
        mensagemEl.className = 'erro';
        mensagemEl.innerText = 'Por favor, digite seu nome.';
        return;
    }

    if (!imagemBase64) {
        mensagemEl.className = 'erro';
        mensagemEl.innerText = 'Você precisa tirar uma selfie antes de bater o ponto!';
        return;
    }

    mensagemEl.className = '';
    mensagemEl.innerText = 'Registrando...';

    try {
        const resposta = await fetch('https://bate-ponto-server.onrender.com/api/ponto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: matricula, selfie: imagemBase64 })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagemEl.className = 'sucesso';
            mensagemEl.innerText = dados.mensagem || 'Ponto batido com sucesso!';
            document.getElementById('matricula').value = '';
            fotoPreview.style.display = 'none';
            imagemBase64 = null;
            btnBater.disabled = true;
            btnBater.style.opacity = '0.6';
            btnBater.style.cursor = 'not-allowed';
            iniciarCamera(); // Reinicia a câmera para o próximo registro
        } else {
            mensagemEl.className = 'erro';
            mensagemEl.innerText = dados.erro || 'Erro ao registrar ponto.';
        }
    } catch (error) {
        mensagemEl.className = 'erro';
        mensagemEl.innerText = 'Não foi possível conectar ao servidor.';
    }
}

// Inicia a câmera assim que a página carrega
window.onload = iniciarCamera;
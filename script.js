async function baterPonto() {
    const matricula = document.getElementById('matricula').value.trim();
    const mensagemEl = document.getElementById('mensagem');

    if (!matricula) {
        mensagemEl.className = 'erro';
        mensagemEl.innerText = 'Por favor, digite sua identificação.';
        return;
    }

    mensagemEl.className = '';
    mensagemEl.innerText = 'Registrando...';

    try {
        // ATENÇÃO: Troque pelo endereço do seu backend quando ele estiver rodando
        JavaScript

        const resposta = await fetch("https://bate-ponto-server.onrender.com/api/ponto", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: matricula }) // Aqui está o segredo: envia a chave 'nome'
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagemEl.className = 'sucesso';
            mensagemEl.innerText = dados.mensagem || 'Ponto batido com sucesso!';
            document.getElementById('matricula').value = '';
        } else {
            mensagemEl.className = 'erro';
            mensagemEl.innerText = dados.erro || 'Erro ao registrar ponto.';
        }
    } catch (error) {
        mensagemEl.className = 'erro';
        mensagemEl.innerText = 'Não foi possível conectar ao servidor.';
    }
}

/* =====================================
   CONFIGURAÇÕES DO LOCALSTORAGE
===================================== */

const CHAVE_MENSAGENS = "portfolio_mensagens";


/* =====================================
   CRIAÇÃO DOS DADOS DE TESTE
===================================== */

function criarMensagensDeTeste() {

    const exemplos = [
        ["Ana Silva", "ana@email.com", "Gostei muito do seu portfólio!"],
        ["Lucas Santos", "lucas@email.com", "Quais tecnologias você está estudando?"],
        ["Mariana Costa", "mariana@email.com", "Parabéns pelos seus projetos!"],
        ["Pedro Oliveira", "pedro@email.com", "Gostaria de conhecer mais sobre seu trabalho."],
        ["Julia Almeida", "julia@email.com", "Muito interessante seu projeto de Java."],
        ["Gabriel Souza", "gabriel@email.com", "Você pretende trabalhar com Front-end?"],
        ["Beatriz Lima", "beatriz@email.com", "Gostei da organização do seu site."],
        ["Rafael Ferreira", "rafael@email.com", "Seu projeto de agendamento parece interessante."],
        ["Camila Rodrigues", "camila@email.com", "Parabéns pela apresentação!"],
        ["Matheus Pereira", "matheus@email.com", "Você tem algum projeto com JavaScript?"],
        ["Larissa Gomes", "larissa@email.com", "Gostei bastante do design."],
        ["Felipe Martins", "felipe@email.com", "Como você começou a estudar programação?"],
        ["Isabela Rocha", "isabela@email.com", "Seu portfólio está muito bom."],
        ["Bruno Carvalho", "bruno@email.com", "Gostaria de conversar sobre desenvolvimento web."],
        ["Amanda Ribeiro", "amanda@email.com", "Muito legal sua experiência no workshop."],
        ["Thiago Alves", "thiago@email.com", "Você trabalha com HTML e CSS?"],
        ["Manuela Dias", "manuela@email.com", "Gostei dos seus projetos."],
        ["João Mendes", "joao@email.com", "Parabéns pela evolução na programação!"],
        ["Sophia Nunes", "sophia@email.com", "Seu site funciona muito bem no celular."],
        ["Daniel Barros", "daniel@email.com", "Sucesso na sua carreira em tecnologia!"]
    ];

    return exemplos.map((exemplo, indice) => ({
        id: Date.now() + indice,
        nome: exemplo[0],
        email: exemplo[1],
        mensagem: exemplo[2],
        data: new Date().toLocaleString("pt-BR"),
        teste: true
    }));
}


/* =====================================
   INICIALIZAÇÃO DO LOCALSTORAGE
===================================== */

function inicializarMensagens() {

    const mensagensSalvas = localStorage.getItem(CHAVE_MENSAGENS);

    if (mensagensSalvas === null) {
        const mensagensTeste = criarMensagensDeTeste();

        localStorage.setItem(
            CHAVE_MENSAGENS,
            JSON.stringify(mensagensTeste)
        );
    }
}


/* =====================================
   BUSCAR MENSAGENS
===================================== */

function buscarMensagens() {

    const dados = localStorage.getItem(CHAVE_MENSAGENS);

    if (!dados) {
        return [];
    }

    try {
        const mensagens = JSON.parse(dados);

        return Array.isArray(mensagens) ? mensagens : [];

    } catch (erro) {
        console.error("Erro ao ler as mensagens:", erro);
        return [];
    }
}


/* =====================================
   SALVAR MENSAGENS
===================================== */

function salvarMensagens(mensagens) {

    localStorage.setItem(
        CHAVE_MENSAGENS,
        JSON.stringify(mensagens)
    );
}


/* =====================================
   FORMULÁRIO DE CONTATO
===================================== */

function configurarFormulario() {

    const formulario = document.getElementById("formContato");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        const status = document.getElementById("statusFormulario");

        if (!nome || !email || !mensagem) {
            status.textContent = "Preencha todos os campos.";
            status.style.color = "#F87171";
            return;
        }

        const novaMensagem = {
            id: Date.now(),
            nome: nome,
            email: email,
            mensagem: mensagem,
            data: new Date().toLocaleString("pt-BR"),
            teste: false
        };

        const mensagens = buscarMensagens();

        mensagens.push(novaMensagem);

        salvarMensagens(mensagens);

        status.textContent = "Mensagem salva com sucesso!";
        status.style.color = "#4ADE80";

        formulario.reset();

    });
}


/* =====================================
   PAINEL ADMINISTRATIVO
===================================== */

function configurarPainel() {

    const tabela = document.getElementById("listaMensagens");

    if (!tabela) {
        return;
    }

    const totalMensagens = document.getElementById("totalMensagens");
    const botaoExportar = document.getElementById("exportarJson");

    function atualizarTabela() {

        const mensagens = buscarMensagens();

        tabela.innerHTML = "";

        totalMensagens.textContent = mensagens.length;

        if (mensagens.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        Nenhuma mensagem encontrada.
                    </td>
                </tr>
            `;

            return;
        }

        mensagens.forEach(function (mensagem) {

            const linha = document.createElement("tr");

            const colunaNome = document.createElement("td");
            colunaNome.textContent = mensagem.nome;

            const colunaEmail = document.createElement("td");
            colunaEmail.textContent = mensagem.email;

            const colunaMensagem = document.createElement("td");
            colunaMensagem.textContent = mensagem.mensagem;

            const colunaData = document.createElement("td");
            colunaData.textContent = mensagem.data;

            const colunaAcoes = document.createElement("td");

            const botaoEditar = document.createElement("button");
            botaoEditar.textContent = "Editar";
            botaoEditar.className = "btn btn-sm btn-primary me-2";

            botaoEditar.addEventListener("click", function () {
                editarMensagem(mensagem.id);
            });

            const botaoExcluir = document.createElement("button");
            botaoExcluir.textContent = "Excluir";
            botaoExcluir.className = "btn btn-sm btn-danger";

            botaoExcluir.addEventListener("click", function () {
                excluirMensagem(mensagem.id);
            });

            colunaAcoes.appendChild(botaoEditar);
            colunaAcoes.appendChild(botaoExcluir);

            linha.appendChild(colunaNome);
            linha.appendChild(colunaEmail);
            linha.appendChild(colunaMensagem);
            linha.appendChild(colunaData);
            linha.appendChild(colunaAcoes);

            tabela.appendChild(linha);

        });

    }


    /* EDITAR MENSAGEM */

    function editarMensagem(id) {

        const mensagens = buscarMensagens();

        const mensagem = mensagens.find(function (item) {
            return item.id === id;
        });

        if (!mensagem) {
            return;
        }

        const novoNome = prompt("Digite o novo nome:", mensagem.nome);

        if (novoNome === null) {
            return;
        }

        const novoEmail = prompt("Digite o novo e-mail:", mensagem.email);

        if (novoEmail === null) {
            return;
        }

        const novoTexto = prompt("Digite a nova mensagem:", mensagem.mensagem);

        if (novoTexto === null) {
            return;
        }

        if (!novoNome.trim() || !novoEmail.trim() || !novoTexto.trim()) {
            alert("Os campos não podem ficar vazios.");
            return;
        }

        mensagem.nome = novoNome.trim();
        mensagem.email = novoEmail.trim();
        mensagem.mensagem = novoTexto.trim();

        salvarMensagens(mensagens);

        atualizarTabela();

        alert("Mensagem atualizada!");

    }


    /* EXCLUIR MENSAGEM */

    function excluirMensagem(id) {

        const confirmar = confirm(
            "Tem certeza que deseja excluir esta mensagem?"
        );

        if (!confirmar) {
            return;
        }

        const mensagensAtualizadas = buscarMensagens().filter(function (mensagem) {
            return mensagem.id !== id;
        });

        salvarMensagens(mensagensAtualizadas);

        atualizarTabela();

    }


    /* EXPORTAR JSON */

    botaoExportar.addEventListener("click", function () {

        const mensagens = buscarMensagens();

        const arquivo = new Blob(
            [JSON.stringify(mensagens, null, 4)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(arquivo);

        const link = document.createElement("a");

        link.href = url;
        link.download = "mensagens-portfolio.json";

        link.click();

        URL.revokeObjectURL(url);

    });


    atualizarTabela();

}


/* =====================================
   INICIALIZAÇÃO DO PROJETO
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    inicializarMensagens();

    configurarFormulario();

    configurarPainel();

});

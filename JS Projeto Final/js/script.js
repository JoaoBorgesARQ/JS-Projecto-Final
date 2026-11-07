// ========================================
// iGESTAR - Gestor de Tarefas Inteligente
// Utiliza arrays e objetos JavaScript (sem armazenamento permanente)
// ========================================


// ========================================
// 1. ELEMENTOS HTML
// ========================================

const formularioLogin = document.getElementById("loginForm");
const campoNomeUtilizador = document.getElementById("username");
const secaoLogin = document.getElementById("loginSection");
const secaoAplicacao = document.getElementById("appSection");
const mensagemBoasVindas = document.getElementById("welcomeMessage");
const mensagemLogin = document.getElementById("loginMessage");

const formularioTarefa = document.getElementById("taskForm");
const campoTituloTarefa = document.getElementById("taskTitle");
const campoDescricaoTarefa = document.getElementById("taskDescription");
const listaTarefas = document.getElementById("taskList");
const contadorTarefasAtivas = document.getElementById("activeCount");
const contadorTarefasConcluidas = document.getElementById("completedCount");

const botaoTema = document.getElementById("themeBtn");
const botaoSair = document.getElementById("logoutBtn");
const dataAtual = document.getElementById("currentDate");
const horaAtual = document.getElementById("currentTime");

const tituloFormulario = document.getElementById("formHeading");
const botaoGuardarTarefa = document.getElementById("saveTaskBtn");
const botaoCancelarEdicao = document.getElementById("cancelEditBtn");
const mensagemListaVazia = document.getElementById("emptyMessage");

const botaoConsultarFeriados = document.getElementById("holidaysBtn");
const listaFeriados = document.getElementById("holidaysList");
const mensagemFeriados = document.getElementById("holidaysMessage");

const campoDataTarefa = document.getElementById("taskDate");

// ========================================
// 2. VARIÁVEIS DA APLICAÇÃO
// ========================================

let utilizadores = [];
let tarefas = [];

let utilizadorAtual = null;

let tarefasDoUtilizador = [];

let filtroSelecionado = "all";

let idTarefaEmEdicao = null;


// ========================================

function mostrarMensagemLogin(message) {

    if (mensagemLogin) {
        mensagemLogin.textContent = message;
    }
}


// ========================================
// 3. ENTRAR NA APLICAÇÃO
// ========================================

if (formularioLogin) {

    formularioLogin.addEventListener("submit", function(event) {

        event.preventDefault();

        const nome = campoNomeUtilizador.value.trim();

        if (nome === "") {

            mostrarMensagemLogin(
                "Escreve o teu nome para continuar."
            );

            return;
        }

        // Procurar utilizador através do filtroSelecionado()
        const utilizadorEncontrado = utilizadores.filter(
            function(utilizador) {

                return utilizador.username.toLowerCase() ===
                       nome.toLowerCase();
            }
        );

        let utilizador = utilizadorEncontrado[0];

        // Criar utilizador se ainda não existir
        if (!utilizador) {

            utilizador = {
                id: Date.now(),
                username: nome
            };

            utilizadores.push(utilizador);

        }

        utilizadorAtual = utilizador;

        // Guardar o ID da sessão

        secaoLogin.hidden = true;
        secaoAplicacao.hidden = false;

        mensagemBoasVindas.textContent =
            "Olá, " + utilizadorAtual.username + "!";

        mostrarMensagemLogin("");

        carregarTarefas();

        mostrarTarefas();
    });
}


// ========================================
// 4. RECUPERAR A SESSÃO
// ========================================

function recuperarSessao() {

    // A aplicação começa sempre no ecrã de login.
    // Os arrays começam vazios quando a página é aberta.
    utilizadorAtual = null;
    tarefas = [];
    utilizadores = [];
    tarefasDoUtilizador = [];
}


// ========================================
// 5. CARREGAR TAREFAS DO UTILIZADOR
// ========================================

function carregarTarefas() {

    // Selecionar apenas as tarefas do utilizador atual
    tarefasDoUtilizador = tarefas.filter(
        function(tarefa) {

            return tarefa.userId === utilizadorAtual.id;
        }
    );
}
// ========================================
// 6. GUARDAR UMA TAREFA
// ========================================

function guardarTarefa(tarefa) {

    if (idTarefaEmEdicao === null) {

        // Criar uma nova tarefa
        const novaTarefa = {

            id: Date.now(),

            userId: utilizadorAtual.id,

            title: tarefa.title,

            description: tarefa.description,

            due_date: tarefa.due_date || null,

            completed: false
        };

        tarefas.push(novaTarefa);

    } else {

        // Editar uma tarefa existente
        tarefas = tarefas.map(function(elemento) {

            if (
                elemento.id === idTarefaEmEdicao &&
                elemento.userId === utilizadorAtual.id
            ) {

                elemento.title = tarefa.title;

                elemento.description = tarefa.description;

                elemento.due_date = tarefa.due_date || null;
            }

            return elemento;
        });
    }


    carregarTarefas();
}


// ========================================
// 7. ADICIONAR E EDITAR TAREFAS
// ========================================

if (formularioTarefa) {

    formularioTarefa.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!utilizadorAtual) {

            alert("Entra com o teu nome antes de criares tarefas.");

            return;
        }

        const elementoTitulo = campoTituloTarefa.value.trim();

        const descricaoCampo = campoDescricaoTarefa.value.trim();

        const dueDate = campoDataTarefa ? campoDataTarefa.value : "";

        if (elementoTitulo === "") {

            campoTituloTarefa.focus();

            return;
        }

        if (botaoGuardarTarefa) {
            botaoGuardarTarefa.disabled = true;
        }

        try {

            guardarTarefa({

                title: elementoTitulo,

                description: descricaoCampo,

                due_date: dueDate
            });

            idTarefaEmEdicao = null;

            formularioTarefa.reset();

            reporFormularioEdicao();

            mostrarTarefas();

        } catch (erro) {

            console.error("Erro ao guardar tarefa:", erro);

            alert("Não foi possível guardar a tarefa.");

        } finally {

            if (botaoGuardarTarefa) {
                botaoGuardarTarefa.disabled = false;
            }
        }
    });
}


// ========================================
// 8. REPOR O FORMULÁRIO
// ========================================

function reporFormularioEdicao() {

    if (tituloFormulario) {
        tituloFormulario.textContent = "Nova tarefa";
    }

    if (botaoGuardarTarefa) {
        botaoGuardarTarefa.textContent = "Adicionar tarefa";
    }

    if (botaoCancelarEdicao) {
        botaoCancelarEdicao.hidden = true;
    }
}


// Cancelar edição
if (botaoCancelarEdicao) {

    botaoCancelarEdicao.addEventListener("click", function() {

        idTarefaEmEdicao = null;

        if (formularioTarefa) {
            formularioTarefa.reset();
        }

        reporFormularioEdicao();
    });
}

// ========================================
// 9. MOSTRAR AS TAREFAS
// ========================================

function mostrarTarefas() {

    if (!listaTarefas || !utilizadorAtual) {
        return;
    }

    listaTarefas.innerHTML = "";

    let quantidadeAtivas = 0;

    let quantidadeConcluidas = 0;

    let quantidadeVisiveis = 0;

    // Percorrer as tarefas do utilizador atual
    tarefasDoUtilizador.forEach(function(tarefa) {

        // Contabilizar tarefas
        if (tarefa.completed) {

            quantidadeConcluidas++;

        } else {

            quantidadeAtivas++;
        }

        // Aplicar filtros
        if (filtroSelecionado === "active" && tarefa.completed) {
            return;
        }

        if (filtroSelecionado === "completed" && !tarefa.completed) {
            return;
        }

        quantidadeVisiveis++;

        // Criar elemento da tarefa
        const elementoLista = document.createElement("div");

        const elementoTitulo = document.createElement("h3");

        const descricaoCampo = document.createElement("p");

        const elementoData = document.createElement("p");

        elementoTitulo.textContent = tarefa.title;

        descricaoCampo.textContent = tarefa.description;

        // Mostrar a data da tarefa
        if (tarefa.due_date) {

            const partesData = tarefa.due_date.split("-");

            if (partesData.length === 3) {

                elementoData.textContent =
                    "📅 Data: " +
                    partesData[2] + "/" +
                    partesData[1] + "/" +
                    partesData[0];
            }

        } else {

            elementoData.textContent = "📅 Sem data definida";
        }

        elementoData.classList.add("tarefa-date");


        // Estilo das tarefas concluídas
        if (tarefa.completed) {

            elementoTitulo.style.textDecoration = "line-through";

            elementoLista.classList.add("tarefa-quantidadeConcluidas");
        }


        // Botão concluir/reabrir
        const botaoConcluir = document.createElement("button");

        botaoConcluir.type = "button";

        botaoConcluir.textContent =
            tarefa.completed ? "Reabrir" : "Concluir";

        botaoConcluir.addEventListener("click", function() {

            atualizarEstadoTarefa(tarefa);
        });


        // Botão editar
        const botaoEditar = document.createElement("button");

        botaoEditar.type = "button";

        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", function() {

            campoTituloTarefa.value = tarefa.title;

            campoDescricaoTarefa.value = tarefa.description;

            if (campoDataTarefa) {
                campoDataTarefa.value = tarefa.due_date || "";
            }

            idTarefaEmEdicao = tarefa.id;

            if (tituloFormulario) {
                tituloFormulario.textContent = "Editar tarefa";
            }

            if (botaoGuardarTarefa) {
                botaoGuardarTarefa.textContent = "Guardar alterações";
            }

            if (botaoCancelarEdicao) {
                botaoCancelarEdicao.hidden = false;
            }

            campoTituloTarefa.focus();
        });


        // Botão remover
        const botaoRemover = document.createElement("button");

        botaoRemover.type = "button";

        botaoRemover.textContent = "Remover";

        botaoRemover.addEventListener("click", function() {

            const confirmacao = confirm(
                "Queres mesmo remover esta tarefa?"
            );

            if (!confirmacao) {
                return;
            }

            // Remover apenas a tarefa selecionada
            // que pertence ao utilizador atual
            tarefas = tarefas.filter(function(elemento) {

                return !(
                    elemento.id === tarefa.id &&
                    elemento.userId === utilizadorAtual.id
                );
            });


            carregarTarefas();

            mostrarTarefas();
        });


        // Adicionar elementos à tarefa
        elementoLista.appendChild(elementoTitulo);

        elementoLista.appendChild(descricaoCampo);

        elementoLista.appendChild(elementoData);

        elementoLista.appendChild(botaoConcluir);

        elementoLista.appendChild(botaoEditar);

        elementoLista.appendChild(botaoRemover);

        listaTarefas.appendChild(elementoLista);
    });


    // Atualizar contadores
    if (contadorTarefasAtivas) {
        contadorTarefasAtivas.textContent = quantidadeAtivas;
    }

    if (contadorTarefasConcluidas) {
        contadorTarefasConcluidas.textContent = quantidadeConcluidas;
    }


    // Mensagem quando não existem tarefas visíveis
    if (mensagemListaVazia) {

        mensagemListaVazia.hidden = quantidadeVisiveis !== 0;
    }
    
}


// ========================================
// 10. CONCLUIR OU REABRIR UMA TAREFA
// ========================================

function atualizarEstadoTarefa(tarefa) {

    tarefas = tarefas.map(function(elemento) {

        if (
            elemento.id === tarefa.id &&
            elemento.userId === utilizadorAtual.id
        ) {

            elemento.completed = !elemento.completed;
        }

        return elemento;
    });


    carregarTarefas();

    mostrarTarefas();
}


// ========================================
// 11. FILTRAR TAREFAS
// ========================================

const botoesFiltro = document.querySelectorAll("#filters button");

botoesFiltro.forEach(function(botao) {

    botao.addEventListener("click", function() {

        filtroSelecionado = this.dataset.filter;

        // Destacar o botão do filtro selecionado
        botoesFiltro.forEach(function(outroBotao) {
            outroBotao.classList.remove("active-filter");
        });

        this.classList.add("active-filter");

        mostrarTarefas();
    });
});
// ========================================
// 14. MODO CLARO E MODO ESCURO
// ========================================

function atualizarBotaoTema() {

    if (!botaoTema) {
        return;
    }

    botaoTema.textContent =
        document.body.classList.contains("dark-mode")
            ? "☀️ Modo claro"
            : "🌙 Modo escuro";
}

// Recuperar o tema guardado
function recuperarTema() {

    const temaGuardado = localStorage.getItem("tema");

    if (temaGuardado === "escuro") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    atualizarBotaoTema();
}

// Aplicar o tema ao iniciar
recuperarTema();

if (botaoTema) {

    botaoTema.addEventListener("click", function() {

        const temaEscuroAtivo =
            document.body.classList.toggle("dark-mode");

        const novoTema = temaEscuroAtivo ? "escuro" : "claro";

        localStorage.setItem("tema", novoTema);

        atualizarBotaoTema();
    });
}


// ========================================
// 13. DATA E HORA
// ========================================

function atualizarRelogio() {

    const agora = new Date();

    if (dataAtual) {

        dataAtual.textContent =
            agora.toLocaleDateString("pt-PT");
    }

    if (horaAtual) {

        horaAtual.textContent =
            agora.toLocaleTimeString("pt-PT");
    }
}

atualizarRelogio();

setInterval(atualizarRelogio, 1000);


// ========================================
// 14. TERMINAR SESSÃO
// ========================================

if (botaoSair) {

    botaoSair.addEventListener("click", function() {


        utilizadorAtual = null;

        tarefasDoUtilizador = [];

        idTarefaEmEdicao = null;

        filtroSelecionado = "all";

        secaoAplicacao.hidden = true;

        secaoLogin.hidden = false;

        campoNomeUtilizador.value = "";

        if (listaTarefas) {
            listaTarefas.innerHTML = "";
        }

        if (formularioTarefa) {
            formularioTarefa.reset();
        }

        reporFormularioEdicao();

        mostrarMensagemLogin("");
    });
}


// ========================================
// 15. CONSULTAR FERIADOS DE PORTUGAL API
// ========================================

if (botaoConsultarFeriados) {

    botaoConsultarFeriados.addEventListener("click", async function() {

        if (mensagemFeriados) {

            mensagemFeriados.textContent =
                "A carregar os feriados...";
        }

        if (listaFeriados) {

            listaFeriados.innerHTML = "";
        }

        try {

            const resposta = await fetch(
                "https://date.nager.at/api/v3/NextPublicHolidays/PT"
            );

            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível consultar os feriados."
                );
            }

            const feriados = await resposta.json();

            if (!listaFeriados || !mensagemFeriados) {
                return;
            }

            listaFeriados.innerHTML = "";

            if (feriados.length === 0) {

                mensagemFeriados.textContent =
                    "Não foram encontrados feriados.";

                return;
            }

            feriados.forEach(function(feriado) {

                const elemento = document.createElement("div");

                const partesData = feriado.date.split("-");

                const dataFormatada =
                    partesData[2] + "/" +
                    partesData[1] + "/" +
                    partesData[0];

                elemento.textContent =
                    dataFormatada + " - " + feriado.localName;

                listaFeriados.appendChild(elemento);
            });

            mensagemFeriados.textContent =
                "Estes são os próximos feriados em Portugal.";

        } catch (erro) {

            console.error("Erro ao consultar feriados:", erro);

            if (mensagemFeriados) {

                mensagemFeriados.textContent =
                    "Ocorreu um erro ao consultar os feriados.";
            }
        }
    });
}




// ========================================
// 16. INICIAR A APLICAÇÃO
// ========================================

recuperarSessao();
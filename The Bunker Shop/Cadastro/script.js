let nome = "";
let senha = "";

function avancarLogin() {
    const inputNome = document.getElementById("input-nome");
    nome = inputNome.value;

    const inputSenha = document.getElementById("input-senha");
    senha = inputSenha.value;

    if (senha === "" || nome === "") {
        document.getElementById("Login").textContent = "Não deixe campos vazios";
        return;
    }

    localStorage.setItem("nomeUsuario", nome);

    window.location.href = "../index e etc/paginicial.html";
}

function avancarCadastro() {
    const inputNome = document.getElementById("input-nome");
    nome = inputNome.value;

    const inputSenha = document.getElementById("input-senha");
    senha = inputSenha.value;

    if (senha === "" || nome === "") {
        document.getElementById("Login").textContent = "Não deixe campos vazios";
        return;
    }

    localStorage.setItem("nomeUsuario", nome);

    window.location.href = "../login.html";
}
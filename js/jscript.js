let DirxJ, DiryJ, jog, velocidadeJ, PJx, PJy;
let jogo;
let frames;
let tamTelaW, tamTelaH;
let velocidadeTiro;
let cooldown = 1;
let horarioDaUltimaChamada = null;
let contaBombas, painelContBombas;
let totalBombas;
let velocidadeBomba;
let barraPlaneta;
let vidaPlaneta, telaMsg;
let timeCriaBomba;
let indiceDeExplosao;
let indiceDoSom;
let todosExplodidos

let level = window.location.search
level = level.replace("?", "")

if (level == 'eazy') {
  contaBombas = 20
  velocidadeBomba = 3
} else if (level == 'normal') {
  contaBombas = 30
  velocidadeBomba = 4
} else if (level == 'hard') {
  contaBombas = 40
  velocidadeBomba = 5
}


function teclaDown() {
  let tecla = event.keyCode;
  if (tecla == 38) {//cima
    DiryJ = -1;
  } else if (tecla == 40) {//baixo
    DiryJ = 1;
  }
  if (tecla == 37) {//esquerda
    DirxJ = -1;
  } else if (tecla == 39) {//direita
    DirxJ = 1;
  }
  if (tecla == 32) {//espaço(tiro)
    //tiro
    if (cooldown <= 0) {
      atira(PJx + 47, PJy)//o 47 para deixar o tiro centralizado
    }
  }
}
function teclaUp() {
  let tecla = event.keyCode;
  if ((tecla == 38) || (tecla == 40)) {
    DiryJ = 0;
  }
  if ((tecla == 37) || (tecla == 39)) {
    DirxJ = 0;
  }
}

function timerParaRemoverExplosao(elemento) {
  setTimeout(function () {
    elemento.remove();
    jog.style.backgroundImage = 'url(images/nave5.gif)';
    console.log('Removeu uma explosão.');
  }, 500);
}


function criaExplosao(bombaEl, tipo) {
  if (tipo == 1) {
    bombaEl.classList.add('explodida');
    timerParaRemoverExplosao(bombaEl);
    new Audio('images/somBomba.mp3').play();
  }
  if (tipo == 2) {
    bombaEl.classList.add('explodida');
    timerParaRemoverExplosao(bombaEl);
    setTimeout(function () {
      new Audio('images/somBombaNave.mp3').play();
    }, 10)
  }

}
function criaBombas() {
  if (jogo) {
    if (contaBombas > 0) {
      let y = 0;
      let x = Math.random() * tamTelaW;
      let bomba = document.createElement("div");
      bomba.classList.add('bomba');
      bomba.style.top = y + 'px';
      bomba.style.left = x + 'px';
      document.body.appendChild(bomba);
      contaBombas--;
    }
  }
}

function colisaoNaveBomba() {
  let tam = totalBombas.length;
  for (let i = 0; i < tam; i++) {
    if (totalBombas[i]) {
      if (
        (
          (jog.offsetTop <= (totalBombas[i].offsetTop + 55)) &&//verifica a parte de cima do tiro com a a parte de baixo da bomba(55 pois esta verificando se a posiçao top da bomba foi atingida)
          ((jog.offsetTop + 55) >= (totalBombas[i].offsetTop))//verifica a parte de baixo do tiro com a de cima da bomba
        )
        &&
        (
          (jog.offsetLeft <= (totalBombas[i].offsetLeft + 55)) &&//verifica a parte esquerda do tiro com a direita da bomba
          ((jog.offsetLeft + 55) >= (totalBombas[i].offsetLeft))//verifica a parte direita do tiro com a esquerda da bomba
        )
      ) {
        jog.style.backgroundImage = 'url(images/naveHurt.gif)';
        vidaNave = vidaNave - 3
        criaExplosao(totalBombas[i], 2);
      }
    }
  }
}

function colisaoTiroBomba(tiro) {
  let tam = totalBombas.length;
  for (let i = 0; i < tam; i++) {
    if (totalBombas[i]) {
      if (
        (
          (tiro.offsetTop <= (totalBombas[i].offsetTop + 55)) &&//verifica a parte de cima do tiro com a a parte de baixo da bomba(55 pois esta verificando se a posiçao top da bomba foi atingida)
          ((tiro.offsetTop + 6) >= (totalBombas[i].offsetTop))//verifica a parte de baixo do tiro com a de cima da bomba
        )
        &&
        (
          (tiro.offsetLeft <= (totalBombas[i].offsetLeft + 55)) &&//verifica a parte esquerda do tiro com a direita da bomba
          ((tiro.offsetLeft + 6) >= (totalBombas[i].offsetLeft))//verifica a parte direita do tiro com a esquerda da bomba
        )
      ) {
        criaExplosao(totalBombas[i], 1);
        document.body.removeChild(tiro);
      }
    }
  }
}
function atira(x, y) {
  cooldown = 100;
  let t = document.createElement("div");
  let att1 = document.createAttribute("class");
  let att2 = document.createAttribute("style");
  att1.value = "tirojog";
  att2.value = "top:" + y + "px;left:" + x + "px"; controlaBomba
  t.setAttributeNode(att1);
  t.setAttributeNode(att2);
  document.body.appendChild(t);
}

function controlaBomba() {
  totalBombas = document.getElementsByClassName("bomba");
  let qtdBombas = totalBombas.length;
  for (let i = 0; i < qtdBombas; i++) {
    if (totalBombas[i]) {
      let indice = totalBombas[i].offsetTop;
      let velocidadeDestaBomba = velocidadeBomba;
      let atingiuOchao = indice > tamTelaH - 50;
      let jaExplodiu = totalBombas[i].classList.contains('explodida');

      if (jaExplodiu) {
        velocidadeDestaBomba /= 6;
      } else if (atingiuOchao) {
        velocidadeDestaBomba = 0;
      }

      // atualiza a posição da bomba de acordo com sua velocidade
      indice += velocidadeDestaBomba;
      totalBombas[i].style.top = indice + "px";

      // verifica se a bomba atingiu o chão... se tiver atingido,
      // decrementa a vida e cria uma explosão

      if (atingiuOchao && !jaExplodiu) {
        vidaPlaneta -= 18;
        criaExplosao(totalBombas[i], 2);
      }
    }
  }
}

function controleTiro() {
  let tiros = document.getElementsByClassName("tirojog");
  let tam = tiros.length;

  for (let i = 0; i < tam; i++) {
    if (tiros[i]) {
      let PosTiro = tiros[i].offsetTop;//só "top" pq o tiro só se desloca no eixo y
      PosTiro -= velocidadeTiro;
      tiros[i].style.top = PosTiro + "px";
      colisaoTiroBomba(tiros[i]);
      if (PosTiro < 0) {
        document.body.removeChild(tiros[i]);
      }
    }
  }
}
function controlaJogador() {
  if (PJx < 0) {
    PJx = 0;
  }
  if (PJy < 0) {
    PJy = 0;
  }
  if (PJy + 90 > tamTelaH) {
    PJy = tamTelaH - 90
  }
  if (PJx + 90 > tamTelaW) {
    PJx = tamTelaW - 90
  }
  PJy += DiryJ * velocidadeJ;
  PJx += DirxJ * velocidadeJ;
  jog.style.top = PJy + "px";
  jog.style.left = PJx + "px"

}
function gerenciaGame() {
  barraPlaneta.style.width = vidaPlaneta + "px";
  barraNave.style.width = vidaNave + "px";
  counterBombas.innerHTML = contaBombas
  if (contaBombas <= 0) {
    setTimeout(() => {
      jogo = false;
      clearInterval(timeCriaBomba);
      telaMsg.style.backgroundImage = "url('images/win.jpg')";
      telaMsg.style.display = "block";

    }, 3000)
  }
  if (vidaPlaneta <= 0 || vidaNave <= 0) {
    jogo = false;
    clearInterval(timeCriaBomba);
    telaMsg.style.backgroundImage = "url('images/game_over.jpg')";
    telaMsg.style.display = "block";
  }
}
function gameLoop(tempoDesdeInicioDoJogo) {
  if (horarioDaUltimaChamada == null) {
    horarioDaUltimaChamada = tempoDesdeInicioDoJogo;
  }
  let tempoDesdeUltimaChamada = tempoDesdeInicioDoJogo - horarioDaUltimaChamada;
  cooldown -= tempoDesdeUltimaChamada;
  horarioDaUltimaChamada = tempoDesdeInicioDoJogo;
  if (jogo == true) {
    //funcao de controle
    controlaJogador();
    controleTiro();
    controlaBomba();
    colisaoNaveBomba();
  }
  gerenciaGame();
  frames = requestAnimationFrame(gameLoop);

}
function reinicia() {
  jogo = false;
}
function inicia() {
  jogo = true;
  //inicializaçao de tela
  tamTelaH = window.innerHeight;
  tamTelaW = window.innerWidth;
  //inicializaçao do jogador
  DirxJ = 0;
  DiryJ = 0;
  PJx = tamTelaW / 2;
  PJy = tamTelaH / 2;
  velocidadeJ = 10;
  velocidadeTiro = 5;
  jog = document.getElementById("naveJog");
  jog.style.top = PJy + "px";
  jog.style.left = PJx + "px"
  //controle das bombas
  clearInterval(timeCriaBomba);
  counterBombas = document.querySelector("#num")
  counterBombas.innerHTML = contaBombas
  timeCriaBomba = setInterval(criaBombas, 1700);
  //controle vida da nave
  vidaNave = 200;
  barraNave = document.querySelector("#barraNave")
  barraNave.style.width = vidaNave + "px";
  //controle planetas
  vidaPlaneta = 300;
  barraPlaneta = document.getElementById("barraPlaneta");
  barraPlaneta.style.width = vidaPlaneta + "px";
  //controles de explosao
  indiceDeExplosao = 0;
  indiceDoSom = 0;
  //telas
  telaMsg = document.getElementById("telaMsg");
  document.getElementById("botaoJogar").addEventListener("click", reinicia);


  requestAnimationFrame(gameLoop);
}

window.addEventListener("load", inicia);
document.addEventListener("keydown", teclaDown);
document.addEventListener("keyup", teclaUp);

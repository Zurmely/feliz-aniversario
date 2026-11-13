(function () {
  const c = window.CARTA;
  if (!c) {
    console.error("content.js não carregou. Confira se o arquivo existe na raiz do site.");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const titulo = (c.tituloPagina || "Para {nome}, de {remetente}")
    .replace("{nome}", c.destinataria)
    .replace("{remetente}", c.remetente);
  document.title = titulo;

  $("pular").textContent = c.pularParaEnvelope || "Ir para o envelope";
  $("kicker").textContent = c.kickerCapa || "";
  $("capa-nome").textContent = c.destinataria;
  $("capa-de").textContent = c.remetente;
  $("envelope-nome").textContent = c.destinataria;
  $("envelope-de").textContent = c.remetente;
  $("dica").textContent = c.dicaEnvelope;
  $("envelope").setAttribute(
    "aria-label",
    (c.ariaAbrirEnvelope || "Abrir envelope para {nome}").replace(
      "{nome}",
      c.destinataria
    )
  );

  $("feliz").textContent = c.felizAniversario;
  $("celebracao-toque").textContent = c.toqueParaLer || "";
  $("carta-data").textContent = c.data || "";
  $("carta-saudacao").textContent = c.saudacao || c.destinataria;
  $("carta-feliz").textContent = c.felizAniversario;
  const despedida = $("despedida");
  if (c.despedida) {
    despedida.textContent = c.despedida;
  } else {
    despedida.hidden = true;
  }
  $("assinatura").textContent = c.assinatura || c.remetente;
  $("guardar").textContent = c.guardarCarta;

  if (c.avisoPlaceholder) {
    $("aviso").hidden = false;
    $("aviso").textContent = c.avisoPlaceholder;
  }

  const texto = $("carta-texto");
  (c.paragrafos || []).forEach((par) => {
    const p = document.createElement("p");
    p.textContent = par;
    texto.appendChild(p);
  });

  const memorias = c.memorias || [];
  const cores = ["#ffe27a", "#ffb3c1", "#d7c2ff", "#a8e6cf", "#ffc89a", "#c9e4ff"];
  const giros = [-14, 9, -4, 18, -10, 6, 22, -18];
  const saltos = [8, -4, 10, 2, -6, 6, -2, 9];
  const abertas = new Set();

  function atualizarContador() {
    const total = memorias.length;
    if (abertas.size === total) {
      $("pote-contador").textContent = c.poteTodas;
      return;
    }
    $("pote-contador").textContent = (c.poteContador || "{abertas} de {total} abertas.")
      .replace("{abertas}", String(abertas.size))
      .replace("{total}", String(total));
  }

  if (memorias.length) {
    $("pote").hidden = false;
    $("pote-titulo").textContent = c.poteTitulo;
    $("pote-dica").textContent = c.poteDica;
    $("memoria-guardar").textContent = c.poteGuardar;
    atualizarContador();

    memorias.forEach((recado, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "papel";
      btn.setAttribute(
        "aria-label",
        (c.poteAria || "Abrir memória {n}").replace("{n}", String(i + 1))
      );
      const cor = cores[i % cores.length];
      btn.style.setProperty("--cor", cor);
      btn.style.setProperty("--giro", `${giros[i % giros.length]}deg`);
      btn.style.setProperty("--salto", `${saltos[i % saltos.length]}px`);
      btn.addEventListener("click", () => {
        $("memoria-texto").textContent = recado;
        $("memoria").style.setProperty("--cor", cor);
        $("memoria").showModal();
        abertas.add(i);
        btn.classList.add("aberto");
        atualizarContador();
      });
      $("pote-papeis").appendChild(btn);
    });

    const dlg = $("memoria");
    $("memoria-guardar").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  }

  /* ---------- Confete ---------- */

  const canvas = $("confetti");
  const ctx = canvas.getContext("2d");
  let pecas = [];
  let animando = false;

  function tamanhoCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function estourarConfete() {
    if (reduzMovimento) return;
    tamanhoCanvas();
    canvas.hidden = false;
    const coresConfete = ["#c9a6f0", "#e8c56a", "#fff8ee", "#ffb3c1", "#a8e6cf", "#d7c2ff"];
    pecas = Array.from({ length: 110 }, () => {
      const pinguim = Math.random() < 0.14;
      return {
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 80,
        y: canvas.height * 0.38,
        vx: (Math.random() - 0.5) * 11,
        vy: Math.random() * -11 - 4,
        g: 0.16 + Math.random() * 0.08,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        cor: coresConfete[Math.floor(Math.random() * coresConfete.length)],
        pinguim,
        font: 14 + Math.random() * 10,
      };
    });
    if (!animando) {
      animando = true;
      pedirFrame();
    }
  }

  function pedirFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pecas.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      if (p.pinguim) {
        ctx.font = `${p.font}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐧", 0, 0);
      } else {
        ctx.fillStyle = p.cor;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    pecas = pecas.filter((p) => p.y < canvas.height + 30);
    if (pecas.length) {
      requestAnimationFrame(pedirFrame);
    } else {
      animando = false;
      canvas.hidden = true;
    }
  }

  window.addEventListener("resize", () => {
    if (!canvas.hidden) tamanhoCanvas();
  });

  /* ---------- Abrir / fechar ---------- */

  let ocupado = false;
  let esperaCelebracao;

  function mostrarCarta() {
    $("capa").hidden = true;
    $("celebracao").hidden = true;
    $("celebracao").classList.remove("saindo");
    const carta = $("carta");
    carta.hidden = false;
    carta.classList.remove("entrando");
    void carta.offsetWidth;
    if (!reduzMovimento) carta.classList.add("entrando");
    window.scrollTo(0, 0);
    $("carta-saudacao").focus({ preventScroll: true });
    ocupado = false;
  }

  function abrirEnvelope() {
    if (ocupado) return;
    ocupado = true;
    if (reduzMovimento) {
      mostrarCarta();
      return;
    }
    document.body.classList.add("abrindo");
    esperaCelebracao = setTimeout(() => {
      estourarConfete();
      $("celebracao").hidden = false;
      esperaCelebracao = setTimeout(() => {
        $("celebracao").classList.add("saindo");
        setTimeout(mostrarCarta, 400);
      }, 1700);
    }, 900);
  }

  $("envelope").addEventListener("click", abrirEnvelope);

  $("celebracao").addEventListener("click", () => {
    clearTimeout(esperaCelebracao);
    $("celebracao").classList.add("saindo");
    setTimeout(mostrarCarta, reduzMovimento ? 0 : 250);
  });

  $("guardar").addEventListener("click", () => {
    $("carta").hidden = true;
    $("capa").hidden = false;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.remove("abrindo"));
    });
    $("envelope").focus({ preventScroll: true });
    ocupado = false;
  });
})();

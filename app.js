(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }

  const c = window.CARTA;
  if (!c) {
    console.error(
      "content.js não carregou. Confira se o arquivo existe na raiz do site."
    );
    return;
  }

  const $ = (id) => document.getElementById(id);
  const reduzMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.title = (c.tituloPagina || "Para {nome}, de {remetente}")
    .replace("{nome}", c.destinataria)
    .replace("{remetente}", c.remetente);

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

  (c.paragrafos || []).forEach((par) => {
    const p = document.createElement("p");
    p.textContent = par;
    $("carta-texto").appendChild(p);
  });

  /* ---------- Confete ao abrir ---------- */

  const canvasConfete = $("confetti");
  const ctxConfete = canvasConfete.getContext("2d");
  let confetes = [];
  let animConfete = false;

  function redimensionarConfete() {
    canvasConfete.width = window.innerWidth;
    canvasConfete.height = window.innerHeight;
  }

  function estourarConfete() {
    if (reduzMovimento) return;
    redimensionarConfete();
    canvasConfete.hidden = false;
    const cores = [
      "#c9a6f0",
      "#e8c56a",
      "#fff8ee",
      "#ffb3c1",
      "#d7c2ff",
    ];
    confetes = Array.from({ length: 90 }, () => ({
      x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 60,
      y: window.innerHeight * 0.42,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -10 - 3,
      g: 0.15 + Math.random() * 0.07,
      w: 5 + Math.random() * 5,
      h: 7 + Math.random() * 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      cor: cores[Math.floor(Math.random() * cores.length)],
      pinguim: Math.random() < 0.12,
      font: 12 + Math.random() * 8,
    }));
    if (!animConfete) {
      animConfete = true;
      frameConfete();
    }
  }

  function frameConfete() {
    ctxConfete.clearRect(0, 0, canvasConfete.width, canvasConfete.height);
    confetes.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctxConfete.save();
      ctxConfete.translate(p.x, p.y);
      ctxConfete.rotate(p.r);
      if (p.pinguim) {
        ctxConfete.font = `${p.font}px serif`;
        ctxConfete.textAlign = "center";
        ctxConfete.textBaseline = "middle";
        ctxConfete.fillText("🐧", 0, 0);
      } else {
        ctxConfete.fillStyle = p.cor;
        ctxConfete.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctxConfete.restore();
    });
    confetes = confetes.filter((p) => p.y < canvasConfete.height + 20);
    if (confetes.length) requestAnimationFrame(frameConfete);
    else {
      animConfete = false;
      canvasConfete.hidden = true;
    }
  }

  /* ---------- Chuva de pinguins no fim da carta ---------- */

  const canvasPinguins = $("pinguins");
  const ctxPinguins = canvasPinguins.getContext("2d");
  let partículas = [];
  let animPinguins = false;
  let burstDisparado = false;
  let limpaBurst;

  function redimensionarPinguins() {
    canvasPinguins.width = window.innerWidth;
    canvasPinguins.height = window.innerHeight;
  }

  function desenharPinguim(ctx, size, festa) {
    ctx.font = `${size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (festa) {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.72);
      ctx.lineTo(size * 0.22, -size * 0.42);
      ctx.lineTo(-size * 0.22, -size * 0.42);
      ctx.closePath();
      ctx.fillStyle = "#c9a6f0";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -size * 0.58, size * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = "#e8c56a";
      ctx.fill();
    }
    ctx.fillText("🐧", 0, 0);
  }

  function dispararPinguins() {
    if (reduzMovimento || burstDisparado) return;
    burstDisparado = true;
    redimensionarPinguins();
    canvasPinguins.hidden = false;

    const cores = ["#c9a6f0", "#e8c56a", "#d7c2ff", "#ffb3c1", "#e9d7ff"];
    partículas = Array.from({ length: 95 }, (_, i) => {
      const pinguim = i < 78;
      return {
        tipo: pinguim ? "pinguim" : "confete",
        x: Math.random() * canvasPinguins.width,
        y: -20 - Math.random() * canvasPinguins.height * 0.5,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 5,
        g: 0.11 + Math.random() * 0.06,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.15,
        size: 20 + Math.random() * 22,
        festa: pinguim && Math.random() < 0.45,
        w: 4 + Math.random() * 5,
        h: 6 + Math.random() * 6,
        cor: cores[Math.floor(Math.random() * cores.length)],
        bounce: 0.35 + Math.random() * 0.15,
        vida: 0,
      };
    });

    if (!animPinguins) {
      animPinguins = true;
      framePinguins();
    }

    clearTimeout(limpaBurst);
    limpaBurst = setTimeout(() => {
      partículas = [];
      animPinguins = false;
      ctxPinguins.clearRect(0, 0, canvasPinguins.width, canvasPinguins.height);
      canvasPinguins.hidden = true;
    }, 4800);
  }

  function framePinguins() {
    const chao = canvasPinguins.height - 8;
    ctxPinguins.clearRect(0, 0, canvasPinguins.width, canvasPinguins.height);

    partículas.forEach((p) => {
      p.vida += 1;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;

      if (p.y > chao) {
        p.y = chao;
        p.vy *= -p.bounce;
        p.vx *= 0.92;
        if (Math.abs(p.vy) < 1.2) p.vy = 0;
      }

      ctxPinguins.save();
      ctxPinguins.translate(p.x, p.y);
      ctxPinguins.rotate(p.r);
      if (p.tipo === "pinguim") {
        desenharPinguim(ctxPinguins, p.size, p.festa);
      } else {
        ctxPinguins.fillStyle = p.cor;
        ctxPinguins.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctxPinguins.restore();
    });

    partículas = partículas.filter(
      (p) => p.vida < 280 && (p.y < canvasPinguins.height + 40 || p.vy !== 0)
    );

    if (partículas.length && animPinguins) {
      requestAnimationFrame(framePinguins);
    } else if (!partículas.length) {
      animPinguins = false;
    }
  }

  const fim = $("fim-carta");
  if (fim && !reduzMovimento) {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          dispararPinguins();
          obs.disconnect();
        }
      },
      { root: null, threshold: 0.6, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(fim);
  }

  window.addEventListener("resize", () => {
    if (!canvasConfete.hidden) redimensionarConfete();
    if (!canvasPinguins.hidden) redimensionarPinguins();
  });

  /* ---------- Abrir / fechar envelope ---------- */

  let ocupado = false;
  const TEMPO_ABA = reduzMovimento ? 0 : 750;
  const TEMPO_CARTA = reduzMovimento ? 0 : 950;

  function revelarCarta() {
    $("capa").hidden = true;
    $("capa").classList.remove("sumindo");
    const carta = $("carta");
    carta.hidden = false;
    carta.classList.remove("entrando", "expandindo");
    void carta.offsetWidth;
    if (!reduzMovimento) carta.classList.add("expandindo");
    document.body.classList.remove("abrindo", "carta-saindo");
    window.scrollTo(0, 0);
    $("carta-saudacao").focus({ preventScroll: true });
    ocupado = false;
  }

  function abrirEnvelope() {
    if (ocupado) return;
    ocupado = true;

    if (reduzMovimento) {
      revelarCarta();
      return;
    }

    document.body.classList.add("abrindo");
    setTimeout(() => {
      document.body.classList.add("carta-saindo");
      estourarConfete();
    }, TEMPO_ABA * 0.55);

    setTimeout(() => {
      $("capa").classList.add("sumindo");
    }, TEMPO_ABA + TEMPO_CARTA * 0.35);

    setTimeout(revelarCarta, TEMPO_ABA + TEMPO_CARTA);
  }

  $("envelope").addEventListener("click", abrirEnvelope);

  $("guardar").addEventListener("click", () => {
    $("carta").hidden = true;
    $("carta").classList.remove("expandindo", "entrando");
    $("capa").hidden = false;
    $("capa").classList.remove("sumindo");
    burstDisparado = false;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      document.body.classList.remove("abrindo", "carta-saindo");
    });
    $("envelope").focus({ preventScroll: true });
    ocupado = false;
  });
})();

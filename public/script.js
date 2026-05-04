// ==================== CONFIGURAÇÃO FIREBASE CLIENT ====================
// Você deve substituir os valores abaixo pelas configurações do seu projeto no Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1_ia95xc1nI-fQvDVfzeA9XD7BwUi39U",
  authDomain: "ranchotucunare-2e009.firebaseapp.com",
  projectId: "ranchotucunare-2e009",
  storageBucket: "ranchotucunare-2e009.firebasestorage.app",
  messagingSenderId: "161958795445",
  appId: "1:161958795445:web:83c49eb84911f3593506fc",
  measurementId: "G-6NCFVMBPHE"
};

// Inicializar Firebase (apenas se as chaves forem preenchidas)
let app, auth, db, analytics;
try {
  if (firebaseConfig.apiKey !== "SUA_API_KEY") {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    analytics = firebase.analytics();
    console.log("Firebase Client inicializado");
  }
} catch (e) {
  console.error("Erro ao inicializar Firebase Client:", e);
}

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".nav ul");
  const backToTopBtn = document.getElementById("back-to-top");
  const preloader = document.getElementById("preloader");
  const header = document.querySelector(".header");
  const footer = document.querySelector(".footer");
  const botaoWhatsApp = document.querySelector(".botao-whatsapp");

  //PRELOADER
  window.addEventListener("load", () => {
    if (!preloader) return;

    botaoWhatsApp?.classList.add("hidden");

    setTimeout(() => {
      preloader.style.opacity = "0";
      botaoWhatsApp?.classList.remove("hidden");

      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, 2000);
  });


  //MENU MOBILE
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  //SCROLL SUAVE COM OFFSET CORRETO
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href && href !== "#") {
        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header?.offsetHeight || 80;
          const offset = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

          window.scrollTo({ 
            top: offset, 
            behavior: "smooth",
            duration: 1000
          });

          // Remove active state from all links
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
        }

        // Close mobile menu
        nav.classList.remove("active");
      }
    });
  });

  // EFEITO DE SOMBRA NO HEADER AO ROLAR
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header?.style.setProperty("box-shadow", "0 4px 20px rgba(0, 0, 0, 0.2)");
      header?.style.setProperty("background-color", "rgba(255, 255, 255, 0.25)");
    } else {
      header?.style.setProperty("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.1)");
      header?.style.setProperty("background-color", "rgba(255, 255, 255, 0.2)");
    }
  });

    // BOTÃO VOLTAR AO TOPO 
  window.addEventListener("scroll", () => {
    if (!backToTopBtn) return;

    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  //LIGHTBOX
  const images = document.querySelectorAll(".zoomable");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox .close");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      if (!lightbox) return;

      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    });
  });

  lightboxClose?.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
  });

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      lightboxImg.src = "";
    }
  });

  //FADE-IN SCROLL
  const fadeElements = document.querySelectorAll(".fade-in");
  const observerFade = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("show"));
    },
    { threshold: 0.2 }
  );
  fadeElements.forEach((el) => observerFade.observe(el));

 
  // AJUSTE DE POSIÇÃO DO BOTÃO WHATSAPP
  function ajustarPosicaoBotaoWhatsApp() {
    if (!botaoWhatsApp || !footer) return;

    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sobrepoe = windowHeight - footerRect.top;

    if (sobrepoe > 0) {
      botaoWhatsApp.style.bottom = `${sobrepoe + 20}px`;
    } else {
      botaoWhatsApp.style.bottom = "20px";
    }
  }

  // Atualiza posição quando rola ou redimensiona
  window.addEventListener("scroll", ajustarPosicaoBotaoWhatsApp);
  window.addEventListener("resize", ajustarPosicaoBotaoWhatsApp);
  
  // Inicial
  ajustarPosicaoBotaoWhatsApp();

  
  //ANIMAÇÃO LEFT/RIGHT MELHORADA
  const sections = document.querySelectorAll("section");

  sections.forEach((section, i) => {
    section.classList.add(i % 2 === 0 ? "from-left" : "from-right");
    // Adiciona efeito de entrada em cascata
    section.style.animationDelay = `${i * 0.1}s`;
  });

  const observerSections = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerSections.unobserve(entry.target);
          
          // Adiciona efeito aos elementos filho
          const children = entry.target.querySelectorAll("h2, p, .glass-box, .grid-gallery, .room-grid");
          children.forEach((child, idx) => {
            child.style.animation = `fade-in-move 0.6s ease-out ${idx * 0.1}s forwards`;
            child.style.opacity = "0";
          });
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observerSections.observe(section));

  // INDICADOR DE SEÇÃO ATIVA NA NAVEGAÇÃO
  window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  //FAQ
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      faqButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
      button.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  // ==================== AUTH TABS & FORMS ====================
  const authTabs = document.querySelectorAll(".auth-tab");
  const authContents = document.querySelectorAll(".auth-content");
  const authStatus = document.getElementById("auth-status");
  const headerLoginBtn = document.getElementById("header-login-btn");
  const headerRegisterBtn = document.getElementById("header-register-btn");
  const headerLogoutBtn = document.getElementById("header-logout-btn");
  const authButtonsContainer = document.querySelector(".auth-buttons-header");

  function switchAuthTab(tabName) {
    authTabs.forEach(t => t.classList.remove("active"));
    authContents.forEach(c => c.classList.remove("active"));
    
    const selectedTab = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}-tab`);
    
    if (selectedTab && selectedContent) {
      selectedTab.classList.add("active");
      selectedContent.classList.add("active");
    }
  }

  headerLoginBtn?.addEventListener("click", () => switchAuthTab("login"));
  headerRegisterBtn?.addEventListener("click", () => switchAuthTab("register"));

  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      switchAuthTab(targetTab);
    });
  });

  function showAuthStatus(message, type) {
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.className = `auth-status ${type}`;
    authStatus.style.display = "block";
    setTimeout(() => authStatus.style.display = "none", 5000);
  }

  // Monitorar Estado de Autenticação
  if (auth) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuário logado
        if (authButtonsContainer) authButtonsContainer.style.display = "none";
        if (headerLogoutBtn) headerLogoutBtn.style.display = "block";
        console.log("Usuário logado:", user.email);
      } else {
        // Usuário deslogado
        if (authButtonsContainer) authButtonsContainer.style.display = "flex";
        if (headerLogoutBtn) headerLogoutBtn.style.display = "none";
        console.log("Usuário deslogado");
      }
    });
  }

  // Logout
  headerLogoutBtn?.addEventListener("click", async () => {
    try {
      await auth.signOut();
      showAuthStatus("Você saiu com sucesso.", "sucesso");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });

  // Cadastro de Usuário
  const registerForm = document.getElementById("register-form-user");
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!auth) return alert("Firebase não configurado! Preencha o firebaseConfig no script.js");

    const nome = registerForm.nome.value;
    const email = registerForm.email.value;
    const senha = registerForm.senha.value;

    try {
      // Criar usuário no Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      // Salvar dados extras no Firestore
      await db.collection("users").doc(user.uid).set({
        nome: nome,
        email: email,
        data_cadastro: new Date().toISOString()
      });

      showAuthStatus("Cadastro realizado com sucesso!", "sucesso");
      registerForm.reset();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      showAuthStatus(error.message, "erro");
    }
  });

  // Login de Usuário
  const loginForm = document.getElementById("login-form-user");
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!auth) return alert("Firebase não configurado! Preencha o firebaseConfig no script.js");

    const email = loginForm.email.value;
    const senha = loginForm.senha.value;

    try {
      await auth.signInWithEmailAndPassword(email, senha);
      showAuthStatus("Login realizado com sucesso!", "sucesso");
      loginForm.reset();
      
      setTimeout(() => {
        window.location.hash = "#reserva";
      }, 1000);
      
    } catch (error) {
      console.error("Erro no login:", error);
      showAuthStatus("E-mail ou senha incorretos.", "erro");
    }
  });
});

  //FORMULÁRIO DE RESERVA
const form = document.querySelector(".reserva-form");
const statusDiv = document.getElementById("form-status");

if (form && statusDiv) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      statusDiv.textContent = result.message || "Solicitação enviada!";
      statusDiv.classList.add("sucesso");
      statusDiv.style.display = "block";
      form.reset();

      setTimeout(() => (statusDiv.style.display = "none"), 5000);
    } catch (error) {
      statusDiv.textContent = "Erro ao enviar solicitação.";
      statusDiv.classList.add("erro");
      statusDiv.style.display = "block";
    }
  });
}

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const progressBar = $("#progressBar");
const navbar = $("#navbar");
const topBtn = $("#topBtn");
const menuToggle = $("#menuToggle");
const navMenu = $("#navMenu");
const cursorGlow = $("#cursorGlow");

window.addEventListener("scroll", () => {
  const h = document.documentElement;
  progressBar.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
  navbar.classList.toggle("scrolled", window.scrollY > 10);
  topBtn.classList.toggle("show", window.scrollY > 500);
});

window.addEventListener("mousemove", e => {
  if (cursorGlow) {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }
});

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  menuToggle.innerHTML = navMenu.classList.contains("open")
    ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
$$("nav a").forEach(a => a.addEventListener("click", () => {
  navMenu.classList.remove("open");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

const sections = $$("section[id]");
const navLinks = $$("nav a");
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, {rootMargin:"-40% 0px -50% 0px"});
sections.forEach(s => activeObserver.observe(s));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$(".reveal").forEach(el => revealObserver.observe(el));

const counters = $$("[data-count]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = +el.dataset.count;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const tick = () => {
      n = Math.min(target, n + step);
      el.textContent = n + (target === 100 ? "%" : "+");
      if (n < target) requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, {threshold:.8});
counters.forEach(c => counterObserver.observe(c));

$$(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    if (window.innerWidth < 800) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-2px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

$("#topBtn").addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

// $("#contactForm").addEventListener("submit", e => {
//   e.preventDefault();
//   const form = e.currentTarget;
//   const data = new FormData(form);
//   const name = data.get("name");
//   const email = data.get("email");
//   const subject = encodeURIComponent(data.get("subject"));
//   const message = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${data.get("message")}`);
//   const status = $("#formStatus");
//   status.textContent = "Opening your email app…";
//   window.location.href = `mailto:abhishek.pradhan.jsr@gmail.com?subject=${subject}&body=${message}`;
//   setTimeout(() => {
//     status.textContent = "If nothing opened, check your default email app.";
//   }, 1200);
// });

// for contact

document.getElementById("contactForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = this;
    const status = document.getElementById("formStatus");

    const data = {
        name: form.elements["name"].value,
        email: form.elements["email"].value,
        subject: form.elements["subject"].value,
        message: form.elements["message"].value
    };

    status.textContent = "Sending...";

    try {
        const response = await fetch(
            "https://portfolio-backend-iggf.onrender.com/api/contact/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error("Failed to send message");
        }

        status.textContent = "Message sent successfully!";

        form.reset();

    } catch (error) {

        console.error(error);

        status.textContent =
            "Unable to send message. Please try again.";
    }
});


$("#year").textContent = new Date().getFullYear();

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme");
if(savedTheme === "soft-dark"){
  document.body.classList.add("soft-dark");
  if(themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}
if(themeToggle){
  themeToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("soft-dark");
    const dark = document.body.classList.contains("soft-dark");
    localStorage.setItem("portfolio-theme", dark ? "soft-dark" : "light");
    themeToggle.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}
// const photoInput = document.getElementById("photoUrl");
// const photoBtn = document.getElementById("applyPhoto");
// const profilePhoto = document.getElementById("profilePhoto");
// const savedPhoto = localStorage.getItem("portfolio-photo");
// if(savedPhoto && profilePhoto){ profilePhoto.src = savedPhoto; if(photoInput) photoInput.value = savedPhoto; }
// if(photoBtn){
//   photoBtn.addEventListener("click", ()=>{
//     const url = photoInput.value.trim();
//     if(!url) return;
//     profilePhoto.src = url;
//     localStorage.setItem("portfolio-photo", url);
//   });
// }

export let backendHomepageMarkup = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Visit Copenhagen Backend</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Gradient animation */
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 8s ease infinite;
    }

    /* Floating shapes animation */
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-20px) translateX(10px); }
    }
    .shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.4;
      animation: float 6s ease-in-out infinite;
    }
    .shape:nth-child(1) { width: 80px; height: 80px; top: 10%; left: 15%; background: #ffffff33; animation-delay: 0s; }
    .shape:nth-child(2) { width: 100px; height: 100px; top: 30%; right: 20%; background: #ffffff44; animation-delay: 2s; }
    .shape:nth-child(3) { width: 60px; height: 60px; bottom: 15%; left: 25%; background: #ffffff22; animation-delay: 4s; }
    .shape:nth-child(4) { width: 90px; height: 90px; bottom: 20%; right: 10%; background: #ffffff33; animation-delay: 1s; }
  </style>
</head>
<body class="relative min-h-screen flex items-center justify-center animate-gradient bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 overflow-hidden">

  <!-- Floating animated shapes -->
  <div class="shape"></div>
  <div class="shape"></div>
  <div class="shape"></div>
  <div class="shape"></div>

  <!-- Main content -->
  <div class="text-center text-white px-6 z-10">
    <h1 class="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fadeIn">
      Welcome to Visit Copenhagen Backend Server
    </h1>
    <p class="text-lg md:text-xl mb-8 opacity-90 animate-fadeIn delay-200">
      Discover the beauty and culture of Denmark’s capital.
    </p>
    <a href="/frontend"
       class="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:bg-blue-50 animate-fadeIn delay-500">
      Visit the Frontend
    </a>
  </div>

  <script>
    // Simple fade-in stagger effect
    document.querySelectorAll('.animate-fadeIn').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 1s ease';
      setTimeout(() => el.style.opacity = '1', i * 300);
    });
  </script>
</body>
</html>
`;
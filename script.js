document.addEventListener("DOMContentLoaded", () => {

    const botones = document.querySelectorAll(".btn-filtro");
    const items = document.querySelectorAll(".foto-item");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {

            // Reset de botón activo
            botones.forEach(b => b.classList.remove("activo"));
            boton.classList.add("activo");

            const filtro = boton.dataset.filtro;

            items.forEach(item => {

                // Mostrar todo
                if (filtro === "todos") {
                    item.style.display = "block";
                    item.style.opacity = "1";
                    return;
                }

                // Filtrar por categoría
                if (item.classList.contains(filtro)) {
                    item.style.display = "block";
                    setTimeout(() => item.style.opacity = "1", 10);
                } else {
                    item.style.opacity = "0";
                    setTimeout(() => item.style.display = "none", 200);
                }
            });
        });
    });

});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-votar")) {
    const panel = e.target.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  }
});
document.addEventListener("click", (e) => {

  if (e.target.dataset.cat) {

    const panel = e.target.closest(".panel-voto");
    const artista = e.target.closest(".foto-item");
    const categoria = e.target.dataset.cat;

    const contador = artista.querySelector(
      `.contador-votos [data-count="${categoria}"]`
    );

    contador.textContent = parseInt(contador.textContent) + 1;
  }

});

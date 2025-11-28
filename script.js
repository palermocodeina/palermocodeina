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

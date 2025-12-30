import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAqpTEr5jk-dL3FC_bWUId4LZNCVWdagV0",
    authDomain: "palermocodeina.firebaseapp.com",
    projectId: "palermocodeina",
    storageBucket: "palermocodeina.firebasestorage.app",
    messagingSenderId: "253969925378",
    appId: "1:253969925378:web:d1a77ab98c81eba6e0ae1b"
  };

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

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

    items.forEach(async (artista) => {
  const artistId = artista.dataset.artistId;
  if (!artistId) return;

  const ref = doc(db, "artists", artistId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  Object.keys(data).forEach(cat => {
    const el = artista.querySelector(`[data-count="${cat}"]`);
    if (el) el.textContent = data[cat];
    
  });
if (currentUser) {
  const voteId = `${currentUser.uid}_${artistId}`;
  const voteRef = doc(db, "votes", voteId);
  const voteSnap = await getDoc(voteRef);

  if (voteSnap.exists()) {
    const { category } = voteSnap.data();
    const btn = artista.querySelector(".btn-votar");
    btn.disabled = true;
    btn.textContent = `VOTADO · ${category.toUpperCase()}`;
    btn.dataset.votedCategory = category;
  }
}

});


});
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-votar")) return;

  document.querySelectorAll(".panel-voto").forEach(p => {
    p.style.display = "none";
  });

  const panel = e.target.nextElementSibling;
  panel.style.display = "block";
});

document.addEventListener("click", async (e) => {

  if (!e.target.dataset.cat) return;
  if (!currentUser) {
    alert("Tenés que loguearte para votar");
    return;
  }

  const panel = e.target.closest(".panel-voto");
  const artista = e.target.closest(".foto-item");
  const categoria = e.target.dataset.cat;

  const artistId = artista.dataset.artistId;
  const voteId = `${currentUser.uid}_${artistId}`;

  const voteRef = doc(db, "votes", voteId);
  const artistRef = doc(db, "artists", artistId);

  const voteSnap = await getDoc(voteRef);
  if (voteSnap.exists()) {
    alert("Ya votaste este artista");
    return;
  }

await setDoc(
  artistRef,
  { [categoria]: increment(1) },
  { merge: true }
);


  await updateDoc(artistRef, {
    [categoria]: increment(1)
  });

  panel.style.display = "none";
  const btn = artista.querySelector(".btn-votar");
  btn.disabled = true;
  btn.textContent = "VOTADO";
});


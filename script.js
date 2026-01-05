// ===============================
// 🔥 FIREBASE INIT
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqpTEr5jk-dL3FC_bWUId4LZNCVWdagV0",
  authDomain: "palermocodeina.firebaseapp.com",
  projectId: "palermocodeina"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

onAuthStateChanged(auth, user => {
  currentUser = user;
});

// ===============================
// 🔐 LOGIN
// ===============================
async function loginConGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login error:", err);
  }
}

// ===============================
// 📥 CARGAR CONTADORES
// ===============================
document.addEventListener("DOMContentLoaded", async () => {

  document.querySelectorAll(".foto-item").forEach(async artista => {
    const artistId = artista.dataset.artistId;
    if (!artistId) return;

    const snap = await getDoc(doc(db, "artists", artistId));
    if (!snap.exists()) return;

    const data = snap.data();
    Object.entries(data).forEach(([cat, val]) => {
      const el = artista.querySelector(`[data-count="${cat}"]`);
      if (el) el.textContent = val;
    });
  });

});

// ===============================
// 🧠 EVENT ROUTER (UNO SOLO)
// ===============================
document.addEventListener("click", async e => {

  /* === BOTÓN VOTAR === */
  if (e.target.classList.contains("btn-votar")) {
    const panel = e.target.nextElementSibling;

    // cerrar otros
    document.querySelectorAll(".panel-voto").forEach(p => p.style.display = "none");

    panel.style.display = "block";
    return;
  }

  /* === CLICK EN CATEGORÍA === */
  if (e.target.dataset.cat) {

    // LOGIN SOLO ACÁ
    if (!currentUser) {
      await loginConGoogle();
      if (!currentUser) return;
    }

    // === VOTAR ===
    const artista = e.target.closest(".foto-item");
    const categoria = e.target.dataset.cat;
    const artistId = artista.dataset.artistId;

    await setDoc(
      doc(db, "artists", artistId),
      { [categoria]: increment(1) },
      { merge: true }
    );

    const btn = artista.querySelector(".btn-votar");
    btn.textContent = `VOTADO · ${categoria.toUpperCase()}`;
    btn.dataset.votedCategory = categoria;
    btn.dataset.voted = "true";

    artista.querySelector(".panel-voto").style.display = "none";
    return;
  }

});


   

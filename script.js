import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

async function loginConGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Error login:", err);
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyAqpTEr5jk-dL3FC_bWUId4LZNCVWdagV0",
  authDomain: "palermocodeina.firebaseapp.com",
  projectId: "palermocodeina"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, user => currentUser = user);

document.addEventListener("DOMContentLoaded", async () => {

  document.querySelectorAll(".btn-filtro").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");

      const filtro = btn.dataset.filtro;
      document.querySelectorAll(".foto-item").forEach(item => {
        item.style.display = filtro === "todos" || item.classList.contains(filtro)
          ? "block"
          : "none";
      });
    });
  });

  document.querySelectorAll(".foto-item").forEach(async artista => {
    const id = artista.dataset.artistId;
    if (!id) return;

    const snap = await getDoc(doc(db, "artists", id));
    if (!snap.exists()) return;

    Object.entries(snap.data()).forEach(([cat, val]) => {
      const el = artista.querySelector(`[data-count="${cat}"]`);
      if (el) el.textContent = val;
    });
  });
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("btn-votar")) {
    document.querySelectorAll(".panel-voto").forEach(p => p.style.display = "none");
    e.target.nextElementSibling.style.display = "block";
  }
});

document.addEventListener("click", async e => {
  if (!e.target.dataset.cat) return;
  if (!currentUser) {
  await loginConGoogle();
  return;
}


  const artista = e.target.closest(".foto-item");
  const categoria = e.target.dataset.cat;
  const artistId = artista.dataset.artistId;

  await setDoc(
    doc(db, "artists", artistId),
    { [categoria]: increment(1) },
    { merge: true }
  );

  artista.querySelector(".panel-voto").style.display = "none";
  const btn = artista.querySelector(".btn-votar");
  btn.disabled = true;
  btn.textContent = "VOTADO";
});

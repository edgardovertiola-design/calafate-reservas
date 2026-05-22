import React, { useState, useEffect, useMemo } from "react";

const SUPA_URL = "https://joqzusodfkvjthqwlepq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcXp1c29kZmt2anRocXdsZXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDA1MjcsImV4cCI6MjA5NDIxNjUyN30.f6GrQQWGpFjVvwdbXkqi8UF6DEGm8yaPXNAzGKL1t-Q";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPA_KEY,
  "Authorization": `Bearer ${SUPA_KEY}`,
  "Prefer": "return=representation",
  "Accept-Profile": "public",
  "Content-Profile": "public",
};

const db = {
  async get(tabla, params = "") {
    const res = await fetch(`${SUPA_URL}/rest/v1/${tabla}?${params}`, { headers });
    return res.json();
  },
  async post(tabla, body) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${tabla}`, { method: "POST", headers, body: JSON.stringify(body) });
    return res.json();
  },
  async patch(tabla, id, body) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${tabla}?id=eq.${id}`, { method: "PATCH", headers, body: JSON.stringify(body) });
    return res.json();
  },
  async delete(tabla, id) {
    await fetch(`${SUPA_URL}/rest/v1/${tabla}?id=eq.${id}`, { method: "DELETE", headers });
  },
};

const MESAS = [
  { id: 1,  capacidad: 5, zona: "Sector Isla" },
  { id: 2,  capacidad: 5, zona: "Sector Isla" },
  { id: 3,  capacidad: 5, zona: "Sector Isla" },
  { id: 4,  capacidad: 5, zona: "Sector Isla" },
  { id: 5,  capacidad: 5, zona: "Sector Isla" },
  { id: 6,  capacidad: 5, zona: "Sector Isla" },
  { id: 7,  capacidad: 5, zona: "Sector Isla" },
  { id: 8,  capacidad: 5, zona: "Sector Isla" },
  ...Array.from({ length: 14 }, (_, i) => ({ id: i + 9,  capacidad: 5, zona: "Sector Pantallas" })),
  ...Array.from({ length: 12 }, (_, i) => ({ id: i + 23, capacidad: 5, zona: "Sector Escape" })),
  ...Array.from({ length: 22 }, (_, i) => ({ id: i + 35, capacidad: 5, zona: "Sector DJ" })),
];

const MESA_POS = {
  1:  { x: 88, y: 72 }, 2:  { x: 91, y: 62 }, 3:  { x: 84, y: 60 },
  4:  { x: 90, y: 51 }, 5:  { x: 82, y: 48 }, 6:  { x: 82, y: 36 },
  7:  { x: 89, y: 33 }, 8:  { x: 87, y: 24 },
  9:  { x: 78, y: 17 }, 10: { x: 73, y: 13 }, 11: { x: 68, y: 17 },
  12: { x: 63, y: 13 }, 13: { x: 58, y: 17 }, 14: { x: 53, y: 13 },
  15: { x: 48, y: 17 }, 16: { x: 43, y: 13 }, 17: { x: 38, y: 17 },
  18: { x: 33, y: 13 }, 19: { x: 31, y: 18 }, 20: { x: 28, y: 13 },
  21: { x: 25, y: 18 }, 22: { x: 23, y: 13 },
  23: { x: 30, y: 27 },
  24: { x: 30, y: 35 }, 25: { x: 23, y: 35 }, 26: { x: 16, y: 35 },
  27: { x: 30, y: 43 }, 28: { x: 23, y: 43 }, 29: { x: 16, y: 43 },
  30: { x: 30, y: 52 }, 31: { x: 23, y: 52 }, 32: { x: 16, y: 52 },
  33: { x: 23, y: 61 }, 34: { x: 16, y: 61 },
  35: { x: 24, y: 72 }, 36: { x: 24, y: 79 },
  37: { x: 17, y: 83 }, 38: { x: 17, y: 91 },
  39: { x: 31, y: 72 }, 40: { x: 31, y: 79 },
  41: { x: 31, y: 87 }, 42: { x: 31, y: 95 },
  43: { x: 40, y: 79 }, 44: { x: 40, y: 87 }, 45: { x: 40, y: 95 },
  46: { x: 50, y: 79 }, 47: { x: 50, y: 87 }, 48: { x: 60, y: 79 },
  49: { x: 60, y: 87 }, 50: { x: 50, y: 95 },
  51: { x: 70, y: 81 }, 52: { x: 70, y: 89 }, 53: { x: 70, y: 97 },
  54: { x: 80, y: 79 }, 55: { x: 80, y: 88 }, 56: { x: 80, y: 97 },
};

const SECTORES = ["Sector Isla", "Sector Pantallas", "Sector Escape", "Sector DJ"];

const fechaNoche = () => {
  // Usar hora local del navegador, no UTC
  const ahora = new Date();
  const horaLocal = ahora.getHours();
  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, "0");
  const day = String(ahora.getDate()).padStart(2, "0");
  const hoy = `${year}-${month}-${day}`;
  if (horaLocal < 5) {
    // Antes de las 5am, la noche corresponde al día anterior
    const ayer = new Date(ahora);
    ayer.setDate(ayer.getDate() - 1);
    const y = ayer.getFullYear();
    const m = String(ayer.getMonth() + 1).padStart(2, "0");
    const d = String(ayer.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return hoy;
};

const today = fechaNoche;
const ADMIN_DEFAULT = { id: "admin", usuario: "admin", password: "admin123", rol: "admin", nombre: "Administrador" };

const inp = {
  width: "100%", background: "#1a1508", border: "1px solid #2a2010",
  borderRadius: 3, color: "#e8dcc8", padding: "9px 12px",
  fontFamily: "'Georgia', serif", fontSize: 14, outline: "none", boxSizing: "border-box",
};

const btn = (v = "gold") => ({
  background: v === "gold" ? "#b8914a" : v === "danger" ? "#7a2020" : "none",
  color: v === "gold" ? "#0f0e0c" : "#f5e6c8",
  border: v === "ghost" ? "1px solid #3a2e1a" : "none",
  padding: "9px 18px", borderRadius: 3, cursor: "pointer",
  fontFamily: "'Georgia', serif", fontSize: 14,
  fontWeight: v === "gold" ? "bold" : "normal",
});

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7a6a50", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a3a22" }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
      <div>Cargando...</div>
    </div>
  );
}

function parsearLinea(linea) {
  const partes = linea.trim().split(/\s+/);
  if (partes.length < 1) return null;
  const rutIndex = partes.findIndex(p => /[.\-]/.test(p) || /^\d{6,8}[kK\d]$/.test(p));
  if (rutIndex === -1) {
    // No hay RUT — todo es nombre y apellido
    return { nombre: partes[0] || "", apellido: partes.slice(1).join(" ") || "", rut: "" };
  }
  return { nombre: partes[0] || "", apellido: partes.slice(1, rutIndex).join(" ") || "", rut: partes[rutIndex] };
}

function tieneRut(linea) {
  const partes = linea.trim().split(/\s+/);
  return partes.some(p => /[.\-]/.test(p) || /^\d{6,8}[kK\d]$/.test(p));
}

function parsearTodosClientes(texto) {
  const lineas = texto.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const combinadas = [];
  let i = 0;
  while (i < lineas.length) {
    const lineaActual = lineas[i];
    const siguienteLinea = lineas[i + 1];
    if (!tieneRut(lineaActual) && siguienteLinea && tieneRut(siguienteLinea)) {
      combinadas.push(`${lineaActual} ${siguienteLinea}`);
      i += 2;
    } else {
      combinadas.push(lineaActual);
      i++;
    }
  }
  return combinadas.map(parsearLinea).filter(Boolean);
}

function normalizarRut(rut) {
  // Elimina puntos, espacios y guiones para comparar solo los dígitos + dv
  return (rut || "").toLowerCase().trim().replace(/\./g, "").replace(/\s/g, "").replace(/-/g, "");
}

function normalizarTexto(s) {
  return (s || "").toLowerCase().trim()
    .normalize("NFD").replace(/[̀-ͯ]/g, ""); // quita tildes
}

function validarRut(rut) {
  if (!rut || rut.trim() === "") return false;
  const rutLimpio = rut.toLowerCase().trim().replace(/\./g, "").replace(/\s/g, "");
  if (!/^\d{7,8}-[\dk]$/.test(rutLimpio)) return false;
  const [numero, dv] = rutLimpio.split("-");
  let suma = 0;
  let multiplo = 2;
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const dvEsperado = 11 - (suma % 11);
  const dvCalc = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "k" : String(dvEsperado);
  return dvCalc === dv;
}

function estaEnListaNegra(cliente, listaNegra) {
  if (!Array.isArray(listaNegra)) return null;
  return listaNegra.find(ln => {
    const rutCliente = normalizarRut(cliente.rut);
    const rutLn = normalizarRut(ln.rut);
    const rutCoincide = rutCliente !== "" && rutLn !== "" && rutCliente === rutLn;

    const nombreCliente = normalizarTexto(cliente.nombre);
    const apellidoCliente = normalizarTexto(cliente.apellido);
    const nombreLn = normalizarTexto(ln.nombre);
    const apellidoLn = normalizarTexto(ln.apellido);
    const nombreCoincide = nombreCliente !== "" && apellidoCliente !== "" &&
      nombreCliente === nombreLn && apellidoCliente === apellidoLn;

    return rutCoincide || nombreCoincide;
  }) || null;
}

function FloorMap({ reservas, fecha, onMesaClick, mesaSeleccionada, soloZona }) {
  const ocupadas = reservas.filter(r => r.fecha === fecha).map(r => r.mesa_id);
  const [tooltip, setTooltip] = useState(null);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        {[["#d4a017","#fbbf24","Disponible"],["#cb7e7e","#ff4444","Ocupada"],["#f5e6c8","#f5d060","Seleccionada"]].map(([bg, bd, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9a8a6a" }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: bg, border: `1px solid ${bd}` }} />{label}
          </div>
        ))}
      </div>
      <div style={{ position: "relative", width: "100%", paddingBottom: "70%", background: "linear-gradient(160deg, #1a0a2e 0%, #0f0a20 40%, #0a0a1a 100%)", border: "1px solid #2a1a4a", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "2%", left: "20%", width: "60%", height: "8%", background: "#3b1f6a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "#c4b5fd", letterSpacing: 3, textTransform: "uppercase" }}>Sector Pantalla</span>
        </div>
        <div style={{ position: "absolute", top: "10%", left: "18%", width: "65%", height: "13%", background: "rgba(109,40,217,0.3)", border: "1px solid rgba(109,40,217,0.5)", borderRadius: 4 }}>
          <span style={{ position: "absolute", left: 6, top: 4, fontSize: 9, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 2 }}>Sector Pantallas</span>
        </div>
        <div style={{ position: "absolute", top: "20%", right: "2%", width: "16%", height: "55%", background: "rgba(192,38,160,0.25)", border: "1px solid rgba(192,38,160,0.5)", borderRadius: 6 }}>
          <span style={{ position: "absolute", top: 6, left: 4, fontSize: 9, color: "#f0abfc", textTransform: "uppercase", letterSpacing: 1 }}>Sector<br />Isla</span>
        </div>
        <div style={{ position: "absolute", top: "25%", left: "28%", width: "48%", height: "38%", background: "rgba(80,80,80,0.15)", border: "1px dashed rgba(150,150,150,0.2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(200,200,200,0.3)", letterSpacing: 4, textTransform: "uppercase" }}>General</span>
        </div>
        <div style={{ position: "absolute", top: "22%", left: "2%", width: "26%", height: "45%", background: "rgba(37,99,235,0.25)", border: "1px solid rgba(37,99,235,0.4)", borderRadius: 6 }}>
          <span style={{ position: "absolute", top: 6, left: 6, fontSize: 9, color: "#93c5fd", textTransform: "uppercase", letterSpacing: 1 }}>Sector Escape</span>
        </div>
        <div style={{ position: "absolute", top: "63%", left: "2%", width: "12%", height: "7%", background: "rgba(34,197,94,0.4)", border: "1px solid #22c55e", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 7, color: "#86efac", textAlign: "center" }}>Salida<br />Emerg.</span>
        </div>
        <div style={{ position: "absolute", top: "63%", left: "28%", width: "35%", height: "12%", background: "rgba(30,58,138,0.5)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "#93c5fd", letterSpacing: 3, textTransform: "uppercase" }}>Sector DJ</span>
        </div>
        <div style={{ position: "absolute", top: "72%", left: "0%", width: "12%", height: "26%", background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 9, color: "#d8b4fe", textTransform: "uppercase", letterSpacing: 1 }}>Bar</span>
        </div>
        <div style={{ position: "absolute", top: "75%", left: "12%", width: "86%", height: "24%", background: "rgba(30,58,138,0.2)", border: "1px solid rgba(30,58,138,0.4)", borderRadius: 4 }}>
          <span style={{ position: "absolute", bottom: 4, right: 8, fontSize: 9, color: "#60a5fa", textTransform: "uppercase", letterSpacing: 2 }}>Sector DJ</span>
        </div>
        {MESAS.map(mesa => {
          const pos = MESA_POS[mesa.id];
          if (!pos) return null;
          const estaEnZona = !soloZona || mesa.zona === soloZona;
          const ocupada = ocupadas.includes(mesa.id);
          const seleccionada = mesaSeleccionada === mesa.id;
          return (
            <div key={mesa.id}
              onClick={() => !ocupada && estaEnZona && onMesaClick && onMesaClick(mesa.id)}
              onMouseEnter={() => setTooltip(mesa.id)}
              onMouseLeave={() => setTooltip(null)}
              style={{
                position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`,
                transform: "translate(-50%, -50%)", width: 22, height: 22, borderRadius: 4,
                background: seleccionada ? "#f5d060" : ocupada ? "#7f1d1d" : "#b8860b",
                border: seleccionada ? "2px solid #fbbf24" : ocupada ? "1px solid #ef4444" : "1px solid #fbbf24",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: "bold",
                color: seleccionada ? "#0f0e0c" : ocupada ? "#fca5a5" : "#fff",
                cursor: (ocupada || !estaEnZona) ? "not-allowed" : onMesaClick ? "pointer" : "default",
                transition: "all 0.15s", zIndex: seleccionada ? 10 : 2,
                opacity: estaEnZona ? 1 : 0.25,
                boxShadow: seleccionada ? "0 0 8px #fbbf24" : ocupada ? "0 0 4px rgba(239,68,68,0.4)" : "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              {mesa.id}
              {tooltip === mesa.id && (
                <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "#1a1208", border: "1px solid #3a2e1a", borderRadius: 4, padding: "5px 10px", whiteSpace: "nowrap", fontSize: 11, color: "#e8dcc8", pointerEvents: "none", zIndex: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" }}>
                  Mesa {mesa.id} · {mesa.zona}<br />
                  <span style={{ color: ocupada ? "#f87171" : "#7ecb7e" }}>{ocupada ? "Ocupada" : "Disponible"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [adminCreds, setAdminCreds] = useState(null);

  useEffect(() => {
    db.get("admin_config", "select=*").then(data => { if (data && data.length > 0) setAdminCreds(data[0]); }).catch(() => {});
  }, []);

  const handleLogin = async () => {
    setCargando(true); setError("");
    const adminUsuario = adminCreds?.usuario || ADMIN_DEFAULT.usuario;
    const adminPassword = adminCreds?.password || ADMIN_DEFAULT.password;
    if (usuario === adminUsuario && password === adminPassword) { setCargando(false); return onLogin({ ...ADMIN_DEFAULT, usuario: adminUsuario }); }
    try {
      const data = await db.get("usuarios", `usuario=eq.${usuario}&password=eq.${password}&select=*`);
      if (data.length === 0) setError("Usuario o contraseña incorrectos.");
      else if (!data[0].activo) setError("Tu cuenta está desactivada. Contacta al administrador.");
      else onLogin({ ...data[0], rol: "garzon" });
    } catch { setError("Error de conexión. Intenta de nuevo."); }
    setCargando(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0806", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 8, color: "#b8914a", textTransform: "uppercase", marginBottom: 12 }}>Sistema de Reservas</div>
        <h1 style={{ fontSize: 34, fontWeight: "normal", color: "#f5e6c8", margin: "0 0 4px", letterSpacing: 2 }}>🎶 Calafate</h1>
        <div style={{ fontSize: 12, color: "#4a3a22", marginBottom: 44, letterSpacing: 4, textTransform: "uppercase" }}>Discoteca</div>
        <div style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 8, padding: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Usuario"><input value={usuario} onChange={e => { setUsuario(e.target.value); setError(""); }} placeholder="Tu usuario" style={inp} onKeyDown={e => e.key === "Enter" && handleLogin()} /></Field>
            <Field label="Contraseña"><input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" style={inp} onKeyDown={e => e.key === "Enter" && handleLogin()} /></Field>
            {error && <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>{error}</div>}
            <button onClick={handleLogin} disabled={cargando} style={{ ...btn("gold"), padding: "12px", fontSize: 15, letterSpacing: 1, opacity: cargando ? 0.7 : 1 }}>{cargando ? "Ingresando..." : "Ingresar"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeleccionSector({ sesion, onSectorElegido }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0806", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#b8914a", textTransform: "uppercase", marginBottom: 8 }}>Bienvenida</div>
        <h2 style={{ fontSize: 24, fontWeight: "normal", color: "#f5e6c8", marginBottom: 4 }}>{sesion.nombre}</h2>
        <p style={{ color: "#7a6a50", fontSize: 14, marginBottom: 36 }}>¿Cuál es tu sector esta noche?</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {SECTORES.map(sector => (
            <button key={sector} onClick={() => onSectorElegido(sector)}
              style={{ background: "#15120a", border: "1px solid #3a2e1a", borderRadius: 8, padding: "22px 16px", cursor: "pointer", fontFamily: "'Georgia', serif", color: "#f5e6c8", fontSize: 15, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#b8914a"; e.currentTarget.style.color = "#fbbf24"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#3a2e1a"; e.currentTarget.style.color = "#f5e6c8"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{sector === "Sector Isla" ? "🏝️" : sector === "Sector Pantallas" ? "📺" : sector === "Sector Escape" ? "🚪" : "🎧"}</div>
              {sector}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState("garzones");
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState({ nombre: "", usuario: "", password: "" });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [adminForm, setAdminForm] = useState({ usuario: "", password: "", confirmar: "" });
  const [adminError, setAdminError] = useState("");
  const [listaNegra, setListaNegra] = useState([]);
  const [lnForm, setLnForm] = useState({ nombre: "", apellido: "", rut: "", motivo: "" });
  const [lnError, setLnError] = useState("");
  const [confirmarEliminarLn, setConfirmarEliminarLn] = useState(null);
  const [intentos, setIntentos] = useState([]);
  const [cargandoIntentos, setCargandoIntentos] = useState(false);
  const [logActividad, setLogActividad] = useState([]);
  const [cargandoLog, setCargandoLog] = useState(false);
  const [resumen, setResumen] = useState([]);
  const [cargandoResumen, setCargandoResumen] = useState(false);
  const [fechaResumen, setFechaResumen] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  });

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  useEffect(() => { cargarUsuarios(); }, []);
  useEffect(() => { if (tab === "listanegra") cargarListaNegra(); }, [tab]);
  useEffect(() => { if (tab === "intentos") cargarIntentos(); }, [tab]);
  useEffect(() => { if (tab === "log") cargarLog(); }, [tab]);
  useEffect(() => { if (tab === "resumen") cargarResumen(fechaResumen); }, [tab, fechaResumen]);

  const cargarUsuarios = async () => { setCargando(true); const data = await db.get("usuarios", "select=*&order=id.asc"); setUsuarios(data); setCargando(false); };
  const cargarListaNegra = async () => { const data = await db.get("lista_negra", "select=*&order=id.desc"); setListaNegra(data); };
  const cargarIntentos = async () => { setCargandoIntentos(true); const data = await db.get("intentos_bloqueados", "select=*&order=fecha_intento.desc"); setIntentos(data); setCargandoIntentos(false); };
  const marcarVisto = async (id) => { await db.patch("intentos_bloqueados", id, { visto: true }); cargarIntentos(); };
  const cargarLog = async () => { setCargandoLog(true); const data = await db.get("log_actividad", "select=*&order=fecha_accion.desc&limit=100"); setLogActividad(Array.isArray(data) ? data : []); setCargandoLog(false); };
  const sumarDias = (fechaStr, dias) => {
    const partes = fechaStr.split("-");
    const d = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    d.setDate(d.getDate() + dias);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const cargarResumen = async (desde) => {
    setCargandoResumen(true);
    const hasta = sumarDias(desde, 6);
    const data = await db.get("reservas", `fecha=gte.${desde}&fecha=lte.${hasta}&select=*&order=fecha.asc`);
    setResumen(Array.isArray(data) ? data : []);
    setCargandoResumen(false);
  };

  const guardar = async () => {
    if (!form.nombre.trim()) return setError("El nombre es obligatorio.");
    if (!form.usuario.trim()) return setError("El usuario es obligatorio.");
    if (!form.password.trim()) return setError("La contraseña es obligatoria.");
    if (editando) { await db.patch("usuarios", editando, { nombre: form.nombre.trim(), usuario: form.usuario.trim(), password: form.password.trim() }); flash("Usuario actualizado."); }
    else { await db.post("usuarios", { nombre: form.nombre.trim(), usuario: form.usuario.trim(), password: form.password.trim(), activo: true }); flash("Garzón creado."); }
    setForm({ nombre: "", usuario: "", password: "" }); setEditando(null); setError(""); cargarUsuarios();
  };

  const toggleActivo = async (u) => { await db.patch("usuarios", u.id, { activo: !u.activo }); cargarUsuarios(); };
  const eliminar = async (u) => { await db.delete("usuarios", u.id); setConfirmarEliminar(null); flash("Usuario eliminado."); cargarUsuarios(); };

  const guardarAdmin = async () => {
    if (!adminForm.usuario.trim()) return setAdminError("El usuario es obligatorio.");
    if (!adminForm.password.trim()) return setAdminError("La contraseña es obligatoria.");
    if (adminForm.password !== adminForm.confirmar) return setAdminError("Las contraseñas no coinciden.");
    try {
      const existing = await db.get("admin_config", "select=*");
      if (existing && existing.length > 0) await db.patch("admin_config", existing[0].id, { usuario: adminForm.usuario.trim(), password: adminForm.password.trim() });
      else await db.post("admin_config", { usuario: adminForm.usuario.trim(), password: adminForm.password.trim() });
      setAdminForm({ usuario: "", password: "", confirmar: "" }); setAdminError(""); flash("Credenciales actualizadas.");
    } catch { setAdminError("Error al guardar. Verifica que la tabla admin_config exista en Supabase."); }
  };

  const agregarListaNegra = async () => {
    if (!lnForm.nombre.trim()) return setLnError("El nombre es obligatorio.");
    if (!lnForm.apellido.trim()) return setLnError("El apellido es obligatorio.");
    if (!lnForm.rut.trim()) return setLnError("El RUT es obligatorio.");
    await db.post("lista_negra", { nombre: lnForm.nombre.trim(), apellido: lnForm.apellido.trim(), rut: lnForm.rut.trim(), motivo: lnForm.motivo.trim() });
    setLnForm({ nombre: "", apellido: "", rut: "", motivo: "" }); setLnError(""); flash("Persona agregada a lista negra."); cargarListaNegra();
  };

  const eliminarListaNegra = async (ln) => { await db.delete("lista_negra", ln.id); setConfirmarEliminarLn(null); flash("Persona removida de lista negra."); cargarListaNegra(); };

  const tabStyle = (t) => ({ background: "none", border: "none", borderBottom: tab === t ? "2px solid #b8914a" : "2px solid transparent", color: tab === t ? "#f5e6c8" : "#7a6a50", padding: "8px 14px", cursor: "pointer", fontFamily: "'Georgia', serif", fontSize: 13 });
  const intentosNuevos = intentos.filter(i => !i.visto).length;

  return (
    <div>
      {msg && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: "#2a4a2a", color: "#7ecb7e", border: "1px solid #4a8a4a", padding: "12px 20px", borderRadius: 4, fontSize: 14 }}>{msg}</div>}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#b8914a", textTransform: "uppercase", marginBottom: 4 }}>Panel de Administrador</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: "normal", color: "#f5e6c8" }}>Configuración</h2>
      </div>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #2a2010", marginBottom: 24, flexWrap: "wrap" }}>
        <button style={tabStyle("garzones")} onClick={() => setTab("garzones")}>Garzones</button>
        <button style={tabStyle("listanegra")} onClick={() => setTab("listanegra")}>Lista negra</button>
        <button style={{ ...tabStyle("intentos") }} onClick={() => setTab("intentos")}>
          Intentos bloqueados{intentosNuevos > 0 && <span style={{ marginLeft: 6, background: "#7a2020", color: "#fca5a5", fontSize: 10, padding: "1px 6px", borderRadius: 10, fontWeight: "bold" }}>{intentosNuevos}</span>}
        </button>
        <button style={tabStyle("resumen")} onClick={() => setTab("resumen")}>Resumen semanal</button>
        <button style={tabStyle("log")} onClick={() => setTab("log")}>Log de actividad</button>
        <button style={tabStyle("micuenta")} onClick={() => setTab("micuenta")}>Mi cuenta</button>
      </div>

      {tab === "garzones" && (
        <>
          <div style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 8, padding: 24, marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#b8914a", textTransform: "uppercase", marginBottom: 16 }}>{editando ? "Editar Garzón" : "Nuevo Garzón"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 16 }}>
              <Field label="Nombre completo"><input value={form.nombre} onChange={e => { setForm(p => ({ ...p, nombre: e.target.value })); setError(""); }} placeholder="Ej: Sofía Reyes" style={inp} /></Field>
              <Field label="Usuario"><input value={form.usuario} onChange={e => { setForm(p => ({ ...p, usuario: e.target.value })); setError(""); }} placeholder="Ej: garzon11" style={inp} /></Field>
              <Field label="Contraseña"><input value={form.password} onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(""); }} placeholder="Contraseña" style={inp} /></Field>
            </div>
            {error && <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={guardar} style={btn("gold")}>{editando ? "Guardar cambios" : "+ Agregar garzón"}</button>
              {editando && <button onClick={() => { setEditando(null); setForm({ nombre: "", usuario: "", password: "" }); setError(""); }} style={btn("ghost")}>Cancelar</button>}
            </div>
          </div>
          {cargando ? <Spinner /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {usuarios.map(u => (
                <div key={u.id} style={{ background: "#15120a", border: "1px solid #2a2010", borderLeft: `3px solid ${u.activo ? "#b8914a" : "#3a2a1a"}`, borderRadius: 6, padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, opacity: u.activo ? 1 : 0.55 }}>
                  <div>
                    <div style={{ fontSize: 15, color: "#f5e6c8", marginBottom: 2 }}>{u.nombre}</div>
                    <div style={{ fontSize: 12, color: "#7a6a50" }}>@{u.usuario} · <span style={{ color: u.activo ? "#7ecb7e" : "#9a5050" }}>{u.activo ? "Activo" : "Inactivo"}</span></div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => { setEditando(u.id); setForm({ nombre: u.nombre, usuario: u.usuario, password: u.password }); setError(""); }} style={{ ...btn("ghost"), fontSize: 12, padding: "5px 12px" }}>Editar</button>
                    <button onClick={() => toggleActivo(u)} style={{ ...btn("ghost"), fontSize: 12, padding: "5px 12px", color: u.activo ? "#cb9e50" : "#7ecb7e" }}>{u.activo ? "Desactivar" : "Activar"}</button>
                    <button onClick={() => setConfirmarEliminar(u)} style={{ ...btn("ghost"), fontSize: 12, padding: "5px 12px", color: "#9a5050", borderColor: "#4a2020" }}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "listanegra" && (
        <>
          <div style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 8, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#b8914a", textTransform: "uppercase", marginBottom: 16 }}>Agregar persona</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 14 }}>
              <Field label="Nombre"><input value={lnForm.nombre} onChange={e => { setLnForm(p => ({ ...p, nombre: e.target.value })); setLnError(""); }} placeholder="Nombre" style={inp} /></Field>
              <Field label="Apellido"><input value={lnForm.apellido} onChange={e => { setLnForm(p => ({ ...p, apellido: e.target.value })); setLnError(""); }} placeholder="Apellido" style={inp} /></Field>
              <Field label="RUT"><input value={lnForm.rut} onChange={e => { setLnForm(p => ({ ...p, rut: e.target.value })); setLnError(""); }} placeholder="12.345.678-9" style={inp} /></Field>
              <Field label="Motivo (opcional)"><input value={lnForm.motivo} onChange={e => setLnForm(p => ({ ...p, motivo: e.target.value }))} placeholder="Ej: Conducta agresiva" style={inp} /></Field>
            </div>
            {lnError && <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13, marginBottom: 12 }}>{lnError}</div>}
            <button onClick={agregarListaNegra} style={btn("gold")}>+ Agregar a lista negra</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {listaNegra.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "#4a3a22", border: "1px dashed #2a1e0a", borderRadius: 6 }}>Lista negra vacía</div>}
            {listaNegra.map(ln => (
              <div key={ln.id} style={{ background: "#1a0a0a", border: "1px solid #4a2020", borderLeft: "3px solid #7a2020", borderRadius: 6, padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 15, color: "#f5e6c8", marginBottom: 2 }}>{ln.nombre} {ln.apellido}</div>
                  <div style={{ fontSize: 12, color: "#7a6a50" }}>🪪 {ln.rut}{ln.motivo ? ` · ${ln.motivo}` : ""}</div>
                </div>
                <button onClick={() => setConfirmarEliminarLn(ln)} style={{ ...btn("ghost"), fontSize: 12, padding: "5px 12px", color: "#9a5050", borderColor: "#4a2020" }}>Remover</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "intentos" && (
        <div>
          {cargandoIntentos ? <Spinner /> : intentos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a3a22", border: "1px dashed #2a1e0a", borderRadius: 6 }}>
              <div style={{ fontSize: 38, marginBottom: 10 }}>🛡️</div>
              <div>Sin intentos bloqueados registrados</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {intentos.map(i => (
                <div key={i.id} style={{ background: i.visto ? "#15120a" : "#1a0808", border: `1px solid ${i.visto ? "#2a2010" : "#5a1a1a"}`, borderLeft: `3px solid ${i.visto ? "#3a2a1a" : "#cb3030"}`, borderRadius: 6, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, opacity: i.visto ? 0.6 : 1 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      {!i.visto && <span style={{ background: "#7a2020", color: "#fca5a5", fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>NUEVO</span>}
                      <span style={{ fontSize: 15, color: "#f5e6c8" }}>{i.cliente_nombre} {i.cliente_apellido}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#7a6a50" }}>
                      🪪 {i.cliente_rut} &nbsp;·&nbsp; 👤 Garzón: {i.garzon_nombre} &nbsp;·&nbsp; Mesa {i.mesa_id} &nbsp;·&nbsp; {new Date(i.fecha_intento).toLocaleString("es-CL")}
                    </div>
                    {i.fecha_reserva && <div style={{ fontSize: 12, color: "#9a5050", marginTop: 2 }}>📅 Intentó reservar para: {i.fecha_reserva}</div>}
                  </div>
                  {!i.visto && <button onClick={() => marcarVisto(i.id)} style={{ ...btn("ghost"), fontSize: 12, padding: "5px 12px" }}>Marcar visto</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "resumen" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
            <label style={{ color: "#7a6a50", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Desde:</label>
            <input type="date" value={fechaResumen} onChange={e => setFechaResumen(e.target.value)} style={{ ...inp, width: "auto" }} />
            <span style={{ fontSize: 12, color: "#5a4a30" }}>— mostrando 7 días</span>
          </div>
          {cargandoResumen ? <Spinner /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Reservas por noche */}
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#b8914a", textTransform: "uppercase", marginBottom: 12 }}>Reservas por noche</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const fecha = sumarDias(fechaResumen, i);
                    const cantidad = resumen.filter(r => r.fecha === fecha).length;
                    const max = Math.max(...Array.from({ length: 7 }, (_, j) => {
                      return resumen.filter(r => r.fecha === sumarDias(fechaResumen, j)).length;
                    }), 1);
                    const pct = Math.round((cantidad / max) * 100);
                    const partes = fecha.split("-");
                    const dLabel = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
                    const label = dLabel.toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" });
                    return (
                      <div key={fecha} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 90, fontSize: 12, color: "#7a6a50", textAlign: "right", flexShrink: 0 }}>{label}</div>
                        <div style={{ flex: 1, height: 24, background: "#1a1508", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "#b8914a", borderRadius: 4, transition: "width 0.3s", display: "flex", alignItems: "center", paddingLeft: 8 }}>
                            {cantidad > 0 && <span style={{ fontSize: 11, color: "#0f0e0c", fontWeight: "bold" }}>{cantidad}</span>}
                          </div>
                        </div>
                        {cantidad === 0 && <span style={{ fontSize: 12, color: "#3a2a1a" }}>0</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actividad por sector */}
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#b8914a", textTransform: "uppercase", marginBottom: 12 }}>Actividad por sector</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                  {["Sector Isla", "Sector Pantallas", "Sector Escape", "Sector DJ"].map(zona => {
                    const cantidad = resumen.filter(r => MESAS.find(m => m.id === r.mesa_id)?.zona === zona).length;
                    const emoji = zona === "Sector Isla" ? "🏝️" : zona === "Sector Pantallas" ? "📺" : zona === "Sector Escape" ? "🚪" : "🎧";
                    return (
                      <div key={zona} style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
                        <div style={{ fontSize: 11, color: "#7a6a50", marginBottom: 4 }}>{zona}</div>
                        <div style={{ fontSize: 26, fontWeight: "bold", color: "#b8914a" }}>{cantidad}</div>
                        <div style={{ fontSize: 11, color: "#5a4a30" }}>reservas</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ranking de garzones */}
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#b8914a", textTransform: "uppercase", marginBottom: 12 }}>Ranking de garzones</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(() => {
                    const conteo = {};
                    resumen.forEach(r => { if (r.garzon) conteo[r.garzon] = (conteo[r.garzon] || 0) + 1; });
                    const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
                    const maxVal = ranking[0]?.[1] || 1;
                    if (ranking.length === 0) return <div style={{ fontSize: 13, color: "#4a3a22" }}>Sin datos de garzones aún</div>;
                    return ranking.map(([nombre, cant], idx) => (
                      <div key={nombre} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 24, fontSize: 13, color: idx === 0 ? "#b8914a" : "#5a4a30", textAlign: "center", fontWeight: "bold" }}>{idx + 1}</div>
                        <div style={{ width: 120, fontSize: 13, color: "#e8dcc8", flexShrink: 0 }}>{nombre}</div>
                        <div style={{ flex: 1, height: 22, background: "#1a1508", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.round((cant / maxVal) * 100)}%`, background: idx === 0 ? "#b8914a" : "#3a2e1a", borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                            <span style={{ fontSize: 11, color: idx === 0 ? "#0f0e0c" : "#7a6a50", fontWeight: "bold" }}>{cant}</span>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {tab === "log" && (
        <div>
          {cargandoLog ? <Spinner /> : logActividad.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a3a22", border: "1px dashed #2a1e0a", borderRadius: 6 }}>
              <div style={{ fontSize: 38, marginBottom: 10 }}>📋</div>
              <div>Sin actividad registrada</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {logActividad.map(l => (
                <div key={l.id} style={{ background: "#15120a", border: "1px solid #2a2010", borderLeft: `3px solid ${l.accion === "CANCELACION" ? "#7a2020" : "#b8914a"}`, borderRadius: 6, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: "bold", background: l.accion === "CANCELACION" ? "#7a2020" : "#2a4a2a", color: l.accion === "CANCELACION" ? "#fca5a5" : "#7ecb7e" }}>{l.accion}</span>
                      <span style={{ fontSize: 14, color: "#f5e6c8" }}>👤 {l.garzon}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#7a6a50" }}>{l.detalle}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#5a4a30" }}>{new Date(l.fecha_accion).toLocaleString("es-CL")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "micuenta" && (
        <div style={{ maxWidth: 420 }}>
          <div style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 8, padding: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#b8914a", textTransform: "uppercase", marginBottom: 16 }}>Cambiar credenciales de administrador</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Nuevo usuario"><input value={adminForm.usuario} onChange={e => { setAdminForm(p => ({ ...p, usuario: e.target.value })); setAdminError(""); }} placeholder="Nuevo usuario" style={inp} /></Field>
              <Field label="Nueva contraseña"><input type="password" value={adminForm.password} onChange={e => { setAdminForm(p => ({ ...p, password: e.target.value })); setAdminError(""); }} placeholder="Nueva contraseña" style={inp} /></Field>
              <Field label="Confirmar contraseña"><input type="password" value={adminForm.confirmar} onChange={e => { setAdminForm(p => ({ ...p, confirmar: e.target.value })); setAdminError(""); }} placeholder="Repetir contraseña" style={inp} /></Field>
              {adminError && <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>{adminError}</div>}
              <button onClick={guardarAdmin} style={btn("gold")}>Guardar cambios</button>
              <div style={{ fontSize: 12, color: "#5a4a30" }}>⚠️ Asegúrate de recordar las nuevas credenciales antes de guardar.</div>
            </div>
          </div>
        </div>
      )}

      {confirmarEliminar && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#15120a", border: "1px solid #3a2e1a", borderRadius: 8, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 17, color: "#f5e6c8", marginBottom: 8 }}>Eliminar usuario</div>
            <div style={{ fontSize: 14, color: "#7a6a50", marginBottom: 24 }}>¿Eliminar a <strong style={{ color: "#e8dcc8" }}>{confirmarEliminar.nombre}</strong> permanentemente?</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => eliminar(confirmarEliminar)} style={btn("danger")}>Sí, eliminar</button>
              <button onClick={() => setConfirmarEliminar(null)} style={btn("ghost")}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {confirmarEliminarLn && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#15120a", border: "1px solid #3a2e1a", borderRadius: 8, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 17, color: "#f5e6c8", marginBottom: 8 }}>Remover de lista negra</div>
            <div style={{ fontSize: 14, color: "#7a6a50", marginBottom: 24 }}>¿Remover a <strong style={{ color: "#e8dcc8" }}>{confirmarEliminarLn.nombre} {confirmarEliminarLn.apellido}</strong> de la lista negra?</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => eliminarListaNegra(confirmarEliminarLn)} style={btn("danger")}>Sí, remover</button>
              <button onClick={() => setConfirmarEliminarLn(null)} style={btn("ghost")}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservasApp({ sesion, sectorSesion, onLogout, onCambiarSector }) {
  const [vista, setVista] = useState("dia");
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(today());
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [reservaExpandida, setReservaExpandida] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [textoCliente, setTextoCliente] = useState("");
  const [clientesParsed, setClientesParsed] = useState([]);
  const [alertaListaNegra, setAlertaListaNegra] = useState([]);
  const [listaNegra, setListaNegra] = useState([]);
  const [form, setForm] = useState({ fecha: today(), mesa_id: "", nota: "Reserva" });
  const [error, setError] = useState("");
  const [exitoMsg, setExitoMsg] = useState("");

  const flash = (t) => { setExitoMsg(t); setTimeout(() => setExitoMsg(""), 3000); };

  useEffect(() => { cargarReservas(); cargarListaNegra(); }, [fechaSeleccionada]);

  const cargarReservas = async () => { setCargando(true); const data = await db.get("reservas", `fecha=eq.${fechaSeleccionada}&select=*&order=nombre.asc`); setReservas(data); setCargando(false); };
  const cargarListaNegra = async () => { const data = await db.get("lista_negra", "select=*"); setListaNegra(Array.isArray(data) ? data : []); };

  const reservasPorSector = useMemo(() => sesion.rol === "admin" ? reservas : reservas.filter(r => { const mesa = MESAS.find(m => m.id === r.mesa_id); return mesa?.zona === sectorSesion; }), [reservas, sesion.rol, sectorSesion]);

  const reservasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return reservasPorSector;
    const q = busqueda.toLowerCase().trim();
    return reservasPorSector.filter(r => {
      const participantes = Array.isArray(r.participantes) ? r.participantes : [];
      const enTitular = `${r.nombre} ${r.apellido} ${r.rut}`.toLowerCase().includes(q);
      const enParticipantes = participantes.some(p => `${p.nombre} ${p.apellido} ${p.rut}`.toLowerCase().includes(q));
      return enTitular || enParticipantes;
    });
  }, [reservasPorSector, busqueda]);
  const mesasDisponibles = () => { const ocupadas = reservas.map(r => r.mesa_id); return MESAS.filter(m => !ocupadas.includes(m.id)); };

  const handlePasteCliente = async (texto) => {
    setTextoCliente(texto);
    setAlertaListaNegra([]);
    if (!texto.trim()) { setClientesParsed([]); return; }
    const clientes = parsearTodosClientes(texto);
    setClientesParsed(clientes);
    // Validar máximo de personas
    if (clientes.length > 5) {
      setError(`⚠️ Máximo 5 personas por mesa. Tienes ${clientes.length}.`);
      return;
    }
    // Validar RUTs - obligatorio y válido
    const sinRut = clientes.filter(c => !c.rut || c.rut.trim() === "");
    const rutsInvalidos = clientes.filter(c => c.rut && c.rut.trim() !== "" && !validarRut(c.rut));
    if (sinRut.length > 0) {
      setError(`⚠️ RUT obligatorio: ${sinRut.map(c => `${c.nombre} ${c.apellido}`).join(", ")} no tiene RUT.`);
    } else if (rutsInvalidos.length > 0) {
      setError(`⚠️ RUT inválido: ${rutsInvalidos.map(c => `${c.nombre} ${c.apellido} (${c.rut})`).join(", ")}`);
    } else {
      setError("");
    }
    // Cargar lista negra fresca desde Supabase en cada verificación
    const lnFresh = await db.get("lista_negra", "select=*");
    const lnArray = Array.isArray(lnFresh) ? lnFresh : [];
    setListaNegra(lnArray);
    const bloqueados = clientes.map(c => ({ cliente: c, match: estaEnListaNegra(c, lnArray) })).filter(x => x.match);
    setAlertaListaNegra(bloqueados);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === "fecha" ? { mesa_id: "" } : {}) }));
    setError("");
  };

  const handleSubmit = async () => {
    if (clientesParsed.length === 0) return setError("Pega los datos del cliente en el cuadro de texto.");
    const titular = clientesParsed[0];
    if (!titular.nombre) return setError("No se pudo identificar el nombre del titular.");
    if (!titular.rut) return setError("No se pudo identificar el RUT del titular.");
    if (!form.mesa_id) return setError("Selecciona una mesa en el mapa.");
    // Validar máximo de personas
    if (clientesParsed.length > 5) return setError(`⚠️ Máximo 5 personas por mesa. Tienes ${clientesParsed.length}.`);
    // Validar RUTs - obligatorio y válido
    const sinRut = clientesParsed.filter(c => !c.rut || c.rut.trim() === "");
    if (sinRut.length > 0) return setError(`⚠️ RUT obligatorio: ${sinRut.map(c => `${c.nombre} ${c.apellido}`).join(", ")} no tiene RUT.`);
    const rutsInvalidos = clientesParsed.filter(c => !validarRut(c.rut));
    if (rutsInvalidos.length > 0) return setError(`⚠️ RUT inválido: ${rutsInvalidos.map(c => `${c.nombre} ${c.apellido} (${c.rut})`).join(", ")}`);
    // Verificar lista negra nuevamente al momento de confirmar
    const lnFinal = await db.get("lista_negra", "select=*");
    const lnFinalArray = Array.isArray(lnFinal) ? lnFinal : [];
    const bloqueadosFinal = clientesParsed.map(c => ({ cliente: c, match: estaEnListaNegra(c, lnFinalArray) })).filter(x => x.match);
    if (bloqueadosFinal.length > 0) setAlertaListaNegra(bloqueadosFinal);

    if (bloqueadosFinal.length > 0) {
      // Registrar intento bloqueado
      for (const x of bloqueadosFinal) {
        await db.post("intentos_bloqueados", {
          cliente_nombre: x.cliente.nombre, cliente_apellido: x.cliente.apellido,
          cliente_rut: x.cliente.rut, garzon_nombre: sesion.nombre,
          fecha_reserva: form.fecha, mesa_id: parseInt(form.mesa_id), visto: false,
        });
      }
      return setError(`🚫 Reserva bloqueada: ${bloqueadosFinal.map(x => `${x.cliente.nombre} ${x.cliente.apellido}`).join(", ")} está en lista negra. Se notificó al administrador.`);
    }
    const mesa = MESAS.find(m => m.id === parseInt(form.mesa_id));
    if (parseInt(form.personas) > mesa.capacidad) return setError(`Mesa ${mesa.id}: máximo ${mesa.capacidad} personas.`);
    const yaReservada = reservas.some(r => r.mesa_id === parseInt(form.mesa_id) && r.fecha === form.fecha);
    if (yaReservada) return setError(`La mesa ${form.mesa_id} ya tiene una reserva para esa noche.`);

    await db.post("reservas", {
      nombre: titular.nombre, apellido: titular.apellido, rut: titular.rut,
      fecha: form.fecha, hora: "23:30", personas: clientesParsed.length,
      mesa_id: parseInt(form.mesa_id), nota: form.nota.trim(),
      participantes: clientesParsed.slice(1),
      garzon: sesion.nombre,
    });
    const fechaReserva = form.fecha;
    setTextoCliente(""); setClientesParsed([]); setAlertaListaNegra([]);
    setForm({ fecha: today(), mesa_id: "", nota: "Reserva" });
    // Cargar reservas directamente antes de cambiar de vista
    setCargando(true);
    const dataFresh = await db.get("reservas", `fecha=eq.${fechaReserva}&select=*&order=nombre.asc`);
    setReservas(dataFresh);
    setCargando(false);
    setFechaSeleccionada(fechaReserva);
    setVista("dia");
    await registrarLog("RESERVA", `Mesa ${form.mesa_id} — ${titular.nombre} ${titular.apellido} (${titular.rut}), ${clientesParsed.length} persona(s)`);
    flash("¡Reserva creada correctamente!");
  };

  const registrarLog = async (accion, detalle) => {
    try {
      await db.post("log_actividad", { accion, garzon: sesion.nombre, detalle });
    } catch {}
  };

  const cancelarReserva = async () => {
    const r = reservaAEliminar;
    await db.delete("reservas", r.id);
    await registrarLog("CANCELACION", `Mesa ${r.mesa_id} — ${r.nombre} ${r.apellido} (${r.rut})`);
    setReservaAEliminar(null);
    flash("Reserva cancelada.");
    cargarReservas();
  };

  const exportarPDF = () => {
    const fecha = new Date(fechaSeleccionada + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const filas = reservasFiltradas.map(r => {
      const mesa = MESAS.find(m => m.id === r.mesa_id);
      const participantes = Array.isArray(r.participantes) ? r.participantes : [];
      const participantesHtml = participantes.length > 0
        ? `<div style="margin-top:4px;padding-left:12px;font-size:11px;color:#555">${participantes.map((p, i) => `${i + 2}. ${p.nombre} ${p.apellido} — ${p.rut}`).join("<br/>")}</div>`
        : "";
      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #ddd;font-weight:bold">${r.mesa_id}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd">${mesa?.zona || ""}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd">
            <strong>${r.nombre} ${r.apellido}</strong><br/>
            <span style="font-size:11px;color:#666">${r.rut}</span>
            ${participantesHtml}
          </td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center">${r.personas}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;font-size:11px;color:#666">${r.nota || ""}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;font-size:11px;color:#666">${r.garzon || ""}</td>
        </tr>`;
    }).join("");

    const html = `
      <html><head><meta charset="utf-8">
      <title>Reservas Calafate ${fechaSeleccionada}</title>
      <style>
        body { font-family: Georgia, serif; padding: 30px; color: #222; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 14px; font-weight: normal; color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1a1208; color: #f5e6c8; padding: 10px 8px; text-align: left; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
        tr:nth-child(even) { background: #f9f6f0; }
        .footer { margin-top: 20px; font-size: 11px; color: #999; }
      </style>
      </head><body>
      <h1>🎶 Calafate Discoteca</h1>
      <h2>Reservas del ${fecha}${sectorSesion && sesion.rol !== "admin" ? ` · ${sectorSesion}` : ""} — ${reservasFiltradas.length} reservas</h2>
      <table>
        <thead><tr>
          <th>Mesa</th><th>Sector</th><th>Titular / Participantes</th><th>Pers.</th><th>Nota</th><th>Garzón</th>
        </tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <div class="footer">Generado el ${new Date().toLocaleString("es-CL")}</div>
      </body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const tabs = [
    { key: "dia", label: "Reservas del día" },
    { key: "mapa", label: "Mapa del local" },
    ...(sesion.rol === "admin" ? [{ key: "admin", label: "⚙ Configuración" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e0c", fontFamily: "'Georgia', serif", color: "#e8dcc8" }}>
      <div style={{ background: "linear-gradient(180deg, #1a1208 0%, #0f0e0c 100%)", borderBottom: "1px solid #3a2e1a", padding: "20px 24px 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 6, color: "#b8914a", textTransform: "uppercase", marginBottom: 4 }}>Sistema de Reservas</div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: "normal", color: "#f5e6c8", letterSpacing: 1 }}>🎶 Calafate</h1>
              </div>
              {sesion.rol !== "admin" && (
                <button onClick={onCambiarSector} title="Cambiar sector" style={{ background: "none", border: "1px solid #3a2e1a", borderRadius: 6, fontSize: 20, padding: "6px 10px", color: "#b8914a", cursor: "pointer", marginTop: 6 }}>🏠</button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#f5e6c8" }}>{sesion.nombre}</div>
                <div style={{ fontSize: 10, color: "#7a6a50", textTransform: "uppercase", letterSpacing: 1 }}>{sesion.rol === "admin" ? "Administrador" : sectorSesion}</div>
              </div>
              <button onClick={() => { setVista("formulario"); setError(""); }} style={{ ...btn("gold"), padding: "8px 16px", fontSize: 13 }}>+ Nueva Reserva</button>
              <button onClick={onLogout} style={{ ...btn("ghost"), fontSize: 12, padding: "7px 14px", color: "#7a6a50" }}>Salir</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 18 }}>
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setVista(tab.key)} style={{ background: "none", border: "none", borderBottom: vista === tab.key ? "2px solid #b8914a" : "2px solid transparent", color: vista === tab.key ? "#f5e6c8" : "#7a6a50", padding: "10px 20px", cursor: "pointer", fontFamily: "'Georgia', serif", fontSize: 14 }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {exitoMsg && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: "#2a4a2a", color: "#7ecb7e", border: "1px solid #4a8a4a", padding: "12px 20px", borderRadius: 4, fontSize: 14 }}>{exitoMsg}</div>}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>

        {vista === "dia" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
              <label style={{ color: "#7a6a50", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Fecha:</label>
              <input type="date" value={fechaSeleccionada} onChange={e => setFechaSeleccionada(e.target.value)} style={{ ...inp, width: "auto" }} />
              <button onClick={exportarPDF} title="Exportar PDF" style={{ background: "#7a2020", border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>📄</button>
              <span style={{ background: "#2a1e0a", border: "1px solid #3a2e1a", color: "#b8914a", padding: "5px 14px", borderRadius: 20, fontSize: 13 }}>
                {busqueda ? `${reservasFiltradas.length} de ${reservasPorSector.length} reservas` : `${reservasFiltradas.length} reservas${sectorSesion && sesion.rol !== "admin" ? ` · ${sectorSesion}` : ""}`}
              </span>
              <button onClick={cargarReservas} style={{ ...btn("ghost"), fontSize: 12, padding: "5px 12px" }}>↻ Actualizar</button>

            </div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, apellido o RUT..."
                style={{ ...inp, paddingLeft: 36 }}
              />
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#5a4a30", fontSize: 15 }}>🔍</span>
              {busqueda && (
                <button onClick={() => setBusqueda("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7a6a50", cursor: "pointer", fontSize: 16 }}>✕</button>
              )}
            </div>
            {cargando ? <Spinner /> : reservasFiltradas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a3a22", border: "1px dashed #2a1e0a", borderRadius: 6 }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>📅</div>
                <div>{busqueda ? `Sin resultados para "${busqueda}"` : `Sin reservas para este día${sectorSesion && sesion.rol !== "admin" ? ` en ${sectorSesion}` : ""}`}</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {reservasFiltradas.map(r => {
                  const mesa = MESAS.find(m => m.id === r.mesa_id);
                  const expandida = reservaExpandida === r.id;
                  const participantes = Array.isArray(r.participantes) ? r.participantes : [];
                  return (
                    <div key={r.id} style={{ background: "#15120a", border: "1px solid #2a2010", borderLeft: "3px solid #b8914a", borderRadius: 6, overflow: "hidden" }}>
                      <div onClick={() => setReservaExpandida(expandida ? null : r.id)} style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, cursor: "pointer" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ background: "#1e1608", border: "1px solid #3a2e1a", borderRadius: 4, padding: "6px 14px", textAlign: "center", minWidth: 58 }}>
                            <div style={{ fontSize: 16, color: "#f5e6c8", fontWeight: "bold" }}>23:30</div>
                          </div>
                          <div style={{ background: "#1e1608", border: "1px solid #b8914a", borderRadius: 4, padding: "6px 14px", textAlign: "center", minWidth: 58 }}>
                            <div style={{ fontSize: 10, color: "#b8914a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Mesa</div>
                            <div style={{ fontSize: 16, color: "#f5e6c8", fontWeight: "bold" }}>{r.mesa_id}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 15, color: "#f5e6c8", marginBottom: 3 }}>
                              {r.nombre} {r.apellido}
                              {participantes.length > 0 && (
                                <span style={{ marginLeft: 8, fontSize: 11, color: "#b8914a", background: "#2a1e0a", padding: "2px 8px", borderRadius: 10 }}>
                                  +{participantes.length} participante{participantes.length > 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: "#7a6a50" }}>
                              🪪 {r.rut} &nbsp;·&nbsp; 👥 {r.personas} pers. &nbsp;·&nbsp;
                              <span style={{ color: "#7a6a50" }}>{mesa?.zona}</span>
                              {r.garzon && <span> &nbsp;·&nbsp; 👤 {r.garzon}</span>}
                            </div>
                            {r.nota && <div style={{ fontSize: 12, color: "#b8914a", marginTop: 3 }}>📝 {r.nota}</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 13, color: "#5a4a30" }}>{expandida ? "▲" : "▼"}</span>
                          <button onClick={e => { e.stopPropagation(); setReservaAEliminar(r); }} style={{ ...btn("ghost"), fontSize: 12, padding: "6px 14px", color: "#9a5050", borderColor: "#4a2020" }}>Cancelar reserva</button>
                        </div>
                      </div>

                      {expandida && (
                        <div style={{ borderTop: "1px solid #2a2010", padding: "12px 18px", background: "#0f0c06" }}>
                          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7a6a50", marginBottom: 10 }}>Lista de participantes</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", background: "#1a1508", borderRadius: 4, border: "1px solid #2a2010" }}>
                              <span style={{ fontSize: 10, background: "#b8914a", color: "#0f0e0c", padding: "2px 7px", borderRadius: 10, fontWeight: "bold" }}>TITULAR</span>
                              <span style={{ fontSize: 14, color: "#f5e6c8" }}>{r.nombre} {r.apellido}</span>
                              <span style={{ fontSize: 12, color: "#7a6a50", marginLeft: "auto" }}>🪪 {r.rut}</span>
                            </div>
                            {participantes.length === 0 && <div style={{ fontSize: 12, color: "#4a3a22", padding: "6px 12px" }}>Sin participantes adicionales</div>}
                            {participantes.map((p, idx) => (
                              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", background: "#1a1508", borderRadius: 4, border: "1px solid #2a2010" }}>
                                <span style={{ fontSize: 12, color: "#5a4a30", minWidth: 20 }}>{idx + 2}.</span>
                                <span style={{ fontSize: 14, color: "#e8dcc8" }}>{p.nombre} {p.apellido}</span>
                                <span style={{ fontSize: 12, color: "#7a6a50", marginLeft: "auto" }}>🪪 {p.rut}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {vista === "mapa" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
              <label style={{ color: "#7a6a50", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Fecha:</label>
              <input type="date" value={fechaSeleccionada} onChange={e => setFechaSeleccionada(e.target.value)} style={{ ...inp, width: "auto" }} />
              <button onClick={exportarPDF} title="Exportar PDF" style={{ background: "#7a2020", border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>📄</button>
              <span style={{ background: "#2a1e0a", border: "1px solid #3a2e1a", color: "#7ecb7e", padding: "5px 14px", borderRadius: 20, fontSize: 13 }}>{mesasDisponibles().length} disponibles en total</span>
            </div>
            {/* Resumen por sector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 20 }}>
              {SECTORES.map(zona => {
                const totalZona = MESAS.filter(m => m.zona === zona).length;
                const ocupadasZona = reservas.filter(r => r.fecha === fechaSeleccionada && MESAS.find(m => m.id === r.mesa_id)?.zona === zona).length;
                const disponiblesZona = totalZona - ocupadasZona;
                const porcentaje = Math.round((disponiblesZona / totalZona) * 100);
                const color = porcentaje > 50 ? "#7ecb7e" : porcentaje > 20 ? "#cb9e50" : "#cb7e7e";
                const emoji = zona === "Sector Isla" ? "🏝️" : zona === "Sector Pantallas" ? "📺" : zona === "Sector Escape" ? "🚪" : "🎧";
                return (
                  <div key={zona} style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 8, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "#7a6a50", marginBottom: 6 }}>{emoji} {zona}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: "bold", color }}>{disponiblesZona}</span>
                      <span style={{ fontSize: 12, color: "#5a4a30" }}>/ {totalZona} disponibles</span>
                    </div>
                    <div style={{ marginTop: 8, height: 4, background: "#2a2010", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${porcentaje}%`, background: color, borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <FloorMap reservas={reservas} fecha={fechaSeleccionada} mesaSeleccionada={null} soloZona={sesion.rol !== "admin" ? sectorSesion : null} />
          </div>
        )}

        {vista === "formulario" && (
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: "normal", color: "#f5e6c8", marginBottom: 24, letterSpacing: 1 }}>Nueva Reserva</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 6, padding: 16 }}>
                <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#b8914a", marginBottom: 8 }}>Pegar lista de participantes</label>
                <textarea
                  value={textoCliente}
                  onChange={e => handlePasteCliente(e.target.value)}
                  placeholder={"Juan García 12.345.678-9\nMaría López 9.876.543-2\nPedro Soto 11.222.333-4"}
                  rows={4}
                  style={{ ...inp, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
                />
                <div style={{ fontSize: 11, color: "#5a4a30", marginTop: 6 }}>Primera línea = titular. Las siguientes son participantes adicionales.</div>

                {clientesParsed.length > 0 && alertaListaNegra.length === 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                    {clientesParsed.map((c, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: "#7ecb7e", display: "flex", gap: 8 }}>
                        <span style={{ color: idx === 0 ? "#b8914a" : "#5a4a30" }}>{idx === 0 ? "★" : `${idx + 1}.`}</span>
                        {c.nombre} {c.apellido} — {c.rut}
                      </div>
                    ))}
                  </div>
                )}

                {alertaListaNegra.length > 0 && (
                  <div style={{ marginTop: 12, background: "#2a0808", border: "1px solid #7a1a1a", borderRadius: 4, padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, color: "#f87171", fontWeight: "bold", marginBottom: 6 }}>🚫 Cliente(s) en lista negra — reserva bloqueada</div>
                    {alertaListaNegra.map((x, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: "#fca5a5", marginBottom: 2 }}>
                        • {x.cliente.nombre} {x.cliente.apellido} ({x.cliente.rut}){x.match.motivo ? <span style={{ color: "#9a5050" }}> — {x.match.motivo}</span> : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Field label="Fecha"><input type="date" name="fecha" value={form.fecha} onChange={handleFormChange} style={inp} /></Field>
              {clientesParsed.length > 0 && (
                <div style={{ background: "#15120a", border: `1px solid ${clientesParsed.length > 5 ? "#7a2020" : "#3a5a1a"}`, borderRadius: 4, padding: "10px 14px", fontSize: 13, color: clientesParsed.length > 5 ? "#f87171" : "#7ecb7e" }}>
                  👥 {clientesParsed.length} persona{clientesParsed.length > 1 ? "s" : ""} detectada{clientesParsed.length > 1 ? "s" : ""}
                  {clientesParsed.length > 5 && <span style={{ marginLeft: 8, fontWeight: "bold" }}>— máximo 5</span>}
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7a6a50", marginBottom: 8 }}>Seleccionar Mesa — haz clic en el mapa</label>
                <FloorMap reservas={reservas} fecha={form.fecha} mesaSeleccionada={form.mesa_id ? parseInt(form.mesa_id) : null} onMesaClick={(id) => { setForm(p => ({ ...p, mesa_id: String(id) })); setError(""); }} soloZona={sesion.rol !== "admin" ? sectorSesion : null} />
                {form.mesa_id && (
                  <div style={{ marginTop: 10, padding: "8px 14px", background: "#1a2010", border: "1px solid #3a5a1a", borderRadius: 4, fontSize: 13, color: "#7ecb7e" }}>
                    ✓ Mesa {form.mesa_id} seleccionada — {MESAS.find(m => m.id === parseInt(form.mesa_id))?.zona}
                  </div>
                )}
              </div>
              <Field label="Motivo">
                <div style={{ display: "flex", gap: 10 }}>
                  {["Cumpleaños", "Reserva", "Evento especial"].map(opcion => (
                    <button
                      key={opcion}
                      onClick={() => setForm(p => ({ ...p, nota: opcion }))}
                      style={{
                        flex: 1, padding: "9px 6px", borderRadius: 3, cursor: "pointer",
                        fontFamily: "'Georgia', serif", fontSize: 13,
                        background: form.nota === opcion ? "#b8914a" : "#1a1508",
                        color: form.nota === opcion ? "#0f0e0c" : "#7a6a50",
                        border: form.nota === opcion ? "1px solid #b8914a" : "1px solid #2a2010",
                        fontWeight: form.nota === opcion ? "bold" : "normal",
                        transition: "all 0.15s",
                      }}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
              </Field>
              {error && <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>{error}</div>}
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <button onClick={handleSubmit} disabled={alertaListaNegra.length > 0} style={{ ...btn("gold"), flex: 1, padding: "12px", fontSize: 15, opacity: alertaListaNegra.length > 0 ? 0.4 : 1, cursor: alertaListaNegra.length > 0 ? "not-allowed" : "pointer" }}>
                  Confirmar Reserva
                </button>
                <button onClick={() => { setVista("dia"); setError(""); }} style={{ ...btn("ghost"), padding: "12px 20px" }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {vista === "admin" && sesion.rol === "admin" && <AdminPanel />}
      </div>

      {reservaAEliminar && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#15120a", border: "1px solid #3a2e1a", borderRadius: 8, padding: 32, maxWidth: 400, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>⚠️</div>
            <div style={{ fontSize: 17, color: "#f5e6c8", marginBottom: 8 }}>Cancelar reserva</div>
            <div style={{ fontSize: 14, color: "#7a6a50", marginBottom: 24 }}>¿Cancelar la reserva de <strong style={{ color: "#e8dcc8" }}>{reservaAEliminar.nombre} {reservaAEliminar.apellido}</strong>?</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={cancelarReserva} style={btn("danger")}>Sí, cancelar</button>
              <button onClick={() => setReservaAEliminar(null)} style={btn("ghost")}>Volver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos

export default function Root() {
  const [sesion, setSesion] = useState(() => {
    try { const s = localStorage.getItem("calafate_sesion"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [sector, setSector] = useState(() => {
    try { return localStorage.getItem("calafate_sector") || null; } catch { return null; }
  });

  const handleLogout = () => {
    setSesion(null);
    setSector(null);
    try { localStorage.removeItem("calafate_sesion"); localStorage.removeItem("calafate_sector"); } catch {}
  };

  // Timeout de inactividad
  useEffect(() => {
    if (!sesion) return;
    let timer = setTimeout(handleLogout, TIMEOUT_MS);
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(handleLogout, TIMEOUT_MS);
    };
    const eventos = ["click", "keydown", "mousemove", "touchstart", "scroll"];
    eventos.forEach(e => window.addEventListener(e, resetTimer));
    return () => {
      clearTimeout(timer);
      eventos.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [sesion]);

  const handleLogin = (usuario) => {
    setSesion(usuario);
    setSector(null);
    try { localStorage.setItem("calafate_sesion", JSON.stringify(usuario)); localStorage.removeItem("calafate_sector"); } catch {}
  };

  const handleSectorElegido = (s) => {
    setSector(s);
    try { localStorage.setItem("calafate_sector", s); } catch {}
  };

  const handleCambiarSector = () => {
    setSector(null);
    try { localStorage.removeItem("calafate_sector"); } catch {}
  };

  if (!sesion) return <Login onLogin={handleLogin} />;
  if (sesion.rol !== "admin" && !sector) return <SeleccionSector sesion={sesion} onSectorElegido={handleSectorElegido} />;
  return <ReservasApp sesion={sesion} sectorSesion={sector} onLogout={handleLogout} onCambiarSector={handleCambiarSector} />;
}

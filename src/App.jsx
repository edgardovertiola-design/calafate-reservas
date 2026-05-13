import { useState, useEffect } from "react";

const SUPA_URL = "https://joqzusodfkvjthqwlepq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcXp1c29kZmt2anRocXdsZXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDA1MjcsImV4cCI6MjA5NDIxNjUyN30.f6GrQQWGpFjVvwdbXkqi8UF6DEGm8yaPXNAzGKL1t-Q";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPA_KEY,
  "Authorization": `Bearer ${SUPA_KEY}`,
  "Prefer": "return=representation",
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
  { id: 1,  capacidad: 5, zona: "Sector Pista" },
  { id: 2,  capacidad: 5, zona: "Sector Pista" },
  { id: 3,  capacidad: 5, zona: "Sector Pista" },
  { id: 4,  capacidad: 5, zona: "Sector Pista" },
  { id: 5,  capacidad: 5, zona: "Sector Pista" },
  { id: 6,  capacidad: 5, zona: "Sector Pista" },
  { id: 7,  capacidad: 5, zona: "Sector Pista" },
  { id: 8,  capacidad: 5, zona: "Sector Pista" },
  ...Array.from({ length: 14 }, (_, i) => ({ id: i + 9,  capacidad: 5, zona: "Luces" })),
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

const ZONA_COLOR = {
  "Sector Pista":  "#c026a0",
  "Luces":         "#6d28d9",
  "Sector Escape": "#2563eb",
  "Sector DJ":     "#1e3a8a",
};

const HORARIOS = [
  "20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00",
];

const today = () => new Date().toISOString().split("T")[0];
const ADMIN = { id: 0, usuario: "admin", password: "admin123", rol: "admin", nombre: "Administrador" };

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
      <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7a6a50", marginBottom: 6 }}>
        {label}
      </label>
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

function FloorMap({ reservas, fecha, hora, onMesaClick, mesaSeleccionada }) {
  const ocupadas = reservas.filter(r => r.fecha === fecha && r.hora === hora).map(r => r.mesa_id);
  const [tooltip, setTooltip] = useState(null);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        {Object.entries(ZONA_COLOR).map(([zona, color]) => (
          <div key={zona} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9a8a6a" }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: color, opacity: 0.7 }} />
            {zona}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9a8a6a" }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: "#cb7e7e", border: "1px solid #ff4444" }} />
          Ocupada
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9a8a6a" }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: "#f5e6c8", border: "2px solid #f5d060" }} />
          Seleccionada
        </div>
      </div>
      <div style={{
        position: "relative", width: "100%", paddingBottom: "70%",
        background: "linear-gradient(160deg, #1a0a2e 0%, #0f0a20 40%, #0a0a1a 100%)",
        border: "1px solid #2a1a4a", borderRadius: 10, overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "2%", left: "20%", width: "60%", height: "8%", background: "#3b1f6a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "#c4b5fd", letterSpacing: 3, textTransform: "uppercase" }}>Sector Pantalla</span>
        </div>
        <div style={{ position: "absolute", top: "10%", left: "18%", width: "65%", height: "13%", background: "rgba(109,40,217,0.3)", border: "1px solid rgba(109,40,217,0.5)", borderRadius: 4 }}>
          <span style={{ position: "absolute", left: 6, top: 4, fontSize: 9, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 2 }}>Luces</span>
        </div>
        <div style={{ position: "absolute", top: "20%", right: "2%", width: "16%", height: "55%", background: "rgba(192,38,160,0.25)", border: "1px solid rgba(192,38,160,0.5)", borderRadius: 6 }}>
          <span style={{ position: "absolute", top: 6, left: 4, fontSize: 9, color: "#f0abfc", textTransform: "uppercase", letterSpacing: 1 }}>Sector<br />Pista</span>
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
          const ocupada = ocupadas.includes(mesa.id);
          const seleccionada = mesaSeleccionada === mesa.id;
          const zonaColor = ZONA_COLOR[mesa.zona];
          return (
            <div
              key={mesa.id}
              onClick={() => !ocupada && onMesaClick && onMesaClick(mesa.id)}
              onMouseEnter={() => setTooltip(mesa.id)}
              onMouseLeave={() => setTooltip(null)}
              style={{
                position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`,
                transform: "translate(-50%, -50%)", width: 22, height: 22, borderRadius: 4,
                background: seleccionada ? "#f5d060" : ocupada ? "#7f1d1d" : zonaColor,
                border: seleccionada ? "2px solid #fbbf24" : ocupada ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: "bold",
                color: seleccionada ? "#0f0e0c" : ocupada ? "#fca5a5" : "#fff",
                cursor: ocupada ? "not-allowed" : onMesaClick ? "pointer" : "default",
                transition: "all 0.15s", zIndex: seleccionada ? 10 : 2,
                boxShadow: seleccionada ? "0 0 8px #fbbf24" : ocupada ? "0 0 4px rgba(239,68,68,0.4)" : "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              {mesa.id}
              {tooltip === mesa.id && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                  background: "#1a1208", border: "1px solid #3a2e1a", borderRadius: 4, padding: "5px 10px",
                  whiteSpace: "nowrap", fontSize: 11, color: "#e8dcc8", pointerEvents: "none", zIndex: 20,
                  fontFamily: "'Georgia', serif", fontWeight: "normal",
                }}>
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

  const handleLogin = async () => {
    setCargando(true);
    setError("");
    if (usuario === ADMIN.usuario && password === ADMIN.password) {
      setCargando(false);
      return onLogin({ ...ADMIN });
    }
    try {
      const data = await db.get("usuarios", `usuario=eq.${usuario}&password=eq.${password}&select=*`);
      if (data.length === 0) {
        setError("Usuario o contraseña incorrectos.");
      } else if (!data[0].activo) {
        setError("Tu cuenta está desactivada. Contacta al administrador.");
      } else {
        onLogin({ ...data[0], rol: "garzon" });
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
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
            <Field label="Usuario">
              <input value={usuario} onChange={e => { setUsuario(e.target.value); setError(""); }} placeholder="Tu usuario" style={inp} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </Field>
            <Field label="Contraseña">
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" style={inp} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </Field>
            {error && (
              <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>
                {error}
              </div>
            )}
            <button onClick={handleLogin} disabled={cargando} style={{ ...btn("gold"), padding: "12px", fontSize: 15, letterSpacing: 1, opacity: cargando ? 0.7 : 1 }}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </div>
        <div style={{ marginTop: 20, fontSize: 11, color: "#3a2e1a" }}>Admin: admin / admin123</div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState({ nombre: "", usuario: "", password: "" });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  useEffect(() => { cargarUsuarios(); }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const data = await db.get("usuarios", "select=*&order=id.asc");
    setUsuarios(data);
    setCargando(false);
  };

  const guardar = async () => {
    if (!form.nombre.trim()) return setError("El nombre es obligatorio.");
    if (!form.usuario.trim()) return setError("El usuario es obligatorio.");
    if (!form.password.trim()) return setError("La contraseña es obligatoria.");
    if (editando) {
      await db.patch("usuarios", editando, { nombre: form.nombre.trim(), usuario: form.usuario.trim(), password: form.password.trim() });
      flash("Usuario actualizado.");
    } else {
      await db.post("usuarios", { nombre: form.nombre.trim(), usuario: form.usuario.trim(), password: form.password.trim(), activo: true });
      flash("Garzón creado.");
    }
    setForm({ nombre: "", usuario: "", password: "" });
    setEditando(null);
    setError("");
    cargarUsuarios();
  };

  const toggleActivo = async (u) => {
    await db.patch("usuarios", u.id, { activo: !u.activo });
    cargarUsuarios();
  };

  const eliminar = async (u) => {
    await db.delete("usuarios", u.id);
    setConfirmarEliminar(null);
    flash("Usuario eliminado.");
    cargarUsuarios();
  };

  return (
    <div>
      {msg && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: "#2a4a2a", color: "#7ecb7e", border: "1px solid #4a8a4a", padding: "12px 20px", borderRadius: 4, fontSize: 14 }}>
          {msg}
        </div>
      )}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#b8914a", textTransform: "uppercase", marginBottom: 4 }}>Panel de Administrador</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: "normal", color: "#f5e6c8" }}>Gestión de Garzones</h2>
      </div>
      <div style={{ background: "#15120a", border: "1px solid #2a2010", borderRadius: 8, padding: 24, marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#b8914a", textTransform: "uppercase", marginBottom: 16 }}>
          {editando ? "Editar Garzón" : "Nuevo Garzón"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 16 }}>
          <Field label="Nombre completo">
            <input value={form.nombre} onChange={e => { setForm(p => ({ ...p, nombre: e.target.value })); setError(""); }} placeholder="Ej: Sofía Reyes" style={inp} />
          </Field>
          <Field label="Usuario">
            <input value={form.usuario} onChange={e => { setForm(p => ({ ...p, usuario: e.target.value })); setError(""); }} placeholder="Ej: garzon11" style={inp} />
          </Field>
          <Field label="Contraseña">
            <input value={form.password} onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(""); }} placeholder="Contraseña" style={inp} />
          </Field>
        </div>
        {error && (
          <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13, marginBottom: 12 }}>
            {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={guardar} style={btn("gold")}>{editando ? "Guardar cambios" : "+ Agregar garzón"}</button>
          {editando && (
            <button onClick={() => { setEditando(null); setForm({ nombre: "", usuario: "", password: "" }); setError(""); }} style={btn("ghost")}>
              Cancelar
            </button>
          )}
        </div>
      </div>
      {cargando ? <Spinner /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {usuarios.map(u => (
            <div key={u.id} style={{ background: "#15120a", border: "1px solid #2a2010", borderLeft: `3px solid ${u.activo ? "#b8914a" : "#3a2a1a"}`, borderRadius: 6, padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, opacity: u.activo ? 1 : 0.55 }}>
              <div>
                <div style={{ fontSize: 15, color: "#f5e6c8", marginBottom: 2 }}>{u.nombre}</div>
                <div style={{ fontSize: 12, color: "#7a6a50" }}>
                  @{u.usuario} · <span style={{ color: u.activo ? "#7ecb7e" : "#9a5050" }}>{u.activo ? "Activo" : "Inactivo"}</span>
                </div>
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
      {confirmarEliminar && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#15120a", border: "1px solid #3a2e1a", borderRadius: 8, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 17, color: "#f5e6c8", marginBottom: 8 }}>Eliminar usuario</div>
            <div style={{ fontSize: 14, color: "#7a6a50", marginBottom: 24 }}>
              ¿Eliminar a <strong style={{ color: "#e8dcc8" }}>{confirmarEliminar.nombre}</strong> permanentemente?
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => eliminar(confirmarEliminar)} style={btn("danger")}>Sí, eliminar</button>
              <button onClick={() => setConfirmarEliminar(null)} style={btn("ghost")}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservasApp({ sesion, onLogout }) {
  const [vista, setVista] = useState("dia");
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(today());
  const [horaVista, setHoraVista] = useState("22:00");
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [form, setForm] = useState({ nombre: "", apellido: "", rut: "", telefono: "", fecha: today(), hora: "22:00", personas: 2, mesa_id: "", nota: "" });
  const [error, setError] = useState("");
  const [exitoMsg, setExitoMsg] = useState("");

  const flash = (t) => { setExitoMsg(t); setTimeout(() => setExitoMsg(""), 3000); };

  useEffect(() => { cargarReservas(); }, [fechaSeleccionada]);

  const cargarReservas = async () => {
    setCargando(true);
    const data = await db.get("reservas", `fecha=eq.${fechaSeleccionada}&select=*&order=hora.asc`);
    setReservas(data);
    setCargando(false);
  };

  const mesasDisponibles = () => {
    const ocupadas = reservas.filter(r => r.hora === horaVista).map(r => r.mesa_id);
    return MESAS.filter(m => !ocupadas.includes(m.id));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === "hora" || name === "fecha" ? { mesa_id: "" } : {}) }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return setError("El nombre es obligatorio.");
    if (!form.apellido.trim()) return setError("El apellido es obligatorio.");
    if (!form.rut.trim()) return setError("El RUT es obligatorio.");
    if (!form.telefono.trim()) return setError("El teléfono es obligatorio.");
    if (!form.mesa_id) return setError("Selecciona una mesa en el mapa.");
    const mesa = MESAS.find(m => m.id === parseInt(form.mesa_id));
    if (parseInt(form.personas) > mesa.capacidad) return setError(`Mesa ${mesa.id}: máximo ${mesa.capacidad} personas.`);
    await db.post("reservas", {
      nombre: form.nombre.trim(), apellido: form.apellido.trim(),
      rut: form.rut.trim(), telefono: form.telefono.trim(),
      fecha: form.fecha, hora: form.hora,
      personas: parseInt(form.personas), mesa_id: parseInt(form.mesa_id),
      nota: form.nota.trim(),
    });
    setFechaSeleccionada(form.fecha);
    setVista("dia");
    setForm({ nombre: "", apellido: "", rut: "", telefono: "", fecha: today(), hora: "22:00", personas: 2, mesa_id: "", nota: "" });
    flash("¡Reserva creada correctamente!");
  };

  const cancelarReserva = async () => {
    await db.delete("reservas", reservaAEliminar.id);
    setReservaAEliminar(null);
    flash("Reserva cancelada.");
    cargarReservas();
  };

  const tabs = [
    { key: "dia", label: "Reservas del día" },
    { key: "mapa", label: "Mapa del local" },
    ...(sesion.rol === "admin" ? [{ key: "admin", label: "⚙ Garzones" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e0c", fontFamily: "'Georgia', serif", color: "#e8dcc8" }}>
      <div style={{ background: "linear-gradient(180deg, #1a1208 0%, #0f0e0c 100%)", borderBottom: "1px solid #3a2e1a", padding: "20px 24px 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 6, color: "#b8914a", textTransform: "uppercase", marginBottom: 4 }}>Sistema de Reservas</div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: "normal", color: "#f5e6c8", letterSpacing: 1 }}>🎶 Calafate Discoteca</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#f5e6c8" }}>{sesion.nombre}</div>
                <div style={{ fontSize: 10, color: "#7a6a50", textTransform: "uppercase", letterSpacing: 1 }}>{sesion.rol === "admin" ? "Administrador" : "Garzón"}</div>
              </div>
              <button onClick={() => { setVista("formulario"); setError(""); }} style={{ ...btn("gold"), padding: "8px 16px", fontSize: 13 }}>+ Nueva Reserva</button>
              <button onClick={onLogout} style={{ ...btn("ghost"), fontSize: 12, padding: "7px 14px", color: "#7a6a50" }}>Salir</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 18 }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setVista(tab.key)}
                style={{
                  background: "none", border: "none",
                  borderBottom: vista === tab.key ? "2px solid #b8914a" : "2px solid transparent",
                  color: vista === tab.key ? "#f5e6c8" : "#7a6a50",
                  padding: "10px 20px", cursor: "pointer",
                  fontFamily: "'Georgia', serif", fontSize: 14,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {exitoMsg && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: "#2a4a2a", color: "#7ecb7e", border: "1px solid #4a8a4a", padding: "12px 20px", borderRadius: 4, fontSize: 14 }}>
          {exitoMsg}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>

        {vista === "dia" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
              <label style={{ color: "#7a6a50", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Fecha:</label>
              <input type="date" value={fechaSeleccionada} onChange={e => setFechaSeleccionada(e.target.value)} style={{ ...inp, width: "auto" }} />
              <span style={{ background: "#2a1e0a", border: "1px solid #3a2e1a", color: "#b8914a", padding: "5px 14px", borderRadius: 20, fontSize: 13 }}>{reservas.length} reservas</span>
              <button onClick={cargarReservas} style={{ ...btn("ghost"), fontSize: 12, padding: "5px 12px" }}>↻ Actualizar</button>
            </div>
            {cargando ? <Spinner /> : reservas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a3a22", border: "1px dashed #2a1e0a", borderRadius: 6 }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>📅</div>
                <div>Sin reservas para este día</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {reservas.map(r => {
                  const mesa = MESAS.find(m => m.id === r.mesa_id);
                  return (
                    <div key={r.id} style={{ background: "#15120a", border: "1px solid #2a2010", borderLeft: "3px solid #b8914a", borderRadius: 6, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ background: "#1e1608", border: "1px solid #3a2e1a", borderRadius: 4, padding: "6px 14px", textAlign: "center", minWidth: 58 }}>
                          <div style={{ fontSize: 16, color: "#f5e6c8", fontWeight: "bold" }}>{r.hora}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 15, color: "#f5e6c8", marginBottom: 3 }}>{r.nombre} {r.apellido}</div>
                          <div style={{ fontSize: 12, color: "#7a6a50" }}>
                            🪪 {r.rut} &nbsp;·&nbsp; 📞 {r.telefono} &nbsp;·&nbsp; 👥 {r.personas} pers. &nbsp;·&nbsp;
                            <span style={{ color: ZONA_COLOR[mesa?.zona] || "#b8914a" }}>Mesa {r.mesa_id} ({mesa?.zona})</span>
                          </div>
                          {r.nota && <div style={{ fontSize: 12, color: "#b8914a", marginTop: 3 }}>📝 {r.nota}</div>}
                        </div>
                      </div>
                      <button onClick={() => setReservaAEliminar(r)} style={{ ...btn("ghost"), fontSize: 12, padding: "6px 14px", color: "#9a5050", borderColor: "#4a2020" }}>Cancelar reserva</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {vista === "mapa" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
              <label style={{ color: "#7a6a50", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Fecha:</label>
              <input type="date" value={fechaSeleccionada} onChange={e => setFechaSeleccionada(e.target.value)} style={{ ...inp, width: "auto" }} />
              <label style={{ color: "#7a6a50", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Hora:</label>
              <select value={horaVista} onChange={e => setHoraVista(e.target.value)} style={{ ...inp, width: "auto" }}>
                {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span style={{ background: "#2a1e0a", border: "1px solid #3a2e1a", color: "#7ecb7e", padding: "5px 14px", borderRadius: 20, fontSize: 13 }}>
                {mesasDisponibles().length} disponibles
              </span>
            </div>
            <FloorMap reservas={reservas} fecha={fechaSeleccionada} hora={horaVista} mesaSeleccionada={null} />
          </div>
        )}

        {vista === "formulario" && (
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: "normal", color: "#f5e6c8", marginBottom: 24, letterSpacing: 1 }}>Nueva Reserva</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Nombre"><input name="nombre" value={form.nombre} onChange={handleFormChange} placeholder="Ej: Juan" style={inp} /></Field>
                <Field label="Apellido"><input name="apellido" value={form.apellido} onChange={handleFormChange} placeholder="Ej: García" style={inp} /></Field>
              </div>
              <Field label="RUT"><input name="rut" value={form.rut} onChange={handleFormChange} placeholder="Ej: 12.345.678-9" style={inp} /></Field>
              <Field label="Teléfono"><input name="telefono" value={form.telefono} onChange={handleFormChange} placeholder="Ej: +56 9 1234 5678" style={inp} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Fecha"><input type="date" name="fecha" value={form.fecha} onChange={handleFormChange} style={inp} /></Field>
                <Field label="Hora">
                  <select name="hora" value={form.hora} onChange={handleFormChange} style={inp}>
                    {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Personas">
                <select name="personas" value={form.personas} onChange={handleFormChange} style={inp}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <div>
                <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7a6a50", marginBottom: 8 }}>
                  Seleccionar Mesa — haz clic en el mapa
                </label>
                <FloorMap
                  reservas={reservas}
                  fecha={form.fecha}
                  hora={form.hora}
                  mesaSeleccionada={form.mesa_id ? parseInt(form.mesa_id) : null}
                  onMesaClick={(id) => { setForm(p => ({ ...p, mesa_id: String(id) })); setError(""); }}
                />
                {form.mesa_id && (
                  <div style={{ marginTop: 10, padding: "8px 14px", background: "#1a2010", border: "1px solid #3a5a1a", borderRadius: 4, fontSize: 13, color: "#7ecb7e" }}>
                    ✓ Mesa {form.mesa_id} seleccionada — {MESAS.find(m => m.id === parseInt(form.mesa_id))?.zona}
                  </div>
                )}
              </div>
              <Field label="Nota (opcional)">
                <input name="nota" value={form.nota} onChange={handleFormChange} placeholder="Ej: Cumpleaños, alergias..." style={inp} />
              </Field>
              {error && (
                <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>
                  {error}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <button onClick={handleSubmit} style={{ ...btn("gold"), flex: 1, padding: "12px", fontSize: 15 }}>Confirmar Reserva</button>
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
            <div style={{ fontSize: 14, color: "#7a6a50", marginBottom: 24 }}>
              ¿Cancelar la reserva de <strong style={{ color: "#e8dcc8" }}>{reservaAEliminar.nombre} {reservaAEliminar.apellido}</strong> a las {reservaAEliminar.hora}?
            </div>
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

export default function Root() {
  const [sesion, setSesion] = useState(null);
  if (!sesion) return <Login onLogin={setSesion} />;
  return <ReservasApp sesion={sesion} onLogout={() => setSesion(null)} />;
}

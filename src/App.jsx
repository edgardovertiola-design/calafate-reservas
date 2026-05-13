import { useState, useEffect } from "react";

// ── SUPABASE CONFIG ───────────────────────────────────────────────────────────

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

// ── DATA ─────────────────────────────────────────────────────────────────────

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

// ── STYLES ───────────────────────────────────────────────────────────────────

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

// ── FLOOR MAP ────────────────────────────────────────────────────────────────

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

      <div style={{ position: "relative", width: "100%", paddingBottom: "75%", background: "#0f0d08", border: "1px solid #2a2010", borderRadius: 8, overflow: "hidden" }}>
        {MESAS.map(mesa => {
          const pos = MESA_POS[mesa.id] || { x: 50, y: 50 };
          const esOcupada = ocupadas.includes(mesa.id);
          const esSeleccionada = mesaSeleccionada?.id === mesa.id;

          let bg = ZONA_COLOR[mesa.zona] || "#444";
          let border = "1px solid rgba(255,255,255,0.1)";

          if (esOcupada) {
            bg = "#cb7e7e";
            border = "1px solid #ff4444";
          } else if (esSeleccionada) {
            bg = "#f5e6c8";
            border = "2px solid #f5d060";
          }

          return (
            <button
              key={mesa.id}
              disabled={esOcupada}
              onClick={() => onMesaClick(mesa)}
              onMouseEnter={(e) => setTooltip({ mesa, x: pos.x, y: pos.y })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`,
                transform: "translate(-50%, -50%)", width: 32, height: 32,
                borderRadius: "50%", background: bg, border: border,
                color: esSeleccionada ? "#0f0e0c" : "#fff", fontSize: 11, fontWeight: "bold",
                cursor: esOcupada ? "not-allowed" : "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "all 0.2s"
              }}
            >
              {mesa.id}
            </button>
          );
        })}

        {tooltip && (
          <div style={{
            position: "absolute", left: `${tooltip.x}%`, top: `${tooltip.y - 6}%`,
            transform: "translate(-50%, -100%)", background: "#1a1508",
            border: "1px solid #b8914a", padding: "6px 10px", borderRadius: 4,
            color: "#e8dcc8", fontSize: 11, zIndex: 10, whiteSpace: "nowrap",
            pointerEvents: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
          }}>
            <strong>Mesa {tooltip.mesa.id}</strong><br />
            {tooltip.mesa.zona}<br />
            Capacidad: {tooltip.mesa.capacidad} pers.
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP COMPONENT ───────────────────────────────────────────────────────

export default function App() {
  const [vista, setVista] = useState("dia"); // "dia" o "nueva"
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(today());
  const [horaSeleccionada, setHoraSeleccionada] = useState("20:00");
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [exitoMsg, setExitoMsg] = useState("");

  // Formulario nueva reserva
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [personas, setPersonas] = useState(1);

  const cargarReservas = async () => {
    setCargando(true);
    try {
      const data = await db.get("reservas", `fecha=eq.${fechaSeleccionada}`);
      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, [fechaSeleccionada]);

  const guardarReserva = async (e) => {
    e.preventDefault();
    if (!mesaSeleccionada) return alert("Por favor seleccione una mesa del mapa");

    const nuevaReserva = {
      nombre,
      telefono,
      personas: Number(personas),
      fecha: fechaSeleccionada,
      hora: horaSeleccionada,
      mesa_id: mesaSeleccionada.id,
      zona: mesaSeleccionada.zona
    };

    try {
      await db.post("reservas", nuevaReserva);
      setExitoMsg("¡Reserva confirmada con éxito!");
      setNombre("");
      setTelefono("");
      setPersonas(1);
      setMesaSeleccionada(null);
      cargarReservas();
      setVista("dia");
      setTimeout(() => setExitoMsg(""), 4000);
    } catch (err) {
      console.error("Error guardando reserva:", err);
    }
  };

  const eliminarReserva = async (id) => {
    if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    try {
      await db.delete("reservas", id);
      cargarReservas();
    } catch (err) {
      console.error("Error eliminando reserva:", err);
    }
  };

  const TABS = [
    { id: "dia", label: "📅 Reservas del Día" },
    { id: "nueva", label: "✨ Nueva Reserva" }
  ];

  return (
    <div style={{ background: "#0a0906", color: "#e8dcc8", minHeight: "100vh", fontFamily: "'Georgia', serif" }}>
      
      {/* Header */}
      <div style={{ borderBottom: "1px solid #2a2010", padding: "20px 16px", background: "#0f0d08" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, color: "#b8914a", letterSpacing: 1 }}>Club Lounge</h1>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#7a6a50" }}>Sistema de Control de Mesas</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setVista(tab.id)}
                style={{
                  ...btn(vista === tab.id ? "gold" : "ghost"),
                  fontSize: 13, padding: "8px 16px"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas */}
      {exitoMsg && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: "#2a4a2a", color: "#7ecb7e", border: "1px solid #4a8a4a", padding: "12px 20px", borderRadius: 4, fontSize: 14 }}>
          {exitoMsg}
        </div>
      )}

      {/* Main Container */}
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
                      <div>
                        <div style={{ fontSize: 16, fontWeight: "bold", color: "#f5e6c8" }}>{r.nombre}</div>
                        <div style={{ fontSize: 13, color: "#9a8a6a", marginTop: 4 }}>
                          📞 {r.telefono} • 👥 {r.personas} pers. • ⏰ <strong>{r.hora}</strong>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ background: ZONA_COLOR[r.zona] + "22", border: `1px solid ${ZONA_COLOR[r.zona] || "#444"}`, color: "#f5e6c8", padding: "4px 10px", borderRadius: 4, fontSize: 12 }}>
                          Mesa {r.mesa_id} ({r.zona})
                        </span>
                        <button onClick={() => eliminarReserva(r.id)} style={btn("danger")}>Cancelar</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {vista === "nueva" && (
          <div style={{ display: "grid", gridTemplateColumns: "window.innerWidth > 768 ? '1fr 1fr' : '1fr'", gap: 32 }}>
            
            {/* Mapa Interactivo */}
            <div>
              <h2 style={{ fontSize: 18, color: "#b8914a", marginTop: 0, marginBottom: 16 }}>Seleccionar Mesa</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <Field label="Fecha">
                  <input type="date" value={fechaSeleccionada} onChange={e => { setFechaSeleccionada(e.target.value); setMesaSeleccionada(null); }} style={inp} />
                </Field>
                <Field label="Hora">
                  <select value={horaSeleccionada} onChange={e => { setHoraSeleccionada(e.target.value); setMesaSeleccionada(null); }} style={inp}>
                    {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </Field>
              </div>
              <FloorMap 
                reservas={reservas} 
                fecha={fechaSeleccionada} 
                hora={horaSeleccionada} 
                onMesaClick={setMesaSeleccionada} 
                mesaSeleccionada={mesaSeleccionada} 
              />
            </div>

            {/* Formulario */}
            <div style={{ background: "#0f0d08", border: "1px solid #2a2010", padding: 24, borderRadius: 8, height: "fit-content" }}>
              <h2 style={{ fontSize: 18, color: "#b8914a", marginTop: 0, marginBottom: 20 }}>Datos de la Reserva</h2>
              <form onSubmit={guardarReserva} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Nombre del Cliente">
                  <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" style={inp} />
                </Field>
                <Field label="Teléfono de Contacto">
                  <input type="tel" required value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej. +56912345678" style={inp} />
                </Field>
                <Field label="Cantidad de Personas">
                  <input type="number" min="1" max="10" required value={personas} onChange={e => setPersonas(e.target.value)} style={inp} />
                </Field>
                
                <div style={{ background: "#15120a", border: "1px dashed #3a2e1a", padding: 14, borderRadius: 4, marginTop: 8 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", color: "#7a6a50", marginBottom: 4 }}>Mesa Seleccionada</div>
                  {mesaSeleccionada ? (
                    <div style={{ color: "#b8914a", fontSize: 14, fontWeight: "bold" }}>
                      Mesa {mesaSeleccionada.id} — {mesaSeleccionada.zona} (Máx: {mesaSeleccionada.capacidad} pers.)
                    </div>
                  ) : (
                    <div style={{ color: "#7a2020", fontSize: 13 }}>Ninguna mesa seleccionada en el mapa</div>
                  )}
                </div>

                <button type="submit" style={{ ...btn("gold"), width: "100%", marginTop: 10, padding: 12 }}>
                  Confirmar y Guardar Reserva
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

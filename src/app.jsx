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
< truncated lines 147-465 >
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
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
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
              <Field label="Nota (opcional)"><input name="nota" value={form.nota} onChange={handleFormChange} placeholder="Ej: Cumpleaños, alergias..." style={inp} /></Field>
              {error && <div style={{ background: "#2a1010", border: "1px solid #5a2020", color: "#cb7e7e", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>{error}</div>}
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
            <div style={{ fontSize: 14, color: "#7a6a50", marginBottom: 24 }}>¿Cancelar la reserva de <strong style={{ color: "#e8dcc8" }}>{reservaAEliminar.nombre} {reservaAEliminar.apellido}</strong> a las {reservaAEliminar.hora}?</div>
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

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function Root() {
  const [sesion, setSesion] = useState(null);
  if (!sesion) return <Login onLogin={setSesion} />;
  return <ReservasApp sesion={sesion} onLogout={() => setSesion(null)} />;
}

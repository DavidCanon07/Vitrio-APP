import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://presymphonic-nonnavigably-rhys.ngrok-free.dev";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const getAccess  = () => localStorage.getItem("vitrio_access");
const getRefresh = () => localStorage.getItem("vitrio_refresh");
const saveTokens = (access, refresh) => {
  localStorage.setItem("vitrio_access", access);
  localStorage.setItem("vitrio_refresh", refresh);
};
const clearTokens = () => {
  localStorage.removeItem("vitrio_access");
  localStorage.removeItem("vitrio_refresh");
};

async function refreshAccessToken() {
  const refresh = getRefresh();
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("vitrio_access", data.access);
    return data.access;
  } catch { return null; }
}

async function apiFetch(path, method = "GET", body = null) {
  const newToken = await refreshAccessToken();
  const token = newToken || getAccess();
  if (!token) return { error: 401 };

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401 || res.status === 403) return { error: res.status };
  if (method === "DELETE") return { ok: res.ok };
  if (!res.ok) return { error: res.status };
  try { return await res.json(); } catch { return {}; }
}

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────
const SCHEMAS = {
  clientes: [
    { key: "nombre",   label: "Nombre",   type: "text" },
    { key: "email",    label: "Email",    type: "email" },
    { key: "telefono", label: "Teléfono", type: "text" },
  ],
  usuarios: [
    { key: "fecha_nacimiento", label: "Fecha Nacimiento", type: "date" },
    { key: "rol", label: "Rol", type: "select", options: ["ADMINISTRADOR","ADMINISTRADOR_CLIENTE","CLIENTE"] },
    { key: "id_cliente", label: "ID Cliente", type: "number" },
  ],
  proyectos: [
    { key: "nombre",        label: "Nombre",       type: "text" },
    { key: "descripcion",   label: "Descripción",  type: "textarea" },
    { key: "fecha_inicio",  label: "Fecha Inicio", type: "date" },
    { key: "fecha_entrega", label: "Fecha Entrega",type: "date" },
    { key: "estado", label: "Estado", type: "select", options: ["PROPUESTO","ANALISIS","APROBADO","PLANIFICACION","EJECUCION","SEGUIMIENTO","PAUSADO","CANCELADO","COMPLETADO","CERRADO"] },
    { key: "id_cliente", label: "ID Cliente", type: "number" },
  ],
  plantillas: [
    { key: "nombre",      label: "Nombre",      type: "text" },
    { key: "descripcion", label: "Descripción", type: "textarea" },
    { key: "tipo",    label: "Tipo",   type: "select", options: ["VIDEO","IMAGEN","AUDIO","PAQUETE","METADATO","DOCUMENTO"] },
    { key: "version",     label: "Versión",     type: "text" },
    { key: "estado",  label: "Estado", type: "select", options: ["ACTIVA","INACTIVA","DEPRECADA"] },
    { key: "ruta_base",   label: "Ruta Base",   type: "text" },
  ],
  archivos: [
    { key: "nombre",       label: "Nombre",       type: "text" },
    { key: "tipo",         label: "Tipo",         type: "select", options: ["VIDEO","IMAGEN","AUDIO","PAQUETE","METADATO","DOCUMENTO"] },
    { key: "ruta",         label: "Ruta",         type: "text" },
    { key: "id_proyecto",  label: "ID Proyecto",  type: "number" },
    { key: "id_plantilla", label: "ID Plantilla", type: "number" },
  ],
  dispositivos: [
    { key: "nombre",      label: "Nombre",     type: "text" },
    { key: "ubicacion",   label: "Ubicación",  type: "text" },
    { key: "resolucion",  label: "Resolución", type: "text" },
    { key: "estado",      label: "Estado",     type: "select", options: ["ACTIVO","INACTIVO","SIN_CONEXION"] },
    { key: "id_proyecto", label: "ID Proyecto",type: "number" },
  ],
};

const ENTITY_META = {
  clientes:     { label: "Clientes",     icon: "🏢", id: "id_cliente" },
  usuarios:     { label: "Usuarios",     icon: "👤", id: "id_usuario" },
  proyectos:    { label: "Proyectos",    icon: "📁", id: "id_proyecto" },
  plantillas:   { label: "Plantillas",   icon: "🗂️", id: "id_plantilla" },
  archivos:     { label: "Archivos",     icon: "📄", id: "id_archivo" },
  dispositivos: { label: "Dispositivos", icon: "🖥️", id: "id_dispositivo" },
};

const ESTADO_COLORS = {
  PROPUESTO:             { bg:"rgba(148,163,184,0.15)", text:"#94a3b8", border:"rgba(148,163,184,0.3)" },
  ANALISIS:              { bg:"rgba(251,191,36,0.15)",  text:"#fbbf24", border:"rgba(251,191,36,0.3)" },
  APROBADO:              { bg:"rgba(52,211,153,0.15)",  text:"#34d399", border:"rgba(52,211,153,0.3)" },
  PLANIFICACION:         { bg:"rgba(96,165,250,0.15)",  text:"#60a5fa", border:"rgba(96,165,250,0.3)" },
  EJECUCION:             { bg:"rgba(59,130,246,0.2)",   text:"#3b82f6", border:"rgba(59,130,246,0.4)" },
  SEGUIMIENTO:           { bg:"rgba(139,92,246,0.15)",  text:"#a78bfa", border:"rgba(139,92,246,0.3)" },
  PAUSADO:               { bg:"rgba(251,191,36,0.15)",  text:"#fbbf24", border:"rgba(251,191,36,0.3)" },
  CANCELADO:             { bg:"rgba(248,113,113,0.15)", text:"#f87171", border:"rgba(248,113,113,0.3)" },
  COMPLETADO:            { bg:"rgba(52,211,153,0.2)",   text:"#34d399", border:"rgba(52,211,153,0.4)" },
  CERRADO:               { bg:"rgba(100,116,139,0.15)", text:"#64748b", border:"rgba(100,116,139,0.3)" },
  ACTIVA:                { bg:"rgba(52,211,153,0.15)",  text:"#34d399", border:"rgba(52,211,153,0.3)" },
  INACTIVA:              { bg:"rgba(248,113,113,0.15)", text:"#f87171", border:"rgba(248,113,113,0.3)" },
  DEPRECADA:             { bg:"rgba(100,116,139,0.15)", text:"#64748b", border:"rgba(100,116,139,0.3)" },
  ACTIVO:                { bg:"rgba(52,211,153,0.15)",  text:"#34d399", border:"rgba(52,211,153,0.3)" },
  INACTIVO:              { bg:"rgba(248,113,113,0.15)", text:"#f87171", border:"rgba(248,113,113,0.3)" },
  SIN_CONEXION:          { bg:"rgba(251,191,36,0.15)",  text:"#fbbf24", border:"rgba(251,191,36,0.3)" },
  ADMINISTRADOR:         { bg:"rgba(59,91,219,0.15)",   text:"#818cf8", border:"rgba(59,91,219,0.3)" },
  ADMINISTRADOR_CLIENTE: { bg:"rgba(139,92,246,0.15)",  text:"#a78bfa", border:"rgba(139,92,246,0.3)" },
  CLIENTE:               { bg:"rgba(96,165,250,0.15)",  text:"#60a5fa", border:"rgba(96,165,250,0.3)" },
};

const BADGE_KEYS = ["estado","rol","tipo"];

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [user, setUser]       = useState("manuel");
  const [pass, setPass]       = useState("front123");
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async () => {
    if (!user || !pass) { setError("Completa todos los campos"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ username: user, password: pass }),
      });
      if (!res.ok) {
        setError("Credenciales incorrectas");
        setLoading(false);
        return;
      }
      const data = await res.json();
      saveTokens(data.access, data.refresh);
      setLoading(false);
      onLogin();
    } catch (e) {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  };

  const inp = {
    width:"100%", padding:"0.75rem 0.9rem 0.75rem 2.6rem",
    background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)",
    borderRadius:"10px", color:"#e2e8f0", fontSize:"0.9rem",
    outline:"none", fontFamily:"inherit", boxSizing:"border-box"
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#111827 0%,#0f172a 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"1rem", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ position:"fixed", top:"-100px", left:"50%", transform:"translateX(-50%)", width:"600px", height:"400px", background:"radial-gradient(ellipse,rgba(59,91,219,0.15) 0%,transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"2rem", animation:"fadeUp 0.4s ease" }}>
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b5bdb"/></linearGradient></defs>
          <path d="M15 20 L50 78 L85 20" stroke="url(#lg)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ fontSize:"1.6rem", fontWeight:900, letterSpacing:"0.07em", color:"#f1f5f9" }}>VIT<span style={{ fontWeight:300, opacity:0.6 }}>RIO</span></span>
      </div>

      <div style={{ background:"rgba(18,26,48,0.9)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"2rem", width:"100%", maxWidth:"380px", boxShadow:"0 24px 64px rgba(0,0,0,0.4)", animation:"fadeUp 0.45s ease 0.05s both" }}>
        <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:"1.4rem", marginBottom:"0.4rem", textAlign:"center" }}>Welcome Back</h2>
        <p style={{ color:"#3a5070", fontSize:"0.85rem", textAlign:"center", marginBottom:"1.6rem" }}>Ingresa tus credenciales para continuar</p>

        {error && (
          <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", borderRadius:"9px", padding:"0.65rem 0.9rem", color:"#f87171", fontSize:"0.83rem", marginBottom:"1rem", textAlign:"center" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom:"1rem" }}>
          <label style={{ display:"block", fontSize:"0.68rem", fontWeight:700, color:"#60a5fa", marginBottom:"0.3rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Usuario</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"0.85rem", top:"50%", transform:"translateY(-50%)", color:"#3a5070" }}>👤</span>
            <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="tu_usuario" style={inp} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          </div>
        </div>

        <div style={{ marginBottom:"1.5rem" }}>
          <label style={{ display:"block", fontSize:"0.68rem", fontWeight:700, color:"#60a5fa", marginBottom:"0.3rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Contraseña</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"0.85rem", top:"50%", transform:"translateY(-50%)", color:"#3a5070" }}>🔒</span>
            <input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" style={{...inp, paddingRight:"2.6rem"}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            <button onClick={()=>setShow(!show)} style={{ position:"absolute", right:"0.85rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#3a5070", fontSize:"0.9rem" }}>{show?"🙈":"👁"}</button>
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width:"100%", padding:"0.85rem", background:"linear-gradient(135deg,#3b5bdb,#2244cc)", color:"#fff", border:"none", borderRadius:"11px", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", boxShadow:"0 4px 18px rgba(59,91,219,0.4)", opacity:loading?0.7:1, transition:"all 0.2s" }}>
          {loading ? "Ingresando..." : "Sign In"}
        </button>
      </div>

      <p style={{ color:"#1e3258", fontSize:"0.7rem", marginTop:"1.5rem", letterSpacing:"0.08em" }}>🔒 SECURE ENCRYPTED SESSION</p>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(5,10,25,0.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div style={{ background:"#1a2540", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"18px", width:"100%", maxWidth:"480px", boxShadow:"0 24px 64px rgba(0,0,0,0.5)", animation:"slideUp 0.22s ease", overflow:"hidden", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.1rem 1.4rem", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", position:"sticky", top:0 }}>
          <h3 style={{ margin:0, fontSize:"0.95rem", fontWeight:700, color:"#e2e8f0" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"8px", width:"28px", height:"28px", cursor:"pointer", color:"#94a3b8", fontSize:"0.8rem", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"1.4rem" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── FORM ─────────────────────────────────────────────────────────────────────
function EntityForm({ entity, initial, onSubmit, onCancel }) {
  const schema = SCHEMAS[entity];
  const [form, setForm] = useState(initial || Object.fromEntries(schema.map(f=>[f.key,""])));
  const inp = { width:"100%", padding:"0.62rem 0.88rem", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:"9px", color:"#e2e8f0", fontSize:"0.85rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  return (
    <div>
      {schema.map(f=>(
        <div key={f.key} style={{ marginBottom:"0.85rem" }}>
          <label style={{ display:"block", fontSize:"0.67rem", fontWeight:700, color:"#60a5fa", marginBottom:"0.28rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>{f.label}</label>
          {f.type==="textarea"
            ? <textarea value={form[f.key]||""} rows={2} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{...inp,resize:"vertical"}}/>
            : f.type==="select"
            ? <select value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={inp}>
                <option value="">Seleccionar...</option>
                {f.options.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            : <input type={f.type} value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={inp}/>
          }
        </div>
      ))}
      <div style={{ display:"flex", gap:"0.65rem", marginTop:"1.2rem" }}>
        <button onClick={()=>onSubmit(form)} style={{ flex:1, padding:"0.68rem", background:"linear-gradient(135deg,#3b5bdb,#2244cc)", color:"#fff", border:"none", borderRadius:"9px", fontWeight:700, cursor:"pointer", fontSize:"0.85rem", boxShadow:"0 4px 14px rgba(59,91,219,0.4)" }}>{initial?"Guardar cambios":"Crear registro"}</button>
        <button onClick={onCancel} style={{ flex:1, padding:"0.68rem", background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:"9px", fontWeight:600, cursor:"pointer", fontSize:"0.85rem" }}>Cancelar</button>
      </div>
    </div>
  );
}

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <Modal title="Eliminar registro" onClose={onCancel}>
      <p style={{ color:"#94a3b8", marginBottom:"1.2rem", lineHeight:1.6, fontSize:"0.87rem" }}>¿Seguro que deseas eliminar este registro? Esta acción no puede deshacerse.</p>
      <div style={{ display:"flex", gap:"0.65rem" }}>
        <button onClick={onConfirm} style={{ flex:1, padding:"0.68rem", background:"linear-gradient(135deg,#f87171,#dc2626)", color:"#fff", border:"none", borderRadius:"9px", fontWeight:700, cursor:"pointer" }}>Eliminar</button>
        <button onClick={onCancel} style={{ flex:1, padding:"0.68rem", background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:"9px", fontWeight:600, cursor:"pointer" }}>Cancelar</button>
      </div>
    </Modal>
  );
}

// ─── TABLE ────────────────────────────────────────────────────────────────────
function EntityTable({ entity, data, onEdit, onDelete }) {
  const schema = SCHEMAS[entity];
  const meta   = ENTITY_META[entity];
  const th = { padding:"0.62rem 0.88rem", textAlign:"left", fontWeight:700, color:"#3a5070", fontSize:"0.66rem", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap", borderBottom:"1px solid rgba(255,255,255,0.06)" };
  const td = { padding:"0.8rem 0.88rem", verticalAlign:"middle" };
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.83rem" }}>
        <thead>
          <tr style={{ background:"rgba(255,255,255,0.02)" }}>
            <th style={th}>#</th>
            {schema.map(f=><th key={f.key} style={th}>{f.label}</th>)}
            <th style={{...th,textAlign:"center"}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length===0 ? (
            <tr><td colSpan={schema.length+2} style={{ textAlign:"center", padding:"3rem", color:"#243260" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.5rem", opacity:0.4 }}>{meta.icon}</div>
              <div style={{ color:"#3d5578" }}>No hay {meta.label.toLowerCase()} registrados</div>
            </td></tr>
          ) : data.map((row,i)=>(
            <tr key={row[meta.id]||i}
              style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", transition:"background 0.12s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(59,91,219,0.07)"}
              onMouseLeave={e=>e.currentTarget.style.background=""}
            >
              <td style={td}><span style={{ background:"rgba(96,165,250,0.15)", color:"#60a5fa", fontWeight:700, fontSize:"0.67rem", padding:"0.16rem 0.42rem", borderRadius:"5px" }}>{String(i+1).padStart(2,"0")}</span></td>
              {schema.map(f=>(
                <td key={f.key} style={td}>
                  {BADGE_KEYS.includes(f.key) && ESTADO_COLORS[row[f.key]] ? (
                    <span style={{ display:"inline-flex", alignItems:"center", gap:"0.28rem", padding:"0.2rem 0.6rem", borderRadius:"999px", fontSize:"0.71rem", fontWeight:700, background:ESTADO_COLORS[row[f.key]].bg, color:ESTADO_COLORS[row[f.key]].text, border:`1px solid ${ESTADO_COLORS[row[f.key]].border}` }}>
                      <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:ESTADO_COLORS[row[f.key]].text, display:"inline-block" }}/>
                      {row[f.key]}
                    </span>
                  ) : f.key==="email" ? (
                    <span style={{ color:"#60a5fa", fontSize:"0.8rem" }}>{row[f.key]}</span>
                  ) : (
                    <span style={{ color:"#cbd5e1" }}>{row[f.key]!=null?String(row[f.key]):"—"}</span>
                  )}
                </td>
              ))}
              <td style={{...td,textAlign:"center"}}>
                <div style={{ display:"flex", gap:"0.32rem", justifyContent:"center" }}>
                  <button onClick={()=>onEdit(row)} style={{ padding:"0.26rem 0.7rem", background:"rgba(59,130,246,0.12)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.25)", borderRadius:"6px", cursor:"pointer", fontWeight:600, fontSize:"0.73rem" }}>Editar</button>
                  <button onClick={()=>onDelete(row)} style={{ padding:"0.26rem 0.7rem", background:"rgba(248,113,113,0.1)", color:"#f87171", border:"1px solid rgba(248,113,113,0.25)", borderRadius:"6px", cursor:"pointer", fontWeight:600, fontSize:"0.73rem" }}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function VitrioLogo({ size=22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b5bdb"/></linearGradient></defs>
      <path d="M15 20 L50 78 L85 20" stroke="url(#lg2)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [active, setActive]     = useState("clientes");
  const [data, setData]         = useState({});
  const [loading, setLoading]   = useState(false);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState(null);
  const [search, setSearch]     = useState("");

  const meta = ENTITY_META[active];

  const showToast = (msg, type="ok") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3500);
  };

  const load = useCallback(async (entity) => {
    setLoading(true);
    const res = await apiFetch(`/api/${entity}/`);
    if (res.error === 401) { onLogout(); return; }
    const list = Array.isArray(res) ? res : (res.results || []);
    setData(p=>({...p,[entity]:list}));
    setLoading(false);
  }, [onLogout]);

  useEffect(()=>{ load(active); },[active, load]);

  const handleCreate = async (form) => {
    const res = await apiFetch(`/api/${active}/`, "POST", form);
    if (res.error) { showToast("Error al crear registro","err"); return; }
    await load(active); setModal(null); showToast("Registro creado ✓");
  };

  const handleEdit = async (form) => {
    const idKey = meta.id;
    const res = await apiFetch(`/api/${active}/${selected[idKey]}/`, "PUT", form);
    if (res.error) { showToast("Error al guardar","err"); return; }
    await load(active); setModal(null); showToast("Cambios guardados ✓");
  };

  const handleDelete = async () => {
    const idKey = meta.id;
    const res = await apiFetch(`/api/${active}/${selected[idKey]}/`, "DELETE");
    if (!res.ok) { showToast("Error al eliminar","err"); return; }
    await load(active); setModal(null); showToast("Registro eliminado","err");
  };

  const filtered = (data[active]||[]).filter(row=>
    Object.values(row).some(v=>String(v).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#111827 0%,#0f172a 100%)", fontFamily:"'Segoe UI',system-ui,sans-serif", display:"flex" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#1e3258;border-radius:4px;}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        option{background:#1a2540;}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width:"215px", minHeight:"100vh", flexShrink:0, background:"rgba(14,20,38,0.97)", borderRight:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", padding:"1.3rem 0.8rem", position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0 0.4rem", marginBottom:"2rem" }}>
          <VitrioLogo size={22}/>
          <span style={{ fontSize:"1.2rem", fontWeight:900, letterSpacing:"0.07em", color:"#f1f5f9" }}>VIT<span style={{ fontWeight:300, opacity:0.6 }}>RIO</span></span>
        </div>

        <div style={{ fontSize:"0.58rem", color:"#1e3258", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", paddingLeft:"0.45rem", marginBottom:"0.4rem" }}>Módulos</div>

        {Object.entries(ENTITY_META).map(([key,m])=>{
          const isA = active===key;
          return (
            <button key={key} onClick={()=>{setActive(key);setSearch("");}}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.6rem 0.72rem", borderRadius:"10px", border:"none", background:isA?"rgba(59,91,219,0.2)":"transparent", color:isA?"#93c5fd":"#3a5878", cursor:"pointer", fontWeight:isA?700:500, fontSize:"0.845rem", marginBottom:"0.15rem", transition:"all 0.15s", width:"100%", textAlign:"left", boxShadow:isA?"inset 0 0 0 1px rgba(59,91,219,0.35)":"none" }}
              onMouseEnter={e=>{if(!isA)e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
              onMouseLeave={e=>{if(!isA)e.currentTarget.style.background="transparent";}}
            >
              <div style={{ display:"flex", alignItems:"center", gap:"0.52rem" }}><span>{m.icon}</span><span>{m.label}</span></div>
              <span style={{ fontSize:"0.67rem", fontWeight:700, padding:"0.07rem 0.42rem", borderRadius:"999px", background:isA?"rgba(59,91,219,0.3)":"rgba(255,255,255,0.05)", color:isA?"#93c5fd":"#1e3258" }}>{(data[key]||[]).length}</span>
            </button>
          );
        })}

        <div style={{ marginTop:"auto" }}>
          <button onClick={onLogout} style={{ width:"100%", padding:"0.65rem", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"10px", color:"#f87171", cursor:"pointer", fontWeight:600, fontSize:"0.8rem", marginBottom:"0.75rem" }}>
            ↩ Cerrar sesión
          </button>
          <div style={{ padding:"0.75rem", borderRadius:"10px", background:"rgba(52,211,153,0.07)", border:"1px solid rgba(52,211,153,0.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", fontSize:"0.67rem", fontWeight:700, marginBottom:"0.18rem", color:"#34d399" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#34d399", display:"inline-block", animation:"pulse 2s infinite" }}/>
              API CONECTADA
            </div>
            <div style={{ fontSize:"0.63rem", color:"#1e3258", lineHeight:1.4 }}>vitrio backend · JWT</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft:"215px", flex:1, padding:"1.6rem 1.8rem" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.4rem" }}>
          <div>
            <div style={{ fontSize:"0.65rem", color:"#1e3258", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.22rem" }}>vitrio / {meta.label.toLowerCase()}</div>
            <h1 style={{ fontSize:"1.55rem", fontWeight:800, letterSpacing:"-0.03em", color:"#f1f5f9" }}>{meta.icon} {meta.label}</h1>
            <p style={{ color:"#3a5070", fontSize:"0.78rem", marginTop:"0.22rem" }}>{filtered.length} registro{filtered.length!==1?"s":""}</p>
          </div>
          <button onClick={()=>{setSelected(null);setModal("create");}}
            style={{ display:"flex", alignItems:"center", gap:"0.42rem", padding:"0.65rem 1.2rem", background:"linear-gradient(135deg,#3b5bdb,#2244cc)", color:"#fff", border:"none", borderRadius:"11px", fontWeight:700, cursor:"pointer", fontSize:"0.84rem", boxShadow:"0 4px 18px rgba(59,91,219,0.4)", transition:"transform 0.15s,box-shadow 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(59,91,219,0.55)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 18px rgba(59,91,219,0.4)";}}
          >+ Nuevo {meta.label.slice(0,-1)}</button>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"0.7rem", marginBottom:"1.2rem" }}>
          {Object.entries(ENTITY_META).map(([key,m])=>{
            const isA=active===key;
            return (
              <div key={key} onClick={()=>setActive(key)}
                style={{ padding:"0.9rem", borderRadius:"12px", cursor:"pointer", background:isA?"rgba(59,91,219,0.15)":"rgba(255,255,255,0.03)", border:`1.5px solid ${isA?"rgba(59,91,219,0.4)":"rgba(255,255,255,0.06)"}`, boxShadow:isA?"0 4px 20px rgba(59,91,219,0.15)":"none", transition:"all 0.2s", borderTop:`3px solid ${isA?"#3b5bdb":"rgba(255,255,255,0.05)"}` }}
                onMouseEnter={e=>{if(!isA){e.currentTarget.style.background="rgba(255,255,255,0.055)";e.currentTarget.style.borderColor="rgba(59,91,219,0.2)";}}}
                onMouseLeave={e=>{if(!isA){e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}}
              >
                <div style={{ fontSize:"1.1rem", marginBottom:"0.3rem" }}>{m.icon}</div>
                <div style={{ fontSize:"1.3rem", fontWeight:800, color:isA?"#93c5fd":"#e2e8f0", letterSpacing:"-0.04em" }}>{(data[key]||[]).length}</div>
                <div style={{ fontSize:"0.6rem", color:isA?"#3a5878":"#1e3258", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:"0.1rem" }}>{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ background:"rgba(14,20,38,0.8)", borderRadius:"15px", border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
          <div style={{ padding:"0.88rem 1.05rem", display:"flex", gap:"0.62rem", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.015)" }}>
            <div style={{ flex:1, position:"relative" }}>
              <span style={{ position:"absolute", left:"0.72rem", top:"50%", transform:"translateY(-50%)", color:"#1e3258", fontSize:"0.84rem" }}>🔍</span>
              <input type="text" placeholder={`Buscar en ${meta.label.toLowerCase()}...`} value={search} onChange={e=>setSearch(e.target.value)}
                style={{ width:"100%", padding:"0.54rem 0.84rem 0.54rem 1.95rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#e2e8f0", fontSize:"0.82rem", outline:"none", fontFamily:"inherit" }}/>
            </div>
            <button onClick={()=>load(active)} style={{ padding:"0.54rem 0.88rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#3a5070", cursor:"pointer", fontSize:"0.78rem", fontWeight:600 }}>↻ Sync</button>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"4rem", color:"#1e3258" }}>
              <div style={{ fontSize:"1.5rem", animation:"pulse 1.5s infinite", marginBottom:"0.5rem" }}>⏳</div>
              <div style={{ fontSize:"0.84rem" }}>Cargando datos...</div>
            </div>
          ) : (
            <EntityTable entity={active} data={filtered}
              onEdit={row=>{setSelected(row);setModal("edit");}}
              onDelete={row=>{setSelected(row);setModal("delete");}}
            />
          )}
        </div>
      </main>

      {modal==="create" && <Modal title={`Nuevo ${meta.label.slice(0,-1)}`} onClose={()=>setModal(null)}><EntityForm entity={active} onSubmit={handleCreate} onCancel={()=>setModal(null)}/></Modal>}
      {modal==="edit" && selected && <Modal title={`Editar ${meta.label.slice(0,-1)}`} onClose={()=>setModal(null)}><EntityForm entity={active} initial={selected} onSubmit={handleEdit} onCancel={()=>setModal(null)}/></Modal>}
      {modal==="delete" && <ConfirmDialog onConfirm={handleDelete} onCancel={()=>setModal(null)}/>}

      {toast && (
        <div style={{ position:"fixed", bottom:"1.2rem", right:"1.2rem", zIndex:9999, padding:"0.78rem 1.05rem", borderRadius:"11px", background:toast.type==="err"?"rgba(248,113,113,0.12)":"rgba(52,211,153,0.1)", border:`1px solid ${toast.type==="err"?"rgba(248,113,113,0.3)":"rgba(52,211,153,0.3)"}`, color:toast.type==="err"?"#f87171":"#34d399", fontWeight:600, fontSize:"0.82rem", boxShadow:"0 8px 24px rgba(0,0,0,0.35)", animation:"toastIn 0.3s ease" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [logged, setLogged] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAccess();
    if (token) {
      setLogged(true);
    }
    setChecking(false);
  }, []);

  const handleLogin  = () => setLogged(true);
  const handleLogout = () => { clearTokens(); setLogged(false); };

  if (checking) return (
    <div style={{ minHeight:"100vh", background:"#0f172a", display:"flex", alignItems:"center", justifyContent:"center", color:"#3a5070", fontFamily:"sans-serif" }}>
      Cargando...
    </div>
  );

  return logged
    ? <Dashboard onLogout={handleLogout}/>
    : <LoginScreen onLogin={handleLogin}/>;
}
import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import {
  PiggyBank, Wallet, Moon, Dumbbell, CheckSquare, BookOpen,
  TrendingUp, Flame, Target, Check
} from 'lucide-react';

/* ---------- paleta y tokens ---------- */
const C = {
  bg: '#0F1A17',
  bgCard: '#152420',
  bgCardHi: '#1B2B25',
  border: 'rgba(201,162,75,0.16)',
  borderHi: 'rgba(201,162,75,0.4)',
  gold: '#C9A24B',      // Finanzas
  mint: '#6FBFA0',      // Salud
  blue: '#7C93B0',      // Productividad
  lav: '#9C8FC9',       // Aprendizaje
  alert: '#B25D4C',
  text: '#EDEBE3',
  muted: '#8FA39B',
  faint: '#5B6E67',
};

const CATS = [
  { id: 'todos', label: 'Todos', color: C.text },
  { id: 'Finanzas', label: 'Finanzas', color: C.gold },
  { id: 'Salud', label: 'Salud', color: C.mint },
  { id: 'Productividad', label: 'Productividad', color: C.blue },
  { id: 'Aprendizaje', label: 'Aprendizaje', color: C.lav },
];

/* ---------- datos mock ---------- */
const TODAY = new Date('2026-08-10');
const trendValues = [62,64,63,66,68,65,67,70,69,72,71,74,73,76,75,73,77,78,76,79,81,80,78,82,83,81,84,82,85,78];
const trendData = trendValues.map((v, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - (trendValues.length - 1 - i));
  return { date: d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }), value: v };
});

const spark = (arr) => arr.map((v, i) => ({ i, v }));

const KPIS = [
  { id: 'ahorro', cat: 'Finanzas', label: 'Ahorro mensual', icon: PiggyBank,
    value: 420, target: 500, unit: '$', fmt: (v) => `$${v}`, higherIsBetter: true,
    spark: spark([300, 340, 360, 380, 400, 410, 420]) },
  { id: 'presupuesto', cat: 'Finanzas', label: 'Presupuesto usado', icon: Wallet,
    value: 92, target: 100, unit: '%', fmt: (v) => `${v}%`, higherIsBetter: false,
    spark: spark([70, 75, 80, 85, 88, 90, 92]) },
  { id: 'sueno', cat: 'Salud', label: 'Sueño promedio', icon: Moon,
    value: 7.2, target: 8, unit: 'h', fmt: (v) => `${v}h`, higherIsBetter: true,
    spark: spark([6.8, 7.0, 6.9, 7.1, 7.3, 7.0, 7.2]) },
  { id: 'ejercicio', cat: 'Salud', label: 'Ejercicio', icon: Dumbbell,
    value: 4, target: 5, unit: 'días/sem', fmt: (v) => `${v}/sem`, higherIsBetter: true,
    spark: spark([2, 3, 3, 4, 4, 5, 4]) },
  { id: 'tareas', cat: 'Productividad', label: 'Tareas completadas', icon: CheckSquare,
    value: 27, target: 30, unit: '', fmt: (v) => `${v}`, higherIsBetter: true,
    spark: spark([20, 22, 24, 25, 26, 28, 27]) },
  { id: 'lectura', cat: 'Aprendizaje', label: 'Lectura', icon: BookOpen,
    value: 3.5, target: 4, unit: 'h/sem', fmt: (v) => `${v}h`, higherIsBetter: true,
    spark: spark([2, 2.5, 3, 3.2, 3.5, 3.8, 3.5]) },
];

const HABITS = [
  { id: 'ejercicio', label: 'Ejercicio', color: C.mint },
  { id: 'sueno', label: 'Sueño 8h+', color: C.blue },
  { id: 'lectura', label: 'Lectura', color: C.lav },
  { id: 'meditacion', label: 'Meditación', color: C.gold },
];
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const GOALS = [
  { id: 'g1', title: 'Fondo de emergencia (6 meses de gastos)', progress: 68, deadline: 'Dic 2026', color: C.gold },
  { id: 'g2', title: 'Correr 10K sin parar', progress: 45, deadline: 'Oct 2026', color: C.mint },
  { id: 'g3', title: 'Leer 12 libros este año', progress: 58, deadline: 'Dic 2026', color: C.lav },
  { id: 'g4', title: 'Dominar React avanzado', progress: 30, deadline: 'Nov 2026', color: C.blue },
];

/* ---------- utilidades ---------- */
function pct(k) {
  const p = k.higherIsBetter ? (k.value / k.target) * 100 : 100 - Math.max(0, k.value - k.target);
  return Math.max(0, Math.min(100, Math.round(p)));
}
function statusColor(p) {
  if (p >= 90) return C.mint;
  if (p >= 60) return C.gold;
  return C.alert;
}

/* ---------- índice de bienestar ---------- */
const INDEX_SCORE = Math.round(KPIS.reduce((s, k) => s + pct(k), 0) / KPIS.length);

/* ---------- sub-componentes ---------- */
function TrajectorySvg() {
  return (
    <svg viewBox="0 0 900 120" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
      <path d="M0,90 C60,70 90,100 150,60 C210,20 250,85 320,55 C390,25 420,75 490,45 C560,15 600,60 670,35 C740,10 780,55 840,30 C870,18 890,25 900,15"
        fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" />
      <circle cx="900" cy="15" r="4" fill={C.gold} />
    </svg>
  );
}

function KpiCard({ k }) {
  const p = pct(k);
  const color = statusColor(p);
  const Icon = k.icon;
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
            {k.cat}
          </div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.text, marginTop: 2 }}>{k.label}</div>
        </div>
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 30, fontWeight: 600, color: C.text }}>
          {k.fmt(k.value)}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.faint }}>
          meta {k.fmt(k.target)}
        </span>
      </div>

      <div style={{ height: 34 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={k.spark}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: color, borderRadius: 4, transition: 'width .4s ease' }} />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color, textAlign: 'right' }}>{p}% de la meta</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: C.bgCardHi, border: `1px solid ${C.borderHi}`, borderRadius: 8, padding: '8px 12px' }}>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.muted }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: C.gold }}>{payload[0].value}</div>
    </div>
  );
}

/* ---------- app principal ---------- */
export default function App() {
  const [activeCat, setActiveCat] = useState('todos');
  const [grid, setGrid] = useState(() => {
    const g = {};
    HABITS.forEach((h) => { g[h.id] = [true, true, false, true, false, false, false]; });
    return g;
  });

  const toggle = (habitId, dayIdx) => {
    setGrid((prev) => {
      const copy = { ...prev, [habitId]: [...prev[habitId]] };
      copy[habitId][dayIdx] = !copy[habitId][dayIdx];
      return copy;
    });
  };

  const filteredKpis = useMemo(
    () => (activeCat === 'todos' ? KPIS : KPIS.filter((k) => k.cat === activeCat)),
    [activeCat]
  );

  const dateLabel = TODAY.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: C.bg, minHeight: '100%', padding: '28px 20px 60px', fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .cat-tab { transition: all .2s ease; cursor: pointer; }
        .cat-tab:hover { opacity: 0.85; }
        .habit-cell { transition: transform .12s ease, background .15s ease; cursor: pointer; }
        .habit-cell:hover { transform: scale(1.08); }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* HERO */}
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 18,
          border: `1px solid ${C.border}`, background: 'linear-gradient(180deg, #142520 0%, #0F1A17 100%)',
          padding: '30px 28px 26px', marginBottom: 26,
        }}>
          <TrajectorySvg />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.14em', color: C.gold, textTransform: 'uppercase' }}>
                Bitácora personal · {dateLabel}
              </div>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 34, color: C.text, margin: '6px 0 0' }}>
                Panel de KPIs
              </h1>
              <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
                Finanzas, salud, hábitos y metas — todo tu progreso en un solo lugar.
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, letterSpacing: '0.08em', color: C.muted, textTransform: 'uppercase' }}>
                Índice de bienestar
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 44, fontWeight: 600, color: statusColor(INDEX_SCORE) }}>
                  {INDEX_SCORE}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: C.faint }}>/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {CATS.map((c) => {
            const active = activeCat === c.id;
            return (
              <div key={c.id} className="cat-tab" onClick={() => setActiveCat(c.id)}
                style={{
                  padding: '7px 14px', borderRadius: 999, fontSize: 13,
                  border: `1px solid ${active ? c.color : C.border}`,
                  background: active ? `${c.color}1A` : 'transparent',
                  color: active ? c.color : C.muted,
                }}>
                {c.label}
              </div>
            );
          })}
        </div>

        {/* KPI GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginBottom: 30 }}>
          {filteredKpis.map((k) => <KpiCard key={k.id} k={k} />)}
        </div>

        {/* TREND */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 24px', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <TrendingUp size={16} color={C.gold} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.muted }}>
              Índice de bienestar — últimos 30 días
            </span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: C.faint, fontSize: 11 }} interval={4} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fill: C.faint, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={C.gold} strokeWidth={2} fill="url(#fillGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HABIT TRACKER */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 24px', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Flame size={16} color={C.mint} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.muted }}>
              Hábitos de esta semana
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(7, 1fr) 60px', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <div />
            {DAYS.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.faint }}>{d}</div>
            ))}
            <div />
          </div>

          {HABITS.map((h) => {
            const row = grid[h.id];
            const done = row.filter(Boolean).length;
            return (
              <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '140px repeat(7, 1fr) 60px', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: C.text }}>{h.label}</div>
                {row.map((on, dayIdx) => (
                  <div key={dayIdx} className="habit-cell" onClick={() => toggle(h.id, dayIdx)}
                    style={{
                      height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: on ? `${h.color}33` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${on ? h.color : C.border}`,
                    }}>
                    {on && <Check size={13} color={h.color} strokeWidth={2.5} />}
                  </div>
                ))}
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: h.color, textAlign: 'center' }}>{done}/7</div>
              </div>
            );
          })}
          <div style={{ fontSize: 11, color: C.faint, marginTop: 10 }}>Toca una celda para marcar o desmarcar el día.</div>
        </div>

        {/* GOALS */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target size={16} color={C.lav} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.muted }}>
              Metas activas
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {GOALS.map((g) => (
              <div key={g.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: C.text }}>{g.title}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>
                    {g.progress}% · {g.deadline}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${g.progress}%`, height: '100%', background: g.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: C.faint, marginTop: 30, fontFamily: "'JetBrains Mono',monospace" }}>
          Datos de ejemplo — reemplázalos con los tuyos para empezar a llevar tu propia bitácora.
        </div>
      </div>
    </div>
  );
}

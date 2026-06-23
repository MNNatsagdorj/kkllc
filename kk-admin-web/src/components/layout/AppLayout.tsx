import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Bell, Plus, X, MoreVertical, Menu } from 'lucide-react'
import { navMain, navSystem, allNav, type NavItem } from './nav'
import { useAuth } from '../../store/auth'
import { useSearch } from '../../store/search'
import { useIsMobile } from '../../lib/useMediaQuery'
import { getData } from '../../lib/api'
import { initial } from '../../lib/theme'
import { Toasts } from '../ui/Toasts'

function NavButton({ n, badge, onNavigate }: { n: NavItem; badge?: number; onNavigate?: () => void }) {
  return (
    <NavLink to={n.to} end={n.to === '/'} onClick={onNavigate} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <div
          className="kk-navbtn"
          style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderRadius: 8,
            marginBottom: 2, cursor: 'pointer', transition: 'background .12s',
            background: isActive ? '#f4f4f5' : 'transparent',
            color: isActive ? '#18181b' : '#52525b',
            fontWeight: isActive ? 600 : 450, fontSize: 13.5,
          }}
        >
          <span style={{ width: 18, height: 18, flexShrink: 0, color: isActive ? '#18181b' : '#a1a1aa', display: 'flex' }}>{n.icon}</span>
          <span style={{ flex: 1 }}>{n.label}</span>
          {badge ? (
            <span style={{ background: '#fef3c7', color: '#b45309', fontSize: 11, fontWeight: 600, minWidth: 20, height: 20, padding: '0 6px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
          ) : null}
        </div>
      )}
    </NavLink>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { displayName, username, logout } = useAuth()
  const { query, setQuery, clear } = useSearch()
  const loc = useLocation()
  const nav = useNavigate()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const current = allNav.find((n) => n.to === loc.pathname) ?? allNav[0]

  // 라우트 변경 시 검색어 초기화 + 모바일 메뉴 닫기
  useEffect(() => { clear(); setMenuOpen(false) }, [loc.pathname, clear])

  const unread = useQuery({
    queryKey: ['quotes', 'unread'],
    queryFn: () => getData<{ count: number }>('/quotes/unread-count'),
    refetchInterval: 30_000,
  })
  const unreadCount = unread.data?.count ?? 0
  const name = displayName ?? username ?? 'admin'
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-grid">
      {/* scrim (모바일) */}
      <div className={`app-scrim ${isMobile && menuOpen ? 'open' : ''}`} onClick={closeMenu} />

      {/* ===== SIDEBAR ===== */}
      <aside className={`app-sidebar ${menuOpen ? 'open' : ''}`}>
        <div style={{ padding: '18px 18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #f1f1f3' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 9, background: '#18181b', color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-.04em' }}>KK</span>
          <div style={{ lineHeight: 1.15, minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#18181b', whiteSpace: 'nowrap' }}>Kokorozashi Kibou</div>
            <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>Удирдлагын самбар</div>
          </div>
          {isMobile && <button onClick={closeMenu} style={{ border: 0, background: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>}
        </div>

        <div className="kk-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', padding: '8px 10px 6px' }}>ҮНДСЭН</div>
          {navMain.map((n) => <NavButton key={n.to} n={n} badge={n.badgeKey === 'quotes' ? unreadCount : undefined} onNavigate={closeMenu} />)}
          <div style={{ fontSize: 11, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', padding: '18px 10px 6px' }}>СИСТЕМ</div>
          {navSystem.map((n) => <NavButton key={n.to} n={n} onNavigate={closeMenu} />)}
        </div>

        <div style={{ padding: 12, borderTop: '1px solid #f1f1f3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 9 }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#15396B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>{initial(name)}</span>
            <div style={{ lineHeight: 1.2, flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
              <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>Админ</div>
            </div>
            <button onClick={logout} title="Гарах" style={{ border: 0, background: 'none', cursor: 'pointer', color: '#a1a1aa', width: 16, height: 16, padding: 0 }}><MoreVertical size={16} /></button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <header style={{ flexShrink: 0, background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #ececef', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="app-burger kk-navbtn" onClick={() => setMenuOpen(true)} style={{ border: '1px solid #ececef', background: '#fff', width: 38, height: 38, borderRadius: 9, alignItems: 'center', justifyContent: 'center', color: '#3f3f46', cursor: 'pointer', flexShrink: 0 }}>
            <Menu size={18} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current.title}</div>
            <div className="topbar-subtitle" style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2 }}>{current.subtitle}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="topbar-search" style={{ display: 'flex', alignItems: 'center', background: '#f4f4f5', border: '1px solid #ececef', borderRadius: 9, height: 38, padding: '0 12px', width: 240 }}>
              <Search size={16} style={{ color: '#a1a1aa', marginRight: 8, flexShrink: 0 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={current.searchPlaceholder ?? 'Хайх…'}
                style={{ border: 0, background: 'transparent', flex: 1, fontSize: 13, color: '#3f3f46', outline: 'none', minWidth: 0 }}
              />
              {query && <button onClick={clear} style={{ border: 0, background: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>}
            </div>
            <button onClick={() => nav('/quotes')} className="kk-navbtn" style={{ position: 'relative', border: '1px solid #ececef', background: '#fff', width: 38, height: 38, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', cursor: 'pointer', flexShrink: 0 }}>
              <Bell size={18} />
              {unreadCount > 0 && <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #fff' }} />}
            </button>
            <button onClick={() => nav('/orders')} className="topbar-new" style={{ border: 0, background: '#18181b', color: '#fff', height: 38, padding: '0 16px', borderRadius: 9, fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <Plus size={15} /><span className="btn-neworder-label">Шинэ захиалга</span>
            </button>
          </div>
        </header>

        <main className="kk-scroll" style={{ flex: 1, overflowY: 'auto', padding: 'clamp(14px, 3vw, 26px)' }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', width: '100%' }}>{children}</div>
        </main>
      </div>
      <Toasts />
    </div>
  )
}

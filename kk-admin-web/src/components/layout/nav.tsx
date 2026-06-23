import {
  LayoutGrid, ShoppingBag, Package, Tag, Calendar, Wallet,
  MessageSquare, Users, BarChart3, Settings,
} from 'lucide-react'
import type { ReactNode } from 'react'

export interface NavItem {
  to: string
  label: string
  title: string
  subtitle: string
  icon: ReactNode
  searchPlaceholder?: string
  badgeKey?: 'quotes'
}

const ic = (C: typeof LayoutGrid) => <C size={18} />

export const navMain: NavItem[] = [
  { to: '/', label: 'Хяналтын самбар', title: 'Хяналтын самбар', subtitle: 'Бизнесийн ерөнхий тойм', icon: ic(LayoutGrid) },
  { to: '/orders', label: 'Захиалга', title: 'Захиалга', subtitle: 'Бүх захиалгыг удирдах', icon: ic(ShoppingBag), searchPlaceholder: 'Захиалга хайх…' },
  { to: '/products', label: 'Бараа', title: 'Бараа', subtitle: 'Бүтээгдэхүүн, нөөцийн удирдлага', icon: ic(Package), searchPlaceholder: 'Бараа хайх…' },
  { to: '/categories', label: 'Ангилал', title: 'Ангилал', subtitle: 'Барааны ангиллыг удирдах', icon: ic(Tag) },
  { to: '/production', label: 'Үйлдвэрлэл', title: 'Үйлдвэрлэл', subtitle: 'Өдөр тутмын үйлдвэрлэлийн бүртгэл', icon: ic(Calendar) },
  { to: '/purchases', label: 'Худалдан авалт', title: 'Худалдан авалт', subtitle: 'Түүхий эдийн худалдан авалт ба зардал', icon: ic(Wallet) },
  { to: '/quotes', label: 'Үнийн хүсэлт', title: 'Үнийн хүсэлт', subtitle: 'Харилцагчийн үнэ асуусан хүсэлт', icon: ic(MessageSquare), badgeKey: 'quotes' },
  { to: '/customers', label: 'Харилцагч', title: 'Харилцагч', subtitle: 'Хэрэглэгчийн жагсаалт', icon: ic(Users), searchPlaceholder: 'Харилцагч хайх…' },
]

export const navSystem: NavItem[] = [
  { to: '/reports', label: 'Тайлан', title: 'Тайлан', subtitle: 'Борлуулалтын дэлгэрэнгүй шинжилгээ', icon: ic(BarChart3) },
  { to: '/settings', label: 'Тохиргоо', title: 'Тохиргоо', subtitle: 'Системийн тохиргоо', icon: ic(Settings) },
]

export const allNav = [...navMain, ...navSystem]

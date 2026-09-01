'use client'

import { useState } from 'react'

type Registration = { id: string; patientName: string | null; phone: string | null; clinic: string; doctor: string; visitDate: string; complaint: string; status: string; queueNumber: number }
type DoctorSchedule = { id: string; name: string; specialty: string; room: string; color: string; dayOfWeek: number; startTime: string; endTime: string }
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Settings,
  Stethoscope,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'

const appointments = [
  { time: '08:30', name: 'Budi Santoso', type: 'Pemeriksaan umum', doctor: 'dr. Aditya Pratama', color: 'bg-teal-100 text-teal-700', status: 'Menunggu' },
  { time: '09:15', name: 'Siti Rahmawati', type: 'Kontrol kesehatan', doctor: 'dr. Maya Lestari', color: 'bg-sky-100 text-sky-700', status: 'Terdaftar' },
  { time: '10:00', name: 'Andi Wijaya', type: 'Konsultasi', doctor: 'dr. Aditya Pratama', color: 'bg-amber-100 text-amber-700', status: 'Terdaftar' },
  { time: '10:45', name: 'Dewi Anggraini', type: 'Pemeriksaan umum', doctor: 'dr. Maya Lestari', color: 'bg-violet-100 text-violet-700', status: 'Selesai' },
]

const activities = [
  { name: 'Rina Kusuma', detail: 'Pendaftaran pasien baru', time: '5 menit lalu', initials: 'RK', tone: 'bg-rose-100 text-rose-700' },
  { name: 'Budi Santoso', detail: 'Pembayaran berhasil', time: '12 menit lalu', initials: 'BS', tone: 'bg-teal-100 text-teal-700' },
  { name: 'Andi Wijaya', detail: 'Hasil lab tersedia', time: '25 menit lalu', initials: 'AW', tone: 'bg-sky-100 text-sky-700' },
]

function StatCard({ label, value, change, icon: Icon, tone }: { label: string; value: string; change: string; icon: typeof UsersRound; tone: string }) {
  return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-start justify-between"><div className={`flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{change}</span></div>
    <p className="mt-5 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
  </div>
}

export default function ClinicDashboard() {
  const [active, setActive] = useState('Dashboard')
  const [open, setOpen] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [registrationsLoading, setRegistrationsLoading] = useState(false)
  const [registrationsError, setRegistrationsError] = useState('')
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([])
  const [doctorLoading, setDoctorLoading] = useState(false)
  const [doctorError, setDoctorError] = useState('')

  async function loadDoctorSchedules() {
    setDoctorLoading(true)
    setDoctorError('')
    try {
      const response = await fetch('/api/doctors', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setDoctorSchedules(result.doctors)
    } catch (loadError) {
      setDoctorError(loadError instanceof Error ? loadError.message : 'Jadwal dokter gagal dimuat.')
    } finally {
      setDoctorLoading(false)
    }
  }

  async function loadRegistrations() {
    setRegistrationsLoading(true)
    setRegistrationsError('')
    try {
      const response = await fetch('/api/registrations', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setRegistrations(result.registrations)
    } catch (loadError) {
      setRegistrationsError(loadError instanceof Error ? loadError.message : 'Data pendaftaran gagal dimuat.')
    } finally {
      setRegistrationsLoading(false)
    }
  }

  function selectMenu(label: string) {
    setActive(label)
    if (label === 'Pendaftaran') void loadRegistrations()
    if (label === 'Jadwal Dokter') void loadDoctorSchedules()
  }

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const form = new FormData(event.currentTarget)
      const controls = Array.from(event.currentTarget.querySelectorAll('input, select, textarea')) as HTMLInputElement[]
      const values = controls.map((control) => control.value.trim())
      const payload = {
        name: String(form.get('name') ?? values[0] ?? ''),
        birthDate: String(form.get('birthDate') ?? values[1] ?? ''),
        nationalId: String(form.get('nationalId') ?? values[3] ?? ''),
        phone: String(form.get('phone') ?? values[4] ?? ''),
        clinic: String(form.get('clinic') ?? values[5] ?? 'Poli Umum'),
        doctor: String(form.get('doctor') ?? values[6] ?? 'Dokter jaga'),
        visitDate: String(form.get('visitDate') ?? values[7] ?? new Date().toISOString().slice(0, 10)),
        complaint: String(form.get('complaint') ?? values[8] ?? 'Pemeriksaan umum'),
      }
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error ?? 'Pendaftaran gagal disimpan.')
      setRegistered(true)
      void loadRegistrations()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Pendaftaran gagal disimpan.')
    } finally {
      setSaving(false)
    }
  }

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Pendaftaran', icon: FileText }, { label: 'Pasien', icon: UsersRound }, { label: 'Jadwal Dokter', icon: CalendarDays }, { label: 'Rekam Medis', icon: Activity },
  ]
  const secondary = [{ label: 'Pengaturan', icon: Settings }, { label: 'Bantuan', icon: CircleHelp }]

  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
      <div className="flex items-center gap-3 px-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Stethoscope size={21} /></div><div><p className="font-bold tracking-tight">Klinika</p><p className="text-xs text-muted-foreground">Healthcare system</p></div></div>
      <div className="mt-10 flex flex-1 flex-col gap-1"><p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Menu utama</p>{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => selectMenu(label)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active === label ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon size={18} />{label}{label === 'Pendaftaran' && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${active === label ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-teal-50 text-teal-700'}`}>12</span>}</button>)}</div>
      <div className="flex flex-col gap-1 border-t border-border pt-4">{secondary.map(({ label, icon: Icon }) => <button key={label} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Icon size={18} />{label}</button>)}</div>
      <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted p-3"><div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">AP</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Alya Putri</p><p className="truncate text-xs text-muted-foreground">Administrator</p></div><ChevronDown size={15} className="text-muted-foreground" /></div>
    </aside>

    <div className="lg:pl-64"><header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button aria-label="Buka menu" onClick={() => setMobileNav(!mobileNav)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"><Menu size={20} /></button><div><p className="text-sm text-muted-foreground">Senin, 24 Juni 2024</p><h1 className="text-lg font-bold tracking-tight">Selamat pagi, Alya</h1></div></div><div className="flex items-center gap-2 md:gap-4"><button aria-label="Cari" className="hidden rounded-lg p-2.5 text-muted-foreground hover:bg-muted sm:block"><Search size={19} /></button><button aria-label="Notifikasi" className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-muted"><Bell size={19} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" /></button><div className="hidden h-7 w-px bg-border sm:block" /><div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">AP</div></div></header>
      {mobileNav && <div className="border-b border-border bg-card px-5 py-3 lg:hidden"><div className="flex flex-col gap-1">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => { selectMenu(label); setMobileNav(false) }} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active === label ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}><Icon size={17} />{label}</button>)}</div></div>}
      <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-9">{active === 'Jadwal Dokter' && <section className="mb-7 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-primary">Data database Neon</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Jadwal dokter</h2><p className="mt-1 text-sm text-muted-foreground">Jadwal praktik aktif dari database klinik.</p></div><button onClick={() => void loadDoctorSchedules()} className="rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">Muat ulang</button></div>{doctorLoading ? <p className="mt-8 text-sm text-muted-foreground">Memuat jadwal dokter...</p> : doctorError ? <p role="alert" className="mt-8 text-sm text-destructive">{doctorError}</p> : doctorSchedules.length === 0 ? <p className="mt-8 text-sm text-muted-foreground">Belum ada jadwal dokter.</p> : <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{doctorSchedules.map((item) => <article key={item.id} className="rounded-xl border border-border bg-background p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{item.name.replace('dr. ', '').split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><h3 className="font-semibold">{item.name}</h3><p className="text-xs text-muted-foreground">{item.specialty}</p></div></div><span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">Aktif</span></div><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm"><span className="text-muted-foreground">{['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][item.dayOfWeek]}</span><span className="font-semibold">{item.startTime.slice(0, 5)} – {item.endTime.slice(0, 5)}</span></div><p className="mt-2 text-xs text-muted-foreground">{item.room}</p></article>)}</div>}</section>}{active === 'Pendaftaran' && <section className="mb-7 rounded-2xl border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border p-5"><div><p className="text-sm font-medium text-primary">Data database Neon</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Pendaftaran pasien</h2><p className="mt-1 text-sm text-muted-foreground">Data nyata yang tersimpan di database klinik.</p></div><button onClick={() => void loadRegistrations()} className="rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">Muat ulang</button></div>{registrationsLoading ? <p className="p-8 text-sm text-muted-foreground">Memuat data pendaftaran...</p> : registrationsError ? <p role="alert" className="p-8 text-sm text-destructive">{registrationsError}</p> : registrations.length === 0 ? <p className="p-8 text-sm text-muted-foreground">Belum ada data pendaftaran di database.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-5 py-3">Antrean</th><th className="px-5 py-3">Pasien</th><th className="px-5 py-3">Poli</th><th className="px-5 py-3">Dokter</th><th className="px-5 py-3">Tanggal</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{registrations.map((item) => <tr key={item.id} className="border-t border-border"><td className="px-5 py-4 font-bold text-primary">A-{String(item.queueNumber).padStart(2, '0')}</td><td className="px-5 py-4"><p className="font-semibold">{item.patientName ?? 'Pasien'}</p><p className="text-xs text-muted-foreground">{item.phone ?? '—'}</p></td><td className="px-5 py-4">{item.clinic}</td><td className="px-5 py-4 text-muted-foreground">{item.doctor}</td><td className="px-5 py-4 text-muted-foreground">{new Date(item.visitDate).toLocaleDateString('id-ID')}</td><td className="px-5 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{item.status}</span></td></tr>)}</tbody></table></div>}</section>}<div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-primary">Ringkasan hari ini</p><h2 className="text-3xl font-bold tracking-tight">Dashboard klinik</h2><p className="mt-1 text-sm text-muted-foreground">Pantau aktivitas klinik dan kelola pasien dengan mudah.</p></div><button onClick={() => { setOpen(true); setRegistered(false) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"><Plus size={18} />Pendaftaran baru</button></div>
        {active === 'Dashboard' && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total pasien hari ini" value="128" change="+12.5%" icon={UsersRound} tone="bg-teal-50 text-teal-700" /><StatCard label="Menunggu dilayani" value="24" change="+4.2%" icon={Clock3} tone="bg-amber-50 text-amber-700" /><StatCard label="Dokter aktif" value="8" change="+1" icon={Stethoscope} tone="bg-sky-50 text-sky-700" /><StatCard label="Pendapatan hari ini" value="Rp 8,4 jt" change="+8.7%" icon={Activity} tone="bg-violet-50 text-violet-700" /></div>
        <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border p-5"><div><h3 className="font-bold">Pendaftaran hari ini</h3><p className="mt-1 text-xs text-muted-foreground">Senin, 24 Juni 2024 · 12 pendaftaran</p></div><button onClick={() => setActive('Pendaftaran')} className="text-sm font-semibold text-primary hover:underline">Lihat semua</button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Jam</th><th className="px-5 py-3 font-medium">Pasien</th><th className="px-5 py-3 font-medium">Dokter</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3" /></tr></thead><tbody>{appointments.map((item) => <tr key={item.name} className="border-t border-border"><td className="px-5 py-4 font-semibold text-foreground">{item.time}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><div className={`flex size-8 items-center justify-center rounded-full text-[10px] font-bold ${item.color}`}>{item.name.split(' ').map(x => x[0]).join('').slice(0,2)}</div><div><p className="font-semibold">{item.name}</p><p className="text-xs text-muted-foreground">{item.type}</p></div></div></td><td className="px-5 py-4 text-muted-foreground">{item.doctor}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : item.status === 'Menunggu' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>{item.status}</span></td><td className="px-5 py-4 text-right"><button aria-label={`Opsi ${item.name}`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></section>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-bold">Aktivitas terbaru</h3><p className="mt-1 text-xs text-muted-foreground">Pembaruan aktivitas klinik</p></div><button aria-label="Opsi aktivitas" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><MoreHorizontal size={17} /></button></div><div className="mt-6 flex flex-col gap-5">{activities.map((item) => <div key={item.name} className="flex items-center gap-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.tone}`}>{item.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="truncate text-xs text-muted-foreground">{item.detail}</p></div><span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span></div>)}</div><div className="mt-7 rounded-xl bg-primary/5 p-4"><div className="flex gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Phone size={15} /></div><div><p className="text-sm font-semibold">Butuh bantuan?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Hubungi tim support kami jika mengalami kendala.</p><button className="mt-2 text-xs font-semibold text-primary">Hubungi support →</button></div></div></div></section></div></>}
      </main></div>

    {open && <div role="dialog" aria-modal="true" aria-labelledby="registration-title" className="fixed inset-0 z-30 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl"><div className="flex items-start justify-between border-b border-border p-6"><div><h2 id="registration-title" className="text-xl font-bold">Pendaftaran pasien baru</h2><p className="mt-1 text-sm text-muted-foreground">Isi data pasien untuk membuat pendaftaran.</p></div><button aria-label="Tutup" onClick={() => setOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X size={18} /></button></div>{registered ? <div className="flex flex-col items-center px-6 py-12 text-center"><div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={28} /></div><h3 className="mt-4 text-lg font-bold">Pendaftaran berhasil</h3><p className="mt-2 max-w-xs text-sm text-muted-foreground">Pasien telah ditambahkan ke antrean hari ini.</p><button onClick={() => setOpen(false)} className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Selesai</button></div> : <form noValidate onSubmit={submitRegistration} className="flex flex-col gap-4 p-6"><label className="flex flex-col gap-2 text-sm font-medium">Nama lengkap<input required name="name" placeholder="Masukkan nama pasien" className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/20 placeholder:text-muted-foreground focus:ring-4" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-medium">Tanggal lahir<input name="birthDate" required type="date" className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary/20" /></label><label className="flex flex-col gap-2 text-sm font-medium">Jenis kelamin<select name="gender" className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary/20"><option>Perempuan</option><option>Laki-laki</option></select></label></div><label className="flex flex-col gap-2 text-sm font-medium">Nomor telepon<input required type="tel" placeholder="08xx-xxxx-xxxx" className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/20 placeholder:text-muted-foreground focus:ring-4" /></label><label className="flex flex-col gap-2 text-sm font-medium">Poli tujuan<select className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary/20"><option>Poli Umum</option><option>Poli Gigi</option><option>Poli Anak</option></select></label><div className="mt-2 flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Batal</button><button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Simpan pendaftaran</button></div>{error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}</form>}</div></div>}
  </div>
}

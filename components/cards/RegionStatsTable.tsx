"use client";

const regionStats = [
  { id: 1, name: "O'zbekiston", users: 652386, views: 2198910 },
  { id: 2, name: "O'zbekiston (xalqaro)", users: 4100, views: 2482 },
  { id: 3, name: "Rossiya", users: 450, views: 1635 },
  { id: 4, name: "Tojikiston", users: 260, views: 1896 },
  { id: 5, name: "Janubiy Koreya", users: 163, views: 639 },
  { id: 6, name: "Qirg'iziston", users: 128, views: 548 },
  { id: 7, name: "Qozo'g'iston", users: 89, views: 388 },
  { id: 8, name: "Turkiya", users: 84, views: 509 },
  { id: 9, name: "Afg'oniston", users: 58, views: 256 },
  { id: 10, name: "Turkmaniston", users: 36, views: 145 },
  { id: 11, name: "Germaniya", users: 28, views: 162 },
  { id: 12, name: "Amerika Qo'shma Shtatlari", users: 27, views: 112 },
  { id: 13, name: "Amerika Samoasi", users: 26, views: 207 },
  { id: 14, name: "Albaniya", users: 25, views: 65 },
  { id: 15, name: "Aland orollari", users: 24, views: 143 },
  { id: 16, name: "Angliya", users: 19, views: 55 },
  { id: 17, name: "Xitoy", users: 17, views: 75 },
  { id: 18, name: "Polsha", users: 16, views: 42 },
  { id: 19, name: "Yaponiya", users: 14, views: 95 },
  { id: 20, name: "Birlashgan Arab Amirliklari", users: 14, views: 31 },
  { id: 21, name: "Andorra", users: 12, views: 84 },
  { id: 22, name: "Saudiya Arabistoni", users: 11, views: 107 },
  { id: 23, name: "Buyuk Britaniya", users: 10, views: 21 },
  { id: 24, name: "Misr", users: 10, views: 161 },
  { id: 25, name: "Kanada", users: 9, views: 21 },
  { id: 26, name: "Italiya", users: 7, views: 116 },
  { id: 27, name: "Angola", users: 7, views: 62 },
  { id: 28, name: "Belarus", users: 6, views: 23 },
  { id: 29, name: "Argentina", users: 6, views: 23 },
  { id: 30, name: "Antarktika", users: 6, views: 15 },
  { id: 31, name: "Antigua and Barbuda", users: 5, views: 2 },
  { id: 32, name: "Xorvatiya", users: 5, views: 19 },
  { id: 33, name: "Shvetsiya", users: 4, views: 12 },
  { id: 34, name: "Qatar", users: 4, views: 33 },
  { id: 35, name: "Malayziya", users: 4, views: 11 },
  { id: 36, name: "Isroil", users: 3, views: 9 },
  { id: 37, name: "Braziliya", users: 3, views: 570 },
  { id: 38, name: "Shimoliy Koreya", users: 3, views: 4 },
  { id: 39, name: "Hindiston", users: 3, views: 19 },
  { id: 40, name: "Portugaliya", users: 3, views: 6 },
  { id: 41, name: "Ozarbayjon", users: 3, views: 14 },
  { id: 42, name: "Bolqariya", users: 3, views: 16 },
  { id: 43, name: "AQSH yondosh orollari", users: 2, views: 3 },
  { id: 44, name: "Armaniston", users: 2, views: 73 },
  { id: 45, name: "Avstraliya", users: 2, views: 3 },
  { id: 46, name: "Avstriya", users: 2, views: 2 },
  { id: 47, name: "Bahrayn", users: 2, views: 5 },
  { id: 48, name: "Belgiya", users: 2, views: 4 },
  { id: 49, name: "Chexiya", users: 2, views: 5 },
  { id: 50, name: "Daniya", users: 2, views: 2 },
  { id: 51, name: "Fransiya", users: 2, views: 11 },
  { id: 52, name: "Kambodja", users: 2, views: 1 },
  { id: 53, name: "Maldiv orollari", users: 2, views: 2 },
  { id: 54, name: "Niderlandiya", users: 2, views: 4 },
  { id: 55, name: "Singapur", users: 2, views: 1 },
  { id: 56, name: "Ukraina", users: 2, views: 8 },
  { id: 57, name: "Meksika", users: 1, views: 2 },
  { id: 58, name: "Kongo", users: 1, views: 6 },
  { id: 59, name: "Yangi Zelandiya", users: 1, views: 5 },
  { id: 60, name: "Norvegiya", users: 1, views: 1 },
  { id: 61, name: "Kipr", users: 1, views: 1 },
  { id: 62, name: "Kabo-Verde", users: 1, views: 2 },
  { id: 63, name: "Jibuti", users: 1, views: 6 },
  { id: 64, name: "Irlandiya oroli", users: 1, views: 1 },
  { id: 65, name: "Iordaniya", users: 1, views: 1 },
  { id: 66, name: "Gvadelupa", users: 1, views: 2 },
  { id: 67, name: "Gongkong", users: 1, views: 1 },
  { id: 68, name: "Gabon", users: 1, views: 6 },
  { id: 69, name: "Quvayt", users: 1, views: 3 },
  { id: 70, name: "Fransuz Gvianasi", users: 1, views: 2 },
  { id: 71, name: "Montserrat", users: 1, views: 3 },
];

export function RegionStatsTable() {
  return (
    <div className="flex flex-col h-full min-h-[420px]">
      <header className="mb-5 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl opacity-75 blur-sm"></div>
            <svg
              className="relative w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Viloyatlar statistikasi
          </h2>
        </div>
        <p className="text-sm text-slate-600 font-medium ml-11">Foydalanuvchilar va ko&apos;rishlar</p>
      </header>

      <div className="flex-1 max-h-[360px] overflow-y-auto overflow-x-hidden border border-slate-200/80 rounded-xl pr-2 overscroll-contain scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400 shadow-sm bg-white/50 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-200/60 text-xs">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 text-slate-600 uppercase text-[11px] tracking-wide sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3.5 text-left font-bold">№</th>
              <th className="px-4 py-3.5 text-left font-bold">Viloyat</th>
              <th className="px-4 py-3.5 text-right font-bold">Foydalanuvchilar</th>
              <th className="px-4 py-3.5 text-right font-bold">Ko&apos;rishlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/40 bg-white/80">
            {regionStats.map((region, index) => (
              <tr 
                key={region.id} 
                className="hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-purple-50/30 transition-all duration-200 group cursor-pointer"
                style={{
                  animationDelay: `${index * 0.02}s`,
                }}
              >
                <td className="px-4 py-3 text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                  {region.id}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                  {region.name}
                </td>
                <td className="px-4 py-3 text-right text-slate-900 font-bold group-hover:text-slate-950 transition-colors">
                  {region.users.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-slate-900 font-semibold flex items-center justify-end gap-2.5 group-hover:text-slate-950 transition-colors">
                  <div className="h-2 w-20 rounded-full bg-slate-200/80 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6A5AED] via-[#8B5CF6] to-[#C053E4] shadow-sm transition-all duration-300 group-hover:shadow-md"
                      style={{ 
                        width: `${Math.min(100, Math.max(5, (region.views / regionStats[0].views) * 100))}%`,
                        boxShadow: '0 0 8px rgba(106, 90, 237, 0.3)',
                      }}
                    />
                  </div>
                  <span className="font-bold min-w-[60px] text-right">{region.views.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


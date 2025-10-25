import React from 'react';
import { menuStructure } from "../../constants/menuStructure";


export default function Sidebar() {
  return (
    <aside id="sidebar" className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center p-3 mb-6 mt-2">
        <div className="bg-brand-indigo w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">Ad</div>
        <h1 className="text-2xl font-bold text-gray-900 ml-3">admin</h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuStructure.map((item, i) => (
          <div key={i} className="mb-1">
            <a href={item.path} className="flex items-center p-3 rounded-xl text-sm text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconPath}></path>
              </svg>
              <span className="flex-1">{item.name}</span>
            </a>
            {item.submenu && (
              <div className="ml-6 mt-1">
                {item.submenu.map((s, idx) => (
                  <a key={idx} href={s.path} className="flex items-center p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                    <span className="w-2 h-2 rounded-full mr-3 bg-gray-400" />
                    {s.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 mt-4">
        <div className="flex items-center p-2 rounded-xl bg-gray-50">
          <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm">NV</div>
          <div className="ml-3">
            <p className="font-semibold text-gray-800">Nguyễn Tiến Thành</p>
            <p className="text-xs text-gray-500">Quản lý hệ thống</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import React from 'react'
import '../../App.css'
const Sidebar = () => {

  return (
    <>
      <div className="section">
        <div className="bg-gray-800 text-black h-screen p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <ul className="space-y-4">
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Dashboard</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Users</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Products</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Orders</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar
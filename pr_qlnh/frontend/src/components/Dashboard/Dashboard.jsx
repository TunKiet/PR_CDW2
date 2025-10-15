import React from 'react'
import Sidebar from '../Sidebar/Sidebar'

const Dashboard = () => {
  return (
    <>
      <div className="section">
        
      </div><div className="flex min-h-screen">
      {/* Sidebar - chiếm 30% */}
      <div className="w-[30%]">
        <Sidebar/>
      </div>

      {/* Main content - chiếm 70% */}
      <div className="w-[70%] bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="bg-white p-4 rounded shadow">
          <p>Welcome to your admin dashboard!</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard
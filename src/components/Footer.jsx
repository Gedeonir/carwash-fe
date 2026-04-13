import React from 'react'
import { useNavigate } from 'react-router-dom'
const Footer = () => {
  const navigate = useNavigate()

  return (
      <footer className="border-t border-white/6 py-4 px-6">
        <div className="mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="text-sm text-surface-500">
            © 2025 Ikinamba. All rights reserved.
          </div>
          {/* <button
            onClick={() => navigate("/admin/overview")}
            className="text-xs text-surface-600 hover:text-surface-400 transition-colors"
          >
            Admin →
          </button> */}
        </div>
      </footer>
  )
}

export default Footer
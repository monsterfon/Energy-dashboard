"use client"

import { useState, useEffect } from "react"
import { Car, Sun, Battery, Flame } from "lucide-react"

export default function EnergyDashboard() {
  // In a real app, this data would come from an API
  const [data, setData] = useState({
    grid: -2.33,
    solar: 9.04,
    home: -11.39,
    car: -11.01,
    heatPump: -1.25,
    heating: -0.85,
    fridge: -0.42,
    appliance: 399, // in watts
    battery: {
      power: 20,
      percentage: 23,
    },
    average15min: 47.9,
  })

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        solar: +(prev.solar + (Math.random() * 0.2 - 0.1)).toFixed(2),
        car: prev.car < -0.1 ? +(prev.car + (Math.random() * 0.3 - 0.1)).toFixed(2) : prev.car,
        heatPump: +(prev.heatPump + (Math.random() * 0.2 - 0.1)).toFixed(2),
        heating: +(prev.heating + (Math.random() * 0.15 - 0.05)).toFixed(2),
        fridge: +(prev.fridge + (Math.random() * 0.05 - 0.02)).toFixed(2),
        home: +(prev.home + (Math.random() * 0.4 - 0.2)).toFixed(2),
        grid: +(prev.grid + (Math.random() * 0.3 - 0.15)).toFixed(2),
        appliance: Math.max(300, Math.min(500, prev.appliance + Math.floor(Math.random() * 20 - 10))),
        battery: {
          power: Math.min(100, Math.max(0, prev.battery.power + Math.floor(Math.random() * 5 - 2))),
          percentage: Math.min(100, Math.max(0, prev.battery.percentage + Math.floor(Math.random() * 2 - 1))),
        },
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full min-h-screen bg-gray-800 p-4 flex items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-[4/3] bg-gray-800 rounded-xl p-6">
        {/* SVG for all elements without connections */}
        <svg className="w-full h-full" viewBox="0 0 800 600">
          {/* House in center - made bigger */}
          <g transform="translate(400, 300)">
            <path d="M-100,-70 L0,-130 L100,-70 L100,70 L-100,70 Z" stroke="#22c55e" strokeWidth="4" fill="none" />
            <text x="0" y="15" textAnchor="middle" fill="#22c55e" fontSize="32" fontWeight="bold">
              {data.home} kW
            </text>
            <text x="0" y="100" textAnchor="middle" fill="#d1d5db" fontSize="18">
              15min average
            </text>
            <text x="0" y="130" textAnchor="middle" fill="#d1d5db" fontSize="24" fontWeight="bold">
              {data.average15min} kW
            </text>
          </g>

          {/* Fridge - Above House */}
          <g transform="translate(400, 120)">
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              {/* Fridge icon */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="2" width="16" height="20" rx="2" stroke="#ef4444" strokeWidth="2" />
                <line x1="4" y1="10" x2="20" y2="10" stroke="#ef4444" strokeWidth="2" />
                <line x1="9" y1="6" x2="9" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="9" y1="14" x2="9" y2="16" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.fridge} kW
            </text>
          </g>

          {/* Grid - Top Left - now grey */}
          <g transform="translate(150, 120)">
            <circle r="70" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="4" />
            <path d="M0,-20 L-20,20 L20,20 Z" stroke="#9ca3af" fill="none" strokeWidth="3" />
            <text x="0" y="40" textAnchor="middle" fill="#9ca3af" fontSize="24" fontWeight="bold">
              {data.grid} kW
            </text>
          </g>

          {/* PV Panels - Top Right - made bigger */}
          <g transform="translate(650, 120)">
            <circle r="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              <Sun size={32} />
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#22c55e" fontSize="24" fontWeight="bold">
              {data.solar} kW
            </text>
          </g>

          {/* Appliance - Left Center - made bigger */}
          <g transform="translate(150, 300)">
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="14" rx="2" stroke="#ef4444" strokeWidth="2" />
                <circle cx="12" cy="13" r="3" stroke="#ef4444" strokeWidth="2" />
                <path d="M4 10H20" stroke="#ef4444" strokeWidth="2" />
              </svg>
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.appliance} W
            </text>
          </g>

          {/* Battery - Right Center - made bigger */}
          <g transform="translate(650, 300)">
            <circle r="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="4" />
            <g transform="translate(-24, -35) scale(1.5)">
              <Battery size={32} />
            </g>
            <text x="0" y="20" textAnchor="middle" fill="#22c55e" fontSize="24" fontWeight="bold">
              {data.battery.power} W
            </text>
            <text x="0" y="50" textAnchor="middle" fill="#22c55e" fontSize="20">
              {data.battery.percentage}%
            </text>
          </g>

          {/* Car - Bottom Left - made bigger */}
          <g transform="translate(150, 480)">
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              <Car size={32} />
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.car} kW
            </text>
          </g>

          {/* Heat Pump - Bottom Right - now red */}
          <g transform="translate(650, 480)">
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              {/* Improved heat pump icon */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="#ef4444" strokeWidth="2" />
                <path d="M6 8C6 8 8 10 12 10C16 10 18 8 18 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M6 12C6 12 8 14 12 14C16 14 18 12 18 12"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 16C6 16 8 18 12 18C16 18 18 16 18 16"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.heatPump} kW
            </text>
          </g>

          {/* New Heating Button - Moved further down */}
          <g transform="translate(400, 530)">
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              <Flame size={32} className="text-red-500" />
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.heating} kW
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}


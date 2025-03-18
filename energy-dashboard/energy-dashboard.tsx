"use client"

import { useState, useEffect } from "react"
import { Car, Sun, Battery, Waves } from "lucide-react"

export default function EnergyDashboard() {
  // In a real app, this data would come from an API
  const [data, setData] = useState({
    grid: -2.33,
    solar: 9.04,
    home: -11.39,
    car: -11.01,
    heatPump: -1.25,
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

  // Determine if a value is consumption (negative) or generation (positive)
  const getCircleColor = (value: number) => {
    return value < 0 ? "bg-red-100 border-red-300 text-red-500" : "bg-green-100 border-green-300 text-green-500"
  }

  return (
    <div className="w-full min-h-screen bg-gray-800 p-4 flex items-center justify-center">
      <div className="relative w-full max-w-3xl aspect-[4/3] bg-gray-800 rounded-xl p-6">
        {/* House in center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <svg width="120" height="100" viewBox="0 0 120 100" className="stroke-green-400 fill-transparent stroke-2">
              <path d="M10,50 L60,10 L110,50 L110,90 L10,90 Z" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-green-400">
              <span className="text-xl font-bold">{data.home} kW</span>
            </div>
          </div>
          <div className="text-center text-gray-300 mt-4">
            <div>15min average</div>
            <div className="font-bold">{data.average15min} kW</div>
          </div>
        </div>

        {/* Connection lines - using SVG for better curved lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* Grid to House */}
          <path d="M90,50 C 90,50 110,50 140,80" stroke="#ef4444" strokeWidth="2" fill="none" />

          {/* Solar to House */}
          <path d="M350,50 C 350,50 320,60 280,80" stroke="#22c55e" strokeWidth="2" fill="none" />

          {/* Appliance to House */}
          <path d="M90,200 C 120,200 150,180 180,180" stroke="#ef4444" strokeWidth="2" fill="none" />

          {/* Battery to House */}
          <path d="M350,200 C 320,200 290,180 260,180" stroke="#22c55e" strokeWidth="2" fill="none" />

          {/* Car to House */}
          <path d="M90,350 C 120,320 150,280 180,250" stroke="#ef4444" strokeWidth="2" fill="none" />

          {/* Heat Pump to House */}
          <path d="M220,350 C 220,320 220,280 220,250" stroke="#9ca3af" strokeWidth="2" fill="none" />
        </svg>

        {/* PV Panels - Top Right */}
        <div className="absolute right-12 top-6 z-10">
          <div
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 ${getCircleColor(data.solar)}`}
          >
            <Sun className="w-8 h-8" />
            <span className="font-bold text-sm">{data.solar} kW</span>
          </div>
        </div>

        {/* Grid - Top Left */}
        <div className="absolute left-12 top-6 z-10">
          <div
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 ${getCircleColor(data.grid)}`}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L5 12H19L12 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold text-sm">{data.grid} kW</span>
          </div>
        </div>

        {/* Heat Pump - Bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 bg-gray-100 border-gray-300 text-gray-500`}
          >
            <Waves className="w-8 h-8" />
            <span className="font-bold text-sm">{data.heatPump} kW</span>
          </div>
        </div>

        {/* Electric Car - Bottom Left */}
        <div className="absolute left-12 bottom-6 z-10">
          <div
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 ${getCircleColor(data.car)}`}
          >
            <Car className="w-8 h-8" />
            <span className="font-bold text-sm">{data.car} kW</span>
          </div>
        </div>

        {/* Battery - Bottom Right */}
        <div className="absolute right-12 bottom-6 z-10">
          <div
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 ${getCircleColor(data.battery.power)}`}
          >
            <Battery className="w-8 h-8" />
            <span className="font-bold text-sm">{data.battery.power} W</span>
            <span className="text-xs">{data.battery.percentage}%</span>
          </div>
        </div>

        {/* Heating and Cooling/Appliance - Left */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
          <div
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 bg-red-100 border-red-300 text-red-500`}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M4 10H20" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="font-bold text-sm">{data.appliance} W</span>
          </div>
        </div>
      </div>
    </div>
  )
}


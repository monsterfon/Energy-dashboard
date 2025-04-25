"use client"

import { useState, useEffect, useRef } from "react"
import { Car, Sun, Battery, Flame, Cloud, CloudRain, X, ChevronUp, ChevronDown } from "lucide-react"

export default function EnergyDashboard() {
  // In a real app, this data would come from an API
  const [data, setData] = useState({
    grid: -2.33,
    solar: 9.04,
    home: -11.39,
    car: -11.01,
    heatPump: -5,
    heating: -3,
    fridge: -0.42,
    appliance: -1, // in kilowatts (changed from watts)
    battery: {
      power: 5000,
      percentage: 23,
    },
    average15min: 47.9,
  })

  const [weatherMode, setWeatherMode] = useState("sunny")
  
  // State for component value adjustment
  const [editComponent, setEditComponent] = useState(null)
  const [editValue, setEditValue] = useState(0)
  const [isAutoUpdating, setIsAutoUpdating] = useState(true)
  
  // New state for automatic/manual mode
  const [isAutoMode, setIsAutoMode] = useState(true)
  
  // Track which components have been manually edited by the user
  const [userEditedComponents, setUserEditedComponents] = useState({
    solar: false,
    car: false,
    heatPump: false,
    heating: false,
    fridge: false,
    appliance: false,
    battery: false,
  })
  
  // Ref to keep track of the interval
  const intervalRef = useRef(null)

  // Toggle between automatic and manual modes
  const toggleAutoMode = () => {
    setIsAutoMode(prev => !prev)
  }

  // Simulate data updates
  useEffect(() => {
    // Use the shared startAutoUpdates function to avoid duplicate code
    startAutoUpdates();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [weatherMode, userEditedComponents, isAutoMode]); // Added isAutoMode as dependency

  // Handle weather mode changes
  const handleWeatherChange = (mode) => {
    setWeatherMode(mode)

    // Adjust solar output based on weather
    let solarAdjustment = 0
    switch (mode) {
      case "sunny":
        solarAdjustment = 9 + Math.random() * 2
        break
      case "cloudy":
        solarAdjustment = 4 + Math.random() * 2
        break
      case "rainy":
        solarAdjustment = 1 + Math.random() * 1.5
        break
    }

    setData((prev) => ({
      ...prev,
      solar: +solarAdjustment.toFixed(2),
    }))
  }

  // Handle opening the edit modal for a component
  const handleEditComponent = (component, initialValue) => {
    // Stop auto updates when editing
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      setIsAutoUpdating(false)
    }
    
    setEditComponent(component)
    
    // For battery (object with power property), convert from W to kW
    if (component === 'battery') {
      setEditValue(initialValue.power / 1000)
    } else {
      // For consumers (negative values), show absolute value in modal
      setEditValue(Math.abs(initialValue))
    }
  }
  
  // Handle saving the edited value
  const handleSaveEdit = () => {
    if (!editComponent) return
    
    // Mark this component as user-edited
    setUserEditedComponents(prev => ({
      ...prev,
      [editComponent]: true
    }))
    
    setData(prev => {
      const updated = { ...prev }
      
      if (editComponent === 'battery') {
        // Convert back to watts for storage
        updated.battery = {
          ...prev.battery,
          power: editValue * 1000
        }
      } else if (['car', 'heatPump', 'heating', 'fridge', 'appliance'].includes(editComponent)) {
        // For consumers, store as negative value
        updated[editComponent] = -Math.abs(editValue)
      } else {
        // For solar, store as is (positive)
        updated[editComponent] = editValue
      }
      
      return updated
    })
    
    // Close the modal
    setEditComponent(null)
    
    // Restart auto updates if they were enabled before
    if (!isAutoUpdating) {
      startAutoUpdates()
    }
  }
  
  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditComponent(null)
    
    // Restart auto updates if they were enabled before
    if (!isAutoUpdating) {
      startAutoUpdates()
    }
  }
  
  // Handle value adjustment with arrow buttons
  const adjustValue = (amount) => {
    setEditValue(prev => {
      // Calculate new value with 2 decimal places
      const newValue = +(prev + amount).toFixed(2)
      // Don't allow negative values in the adjustment modal
      return Math.max(0, newValue)
    })
  }
  
  // Start auto updates
  const startAutoUpdates = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Start a new interval
    intervalRef.current = setInterval(() => {
      setData((prev) => {
        // Update individual components first
        const updatedData = { ...prev };
        
        // Only update solar if the user hasn't manually set it
        if (!userEditedComponents.solar) {
          // Calculate solar output based on current weather mode
          switch (weatherMode) {
            case "sunny":
              updatedData.solar = +(9 + Math.random() * 2).toFixed(2);
              break;
            case "cloudy":
              updatedData.solar = +(4 + Math.random() * 2).toFixed(2);
              break;
            case "rainy":
              updatedData.solar = +(1 + Math.random() * 1.5).toFixed(2);
              break;
          }
        }
        
        // Handle car charging differently based on mode
        if (!userEditedComponents.car) {
          if (!isAutoMode) {
            // In manual mode, use the random fluctuation (as before)
            updatedData.car = prev.car < -0.1 ? +(prev.car + (Math.random() * 0.3 - 0.1)).toFixed(2) : prev.car;
          } else {
            // New automatic mode implementation
            // If grid is below zero, decrease car charging by 1kW every interval until grid goes above zero
            if (prev.grid < 0) {
              // Grid is negative, decrease car charging
              const newCarCharging = prev.car + 1;
              console.log("AUTO MODE: Decreasing car charging from", prev.car, "to", newCarCharging);
              updatedData.car = +newCarCharging.toFixed(2);
            } else {
              // Grid is already at or above zero, don't change car charging
              updatedData.car = prev.car;
            }
          }
        }
        
        if (!userEditedComponents.heatPump) {
          updatedData.heatPump = -5; // Fixed default value
        }
        
        if (!userEditedComponents.heating) {
          updatedData.heating = -3; // Fixed default value
        }
        
        if (!userEditedComponents.fridge) {
          updatedData.fridge = +(prev.fridge + (Math.random() * 0.05 - 0.02)).toFixed(2);
        }
        
        if (!userEditedComponents.appliance) {
          // Heavy random factor for appliance: randomly fluctuates between -0.5 and -3.5 kW
          // Simulates various appliances turning on and off (washing machine, oven, microwave, etc.)
          const applianceBase = -2;
          const applianceVariation = Math.random() * 3; // 0 to 3
          updatedData.appliance = +(applianceBase - applianceVariation).toFixed(2);
        }
        
        if (!userEditedComponents.battery) {
          updatedData.battery = {
            power: 5000, // Fixed default value
            percentage: Math.min(100, Math.max(0, prev.battery.percentage + Math.floor(Math.random() * 2 - 1))),
          };
        } else {
          // Update only the percentage, but keep the user-set power value
          updatedData.battery = {
            ...prev.battery,
            percentage: Math.min(100, Math.max(0, prev.battery.percentage + Math.floor(Math.random() * 2 - 1))),
          };
        }
        
        // Calculate sum of all consumer components (red buttons)
        // Exclude home from its own calculation (only sum the actual devices)
        const consumerSum = +(updatedData.car + updatedData.heatPump + updatedData.heating + 
                            updatedData.fridge + updatedData.appliance).toFixed(2);
        
        // Update home value to be the sum of all consumer components
        updatedData.home = consumerSum;
        
        const batteryInKw = updatedData.battery.power / 1000;
        const greenComponents = updatedData.solar + batteryInKw;
        
        // Exclude grid and home from grid calculation - only consider actual devices
        const redComponents = updatedData.car + updatedData.heatPump + 
                            updatedData.heating + updatedData.fridge + updatedData.appliance;
        
        // Grid value is calculated as the sum of green components and red components
        updatedData.grid = +(greenComponents + redComponents).toFixed(2);
        
        
        // Log all components for debugging
        console.log("Energy Components:", {
          greenComponents: {
            solar: updatedData.solar,
            battery: batteryInKw,
            total: greenComponents.toFixed(2)
          },
          redComponents: {
            car: updatedData.car,
            heatPump: updatedData.heatPump,
            heating: updatedData.heating,
            fridge: updatedData.fridge,
            appliance: updatedData.appliance,
            total: redComponents.toFixed(2)
          },
          grid: updatedData.grid,
          home: updatedData.home
        });
        
        return updatedData;
      });
    }, 3000);
    
    setIsAutoUpdating(true);
  };
  
  // Initialize auto updates on component mount
  useEffect(() => {
    startAutoUpdates();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [weatherMode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      {/* Auto/Manual Mode Toggle Button */}
      <div className="mb-4 mt-4">
        <button
          onClick={toggleAutoMode}
          className={`px-6 py-3 rounded-full font-bold text-white transition-colors ${
            isAutoMode 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isAutoMode ? "Automatic Mode" : "Manual Mode"}
        </button>
        <p className="text-gray-300 text-sm mt-2 text-center">
          {isAutoMode 
            ? "Car charging is automatically adjusted to balance the grid" 
            : "All components use their set values"
          }
        </p>
      </div>

      <div className="relative">
        <svg viewBox="0 0 800 600" className="w-full h-auto">
          {/* Home */}
          <g transform="translate(400, 300)">
            <path d="M-100,-70 L0,-130 L100,-70 L100,70 L-100,70 Z" stroke="#22c55e" strokeWidth="4" fill="none" />
            <text x="0" y="0" textAnchor="middle" fill="#22c55e" fontSize="32" fontWeight="bold">
              {data.home} kW
            </text>
            <text x="0" y="40" textAnchor="middle" fill="#d1d5db" fontSize="18">
              15min average
            </text>
          </g>

          {/* Battery - Moved to top center */}
          <g 
            transform="translate(400, 70)" 
            className="cursor-pointer"
            onClick={() => handleEditComponent('battery', data.battery)}
          >
            <circle r="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="4" />
            <g transform="translate(-24, -35) scale(1.5)">
              <Battery size={32} />
            </g>
            <text x="0" y="20" textAnchor="middle" fill="#22c55e" fontSize="24" fontWeight="bold">
              {data.battery.power/1000} kW
            </text>
            <text x="0" y="50" textAnchor="middle" fill="#22c55e" fontSize="20">
              {data.battery.percentage}%
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
          <g 
            transform="translate(650, 120)"
            className="cursor-pointer"
            onClick={() => handleEditComponent('solar', data.solar)}
          >
            <circle r="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              <Sun size={32} />
              {/* Weather indicator overlays - moved up */}
              {weatherMode === "cloudy" && (
                <Cloud size={20} className="text-gray-500" style={{ position: 'absolute', top: -12, right: -10 }} />
              )}
              {weatherMode === "rainy" && (
                <CloudRain size={20} className="text-blue-800" style={{ position: 'absolute', top: -12, right: -10 }} />
              )}
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#22c55e" fontSize="24" fontWeight="bold">
              {data.solar} kW
            </text>
            <text x="-55" y="-55" textAnchor="start" fill="#d1d5db" fontSize="14">
              {weatherMode === "sunny" && "☀️ Optimal"}
              {weatherMode === "cloudy" && "☁️ Reduced"}
              {weatherMode === "rainy" && "🌧️ Minimal"}
            </text>
          </g>

          {/* Appliance - Left Center - made bigger */}
          <g 
            transform="translate(150, 300)"
            className="cursor-pointer"
            onClick={() => handleEditComponent('appliance', data.appliance)}
          >
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="14" rx="2" stroke="#ef4444" strokeWidth="2" />
                <circle cx="12" cy="13" r="3" stroke="#ef4444" strokeWidth="2" />
                <path d="M4 10H20" stroke="#ef4444" strokeWidth="2" />
              </svg>
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.appliance} kW
            </text>
          </g>

          {/* Fridge - Moved to right center */}
          <g 
            transform="translate(650, 300)"
            className="cursor-pointer"
            onClick={() => handleEditComponent('fridge', data.fridge)}
          >
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              {/* Improved Fridge icon */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Main fridge body */}
                <rect x="5" y="2" width="14" height="20" rx="2" stroke="#ef4444" strokeWidth="2" />
                {/* Divider line between freezer and fridge */}
                <line x1="5" y1="9" x2="19" y2="9" stroke="#ef4444" strokeWidth="2" />
                {/* Upper door handle */}
                <line x1="15" y1="5" x2="15" y2="7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                {/* Lower door handle */}
                <line x1="15" y1="12" x2="15" y2="14" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.fridge} kW
            </text>
          </g>

          {/* Car - Bottom Left - made bigger */}
          <g 
            transform="translate(150, 480)"
            className="cursor-pointer"
            onClick={() => handleEditComponent('car', data.car)}
          >
            <circle r="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
            <g transform="translate(-24, -24) scale(1.5)">
              <Car size={32} />
            </g>
            <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
              {data.car} kW
            </text>
          </g>

          {/* Heat Pump - Bottom Right - now red */}
          <g 
            transform="translate(650, 480)"
            className="cursor-pointer"
            onClick={() => handleEditComponent('heatPump', data.heatPump)}
          >
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
          <g 
            transform="translate(400, 530)"
            className="cursor-pointer"
            onClick={() => handleEditComponent('heating', data.heating)}
          >
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

      {/* Weather mode buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handleWeatherChange("rainy")}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-blue-900 border-2 ${weatherMode === "rainy" ? "border-white" : "border-blue-900"}`}
        >
          <CloudRain size={20} className="text-white" />
          <span className="text-white text-xs mt-0.5">Rainy</span>
        </button>

        <button
          onClick={() => handleWeatherChange("cloudy")}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-blue-400 border-2 ${weatherMode === "cloudy" ? "border-white" : "border-blue-400"}`}
        >
          <Cloud size={20} className="text-white" />
          <span className="text-white text-xs mt-0.5">Cloudy</span>
        </button>

        <button
          onClick={() => handleWeatherChange("sunny")}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-yellow-400 border-2 ${weatherMode === "sunny" ? "border-white" : "border-yellow-400"}`}
        >
          <Sun size={20} className="text-white" />
          <span className="text-white text-xs mt-0.5">Sunny</span>
        </button>
      </div>
      
      {/* Value Adjustment Modal */}
      {editComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg p-6 w-80 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white capitalize">
                {editComponent === 'heatPump' ? 'Heat Pump' : editComponent}
              </h3>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-300 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="text-5xl font-bold text-white mb-2">{editValue.toFixed(2)}</div>
              <div className="text-gray-300">kW</div>
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              <button 
                onClick={() => adjustValue(-1)}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white"
              >
                <ChevronDown size={24} />
              </button>
              <button 
                onClick={() => adjustValue(-0.1)}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white"
              >
                <span className="text-sm">-0.1</span>
              </button>
              <button 
                onClick={() => adjustValue(0.1)}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white"
              >
                <span className="text-sm">+0.1</span>
              </button>
              <button 
                onClick={() => adjustValue(1)}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white"
              >
                <ChevronUp size={24} />
              </button>
            </div>
            
            <button 
              onClick={handleSaveEdit}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

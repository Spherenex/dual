


// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
// import { Zap, Activity, Wifi, WifiOff, Battery, BatteryCharging, Sun } from 'lucide-react';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue, off } from 'firebase/database';
// import './App.css';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
//   authDomain: "waterdtection.firebaseapp.com",
//   databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
//   projectId: "waterdtection",
//   storageBucket: "waterdtection.firebasestorage.app",
//   messagingSenderId: "690886375729",
//   appId: "1:690886375729:web:172c3a47dda6585e4e1810",
//   measurementId: "G-TXF33Y6XY0"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const Dashboard = () => {
//   const [currentValue, setCurrentValue] = useState(0);
//   const [voltageValue, setVoltageValue] = useState(0);
//   const [currentHistory, setCurrentHistory] = useState([]);
//   const [voltageHistory, setVoltageHistory] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [connectionError, setConnectionError] = useState(null);
//   const [batteryLevel, setBatteryLevel] = useState(90);
//   const [isCharging, setIsCharging] = useState(false);
//   const [sunPosition, setSunPosition] = useState(50);

//   // State for current time
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Calculate sun position based on time of day
//   useEffect(() => {
//     const updateTimeAndPosition = () => {
//       const now = new Date();
//       setCurrentTime(now);
      
//       const hours = now.getHours();
//       const minutes = now.getMinutes();
//       const totalMinutes = hours * 60 + minutes;
      
//       // Sunrise at 6:30 (390 minutes) and sunset at 18:45 (1125 minutes)
//       const sunrise = 390;
//       const sunset = 1125;
//       const dayLength = sunset - sunrise;
      
//       // Calculate position percentage
//       if (totalMinutes < sunrise) {
//         setSunPosition(0);
//       } else if (totalMinutes > sunset) {
//         setSunPosition(100);
//       } else {
//         setSunPosition(((totalMinutes - sunrise) / dayLength) * 100);
//       }
//     };
    
//     updateTimeAndPosition();
//     const interval = setInterval(updateTimeAndPosition, 1000); // Update every second
    
//     return () => clearInterval(interval);
//   }, []);

//   const [batteryHistory, setBatteryHistory] = useState([]);

//   useEffect(() => {
//     // Reference to the Dual_Axis data
//     const dataRef = ref(database, 'Dual_Axis');
    
//     // Set up real-time listener
//     const unsubscribe = onValue(dataRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         if (data) {
//           const current = parseFloat(data.Current) || 0;
//           const voltage = parseFloat(data.Voltage) || 0;
//           const timestamp = new Date().toLocaleTimeString();
          
//           setCurrentValue(current);
//           setVoltageValue(voltage);
//           setLastUpdate(new Date());
//           setIsConnected(true);
//           setConnectionError(null);
          
//           // Update battery charging state - both current AND voltage must be above 8
//           const isChargingNow = current > 8 && voltage > 8;
//           setIsCharging(isChargingNow);
          
//           // Simulate battery level changes and update history in a single operation
//           // to avoid dependency loops
//           setBatteryLevel(prevLevel => {
//             let newLevel;
//             if (isChargingNow) {
//               newLevel = Math.min(prevLevel + 0.5, 100);
//             } else if (prevLevel > 0) {
//               newLevel = Math.max(prevLevel - 0.1, 0);
//             } else {
//               newLevel = prevLevel;
//             }
            
//             // Update battery history with the new level
//             setBatteryHistory(prev => {
//               const newHistory = [...prev, { time: timestamp, value: newLevel }];
//               return newHistory.slice(-20);
//             });
            
//             return newLevel;
//           });
          
//           // Update history (keep last 20 points)
//           setCurrentHistory(prev => {
//             const newHistory = [...prev, { time: timestamp, value: current }];
//             return newHistory.slice(-20);
//           });
          
//           setVoltageHistory(prev => {
//             const newHistory = [...prev, { time: timestamp, value: voltage }];
//             return newHistory.slice(-20);
//           });
//         }
//       } catch (error) {
//         console.error('Error processing Firebase data:', error);
//         setConnectionError(error.message);
//       }
//     }, (error) => {
//       console.error('Firebase connection error:', error);
//       setIsConnected(false);
//       setConnectionError(error.message);
//     });

//     // Initial connection status
//     setIsConnected(true);
    
//     // Cleanup function
//     return () => {
//       if (unsubscribe) {
//         off(dataRef, unsubscribe);
//       }
//     };
//   }, []); // Remove dependency on batteryLevel to prevent infinite loops

//   const formatTime = (timeStr) => {
//     return timeStr.split(':').slice(1).join(':');
//   };

//   const getStatusClass = (value, type) => {
//     if (type === 'current') {
//       if (value > 10) return 'danger';
//       if (value > 5) return 'warning';
//       return 'safe';
//     } else {
//       if (value > 5) return 'danger';
//       if (value > 3) return 'warning';
//       return 'safe';
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-wrapper">
//         {/* Header */}
//         <div className="dashboard-header">
//           <h1 className="dashboard-title">
//             🌊 Dual Axis Monitoring Dashboard
//           </h1>
//           <div className="connection-status">
//             <div className="status-indicator">
//               {isConnected ? (
//                 <>
//                   <Wifi style={{ width: '16px', height: '16px', color: '#10b981' }} />
//                   <span>Connected to Firebase</span>
//                 </>
//               ) : (
//                 <>
//                   <WifiOff style={{ width: '16px', height: '16px', color: '#ef4444' }} />
//                   <span>Disconnected</span>
//                 </>
//               )}
//             </div>
//             {lastUpdate && (
//               <span>
//                 Last update: {lastUpdate.toLocaleTimeString()}
//               </span>
//             )}
//             {connectionError && (
//               <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>
//                 Error: {connectionError}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Solar Tracking */}
//         <div style={{
//           background: 'rgba(255, 255, 255, 0.08)',
//           backdropFilter: 'blur(20px)',
//           borderRadius: '1.5rem',
//           padding: '2rem',
//           border: '1px solid rgba(255, 255, 255, 0.15)',
//           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
//           marginBottom: '2rem',
//           animation: 'fadeInUp 0.6s ease-out',
//           position: 'relative',
//           overflow: 'hidden'
//         }}>
//           <h2 style={{
//             fontSize: '1.5rem',
//             fontWeight: '700',
//             color: 'white',
//             textAlign: 'center',
//             marginBottom: '1.5rem'
//           }}>
//             ☀️ Real-Time Solar Tracking
//           </h2>
          
//           <div style={{
//             position: 'relative',
//             height: '6rem',
//             background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #60a5fa 100%)',
//             borderRadius: '9999px',
//             overflow: 'hidden',
//             border: '1px solid rgba(255, 255, 255, 0.2)'
//           }}>
//             <div style={{
//               position: 'absolute',
//               top: '0.5rem',
//               left: '2rem',
//               fontSize: '0.875rem',
//               fontWeight: '600',
//               color: '#1e3a8a'
//             }}>
//               {new Date(new Date().setHours(6, 30, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true})}
//             </div>
//             <div style={{
//               position: 'absolute',
//               top: '0.5rem',
//               right: '2rem',
//               fontSize: '0.875rem',
//               fontWeight: '600',
//               color: '#1e3a8a'
//             }}>
//               {new Date(new Date().setHours(18, 45, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true})}
//             </div>
            
//             {/* Current time in the middle */}
//             <div style={{
//               position: 'absolute',
//               top: '0.5rem',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               fontSize: '0.875rem',
//               fontWeight: '700',
//               color: '#1e3a8a',
//               backgroundColor: 'rgba(255, 255, 255, 0.3)',
//               padding: '0.25rem 0.75rem',
//               borderRadius: '9999px'
//             }}>
//               {currentTime.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', second:'2-digit', hour12: true})}
//             </div>
            
//             {/* Sun position
//             <div style={{
//               position: 'absolute',
//               top: '0.75rem',
//               left: `${sunPosition}%`,
//               transform: 'translateX(-50%)',
//               transition: 'left 0.5s ease'
//             }}>
//               <div style={{
//                 width: '2.5rem',
//                 height: '2.5rem',
//                 background: '#fcd34d',
//                 borderRadius: '9999px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 boxShadow: '0 0 20px rgba(252, 211, 77, 0.7)'
//               }}>
//                 <Sun style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
//               </div>
//             </div> */}
            
//             <div style={{
//               textAlign: 'center',
//               position: 'absolute',
//               bottom: '0.75rem',
//               width: '100%',
//               fontWeight: '600',
//               color: '#1e3a8a',
//               fontSize: '1.25rem'
//             }}>
//               Daytime
//             </div>
//           </div>
//         </div>

//         {/* Battery Card */}
//         <div style={{
//           background: 'rgba(255, 255, 255, 0.08)',
//           backdropFilter: 'blur(20px)',
//           borderRadius: '1.5rem',
//           padding: '2rem',
//           border: '1px solid rgba(255, 255, 255, 0.15)',
//           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
//           marginBottom: '2rem',
//           animation: 'fadeInUp 0.7s ease-out',
//           position: 'relative',
//           overflow: 'hidden'
//         }}>
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'space-between',
//             marginBottom: '1.5rem'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//               <div style={{
//                 width: '3.5rem',
//                 height: '3.5rem',
//                 borderRadius: '1rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
//                 border: '1px solid rgba(16, 185, 129, 0.3)'
//               }}>
//                 {isCharging ? (
//                   <BatteryCharging style={{ width: '1.75rem', height: '1.75rem', color: '#34d399' }} />
//                 ) : (
//                   <Battery style={{ width: '1.75rem', height: '1.75rem', color: '#34d399' }} />
//                 )}
//               </div>
//               <div>
//                 <h2 style={{ fontSize: '1.375rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
//                   Battery Status
//                 </h2>
//                 <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: '1.4' }}>
//                   {isCharging ? 'Currently charging' : 'Power supply status'}
//                 </p>
//               </div>
//             </div>
//             <div style={{
//               width: '12px',
//               height: '12px',
//               borderRadius: '50%',
//               backgroundColor: isConnected ? '#10b981' : '#ef4444',
//               boxShadow: isConnected ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)',
//               animation: 'pulse 2s infinite'
//             }}></div>
//           </div>

//           {/* Battery Level */}
//           <div style={{ marginBottom: '1.5rem' }}>
//             <div style={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'space-between',
//               marginBottom: '0.5rem'
//             }}>
//               <span style={{ color: 'white', fontWeight: '600' }}>Battery Level</span>
//               <span style={{ color: 'white', fontWeight: '700' }}>{batteryLevel.toFixed(0)}%</span>
//             </div>
//             <div style={{
//               height: '1.5rem',
//               background: 'rgba(0, 0, 0, 0.3)',
//               borderRadius: '9999px',
//               overflow: 'hidden',
//               border: '1px solid rgba(255, 255, 255, 0.1)'
//             }}>
//               <div style={{
//                 height: '100%',
//                 width: `${batteryLevel}%`,
//                 background: isCharging 
//                   ? 'linear-gradient(90deg, #10b981, #34d399)' 
//                   : batteryLevel > 20 
//                     ? 'linear-gradient(90deg, #10b981, #34d399)' 
//                     : 'linear-gradient(90deg, #ef4444, #f87171)',
//                 borderRadius: '9999px',
//                 transition: 'width 0.5s ease',
//                 position: 'relative',
//                 overflow: 'hidden'
//               }}>
//                 {isCharging && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
//                     animation: 'shimmer 1.5s infinite',
//                     backgroundSize: '200px 100%'
//                   }}></div>
//                 )}
//               </div>
//             </div>
//             {isCharging && (
//               <div style={{ 
//                 color: '#10b981', 
//                 fontSize: '0.875rem', 
//                 fontWeight: '600',
//                 marginTop: '0.5rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem'
//               }}>
//                 <BatteryCharging style={{ width: '1rem', height: '1rem' }} />
//                 Battery charging
//               </div>
//             )}
//           </div>

//           {/* Battery History Graph */}
//           <div style={{
//             height: '12rem',
//             background: 'rgba(0, 0, 0, 0.25)',
//             borderRadius: '1rem',
//             padding: '1rem',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             marginBottom: '0.5rem'
//           }}>
//             <h3 style={{
//               color: 'white',
//               fontSize: '0.875rem',
//               fontWeight: '600',
//               marginBottom: '0.75rem',
//               textTransform: 'uppercase',
//               letterSpacing: '0.05em'
//             }}>
//               Battery Level Trend
//             </h3>
//             <div style={{ height: 'calc(100% - 30px)' }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={batteryHistory}>
//                   <XAxis 
//                     dataKey="time" 
//                     tick={{ fontSize: 10, fill: '#9CA3AF' }}
//                     tickFormatter={formatTime}
//                   />
//                   <YAxis 
//                     tick={{ fontSize: 10, fill: '#9CA3AF' }}
//                     domain={[0, 100]}
//                     tickCount={6}
//                   />
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: 'rgba(0,0,0,0.8)', 
//                       border: 'none', 
//                       borderRadius: '8px',
//                       color: 'white'
//                     }}
//                     formatter={(value) => [`${value.toFixed(1)}%`, 'Battery']}
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="value" 
//                     stroke="#10b981" 
//                     strokeWidth={2}
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Main Data Cards */}
//         <div className="cards-grid">
//           {/* Current Value Card */}
//           <div className="data-card">
//             <div className="card-header">
//               <div className="card-info">
//                 <div className="icon-container current">
//                   <Zap />
//                 </div>
//                 <div className="card-meta">
//                   <h2>Current</h2>
//                   <p>Real-time current measurement</p>
//                 </div>
//               </div>
//               <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
//             </div>
            
//             <div className="value-display">
//               <div className={`value-number ${getStatusClass(currentValue, 'current')}`}>
//                 {currentValue.toFixed(5)}
//               </div>
//               <div className="value-unit">Amperes</div>
//             </div>

//             {/* Current Wave Graph */}
//             <div className="chart-wrapper">
//               <h3 className="chart-title">Current Trend</h3>
//               <div className="chart-container">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={currentHistory}>
//                     <XAxis 
//                       dataKey="time" 
//                       tick={{ fontSize: 10, fill: '#9CA3AF' }}
//                       tickFormatter={formatTime}
//                     />
//                     <YAxis 
//                       tick={{ fontSize: 10, fill: '#9CA3AF' }}
//                       domain={['dataMin - 0.1', 'dataMax + 0.1']}
//                     />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(0,0,0,0.8)', 
//                         border: 'none', 
//                         borderRadius: '8px',
//                         color: 'white'
//                       }}
//                       formatter={(value) => [`${value.toFixed(5)} A`, 'Current']}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="value" 
//                       stroke="#3B82F6" 
//                       strokeWidth={2}
//                       dot={false}
//                       strokeDasharray="0"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Voltage Value Card */}
//           <div className="data-card">
//             <div className="card-header">
//               <div className="card-info">
//                 <div className="icon-container voltage">
//                   <Activity />
//                 </div>
//                 <div className="card-meta">
//                   <h2>Voltage</h2>
//                   <p>Real-time voltage measurement</p>
//                 </div>
//               </div>
//               <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
//             </div>
            
//             <div className="value-display">
//               <div className={`value-number ${getStatusClass(voltageValue, 'voltage')}`}>
//                 {voltageValue.toFixed(5)}
//               </div>
//               <div className="value-unit">Volts</div>
//             </div>

//             {/* Voltage Wave Graph */}
//             <div className="chart-wrapper">
//               <h3 className="chart-title">Voltage Trend</h3>
//               <div className="chart-container">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={voltageHistory}>
//                     <XAxis 
//                       dataKey="time" 
//                       tick={{ fontSize: 10, fill: '#9CA3AF' }}
//                       tickFormatter={formatTime}
//                     />
//                     <YAxis 
//                       tick={{ fontSize: 10, fill: '#9CA3AF' }}
//                       domain={['dataMin - 0.1', 'dataMax + 0.1']}
//                     />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(0,0,0,0.8)', 
//                         border: 'none', 
//                         borderRadius: '8px',
//                         color: 'white'
//                       }}
//                       formatter={(value) => [`${value.toFixed(5)} V`, 'Voltage']}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="value" 
//                       stroke="#F59E0B" 
//                       strokeWidth={2}
//                       dot={false}
//                       strokeDasharray="0"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Combined Overview Chart */}
//         <div className="combined-chart-card">
//           <h2 className="combined-title">
//             📊 Combined Data Overview
//           </h2>
//           <div className="combined-chart-wrapper">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart>
//                 <XAxis 
//                   dataKey="time" 
//                   tick={{ fontSize: 12, fill: '#9CA3AF' }}
//                   type="category"
//                   allowDuplicatedCategory={false}
//                 />
//                 <YAxis 
//                   yAxisId="current"
//                   orientation="left"
//                   tick={{ fontSize: 12, fill: '#3B82F6' }}
//                   label={{ value: 'Current (A)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#3B82F6' } }}
//                 />
//                 <YAxis 
//                   yAxisId="voltage"
//                   orientation="right"
//                   tick={{ fontSize: 12, fill: '#F59E0B' }}
//                   label={{ value: 'Voltage (V)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#F59E0B' } }}
//                 />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'rgba(0,0,0,0.9)', 
//                     border: 'none', 
//                     borderRadius: '8px',
//                     color: 'white'
//                   }}
//                 />
//                 <Line 
//                   yAxisId="current"
//                   type="monotone" 
//                   dataKey="value" 
//                   data={currentHistory}
//                   stroke="#3B82F6" 
//                   strokeWidth={3}
//                   dot={false}
//                   name="Current (A)"
//                 />
//                 <Line 
//                   yAxisId="voltage"
//                   type="monotone" 
//                   dataKey="value" 
//                   data={voltageHistory}
//                   stroke="#F59E0B" 
//                   strokeWidth={3}
//                   dot={false}
//                   name="Voltage (V)"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
          
//           {/* Legend */}
//           <div className="chart-legend">
//             <div className="legend-item">
//               <div className="legend-color current"></div>
//               <span className="legend-text">Current (A)</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color voltage"></div>
//               <span className="legend-text">Voltage (V)</span>
//             </div>
//           </div>
//         </div>

//         {/* Status Footer */}
//         <div className="dashboard-footer">
//           <div className="footer-text">
//             <p>🔄 Data updates automatically from Firebase Realtime Database</p>
//             <p>📡 Connection status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
//             <p>🔋 Battery status: {isCharging ? '⚡ Charging' : batteryLevel > 20 ? '✅ Good' : '⚠️ Low'}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap, Activity, Wifi, WifiOff, Battery, BatteryCharging, Sun } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import './App.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
  authDomain: "waterdtection.firebaseapp.com",
  databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
  projectId: "waterdtection",
  storageBucket: "waterdtection.firebasestorage.app",
  messagingSenderId: "690886375729",
  appId: "1:690886375729:web:172c3a47dda6585e4e1810",
  measurementId: "G-TXF33Y6XY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Dashboard = () => {
  const [currentValue, setCurrentValue] = useState(0);
  const [voltageValue, setVoltageValue] = useState(0);
  const [powerValue, setPowerValue] = useState(0); // Added power value state
  const [currentHistory, setCurrentHistory] = useState([]);
  const [voltageHistory, setVoltageHistory] = useState([]);
  const [powerHistory, setPowerHistory] = useState([]); // Added power history state
  const [batteryHistory, setBatteryHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(90);
  const [isCharging, setIsCharging] = useState(false);
  const [sunPosition, setSunPosition] = useState(50);

  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time separately from sun position to prevent excessive renders
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    
    return () => clearInterval(timeInterval);
  }, []);
  
  // Calculate sun position based on time of day - update less frequently
  useEffect(() => {
    const updateSunPosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      // Sunrise at 6:30 (390 minutes) and sunset at 18:45 (1125 minutes)
      const sunrise = 390;
      const sunset = 1125;
      const dayLength = sunset - sunrise;
      
      // Calculate position percentage
      if (totalMinutes < sunrise) {
        setSunPosition(0);
      } else if (totalMinutes > sunset) {
        setSunPosition(100);
      } else {
        setSunPosition(((totalMinutes - sunrise) / dayLength) * 100);
      }
    };
    
    updateSunPosition();
    const interval = setInterval(updateSunPosition, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Reference to the Dual_Axis data
    const dataRef = ref(database, 'Dual_Axis');
    
    // Set up real-time listener
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const current = parseFloat(data.Current) || 0;
          const voltage = parseFloat(data.Voltage) || 0;
          const power = current * voltage; // Calculate power (P = I × V)
          const timestamp = new Date().toLocaleTimeString();
          
          setCurrentValue(current);
          setVoltageValue(voltage);
          setPowerValue(power); // Set power value
          setLastUpdate(new Date());
          setIsConnected(true);
          setConnectionError(null);
          
          // Update battery charging state - both current AND voltage must be above 8
          const isChargingNow = current > 8 && voltage > 8;
          setIsCharging(isChargingNow);
          
          // Simulate battery level changes and update history in a single operation
          // to avoid dependency loops
          setBatteryLevel(prevLevel => {
            let newLevel;
            if (isChargingNow) {
              newLevel = Math.min(prevLevel + 0.5, 100);
            } else if (prevLevel > 0) {
              newLevel = Math.max(prevLevel - 0.1, 0);
            } else {
              newLevel = prevLevel;
            }
            
            // Update battery history with the new level
            setBatteryHistory(prev => {
              const newHistory = [...prev, { time: timestamp, value: newLevel }];
              return newHistory.slice(-20);
            });
            
            return newLevel;
          });
          
          // Update history (keep last 20 points)
          setCurrentHistory(prev => {
            const newHistory = [...prev, { time: timestamp, value: current }];
            return newHistory.slice(-20);
          });
          
          setVoltageHistory(prev => {
            const newHistory = [...prev, { time: timestamp, value: voltage }];
            return newHistory.slice(-20);
          });
          
          // Update power history
          setPowerHistory(prev => {
            const newHistory = [...prev, { time: timestamp, value: power }];
            return newHistory.slice(-20);
          });
        }
      } catch (error) {
        console.error('Error processing Firebase data:', error);
        setConnectionError(error.message);
      }
    }, (error) => {
      console.error('Firebase connection error:', error);
      setIsConnected(false);
      setConnectionError(error.message);
    });

    // Initial connection status
    setIsConnected(true);
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        off(dataRef, unsubscribe);
      }
    };
  }, []); // Remove dependency on batteryLevel to prevent infinite loops

  const formatTime = (timeStr) => {
    return timeStr.split(':').slice(1).join(':');
  };

  const getStatusClass = (value, type) => {
    if (type === 'current') {
      if (value > 10) return 'danger';
      if (value > 5) return 'warning';
      return 'safe';
    } else {
      if (value > 5) return 'danger';
      if (value > 3) return 'warning';
      return 'safe';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            🌊 Dual Axis Monitoring Dashboard
          </h1>
          <div className="connection-status">
            <div className="status-indicator">
              {isConnected ? (
                <>
                  <Wifi style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span>Connected to Firebase</span>
                </>
              ) : (
                <>
                  <WifiOff style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                  <span>Disconnected</span>
                </>
              )}
            </div>
            {lastUpdate && (
              <span>
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            {connectionError && (
              <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Error: {connectionError}
              </div>
            )}
          </div>
        </div>

        {/* Solar Tracking */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          marginBottom: '2rem',
          animation: 'fadeInUp 0.6s ease-out',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            ☀️ Real-Time Solar Tracking
          </h2>
          
          <div style={{
            position: 'relative',
            height: '6rem',
            background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #60a5fa 100%)',
            borderRadius: '9999px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              left: '2rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#1e3a8a'
            }}>
              {new Date(new Date().setHours(6, 30, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true})}
            </div>
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '2rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#1e3a8a'
            }}>
              {new Date(new Date().setHours(18, 45, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true})}
            </div>
            
            {/* Current time in the middle */}
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#1e3a8a',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px'
            }}>
              {currentTime.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', second:'2-digit', hour12: true})}
            </div>
            
            {/* Sun position */}
            {/* <div style={{
              position: 'absolute',
              top: '0.75rem',
              left: `${sunPosition}%`,
              transform: 'translateX(-50%)',
              transition: 'left 0.5s ease'
            }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: '#fcd34d',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(252, 211, 77, 0.7)'
              }}>
                <Sun style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
              </div>
            </div>
             */}
            <div style={{
              textAlign: 'center',
              position: 'absolute',
              bottom: '0.75rem',
              width: '100%',
              fontWeight: '600',
              color: '#1e3a8a',
              fontSize: '1.25rem'
            }}>
              Daytime
            </div>
          </div>
        </div>

        {/* Battery Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          marginBottom: '2rem',
          animation: 'fadeInUp 0.7s ease-out',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                {isCharging ? (
                  <BatteryCharging style={{ width: '1.75rem', height: '1.75rem', color: '#34d399' }} />
                ) : (
                  <Battery style={{ width: '1.75rem', height: '1.75rem', color: '#34d399' }} />
                )}
              </div>
              <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
                  Battery Status
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: '1.4' }}>
                  {isCharging ? 'Currently charging' : 'Power supply status'}
                </p>
              </div>
            </div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
              boxShadow: isConnected ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>

          {/* Battery Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: 'white', fontWeight: '600' }}>Battery Level</span>
              <span style={{ color: 'white', fontWeight: '700' }}>{batteryLevel.toFixed(0)}%</span>
            </div>
            <div style={{
              height: '1.5rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '9999px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                height: '100%',
                width: `${batteryLevel}%`,
                background: isCharging 
                  ? 'linear-gradient(90deg, #10b981, #34d399)' 
                  : batteryLevel > 20 
                    ? 'linear-gradient(90deg, #10b981, #34d399)' 
                    : 'linear-gradient(90deg, #ef4444, #f87171)',
                borderRadius: '9999px',
                transition: 'width 0.5s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {isCharging && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shimmer 1.5s infinite',
                    backgroundSize: '200px 100%'
                  }}></div>
                )}
              </div>
            </div>
            {isCharging && (
              <div style={{ 
                color: '#10b981', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BatteryCharging style={{ width: '1rem', height: '1rem' }} />
                Battery charging
              </div>
            )}
          </div>

          {/* Battery History Graph */}
          <div style={{
            height: '12rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '1rem',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '0.5rem'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Battery Level Trend
            </h3>
            <div style={{ height: 'calc(100% - 30px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={batteryHistory}>
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickFormatter={formatTime}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    domain={[0, 100]}
                    tickCount={6}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Battery']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Power Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          marginBottom: '2rem',
          animation: 'fadeInUp 0.8s ease-out',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(126, 34, 206, 0.3))',
                border: '1px solid rgba(147, 51, 234, 0.3)'
              }}>
                <Zap style={{ width: '1.75rem', height: '1.75rem', color: '#a855f7' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
                  Power
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: '1.4' }}>
                  Real-time power calculation (P = I × V)
                </p>
              </div>
            </div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
              boxShadow: isConnected ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>
          
          {/* Power Value Display */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              fontSize: '3.5rem',
              fontWeight: '900',
              marginBottom: '0.5rem',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)',
              lineHeight: '1',
              fontFamily: 'monospace',
              color: '#a855f7',
              textShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
            }}>
              {powerValue.toFixed(5)}
            </div>
            <div style={{ 
              fontSize: '1.25rem',
              color: '#d1d5db',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em' 
            }}>
              Watts
            </div>
          </div>

          {/* Power History Graph */}
          <div style={{
            height: '12rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '1rem',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '0.5rem'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Power Trend
            </h3>
            <div style={{ height: 'calc(100% - 30px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={powerHistory}>
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickFormatter={formatTime}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value) => [`${value.toFixed(5)} W`, 'Power']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#a855f7" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Main Data Cards */}
        <div className="cards-grid">
          {/* Current Value Card */}
          <div className="data-card">
            <div className="card-header">
              <div className="card-info">
                <div className="icon-container current">
                  <Zap />
                </div>
                <div className="card-meta">
                  <h2>Current</h2>
                  <p>Real-time current measurement</p>
                </div>
              </div>
              <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
            </div>
            
            <div className="value-display">
              <div className={`value-number ${getStatusClass(currentValue, 'current')}`}>
                {currentValue.toFixed(5)}
              </div>
              <div className="value-unit">Amperes</div>
            </div>

            {/* Current Wave Graph */}
            <div className="chart-wrapper">
              <h3 className="chart-title">Current Trend</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentHistory}>
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickFormatter={formatTime}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value) => [`${value.toFixed(5)} A`, 'Current']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="0"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Voltage Value Card */}
          <div className="data-card">
            <div className="card-header">
              <div className="card-info">
                <div className="icon-container voltage">
                  <Activity />
                </div>
                <div className="card-meta">
                  <h2>Voltage</h2>
                  <p>Real-time voltage measurement</p>
                </div>
              </div>
              <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
            </div>
            
            <div className="value-display">
              <div className={`value-number ${getStatusClass(voltageValue, 'voltage')}`}>
                {voltageValue.toFixed(5)}
              </div>
              <div className="value-unit">Volts</div>
            </div>

            {/* Voltage Wave Graph */}
            <div className="chart-wrapper">
              <h3 className="chart-title">Voltage Trend</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={voltageHistory}>
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickFormatter={formatTime}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value) => [`${value.toFixed(5)} V`, 'Voltage']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="0"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Overview Chart */}
        <div className="combined-chart-card">
          <h2 className="combined-title">
            📊 Combined Data Overview
          </h2>
          <div className="combined-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  type="category"
                  allowDuplicatedCategory={false}
                />
                <YAxis 
                  yAxisId="current"
                  orientation="left"
                  tick={{ fontSize: 12, fill: '#3B82F6' }}
                  label={{ value: 'Current (A)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#3B82F6' } }}
                />
                <YAxis 
                  yAxisId="voltage"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#F59E0B' }}
                  label={{ value: 'Voltage (V)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#F59E0B' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  yAxisId="current"
                  type="monotone" 
                  dataKey="value" 
                  data={currentHistory}
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={false}
                  name="Current (A)"
                />
                <Line 
                  yAxisId="voltage"
                  type="monotone" 
                  dataKey="value" 
                  data={voltageHistory}
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={false}
                  name="Voltage (V)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color current"></div>
              <span className="legend-text">Current (A)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color voltage"></div>
              <span className="legend-text">Voltage (V)</span>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="dashboard-footer">
          <div className="footer-text">
            <p>🔄 Data updates automatically from Firebase Realtime Database</p>
            <p>📡 Connection status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
            <p>🔋 Battery status: {isCharging ? '⚡ Charging' : batteryLevel > 20 ? '✅ Good' : '⚠️ Low'}</p>
            <p>⚡ Power consumption: {powerValue.toFixed(2)} Watts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

interface Props {
  score: number
}

// Generate random positions so the forest feels organic but stable per render
function useRandomScatters(count: number, seed: number = 1) {
  return useMemo(() => {
    const scatters = []
    for (let i = 0; i < count; i++) {
      const x = Math.sin(seed * i * 123.45) * 40 + 50 // 10% to 90%
      const y = Math.cos(seed * i * 678.9) * 20 + 70  // 50% to 90%
      const scale = (Math.sin(seed * i * 999) + 2) / 2.5 // 0.4 to ~1.2
      const delay = (Math.abs(Math.sin(i * 111)) * 2) 
      scatters.push({ left: `${x}%`, top: `${y}%`, scale, delay })
    }
    return scatters
  }, [count, seed])
}

export function GardenScene({ score }: Props) {
  // Determine Stage and Theme Colors
  let stage = 'drought'
  let activeColor = '#b45309' // Amber/Scorched Earth

  if (score >= 80) {
    stage = 'forest'
    activeColor = '#10b981' // Emerald Magic
  } else if (score >= 40) {
    stage = 'growing'
    activeColor = '#34d399' // Mint / Dew
  } else if (score >= 10) {
    stage = 'sprout'
    activeColor = '#3b82f6' // Blue / Healing Water
  }

  // Element Counts based on the current stage
  const deadPlantCount = stage === 'drought' ? 4 : 0
  const saplingCount   = stage === 'drought' ? 0 : stage === 'sprout' ? 4 : stage === 'growing' ? 6 : 8
  const leafCount      = stage === 'drought' ? 0 : stage === 'sprout' ? 2 : stage === 'growing' ? 5 : 8
  const treeCount      = stage === 'forest' ? 5 : stage === 'growing' ? 2 : 0
  
  // Particles: Dust (Drought), Rain/Water (Sprout), Fireflies (Forest/Growing)
  const particleCount  = stage === 'drought' ? 15 : stage === 'sprout' ? 30 : stage === 'growing' ? 12 : 25

  // Generate deterministic positions
  const deadPlants = useRandomScatters(deadPlantCount, 0)
  const saplings   = useRandomScatters(saplingCount, 1)
  const leaves     = useRandomScatters(leafCount, 2)
  const trees      = useRandomScatters(treeCount, 3)
  const particles  = useRandomScatters(particleCount, 4)

  return (
    <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-white/5 bg-[#020604] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] transition-colors duration-1000">
      
      {/* 🌌 Sky Background */}
      <motion.div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: stage === 'drought' 
            ? 'radial-gradient(circle at 50% 20%, #78350f 0%, #451a03 50%, #020604 100%)' // Desert heat
            : `radial-gradient(circle at 50% 0%, ${activeColor}40 0%, #020604 80%)` // Magical night
        }}
      />

      {/* 🌕 Celestial Body (Sun in drought, Moon otherwise) */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full blur-[1px] transition-all duration-1000"
        initial={{ opacity: 0.2, scale: 0.8 }}
        animate={{ 
          opacity: stage === 'drought' ? 0.9 : [0.6, 0.8, 0.6],
          scale: stage === 'drought' ? 1.2 : 1,
          boxShadow: stage === 'drought' 
            ? `0 0 60px #f59e0b, 0 0 100px #b45309` 
            : `0 0 40px ${activeColor}, 0 0 80px ${activeColor}80`
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ 
          width: '60px', 
          height: '60px', 
          background: stage === 'drought' ? '#fef3c7' : '#ecfdf5' 
        }}
      />

      {/* ⛰️ Parallax Hills (CSS Geometry) */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000">
        {/* Back Hill */}
        <motion.div 
          className="absolute w-[150%] h-[120px] rounded-[100%] blur-[2px] transition-colors duration-1000"
          style={{ bottom: '-40px', left: '-25%', background: stage === 'drought' ? '#451a03' : '#064e3b' }}
        />
        {/* Mid Hill */}
        <motion.div 
          className="absolute w-[120%] h-[100px] rounded-[100%] transition-colors duration-1000"
          style={{ bottom: '-30px', right: '-10%', background: stage === 'drought' ? '#78350f' : '#047857' }}
        />
        {/* Front Hill */}
        <motion.div 
          className="absolute w-[140%] h-[80px] rounded-[100%] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-colors duration-1000"
          style={{ bottom: '-20px', left: '-20%', background: stage === 'drought' ? '#92400e' : '#059669' }}
        />
      </div>

      {/* 🍂 Drought State: Dead Plants */}
      <AnimatePresence>
        {stage === 'drought' && deadPlants.map((pos, i) => (
          <motion.div
            key={`dead-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute bottom-0 text-3xl drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] saturate-50 brightness-75 z-20"
            style={{ left: pos.left, top: pos.top, scale: pos.scale }}
          >
            {i % 2 === 0 ? '🥀' : '🪵'}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 🌳 Trees (Forest / Growing) */}
      {trees.map((pos, i) => (
        <motion.div
          key={`tree-${i}`}
          className="absolute bottom-0 text-6xl drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] z-10 origin-bottom"
          style={{ left: pos.left, top: pos.top }}
          initial={{ scale: 0, opacity: 0, rotate: -5 }}
          animate={{ 
            scale: pos.scale * 1.5, 
            opacity: 1, 
            rotate: 0,
            y: '-100%' 
          }}
          transition={{ duration: 1.5, delay: pos.delay, type: 'spring' }}
        >
          {i % 2 === 0 ? '🌲' : '🌳'}
        </motion.div>
      ))}

      {/* 🌿 Ferns & Grass */}
      {leaves.map((pos, i) => (
        <motion.div
          key={`leaf-${i}`}
          className="absolute bottom-0 text-3xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] z-20 origin-bottom"
          style={{ left: pos.left, top: pos.top }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: pos.scale, 
            opacity: 1,
            y: '-80%' 
          }}
          transition={{ duration: 1, delay: pos.delay, type: 'spring' }}
        >
          {i % 3 === 0 ? '🌾' : '🌿'}
        </motion.div>
      ))}

      {/* 🌱 Saplings */}
      {saplings.map((pos, i) => (
        <motion.div
          key={`sapling-${i}`}
          className="absolute bottom-0 text-2xl drop-shadow-[0_0_10px_rgba(110,231,183,0.8)] z-30 origin-bottom"
          style={{ left: pos.left, top: pos.top }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: pos.scale, 
            opacity: 1,
            y: '-50%' 
          }}
          transition={{ duration: 0.8, delay: pos.delay + 0.2, type: 'spring' }}
        >
          🌱
        </motion.div>
      ))}

      {/* ✨ Dynamic Particles (Dust, Rain, or Fireflies) */}
      {particles.map((pos, i) => {
        // Drought = Floating Dust
        if (stage === 'drought') {
          return (
            <motion.div
              key={`dust-${i}`}
              className="absolute w-1 h-1 rounded-full bg-amber-600/60 z-40"
              style={{ left: pos.left, top: pos.top }}
              animate={{ 
                y: [0, -20 - Math.random() * 30],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0, 0.5, 0]
              }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            />
          )
        }
        
        // Sprout = Healing Rain / Water Sprinklers
        if (stage === 'sprout') {
          return (
            <motion.div
              key={`rain-${i}`}
              className="absolute w-0.5 h-3 rounded-full bg-blue-400/80 z-40"
              style={{ left: pos.left, top: '-10%' }}
              animate={{ 
                y: ['0vh', '30vh'],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 0.6 + Math.random() * 0.5, 
                repeat: Infinity, 
                delay: pos.delay * 0.5,
                ease: "linear"
              }}
            />
          )
        }

        // Growing/Forest = Magical Fireflies
        return (
          <motion.div
            key={`firefly-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full z-40"
            style={{ 
              left: pos.left, 
              top: pos.top, 
              background: i % 3 === 0 ? '#fde047' : '#6ee7b7',
              boxShadow: `0 0 8px ${i % 3 === 0 ? '#fde047' : '#6ee7b7'}`
            }}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              y: [0, -40 - Math.random() * 40],
              x: [0, (Math.random() - 0.5) * 40]
            }}
            transition={{ 
              duration: 3 + Math.random() * 3, 
              repeat: Infinity, 
              delay: pos.delay,
              ease: "easeInOut"
            }}
          />
        )
      })}

      {/* 🌫️ Ground Mist Overlay */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/3 z-50 pointer-events-none transition-colors duration-1000"
        style={{
          background: stage === 'drought' 
            ? 'linear-gradient(to top, rgba(69,26,3,0.9) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(2,6,4,0.8) 0%, transparent 100%)'
        }}
      />

      {/* 📜 Status Text */}
      <div className="absolute bottom-3 left-4 text-xs font-bold tracking-widest uppercase z-50 flex items-center gap-2">
        <div 
          className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-1000" 
          style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}` }} 
        />
        <span style={{ color: activeColor }} className="drop-shadow-md transition-colors duration-1000">
          {stage === 'forest' && 'Ancient Magic Awakened'}
          {stage === 'growing' && 'The Grove Thickens'}
          {stage === 'sprout' && 'Healing Waters Fall'}
          {stage === 'drought' && 'Scorched Earth'}
        </span>
      </div>
    </div>
  )
}
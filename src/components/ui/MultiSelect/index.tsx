'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import style from './MultiSelect.module.scss'

interface Option {
  label: string
  value: string | number
}

interface MultiSelectProps {
  options: Option[]
  selectedValues: (string | number)[]
  onChange: (value: string | number) => void
  placeholder?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder = 'Select...' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={style.wrapper} ref={wrapperRef}>
      <button 
        type="button" 
        className={style.trigger} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={style.value}>
          {selectedValues.length === 0 
            ? placeholder 
            : selectedValues.length === 1 
              ? options.find(o => o.value === selectedValues[0])?.label 
              : `${selectedValues.length} selected`}
        </span>
        <ChevronDown size={16} className={`${style.icon} ${isOpen ? style.open : ''}`} />
      </button>
      
      {isOpen && (
        <div className={style.menu}>
          {options.map(option => (
            <label key={option.value} className={style.item}>
              <input 
                type="checkbox" 
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange(option.value)}
                className={style.checkbox}
              />
              <span className={style.label}>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

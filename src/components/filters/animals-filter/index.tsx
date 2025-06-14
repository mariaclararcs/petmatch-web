'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface AnimalsFilterProps {
  animalTypes: Record<string, boolean>
  genders: Record<string, boolean>
  onTypeChange: (type: string) => void
  onGenderChange: (gender: string) => void
  onNameOrderChange: (value: string) => void
  onShelterTimeChange: (value: string) => void
  onAgeRangeChange: (value: number[]) => void // Alterado para receber array de valores
  ageRange?: number[] // Adicionado para controlar o estado do range
}

export function AnimalsFilter({
  animalTypes,
  genders,
  onTypeChange,
  onGenderChange,
  onNameOrderChange,
  onShelterTimeChange,
  onAgeRangeChange,
  ageRange = [0, 15] // Valor padrão para o range
}: AnimalsFilterProps) {

  const [localAgeRange, setLocalAgeRange] = useState<number[]>(ageRange)

  const handleAgeRangeChange = (value: number[]) => {
    setLocalAgeRange(value)
    onAgeRangeChange(value)
  }

  return (
    <div className="flex flex-col gap-5 bg-asecondary/40 h-fit w-1/4 rounded-xl px-4 py-4">
      <h2 className="text-xl font-medium">
        Filtros
      </h2>

      <div className="flex flex-col gap-2">
        <h3 className="text-md">
          Ordenação alfabética
        </h3>
        <Select onValueChange={onNameOrderChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">A-Z</SelectItem>
            <SelectItem value="name-desc">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-md">
          Tipo
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="dog" 
              checked={animalTypes.dog}
              onCheckedChange={() => onTypeChange('dog')}
            />
            <Label htmlFor="dog">Cachorros</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="cat" 
              checked={animalTypes.cat}
              onCheckedChange={() => onTypeChange('cat')}
            />
            <Label htmlFor="cat">Gatos</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="other" 
              checked={animalTypes.other}
              onCheckedChange={() => onTypeChange('other')}
            />
            <Label htmlFor="other">Outros</Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-md">
          Tempo no abrigo
        </h3>
        <Select onValueChange={onShelterTimeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shelter-asc">Mais tempo</SelectItem>
            <SelectItem value="shelter-desc">Menos tempo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-md">
          Idade
        </h3>
        <div className="flex flex-col gap-4">
          {/* Valores selecionados */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {localAgeRange[0]}{localAgeRange[0] === 1 ? " ano" : " anos"}
            </span>
            <span className="text-sm font-medium">
              {localAgeRange[1] === 1 ? "1 ano" : localAgeRange[1] === 15 ? "15+ anos" : `${localAgeRange[1]} anos`}
            </span>
          </div>
          
          {/* Slider com range */}
          <Slider 
            value={localAgeRange}
            onValueChange={handleAgeRangeChange}
            min={0}
            max={15}
            step={1}
            minStepsBetweenThumbs={1}
          />
          
          {/*
          { Legenda do range }
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>15+</span>
          </div>*/}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-md">
          Sexo
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="female" 
              checked={genders.female}
              onCheckedChange={() => onGenderChange('female')}
            />
            <Label htmlFor="female">Fêmea</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="male" 
              checked={genders.male}
              onCheckedChange={() => onGenderChange('male')}
            />
            <Label htmlFor="male">Macho</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
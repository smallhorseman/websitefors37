"use client"

import React, { useMemo, useState } from "react"
import { Calculator, Users, Clock, Info, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"

// Assumptions (easy to tweak):
// - Solo & Couples: $375/hr
// - Family (3-5): $450/hr
// - Family (6+): $500/hr + $50 per person over 5 (flat session surcharge)
// - Packages (deals): 30m $200, 60m $350 (save $25 vs $375), 90m $500
// - Duration billed pro‑rata by minutes

export type PortraitCategory = "solo" | "couple" | "family"

export interface PricingCalculatorProps {
  className?: string
  defaultCategory?: PortraitCategory
  defaultPeople?: number
  defaultMinutes?: number
  showBookCta?: boolean
}

const RATES = {
  solo: 375_00, // cents per hour
  couple: 375_00,
  family_3_5: 450_00,
  family_6_plus: 500_00,
  extraPersonOver5: 50_00, // flat session surcharge per person over 5
}

const PACKAGES = [
  { key: "mini", name: "Mini Session", minutes: 30, priceCents: 200_00 },
  { key: "standard", name: "Standard Session", minutes: 60, priceCents: 350_00 },
  { key: "extended", name: "Extended Session", minutes: 90, priceCents: 500_00 },
] as const

function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function PricingCalculator({
  className,
  defaultCategory = "solo",
  defaultPeople = 1,
  defaultMinutes = 60,
  showBookCta = true,
}: PricingCalculatorProps) {
  const [category, setCategory] = useState<PortraitCategory>(defaultCategory)
  const [people, setPeople] = useState<number>(defaultPeople)
  const [minutes, setMinutes] = useState<number>(defaultMinutes)

  const hourlyRate = useMemo(() => {
    if (category === "family") {
      if (people <= 2) return RATES.solo // safety if user toggles counts weirdly
      if (people <= 5) return RATES.family_3_5
      return RATES.family_6_plus
    }
    return category === "solo" || people === 1 ? RATES.solo : RATES.couple
  }, [category, people])

  const extraPersonFee = useMemo(() => {
    if (category !== "family") return 0
    const over = Math.max(people - 5, 0)
    return over * RATES.extraPersonOver5
  }, [category, people])

  const proratedPrice = useMemo(() => {
    const base = Math.round((hourlyRate * minutes) / 60)
    return base + extraPersonFee
  }, [hourlyRate, minutes, extraPersonFee])

  const eligibleForPackages = useMemo(() => category !== "family" && people <= 2, [category, people])

  const packageMatch = useMemo(() => {
    if (!eligibleForPackages) return null
    const match = PACKAGES.find(p => p.minutes === minutes)
    if (!match) return null
    // Only show as a deal when package price is lower than prorated price
    const savings = proratedPrice - match.priceCents
    return savings > 0 ? { ...match, savings } : null
  }, [minutes, proratedPrice, eligibleForPackages])

  const suggestedPackages = useMemo(() => {
    if (!eligibleForPackages) return [] as Array<{key:string;name:string;minutes:number;priceCents:number;diff:number}>
    // Show all, annotate which are deals vs. more/less than custom calc
    return PACKAGES.map(p => ({
      ...p,
      diff: p.priceCents - proratedPrice, // negative = cheaper than custom
    }))
  }, [proratedPrice, eligibleForPackages])

  return (
    <div className={`bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 ${className || ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Portrait Pricing Calculator</h3>
          <p className="text-gray-600 text-sm">Transparent, instant pricing based on session type, duration, and group size.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Portrait Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(["solo","couple","family"] as PortraitCategory[]).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${category===c?"bg-primary-600 text-white border-primary-600":"bg-white border-gray-300 hover:border-primary-400"}`}
              >
                {c === "solo" ? "Solo" : c === "couple" ? "Couples" : "Family"}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Info className="h-3 w-3" /> Solo/Couples billed at $375/hr. Family 3–5 at $450/hr. 6+ at $500/hr + $50 per person over 5.</p>
        </div>

        {/* People */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> People</label>
          <div className="flex items-center gap-2">
            <button aria-label="decrease" onClick={()=>setPeople(p=>clamp(p-1,1,50))} className="px-3 py-2 border rounded-lg">-</button>
            <input
              type="number"
              min={1}
              max={50}
              value={people}
              onChange={(e)=>setPeople(clamp(parseInt(e.target.value||"1",10),1,50))}
              className="w-24 text-center border rounded-lg px-3 py-2"
            />
            <button aria-label="increase" onClick={()=>setPeople(p=>clamp(p+1,1,50))} className="px-3 py-2 border rounded-lg">+</button>
          </div>
          {category!=="family" && people>2 && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-2">Tip: For 3+ people, switch to Family to get the correct family rate.</p>
          )}
        </div>

        {/* Minutes */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Clock className="h-4 w-4" /> Duration (minutes)</label>
          <select
            value={minutes}
            onChange={(e)=>setMinutes(parseInt(e.target.value,10))}
            className="w-full border rounded-lg px-3 py-2"
          >
            {[15,30,45,60,75,90,120,150].map(m => (
              <option key={m} value={m}>{m} minutes</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">Billed pro‑rata: {formatUsd(hourlyRate)} per hour.</p>
        </div>
      </div>

      {/* Result & Packages */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-gray-50 border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Calculated session total</div>
                <div className="text-3xl font-extrabold text-gray-900">{formatUsd(proratedPrice)}</div>
              </div>
              {packageMatch && (
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-3 py-2">
                    <Sparkles className="h-4 w-4" />
                    <span>{packageMatch.name} saves {formatUsd(packageMatch.savings)}</span>
                  </div>
                </div>
              )}
            </div>
            {extraPersonFee>0 && (
              <p className="text-xs text-gray-500 mt-2">Includes {formatUsd(extraPersonFee)} group surcharge for {people-5} {people-5===1?"extra person":"extra people"}.</p>
            )}
          </div>

          {/* Suggested packages */}
          {eligibleForPackages && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Package comparison</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                {suggestedPackages.map(p => (
                  <div key={p.key} className={`rounded-lg border p-3 ${p.diff<0?"border-emerald-300 bg-emerald-50":"border-gray-200 bg-white"}`}>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.minutes} minutes</div>
                    <div className="mt-1 font-bold">{formatUsd(p.priceCents)}</div>
                    <div className={`text-xs mt-1 ${p.diff<0?"text-emerald-700":"text-gray-500"}`}>
                      {p.diff<0 ? `Save ${formatUsd(Math.abs(p.diff))}` : p.diff>0 ? `+${formatUsd(p.diff)} vs custom` : "Same as custom"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="rounded-xl border p-4 h-full flex flex-col justify-between">
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Type: {category === "solo" ? "Solo" : category === "couple" ? "Couples" : "Family"}</li>
                <li>People: {people}</li>
                <li>Duration: {minutes} minutes</li>
                <li>Hourly: {formatUsd(hourlyRate)}</li>
                {extraPersonFee>0 && <li>Group surcharge: {formatUsd(extraPersonFee)}</li>}
              </ul>
              <div className="border-t mt-3 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-xl font-bold text-primary-600">{formatUsd(proratedPrice)}</span>
              </div>
            </div>
            {showBookCta && (
              <Link
                href={{ pathname: "/book-a-session", query: { duration: minutes, people, type: category, price_cents: proratedPrice } }}
                className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
              >
                Continue to Book
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

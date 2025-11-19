import PricingCalculator from "@/components/PricingCalculator"

export const metadata = {
  title: "Portrait Pricing Calculator | Studio37",
  description: "Instantly estimate portrait session pricing based on duration and group size.",
}

export default function PricingToolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Portrait Pricing Calculator</h1>
          <p className="text-gray-600 mt-2">Use this tool to plan your session and compare package deals.</p>
        </div>
        <PricingCalculator />
      </div>
    </div>
  )
}

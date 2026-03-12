import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { Categories } from "@/components/Categories"
import { Markets } from "@/components/Markets"
import { Infrastructure } from "@/components/Infrastructure"
import { Footer } from "@/components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Categories />
      <Markets />
      <Infrastructure />
      <Footer />
    </div>
  )
}

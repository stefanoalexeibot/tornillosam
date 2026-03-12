import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Brands } from "@/components/Brands"
import { Features } from "@/components/Features"
import { Categories } from "@/components/Categories"
import { Process } from "@/components/Process"
import { Markets } from "@/components/Markets"
import { Infrastructure } from "@/components/Infrastructure"
import { Footer } from "@/components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Brands />
      <Features />
      <Categories />
      <Process />
      <Markets />
      <Infrastructure />
      <Footer />
    </div>
  )
}

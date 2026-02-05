import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import ToolGrid from "@/components/ToolGrid"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ToolGrid />
      <Footer />
    </main>
  )
}

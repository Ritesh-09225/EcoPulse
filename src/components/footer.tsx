import Link from "next/link"
import { LuLeaf as Leaf, LuTwitter as Twitter, LuInstagram as Instagram, LuLinkedin as Linkedin, LuGlobe as Globe } from "react-icons/lu"

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#011c16] pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Leaf className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold text-white">EcoPulse</span>
            </Link>
            <p className="text-white/60 text-sm max-w-sm mb-6 leading-relaxed">
              Track your impact, change the future. Our AI-powered platform helps you understand, reduce, and offset your carbon footprint in real-time.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="h-10 w-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-emerald-400 hover:border-emerald-400/50 transition-all">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-emerald-400 hover:border-emerald-400/50 transition-all">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-emerald-400 hover:border-emerald-400/50 transition-all">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-emerald-400 hover:border-emerald-400/50 transition-all">
                <Globe className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it works</Link></li>
              <li><Link href="#impact" className="hover:text-emerald-400 transition-colors">Impact</Link></li>
              <li><Link href="#testimonials" className="hover:text-emerald-400 transition-colors">Testimonials</Link></li>
              <li><Link href="/sign-in" className="hover:text-emerald-400 transition-colors">Get Started</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Learn</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Carbon Footprint 101</Link></li>
              <li><Link href="#why-it-matters" className="hover:text-emerald-400 transition-colors">Why It Matters</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Eco Glossary</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Research</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} EcoPulse. Built for the planet.
          </p>
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-white/40">
            <span className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
               This site is powered by renewable energy. 0.04 g CO₂ / view
            </span>
            <span className="italic text-white/30 text-xs">“The greatest threat to our planet is the belief that someone else will save it.” — Robert Swan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

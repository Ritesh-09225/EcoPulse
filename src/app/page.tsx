'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  LuArrowRight as ArrowRight,
  LuTrophy as Trophy,
  LuZap as Zap,
  LuChartBar as LineChart,
  LuCheck as CheckCircle2,
  LuTrendingDown as TrendingDown,
  LuThermometerSun as ThermometerSun,
  LuWind as Wind,
  LuDroplets as Droplets,
} from 'react-icons/lu'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Animations
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' },
}

const staggerContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#022C22] text-white selection:bg-emerald-500/30 font-sans overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-emerald-500/20 blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[100px] opacity-40" />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        {/* HERO SECTION */}
        <section className="relative w-full pt-32 pb-24 lg:pt-48 lg:pb-32">
          <div className="container px-4 md:px-8 mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content (Left) */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="flex flex-col items-start text-left space-y-8"
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-sm"
              >
                <Zap className="mr-2 h-4 w-4" />
                AI Carbon Intelligence
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
              >
                Track Your Impact.
                <br />
                Change the Future.
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="max-w-xl text-lg md:text-xl text-white/70 leading-relaxed"
              >
                Every decision has an environmental cost. EcoPulse helps you understand, reduce, and
                offset your carbon footprint with real-time AI insights and gamified rewards.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
              >
                <Link
                  href="/sign-in"
                  className="group inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-[#022C22] font-semibold px-8 py-4 rounded-full transition-all duration-300 glow-shadow-emerald text-lg w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="group inline-flex items-center justify-center text-white/85 hover:text-white border border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] px-8 py-4 rounded-full transition-all duration-300 text-lg w-full sm:w-auto backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Visuals (Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="relative hidden lg:block h-[500px]"
            >
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />

              {/* Floating Glass Widget 1 */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 left-0 w-72 glass-card p-6 shadow-2xl z-20 border-t-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/70 font-medium flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-emerald-400" /> Live Footprint
                  </h3>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  12.4 <span className="text-xl text-white/50 font-normal">kg</span>
                </div>
                <div className="flex items-center text-sm text-emerald-400 font-medium bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                  <TrendingDown className="h-3 w-3 mr-1" /> -1.2 kg vs last week
                </div>
              </motion.div>

              {/* Floating Glass Widget 2 */}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-10 right-0 w-80 glass-card p-6 shadow-2xl z-30 border-t-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/70 font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-400" /> Eco Points
                  </h3>
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-end gap-4 mb-3">
                  <div className="text-4xl font-bold text-white">4,250</div>
                  <div className="text-sm text-emerald-400 font-medium mb-1">
                    +482 pts this week
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                  <div className="bg-emerald-400 h-1.5 rounded-full w-[70%]" />
                </div>
                <div className="text-xs text-white/50 text-right">Rank #214 this month</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="w-full py-12 border-y border-white/5 bg-white/[0.01]">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="py-4">
                <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-2">
                  37 B
                </div>
                <div className="text-white/60 text-sm font-medium uppercase tracking-wider">
                  Tons CO₂ Emitted Annually
                </div>
              </div>
              <div className="py-4">
                <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-2">8 M</div>
                <div className="text-white/60 text-sm font-medium uppercase tracking-wider">
                  Tons Plastic in Oceans Yearly
                </div>
              </div>
              <div className="py-4">
                <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-2">1</div>
                <div className="text-white/60 text-sm font-medium uppercase tracking-wider">
                  User Can Make a Difference
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY IT MATTERS - THE BASICS */}
        <section id="why-it-matters" className="w-full py-24 lg:py-32">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="text-emerald-400 font-semibold tracking-wide">— The Basics</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  What is a carbon footprint?
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  It&apos;s the total amount of greenhouse gases (including carbon dioxide and
                  methane) that are generated by our actions.
                  <br />
                  <br />
                  The average carbon footprint for a person globally is closer to{' '}
                  <span className="text-emerald-400 font-bold">4 tonnes</span>. To have the best
                  chance of avoiding a 2℃ rise in global temperatures, the average global carbon
                  footprint per year needs to drop to under 2 tonnes by 2050.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass-card p-8"
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-emerald-400" /> Emission Breakdown
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'Transportation', percent: 29, color: 'bg-blue-400' },
                    { label: 'Electricity', percent: 25, color: 'bg-yellow-400' },
                    { label: 'Food & Delivery', percent: 17, color: 'bg-emerald-400' },
                    { label: 'Shopping', percent: 13, color: 'bg-purple-400' },
                    { label: 'Travel', percent: 11, color: 'bg-orange-400' },
                    { label: 'Digital Services', percent: 5, color: 'bg-cyan-400' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/80 font-medium">{item.label}</span>
                        <span className="text-white/60">{item.percent}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-2 rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SMALL CHOICES GLOBAL CONSEQUENCES */}
        <section className="w-full py-24 lg:py-32 bg-[#011c16]">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="max-w-2xl mb-16">
              <div className="text-emerald-400 font-semibold tracking-wide mb-4">
                — Why It Matters
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Small choices. Global consequences.
              </h2>
              <p className="text-lg text-white/70">
                Excessive carbon emissions don&apos;t just warm the planet; they trigger a cascade
                of devastating environmental and human impacts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: ThermometerSun,
                  title: 'Climate Change',
                  desc: 'Excess CO₂ traps heat in our atmosphere, leading to extreme weather events, unpredictable seasons, and shifting agricultural zones.',
                },
                {
                  icon: TrendingDown,
                  title: 'Rising Temperatures',
                  desc: 'The planet has warmed 1.2°C since pre-industrial times, threatening coral reefs, accelerating ice melt, and raising sea levels.',
                },
                {
                  icon: Wind,
                  title: 'Air Pollution',
                  desc: 'Fossil-fuel emissions contribute to poor air quality, directly impacting global health and causing an estimated 7 million premature deaths annually.',
                },
                {
                  icon: Droplets,
                  title: 'Resource Depletion',
                  desc: 'Forests, fresh water, and arable land are being exhausted at unsustainable rates to support high-emission lifestyles and industries.',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-8 hover:bg-white/[0.04] transition-colors"
                >
                  <card.icon className="h-8 w-8 text-emerald-400 mb-6" />
                  <h3 className="text-xl font-semibold mb-3 text-white">{card.title}</h3>
                  <p className="text-white/60 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW ECOPULSE HELPS */}
        <section id="how-it-works" className="w-full py-24 lg:py-32">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="text-emerald-400 font-semibold tracking-wide mb-4">
                — How EcoPulse Helps
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Intelligence, rewards, and community.
              </h2>
              <p className="text-lg text-white/70">
                Three powerful systems working in concert to help you effortlessly reduce your
                footprint and maximize your impact.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card relative overflow-hidden group"
              >
                <div className="p-8">
                  <div className="text-6xl font-bold text-white/5 mb-8">01</div>
                  <h3 className="text-2xl font-semibold mb-4">Real-Time Carbon Intelligence</h3>
                  <p className="text-white/60 mb-8">
                    AI-powered notifications trigger before you make carbon-heavy decisions,
                    suggesting greener alternatives instantly.
                  </p>

                  <div className="bg-[#022c22] border border-emerald-500/30 rounded-xl p-4 shadow-lg shadow-emerald-500/10">
                    <div className="flex gap-3">
                      <Zap className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">
                          Ordering from a restaurant 15 km away?
                        </p>
                        <p className="text-xs text-white/60">
                          This may increase your footprint by 0.8 kg CO₂. Consider:
                        </p>
                        <ul className="text-xs text-emerald-400 mt-2 space-y-1">
                          <li>• Choosing a nearby restaurant</li>
                          <li>• Opting for vegan options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-card relative overflow-hidden group"
              >
                <div className="p-8">
                  <div className="text-6xl font-bold text-white/5 mb-8">02</div>
                  <h3 className="text-2xl font-semibold mb-4">Gamified Sustainability</h3>
                  <p className="text-white/60 mb-8">
                    Turn green choices into measurable progress. Daily, weekly, and seasonal
                    challenges keep momentum alive.
                  </p>

                  <ul className="space-y-4">
                    {[
                      'Earn Eco Points for every green choice',
                      'Unlock achievements and unique badges',
                      'Climb global and regional leaderboards',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-card relative overflow-hidden group"
              >
                <div className="p-8">
                  <div className="text-6xl font-bold text-white/5 mb-8">03</div>
                  <h3 className="text-2xl font-semibold mb-4">Community & Collaboration</h3>
                  <p className="text-white/60 mb-8">
                    Saving the planet is a team sport. Join forces with friends, family, and
                    colleagues to multiply your impact.
                  </p>

                  <div className="flex -space-x-4 mb-4 mt-6">
                    <Avatar className="border-2 border-[#022c22] h-12 w-12">
                      <AvatarFallback className="bg-emerald-600">JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-[#022c22] h-12 w-12">
                      <AvatarFallback className="bg-blue-600">SM</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-[#022c22] h-12 w-12">
                      <AvatarFallback className="bg-purple-600">AR</AvatarFallback>
                    </Avatar>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#022c22] bg-white/10 text-sm font-medium backdrop-blur-md">
                      +85
                    </div>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">
                    Join &apos;Ocean Savers&apos; Clan →
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* COLLECTIVE IMPACT */}
        <section
          id="impact"
          className="w-full py-20 border-y border-white/5 bg-emerald-950/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
          <div className="container px-4 md:px-8 mx-auto relative z-10 text-center">
            <div className="text-emerald-400 font-semibold tracking-wide mb-4">
              — Collective Impact
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
              Numbers that move the planet.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: '2.4M', label: 'kg Carbon Saved' },
                { num: '108K', label: 'Trees Equivalent' },
                { num: '84K+', label: 'Active Users' },
                { num: '6,700', label: 'Challenges Met' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-white">{stat.num}</div>
                  <div className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="w-full py-24 lg:py-32 bg-[#011c16]">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-emerald-400 font-semibold tracking-wide mb-4">
                — Voices of Change
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Built for the eco-conscious.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sarah Jenkins',
                  role: 'Product Designer',
                  score: 'A+',
                  text: 'EcoPulse completely changed how I look at my daily commute. The AI suggestions are actually practical, and the gamification keeps me coming back every day.',
                },
                {
                  name: 'Michael Chen',
                  role: 'Software Engineer',
                  score: 'A',
                  text: 'I thought I was living a green lifestyle until EcoPulse showed me the hidden carbon costs of my online shopping habits. The Clan feature is incredibly motivating.',
                },
                {
                  name: 'Elena Rodriguez',
                  role: 'Environmental Sci.',
                  score: 'A+',
                  text: 'As someone who studies climate change, I appreciate how accurate and educational the metrics are. It bridges the gap between awareness and actual behavioral change.',
                },
              ].map((t, i) => (
                <div key={i} className="glass-card p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white/20">
                          <AvatarFallback className="bg-emerald-900 text-white">
                            {t.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white text-sm">{t.name}</div>
                          <div className="text-white/50 text-xs">{t.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold text-xs">
                        {t.score}
                      </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed italic">
                      &quot;{t.text}&quot;
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-white/40">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Verified EcoPulse Member
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full py-24 lg:py-32 relative overflow-hidden">
          {/* Intense ambient glow for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-[100%]" />

          <div className="container px-4 md:px-8 mx-auto text-center relative z-10">
            <div className="text-emerald-400 font-semibold tracking-wide mb-4">
              — Join the Movement
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Ready to reduce your
              <br />
              carbon footprint?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
              Join thousands of environmentally conscious individuals using AI to make smarter,
              greener decisions every single day.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-[#022C22] font-semibold px-10 py-4 rounded-full transition-all duration-300 glow-shadow-emerald text-lg"
              >
                Start Your Journey
              </Link>
              <Link
                href="/dashboard/leaderboard"
                className="w-full sm:w-auto inline-flex items-center justify-center text-white border border-white/20 hover:bg-white/10 px-10 py-4 rounded-full transition-all duration-300 text-lg backdrop-blur-sm"
              >
                View Leaderboards
              </Link>
            </div>

            <div className="mt-8 text-sm text-white/40">
              Free to join &bull; No credit card required &bull; Cancel anytime
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

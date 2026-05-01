'use client';

import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Mountain,
  BookOpen,
  Compass,
  Heart,
  PenLine,
  Users,
  ArrowRight,
  Quote,
  TreePine,
  Sunrise,
  CloudFog,
  MapPin,
  ArrowUp,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: PenLine,
    title: 'Cerita yang Bermakna',
    description: 'Tulis pengalaman mendakimu dengan narasi yang dalam dan penuh emosi. Bukan sekadar dokumentasi, tapi cerita yang menginspirasi.',
  },
  {
    icon: Compass,
    title: 'Temukan Jalur Autentik',
    description: 'Jelajahi jalur pendakian dengan pengalaman nyata dari komunitas. Bukan hanya data, tapi cerita dari setiap jejak kaki.',
  },
  {
    icon: Heart,
    title: 'Refleksi Pribadi',
    description: 'Ruang pribadi untuk merefleksikan pertumbuhan dan ketenangan yang kamu temui di alam. Jurnal pribadimu yang tenang.',
  },
  {
    icon: Users,
    title: 'Komunitas yang Tenang',
    description: 'Terhubung dengan pendaki yang memiliki visi serupa. Kedalaman, bukan viralitas, yang menjadi penghubung kita.',
  },
];

const testimonials = [
  {
    quote: 'Rimbasmita membantu saya melihat mendaki bukan hanya sebagai aktivitas fisik, tapi sebagai perjalanan spiritual.',
    name: 'Ayu Rahmawati',
    role: 'Pendaki Gunung Rinjani',
  },
  {
    quote: 'Saya akhirnya punya tempat untuk menulis cerita-cerita panjatanku. Bukan di media sosial yang bising, tapi di sini yang tenang.',
    name: 'Budi Santoso',
    role: 'Pendaki Gunung Semeru',
  },
  {
    quote: 'Setiap cerita yang saya baca di sini terasa autentik dan penuh makna. Berbeda sekali dengan konten pendakian biasa.',
    name: 'Dewi Lestari',
    role: 'Penulis & Traveler',
  },
];

const trails = [
  { name: 'Gunung Rinjani', location: 'Lombok', elevation: 3726, image: 'https://images.pexels.com/photos/1670765/pexels-photo-1670765.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Gunung Bromo', location: 'Jawa Timur', elevation: 2329, image: 'https://images.pexels.com/photos/6312921/pexels-photo-6312921.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Gunung Semeru', location: 'Jawa Timur', elevation: 3676, image: 'https://images.pexels.com/photos/2372725/pexels-photo-2372725.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* <img
            src="https://images.pexels.com/photos/1670765/pexels-photo-1670765.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Mountain landscape"
            className="w-full h-full object-cover"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="absolute top-1/4 left-[10%] animate-float opacity-20">
          <TreePine className="h-16 w-16 text-primary" />
        </div>
        <div className="absolute top-1/3 right-[15%] animate-float opacity-15" style={{ animationDelay: '2s' }}>
          <Mountain className="h-20 w-20 text-primary" />
        </div>
        <div className="absolute bottom-1/3 left-[20%] animate-float opacity-10" style={{ animationDelay: '4s' }}>
          <CloudFog className="h-14 w-14 text-primary" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sunrise className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Ruang Cerita Pendaki Indonesia</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' as const }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-foreground">Setiap langkah</span>
            <br />
            <span className="text-gradient">punya cerita</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' as const }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Rimbasmita adalah tempat berbagi pengalaman mendaki yang bermakna.
            Bukan sekadar dokumentasi, tapi narasi yang menginspirasi dan merefleksikan pertumbuhanmu di alam.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' as const }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {session ? (
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
              >
                Buka Feed
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
              >
                Mulai Cerita
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <Link
              href="/explore"
              className="px-8 py-3.5 rounded-2xl glass font-semibold text-base text-foreground hover:bg-accent/50 transition-all duration-300 flex items-center gap-2"
            >
              Jelajahi Cerita
              <Compass className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-foreground/40"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Mountain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Mengapa Rimbasmita</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Lebih dari sekadar catatan pendakian
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kami percaya setiap perjalanan punya cerita yang layak diceritakan dengan kedalaman dan keautentikan.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass rounded-2xl p-6 h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trails Section */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Compass className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Jalur Populer</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Mulai dari jalur yang sudah dikenal
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temukan cerita nyata dari pendaki yang sudah menjelajahi jalur-jalur ikonik Indonesia.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trails.map((trail, i) => (
              <motion.div
                key={trail.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass rounded-2xl overflow-hidden group cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    {/* <img
                      src={trail.image}
                      alt={trail.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-foreground">{trail.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-foreground/70">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {trail.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3.5 w-3.5" />
                          {trail.elevation.toLocaleString()} mdpl
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
            >
              Lihat semua jalur
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Quote className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Suara Komunitas</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Cerita mereka, inspirasi kita
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass rounded-2xl p-6 h-full">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-foreground leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <Mountain className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Mulai perjalananmu hari ini
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                Setiap gunung menanti ceritamu. Setiap langkah layak untuk dikenang dan dibagikan.
              </p>
              {session ? (
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  Tulis Cerita Pertamamu
                  <PenLine className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  Bergabung Sekarang
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

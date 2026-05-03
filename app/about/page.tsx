"use client";

import { motion } from "framer-motion";
import {
  Mountain,
  Heart,
  Github,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  GraduationCap,
  Phone,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Mountain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Tentang Rimbasmita</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-8 leading-tight"
            >
              Setiap langkah di gunung <br className="hidden md:block" />
              <span className="text-primary">punya cerita yang bermakna.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              Rimbasmita bukan sekadar platform digital, melainkan ruang
              refleksi bagi para pendaki untuk mengabadikan jejak, berbagi rasa,
              dan merangkai makna dari setiap perjalanan di alam bebas.
            </motion.p>
          </div>
        </section>

        {/* App Profile Section */}
        <section className="px-4 mb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-6"
              >
                <motion.div variants={fadeInUp}>
                  <h2 className="text-3xl font-bold mb-4">Latar Belakang</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Rimbasmita lahir dari sebuah perjalanan personal untuk
                    menemukan kembali arah yang sempat hilang di antara riuh
                    rendahnya ingatan masa lalu. Berawal dari upaya mencari
                    ketenangan di tengah padatnya hari demi membasuh sisa-sisa
                    cerita yang tak lagi seirama, wadah ini hadir sebagai jurnal
                    bagi mereka yang memilih menitipkan beban emosional di
                    setiap tanjakan. Kami percaya bahwa pendakian bukan sekedar
                    aktivitas fisik, melainkan ruang reflektif untuk menutup
                    lembaran lama dan menyambut kehidupan baru yang lebih liar
                    serta bermakna di setiap jengkal langkah menuju puncak.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-3xl font-bold mb-4">Misi Kami</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Kami membangun Rimbasmita sebagai ruang bagi mereka yang
                    menghargai setiap langkah pendakian, bukan sekedar garis
                    puncak. Di sini, kita saling menginspirasi lewat cerita
                    otentik tentang tantangan dan cara kita bertumbuh. Kami
                    percaya, jalur pendakian adalah tempat terbaik untuk
                    melepaskan beban tak kasat mata yang selama ini membelenggu
                    pundak, membiarkan sisa-sisa cerita yang telah usai
                    tertinggal di lembah, dan berani melangkah jauh melampaui
                    zona nyaman. Mari lekas pulih, hidup lebih liar, dan temukan
                    jati dirimu yang baru di alam bebas.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-video rounded-[32px] overflow-hidden glass p-4"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/assets/images/rimba-logo-3.png"
                    alt="Rimbasmita Mockup"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="px-4 bg-card/30 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Pengembang Aplikasi</h2>
              <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
            </div>

            <div className="glass rounded-[40px] p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-primary/10">
                    <Image
                      src="/assets/images/hero.jpg"
                      alt="Satrio Wisnu Adi Pratama"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground">
                      Satrio Wisnu Adi Pratama
                    </h3>
                    <p className="text-primary font-medium mt-1">
                      Full-stack Web Developer
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 justify-center md:justify-start text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm">
                        Mahasiswa Teknik Informatika, Politeknik Negeri Malang
                      </span>
                    </div>
                    <div className="flex items-center gap-3 justify-center md:justify-start text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Jawa Timur, Indonesia</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Seorang mahasiswa yang lebih hafal jalur pendakian daripada
                    struktur direktori, namun kini terjebak di antara tumpukan
                    kode. Membangun Rimbasmita sebagai kompensasi rindu bau
                    tanah basah dan kabut gunung. Mencoba menanamkan 'jiwa'
                    hutan ke dalam dinginnya baris sintaks, karena bagi saya,
                    membangun aplikasi sama seperti membuka jalur baru, butuh
                    ketangguhan, navigasi yang presisi, dan tentu saja, sedikit
                    nekat.
                  </p>

                  <div className="flex items-center gap-4 justify-center md:justify-start pt-4">
                    <Link
                      href="https://github.com/satriowisnuap"
                      target="_blank"
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Github className="h-5 w-5" />
                    </Link>

                    <Link
                      href="https://www.linkedin.com/in/satrio-wisnu-adi-pratama-79776928a/"
                      target="_blank"
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>

                    <Link
                      href="https://www.instagram.com/satrwisn/"
                      target="_blank"
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>

                    <Link
                      href="mailto:satriowisnuap@gmail.com"
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Mail className="h-5 w-5" />
                    </Link>

                    <Link
                      href="https://wa.me/6289520214500"
                      target="_blank"
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Phone className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-4 mt-24 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <Heart className="h-10 w-10 text-primary mx-auto animate-pulse" />
            <h2 className="text-3xl font-bold italic font-serif">
              "Langkahkan kaki menyusuri sunyi, temukan makna di setiap jejak
              yang kau tinggalkan."
            </h2>
            <p className="text-muted-foreground">
              Terima kasih telah menjadi bagian dari perjalanan Rimbasmita. Di
              antara rimba dan ketinggian, selalu ada cerita yang tumbuh
              perlahan— bukan sekadar untuk dikenang, tetapi untuk dipahami.
              Mari terus berjalan, dan biarkan setiap langkah menemukan
              bahasanya sendiri.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

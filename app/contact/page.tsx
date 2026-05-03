"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Send,
  User,
  Tag,
  Mountain,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

      if (serviceId === "YOUR_SERVICE_ID") {
        console.warn(
          "EmailJS credentials are not configured. Please set them in your environment variables.",
        );
        // For demonstration, we'll simulate a success after a short delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Pesan terkirim! (Mode Simulasi)");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitting(false);
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "rimbasmita@gmail.com",
        },
        publicKey,
      );

      toast.success("Terima kasih! Pesan Anda telah berhasil dikirim.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Maaf, terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 mb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Hubungi Rimbasmita</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6"
            >
              Kritik, Saran, atau <br className="hidden sm:block" />
              <span className="text-primary text-gradient">
                Sekadar Menyapa?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              Kami sangat menghargai setiap masukan Anda. Berikan kritik, saran,
              atau pertanyaan apa pun untuk membantu kami menjadi lebih baik.
            </motion.p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Information Cards */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="lg:col-span-2 space-y-6 order-2 lg:order-1"
              >
                <motion.div
                  variants={fadeInUp}
                  className="glass p-6 rounded-3xl space-y-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Email Kami</h3>
                    <p className="text-muted-foreground text-sm">
                      rimbasmita@gmail.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="glass p-6 rounded-3xl space-y-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Mountain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Visi Kami</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Menjadi ruang digital yang tenang bagi setiap pendaki
                      untuk merangkai makna.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-primary/5 border border-primary/20 p-6 rounded-3xl space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm font-medium text-primary">
                      Tanggapan Cepat
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kami berusaha membalas setiap pesan dalam waktu 24-48 jam
                    hari kerja.
                  </p>
                </motion.div>
              </motion.div>

              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-3 order-1 lg:order-2"
              >
                <div className="glass-strong p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-semibold ml-1"
                        >
                          Nama Lengkap
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="Nama Anda"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-2xl bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold ml-1"
                        >
                          Alamat Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="nama@email.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-2xl bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-sm font-semibold ml-1"
                      >
                        Subjek
                      </Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <Select
                          value={formData.subject}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, subject: value }))
                          }
                        >
                          <SelectTrigger className="pl-10 h-12 rounded-2xl bg-background/50 border-border/50 focus:ring-primary/20 transition-all">
                            <SelectValue placeholder="Pilih Subjek" />
                          </SelectTrigger>
                          <SelectContent className="glass-strong rounded-2xl border-border/50 shadow-2xl">
                            <SelectItem value="Kritik">Kritik</SelectItem>
                            <SelectItem value="Saran">Saran</SelectItem>
                            <SelectItem value="Kerja Sama">Kerja Sama</SelectItem>
                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm font-semibold ml-1"
                      >
                        Pesan
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tuliskan pesan Anda di sini..."
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="min-h-[150px] rounded-2xl bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all resize-none p-4"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          <span>Mengirim...</span>
                        </div>
                      ) : (
                        <>
                          <span>Kirim Pesan</span>
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground mt-4 italic">
                      *Dengan mengirimkan formulir ini, Anda menyetujui pesan
                      Anda akan dikirim ke tim Rimbasmita.
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Closing Text */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-4 mt-24 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary/40"
                />
              ))}
            </div>
            <p className="text-muted-foreground italic font-serif">
              "Setiap suara adalah kompas yang membantu kami menemukan arah yang
              lebih baik."
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

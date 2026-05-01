'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mountain, CloudFog, TreePine } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background mountain imagery */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10" />

        {/* Floating decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-[15%] left-[8%]"
        >
          <CloudFog className="h-20 w-20 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.06, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute top-[25%] right-[12%]"
        >
          <CloudFog className="h-16 w-16 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-[20%] left-[5%]"
        >
          <TreePine className="h-24 w-24 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute bottom-[25%] right-[8%]"
        >
          <TreePine className="h-20 w-20 text-primary" />
        </motion.div>

        {/* Mountain silhouettes */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.06, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0"
        >
          <Mountain className="h-48 w-full text-primary" />
        </motion.div>

        {/* Animated floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute top-[35%] left-[20%] opacity-[0.04]"
        >
          <Mountain className="h-32 w-32 text-primary" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
          className="absolute top-[40%] right-[25%] opacity-[0.03]"
        >
          <Mountain className="h-24 w-24 text-primary" />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
          className="glass-strong rounded-3xl p-8 sm:p-10 text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Mountain className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Rimbasmita
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' as const }}
            className="text-xl sm:text-2xl font-bold text-foreground mb-3"
          >
            <span className="text-gradient">Setiap langkah punya cerita</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' as const }}
            className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto"
          >
            Bergabung dengan komunitas pendaki yang berbagi cerita bermakna.
            Setiap perjalanan di alam layak untuk dikenang dan diceritakan.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex-1 h-px bg-border" />
            <Mountain className="h-4 w-4 text-muted-foreground/40" />
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Google Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' as const }}
          >
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl glass font-medium text-foreground hover:bg-accent/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.46 8.55 1 10.22 1 12s.46 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm">Masuk dengan Google</span>
            </button>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-xs text-muted-foreground/60 mt-6 leading-relaxed"
          >
            Dengan masuk, kamu menyetujui ketentuan layanan dan kebijakan privasi Rimbasmita.
          </motion.p>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-muted-foreground/40 flex items-center justify-center gap-1.5">
            <Mountain className="h-3 w-3" />
            Dibuat untuk pecinta alam Indonesia
          </p>
        </motion.div>
      </div>
    </div>
  );
}

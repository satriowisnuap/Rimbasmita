import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { supabase } from "@/lib/supabase";

export function useRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Registrasi berhasil! Silakan login.");
      router.push("/auth/signin");
    }

    setLoading(false);
  };

  const handleGoogleRegister = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    handleGoogleRegister,
  };
}

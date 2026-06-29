"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomeComponent = () => {
  const router = useRouter();
  useEffect(()=>{
    router.replace("/dashboard");
  },[router])
  return (
   <div>

   </div>
  );
};

export default HomeComponent;

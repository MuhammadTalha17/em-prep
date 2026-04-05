"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Center } from "@mantine/core";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/upload-questions");
  }, [router]);

  return (
    <Center h="100vh">
      <Loader size="lg" />
    </Center>
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  return <>{children}</>;
}

import { prisma } from "@/lib/prisma";

export async function ensureUser(clerkId: string, email?: string) {
  let user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    let resolvedEmail = email;
    if (!resolvedEmail) {
      const clerkUser = await fetch(
        `https://api.clerk.com/v1/users/${clerkId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      ).then((res) => res.json());
      resolvedEmail =
        clerkUser.email_addresses?.[0]?.email_address || `${clerkId}@temp.com`;
    }

    user = await prisma.user.create({
      data: {
        clerkId,
        email: resolvedEmail!,
      },
    });
  }

  return user;
}

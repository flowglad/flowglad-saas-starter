import { FlowgladServer } from '@flowglad/nextjs/server'
import { db } from '@/lib/db/drizzle'
import { eq } from 'drizzle-orm'
import { teamMembers } from '@/lib/db/schema'
import { getUser } from '@/lib/db/queries'

export const flowgladServer = new FlowgladServer({
  getRequestingCustomer: async () => {
    const user = await getUser()
    if (!user) {
      throw new Error('No authenticated user found')
    }

    // Get the team that the user belongs to
    const teamMember = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, user.id),
      with: {
        team: true,
      },
    })

    if (!teamMember?.team) {
      throw new Error('User does not belong to any team')
    }

    return {
      id: teamMember.team.id.toString(),
      externalId: teamMember.team.id.toString(),
      name: teamMember.team.name,
      email: user.email, // Using the user's email since teams don't have emails
    }
  },
})

export const createCheckoutSession = async (priceId: string) => {
  const { url } = await flowgladServer.createCheckoutSession({
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    type: 'product',
    priceId,
    quantity: 1,
  })
  return url
}

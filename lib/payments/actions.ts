'use server'

import { redirect } from 'next/navigation'
import { withTeam } from '@/lib/auth/middleware'
import { flowgladServer } from '../flowglad'

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string
  const { url } = await flowgladServer.createCheckoutSession({
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    type: 'product',
    priceId,
    quantity: 1,
  })
  redirect(url)
})

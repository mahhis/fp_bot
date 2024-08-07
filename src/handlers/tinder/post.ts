import { type Message } from '@grammyjs/types'
import { findLastAddedOrder } from '@/models/OrderProc'
import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function (ctx: Context) {
  ctx.dbuser.step = 'tinder'
  ctx.dbuser.currentOrdersRequest = []
  ctx.dbuser.currentOrderIndex = 0
  await ctx.dbuser.save()

  const order = await findLastAddedOrder(ctx.dbuser)
  if (order) {
    order.status = 'active'
    await order.save()
  }
  await ctx.replyWithLocalization('recorded', {
    ...sendOptions(ctx),
    reply_markup: undefined,
  })

  return await ctx.replyWithLocalization('thank', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'tinder'),
  })
}

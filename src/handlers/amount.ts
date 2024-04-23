import { type Message } from '@grammyjs/types'
import { getI18nKeyboard } from '@/helpers/bot'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'
import { sendOrders } from './orders'
import { findLastAddedOrder } from '@/models/OrderProc'

export default async function (ctx: Context, msg: Message) {
  const order = await findLastAddedOrder(ctx.dbuser)
  if (order) {
    order.amount = parseFloat(msg.text!)
    await order.save()
  }
  if (ctx.dbuser.username == null) {
    ctx.dbuser.step = 'select_contact'
    await ctx.dbuser.save()
    return ctx.replyWithLocalization('contact', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'check_nick'),
    })
  } else {
    ctx.dbuser.step = 'check_order'
    await ctx.dbuser.save()
    order!.contact = '@' + ctx.dbuser.username
    await order!.save()
    await sendOrders(ctx)
  }
}
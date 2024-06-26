import { call } from '@/models/OrderCounter'
import { findOrCreateOrder } from '@/models/OrderProc'
import { getI18nKeyboard } from '@/helpers/bot'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleSendMoney(ctx: Context) {
  ctx.dbuser.step = 'select_country_from'
  await ctx.dbuser.save()
  await findOrCreateOrder(ctx.dbuser, (await call()).seq)
  return await ctx.replyWithLocalization('from', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'countries'),
  })
}

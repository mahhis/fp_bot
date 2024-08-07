import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleAddToWaitList(ctx: Context) {
  ctx.dbuser.step = 'start'
  ctx.dbuser.inWaitList = 'WAITING'
  await ctx.dbuser.save()
  await ctx.replyWithLocalization('recorded', {
    ...sendOptions(ctx),
    reply_markup: undefined,
  })
  return ctx.replyWithLocalization('added', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'start'),
  })
}

import { InlineKeyboard } from 'grammy'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export const selectOrder = async (ctx: Context) => {
  const selection = ctx.callbackQuery?.data
  const currentOrdersRequest = ctx.dbuser.currentTransferOrdersRequest!

  if (selection == 'previous' && ctx.dbuser.currentOrderIndex! > 0) {
    ctx.dbuser.currentOrderIndex = ctx.dbuser.currentOrderIndex! - 1
    await ctx.dbuser.save()
  }

  if (
    selection == 'next' &&
    ctx.dbuser.currentOrderIndex! < currentOrdersRequest.length
  ) {
    ctx.dbuser.currentOrderIndex = ctx.dbuser.currentOrderIndex! + 1
    await ctx.dbuser.save()
  }

  const order = currentOrdersRequest[ctx.dbuser.currentOrderIndex!]
  const menu = createSelectionMenu(
    ctx,
    ctx.dbuser.currentOrderIndex!,
    currentOrdersRequest.length
  )

  if (
    order &&
    ctx.dbuser.currentOrderIndex! >= 0 &&
    ctx.dbuser.currentOrderIndex! < currentOrdersRequest.length
  ) {
    const message = ctx.i18n.t('select_order', {
      ...sendOptions(ctx, {
        // current: ctx.dbuser.currentOrderIndex! + 1,
        // all: currentOrdersRequest.length,
        // id: order.id,
        // from: order.countryFrom,
        // methodFrom: order.methodFrom,
        // to: order.countryTo,
        // methodTo: order.methodTo,
        // amount: order.amount,
        // currency: order.currency,
        // contact: order.contact,
      }),
    })

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: menu,
    })
  }
}

export function createSelectionMenu(
  ctx: Context,
  orderIndex: number,
  currentOrdersRequestLenght: number
) {
  const selectionMenu = new InlineKeyboard()

  let previousButtonText = '<<'
  let nextButtonText = '>>'

  if (orderIndex == 0) {
    previousButtonText = '⏹️'
    selectionMenu.text(previousButtonText, 'none')
  } else {
    selectionMenu.text(previousButtonText, 'previous')
  }

  if (orderIndex + 1 == currentOrdersRequestLenght) {
    nextButtonText = '⏹️'
    selectionMenu.text(nextButtonText, 'none').row()
  } else {
    selectionMenu.text(nextButtonText, 'next').row()
  }

  return selectionMenu
}

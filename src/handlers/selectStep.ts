import { type Message } from '@grammyjs/types'
import {
  handleAnotherWayToContact,
  handleCheckNick,
  handleEnterContact,
} from '@/handlers/tinder/contact'
import { handleCountryFrom, handleCountryTo } from '@/handlers/tinder/country'
import { handleMethodFrom, handleMethodTo } from '@/handlers/tinder/method'
import { sendUserOrders } from '@/handlers/tinder/orders'
import Context from '@/models/Context'
import handleAddToWaitList from '@/handlers/transfer/addToWaitList'
import handleAmount from '@/handlers/tinder/amount'
import handleCancel from '@/handlers/tinder/cancel'
import handleCurrency from '@/handlers/tinder/currency'
import handlePostOrder from '@/handlers/tinder/post'
import handleSendMoney from '@/handlers/tinder/sendMoney'
import handleStartTinder from '@/handlers/tinder/startTinder'
import handleStartTransfer from '@/handlers/transfer/startTransfer'
import i18n from '@/helpers/i18n'
import sendOptions from '@/helpers/sendOptions'

export default async function selectStep(ctx: Context) {
  const message = ctx.msg!

  if (isCancel(ctx, message) && ctx.dbuser.step !== 'start') {
    return handleCancel(ctx)
  }

  switch (ctx.dbuser.step) {
    case 'start':
      if (isTinder(ctx, message)) {
        return await handleStartTinder(ctx)
      } else if (isTransfer(ctx, message)) {
        return await handleStartTransfer(ctx)
      } else {
        return await ctx.replyWithLocalization('bad_start', sendOptions(ctx))
      }
    case 'tinder':
      if (isSendMoney(ctx, message)) {
        return await handleSendMoney(ctx)
      } else if (isMyOrders(ctx, message)) {
        return await sendUserOrders(ctx)
      } else {
        return await ctx.replyWithLocalization(
          'bad_start_tinder',
          sendOptions(ctx)
        )
      }
    case 'transfer':
      if (isAdd(ctx, message)) {
        return await handleAddToWaitList(ctx)
      } else {
        return await ctx.replyWithLocalization(
          'bad_start_transfer',
          sendOptions(ctx)
        )
      }
    case 'select_country_from':
      if (isCountry(ctx, message)) {
        return await handleCountryFrom(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_country', sendOptions(ctx))
      }
    case 'select_method_from':
      return await handleMethodFrom(ctx, message)
    case 'select_country_to':
      if (isCountry(ctx, message)) {
        return await handleCountryTo(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_country', sendOptions(ctx))
      }
    case 'select_method_to':
      return await handleMethodTo(ctx, message)
    case 'select_currency':
      if (isCurrency(ctx, message)) {
        return await handleCurrency(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_currency', sendOptions(ctx))
      }
    case 'enter_amount':
      if (isAmount(ctx, message)) {
        return await handleAmount(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_amount', sendOptions(ctx))
      }
    case 'select_order':
      if (isAmount(ctx, message)) {
        return await handleAmount(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_amount', sendOptions(ctx))
      }
    case 'select_contact':
      if (isCheckNick(ctx, message)) {
        return await handleCheckNick(ctx, message)
      } else if (isAnotherWayToContact(ctx, message)) {
        return await handleAnotherWayToContact(ctx, message)
      } else {
        return await ctx.replyWithLocalization('contact', sendOptions(ctx))
      }
    case 'enter_another_way_to_contact':
      return await handleEnterContact(ctx, message)
    case 'check_order':
      if (isPostOrder(ctx, message)) {
        return await handlePostOrder(ctx, message)
      } else {
        return await ctx.replyWithLocalization(
          'bad_post_order',
          sendOptions(ctx)
        )
      }
  }
}

function isCountry(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'pl') ||
    message.text == i18n.t(ctx.dbuser.language, 'by') ||
    message.text == i18n.t(ctx.dbuser.language, 'ru') ||
    message.text == i18n.t(ctx.dbuser.language, 'ua')
  )
}
function isPostOrder(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'post')
}

function isCheckNick(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'check_nick') &&
    ctx.dbuser.username != null
  )
}

function isAnotherWayToContact(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'another_way_to_contact')
}

function isCurrency(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'eur') ||
    message.text == i18n.t(ctx.dbuser.language, 'usd') ||
    message.text == i18n.t(ctx.dbuser.language, 'byn') ||
    message.text == i18n.t(ctx.dbuser.language, 'pln') ||
    message.text == i18n.t(ctx.dbuser.language, 'rus') ||
    message.text == i18n.t(ctx.dbuser.language, 'uah')
  )
}

function isCancel(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'cancel')
}
function isMyOrders(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'my_orders')
}

function isSendMoney(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'send')
}
function isAmount(ctx: Context, message: Message) {
  const amount = parseFloat(message.text!)
  return !isNaN(amount) && amount > 1 && amount < 10000000
}

function isTinder(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'tinder')
}
function isTransfer(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'transfer')
}

function isAdd(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'add')
}

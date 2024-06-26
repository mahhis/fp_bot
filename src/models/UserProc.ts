import { User } from '@/models/User'
import { getModelForClass } from '@typegoose/typegoose'

export const UserModel = getModelForClass(User)

export function findOrCreateUser(id: number) {
  return UserModel.findOneAndUpdate(
    { id },
    {},
    {
      upsert: true,
      new: true,
    }
  )
}

export function findOrUpdateUser(id: number, username: string | undefined) {
  return UserModel.findOneAndUpdate(
    { id, username },
    {},
    {
      upsert: true,
    }
  )
}

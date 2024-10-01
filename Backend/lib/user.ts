import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser(userData) {
  try {
    const newUser = await prisma.user.create({
      data: userData,
    })
    console.log('User created:', newUser)
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
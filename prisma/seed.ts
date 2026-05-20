import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const travelPassword = await bcrypt.hash('travel123', 10)
  const lotteryPassword = await bcrypt.hash('lottery123', 10)

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { user_id: 'ADMIN01' },
    update: {},
    create: {
      user_id: 'ADMIN01',
      password: adminPassword,
      role: 'admin',
      full_name: 'System Admin',
      is_active: true,
    },
  })

  // Seed Travel Staff
  const travel = await prisma.user.upsert({
    where: { user_id: 'TRAVEL01' },
    update: {},
    create: {
      user_id: 'TRAVEL01',
      password: travelPassword,
      role: 'travel_staff',
      full_name: 'Travel Desk',
      is_active: true,
    },
  })

  // Seed Lottery Staff
  const lottery = await prisma.user.upsert({
    where: { user_id: 'RKSHOP01' },
    update: {},
    create: {
      user_id: 'RKSHOP01',
      password: lotteryPassword,
      role: 'lottery_staff',
      full_name: 'Lottery Terminal',
      is_active: true,
    },
  })

  console.log('Seeding completed successfully:', {
    admin: admin.user_id,
    travel: travel.user_id,
    lottery: lottery.user_id,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'yuda' },
    update: {},
    create: {
      name: 'Yuda Bali Transfer',
      slug: 'yuda',
    },
  })

  const passwordHash = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@yudatransfer.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin Yuda',
      email: 'admin@yudatransfer.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Admin ready:', user.email)
  console.log('✅ Seeding finished!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando sembrado de la base de datos...');

  // 1. Crear Roles por defecto
  const rolesData = [
    { name: RoleName.ADMIN, description: 'Administrador total del sistema' },
    { name: RoleName.SUPERVISOR, description: 'Supervisor operativo y de asignaciones' },
    { name: RoleName.SUPPORT_AGENT, description: 'Agente de soporte para resolución de tickets' },
  ];

  for (const role of rolesData) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('✅ Roles asegurados.');

  // 2. Obtener el ID del rol ADMIN
  const adminRole = await prisma.role.findUnique({
    where: { name: RoleName.ADMIN },
  });

  if (!adminRole) {
    throw new Error('No se pudo encontrar el rol ADMIN');
  }

  // 3. Crear Usuario Administrador por defecto
  const adminEmail = 'admin@ticketflow.com';
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      roleId: adminRole.id,
      firstName: 'Admin',
      lastName: 'Sistema',
      email: adminEmail,
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  console.log('✅ Usuario Administrador inicial creado (admin@ticketflow.com / Admin123!)');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
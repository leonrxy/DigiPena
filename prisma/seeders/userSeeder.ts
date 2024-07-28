import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const totalGenerated = 15;

    // Hash Passwords
    const passwordUser = await bcrypt.hash('user12345', 10);
    const passwordAdmin = await bcrypt.hash('admin123', 10);

    // Seed users
    for (let i = 1; i <= totalGenerated; i++) {
        let number = i;
        while (true) {
            const email = `user${number}@mail.com`;
            const user = await prisma.users.findUnique({ where: { email } });
            if (user) {
                number += totalGenerated;
            } else {
                break;
            }
        }
        await prisma.users.create({
            data: {
                email: `user${number}@mail.com`,
                username: `user${number}`,
                password: passwordUser,
                verified: true,
                user_profiles: {
                    create: {
                        first_name: `user`,
                        last_name: `profile ${number}`,
                    }
                }
            }
        });
    }

    // Seed super admins
    const admin = await prisma.users.findFirst({ where: { OR: [{ email: 'admin@mail.com' }] } });
    if (admin) {
        return;
    }
    await prisma.users.createMany({
        data: [
            { email: 'admin@mail.com', username: 'admin', password: passwordAdmin, role: 'admin', verified: true },
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('Database has been seeded');
    });

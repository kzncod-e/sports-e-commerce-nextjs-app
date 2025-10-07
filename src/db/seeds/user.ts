import { db } from '@/db';
import { user } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            id: 'test-user-1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            emailVerified: false,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnSmith',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'test-user-2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            emailVerified: false,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJohnson',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'test-user-3',
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            emailVerified: false,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBrown',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'test-user-4',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            emailVerified: false,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyDavis',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'test-user-5',
            name: 'David Wilson',
            email: 'david.wilson@example.com',
            emailVerified: false,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidWilson',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    await db.insert(user).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
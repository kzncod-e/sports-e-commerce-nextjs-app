import { db } from '@/db';
import { category } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Running Shoes',
            slug: 'running-shoes',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Basketball',
            slug: 'basketball',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Football',
            slug: 'football',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Tennis',
            slug: 'tennis',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Fitness Equipment',
            slug: 'fitness-equipment',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Sportswear',
            slug: 'sportswear',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Training Gear',
            slug: 'training-gear',
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(category).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
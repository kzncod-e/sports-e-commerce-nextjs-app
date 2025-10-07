import { db } from '@/db';
import { review } from '@/db/schema';

async function main() {
    const sampleReviews = [
        // Product 1 - 4 reviews
        {
            userId: 'test-user-1',
            productId: 1,
            rating: 5,
            comment: 'Excellent product! Exceeded my expectations',
            createdAt: '2024-12-15T10:30:00Z',
            updatedAt: '2024-12-15T10:30:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 1,
            rating: 4,
            comment: 'Great product, minor improvements needed',
            createdAt: '2024-12-18T14:20:00Z',
            updatedAt: '2024-12-18T14:20:00Z',
        },
        {
            userId: 'test-user-3',
            productId: 1,
            rating: 5,
            comment: 'Best purchase I have ever made',
            createdAt: '2024-12-22T09:15:00Z',
            updatedAt: '2024-12-22T09:15:00Z',
        },
        {
            userId: 'test-user-4',
            productId: 1,
            rating: 3,
            comment: 'Decent product, nothing special',
            createdAt: '2024-12-28T16:45:00Z',
            updatedAt: '2024-12-28T16:45:00Z',
        },

        // Product 2 - 3 reviews
        {
            userId: 'test-user-5',
            productId: 2,
            rating: 5,
            comment: 'High quality, worth every penny',
            createdAt: '2024-12-16T11:00:00Z',
            updatedAt: '2024-12-16T11:00:00Z',
        },
        {
            userId: 'test-user-1',
            productId: 2,
            rating: 4,
            comment: 'Very good quality, fast shipping',
            createdAt: '2024-12-20T13:30:00Z',
            updatedAt: '2024-12-20T13:30:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 2,
            rating: 2,
            comment: 'Not as described, disappointed',
            createdAt: '2024-12-25T10:20:00Z',
            updatedAt: '2024-12-25T10:20:00Z',
        },

        // Product 3 - 4 reviews
        {
            userId: 'test-user-3',
            productId: 3,
            rating: 5,
            comment: 'Love it! Perfect for my workouts',
            createdAt: '2024-12-14T08:45:00Z',
            updatedAt: '2024-12-14T08:45:00Z',
        },
        {
            userId: 'test-user-4',
            productId: 3,
            rating: 4,
            comment: 'Solid performance, would recommend',
            createdAt: '2024-12-19T15:10:00Z',
            updatedAt: '2024-12-19T15:10:00Z',
        },
        {
            userId: 'test-user-5',
            productId: 3,
            rating: 4,
            comment: 'Good value for money',
            createdAt: '2024-12-23T12:00:00Z',
            updatedAt: '2024-12-23T12:00:00Z',
        },
        {
            userId: 'test-user-1',
            productId: 3,
            rating: 3,
            comment: 'It is okay, met expectations',
            createdAt: '2024-12-27T14:30:00Z',
            updatedAt: '2024-12-27T14:30:00Z',
        },

        // Product 4 - 3 reviews
        {
            userId: 'test-user-2',
            productId: 4,
            rating: 5,
            comment: 'Best purchase I made this year',
            createdAt: '2024-12-17T09:20:00Z',
            updatedAt: '2024-12-17T09:20:00Z',
        },
        {
            userId: 'test-user-3',
            productId: 4,
            rating: 4,
            comment: 'Great product, minor improvements needed',
            createdAt: '2024-12-21T11:40:00Z',
            updatedAt: '2024-12-21T11:40:00Z',
        },
        {
            userId: 'test-user-4',
            productId: 4,
            rating: 1,
            comment: 'Poor quality, returning it',
            createdAt: '2024-12-26T16:15:00Z',
            updatedAt: '2024-12-26T16:15:00Z',
        },

        // Product 5 - 4 reviews
        {
            userId: 'test-user-5',
            productId: 5,
            rating: 5,
            comment: 'Excellent product! Exceeded my expectations',
            createdAt: '2024-12-13T10:00:00Z',
            updatedAt: '2024-12-13T10:00:00Z',
        },
        {
            userId: 'test-user-1',
            productId: 5,
            rating: 5,
            comment: 'High quality, worth every penny',
            createdAt: '2024-12-18T13:25:00Z',
            updatedAt: '2024-12-18T13:25:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 5,
            rating: 4,
            comment: 'Very good quality, fast shipping',
            createdAt: '2024-12-24T15:50:00Z',
            updatedAt: '2024-12-24T15:50:00Z',
        },
        {
            userId: 'test-user-3',
            productId: 5,
            rating: 3,
            comment: 'Average quality, does the job',
            createdAt: '2024-12-29T09:30:00Z',
            updatedAt: '2024-12-29T09:30:00Z',
        },

        // Product 6 - 3 reviews
        {
            userId: 'test-user-4',
            productId: 6,
            rating: 4,
            comment: 'Solid performance, would recommend',
            createdAt: '2024-12-15T12:15:00Z',
            updatedAt: '2024-12-15T12:15:00Z',
        },
        {
            userId: 'test-user-5',
            productId: 6,
            rating: 5,
            comment: 'Love it! Perfect for my workouts',
            createdAt: '2024-12-20T10:45:00Z',
            updatedAt: '2024-12-20T10:45:00Z',
        },
        {
            userId: 'test-user-1',
            productId: 6,
            rating: 2,
            comment: 'Quality could be better',
            createdAt: '2024-12-27T13:20:00Z',
            updatedAt: '2024-12-27T13:20:00Z',
        },

        // Product 7 - 4 reviews
        {
            userId: 'test-user-2',
            productId: 7,
            rating: 5,
            comment: 'Best purchase I made this year',
            createdAt: '2024-12-14T11:30:00Z',
            updatedAt: '2024-12-14T11:30:00Z',
        },
        {
            userId: 'test-user-3',
            productId: 7,
            rating: 4,
            comment: 'Good value for money',
            createdAt: '2024-12-19T14:00:00Z',
            updatedAt: '2024-12-19T14:00:00Z',
        },
        {
            userId: 'test-user-4',
            productId: 7,
            rating: 4,
            comment: 'Great product, minor improvements needed',
            createdAt: '2024-12-23T16:20:00Z',
            updatedAt: '2024-12-23T16:20:00Z',
        },
        {
            userId: 'test-user-5',
            productId: 7,
            rating: 5,
            comment: 'Excellent product! Exceeded my expectations',
            createdAt: '2024-12-28T10:10:00Z',
            updatedAt: '2024-12-28T10:10:00Z',
        },

        // Product 8 - 3 reviews
        {
            userId: 'test-user-1',
            productId: 8,
            rating: 4,
            comment: 'Solid performance, would recommend',
            createdAt: '2024-12-16T09:50:00Z',
            updatedAt: '2024-12-16T09:50:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 8,
            rating: 3,
            comment: 'Decent product, nothing special',
            createdAt: '2024-12-22T12:40:00Z',
            updatedAt: '2024-12-22T12:40:00Z',
        },
        {
            userId: 'test-user-3',
            productId: 8,
            rating: 5,
            comment: 'High quality, worth every penny',
            createdAt: '2024-12-26T15:30:00Z',
            updatedAt: '2024-12-26T15:30:00Z',
        },

        // Product 9 - 4 reviews
        {
            userId: 'test-user-4',
            productId: 9,
            rating: 5,
            comment: 'Love it! Perfect for my workouts',
            createdAt: '2024-12-13T08:20:00Z',
            updatedAt: '2024-12-13T08:20:00Z',
        },
        {
            userId: 'test-user-5',
            productId: 9,
            rating: 4,
            comment: 'Very good quality, fast shipping',
            createdAt: '2024-12-17T11:15:00Z',
            updatedAt: '2024-12-17T11:15:00Z',
        },
        {
            userId: 'test-user-1',
            productId: 9,
            rating: 4,
            comment: 'Good value for money',
            createdAt: '2024-12-21T14:50:00Z',
            updatedAt: '2024-12-21T14:50:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 9,
            rating: 1,
            comment: 'Waste of money',
            createdAt: '2024-12-25T16:00:00Z',
            updatedAt: '2024-12-25T16:00:00Z',
        },

        // Product 10 - 3 reviews
        {
            userId: 'test-user-3',
            productId: 10,
            rating: 5,
            comment: 'Best purchase I have ever made',
            createdAt: '2024-12-15T13:45:00Z',
            updatedAt: '2024-12-15T13:45:00Z',
        },
        {
            userId: 'test-user-4',
            productId: 10,
            rating: 4,
            comment: 'Solid performance, would recommend',
            createdAt: '2024-12-20T09:30:00Z',
            updatedAt: '2024-12-20T09:30:00Z',
        },
        {
            userId: 'test-user-5',
            productId: 10,
            rating: 3,
            comment: 'It is okay, met expectations',
            createdAt: '2024-12-24T11:20:00Z',
            updatedAt: '2024-12-24T11:20:00Z',
        },

        // Products 11-20 - 1-2 reviews each
        {
            userId: 'test-user-1',
            productId: 11,
            rating: 5,
            comment: 'Excellent product! Exceeded my expectations',
            createdAt: '2024-12-18T10:00:00Z',
            updatedAt: '2024-12-18T10:00:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 12,
            rating: 4,
            comment: 'Great product, minor improvements needed',
            createdAt: '2024-12-19T12:30:00Z',
            updatedAt: '2024-12-19T12:30:00Z',
        },
        {
            userId: 'test-user-3',
            productId: 13,
            rating: 5,
            comment: 'High quality, worth every penny',
            createdAt: '2024-12-20T14:15:00Z',
            updatedAt: '2024-12-20T14:15:00Z',
        },
        {
            userId: 'test-user-4',
            productId: 14,
            rating: 3,
            comment: 'Decent product, nothing special',
            createdAt: '2024-12-21T16:40:00Z',
            updatedAt: '2024-12-21T16:40:00Z',
        },
        {
            userId: 'test-user-5',
            productId: 15,
            rating: 4,
            comment: 'Very good quality, fast shipping',
            createdAt: '2024-12-22T09:20:00Z',
            updatedAt: '2024-12-22T09:20:00Z',
        },
        {
            userId: 'test-user-1',
            productId: 16,
            rating: 5,
            comment: 'Love it! Perfect for my workouts',
            createdAt: '2024-12-23T11:50:00Z',
            updatedAt: '2024-12-23T11:50:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 17,
            rating: 4,
            comment: 'Solid performance, would recommend',
            createdAt: '2024-12-24T13:10:00Z',
            updatedAt: '2024-12-24T13:10:00Z',
        },
        {
            userId: 'test-user-3',
            productId: 18,
            rating: 2,
            comment: 'Not as described, disappointed',
            createdAt: '2024-12-25T15:30:00Z',
            updatedAt: '2024-12-25T15:30:00Z',
        },
        {
            userId: 'test-user-4',
            productId: 19,
            rating: 5,
            comment: 'Best purchase I made this year',
            createdAt: '2024-12-26T10:45:00Z',
            updatedAt: '2024-12-26T10:45:00Z',
        },
        {
            userId: 'test-user-5',
            productId: 20,
            rating: 4,
            comment: 'Good value for money',
            createdAt: '2024-12-27T12:15:00Z',
            updatedAt: '2024-12-27T12:15:00Z',
        },

        // Products 21-25 - 0-1 reviews each
        {
            userId: 'test-user-1',
            productId: 21,
            rating: 3,
            comment: 'Average quality, does the job',
            createdAt: '2024-12-28T14:00:00Z',
            updatedAt: '2024-12-28T14:00:00Z',
        },
        {
            userId: 'test-user-2',
            productId: 23,
            rating: 5,
            comment: 'Excellent product! Exceeded my expectations',
            createdAt: '2024-12-29T11:30:00Z',
            updatedAt: '2024-12-29T11:30:00Z',
        },
    ];

    await db.insert(review).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
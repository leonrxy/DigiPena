import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const articleCategories = [
        {
            name: 'Technology',
            description: 'All about the latest in tech.',
        },
        {
            name: 'Health',
            description: 'Health tips and news.',
        },
        {
            name: 'Education',
            description: 'Educational resources and updates.',
        },
        {
            name: 'Entertainment',
            description: 'Movies, music, and more.',
        },
        {
            name: 'Science',
            description: 'Discoveries and advancements in science.',
        },
        {
            name: 'Travel',
            description: 'Travel guides and tips for your next adventure.',
        },
        {
            name: 'Food',
            description: 'Delicious recipes and food reviews.',
        },
        {
            name: 'Sports',
            description: 'Latest news and updates from the world of sports.',
        },
        {
            name: 'Finance',
            description: 'Financial news and advice.',
        },
        {
            name: 'Lifestyle',
            description: 'Tips and advice for a better lifestyle.',
        },
        {
            name: 'Business',
            description: 'Insights and news from the business world.',
        },
        {
            name: 'Fashion',
            description: 'Latest trends and fashion advice.',
        },
        {
            name: 'Culture',
            description: 'Exploring different cultures and their stories.',
        },
        {
            name: 'Politics',
            description: 'Political news and analysis.',
        },
        {
            name: 'Environment',
            description: 'News and tips on protecting the environment.',
        },
        {
            name: 'Parenting',
            description: 'Advice and tips for parents.',
        },
        {
            name: 'Relationships',
            description: 'Tips and stories about relationships.',
        },
        {
            name: 'History',
            description: 'Articles about historical events and figures.',
        },
        {
            name: 'Psychology',
            description: 'Insights into the human mind and behavior.',
        },
        {
            name: 'Art',
            description: 'Exploring the world of art.',
        },
        {
            name: 'Music',
            description: 'Latest news and reviews in the music industry.',
        },
        {
            name: 'Real Estate',
            description: 'Advice and news about the real estate market.',
        },
        {
            name: 'Fitness',
            description: 'Tips and guides for staying fit and healthy.',
        },
        {
            name: 'Automotive',
            description: 'News and reviews about cars and the automotive industry.',
        },
        {
            name: 'Gaming',
            description: 'Latest news and reviews in the gaming world.',
        },
        {
            name: 'DIY',
            description: 'Do-it-yourself tips and projects.',
        },
        {
            name: 'Photography',
            description: 'Tips and stories about photography.',
        },
        {
            name: 'Pets',
            description: 'Advice and stories about pets.',
        },
        {
            name: 'Technology Reviews',
            description: 'In-depth reviews of the latest technology products.',
        },
        {
            name: 'Gardening',
            description: 'Tips and advice for gardening enthusiasts.',
        },
        {
            name: 'Home Improvement',
            description: 'Guides and tips for home improvement projects.',
        },
        {
            name: 'Spirituality',
            description: 'Articles about spiritual practices and beliefs.',
        },
        {
            name: 'Career',
            description: 'Advice and stories about career development.',
        },
        {
            name: 'Writing',
            description: 'Tips and stories about writing.',
        },
        {
            name: 'Comedy',
            description: 'Funny stories and comedy articles.',
        },
        {
            name: 'Productivity',
            description: 'Tips and tools for increasing productivity.',
        },
        {
            name: 'Wellness',
            description: 'Articles about maintaining overall wellness.',
        },
        {
            name: 'Self-Improvement',
            description: 'Tips and stories about personal growth.',
        },
        {
            name: 'Meditation',
            description: 'Guides and stories about meditation practices.',
        },
        {
            name: 'Mindfulness',
            description: 'Tips and advice for practicing mindfulness.',
        },
        {
            name: 'Tech Startups',
            description: 'News and stories about tech startups.',
        },
        {
            name: 'Economy',
            description: 'Articles about economic trends and analysis.',
        },
        {
            name: 'Astrology',
            description: 'Articles about astrology and horoscopes.',
        },
        {
            name: 'Space',
            description: 'News and stories about space exploration.',
        },
    ];

    for (const category of articleCategories) {
        await prisma.article_categories.upsert({
            where: { name: category.name },
            update: {},
            create: {
                article_category_id: undefined, // Let Prisma handle the UUID generation
                name: category.name,
                description: category.description,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

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

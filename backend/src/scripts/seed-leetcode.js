const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const prisma = require('../config/database');
const { seedProblems } = require('../modules/leetcode/seed');

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to database');

        const result = await seedProblems();
        console.log('Seed completed:', result);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

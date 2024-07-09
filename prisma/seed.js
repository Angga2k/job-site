const {
    PrismaClient
} = require('@prisma/client');
const {
    faker
} = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding...');

    // Create some users
    const users = [];
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                username: faker.internet.userName(),
                password: faker.internet.password(),
                email: faker.internet.email(),
                full_name: faker.person.fullName(),
                phone_number: faker.phone.number(),
                user_type: i % 2 === 0 ? 'job_seeker' : 'employer',
            }
        });
        users.push(user);
    }
    console.log('Users created.');

    // Create some companies
    const companies = [];
    for (let i = 0; i < 5; i++) {
        const company = await prisma.company.create({
            data: {
                user_id: users[i + 5].user_id, // Use some of the created users as employers
                company_name: faker.company.name(),
                description: faker.company.catchPhrase(),
                website: faker.internet.url(),
                location: faker.location.city(),
            }
        });
        companies.push(company);
    }
    console.log('Companies created.');

    // Create some job categories
    const categories = [];
    const categoryNames = new Set();
    while (categories.length < 5) {
        const categoryName = faker.person.jobType();
        if (!categoryNames.has(categoryName)) {
            const category = await prisma.jobCategory.create({
                data: {
                    category_name: categoryName,
                }
            });
            categories.push(category);
            categoryNames.add(categoryName);
        }
    }
    console.log('Job categories created.');

    // Create some jobs
    const jobs = [];
    for (let i = 0; i < 10; i++) {
        const job = await prisma.job.create({
            data: {
                company_id: companies[i % companies.length].company_id,
                job_title: faker.person.jobTitle(),
                job_description: faker.lorem.paragraph(),
                location: faker.location.city(),
                job_type: faker.helpers.arrayElement(['full_time', 'part_time', 'contract', 'internship', 'temporary']),
                salary_range: faker.finance.amount({
                    min: 30000,
                    max: 100000,
                    dec: 0,
                    symbol: '$'
                }) + ' - ' + faker.finance.amount({
                    min: 50000,
                    max: 150000,
                    dec: 0,
                    symbol: '$'
                }),
                closing_date: faker.date.future(),
            }
        });

        // Create job categories relations
        await prisma.job_Category.create({
            data: {
                job_id: job.job_id,
                category_id: categories[i % categories.length].category_id,
            }
        });

        jobs.push(job);
    }
    console.log('Jobs created.');

    // Create some job applications
    for (let i = 0; i < 10; i++) {
        await prisma.jobApplication.create({
            data: {
                job_id: jobs[i].job_id,
                user_id: users[i % users.length].user_id,
                cover_letter: faker.lorem.paragraph(),
                resume: faker.internet.url(),
            }
        });
    }
    console.log('Job applications created.');

    // Create some saved jobs
    for (let i = 0; i < 10; i++) {
        await prisma.savedJob.create({
            data: {
                user_id: users[i % users.length].user_id,
                job_id: jobs[i].job_id,
            }
        });
    }
    console.log('Saved jobs created.');

    // Create some company reviews
    for (let i = 0; i < 10; i++) {
        await prisma.companyReview.create({
            data: {
                company_id: companies[i % companies.length].company_id,
                user_id: users[i].user_id,
                rating: faker.number.int({
                    min: 1,
                    max: 5
                }),
                review: faker.lorem.paragraph(),
            }
        });
    }
    console.log('Company reviews created.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function setupTestData() {
  console.log('🔧 Setting up test data...');

  try {
    // Create test users
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        id: 'admin-user-id',
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2b$10$hashedpassword', // password123
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword', // password123
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Create test categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { id: 'tech-category-id' },
        update: {},
        create: {
          id: 'tech-category-id',
          name: 'Technology',
          description: 'Technology related content',
          created_at: new Date(),
          updated_at: new Date()
        }
      }),
      prisma.category.upsert({
        where: { id: 'business-category-id' },
        update: {},
        create: {
          id: 'business-category-id',
          name: 'Business',
          description: 'Business related content',
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    ]);

    // Create test tags
    const tags = await Promise.all([
      prisma.tag.upsert({
        where: { id: 'react-tag-id' },
        update: {},
        create: {
          id: 'react-tag-id',
          name: 'react',
          created_at: new Date(),
          updated_at: new Date()
        }
      }),
      prisma.tag.upsert({
        where: { id: 'typescript-tag-id' },
        update: {},
        create: {
          id: 'typescript-tag-id',
          name: 'typescript',
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    ]);

    // Create test content
    const content = await Promise.all([
      prisma.content.upsert({
        where: { id: 'test-article-1' },
        update: {},
        create: {
          id: 'test-article-1',
          title: 'Test Article 1',
          content: 'This is test article content 1',
          type: 'article',
          status: 'published',
          author_id: testUser.id,
          category_id: categories[0].id,
          tags: ['react', 'typescript'],
          created_at: new Date(),
          updated_at: new Date()
        }
      }),
      prisma.content.upsert({
        where: { id: 'test-document-1' },
        update: {},
        create: {
          id: 'test-document-1',
          title: 'Test Document 1',
          content: 'This is test document content 1',
          type: 'document',
          status: 'published',
          author_id: testUser.id,
          category_id: categories[1].id,
          tags: ['business'],
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    ]);

    // Create test comments
    await prisma.comment.createMany({
      data: [
        {
          id: 'test-comment-1',
          content_id: content[0].id,
          user_id: testUser.id,
          text: 'This is a test comment',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'test-comment-2',
          content_id: content[0].id,
          user_id: adminUser.id,
          text: 'This is another test comment',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      skipDuplicates: true
    });

    // Create test analytics events
    await prisma.analyticsEvent.createMany({
      data: [
        {
          id: 'test-event-1',
          event_type: 'page_view',
          content_id: content[0].id,
          user_id: testUser.id,
          meta: { page: '/articles/test-article-1' },
          created_at: new Date()
        },
        {
          id: 'test-event-2',
          event_type: 'like',
          content_id: content[0].id,
          user_id: testUser.id,
          meta: {},
          created_at: new Date()
        }
      ],
      skipDuplicates: true
    });

    // Create test activity logs
    await prisma.activityLog.createMany({
      data: [
        {
          id: 'test-log-1',
          user_id: testUser.id,
          action: 'login',
          details: 'User logged in',
          created_at: new Date()
        },
        {
          id: 'test-log-2',
          user_id: testUser.id,
          action: 'create_content',
          details: 'User created new article',
          created_at: new Date()
        }
      ],
      skipDuplicates: true
    });

    console.log('✅ Test data setup completed');
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');

  try {
    // Delete in reverse order of dependencies
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { content_id: { in: ['test-article-1', 'test-document-1'] } },
          { user_id: { in: ['test-user-id', 'admin-user-id'] } }
        ]
      }
    });

    await prisma.analyticsEvent.deleteMany({
      where: {
        OR: [
          { content_id: { in: ['test-article-1', 'test-document-1'] } },
          { user_id: { in: ['test-user-id', 'admin-user-id'] } }
        ]
      }
    });

    await prisma.activityLog.deleteMany({
      where: {
        user_id: { in: ['test-user-id', 'admin-user-id'] }
      }
    });

    await prisma.content.deleteMany({
      where: {
        id: { in: ['test-article-1', 'test-document-1'] }
      }
    });

    await prisma.user.deleteMany({
      where: {
        id: { in: ['test-user-id', 'admin-user-id'] }
      }
    });

    await prisma.category.deleteMany({
      where: {
        id: { in: ['tech-category-id', 'business-category-id'] }
      }
    });

    await prisma.tag.deleteMany({
      where: {
        id: { in: ['react-tag-id', 'typescript-tag-id'] }
      }
    });

    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupTestData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}


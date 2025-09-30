import { http, HttpResponse } from 'msw';

export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
          }
        }
      });
    }
    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; password: string };
    return HttpResponse.json({
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: body.name,
          email: body.email,
          role: 'user'
        }
      }
    });
  }),

  // Content endpoints
  http.get('/api/content', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';

    const mockContent = [
      {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5,
        category: 'Technology',
        featured: false,
        image_url: '/test-image.jpg'
      },
      {
        id: '2',
        title: 'Test Document',
        description: 'Test document description',
        content: 'Test document content',
        type: 'document',
        author_name: 'Test Author',
        created_at: '2024-01-02T00:00:00Z',
        views: 50,
        likes: 5,
        comments: 2,
        category: 'Business',
        featured: true,
        image_url: null
      }
    ];

    const filteredContent = type ? mockContent.filter(item => item.type === type) : mockContent;

    return HttpResponse.json({
      success: true,
      data: filteredContent,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / parseInt(limit))
      }
    });
  }),

  http.get('/api/content/:id', ({ params }) => {
    const { id } = params;
    const mockContent = {
      id,
      title: 'Test Article',
      description: 'Test description',
      content: 'Test content',
      type: 'article',
      author_name: 'Test Author',
      created_at: '2024-01-01T00:00:00Z',
      views: 100,
      likes: 10,
      comments: 5,
      category: 'Technology',
      featured: false,
      image_url: '/test-image.jpg'
    };

    return HttpResponse.json({
      success: true,
      data: mockContent
    });
  }),

  // Comments endpoints
  http.get('/api/comments', ({ request }) => {
    const url = new URL(request.url);
    const contentId = url.searchParams.get('contentId');
    
    const mockComments = [
      {
        id: '1',
        content_id: contentId,
        user_id: '1',
        text: 'Great article!',
        author_name: 'Test User',
        created_at: '2024-01-01T00:00:00Z',
        status: 'visible'
      },
      {
        id: '2',
        content_id: contentId,
        user_id: '2',
        text: 'Very informative',
        author_name: 'Another User',
        created_at: '2024-01-02T00:00:00Z',
        status: 'visible'
      }
    ];

    return HttpResponse.json({
      success: true,
      data: mockComments
    });
  }),

  http.post('/api/comments', async ({ request }) => {
    const body = await request.json() as { contentId: string; body: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: '3',
        content_id: body.contentId,
        user_id: '1',
        text: body.body,
        author_name: 'Test User',
        created_at: new Date().toISOString(),
        status: 'visible'
      }
    });
  }),

  // Search endpoints
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    const mockResults = [
      {
        id: '1',
        title: `Search result for ${query}`,
        description: 'Search result description',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5,
        category: 'Technology',
        featured: false
      }
    ];

    return HttpResponse.json({
      success: true,
      data: mockResults
    });
  }),

  // Image upload endpoints
  http.post('/api/images/upload', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return HttpResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        filename: 'test-image.webp',
        url: '/uploads/test-image.webp',
        metadata: {
          width: 800,
          height: 600,
          size: 50000,
          format: 'webp'
        }
      }
    });
  }),

  // Categories endpoints
  http.get('/api/categories', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: '1', name: 'Technology' },
        { id: '2', name: 'Business' },
        { id: '3', name: 'Design' }
      ]
    });
  }),

  // Tags endpoints
  http.get('/api/tags', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: '1', name: 'React' },
        { id: '2', name: 'TypeScript' },
        { id: '3', name: 'Node.js' }
      ]
    });
  }),

  // Bookmarks endpoints
  http.get('/api/user/bookmarks', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          content_id: '1',
          content: {
            id: '1',
            title: 'Bookmarked Article',
            type: 'article',
            author_name: 'Test Author'
          },
          bookmarked_at: '2024-01-01T00:00:00Z'
        }
      ]
    });
  }),

  http.post('/api/content/:id/bookmark', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      message: 'Bookmarked successfully'
    });
  }),

  http.delete('/api/content/:id/bookmark', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  })
];

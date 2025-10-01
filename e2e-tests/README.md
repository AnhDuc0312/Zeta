# Zeta CMS E2E Tests

Hệ thống test tự động toàn diện cho Zeta CMS, bao gồm E2E tests, API tests, và Performance tests.

## 🚀 Quick Start

### Cài đặt Dependencies

```bash
# Cài đặt dependencies cho E2E tests
cd e2e-tests
npm install

# Cài đặt Playwright browsers
npm run test:install
```

### Chạy Tests

```bash
# Chạy tất cả tests
npm run test

# Chạy tests với UI
npm run test:ui

# Chạy tests với browser hiển thị
npm run test:headed

# Chạy tests cụ thể
npm run test:auth      # Authentication tests
npm run test:content   # Content management tests
npm run test:admin     # Admin panel tests
npm run test:api       # API integration tests
npm run test:performance # Performance tests
```

## 📁 Cấu trúc Test

```
e2e-tests/
├── tests/
│   ├── auth.spec.ts           # Authentication flow tests
│   ├── content.spec.ts        # Content management tests
│   ├── admin.spec.ts          # Admin panel tests
│   ├── api.spec.ts            # API integration tests
│   ├── performance.spec.ts    # Performance tests
│   └── setup.ts               # Test setup và configuration
├── utils/
│   └── test-helpers.ts        # Test utilities và helpers
├── scripts/
│   └── setup-test-data.ts     # Test data setup scripts
├── playwright.config.ts       # Playwright configuration
└── package.json
```

## 🧪 Test Categories

### 1. Authentication Tests (`@auth`)
- User registration và login
- Password change functionality
- Session management
- Role-based access control
- Token expiration handling

### 2. Content Management Tests (`@content`)
- Content CRUD operations
- Search và filtering
- File upload
- Comments system
- Like và bookmark functionality
- Content validation

### 3. Admin Panel Tests (`@admin`)
- Admin dashboard
- User management
- Content moderation
- Analytics và reporting
- System settings
- Data export/import

### 4. API Integration Tests (`@api`)
- REST API endpoints
- Error handling
- Rate limiting
- Response time performance
- Data validation

### 5. Performance Tests (`@performance`)
- Page load times
- API response times
- Memory usage
- Concurrent user simulation
- Database query performance

## 🛠️ Test Utilities

### TestHelpers Class

Cung cấp các utility functions cho testing:

```typescript
// Authentication
await helpers.loginAsUser('email@example.com', 'password');
await helpers.loginAsAdmin();
await helpers.logout();

// Content management
await helpers.createContent('article', 'Title', 'Content');
await helpers.searchContent('query');
await helpers.uploadFile('path/to/file.pdf');

// Form handling
await helpers.fillForm({ 'field-name': 'value' });
await helpers.submitForm();

// Assertions
await helpers.expectSuccessMessage('Success!');
await helpers.expectErrorMessage('Error!');
await helpers.expectElementVisible('[data-testid="element"]');
```

## 🔧 Configuration

### Environment Variables

```bash
# Test environment
NODE_ENV=test
DATABASE_URL=postgres://user:pass@localhost:5432/zeta_cms_test
API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:8080

# Debug mode
DEBUG=true
```

### Test Data

Test data được tự động setup và cleanup:

```bash
# Setup test data
npm run setup:test-data

# Cleanup test data
npm run cleanup:test-data
```

## 📊 Test Reports

### HTML Report
```bash
npm run test:report
```

### JSON Report
Test results được lưu trong `test-results/results.json`

### Screenshots và Videos
- Screenshots: Chỉ khi test fail
- Videos: Chỉ khi test fail
- Traces: Khi retry test

## 🚀 CI/CD Integration

### GitHub Actions
Tests tự động chạy trên:
- Push to main/dev branches
- Pull requests
- Daily schedule (2 AM)

### Local Development
```bash
# Chạy tests trong development
npm run test:dev

# Chạy tests với debug mode
DEBUG=true npm run test
```

## 🐛 Debugging

### Debug Mode
```bash
DEBUG=true npm run test
```

### Debug Specific Test
```bash
npm run test:debug -- --grep "specific test name"
```

### Code Generation
```bash
npm run test:codegen
```

## 📈 Performance Monitoring

### Lighthouse Integration
```bash
npm run test:lighthouse
```

### Memory Usage
```bash
npm run test:memory
```

### Load Testing
```bash
npm run test:load
```

## 🔍 Test Coverage

### Frontend Coverage
- Component rendering
- User interactions
- State management
- API integration
- Error handling

### Backend Coverage
- API endpoints
- Database operations
- Authentication
- Authorization
- Error handling

### E2E Coverage
- Complete user flows
- Cross-browser compatibility
- Mobile responsiveness
- Performance metrics

## 📝 Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Tag tests with appropriate categories

### 2. Test Data
- Use consistent test data
- Clean up after each test
- Use factories for data creation

### 3. Assertions
- Use specific assertions
- Check both positive and negative cases
- Verify error messages

### 4. Performance
- Set reasonable timeouts
- Use waitForLoadState appropriately
- Monitor memory usage

## 🚨 Troubleshooting

### Common Issues

1. **Tests timeout**
   - Increase timeout in playwright.config.ts
   - Check if services are running

2. **Element not found**
   - Use data-testid attributes
   - Wait for elements to be visible

3. **API errors**
   - Check if backend is running
   - Verify database connection

4. **Browser issues**
   - Update Playwright browsers
   - Check browser compatibility

### Debug Commands

```bash
# Check test environment
npm run test:check

# Validate test configuration
npm run test:validate

# Run specific test file
npm run test -- tests/auth.spec.ts

# Run tests in specific browser
npm run test -- --project=chromium
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)
- [Debugging Guide](https://playwright.dev/docs/debug)


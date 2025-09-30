# Backend Test Suite

This directory contains comprehensive test suites for the backend API.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── controllers/         # Controller unit tests
│   ├── repositories/        # Repository unit tests
│   ├── services/           # Service unit tests
│   └── middleware/         # Middleware unit tests
├── integration/            # Integration tests
│   ├── api.test.ts         # API endpoint integration tests
│   ├── database.test.ts    # Database operation tests
│   ├── image.test.ts       # Image upload system tests
│   ├── error-handling.test.ts # Error handling tests
│   └── performance.test.ts # Performance and load tests
├── setup.ts               # Test setup and configuration
├── global-setup.ts        # Global test environment setup
├── global-teardown.ts     # Global test cleanup
├── sequencer.js           # Test execution order
└── README.md              # This file
```

## Test Types

### Unit Tests
- **Controllers**: Test individual controller functions with mocked dependencies
- **Repositories**: Test database operations with mocked database connections
- **Services**: Test business logic with mocked external dependencies
- **Middleware**: Test middleware functions with mocked request/response objects

### Integration Tests
- **API Tests**: Test complete API endpoints with real Express app
- **Database Tests**: Test database operations with real database connections
- **Image Tests**: Test image upload and processing functionality
- **Error Handling**: Test error scenarios and responses
- **Performance**: Test response times and concurrent request handling

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Reports
```bash
npm run test:coverage
```

### CI Mode
```bash
npm run test:ci
```

## Test Configuration

### Environment Variables
Tests use the following environment variables:
- `NODE_ENV=test`
- `DATABASE_URL`: Test database connection string
- `JWT_SECRET`: JWT secret for testing
- `JWT_EXPIRES_IN`: JWT expiration time
- `UPLOAD_DIR`: Test upload directory
- `MAX_FILE_SIZE`: Maximum file size for uploads
- `ALLOWED_FILE_TYPES`: Allowed file types for uploads

### Database Setup
- Tests use a separate test database
- Database is created automatically if it doesn't exist
- Test data is cleaned up after each test

### Mocking
- Database connections are mocked for unit tests
- External services are mocked where appropriate
- File system operations are mocked for image tests

## Test Data

### Mock Data
Tests use consistent mock data patterns:
- **Users**: Test users with various roles and permissions
- **Content**: Articles, documents, and notes with different states
- **Comments**: Comments and replies with different statuses
- **Categories**: Content categories for testing

### Test Scenarios
- **Happy Path**: Normal operation scenarios
- **Error Cases**: Error handling and edge cases
- **Edge Cases**: Boundary conditions and limits
- **Performance**: Load testing and response time validation

## Coverage Goals

- **Unit Tests**: 90%+ code coverage
- **Integration Tests**: 80%+ API endpoint coverage
- **Error Handling**: 100% error scenario coverage
- **Performance**: All critical paths tested

## Best Practices

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Clean up after each test

### Mocking
- Mock external dependencies
- Use realistic mock data
- Verify mock interactions
- Reset mocks between tests

### Assertions
- Use specific assertions
- Test both success and failure cases
- Verify error messages and status codes
- Check response structure and content

### Performance
- Set reasonable timeouts
- Test concurrent operations
- Monitor memory usage
- Validate response times

## Debugging Tests

### Running Individual Tests
```bash
npm test -- --testNamePattern="specific test name"
```

### Running Tests in Specific Files
```bash
npm test -- tests/unit/controllers/authController.test.ts
```

### Debug Mode
```bash
npm test -- --detectOpenHandles --verbose
```

### Coverage Details
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

## Continuous Integration

### GitHub Actions
Tests run automatically on:
- Pull requests
- Pushes to main branch
- Scheduled runs

### Test Reports
- Coverage reports generated
- Test results published
- Performance metrics tracked

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure test database is running
2. **Port Conflicts**: Check for port conflicts in test environment
3. **File Permissions**: Ensure test directories are writable
4. **Memory Issues**: Increase Node.js memory limit if needed

### Debug Commands
```bash
# Check test database connection
psql $TEST_DATABASE_URL -c "SELECT 1"

# Check test upload directory
ls -la /tmp/test-uploads

# Run tests with debug output
npm test -- --verbose --detectOpenHandles
```

## Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Follow existing naming conventions
3. Include both positive and negative test cases
4. Add proper cleanup and teardown
5. Update this README if needed

### Test Standards
- All tests must pass
- Code coverage must not decrease
- Performance tests must meet benchmarks
- Error handling must be comprehensive

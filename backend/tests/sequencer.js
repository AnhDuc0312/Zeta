import Sequencer from '@jest/test-sequencer';

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Define test order: unit tests first, then integration tests
    const unitTests = tests.filter(test => 
      test.path.includes('unit') || 
      test.path.includes('__tests__') ||
      (!test.path.includes('integration') && !test.path.includes('e2e'))
    );
    
    const integrationTests = tests.filter(test => 
      test.path.includes('integration')
    );
    
    const e2eTests = tests.filter(test => 
      test.path.includes('e2e')
    );
    
    // Order: unit -> integration -> e2e
    return [...unitTests, ...integrationTests, ...e2eTests];
  }
}

export default CustomSequencer;

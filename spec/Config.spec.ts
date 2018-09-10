import container from '../src/di/DependencyGraph';

import Config from '@config/Config';

describe('Config', () => {
  const config = container.cradle.config as Config;

  describe('#has', () => {
    it('works', () => {
      expect(config.has('token')).toBeTruthy();
      expect(config.has('gibberish')).toBeFalsy();
    });
  });
});

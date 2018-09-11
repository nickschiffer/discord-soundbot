import fs from 'fs';

import container from '../src/di/DependencyGraph';

import Config from '@config/Config';

describe('Config', () => {
  const config = container.cradle.config as Config;

  describe('#has', () => {
    describe('when attribute exists', () => {
      it('returns true', () => {
        expect(config.has('token')).toEqual(true);
      });
    });

    describe('when attribute does not exist', () => {
      it('returns false', () => {
        expect(config.has('gibberish')).toEqual(false);
      });
    });
  });

  describe('#set', () => {
    beforeAll(() => {
      Object.defineProperty(config, 'CONFIG_PATH', { value: './config/config.test.json' });
    });

    describe('when attribute does not exist', () => {
      it('does nothing', () => {
        config.set('gibberish', ['gibberish']);
        expect(config.gibberish).toBeUndefined();
      });
    });

    describe('when attribute in BLACKLIST', () => {
      it('does nothing', () => {
        const oldToken = config.token;
        config.set('token', ['gibberish']);
        expect(config.token).toEqual(oldToken);
      });
    });

    describe('when attribute is accepted', () => {
      describe('when attribute is string', () => {
        it('sets the attribute', () => {
          config.set('language', ['de', 'other', 'test']);
          expect(config.language).toEqual('de');
        });
      });

      describe('when attribute is number', () => {
        it('sets the attribute', () => {
          config.set('volume', ['0.75', 'other', 'test']);
          expect(config.volume).toEqual(0.75);
        });
      });

      describe('when attribute is boolean', () => {
        it('sets the attribute', () => {
          config.set('deafen', ['true', 'other', 'test']);
          expect(config.deafen).toEqual(true);
          config.set('deafen', ['something_else']);
          expect(config.deafen).toEqual(false);
        });
      });

      describe('when attribute is array', () => {
        it('sets the attribute', () => {
          const value = ['true', 'other', 'test'];
          config.set('acceptedExtensions', value);
          expect(config.acceptedExtensions).toEqual(value);
        });
      });

      it('writes to file', () => {
        config.set('language', ['de']);
        expect(fs.existsSync('./config/config.test.json')).toEqual(true);
      });
    });
  });
});

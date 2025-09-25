import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: resolve(__dirname, '../../.env') });

// Configuración global de Chai
chai.use(chaiAsPromised);
global.expect = chai.expect;
global.assert = chai.assert;

console.log('Test setup completed');
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  require: ['@babel/register'],
  spec: 'src/test/**/*.test.js',
  timeout: 10000,
  exit: true,
  nodeOption: ['experimental-vm-modules']
};
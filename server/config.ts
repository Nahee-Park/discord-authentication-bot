import { CLIENT_SECRET, CLIENT_ID, PORT } from './env';
import dotenv from 'dotenv';

dotenv.config();

export default {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  port: PORT,
};

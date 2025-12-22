import cron from 'node-cron';

import { User } from '../models/user.model.js';
import logger from './logger.js';

export function startSessionCleanup() {
    cron.schedule('0 2 * * *', async () => {
        try {
            const res = await User.updateMany(
                { 'sessions.expiresAt': { $lt: new Date() } },
                {$pull:{sessions:{expiresAt:{$lt:new Date()}}}}
            )
            logger.info(`Cleaned ${res.modifiedCount} user sessions`);
            
        } catch (error) {
            logger.error('Session cleanup failed',error)
        }
    })
}
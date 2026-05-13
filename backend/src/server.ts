import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

const startServer = () => {
  const port = config.app.port;

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`Environment: ${config.app.env}`);
    logger.info(`Health check: http://localhost:${port}/health`);
  });
};

startServer();

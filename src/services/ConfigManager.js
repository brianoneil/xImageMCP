import fs from 'fs/promises';
import path from 'path';

/**
 * Service class for managing configuration settings
 */
class ConfigManager {
  /**
   * @param {string} configPath - Path to the configuration file
   */
  constructor(configPath) {
    this.configPath = configPath;
    this.config = null;
  }

  /**
   * Load configuration from file
   * @returns {Promise<Object>} Configuration object
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      return this.config;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If config file doesn't exist, create default config
        this.config = this.getDefaultConfig();
        await this.saveConfig();
        return this.config;
      }
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  /**
   * Save current configuration to file
   * @returns {Promise<void>}
   */
  async saveConfig() {
    try {
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        'utf8'
      );
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }

  /**
   * Get default configuration
   * @returns {Object} Default configuration object
   */
  getDefaultConfig() {
    return {
      outputDirectory: path.join(process.cwd(), 'output'),
      defaultFormat: 'jpeg',
      quality: 80,
      preserveMetadata: true
    };
  }

  /**
   * Update configuration with new values
   * @param {Object} newConfig - New configuration values
   * @returns {Promise<Object>} Updated configuration
   */
  async updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    await this.saveConfig();
    return this.config;
  }
}

export { ConfigManager }; 
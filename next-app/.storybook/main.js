/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: ['../app/**/*.mdx', '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  staticDirs: ['..\\public'],

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}
export default config

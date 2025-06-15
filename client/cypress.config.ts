import { defineConfig } from 'cypress'

export default defineConfig({

  e2e: {
    baseUrl: 'http://localhost:4200', // make sure your Angular app runs here
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners if needed
    }
  },
  
  
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }
  
})
describe('Root Path Redirection', () => {
  it('should redirect from / to /login if not authenticated', () => {
    cy.visit('/'); // Visit the root URL

    // Verify redirection
    cy.url().should('include', '/login');
  });
});

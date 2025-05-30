describe('Boats Overview', () => {
  it('Should list boats after login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@test.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/overview');
    cy.contains('Boats');
  });
});

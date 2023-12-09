
describe('App starts properly', function () {
  it('should be available on localhost:3000', function () {
    cy.visit('http://localhost:3000');
  });
}); 
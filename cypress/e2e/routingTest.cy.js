import { ROUTES } from '../../src/constants/routes';

describe('Routing works properly', function () {
  beforeEach(() => {
    cy.visit(ROUTES.HOME); // Visiting the HOME route
  });

  it('should be available on localhost:3000', function () {
    cy.visit(ROUTES.HOME); // Visit the HOME route
  });

  // Refactored tests using ROUTES constant
  it('should route to the recursion page', function () {
    cy.get(`[href="${ROUTES.STRING}"] > .main-page_card__Atkcu`).click();
    cy.url().should('include', ROUTES.STRING);
  });

  it('should route to the fibonacci page', function () {
    cy.get(`[href="${ROUTES.FIBONACCI}"] > .main-page_card__Atkcu`).click();
    cy.url().should('include', ROUTES.FIBONACCI);
  });

  it('should route to the sorting page', function () {
    cy.get(`[href="${ROUTES.SORTING}"] > .main-page_card__Atkcu`).click();
    cy.url().should('include', ROUTES.SORTING);
  });

  it('should route to the stack page', function () {
    cy.get(`[href="${ROUTES.STACK}"] > .main-page_card__Atkcu`).click();
    cy.url().should('include', ROUTES.STACK);
  });

  it('should route to the queue page', function () {
    cy.get(`[href="${ROUTES.QUEUE}"] > .main-page_card__Atkcu`).click();
    cy.url().should('include', ROUTES.QUEUE);
  });

  it('should route to the list page', function () {
    cy.get(`[href="${ROUTES.LINKED_LIST}"] > .main-page_card__Atkcu`).click();
    cy.url().should('include', ROUTES.LINKED_LIST);
  });

});

import { ROUTES, testURL } from '../../src/constants/routes';
import { MAIN_PAGE_CARD } from '../../src/constants/cypress-selectors';

describe('Routing works properly', function () {
  beforeEach(() => {
    cy.visit(`${testURL}${ROUTES.HOME}`);
  });

  it('should be available on home page', function () {
    cy.visit(`${testURL}${ROUTES.HOME}}`);
  });

  it('should route to the recursion page', function () {
    cy.get(`[href*="${ROUTES.STRING}"] > ${MAIN_PAGE_CARD}`).click();
    cy.url().should('include', ROUTES.STRING);
  });

  it('should route to the fibonacci page', function () {
    cy.get(`[href*="${ROUTES.FIBONACCI}"] > ${MAIN_PAGE_CARD}`).click();
    cy.url().should('include', ROUTES.FIBONACCI);
  });

  it('should route to the sorting page', function () {
    cy.get(`[href*="${ROUTES.SORTING}"] > ${MAIN_PAGE_CARD}`).click();
    cy.url().should('include', ROUTES.SORTING);
  });

  it('should route to the stack page', function () {
    cy.get(`[href*="${ROUTES.STACK}"] > ${MAIN_PAGE_CARD}`).click();
    cy.url().should('include', ROUTES.STACK);
  });

  it('should route to the queue page', function () {
    cy.get(`[href*="${ROUTES.QUEUE}"] > ${MAIN_PAGE_CARD}`).click();
    cy.url().should('include', ROUTES.QUEUE);
  });

  it('should route to the list page', function () {
    cy.get(`[href*="${ROUTES.LINKED_LIST}"] > ${MAIN_PAGE_CARD}`).click();
    cy.url().should('include', ROUTES.LINKED_LIST);
  });

});

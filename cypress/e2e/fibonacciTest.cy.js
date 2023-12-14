
import { getFibonacciNumbers } from '../../src/components/fibonacci-page/utils';
import { MAX_INPUT_VALUE } from "../../src/constants/fibonacci";
import { ROUTES, testURL } from "../../src/constants/routes";
import { CIRCLES } from "../../src/constants/cypress-selectors";



describe('FibonacciPage functions properly', () => {
  beforeEach(() => {
    cy.visit(`${testURL}${ROUTES.FIBONACCI}`);
  });

  it('should disable the button when input is empty', () => {
    cy.get('form#fib input[type="number"]').should('have.value', '');
    cy.get('form#fib button').should('be.disabled');
  });

  it('should generate numbers correctly', () => {
    const inputValue = Math.floor(Math.random() * MAX_INPUT_VALUE) + 1;
    const expectedRes = getFibonacciNumbers(inputValue)

    cy.get('form#fib input[type="number"]').type(inputValue);
    cy.contains('button', "Рассчитать").click();

    cy.get(CIRCLES).as('circles');

    expectedRes.forEach((item, index) => {
      // Check for rendering correctness
      cy.get('@circles').eq(index).should('have.text', item);
    });
  });
});

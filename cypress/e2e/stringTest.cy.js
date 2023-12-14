import { stringSort, getColorClass } from "../../src/components/string/utils";
import { generateRandomString } from "../../src/utils/generate-random-string";
import { MAX_LENGTH } from "../../src/constants/string";
import { ROUTES } from "../../src/constants/routes";
import { CIRCLES } from "../../src/constants/cypress-selectors";

describe('stringPage functions properly', () => {
  beforeEach(() => {
    cy.visit(`http://localhost:3000/#${ROUTES.STRING}`);
  });

  it('should disable the button when input is empty', () => {
    cy.get('form#string input[type="text"]').should('have.value', '');
    cy.get('form#string button').should('be.disabled');
  });

  it('should reverse string and animate correctly', () => {
    const inputValue = generateRandomString(Math.floor(Math.random() * MAX_LENGTH) + 1);
    const expectedRes = stringSort(inputValue);

    cy.get('form#string input[type="text"]').type(inputValue);
    cy.get('form#string button').click();

      expectedRes.forEach((step, stepIndex) => {
      cy.get(CIRCLES).as('circles');

      step.forEach((_, circleIndex) => {
        // Check for text correctness
        cy.get('@circles').eq(circleIndex).should('have.text', step[circleIndex]);

        // Check for correct circle color
        const expectedState = getColorClass(circleIndex, stepIndex, step.length - stepIndex - 1);
        cy.get('@circles').eq(circleIndex)
          .invoke('attr', 'class')
          .should('include', expectedState);
      });
    });
  });
});


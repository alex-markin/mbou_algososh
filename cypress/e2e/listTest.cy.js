
import { INPUT_LENGTH, INITIAL_VALUES } from "../../src/constants/list";
import { ElementStates } from "../../src/types/element-states"
import { generateRandomString } from '../../src/utils/generate-random-string';
import { generateRandomNumber } from '../../src/utils/generate-random-number';
import { LinkedList } from '../../src/components/list-page/linked-list';
import { ROUTES, testURL } from "../../src/constants/routes";
import { CIRCLES } from "../../src/constants/cypress-selectors";


describe('listPage functions properly', () => {

  const linkedList = new LinkedList();

  beforeEach(() => {
    cy.visit(`${testURL}${ROUTES.LINKED_LIST}`);
  });


  it('should disable buttons when valueInput or/and indexInput is empty', () => {
    cy.get('form#linkedList').get('fieldset#valueInputFieldset').within(() => {
      cy.get('input[type="text"]').should('have.value', '');
      cy.get('button[type="submit"]').should('be.disabled');
    });

    cy.get('form#linkedList').get('fieldset#indexInputFieldset').within(() => {
      cy.get('input[type="number"]').should('have.value', '');
      cy.get('button').should('be.disabled');
    });
  });


  it('should render initial list correctly', () => {
    cy.get(CIRCLES).as('circles');

    // add initial values to linked list
    resetList(linkedList, INITIAL_VALUES);

    // check for rendering correctness
    linkedList.getItems().forEach((item, index) => {
      cy.get('@circles').eq(index).should('have.text', item);
    });
  });


  it('should add an element to the head correctly', () => {

    resetList(linkedList, INITIAL_VALUES);
    const inputValue = generateRandomString(Math.floor(Math.random() * INPUT_LENGTH) + 1)

    cy.get('input[type="text"]').type(inputValue);
    cy.contains('button', 'Добавить в head').click();
    linkedList.prepend(inputValue);

    cy.get(CIRCLES).as('circles');

    // check for animation correctness
    cy.get('@circles').eq(0).as('firstCircle');
    cy.get('@circles').eq(0).as('secondCircle');

    cy.get('@secondCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@firstCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@firstCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@firstCircle').invoke('attr', 'class').should('include', ElementStates.Modified);
    cy.get('@firstCircle').invoke('attr', 'class').should('include', ElementStates.Default);
    cy.get('@firstCircle').should('have.text', inputValue);
    cy.get('@secondCircle').invoke('attr', 'class').should('include', ElementStates.Default);



    // check for rendering correctness
    cy.get('@circles').each((circle, index) => {
      cy.wrap(circle).should('have.text', linkedList.getItems()[index]);
    });
  });


  it('should add an element to the tail correctly', () => {
    resetList(linkedList, INITIAL_VALUES);
    const inputValue = generateRandomString(Math.floor(Math.random() * INPUT_LENGTH) + 1)

    cy.get('input[type="text"]').type(inputValue);
    cy.contains('button', 'Добавить в tail').click();
    linkedList.append(inputValue);
    const expectedRes = linkedList.getItems();

    cy.get(CIRCLES).as('circles');

    // check for animation correctness
    cy.get('@circles').last().as('lastCircle')
    cy.get('@circles').eq(-2).as('prevLastCircle');

    cy.get('@prevLastCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@lastCircle').invoke('attr', 'class').should('include', ElementStates.Changing)
    cy.get('@lastCircle').invoke('attr', 'class').should('include', ElementStates.Modified)
    cy.get('@lastCircle').invoke('attr', 'class').should('include', ElementStates.Default)
    cy.get('@lastCircle').should('have.text', inputValue)
    cy.get('@prevLastCircle').invoke('attr', 'class').should('include', ElementStates.Default);


    // check for rendering correctness
    cy.get('@circles').each((circle, index) => {
      cy.wrap(circle).should('have.text', expectedRes[index]);
    });
  });


  it('should remove an element from the head correctly', () => {
    resetList(linkedList, INITIAL_VALUES);

    cy.contains('button', 'Удалить из head').click();
    const deletedElement = linkedList.deleteHead().value;
    const expectedRes = linkedList.getItems();


    cy.get(CIRCLES).as('circles');

    // check for animation correctness
    cy.get('@circles').get('[class*="circle_small"]').as('firstCircle');
    cy.get('@circles').not('[class*="circle_small"]').eq(0).as('secondCircle');

    cy.get('@firstCircle').should('have.text', deletedElement);
    cy.get('@firstCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@secondCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@secondCircle').invoke('attr', 'class').should('include', ElementStates.Default);

    // check for rendering correctness
    expectedRes.forEach((item, index) => {
      cy.get('@circles').eq(index).should('have.text', item);
    });
  });


  it('should remove an element from the tail correctly', () => {
    resetList(linkedList, INITIAL_VALUES);

    cy.contains('button', 'Удалить из tail').click();
    const deletedElement = linkedList.deleteTail().value;
    const expectedRes = linkedList.getItems();


    cy.get(CIRCLES).as('circles');

    // check for animation correctness
    cy.get('@circles').get('[class*="circle_small"]').as('firstCircle');
    cy.get('@circles').not('[class*="circle_small"]').eq(-1).as('secondCircle');

    cy.get('@firstCircle').should('have.text', deletedElement);
    cy.get('@firstCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@secondCircle').invoke('attr', 'class').should('include', ElementStates.Changing);
    cy.get('@secondCircle').invoke('attr', 'class').should('include', ElementStates.Default);


    // check for rendering correctness
    expectedRes.forEach((item, index) => {
      cy.get('@circles').eq(index).should('have.text', item);
    });
  });

  it('should add an element to the index correctly', () => {
    resetList(linkedList, INITIAL_VALUES);

    const inputValue = generateRandomString(Math.floor(Math.random() * INPUT_LENGTH) + 1);
    const length = linkedList.getItems().length - 1;
    const inputIndex = generateRandomNumber(0, length);

    cy.get('input[type="text"]').type(inputValue);
    cy.get('input[type="number"]').type(inputIndex);
    cy.contains('button', 'Добавить по индексу').click();

    linkedList.insertAt(inputValue, inputIndex);
    const expectedRes = linkedList.getItems();

    // check for animation correctness
    cy.get('[class*="list-page_outputBlock"]').get('[class*="circle_circle"]').as('circles');
    cy.get('@circles').get('[class*="circle_small"]').as('headCircle');
    cy.get('@circles').not('[class*="circle_small"]').as('mainCircles');


    cy.get('@mainCircles').each((circle, index) => {
      if (index <= inputIndex) {
        cy.wrap(circle)
          .invoke('attr', 'class')
          .should('include', ElementStates.Changing)
      }

      cy.get('@headCircle')
        .should('have.text', inputValue)
        .invoke('attr', 'class')
        .should('include', ElementStates.Changing);
    });

    // check for rendering correctness
    cy.get('@circles').each((circle, index) => {
      cy.wrap(circle).should('have.text', expectedRes[index]);
    });
  });


  it('should delete an element from the index correctly', () => {
    resetList(linkedList, INITIAL_VALUES);

    const length = linkedList.getItems().length - 1;
    const inputIndex = generateRandomNumber(0, length);

    cy.get('input[type="number"]').type(inputIndex);
    cy.contains('button', 'Удалить по индексу').click();

    const deletedElement = linkedList.deleteAt(inputIndex).value;
    const expectedRes = linkedList.getItems();

    // check for animation correctness
    cy.get(CIRCLES).as('circles');
    cy.get('@circles').not('[class*="circle_small"]').as('mainCircles');

    cy.get('@mainCircles').each((circle, index) => {
      if (index <= inputIndex) {
        cy.wrap(circle)
          .invoke('attr', 'class')
          .should('include', ElementStates.Changing)
      }

    });

    cy.get('@circles').get('[class*="circle_small"]').as('headCircle');
    cy.get('@headCircle')
      .should('have.text', deletedElement)
      .invoke('attr', 'class')
      .should('include', ElementStates.Changing);

    // check for rendering correctness
    expectedRes.forEach((item, index) => {
      cy.get('@circles').eq(index).should('have.text', item);
    });
  });

});



// function to reset the initial list every test
const resetList = (list, initialValues) => {
  list.clean();
  for (let i = 0; i < initialValues.length; i++) {
    list.append(initialValues[i]);
  }
}
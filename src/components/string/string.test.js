import React from 'react';
import { render, screen, fireEvent, toBe } from '@testing-library/react';
import { stringSort } from './utils';

describe('String sort', () => {
  it('should correctly reverse even length strings', () => {
    const inputString = 'abcd';
    const expectedSteps = [
      ['a', 'b', 'c', 'd'],
      ['d', 'b', 'c', 'a'],
      ['d', 'c', 'b', 'a'],
    ];
    const steps = stringSort(inputString);
    expect(steps).toEqual(expectedSteps);
  });

  it('should correctly reverse a string with an odd number of characters', () => {
    const inputString = 'abcde';
    const expectedSteps = [
      ['a', 'b', 'c', 'd', 'e'],
      ['e', 'b', 'c', 'd', 'a'],
      ['e', 'd', 'c', 'b', 'a'],
    ];
    const steps = stringSort(inputString);
    expect(steps).toEqual(expectedSteps);
  });

  it('should return the same single-character string', () => {
    const inputString = 'a';
    const expectedSteps = [['a']];
    const steps = stringSort(inputString);
    expect(steps).toEqual(expectedSteps);
  });

  it('should return an empty array for an empty string', () => {
    const inputString = '';
    const expectedSteps = [[]];
    const steps = stringSort(inputString);
    expect(steps).toEqual(expectedSteps);
  });

});

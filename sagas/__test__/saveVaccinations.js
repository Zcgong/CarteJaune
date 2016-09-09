import { expect } from 'chai';
import { call, take, put, select } from 'redux-saga/effects';
import {
  executeSaveVaccinations,
  saveVaccinations,
  watchAddVaccination,
} from '../saveVaccinations';
import { ADD_VACCINATION } from '../../constants/actions';
import addVaccinationSuccess from '../../actions/addVaccinationSuccess';
import addVaccinationFailure from '../../actions/addVaccinationFailure';
import vaccinationsSelector from '../../selectors/vaccinations';

describe('saveVaccination', () => {
  describe('watchAddVaccination', () => {
    it('waits for the ADD_VACCINATION action', () => {
      const generator = watchAddVaccination();
      const takeValue = generator.next().value;
      expect(takeValue).to.deep.equal(take(ADD_VACCINATION));
    });
  });

  describe('saveVaccination', () => {
    it('saves the vaccinations to the store and triggers addVaccinationSuccess', () => {
      const generator = saveVaccinations();
      const selectValue = generator.next().value;
      expect(selectValue).to.deep.equal(select(vaccinationsSelector));
      const callValue = generator.next({ 1: 2 }).value;
      expect(callValue).to.deep.equal(call(executeSaveVaccinations, { 1: 2 }));
      const putValue = generator.next().value;
      expect(putValue).to.deep.equal(put(addVaccinationSuccess()));
    });

    it('triggers addVaccinationFailure in case an error occures', () => {
      const generator = saveVaccinations();
      generator.next();
      const value = generator.throw({ error: 'saving failed' }).value;
      expect(value).to.deep.equal(put(addVaccinationFailure()));
    });
  });
});

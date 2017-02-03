import React from 'react';
import FormFieldRadioButtons from './FormFieldRadioButtons';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

let fieldLabel = 'test',
    fieldName = 'test',
    fieldValues = ['One', 'Two'];

test('Should render', () => {
  
  const updateFn = jest.fn();
  const component = renderer.create(
    <FormFieldRadioButtons fieldLabel={fieldLabel} fieldName={fieldName} fieldValues={fieldValues} onUpdateField={updateFn} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should call update function on change', () => {

  const updateFn = jest.fn();
  const radio = shallow(
    <FormFieldRadioButtons fieldLabel={fieldLabel} fieldName={fieldName} fieldValues={fieldValues} onUpdateField={updateFn} />
  );

  radio.find('input').first().simulate('change');

  expect(updateFn).toHaveBeenCalledTimes(1);
});

import React from 'react';
import FormFieldTextInput from './FormFieldTextInput';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

let fieldLabel = 'test',
    fieldName = 'test',
    fieldValue= 'test';

test('Should render', () => {
  const component = renderer.create(
    <FormFieldTextInput fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should call update function on change', () => {

  const updateFn = jest.fn();
  const input = shallow(
    <FormFieldTextInput fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} onUpdateField={updateFn} />
  );

  input.find('input').simulate('change');

  expect(updateFn).toHaveBeenCalledTimes(1);
});

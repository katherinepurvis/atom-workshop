import React from 'react';
import Modal from './Modal';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

test('Should render null when closed', () => {
  const component = renderer.create(
    <Modal isOpen={false}><div>Modal Contents</div></Modal>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should render contents when open', () => {
  const component = renderer.create(
    <Modal isOpen={true}><div>Modal Contents</div></Modal>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should call dismiss function when close clicked', () => {

  const dismissFn = jest.fn();
  const modal = shallow(
    <Modal isOpen={true} dismiss={dismissFn}>
      <div>Modal Contents</div>
    </Modal>
  );
  modal.find('.modal__dismiss').simulate('click');
  expect(dismissFn).toHaveBeenCalledTimes(1);
});

test('Should call dismiss function when background clicked', () => {

  const dismissFn = jest.fn();
  const modal = shallow(
    <Modal isOpen={true} dismiss={dismissFn}>
      <div>Modal Contents</div>
    </Modal>
  );
  modal.find('.modal').simulate('click');
  expect(dismissFn).toHaveBeenCalledTimes(1);
});

test('Should not call dismiss function when content clicked', () => {

  const dismissFn = jest.fn();
  const modal = shallow(
    <Modal isOpen={true} dismiss={dismissFn}>
      <div>Modal Contents</div>
    </Modal>
  );
  modal.find('.modal__content').simulate('click', { stopPropagation() {} });
  expect(dismissFn).not.toHaveBeenCalled();
});

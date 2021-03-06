import Vuex from 'vuex';
import { createLocalVue, shallow } from '@vue/test-utils';

import { mapMultiRowFields, getField, updateField } from '../src';

const localVue = createLocalVue();

localVue.use(Vuex);

describe(`Component initialized with multi row setup.`, () => {
  let Component;
  let store;
  let wrapper;

  beforeEach(() => {
    Component = {
      template: `
        <div>
          <div v-for="user in users">
            <input v-model="user.name">
            <input v-model="user.email">
          </div>
        </div>
      `,
      computed: {
        ...mapMultiRowFields([`users`]),
      },
    };

    store = new Vuex.Store({
      state: {
        users: [
          {
            name: `Foo`,
            email: `foo@foo.com`,
          },
          {
            name: `Bar`,
            email: `bar@bar.com`,
          },
        ],
      },
      getters: {
        getField,
      },
      mutations: {
        updateField,
      },
    });

    wrapper = shallow(Component, { localVue, store });
  });

  test(`It should render the component.`, () => {
    expect(wrapper.exists()).toBe(true);
  });

  test(`It should update field values when the store is updated.`, () => {
    store.state.users[0].name = `New Name`;
    store.state.users[1].email = `new@email.com`;

    expect(wrapper.find(`input`).element.value).toBe(`New Name`);
    expect(wrapper.find(`div:nth-child(2) input:nth-child(2)`).element.value).toBe(`new@email.com`);
  });

  test(`It should update the store when the field values are updated.`, () => {
    wrapper.find(`input`).element.value = `New Name`;
    wrapper.find(`input`).trigger(`input`);

    wrapper.find(`div:nth-child(2) input:nth-child(2)`).element.value = `new@email.com`;
    wrapper.find(`div:nth-child(2) input:nth-child(2)`).trigger(`input`);

    expect(store.state.users[0].name).toBe(`New Name`);
    expect(store.state.users[1].email).toBe(`new@email.com`);
  });
});

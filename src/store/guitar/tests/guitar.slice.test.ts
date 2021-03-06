import guitarReducer, { setGuitarsCount } from '../guitar.slice';
import { FetchDataStatus } from '../../../constants';
import { generateGuitarItem } from '../../../utils/mocks';
import { fetchGuitarsWithParams } from '../guitar.async';

import type { GuitarSliceState } from '../../../types/state';

describe('Reducer: guitarReducer', () => {
  test('should return initial state when get empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = guitarReducer(initialState, action);

    expect(result).toEqual({
      items: [],
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 0,
    });
  });
  test('should set fetch status while pending action', () => {
    const action = { type: fetchGuitarsWithParams.pending.type, meta: { requestId: 'fakeId' } };
    const initialState: GuitarSliceState = {
      items: [],
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 0,
    };

    const state = guitarReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 0,
      items: [],
      currentRequestId: 'fakeId',
    });
  });
  test('should set fetch status while fulfilled action', () => {
    const fakeGuitars = [generateGuitarItem(), generateGuitarItem()];
    const action = {
      type: fetchGuitarsWithParams.fulfilled.type,
      payload: fakeGuitars,
      meta: { requestId: 'fakeId' },
    };
    const initialState: GuitarSliceState = {
      items: [],
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 0,
      currentRequestId: 'fakeId',
    };

    const state = guitarReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      status: FetchDataStatus.Success,
      items: fakeGuitars,
      currentRequestId: undefined,
    });
  });
  test('should set fetch status while rejected action', () => {
    const action = { type: fetchGuitarsWithParams.rejected.type, meta: { requestId: 'fakeId' } };
    const initialState: GuitarSliceState = {
      items: [],
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 0,
      currentRequestId: 'fakeId',
    };

    const state = guitarReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      status: FetchDataStatus.Failed,
      items: [],
      currentRequestId: undefined,
    });
  });
  test('should set guitar count when get setGuitarsCount action', () => {
    const initialState = undefined;
    const action = setGuitarsCount(10);
    const result = guitarReducer(initialState, action);

    expect(result).toEqual({
      items: [],
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 10,
    });
  });
  test('should overwrite guitar count when get setGuitarsCount action if there is already a guitar count', () => {
    const initialState = {
      items: [],
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 10,
    };
    const action = setGuitarsCount(999);
    const result = guitarReducer(initialState, action);

    expect(result).toEqual({
      items: [],
      status: FetchDataStatus.Idle,
      guitarsTotalCount: 999,
    });
  });
});

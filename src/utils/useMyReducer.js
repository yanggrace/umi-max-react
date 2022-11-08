import {useReducer} from 'react';

function useMyReducer(initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  function mySetState(data = {}) {
    dispatch({
      type: 'setState',
      data: {
        ...data,
      },
    });
  }
  return [state, mySetState];
}

function reducer(state, {data, type}) {
  switch (type) {
    case 'setState':
      return {
        ...state,
        ...data,
      };
    default:
      return state;
  }
}
export default useMyReducer;

const debug = require("debug")("ReduxAllIsList:Create")

import { map, hasWith } from "@codemachiner/m"

/**
 * Call API to create a new item, dispatch events before and after
 *
 * @param  {Function}  dispatch         Redux dispatch function
 * @param  {Function}  apiMethod        API interaction functions
 * @param  {string}    actionStartName  Action name to dispatch before API
 * @param  {string}    actionEndName    Action name to dispatch after API
 *
 * @return {Object}
 */
export const createAction = ({
  dispatch,
  apiMethod,
  actionStartName,
  actionEndName,
}) => async (...args) => {
  dispatch({
    type: actionStartName,
  })

  const item = await apiMethod(...args)

  dispatch({
    type: actionEndName,
    payload: {
      item,
    },
  })

  return item
}

/**
 * Modify state to indicate an item is being created
 *
 * @param {Object}  state  Old state
 *
 * @return {Object} New state
 */
export const createStartReducer = state => ({
  ...state,
  isCreating: true,
})

/**
 * Add newly created item to list
 *
 * @param  {Object}  state      Old state
 * @param  {Object}  arg2       The argument 2
 * @param  {Object}  arg2.item  Newly created item
 *
 * @return {Object} New state
 */
export const createEndReducer = (state, { item }) => {
  const exists = hasWith({ id: item.id })(state.items)

  exists &&
    debug("createEndReducer: element ID already exists ... replacing", {
      item,
      items: state.items,
    })

  return {
    ...state,
    items: exists
      ? state.items
        |> map(itemsMapElm => (itemsMapElm.id === item.id ? item : itemsMapElm))
      : [...state.items, item],
    isCreating: false,
  }
}
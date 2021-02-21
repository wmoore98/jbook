import produce from "immer";
import { ActionType } from "../action-types";
import {
  Action,
  DeleteCellAction,
  InsertCellBeforeAction,
  MoveCellAction,
  UpdateCellAction,
} from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      handleUpdateCell(state, action);
      break;
    case ActionType.DELETE_CELL:
      handleDeleteCell(state, action);
      break;
    case ActionType.MOVE_CELL:
      handleMoveCell(state, action);
      break;
    case ActionType.INSERT_CELL_BEFORE:
      handleInsertCellBefore(state, action);
      break;
    default:
      break;
  }
  return state;
});

export default reducer;

function handleUpdateCell(
  draft: CellsState,
  { payload: { id, content } }: UpdateCellAction
) {
  draft.data[id].content = content;
}

function handleDeleteCell(draft: CellsState, action: DeleteCellAction) {
  const idToDelete = action.payload;
  delete draft.data[idToDelete];
  draft.order = draft.order.filter((id) => id !== idToDelete);
}

function handleMoveCell(
  draft: CellsState,
  { payload: { id: payloadId, direction } }: MoveCellAction
) {
  const index = draft.order.findIndex((id) => id === payloadId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex > draft.order.length - 1) {
    return;
  }

  [draft.order[index], draft.order[targetIndex]] = [
    draft.order[targetIndex],
    draft.order[index],
  ];
}

function handleInsertCellBefore(
  draft: CellsState,
  { payload: { id: beforeId, type } }: InsertCellBeforeAction
) {
  const cell: Cell = {
    content: "",
    type,
    id: randomId(draft.data),
  };

  draft.data[cell.id] = cell;

  const index = draft.order.findIndex((id) => id === beforeId);
  if (index < 0) {
    draft.order.push(cell.id);
  } else {
    draft.order.splice(index, 0, cell.id);
  }
}

function randomId(data: { [key: string]: Cell }): string {
  let id: string;
  do {
    id = Math.random().toString(36).substr(2, 5);
  } while (data[id]);
  return id;
}

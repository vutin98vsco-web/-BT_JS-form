import { configureStore, createSlice } from '@reduxjs/toolkit';

export const initialStudents = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0938111111', email: 'nguyenvana@gmail.com' },
  { id: '2', name: 'Nguyễn Văn B', phone: '0938222332', email: 'nguyenvanb@gmail.com' },
];
const slice = createSlice({
  name: 'students',
  initialState: { items: initialStudents, editingId: null },
  reducers: {
    addStudent(state, { payload }) {
      if (!state.items.some(item => item.id === payload.id)) state.items.push(payload);
    },
    updateStudent(state, { payload }) {
      const index = state.items.findIndex(item => item.id === payload.id);
      if (index !== -1) state.items[index] = payload;
      state.editingId = null;
    },
    deleteStudent(state, { payload }) {
      state.items = state.items.filter(item => item.id !== payload);
      if (state.editingId === payload) state.editingId = null;
    },
    editStudent(state, { payload }) { state.editingId = payload; },
  },
});
export const { addStudent, updateStudent, deleteStudent, editStudent } = slice.actions;
export const studentsReducer = slice.reducer;
export const store = configureStore({ reducer: { students: studentsReducer } });

import test from 'node:test';
import assert from 'node:assert/strict';
import { studentsReducer, addStudent, updateStudent, deleteStudent, editStudent } from './store.js';
import { validateStudent, normalizeSearch, emptyStudent } from './validation.js';

const student = { id: '3', name: 'Trần Thị C', phone: '0901234567', email: 'c@example.com' };
test('Thêm, sửa, xóa sinh viên và đồng bộ lựa chọn chỉnh sửa', () => {
  let state = studentsReducer(undefined, { type: 'init' });
  state = studentsReducer(state, addStudent(student));
  assert.equal(state.items.length, 3);
  state = studentsReducer(state, addStudent(student));
  assert.equal(state.items.length, 3);
  state = studentsReducer(state, editStudent('3'));
  state = studentsReducer(state, updateStudent({ ...student, name: 'Trần Thị D' }));
  assert.equal(state.items.find(item => item.id === '3').name, 'Trần Thị D');
  assert.equal(state.editingId, null);
  state = studentsReducer(state, editStudent('3'));
  state = studentsReducer(state, deleteStudent('3'));
  assert.equal(state.items.length, 2);
  assert.equal(state.editingId, null);
});
test('Validation bắt buộc, mã trùng, định dạng và chỉnh sửa mã hiện có', () => {
  assert.equal(Object.keys(validateStudent(emptyStudent, [], null)).length, 4);
  assert.deepEqual(validateStudent(student, [], null), {});
  assert.ok(validateStudent(student, [student], null).id);
  assert.deepEqual(validateStudent(student, [student], '3'), {});
  const errors = validateStudent({ ...student, name: '123', phone: 'abc', email: 'abc' }, [], null);
  assert.deepEqual(Object.keys(errors), ['name', 'phone', 'email']);
});
test('Tìm kiếm không dấu và không phân biệt hoa thường', () => {
  assert.ok(normalizeSearch('Nguyễn Văn Đạt').includes(normalizeSearch('NGUYEN VAN DAT')));
  assert.ok(normalizeSearch(student.email).includes(normalizeSearch('C@EXAMPLE')));
});

export const emptyStudent = { id: '', name: '', phone: '', email: '' };
export const normalizeSearch = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
export function validateStudent(values, students, editingId) {
  const errors = {};
  if (!/^\d+$/.test(values.id)) errors.id = 'Mã sinh viên phải là số và không được để trống.';
  else if (students.some(item => item.id === values.id && item.id !== editingId)) errors.id = 'Mã sinh viên đã tồn tại.';
  if (!/^[\p{L}\s]+$/u.test(values.name) || values.name.length < 2) errors.name = 'Họ tên phải có ít nhất 2 ký tự và chỉ chứa chữ.';
  if (!/^0\d{9}$/.test(values.phone)) errors.phone = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Vui lòng nhập địa chỉ email hợp lệ.';
  return errors;
}

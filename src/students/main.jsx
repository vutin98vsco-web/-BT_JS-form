import React, { Component, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, connect, useDispatch, useSelector } from 'react-redux';
import { store, addStudent, updateStudent, deleteStudent, editStudent } from './store';
import { emptyStudent, normalizeSearch, validateStudent } from './validation';
import './styles.css';

class StudentForm extends Component {
  state = { values: { ...emptyStudent }, errors: {}, notice: '' };
  // Lifecycle cập nhật form khi người dùng chọn sinh viên khác để sửa.
  componentDidUpdate(previous) {
    if (previous.editingStudent !== this.props.editingStudent) {
      this.setState({ values: { ...(this.props.editingStudent || emptyStudent) }, errors: {}, notice: '' });
    }
  }
  handleChange = event => {
    const { name, value } = event.target;
    this.setState(previous => ({ values: { ...previous.values, [name]: value }, errors: { ...previous.errors, [name]: '' }, notice: '' }));
  };
  handleSubmit = event => {
    event.preventDefault();
    const values = Object.fromEntries(Object.entries(this.state.values).map(([key, value]) => [key, value.trim()]));
    const errors = validateStudent(values, this.props.students, this.props.editingStudent?.id);
    if (Object.keys(errors).length) { this.setState({ errors }); return; }
    const editing = Boolean(this.props.editingStudent);
    if (editing) this.props.updateStudent(values);
    else this.props.addStudent(values);
    this.setState({ values: { ...emptyStudent }, errors: {}, notice: editing ? 'Đã cập nhật sinh viên.' : 'Đã thêm sinh viên.' });
  };
  render() {
    const { values, errors, notice } = this.state;
    const editing = Boolean(this.props.editingStudent);
    const fields = [{ name: 'id', label: 'Mã SV' }, { name: 'name', label: 'Họ tên' }, { name: 'phone', label: 'Số điện thoại' }, { name: 'email', label: 'Email' }];
    return <section aria-labelledby="form-title">
      <h2 className="section-title" id="form-title">Thông tin sinh viên</h2>
      <form onSubmit={this.handleSubmit} noValidate>
        <div className="form-grid">{fields.map(field => <div className="field" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input id={field.name} name={field.name} type={field.name === 'email' ? 'email' : 'text'} inputMode={['id', 'phone'].includes(field.name) ? 'numeric' : undefined} value={values[field.name]} onChange={this.handleChange} disabled={editing && field.name === 'id'} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />
          {errors[field.name] && <span className="error" id={`${field.name}-error`}>{errors[field.name]}</span>}
        </div>)}</div>
        <div className="form-actions"><button className="button green" type="submit">{editing ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}</button>
          {editing && <button className="button muted" type="button" onClick={() => this.props.editStudent(null)}>Hủy chỉnh sửa</button>}
          <span className="notice" role="status">{notice}</span>
        </div>
      </form>
    </section>;
  }
}
const ConnectedForm = connect(state => ({ students: state.students.items, editingStudent: state.students.items.find(item => item.id === state.students.editingId) }), { addStudent, updateStudent, editStudent })(StudentForm);

function App() {
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const { items, editingId } = useSelector(state => state.students);
  const dispatch = useDispatch();
  const visibleStudents = items.filter(student => Object.values(student).some(value => normalizeSearch(value).includes(normalizeSearch(search.trim()))));
  return <main className="page">
    <h1>Bài tập React Form</h1>
    <ConnectedForm />
    <div className="search-row"><label htmlFor="search">Tìm kiếm sinh viên</label><div className="search-control"><input id="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nhập mã SV, họ tên, số điện thoại hoặc email" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Xóa tìm kiếm">×</button>}</div></div>
    <div className="table-scroll"><table>
      <thead><tr><th>Mã SV</th><th>Họ tên</th><th>Số điện thoại</th><th>Email</th><th>Thao tác</th></tr></thead>
      <tbody>{visibleStudents.map(student => <tr key={student.id} className={editingId === student.id ? 'editing' : ''}>
        <td>{student.id}</td><td>{student.name}</td><td>{student.phone}</td><td>{student.email}</td>
        <td className="row-actions"><button className="button amber" onClick={() => dispatch(editStudent(student.id))} aria-label={`Chỉnh sửa ${student.name}`}>Chỉnh sửa</button><button className="button red" onClick={() => { dispatch(deleteStudent(student.id)); setNotice(`Đã xóa ${student.name}.`); }} aria-label={`Xóa ${student.name}`}>Xóa</button></td>
      </tr>)}{!visibleStudents.length && <tr><td colSpan="5" className="empty">{search ? 'Không tìm thấy sinh viên phù hợp.' : 'Chưa có sinh viên. Hãy thêm sinh viên bằng form phía trên.'}</td></tr>}</tbody>
    </table></div>
    <div className="table-footer"><span>Hiển thị {visibleStudents.length} / {items.length} sinh viên</span><span role="status">{notice}</span></div>
  </main>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><Provider store={store}><App /></Provider></React.StrictMode>);

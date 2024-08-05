const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const departmentsFilePath = path.join(__dirname, 'data/departments.json');
const employeesFilePath = path.join(__dirname, 'data/employees.json');

const readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Viết API thêm sửa xóa thông phòng ban của một công ty gọi là Department
app.post('/departments', (req, res) => {
  const departments = readFile(departmentsFilePath);
  const newDepartment = { id: departments.length ? departments[departments.length - 1].id + 1 : 1, ...req.body };
  departments.push(newDepartment);
  writeFile(departmentsFilePath, departments);
  res.status(201).json(newDepartment);
});

app.put('/departments/:id', (req, res) => {
  const { id } = req.params;
  let departments = readFile(departmentsFilePath);
  departments = departments.map(dept => dept.id === parseInt(id) ? { ...dept, ...req.body } : dept);
  writeFile(departmentsFilePath, departments);
  res.status(200).json({ message: 'Department updated successfully' });
});

app.delete('/departments/:id', (req, res) => {
  const { id } = req.params;
  let departments = readFile(departmentsFilePath);
  departments = departments.filter(dept => dept.id !== parseInt(id));
  writeFile(departmentsFilePath, departments);
  res.status(200).json({ message: 'Department deleted successfully' });
});

// Viết API để tính mức lương trung bình của 1 phòng ban. (Mức lương trung bình bằng tổng số lương trả cho toàn bộ nhân viên trong phòng / tổng số nhân viên làm việc trong phòng)
app.get('/departments/average-salary/:id', (req, res) => {
  const { id } = req.params;
  const employees = readFile(employeesFilePath);
  const departmentEmployees = employees.filter(emp => emp.departmentId === parseInt(id));
  if (departmentEmployees.length === 0) {
    return res.status(404).json({ message: 'No employees found in this department' });
  }
  const totalSalary = departmentEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  const averageSalary = totalSalary / departmentEmployees.length;
  res.status(200).json({ averageSalary });
});

// Viết API để tìm phòng ban có mức lương trung bình cao nhất
app.get('/departments/highest-average-salary', (req, res) => {
  const departments = readFile(departmentsFilePath);
  const employees = readFile(employeesFilePath);
  let highestAverageSalary = 0;
  let highestSalaryDepartment = null;

  departments.forEach(dept => {
    const departmentEmployees = employees.filter(emp => emp.departmentId === dept.id);
    if (departmentEmployees.length > 0) {
      const totalSalary = departmentEmployees.reduce((sum, emp) => sum + emp.salary, 0);
      const averageSalary = totalSalary / departmentEmployees.length;
      if (averageSalary > highestAverageSalary) {
        highestAverageSalary = averageSalary;
        highestSalaryDepartment = dept;
      }
    }
  });

  if (highestSalaryDepartment) {
    res.status(200).json(highestSalaryDepartment);
  } else {
    res.status(404).json({ message: 'No departments found with employees' });
  }
});

//6. Viết API để trả về danh sách các trưởng phòng
app.get('/departments/directors', (req, res) => {
  const departments = readFile(departmentsFilePath);
  const employees = readFile(employeesFilePath)
  departments.forEach(dept => {
    const directors = employees.filter(emp => emp.id === dept.DirectorId);
    directors = dept
  })
  res.status(200).json(directors);
});

// Viết API thêm sửa xóa thông tin nhân viên của phòng, mỗi nhân viên thuộc 1 phòng ban cụ thể
app.post('/employees', (req, res) => {
  const employees = readFile(employeesFilePath);
  const newEmployee = { id: employees.length ? employees[employees.length - 1].id + 1 : 1, ...req.body };
  employees.push(newEmployee);
  writeFile(employeesFilePath, employees);
  res.status(201).json(newEmployee);
});

app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  let employees = readFile(employeesFilePath);
  employees = employees.map(emp => emp.id === parseInt(id) ? { ...emp, ...req.body } : emp);
  writeFile(employeesFilePath, employees);
  res.status(200).json({ message: 'Employee updated successfully' });
});

app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  let employees = readFile(employeesFilePath);
  employees = employees.filter(emp => emp.id !== parseInt(id));
  writeFile(employeesFilePath, employees);
  res.status(200).json({ message: 'Employee deleted successfully' });
});

// Viết API để tìm nhân viên có mức lương cao nhất trong phòng ban
app.get('/employees/highest-salary/:departmentId', (req, res) => {
  const { departmentId } = req.params;
  const employees = readFile(employeesFilePath);
  const departmentEmployees = employees.filter(emp => emp.departmentId === parseInt(departmentId));
  if (departmentEmployees.length === 0) {
    return res.status(404).json({ message: 'No employees found in this department' });
  }
  const highestSalaryEmployee = departmentEmployees.reduce((maxEmp, emp) => emp.salary > maxEmp.salary ? emp : maxEmp, departmentEmployees[0]);
  res.status(200).json(highestSalaryEmployee);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

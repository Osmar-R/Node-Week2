const express = require('express');
const app = express();
const data = require('./public/database.json');
const Joi = require('joi');

app.use(express.json());

app.get('/employees', (req,res) => {
    if(!data){
        res.status(404).send('Could not locate information')
    }
    res.send(data)
});

app.get('/employees/:id', (req,res) => {
    const findEmployee = data.employees.find(employee =>{
        return parseInt(req.params.id) === employee.id
    });

    if(!findEmployee){
        res.status(404).send('Employee was not found');
    }
    res.send(findEmployee);
});


app.post("/employees", (req, res) => {
    const { error } = validateEmployee(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);
 
    const addWorker = {
      id: data.employees.length + 1,
      name: req.body.name,
      salary: req.body.salary,
      department: req.body.department,
    };
    if (!addWorker) {
      res.status(404).send("Could not locate information");
    }
    data.employees.push(addWorker);
    res.send(addWorker);
    return;
  });


  app.put("/employees/:id", (req, res) => {
    const employee = data.employees.find(employee =>{
        return parseInt(req.params.id) === employee.id
    });

    if(!employee) {
        return res.status(404).send('Employee was not found');
    }

    const { error } = validateEmployee(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);

        employee.name = req.body.name;
        employee.salary = req.body.salary;
        employee.department = req.body.department;
        
      res.send(employee)
  });


  app.delete("/employees/:id", (req, res) => {
    const employee = data.employees.find(employee =>{
        return parseInt(req.params.id) === employee.id
    });

    if(!employee) return res.status(404).send('Employee was not found');


    const index = data.employees.indexOf(employee);
    data.employees.splice(index, 1);
   
    return res.send(employee);

  });


const validateEmployee = (employee) => {
    const schema = {
        name: Joi.string().min(2).required(),
        salary: Joi.number().required(),
        department: Joi.string().min(2).required(),
      };
      return Joi.validate(employee, schema);
      
}




const port = process.env.PORT || 5000;
app.listen(port);
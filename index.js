const inquirer = require("inquirer")
const connection = require("./db/connection")

const mainPrompts = () => {
  inquirer.prompt({
    type: "list", 
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View All Employees", //Done
      "View All Employees By Department", //Done
      "Add Employee", //Done
      "Update Employee Role", 
      "View All Roles", //Done
      "Add Roles", //Done
      "View All Departments", //Done
      "Add Department", //Done
      "Quit" //Done
    ]
  }).then(result => {
    const choice = result.choice
    console.log(result.choice)

    //Add an in statemnt for every prompt
    //call a unique function for every if statement
    if(choice === "View All Employees"){
      viewAllEmployees()
    } else if(choice === "View All Employees By Department"){
      viewEmployeesByDep()
    } else if(choice === "Add Employee"){
      addNewEmployee()
    } else if (choice === "Update Employee Role"){
      updateEmployeeRole()
    } else if (choice === "View All Roles"){
      viewAllRoles()
    } else if (choice === "Add Roles"){
      addNewRole()
    } else if (choice === "View All Departments"){
      viewAllDepartments()
    } else if (choice === "Add Department"){
      addNewDepartment()
    } else if(choice === "Quit"){
      quit()
    } else {
      console.log("Invalid input. Something went wrong")
      process.exit()
    }

  })

}

const viewAllEmployees = () => {
  connection.promise().query(`SELECT * FROM employee`)
    .then(([rows]) => {
      console.table(rows)
    })
    .then(() => mainPrompts())
}
const viewAllRoles = () => {
  connection.promise().query(`SELECT * FROM role`)
    .then(([rows]) => {
      console.table(rows)
    })
    
    .then(() => mainPrompts())
}
const viewAllDepartments = () => {
  connection.promise().query(`SELECT * FROM department`)
    .then(([rows]) => {
      console.table(rows)
    })
    .then(() => mainPrompts())
}
const updateEmployeeRole = () => {
  connection.promise().query(`SELECT * FROM employee`)
    .then(([rows]) => {
      const employees = rows.map(emp => ({name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
      inquirer.prompt({
        type: "list",
        name: "emp_id",
        message: "Which employee do you want to update",
        choices: employees
      }).then(result => {
        let emp_id = result.emp_id
        connection.promise().query(`SELECT * FROM role`)
          .then(([rows]) => {
            const roles = rows.map(role => ({name: role.title, value: role.id }))
            inquirer.prompt({
              type: "list",
              name: "role_id",
              message: "Which role do you want to update",
              choices: roles
            }).then(result => {
              let role_id = result.role_id
              connection.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [role_id, emp_id])
                .then(() => {
                  console.log("Updated employee's role")
                  mainPrompts()
                })
            })
          })
      })



    })

}


const viewEmployeesByDep = () => {
  connection.promise().query(`SELECT department.name, department.id FROM department`)
    .then(([rows]) => {
      // console.log(rows)
      const departments = rows.map(dep => ({name: dep.name, value: dep.id}))

      inquirer.prompt({
        type: "list", 
        name: "choice",
        message: "Which department would you like to view?",
        choices: departments
      }).then(result => {
        const depId = result.choice
        // console.log(result.choice)

        connection.promise().query(`
          SELECT * FROM employee 
          LEFT JOIN role on employee.role_id = role.id 
          LEFT JOIN department department on role.department_id = department.id WHERE department.id = ? `, [depId]
        ).then(([rows]) => {
          // console.log(rows)
          console.table(rows)
        }).then(() => mainPrompts())
      })
    })
}

function addNewEmployee(){
  connection.promise().query(`SELECT role.title, role.id FROM role`)
  .then(([rows]) => {
    // console.log(rows)
    const roles = rows.map(role => ({name: role.title, value: role.id}))

    connection.promise().query(`SELECT employee.first_name, employee.last_name, employee.id FROM employee`)
      .then(([rows]) => {

        const managers = rows.map(emp => ({name: emp.first_name+" "+emp.last_name, value: emp.id}))

        inquirer.prompt([
          {
            type: "input", 
            name: "first_name",
            message: "What is the employee's first name?"
          },
          {
            type: "input", 
            name: "last_name",
            message: "What is the employee's last name?"
          },
          {
            type: "list", 
            name: "role_id",
            message: "What is the employee's role?",
            choices: roles
          },
          {
            type: "list", 
            name: "manager_id",
            message: "Who is this employee's manager?",
            choices: [...managers, {name: "None", value: null}]
          }
        ])
          .then(result => {
            connection.promise().query(`INSERT INTO employee SET ?`, result)
              .then(() => {
                console.log("Inserted new employee")
                viewAllEmployees()
              })
          })
      })
  })
}
function addNewRole(){
  connection.promise().query(`SELECT department.name, department.id FROM department`)
  .then(([rows]) => {
    // console.log(rows)
    const departments = rows.map(dep => ({name: dep.name, value: dep.id}))
        inquirer.prompt([
          {
            type: "input", 
            name: "title",
            message: "What is the name of this role?"
          },
          {
            type: "input", 
            name: "salary",
            message: "What is the salary for this role?"
          },
          {
            type: "list", 
            name: "department_id",
            message: "What is the department for this role?",
            choices: departments
          }
        ])
          .then(result => {
            result.salary = parseInt(result.salary)
            connection.promise().query(`INSERT INTO role SET ?`, result)
              .then(() => {
                console.log("Inserted new employee")
                viewAllRoles()
              })
          })
      })
  
}
function addNewDepartment(){

  inquirer.prompt([
    {
      type: "input", 
      name: "name",
      message: "What is the name of this department?"
    }
  ])
    .then(result => {
      connection.promise().query(`INSERT INTO department SET ?`, result)
        .then(() => {
          console.log("Inserted new department")
          viewAllDepartments()
        })
    })
  
}
//Make a function for every choice in the first prompt

function quit(){
  console.log("Bye")
  process.exit()
}


function start(){
  mainPrompts()
}
start()
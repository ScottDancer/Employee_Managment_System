const inquirer = require("inquirer")
const connection = require("./db/connection")

const mainPrompts = () => {
  inquirer.prompt({
    type: "list", 
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee",
      "Delete Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Roles",
      "Remove Role",
      "View All Departments",
      "Add Department",
      "Remove Department",
      "Quit"
    ]
  }).then(result => {
    const choice = result.choice
    console.log(result.choice)

    if(choice === "View All Employees"){
      viewAllEmployees()
    } else if(choice === "View All Employees By Department"){
      viewEmployeesByDep()
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



function quit(){
  console.log("Bye")
  process.exit()
}


function start(){
  mainPrompts()
}
start()
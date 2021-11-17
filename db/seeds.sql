INSERT INTO department (department_name)
VALUES ("Finance"),
       ("Sales"); 

INSERT INTO `role` (department_id, role_name, salary)
VALUES (1, "Accountant", 40000 ),
       (1, "Account manager", 60000),
       (2, "Sales Coordinator", 50000),
       (2, "Sales Manager", 70000); 

INSERT INTO employee (role_id, first_name, last_name, manager_id)
VALUES (1, "Pablo", "Zambrano", 1),
       (1, "Lana", "Deguara", null),
       (2, "Carlos", "Smith", 2),
       (2, "John", "Stark", null); 
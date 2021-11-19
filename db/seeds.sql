INSERT INTO department (department_name)
VALUES ("Finance"),
       ("Sales"),
       ("IT"); 

INSERT INTO `role` (department_id, role_name, salary)
VALUES (1, "Account Manager", 40000 ),
       (1, "Account Executive", 60000),
       (2, "Sales Manager", 50000),
       (2, "Sales Executive", 70000),
       (3, "IT Tier1", 80000); 

INSERT INTO employee (role_id, first_name, last_name, manager_id)
VALUES (1, "Pablo", "Zambrano", null),
       (1, "Lana", "Deguara", 1),
       (2, "Carlos", "Smith", null),
       (2, "John", "Stark", 3),
       (3, "Sarah", "Raynolds", null),
       (3, "John", "Sark", 5); 
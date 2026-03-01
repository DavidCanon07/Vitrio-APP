
DELETE FROM usuario;
DELETE FROM cliente;
DELETE FROM credencial;
ALTER TABLE usuario AUTO_INCREMENT = 0;
ALTER TABLE cliente AUTO_INCREMENT = 0;
ALTER TABLE credencial AUTO_INCREMENT = 0;



INSERT INTO cliente(nombre, email,telefono)
VALUES('Negocio de prueba','negocioprueba@correo.com','3001234567');

INSERT INTO usuario(id_cliente, fecha_nacimiento, rol)
VALUES(1,'1995-01-01','ADMINISTRADOR_CLIENTE');

INSERT INTO credencial(id_usuario,nombre,contrasena,email)
VALUES(1,'Usuario de prueba', 'prueba1234','usuarioprueba@correo.com');


INSERT INTO usuario(id_cliente, fecha_nacimiento, rol)
VALUES(NULL,'2003-07-15','ADMINISTRADOR');

INSERT INTO credencial(id_usuario,nombre,contrasena,email)
VALUES(2,'Admin vitrio', 'admin1234','admin@vitrio.com');


SELECT * FROM cliente;
SELECT * FROM usuario;
SELECT * FROM credencial;



-- Ver todos los usuarios con sus credenciales y cliente
SELECT 
    u.id_usuario,
    c.nombre    AS credencial_nombre,
    c.email,
    u.rol,
    cl.nombre   AS cliente
FROM usuario u
JOIN credencial c ON c.id_usuario = u.id_usuario
LEFT JOIN cliente cl ON cl.id_cliente = u.id_cliente;


-- encriptación contraseña
UPDATE credencial SET contrasena = SHA2('admin1234', 256) 
WHERE id_credencial = 2;



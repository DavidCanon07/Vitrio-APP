from django.db import models

# Representa la tabla cliente en MySQL
class Cliente (models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, unique=True)
    telefono = models.CharField(max_length=20)
    fecha_creacion= models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta: # Configuracion de la tabla en la base de datos - nombre de la tabla
        db_table = 'cliente'

    def __str__(self): # Representacion en string del modelo - devuelve el nombre del cliente
        return self.nombre
# Representa la tabla usuario en MySQL - cada usuario esta asociado a un cliente y tiene un rol (administrador, administrador cliente, o cliente)
class Usuario (models.Model):
    ROL_CHOICES= [ # Opciones para el campo de rol del usuario - define los posibles roles que un usuario puede tener en el sistema
        ('ADMINISTRADOR',   'Administrador '),
        ('ADMINISTRADOR_CLIENTE', 'Administrador Cliente'),
        ('CLIENTE', 'Cliente'),
    ]   
    
    id_usuario = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, null=True, blank=True, db_column='id_cliente')
    fecha_nacimiento = models.DateField(null=True, blank = True)
    rol = models.CharField(max_length=25, choices = ROL_CHOICES) 
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:  # Configuracion de la tabla en la base de datos - nombre de la tabla
        db_table = 'usuario'
    
        def __str__(self): # Representacion en string del modelo - devuelve el id del usuario y su rol
            return f'{self.id_usuario} - {self.rol}'
    
# Representa la tabla credencial en MySQL - cada credencial esta asociada a un usuario y contiene información de autenticación como username, password, y email
class Credencial(models.Model):
    id_credencial = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=200, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta: # Configuracion de la tabla en la base de datos - nombre de la tabla
        db_table = 'credencial'
    
    def __str__(self): # Representacion en string del modelo - devuelve el username de la credencial
        return self.username

# Representa la tabla proyecto en MySQL - cada proyecto esta asociado a un cliente y tiene campos para nombre, descripcion, fechas, estado, y timestamps de creación y actualización
class Proyecto (models.Model):
    ESTADO_CHOICES = [
        ('PROPUESTO', 'Propuesto'),
        ('ANALISIS', 'Análisis'),
        ('APROBADO', 'Aprobado'),
        ('PLANIFICACION', 'Planificación'),
        ('EJECUCION', 'Ejecución'),
        ('SEGUIMIENTO', 'Seguimiento'),
        ('PAUSADO', 'Pausado'),
        ('CANCELADO', 'Cancelado'),
        ('COMPLETADO', 'Completado'),
        ('CERRADO', 'Cerrado'),
    ]
# Campos del modelo Proyecto - id, cliente asociado, nombre, descripcion, fechas, estado, y timestamps de creación y actualización
    id_proyecto = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, db_column='id_cliente')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_entrega = models.DateField()
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='PROPUESTO')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta: # Configuracion de la tabla en la base de datos - nombre de la tabla
        db_table = 'proyecto'
        
        def __str__ (self): # Representacion en string del modelo - devuelve el nombre del proyecto
            return self.nombre

# Representa la tabla plantilla en MySQL - cada plantilla tiene un tipo (video, imagen, audio, metadato, o documento), estado (activa, inactiva, o deprecada), y campos para nombre, descripcion, version, ruta base, y timestamps de creación y actualización
class Plantilla (models.Model):
    TIPO_CHOICES = [
        ('VIDEO', 'Video'),
        ('IMAGEN', 'Imagen'),
        ('AUDIO', 'Audio'),
        ('METADATO', 'Metadato'),
        ('DOCUMENTO', 'Documento')
    ]
    # Opciones para el campo de estado de la plantilla - define los posibles estados que una plantilla puede tener en el sistema
    ESTADO_CHOICES = [
        ('ACTIVA', 'Activa'),
        ('INACTIVA', 'Inactiva'),
        ('DEPRECADA', 'Deprecada'),
    ]
    # Campos del modelo Plantilla - id, nombre, descripcion, tipo, version, estado, ruta base, y timestamps de creación y actualización
    id_plantilla = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    version = models.CharField(max_length=50,blank=True, default='1.0')
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='ACTIVA')
    ruta_base = models.CharField(max_length=500, null=True, blank= True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta: # Configuracion de la tabla en la base de datos - nombre de la tabla
        db_table = 'plantilla'
        
    def __str__(self): # Representacion en string del modelo - devuelve el nombre de la plantilla
        return self.nombre
   
# Representa la tabla archivo en MySQL - cada archivo esta asociado a un proyecto y opcionalmente a una plantilla, tiene un tipo (video, imagen, audio, paquete, metadato, o documento), y campos para nombre, ruta, fechas, y timestamps de creación y actualización 
class Archivo(models.Model):
    TIPO_CHOICES =[
        ('VIDEO', 'Video'),
        ('IMAGEN', 'Imagen'),
        ('AUDIO', 'Audio'),
        ('PAQUETE', 'Paquete'),
        ('METADATO', 'Metadato'),
        ('DOCUMENTO', 'Documento')
    ]    
    # Campos del modelo Archivo - id, proyecto asociado, plantilla asociada (opcional), nombre, ruta, tipo, fechas, y timestamps de creación y actualización
    id_archivo = models.AutoField(primary_key=True)
    id_proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, db_column='id_proyecto')
    id_plantilla = models.ForeignKey(Plantilla, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_plantilla')
    nombre = models.CharField(max_length=200)
    ruta = models.CharField(max_length=500)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta: # Configuracion de la tabla en la base de datos - nombre de la tabla
        db_table = 'archivo'
        
    def __str__ (self): # Representacion en string del modelo - devuelve el nombre del archivo
        return self.nombre
    
# Representa la tabla dispositivo en MySQL - cada dispositivo esta asociado a un proyecto, tiene un estado (activo, inactivo, o sin conexión), y campos para nombre, ubicacion, token, resolucion, fechas, y timestamps de creación y actualización
class Dispositivo(models.Model):
    ESTADO_CHOICES =[
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),   
        ('SIN_CONEXION', 'Sin Conexión'),
    ]
    # Campos del modelo Dispositivo - id, proyecto asociado, nombre, ubicacion, token, resolucion, estado, ultima conexion, y timestamps de creación y actualización
    id_dispositivo = models.AutoField(primary_key=True)
    id_proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, db_column='id_proyecto')
    nombre = models.CharField(max_length=200)
    ubicacion = models.CharField(max_length=200, blank=True, null=True)
    token = models.CharField(max_length=255, unique=True, blank=True,default='')
    resolucion = models.CharField(max_length=50, null=True, blank=True)
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='ACTIVO')
    ultima_conexion = models.DateTimeField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta: # Configuracion de la tabla en la base de datos - nombre de la tabla
        db_table = 'dispositivo'
        
    def __str__ (self): # Representacion en string del modelo - devuelve el nombre del dispositivo
        return self.nombre
    
    
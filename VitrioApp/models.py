from django.db import models

class Cliente (models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, unique=True)
    telefono = models.CharField(max_length=20)
    fecha_creacion= models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cliente'

    def __str__(self):
        return self.nombre
    
class Usuario (models.Model):
    ROL_CHOICES= [
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

    class Meta: 
        db_table = 'usuario'
    
        def __str__(self):
            return f'{self.id_usuario} - {self.rol}'
    
    
class Credencial(models.Model):
    id_credencial = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=200, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'credencial'
    
    def __str__(self):
        return self.username
    
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

    id_proyecto = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, db_column='id_cliente')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_entrega = models.DateField()
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='PROPUESTO')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'proyecto'
        
        def __str__ (self):
            return self.nombre

class Plantilla (models.Model):
    TIPO_CHOICES = [
        ('VIDEO', 'Video'),
        ('IMAGEN', 'Imagen'),
        ('AUDIO', 'Audio'),
        ('METADATO', 'Metadato'),
        ('DOCUMENTO', 'Documento')
    ]
    
    ESTADO_CHOICES = [
        ('ACTIVA', 'Activa'),
        ('INACTIVA', 'Inactiva'),
        ('DEPRECADA', 'Deprecada'),
    ]
    
    id_plantilla = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    version = models.CharField(max_length=50,blank=True, default='1.0')
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='ACTIVA')
    ruta_base = models.CharField(max_length=500, null=True, blank= True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'plantilla'
        
    def __str__(self):
        return self.nombre
    
class Archivo(models.Model):
    TIPO_CHOICES =[
        ('VIDEO', 'Video'),
        ('IMAGEN', 'Imagen'),
        ('AUDIO', 'Audio'),
        ('PAQUETE', 'Paquete'),
        ('METADATO', 'Metadato'),
        ('DOCUMENTO', 'Documento')
    ]    
    
    id_archivo = models.AutoField(primary_key=True)
    id_proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, db_column='id_proyecto')
    id_plantilla = models.ForeignKey(Plantilla, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_plantilla')
    nombre = models.CharField(max_length=200)
    ruta = models.CharField(max_length=500)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'archivo'
        
    def __str__ (self):
        return self.nombre
class Dispositivo(models.Model):
    ESTADO_CHOICES =[
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),   
        ('SIN_CONEXION', 'Sin Conexión'),
    ]
    
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
    
    class Meta:
        db_table = 'dispositivo'
        
    def __str__ (self):
        return self.nombre
    
    
from django.test import TestCase
from django.utils import timezone
from datetime import date
from .models import Usuario, Cliente


class UsuarioModelTest(TestCase):
    """Test suite for the Usuario model"""
    
    @classmethod
    def setUpTestData(cls):
        """Set up non-modified objects used by all test methods"""
        cls.cliente = Cliente.objects.create(
            nombre='Test Cliente',
            email='cliente@test.com',
            telefono='1234567890'
        )
    
    def test_create_usuario_with_valid_data(self):
        """Should create a Usuario instance with valid data"""
        usuario = Usuario.objects.create(
            id_cliente=self.cliente,
            fecha_naciemiento=date(1990, 1, 1),
            rol='ADMINISTRADOR'
        )
        
        self.assertIsNotNone(usuario.id_usuario)
        self.assertEqual(usuario.id_cliente, self.cliente)
        self.assertEqual(usuario.rol, 'ADMINISTRADOR')
        self.assertEqual(usuario.fecha_naciemiento, date(1990, 1, 1))
    
    def test_create_usuario_without_cliente(self):
        """Should create a Usuario without a Cliente (null foreign key)"""
        usuario = Usuario.objects.create(
            id_cliente=None,
            fecha_naciemiento=date(1995, 5, 15),
            rol='USUARIO'
        )
        
        self.assertIsNotNone(usuario.id_usuario)
        self.assertIsNone(usuario.id_cliente)
        self.assertEqual(usuario.rol, 'USUARIO')
    
    def test_rol_choices_administrador(self):
        """Should validate ROL_CHOICES - ADMINISTRADOR"""
        usuario = Usuario.objects.create(
            rol='ADMINISTRADOR'
        )
        
        self.assertEqual(usuario.rol, 'ADMINISTRADOR')
        self.assertIn(
            ('ADMINISTRADOR', 'Administrador '),
            Usuario.ROL_CHOICES
        )
    
    def test_rol_choices_administrador_cliente(self):
        """Should validate ROL_CHOICES - ADMINISTRADOR_CLIENTE"""
        usuario = Usuario.objects.create(
            rol='ADMINISTRADOR_CLIENTE'
        )
        
        self.assertEqual(usuario.rol, 'ADMINISTRADOR_CLIENTE')
        self.assertIn(
            ('ADMINISTRADOR_CLIENTE', 'Administrador Cliente'),
            Usuario.ROL_CHOICES
        )
    
    def test_rol_choices_usuario(self):
        """Should validate ROL_CHOICES - USUARIO"""
        usuario = Usuario.objects.create(
            rol='USUARIO'
        )
        
        self.assertEqual(usuario.rol, 'USUARIO')
        self.assertIn(
            ('USUARIO', 'Usuario'),
            Usuario.ROL_CHOICES
        )
    
    def test_fecha_creacion_auto_set(self):
        """Should automatically set fecha_creacion on creation"""
        before_creation = timezone.now()
        usuario = Usuario.objects.create(
            rol='USUARIO'
        )
        after_creation = timezone.now()
        
        self.assertIsNotNone(usuario.fecha_creacion)
        self.assertGreaterEqual(usuario.fecha_creacion, before_creation)
        self.assertLessEqual(usuario.fecha_creacion, after_creation)
    
    def test_fecha_actualizacion_auto_update(self):
        """Should automatically update fecha_actualizacion on save"""
        usuario = Usuario.objects.create(
            rol='USUARIO'
        )
        
        original_fecha_actualizacion = usuario.fecha_actualizacion
        
        # Wait a moment and update
        import time
        time.sleep(0.01)
        
        usuario.rol = 'ADMINISTRADOR'
        usuario.save()
        
        usuario.refresh_from_db()
        self.assertGreater(
            usuario.fecha_actualizacion,
            original_fecha_actualizacion
        )
    
    def test_null_fecha_nacimiento(self):
        """Should allow null fecha_nacimiento"""
        usuario = Usuario.objects.create(
            rol='USUARIO',
            fecha_naciemiento=None
        )
        
        self.assertIsNone(usuario.fecha_naciemiento)
        self.assertIsNotNone(usuario.id_usuario)
    
    def test_cascade_delete_with_cliente(self):
        """Should cascade delete Usuario when Cliente is deleted"""
        cliente = Cliente.objects.create(
            nombre='Cliente to Delete',
            email='delete@test.com',
            telefono='9876543210'
        )
        
        usuario = Usuario.objects.create(
            id_cliente=cliente,
            rol='USUARIO'
        )
        
        usuario_id = usuario.id_usuario
        
        # Delete the cliente
        cliente.delete()
        
        # Usuario should be deleted due to CASCADE
        with self.assertRaises(Usuario.DoesNotExist):
            Usuario.objects.get(id_usuario=usuario_id)
    
    def test_string_representation(self):
        """Should return correct string representation"""
        usuario = Usuario.objects.create(
            rol='ADMINISTRADOR'
        )
        
        expected_str = f'{usuario.id_usuario} - {usuario.rol}'
        self.assertEqual(str(usuario), expected_str)
    
    def test_database_table_name(self):
        """Should store Usuario in correct database table ('usuario')"""
        self.assertEqual(Usuario._meta.db_table, 'usuario')

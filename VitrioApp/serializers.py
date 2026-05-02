from rest_framework import serializers
from .models import Cliente, Usuario, Credencial, Proyecto, Plantilla, Archivo, Dispositivo

# Convierte cada modelo a JSON y viceversa para la API 
# cada serializer especifica el modelo asociado y que campos incluir
# (en este caso, todos los campos con '__all__')

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Cliente
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Usuario
        fields = '__all__'

class CredencialSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Credencial
        fields = '__all__'

class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Proyecto
        fields = '__all__'

class PlantillaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Plantilla
        fields = '__all__'

class ArchivoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Archivo
        fields = '__all__'

class DispositivoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Dispositivo
        fields = '__all__'      
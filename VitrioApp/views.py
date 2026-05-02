from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cliente, Usuario, Credencial, Proyecto, Plantilla, Archivo, Dispositivo
from .serializers import ClienteSerializer, UsuarioSerializer, CredencialSerializer, ProyectoSerializer, PlantillaSerializer, ArchivoSerializer,DispositivoSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# CRUD completo para cada modelo
# utilizando ViewSets de DRF - cada ViewSet especifica el queryset, el serializer, y los permisos 
# en este caso, se requiere autenticación para todas las operaciones
class ClienteViewSet(viewsets.ModelViewSet): # CRUD completo para el modelo Cliente - permite listar, crear, obtener, actualizar, y eliminar clientes a través de la API
    queryset = Cliente.objects.all() # Especifica el conjunto de datos para este ViewSet - en este caso, todos los objetos Cliente en la base de datos
    serializer_class = ClienteSerializer # Especifica el serializer para este ViewSet - se utiliza para convertir los objetos Cliente a JSON y viceversa en las solicitudes y respuestas de la API
    permission_classes = [IsAuthenticated] # Especifica los permisos para este ViewSet - en este caso, se requiere que el usuario esté autenticado para acceder a cualquier operación en este ViewSet

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

   
class CredencialViewSet(viewsets.ModelViewSet):
    queryset = Credencial.objects.all()
    serializer_class = CredencialSerializer
    permission_classes = [IsAuthenticated]
   
class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [IsAuthenticated]   
   
class PlantillaViewSet(viewsets.ModelViewSet):
    queryset = Plantilla.objects.all()
    serializer_class = PlantillaSerializer
    permission_classes = [IsAuthenticated]  

class ArchivoViewSet(viewsets.ModelViewSet):
    queryset = Archivo.objects.all()
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]
   
class DispositivoViewSet(viewsets.ModelViewSet):
    queryset = Dispositivo.objects.all()
    serializer_class = DispositivoSerializer
    permission_classes = [IsAuthenticated]      
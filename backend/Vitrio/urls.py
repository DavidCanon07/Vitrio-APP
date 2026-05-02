"""
URL configuration for Vitrio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from VitrioApp .views import ClienteViewSet, UsuarioViewSet, CredencialViewSet, ProyectoViewSet, PlantillaViewSet, ArchivoViewSet, DispositivoViewSet   
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# Configuracion del router para la API - registra los ViewSets para cada modelo, lo que genera automáticamente las rutas CRUD para cada uno
router = DefaultRouter() # Configuracion del router para la API - registra los ViewSets para cada modelo, lo que genera automáticamente las rutas CRUD para cada uno
router.register(r'clientes',    ClienteViewSet) # Registra el ViewSet para el modelo Cliente, lo que genera rutas como /api/clientes/ para listar y crear clientes, y /api/clientes/{id}/ para obtener, actualizar o eliminar un cliente específico
router.register(r'usuarios',    UsuarioViewSet) # Registra el ViewSet para el modelo Usuario, lo que genera rutas como /api/usuarios/ para listar y crear usuarios, y /api/usuarios/{id}/ para obtener, actualizar o eliminar un usuario específico
router.register(r'credenciales',CredencialViewSet) # Registra el ViewSet para el modelo Credencial, lo que genera rutas como /api/credenciales/ para listar y crear credenciales, y /api/credenciales/{id}/ para obtener, actualizar o eliminar una credencial específica
router.register(r'proyectos',   ProyectoViewSet) # Registra el ViewSet para el modelo Proyecto, lo que genera rutas como /api/proyectos/ para listar y crear proyectos, y /api/proyectos/{id}/ para obtener, actualizar o eliminar un proyecto específico
router.register(r'plantillas',  PlantillaViewSet) # Registra el ViewSet para el modelo Plantilla, lo que genera rutas como /api/plantillas/ para listar y crear plantillas, y /api/plantillas/{id}/ para obtener, actualizar o eliminar una plantilla específica
router.register(r'archivos',    ArchivoViewSet) # Registra el ViewSet para el modelo Archivo, lo que genera rutas como /api/archivos/ para listar y crear archivos, y /api/archivos/{id}/ para obtener, actualizar o eliminar un archivo específico
router.register(r'dispositivos',DispositivoViewSet) # Registra el ViewSet para el modelo Dispositivo, lo que genera rutas como /api/dispositivos/ para listar y crear dispositivos, y /api/dispositivos/{id}/ para obtener, actualizar o eliminar un dispositivo específico

# Vista de prueba que no requiere autenticación - devuelve un mensaje simple para verificar que la API funciona
@api_view(['GET']) # Vista de prueba que no requiere autenticación - devuelve un mensaje simple para verificar que la API funciona
@permission_classes([AllowAny]) # Permite el acceso a esta vista sin autenticación
def test_view(request):
    return Response({"mensaje": "funciona"})
# Configuracion de las URLs para el proyecto - incluye la ruta para el admin, autenticación JWT, rutas de la API, y documentación de la API
urlpatterns = [
    path('admin/', admin.site.urls), # Ruta para el panel de administración de Django
    path('api/login/',         csrf_exempt(TokenObtainPairView.as_view())), # Ruta para obtener el token de acceso
    path('api/token/refresh/', csrf_exempt(TokenRefreshView.as_view())), # Ruta para refrescar el token de acceso
    path('api/',               include(router.urls)), # Rutas para los endpoints de la API generados por el router
    path('api/schema/',        SpectacularAPIView.as_view(), name='schema'), # Ruta para la definición de la API
    path('api/docs/',          SpectacularSwaggerView.as_view(url_name='schema')), # Ruta para la documentación automatica con Swagger UI
    path('api/test/', test_view), # Ruta para una vista de prueba que no requiere autenticación
]


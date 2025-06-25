from django.urls import path
from . import views

urlpatterns = [
    path('utilizadores/', views.get_utilizadores, name='get_utilizadores'),
    path('utilizadores/create/', views.create_utilizadores, name='create_utilizadores'),
    path('utilizadores/<int:pk>/', views.user_detail, name='user_detail'),

    path('equipas/', views.get_equipa, name='get_equipa'),
    path('equipas/create/', views.create_equipa, name='create_equipa'),
    path('equipas/<int:pk>/', views.equipa_detail, name='equipa_detail'),
    path('utilizadores/gestores/', views.gestores_equipas, name='gestores_equipas'),

    path('prova/', views.get_prova, name='get_prova'),
    path('prova/create/', views.create_prova, name='create_prova'),
    path('prova/<int:pk>/', views.prova_detail, name='prova_detail'),

    path('etapa/', views.get_etapa, name='get_etapa'),
    path('etapa/create/', views.create_etapa, name='create_etapa'),
    path('etapa/<int:pk>/', views.etapa_detail, name='etapa_detail'),

    path('ciclista/', views.get_ciclista, name='get_ciclista'),
    path('ciclista/create/', views.create_ciclista, name='create_ciclista'),
    path('ciclista/<int:pk>/', views.ciclista_detail, name='ciclista_detail'),

    path('resultados/', views.get_resultados, name='get_resultados'),
    path('resultados/create/', views.create_resultados, name='create_resultados'),
    path('resultados/<int:pk>/', views.resultados_detail, name='resultados_detail'),
    
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('etapas/', views.listar_etapas, name='listar_etapas'),
    path('ciclista/por-equipa/', views.ciclistas_por_equipa, name='ciclistas_por_equipa'),

]
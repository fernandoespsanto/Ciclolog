from django.db import models

class Utilizador(models.Model):
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=90)
    password = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    tipo = models.CharField(max_length=30)
    morada = models.CharField(max_length=100, blank=True, null=True)
    nodocident = models.CharField(max_length=20, blank=True, null=True)
    datanasc = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
class Equipa(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    cidade = models.CharField(max_length=60)
    responsavel = models.CharField(max_length=80, blank=True, null=True)
    gestor = models.ForeignKey( 
        Utilizador,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipas_geridas'
    )

    def __str__(self):
        return self.nome
    
class Prova(models.Model):
    nome = models.CharField(max_length=100)
    local = models.CharField(max_length=100)
    data_inicio = models.DateField(max_length=20, blank=True, null=True)
    data_fim = models.DateField(max_length=60)
    noetapas = models.IntegerField()
    #noetapas = models.PositiveIntegerField()


    def __str__(self):
        return self.nome
    
class Etapa(models.Model):
    prova = models.ForeignKey(Prova, related_name="etapas", on_delete=models.CASCADE)
    partida = models.CharField(max_length=100)
    chegada = models.CharField(max_length=100)
    data = models.DateField()
    distancia = models.FloatField()

    def __str__(self):
        return f"Etapa {self.numero} - {self.prova.nome}"
    
class Ciclista(models.Model):
    nome = models.CharField(max_length=100)
    equipa = models.ForeignKey(Equipa, on_delete=models.SET_NULL, null=True)
    email = models.EmailField(unique=True, default='exemplo@dominio.pt')
    grade = models.CharField(max_length=50)
    #is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.nome

class EqProva(models.Model):
    nome = models.CharField(max_length=100)
    prova = models.ForeignKey(Prova, on_delete=models.SET_NULL, null=True)
    equipa = models.ForeignKey(Equipa, on_delete=models.SET_NULL, null=True)
    notas = models.CharField(max_length=180)

    def __str__(self):
        return self.nome

class Resultados(models.Model):
    etapa = models.ForeignKey(Etapa, on_delete=models.SET_NULL, null=True)
    ciclista = models.ForeignKey(Ciclista, on_delete=models.SET_NULL, null=True)
    tempo = models.TimeField()
    lugar = models.PositiveIntegerField()
    desclassifica = models.BooleanField(default=False)
    desiste = models.BooleanField(default=False)
    notas = models.CharField(max_length=180, blank=True, null=True)

    def __str__(self):
        return f"{self.ciclista} - {self.etapa} - {self.tempo}"
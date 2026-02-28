# Definición de clase base
class Bird:
	def __init__(self, name, age, species):
		self.name = name
		self.age = age
		self.species = species
	def sing(self):
		print(f"{self.name}: ¡Pío pío!")

# Herencia
class Eagle(Bird):
	def fly(self):
		print(f"{self.name}: ¡Estoy volando alto!")

eagle = Eagle("Baltazar", 5, "Aquila chrysaetos")

print(eagle.name, eagle.age, eagle.species)
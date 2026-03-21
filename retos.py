class Player:
    def __init__(self, name, age, position, goals):
        self.name = name
        self.age = age
        self.position = position
        self.goals = goals
    def score(self):
        self.goals += 1
        print(f"{self.name} has scored a goal! Total goals: {self.goals}")
    def transfer(self, new_team):
        print(f"{self.name} has been transferred to {new_team}.")
        
class Coach:
    def __init__(self, namecoach, experience_years):
        self.name = namecoach
        self.experience_years = experience_years
    def give_instructions(self, message):
        print(f"{self.name} gives tactical instructions: {message}")

#class FootballTeam asignes a Coach to the team
class FootballTeam(Player, Coach):
    def hire_coach(self, coach):
        print(f"{self.name} has hired {coach.name} as their new coach.")


player = Player("Lionel Messi", 35, "Forward", 1)
coach = Coach("Pep Guardiola", 15)
equipo = FootballTeam("FC Barcelona", 30, "Number 1", 100)

player.score()
player.transfer("Inter Miami")
coach.give_instructions("Press the attack and maintain possession.")
equipo.hire_coach(coach)

def solution():
    print("Enter the number of cities")
    cities_count = int(input())
    cities = {}
    for i in range(cities_count):
        print("Enter city", i + 1)
        city = input()
        print("Enter number of posts in city", city)
        posts = int(input())
        cities[city] = posts
    cities_name = list(cities.keys())
    print("Enter number of candidates")
    candidate_count = int(input())
    candidates = {}
    for i in range(candidate_count):
        print("Enter name of candidate", i + 1)
        candidate_name = input()
        print("Enter first preference for", candidate_name)
        city_choice = take_city_choices(cities_count, cities_name)
        if (cities[city_choice] > 0):
            cities[city_choice] -= 1
            print("Candidate has been assigned city", city_choice)
            candidates[candidate_name] = city_choice
        else:
            print("Candidate's first preference is already full, enter second preference")
            city_choice = take_city_choices(cities_count, cities_name)
            if (cities[city_choice] > 0):
                cities[city_choice] -= 1
                print("Candidate has been assigned city", city_choice)
                candidates[candidate_name] = city_choice
            else:
                print(
                    "Candidate's second preference is also full, enter third preference")
                city_choice = take_city_choices(cities_count, cities_name)
                if (cities[city_choice] > 0):
                    cities[city_choice] -= 1
                    print("Candidate has been assigned city", city_choice)
                    candidates[candidate_name] = city_choice
                else:
                    print(
                        "Unfortunately, candidate's third preference is also full, you need to reask preferences from candidate")
    print("Following is the list of Candidates with their assigned cities")
    for candidate, assigned_city in candidates.items():
        print(candidate, "=>", assigned_city)


def take_city_choices(cities_count, cities_name):
    print("Enter", end=" ")
    for i in range(cities_count):
        print(i + 1, "for", cities_name[i], end=" ")
    choice = int(input())
    if (choice < 1 or choice > len(cities_name)):
        print("Invalid choice, please try again")
    else:
        return cities_name[choice - 1]
    print()


solution()

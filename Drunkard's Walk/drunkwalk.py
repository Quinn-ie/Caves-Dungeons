import random

WALL = "#"
FLOOR = "."
WIDTH = 40
HEIGHT = 22
STEPS = 100
DIRECTIONS = [
    (1,0),   #Right
    (-1,0),  #Left
    (0,1),   #Down
    (0,-1)   #Up
]

random.seed(127)

def generate():
    grid = [[WALL for _ in range(WIDTH)] for _ in range(HEIGHT)]
    target = int(WIDTH * HEIGHT * 0.2)
    floor_count = 0
    # x = WIDTH // 2
    # y = HEIGHT // 2
    walkers = [
        [WIDTH // 2 + 5, HEIGHT // 2],
        [WIDTH // 2 - 5, HEIGHT // 2],
        [WIDTH // 2, HEIGHT // 2 + 5],
        [WIDTH // 2, HEIGHT // 2 - 5]
    ]
    last_direction = random.choice(DIRECTIONS)
    
    # for _ in range(STEPS):
    #     grid[y][x] = FLOOR
    #     dx, dy = random.choice(DIRECTIONS)
    #     x += dx
    #     y += dy
    #     x = max(0, min(WIDTH - 1, x))
    #     y = max(0, min(HEIGHT - 1, y))
    
    while floor_count < target:
        for w in walkers:
            x, y = w
            
            if random.random() < 0.9:
                dx, dy = last_direction
            else:
                dx, dy = random.choice(DIRECTIONS)
                last_direction = (dx, dy)
                
            x += dx
            y += dy
            x = max(1, min(WIDTH - 2, x))
            y = max(1, min(HEIGHT - 2, y))
            w[0], w[1] = x, y
            
            if grid[y][x] == WALL:
                grid[y][x] = FLOOR
                floor_count += 1
    return grid

def print_map(grid):
    for row in grid:
        print("".join(row))
        
cave = generate()
print_map(cave)
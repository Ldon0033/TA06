from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

DATA = {
    "5-11": {"sleep": "10 hours", "activity": "60 min/day", "screen": "2 hrs/day", "sedentary": "4.2 hrs/day"},
    "12-17": {"sleep": "9 hours", "activity": "60 min/day", "screen": "3.5 hrs/day", "sedentary": "5.8 hrs/day"},
    "18-24": {"sleep": "8 hours", "activity": "150 min/day", "screen": "4.2 hrs/day", "sedentary": "6.5 hrs/day"},
    "25-34": {"sleep": "8 hours", "activity": "150 min/day", "screen": "4.8 hrs/day", "sedentary": "7.2 hrs/day"},
    "35-44": {"sleep": "8 hours", "activity": "150 min/day", "screen": "4.5 hrs/day", "sedentary": "7.5 hrs/day"},
    "45-54": {"sleep": "8 hours", "activity": "150 min/day", "screen": "4 hrs/day", "sedentary": "7.8 hrs/day"},
    "55-64": {"sleep": "8 hours", "activity": "150 min/day", "screen": "3.5 hrs/day", "sedentary": "8.2 hrs/day"},
    "65+": {"sleep": "8 hours", "activity": "150 min/day", "screen": "3 hrs/day", "sedentary": "8.8 hrs/day"},
}

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/task')
def task():
    return render_template('task.html')

@app.route('/insights')
def insights():
    return render_template('insights.html')

@app.route('/get_data', methods=['POST'])
def get_data():
    age = request.json.get("age")
    return jsonify(DATA.get(age, {}))

def generate_steps(task):
    task = task.lower()

    keywords = {
        "study": [
            "Review lecture notes",
            "Summarize key topics",
            "Practice questions",
            "Test yourself",
            "Final revision"
        ],
        "exam": [
            "Review important chapters",
            "Practice past exams",
            "Memorize key concepts",
            "Take mock test",
            "Rest before exam"
        ],
        "clean": [
            "Organize items",
            "Clean surfaces",
            "Vacuum floor",
            "Throw away trash",
            "Final check"
        ],
        "workout": [
            "Warm up",
            "Do main exercises",
            "Track progress",
            "Cool down",
            "Stretch"
        ],
        "code": [
            "Understand requirements",
            "Break into small tasks",
            "Write code",
            "Test and debug",
            "Refactor code"
        ],
        "assignment": [
            "Understand requirements",
            "Research topic",
            "Write draft",
            "Edit and improve",
            "Submit final version"
        ],
        "shopping": [
            "Make a list",
            "Check budget",
            "Buy items",
            "Organize purchases",
            "Review spending"
        ],
        "interview": [
            "Research company",
            "Prepare answers",
            "Practice speaking",
            "Prepare questions",
            "Review before interview"
        ],
        "write": [
            "Plan structure",
            "Write draft",
            "Edit content",
            "Check grammar",
            "Finalize writing"
        ]
    }

    # find matching keywords
    for key in keywords:
        if key in task:
            return keywords[key]

    # fallback (any task can use)
    return [
        "Break task into smaller steps",
        "Set a clear goal",
        "Start with the easiest part",
        "Take short breaks",
        "Review and complete"
    ]

# Step 4: intelligent decomposition
def generate_steps(task, size):
    task = task.lower()

    if "study" in task:
        steps = ["Review notes", "Summarise", "Practice", "Revise"]
    elif "clean" in task:
        steps = ["Pick up items", "Organise", "Clean", "Trash"]
    else:
        steps = ["Understand task", "Break down", "Start", "Finish"]

    return steps[:size + 2]


# Step 5: time estimation
def estimate_time(steps):
    times = [10 for _ in steps]
    total = sum(times)
    return times, total

if __name__ == '__main__':
    app.run(debug=True)
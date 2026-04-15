from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=api_key)

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

@app.route('/api/generate_steps_ai', methods=['POST'])
def generate_steps_ai():
    data = request.get_json()

    task_name = data.get("task_name", "").strip()
    due_date = data.get("due_date", "").strip()
    task_size = data.get("task_size", 3)

    if not task_name:
        return jsonify({"error": "Task name is required"}), 400

    prompt = f"""
You are helping a university student with ADHD break down a task into manageable steps.

Task name: {task_name}
Due date: {due_date if due_date else "No due date"}
Task size: {task_size} (1 = small, 5 = very large)

Please return JSON only in this exact format:
{{
  "steps": ["step 1", "step 2", "step 3"],
  "time_minutes": [10, 15, 10]
}}

Rules:
- Give 3 to 7 steps
- Use simple English
- Steps should be short, practical, and clear
- time_minutes must match the number of steps
- Make the answer suitable for a student with ADHD
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(text)
        return jsonify(result)

    except Exception as e:
        print("AI ERROR:", e)
        return jsonify({
            "error": "Failed to generate AI steps",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
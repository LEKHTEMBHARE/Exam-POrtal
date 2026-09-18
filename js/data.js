window.PYTHON_EXAM = window.PYTHON_EXAM || {};

window.PYTHON_EXAM.STORAGE_KEYS = {
  currentUser: 'pythonExamCurrentUser',
  results: 'pythonExamResults',
  feedback: 'pythonExamFeedback',
  attempt: 'pythonExamAttempt',
  lastResult: 'pythonExamLastResult',
  violations: 'pythonExamViolations',
  testSessions: 'pythonExamTestSessions'
};

const PYTHON_ACCOUNTS = [
  {
    email: 'lekhstudent1@gmail.com',
    password: 'Python@2026S1',
    role: 'student',
    name: 'Student 1'
  },
  {
    email: 'lekhstudent2@gmail.com',
    password: 'Python@2026S2',
    role: 'student',
    name: 'Student 2'
  },
  {
    email: 'pythonadmin@gmail.com',
    password: 'Python@Admin2026',
    role: 'admin',
    name: 'Admin'
  }
];

const SYLLABUS_TOPICS = [
  'Introduction to Python',
  'Installation and Setup',
  'First Python Program',
  'Variables and Data Types',
  'Input/Output',
  'Type Conversion',
  'Arithmetic, Comparison and Logical Operators',
  'if, elif, else',
  'for loop and range()',
  'while loop',
  'break and continue',
  'Strings',
  'Indexing and Slicing',
  'String Methods',
  'Lists',
  'Tuples',
  'Sets',
  'Dictionaries',
  'Functions',
  'File Handling',
  'Exception Handling',
  'Classes and Objects',
  'Expense Tracker Project'
];

const MCQ_POOL = [
  { id: 'MCQ-1', type: 'mcq', question: 'What is the output of print(10 + 3)?', options: ['13', '103', '7', '10'], correctAnswer: '13', explanation: 'Addition adds the values together to give 13.', topic: 'Arithmetic Operators', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-2', type: 'mcq', question: 'Which of these is a valid Python variable name?', options: ['2name', 'first_name', 'first-name', 'class'], correctAnswer: 'first_name', explanation: 'Variable names cannot start with a number or contain hyphens.', topic: 'Variables', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-3', type: 'mcq', question: 'What does type(3.5) return?', options: ['int', 'float', 'str', 'bool'], correctAnswer: 'float', explanation: 'A decimal number is stored as a float.', topic: 'Data Types', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-4', type: 'mcq', question: 'What is the result of int("12")?', options: ['"12"', 12, '12.0', 'None'], correctAnswer: 12, explanation: 'int() converts the string to an integer value.', topic: 'Type Conversion', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-5', type: 'mcq', question: 'Which operator checks if two values are equal?', options: ['=', '==', '!=', '>='], correctAnswer: '==', explanation: '== compares two values for equality.', topic: 'Comparison Operators', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-6', type: 'mcq', question: 'What is the output of print(8 > 5 and 3 < 2)?', options: ['True', 'False', '8', 'Error'], correctAnswer: 'False', explanation: 'The expression is True and False, which evaluates to False.', topic: 'Logical Operators', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-7', type: 'mcq', question: 'Which statement is correct for checking if a number is greater than 10?', options: ['if number = 10', 'if number > 10', 'if > 10 number', 'if 10 > number'], correctAnswer: 'if number > 10', explanation: 'The condition uses the > comparison operator.', topic: 'if/else', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-8', type: 'mcq', question: 'What is the value of x after: x = 5; x += 2?', options: ['5', '7', '2', 'None'], correctAnswer: '7', explanation: 'x += 2 means x = x + 2, so it becomes 7.', topic: 'Arithmetic Operators', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-9', type: 'mcq', question: 'Which loop is best for repeating a block a fixed number of times?', options: ['if', 'for', 'while', 'switch'], correctAnswer: 'for', explanation: 'A for loop is typically used when the number of repetitions is known.', topic: 'Loops', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-10', type: 'mcq', question: 'What does range(5) generate?', options: ['0,1,2,3,4', '1,2,3,4,5', '0,1,2,3,4,5', '1,2,3,4'], correctAnswer: '0,1,2,3,4', explanation: 'range(5) starts at 0 and stops before 5.', topic: 'range()', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-11', type: 'mcq', question: 'What is the output of for i in range(3): print(i)?', options: ['1 2 3', '0 1 2', '0 1 2 3', '3 2 1'], correctAnswer: '0 1 2', explanation: 'The loop starts from 0 and goes up to 2.', topic: 'for loop', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-12', type: 'mcq', question: 'What happens when break is used inside a loop?', options: ['Skips the current iteration only', 'Ends the loop immediately', 'Prints the loop value', 'Starts a new loop'], correctAnswer: 'Ends the loop immediately', explanation: 'break exits the loop completely.', topic: 'break', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-13', type: 'mcq', question: 'What does continue do in a loop?', options: ['Stops the whole loop', 'Skips the rest of the current iteration', 'Deletes the variable', 'Creates a new loop'], correctAnswer: 'Skips the rest of the current iteration', explanation: 'continue jumps to the next loop iteration.', topic: 'continue', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-14', type: 'mcq', question: 'What is the value of "Python"[0]?', options: ['"P"', '"y"', '"n"', 'Error'], correctAnswer: '"P"', explanation: 'String indexing starts at 0, so the first character is P.', topic: 'Strings', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-15', type: 'mcq', question: 'What is "hello".upper()?', options: ['hello', 'HELLO', 'Hello', 'hELLO'], correctAnswer: 'HELLO', explanation: 'upper() converts every character to uppercase.', topic: 'String Methods', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-16', type: 'mcq', question: 'What is "python"[1:4]?', options: ['"pyt"', '"yth"', '"ytho"', '"thon"'], correctAnswer: '"yth"', explanation: 'Slicing starts at index 1 and stops before index 4.', topic: 'Slicing', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-17', type: 'mcq', question: 'Which data type is ordered and changeable?', options: ['Tuple', 'Set', 'List', 'Dictionary'], correctAnswer: 'List', explanation: 'Lists are ordered and can be modified after creation.', topic: 'Lists', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-18', type: 'mcq', question: 'What is the result of [1, 2, 3] + [4, 5]?', options: ['[5, 6, 8]', '[1, 2, 3, 4, 5]', '[1, 2, 3, [4, 5]]', 'Error'], correctAnswer: '[1, 2, 3, 4, 5]', explanation: 'List concatenation joins both lists together.', topic: 'Lists', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-19', type: 'mcq', question: 'Which of these is a tuple?', options: ['[1, 2, 3]', '(1, 2, 3)', '{1, 2, 3}', '{"a": 1}'], correctAnswer: '(1, 2, 3)', explanation: 'Tuples use parentheses and are immutable.', topic: 'Tuples', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-20', type: 'mcq', question: 'What does {1, 2, 3} - {2}?', options: ['{1, 3}', '{2}', '{1, 2, 3}', 'Error'], correctAnswer: '{1, 3}', explanation: 'Set subtraction removes the common value 2.', topic: 'Sets', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-21', type: 'mcq', question: 'Which dictionary example is valid?', options: ['{"name": "Asha"}', '{["name"]: "Asha"}', '{("name"): "Asha"}', '["name": "Asha"]'], correctAnswer: '{"name": "Asha"}', explanation: 'A dictionary stores key-value pairs using curly braces.', topic: 'Dictionaries', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-22', type: 'mcq', question: 'What does d.get("age") return if d = {"name": "Ali", "age": 20}?', options: ['"Ali"', 20, '"age"', 'None'], correctAnswer: 20, explanation: 'get() returns the value for the key age.', topic: 'Dictionaries', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-23', type: 'mcq', question: 'Which function call is correct?', options: ['print("Hi")', 'print "Hi"', 'print["Hi"]', 'print{ "Hi" }'], correctAnswer: 'print("Hi")', explanation: 'Functions in Python are called using parentheses.', topic: 'Functions', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-24', type: 'mcq', question: 'What is the output of def add(a, b): return a + b; print(add(2, 3))?', options: ['5', '23', 'a+b', 'Error'], correctAnswer: '5', explanation: 'The function adds the two parameters and returns 5.', topic: 'Functions', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-25', type: 'mcq', question: 'Which mode is used to open a file for writing?', options: ['r', 'w', 'a', 'x'], correctAnswer: 'w', explanation: 'The w mode creates or overwrites a file for writing.', topic: 'File Handling', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-26', type: 'mcq', question: 'What does try/except help with?', options: ['Loops', 'File saving', 'Handling errors', 'Math operations'], correctAnswer: 'Handling errors', explanation: 'try/except catches exceptions and prevents a crash.', topic: 'Exception Handling', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-27', type: 'mcq', question: 'What is a class in Python?', options: ['A function', 'A blueprint for objects', 'A list', 'A loop'], correctAnswer: 'A blueprint for objects', explanation: 'Classes define the structure and behavior of objects.', topic: 'Classes and Objects', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-28', type: 'mcq', question: 'What is the correct way to create an object from a class named Student?', options: ['Student()', 'new Student()', 'Student = object()', 'class Student()'], correctAnswer: 'Student()', explanation: 'An instance is created by calling the class name with parentheses.', topic: 'Classes and Objects', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-29', type: 'mcq', question: 'What does input() return?', options: ['Integer', 'String', 'Float', 'List'], correctAnswer: 'String', explanation: 'input() always reads user input as a string.', topic: 'Input/Output', difficulty: 'Easy', marks: 1 },
  { id: 'MCQ-30', type: 'mcq', question: 'Which value is printed by print(7 % 3)?', options: ['2', '3', '4', '1'], correctAnswer: '1', explanation: '% gives the remainder of division, so 7 % 3 is 1.', topic: 'Arithmetic Operators', difficulty: 'Easy', marks: 1 }
];

const PROGRAMMING_POOL = [
  { id: 'PROG-1', type: 'programming', question: 'Write a Python program to check whether a number is even or odd.', expectedConcept: 'Use the modulo operator % to check if the number is divisible by 2.', validationRules: ['Should use % 2 or a similar divisibility check.', 'Must include if/else logic.', 'Output should clearly mention even or odd.'], topic: 'Conditionals', difficulty: 'Easy', marks: 1 },
  { id: 'PROG-2', type: 'programming', question: 'Write a Python program to find the sum of numbers in a list.', expectedConcept: 'Use a loop or built-in sum() to add all numbers in a list.', validationRules: ['Should work with a list of numbers.', 'Should calculate and print the total.', 'Basic Python syntax is required.'], topic: 'Lists and Loops', difficulty: 'Easy', marks: 1 },
  { id: 'PROG-3', type: 'programming', question: 'Write a Python program to check whether a number is positive, negative or zero.', expectedConcept: 'Use comparison checks to decide between positive, negative, and zero.', validationRules: ['Must use if/elif/else logic.', 'Should handle zero separately.', 'Should print the result clearly.'], topic: 'Conditional Logic', difficulty: 'Easy', marks: 1 },
  { id: 'PROG-4', type: 'programming', question: 'Write a Python program to print numbers from 1 to 10 using a loop.', expectedConcept: 'Use a for loop or while loop to print each number in order.', validationRules: ['Needs a loop.', 'Should print 1 through 10 in sequence.', 'Basic syntax should be valid.'], topic: 'Loops', difficulty: 'Easy', marks: 1 },
  { id: 'PROG-5', type: 'programming', question: 'Write a Python program to find the largest number in a list.', expectedConcept: 'Compare each number and track the largest value.', validationRules: ['Should use a list.', 'Should compare values logically.', 'Should print the largest element.'], topic: 'Lists and Functions', difficulty: 'Easy', marks: 1 },
  { id: 'PROG-6', type: 'programming', question: 'Write a Python program to reverse a string.', expectedConcept: 'Use slicing or a loop to reverse the characters.', validationRules: ['Should work with a string input.', 'Should return the reversed string.', 'Basic Python syntax is required.'], topic: 'Strings', difficulty: 'Easy', marks: 1 },
  { id: 'PROG-7', type: 'programming', question: 'Write a Python program to print the first 5 even numbers.', expectedConcept: 'Use a loop and a count to print even values.', validationRules: ['Should use a loop.', 'Should print 2, 4, 6, 8, 10 or similar.', 'Basic valid logic is required.'], topic: 'Loops and Numbers', difficulty: 'Easy', marks: 1 },
  { id: 'PROG-8', type: 'programming', question: 'Write a Python program to convert a temperature in Celsius to Fahrenheit.', expectedConcept: 'Apply the conversion formula F = (C * 9 / 5) + 32.', validationRules: ['Formula should be used correctly.', 'Should print the converted temperature.', 'Basic Python arithmetic is required.'], topic: 'Arithmetic Operators', difficulty: 'Easy', marks: 1 }
];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function shuffleWithSeed(list, seedValue) {
  const result = [...list];
  const baseSeed = typeof seedValue === 'string' ? seedValue : String(seedValue);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const factor = hashString(baseSeed + ':' + i) % (i + 1);
    const temp = result[i];
    result[i] = result[factor];
    result[factor] = temp;
  }
  return result;
}

function generateQuestionSetForStudent(studentEmail) {
  const email = (studentEmail || '').trim().toLowerCase();
  const mcqQuestions = shuffleWithSeed(MCQ_POOL, email + ':mcq');
  const programmingQuestions = shuffleWithSeed(PROGRAMMING_POOL, email + ':programming');
  const selectedMcq = mcqQuestions.slice(0, 18);
  const selectedProgramming = programmingQuestions.slice(0, 2);
  const total = [...selectedMcq, ...selectedProgramming];

  return total.map((question, index) => ({
    ...question,
    sessionId: `Q${index + 1}`,
    questionNumber: index + 1,
    isExpired: false,
    isLocked: false
  }));
}

window.PYTHON_EXAM.ACCOUNTS = PYTHON_ACCOUNTS;
window.PYTHON_EXAM.SYLLABUS_TOPICS = SYLLABUS_TOPICS;
window.PYTHON_EXAM.MCQ_POOL = MCQ_POOL;
window.PYTHON_EXAM.PROGRAMMING_POOL = PROGRAMMING_POOL;
window.PYTHON_EXAM.QUESTION_BANK = [...MCQ_POOL, ...PROGRAMMING_POOL];
window.PYTHON_EXAM.generateQuestionSetForStudent = generateQuestionSetForStudent;

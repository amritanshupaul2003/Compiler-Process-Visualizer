<img width="1893" height="992" alt="image" src="https://github.com/user-attachments/assets/a2897ca6-84be-40fb-a7b2-ac5c91ec7167" />


# Compiler Process Visualizer

## Introduction

Compiler Process Visualizer is a project aimed at providing a visual and interactive representation of the internals of a compiler. It helps users understand how source code transforms into executable programs by visualizing each phase such as lexical analysis, syntax analysis, semantic analysis, intermediate code generation, optimization, and code generation. This tool is ideal for students, educators, and developers interested in compiler design and programming language concepts.

## Features

- Step-by-step visualization of the compiler process.
- Support for multiple compiler phases: lexing, parsing, semantic analysis, and code generation.
- Interactive UI to input code and observe transformation at each stage.
- Highlighting of tokens, parse trees, symbol tables, and generated code.
- Modular structure for easy extension and customization.
- Educational focus for learning and demonstration purposes.

## Requirements

- Node.js (version 14 or higher recommended)
- npm (Node Package Manager)
- Modern web browser (for the front-end visualizer)
- Git (to clone the repository)



https://github.com/user-attachments/assets/e7f7f38d-ee47-4122-b381-a6ea354cfd97



## Installation

Follow these steps to set up Compiler Process Visualizer locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/amritanshupaul2003/Compiler-Process-Visualizer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Compiler-Process-Visualizer/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:3000` (or the port shown in your terminal).

## Usage

- Enter your source code in the input panel.
- Select the compiler phase you want to visualize (e.g., Lexical Analysis, Syntax Analysis).
- Click the "Visualize" button to see the transformation and data structures update in real-time.
- Explore outputs such as token streams, parse trees, symbol tables, and generated code.
- Use navigation controls to step through each phase or reset for a new input.

### Example Workflow

1. Paste a sample code snippet in the editor.
2. Choose "Lexical Analysis" and click "Visualize" to see tokens.
3. Proceed to "Syntax Analysis" to view parse trees.
4. Explore subsequent phases to deepen your understanding.

## Configuration

You can customize or extend the visualizer:

- **Add Language Support:** Extend the lexer and parser modules to support new programming languages.
- **Modify Visualization:** Edit the front-end components in the `/app` directory to adjust how each phase is displayed.
- **Change Port:** Modify the `package.json` or relevant configuration files to change the default running port.
- **Theming:** Adjust CSS styles for a personalized look.

## Contributing

We welcome contributions to improve Compiler Process Visualizer!

- Fork the repository and create your branch:  
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Make your changes and commit:  
  ```bash
  git commit -am "Add your feature"
  ```
- Push to your fork and open a pull request.

**Contribution Guidelines:**
- Write clear commit messages.
- Add tests for new features.
- Ensure compatibility with existing functionality.
- Update documentation if necessary.



---
---

Enjoy exploring compiler design with Compiler Process Visualizer!

# 🎯 Kanban Board App

A modern, responsive, and feature-rich Kanban Board web application designed for seamless task management and productivity. Built with vanilla JavaScript and Tailwind CSS, this application provides an intuitive drag-and-drop interface to organize tasks across multiple columns with real-time updates and persistent storage.

---

## 📸 Preview

Example: ![Light Mode](/assets/LightMode.png)
Example: ![Dark Mode](/assets/DarkMode.png)

---

## ✨ Features

### Core Functionality
- **🖱️ Drag and Drop Task Management** – Seamlessly move tasks between columns with intuitive drag-and-drop interactions
- **📋 Multiple Columns** – Organize tasks across three columns: To-Do, Doing, and Done
- **➕ Dynamic Task Creation** – Add tasks with custom descriptions, priority levels, and column selection
- **🗑️ Task Deletion** – Remove tasks with a single click
- **🔄 Real-time UI Updates** – Instant visual feedback for all actions

### User Experience
- **🌙 Dark/Light Mode** – Toggle between themes with smooth transitions and localStorage persistence
- **🔍 Task Filtering** – Filter tasks by All, Active, or Completed status
- **🎨 Priority Levels** – Categorize tasks as Low, Medium, or High priority with color-coded tags
- **📱 Fully Responsive** – Optimized for mobile, tablet, and desktop devices
- **⚡ Skeleton Loading** – Smooth loading experience with animated skeleton screens
- **💾 Persistent Storage** – Tasks and theme preferences saved to localStorage

### Performance & Quality
- **🚀 Optimized Rendering** – Uses document fragments for efficient DOM updates
- **🛡️ Input Sanitization** – XSS prevention with sanitized user input
- **⏱️ Rate Limiting** – Prevents spam with rate-limited task creation
- **🎯 Event Delegation** – Efficient event handling for dynamic elements
- **✨ Smooth Animations** – Glass-morphism design with fade-in, scale, and hover effects
- **♿ Accessibility** – Keyboard support (ESC to close modal) and ARIA labels

---

## 🛠️ Tech Stack

- **HTML5** – Semantic markup and structure
- **Tailwind CSS v3.4.0** – Utility-first CSS framework for modern styling
- **PostCSS** – CSS transformation and optimization
- **Autoprefixer** – Cross-browser compatibility
- **Vanilla JavaScript (ES6+)** – No frameworks, pure JavaScript implementation
- **DOM Manipulation** – Efficient direct DOM operations
- **LocalStorage API** – Client-side data persistence

---

## 📂 Project Structure

```
Kanban_Board/
├── dist/
│   └── output.css          # Compiled Tailwind CSS
├── src/
│   └── input.css            # Source CSS with custom components
├── index.html               # Main HTML structure
├── script.js                # Core JavaScript logic
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Project dependencies
├── package-lock.json        # Dependency lock file
└── README.md                # Project documentation
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kanban_Board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build Tailwind CSS**
   ```bash
   npm run build:css
   ```

   *For development with auto-reload:*
   ```bash
   npm run watch:css
   ```

4. **Open in browser**
   ```bash
   # Simply open index.html in your preferred browser
   # Or use a local server like Live Server
   ```

---

## 🧠 Key Learnings & Highlights

### Technical Implementation
- **State Management Without Frameworks** – Encapsulated state using IIFE pattern to avoid global pollution
- **Drag and Drop Logic** – Native HTML5 Drag and Drop API with throttled event handling for performance
- **DOM Caching Strategy** – Cached DOM elements in a single object for optimized access
- **Event Delegation** – Single event listener for dynamically created delete buttons
- **Document Fragments** – Batch DOM updates for improved rendering performance

### Code Architecture
- **Modular Functions** – Separated concerns with dedicated functions for theme, tasks, filters, and rendering
- **Input Validation** – Comprehensive validation with sanitization to prevent XSS attacks
- **Error Handling** – Try-catch blocks for localStorage operations with graceful fallbacks
- **Rate Limiting** – Configurable rate limits for task creation and drag events
- **Clean Component Structure** – Reusable task card creation with consistent styling

### UI/UX Enhancements
- **Glass Morphism Design** – Modern frosted glass effect with backdrop blur
- **Smooth Transitions** – CSS animations for fade-in, scale, and hover effects
- **Empty State Handling** – Visual placeholders when columns are empty
- **Task Counters** – Real-time badge counters for each column
- **Responsive Grid** – Adaptive layout that works on all screen sizes

---

## 🛡️ Performance & Code Quality

### Optimization Techniques
- **Efficient DOM Updates** – Document fragments minimize reflows and repaints
- **Event Throttling** – Drag events throttled to 100ms for smooth performance
- **CSS will-change** – Optimized animations with GPU acceleration hints
- **Minimal Global Scope** – IIFE pattern prevents namespace pollution
- **Lazy Loading** – Skeleton loader improves perceived performance

### Code Quality
- **Clean Code Principles** – Descriptive function names and single responsibility
- **Input Validation** – Type checking and data structure validation
- **XSS Prevention** – textContent instead of innerHTML for user input
- **Error Boundaries** – Graceful error handling for localStorage failures
- **Maintainable Structure** – Logical organization with clear separation of concerns

---

## 📱 Responsiveness

The application is fully responsive and optimized for:

- **📱 Mobile** (< 640px) – Single column layout with touch-friendly controls
- **📱 Tablet** (640px - 1024px) – Adaptive grid with optimized spacing
- **💻 Desktop** (> 1024px) – Full three-column layout with enhanced hover effects

---

## 🚀 Future Improvements

### Planned Features
- **📅 Task Deadlines** – Add due dates with reminder notifications
- **👥 User Authentication** – Multi-user support with individual task boards
- **☁️ Cloud Sync** – Backend integration for cross-device synchronization
- **🏷️ Task Labels** – Custom tags for better categorization
- **🔍 Advanced Search** – Search and filter tasks by text, priority, or date
- **📊 Analytics Dashboard** – Visual statistics on task completion rates
- **🎨 Custom Themes** – User-defined color schemes and themes
- **📤 Export/Import** – JSON export and import for task backup
- **💬 Task Comments** – Collaborative comments on individual tasks
- **🔔 Browser Notifications** – Desktop notifications for task reminders

### Technical Enhancements
- **🎭 Improved Drag Animations** – Enhanced visual feedback during drag operations
- **⚡ PWA Support** – Progressive Web App for offline functionality
- **🧪 Unit Testing** – Comprehensive test coverage with Jest
- **📏 E2E Testing** – Automated testing with Playwright or Cypress
- **🔧 TypeScript Migration** – Type safety for better development experience

---

## 👨‍💻 Author

**Krish**

Built with ❤️ and Code

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

Feel free to use, modify, and distribute as needed.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

For questions or suggestions, please open an issue in the repository.

---

**© 2026 Krish | All Rights Reserved**

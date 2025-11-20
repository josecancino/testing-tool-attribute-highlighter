# SEO Extension - Attribute Highlighter

A Chrome extension that helps developers and QA engineers find and highlight configurable `data-*` attributes on web pages.

## Features

- 🔍 **Search & Filter**: Quickly find attributes using the search bar
- 🎯 **Smart Highlighting**: Highlight all elements or individual items
- 📋 **Contextual Information**: See text content, image names, links, and more for each attribute
- 📱 **Collapsible Panel**: Minimize to a small icon when not in use
- 🔄 **Auto-update**: Automatically detects and displays new attributes as the page changes
- 📍 **Position-based Sorting**: Attributes are sorted by their position on the page (top to bottom)

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your toolbar

## Usage

1. Click the extension icon to open the popup
2. Enter the attribute name (e.g., `testid` for `data-testid`)
3. Click "Enable" to activate the extension
4. A side panel will appear showing all matching attributes
5. Use the search bar to filter attributes
6. Click "Highlight All" to highlight all elements, or click individual items to highlight specific elements
7. Click the `−` button to minimize the panel to a floating icon

## Development

### Setup

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Project Structure

```
seo-extension/
├── src/
│   ├── constants.js      # Constants and configuration
│   ├── state.js          # State management
│   ├── utils.js          # Utility functions
│   └── *.test.js         # Test files
├── content.js            # Main content script
├── popup.js              # Popup script
├── popup.html            # Popup UI
├── styles.css            # Styles
├── manifest.json         # Extension manifest
└── package.json          # Dependencies and scripts
```

## Testing

The extension uses Jest for testing. Tests are located in the `src/` directory with the `.test.js` suffix.

### Test Coverage

- Utility functions (element context info, sorting, etc.)
- State management
- Panel functionality (coming soon)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT

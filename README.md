# tonama

Tonama is a free game where players attempt to guess the origins of a family name. 

Tonama is written in HTML, CSS & JS.

Join us on Discord for more info.
Use [GitHub issues](https://github.com/seagullxd/tonama/issues) for bug reports and feature requests.

## Usage

## Supported browsers

| Name              | Version | Notes                                              |
| ----------------- | ------- | ---------------------------------------------------|
| Chromium / Chrome | 120+    | Full support (reasonable support for 112+)         |
| Firefox           | 117+    | Full support (fastest local analysis since FF 79)  |
| Edge              | 120+    | Full support (reasonable support for 112+)         |
| Opera             | 106+    | Full support support                               |
| Safari            | 17.2+   | Full support support                               |

## Development Setup
This project runs in the browser. The `jsconfig.json` and `eslint.config.js` are configured for browser APIs (document, window, etc.).

### Requirements
- [Zed](https://zed.dev) editor (or any LSP-compatible editor)
- Node.js 20+

### Installation
```bash
npm install
```

### Editor Configuration
This project includes configuration for:
- **Prettier**: Automatic code formatting on save
- **ESLint**: Code quality and error checking
- **TypeScript**: Type checking in JavaScript files via JSDoc

The editor should automatically detect these configurations when you open the project.

### Type Checking
This project uses TypeScript-style type checking in plain JavaScript files. When working with DOM elements, use JSDoc type assertions:

```javascript
const input = /** @type {HTMLInputElement} */ (document.getElementById('myInput'));
```

## Contributing
Pull requests are welcome. You should check whether or not another developer is already working on an open issue.  

For major changes, please open an issue first
to discuss what you would like to change.

## License
Tonama is licensed under the GNU General Public License v3.0 or any later version at your choice. See [license](https://choosealicense.com/licenses/gpl-3.0/) for details.

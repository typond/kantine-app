# Restaurant Menu Scraper with LLM Integration

This system implements intelligent restaurant menu scraping using LLM (Large Language Model) analysis of website screenshots. It can automatically detect menu pages, navigate to them, and extract menu items with high accuracy.

## 🚀 Features

- **Screenshot-based Analysis**: Takes screenshots of restaurant websites and uses LLM to analyze them
- **Smart Navigation**: Automatically detects and clicks menu buttons when needed
- **Menu Extraction**: Extracts menu items, prices, and descriptions from visual content
- **Fallback System**: Falls back to traditional HTML scraping if LLM analysis fails
- **Caching**: Caches results to avoid re-scraping the same restaurants
- **Error Handling**: Comprehensive error handling and retry logic

## 🛠️ How It Works

1. **Initial Screenshot**: Takes a screenshot of the restaurant's homepage
2. **LLM Analysis**: Sends the screenshot to Gemini API for analysis
3. **Page Detection**: LLM determines if the page contains a menu or needs navigation
4. **Button Detection**: If not a menu page, LLM identifies menu buttons to click
5. **Navigation**: Automatically clicks the identified menu button
6. **Menu Screenshot**: Takes another screenshot of the menu page
7. **Menu Extraction**: LLM extracts all menu items, prices, and descriptions
8. **Data Processing**: Converts LLM response to structured menu data

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Gemini API Key (for LLM analysis)
- Chrome/Chromium (for Puppeteer)

## 🔧 Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your Gemini API key
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```

3. **Get Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

## 🚀 Usage

### Start the Scraping Server

```bash
# Option 1: Use the startup script
./start-scraper.sh

# Option 2: Start manually
export GEMINI_API_KEY=your_api_key_here
npm start

# Option 3: Development mode with auto-restart
npm run dev
```

### API Endpoints

#### Scrape Restaurant Menu
```http
POST /api/scrape-restaurant
Content-Type: application/json

{
  "url": "https://example-restaurant.com"
}
```

**Response**:
```json
{
  "success": true,
  "menuItems": [
    {
      "name": "Grilled Salmon",
      "price": "$24.99",
      "description": "Fresh Atlantic salmon with herbs",
      "category": "Main Course"
    }
  ],
  "restaurantUrl": "https://example-restaurant.com",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "steps": [
    {
      "step": "initial_screenshot",
      "screenshot": "initial_1234567890.png"
    },
    {
      "step": "button_click",
      "buttonText": "Menu"
    }
  ]
}
```

#### Health Check
```http
GET /api/health
```

#### View Screenshots
```http
GET /screenshots/{filename}
```

## 🔄 Integration with Frontend

The scraping system is automatically integrated with the existing restaurant functionality:

1. When a user selects a restaurant, the system first tries the new LLM-powered scraping
2. If the scraping server is unavailable, it falls back to the original HTML scraping method
3. Results are cached in Firestore for future use
4. Menu items are analyzed with user preferences for personalized recommendations

## 📁 File Structure

```
├── server.js                    # Main scraping server
├── package.json                 # Dependencies and scripts
├── start-scraper.sh            # Startup script
├── env.example                 # Environment variables example
├── screenshots/                # Screenshot storage
├── temp/                       # Temporary files
└── RESTAURANT_SCRAPER_README.md # This file
```

## 🔧 Configuration

### Server Configuration

- **PORT**: Server port (default: 3001)
- **GEMINI_API_KEY**: Required for LLM analysis
- **Screenshot Timeout**: 30 seconds
- **Page Timeout**: 60 seconds
- **Max Retries**: 3 attempts

### LLM Configuration

- **Model**: gemini-2.0-flash-lite
- **Temperature**: 0.1 (for consistent results)
- **Max Output Tokens**: 2048
- **Analysis Prompt**: Optimized for menu detection and extraction

## 🐛 Troubleshooting

### Common Issues

1. **"Scraping server not available"**:
   - Make sure the server is running on port 3001
   - Check if Puppeteer can launch Chrome/Chromium

2. **"GEMINI_API_KEY not set"**:
   - Set the environment variable: `export GEMINI_API_KEY=your_key`
   - Or create a `.env` file with the key

3. **"Screenshot failed"**:
   - Check if the website is accessible
   - Verify Puppeteer installation
   - Try increasing timeouts in server.js

4. **"No menu items found"**:
   - The website might not have an online menu
   - LLM might need better prompts for specific restaurant types
   - Check the screenshots in `/screenshots/` to debug

### Debug Mode

Enable detailed logging by checking the browser console when using the frontend integration.

## 🔒 Security Considerations

- The scraping server runs locally and doesn't expose sensitive data
- Screenshots are stored temporarily and cleaned up automatically
- API keys should be kept secure and not committed to version control
- The service respects website terms of service and implements rate limiting

## 📈 Performance

- **Typical Response Time**: 10-30 seconds per restaurant
- **Screenshot Size**: ~500KB per image
- **Cache Duration**: 24 hours
- **Memory Usage**: ~100MB per browser instance

## 🚀 Future Enhancements

- Support for different LLM providers (OpenAI, Claude, etc.)
- Multi-language menu support
- OCR fallback for text-heavy menus
- Restaurant-specific scraping rules
- Batch processing for multiple restaurants
- Cloud deployment options

## 📝 License

MIT License - see the main project license for details.


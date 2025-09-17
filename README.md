# Metadata Generator

🚀 **AI-powered metadata generator for Adobe Stock and Shutterstock platforms**

Generate high-quality metadata (titles, descriptions, keywords, categories) for your stock images and icons using OpenAI's GPT-4o-mini. Streamline your stock photography workflow with intelligent automation and your own API key.

## ✨ Features

### 🎯 **Dual Platform Support**
- **Adobe Stock**: Generate titles, keywords, categories (1-21), and releases
- **Shutterstock**: Generate descriptions, keywords, categories, editorial flags, mature content flags, and illustration flags

### 🤖 **AI-Powered Generation**
- **GPT-4o-mini Integration**: Advanced AI for contextual metadata generation
- **Your Own API Key**: Use your personal OpenAI API key for full control
- **Smart Category Mapping**: Automatic category assignment based on filename and content
- **Individual Regeneration**: Regenerate specific fields without affecting others
- **Accurate Cost Estimation**: Real-time token usage and cost calculation

### 🎨 **Modern User Interface**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Card-Based Layout**: Clean, organized interface for easy editing
- **Icon Preview**: Visual preview of uploaded files in generate page
- **Tag Interface**: Interactive keyword management with add/remove functionality
- **Real-time Counter**: Track keyword limits (49 for Adobe Stock, 50 for Shutterstock)
- **Settings Page**: Easy API key configuration with local storage

### 📊 **Workflow Management**
- **Multi-Step Process**: Upload → Generate → Review → Export
- **Integrated Upload**: Drag & drop file upload with preview
- **Generate Page**: Platform selection with file preview grid
- **Review & Edit**: Comprehensive editing interface with field-specific regeneration
- **CSV Export**: Download platform-specific CSV files ready for upload
- **Progress Tracking**: Visual feedback throughout the generation process
- **Token Usage Analytics**: Real-time cost tracking and usage statistics

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Integration**: OpenAI GPT-4o-mini
- **File Handling**: React Dropzone
- **CSV Generation**: Papa Parse
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- OpenAI API Key (you'll add this in the app settings)
- Modern web browser

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mmriz16/metadata-generator.git
   cd metadata-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Configure your API key**
   - Click on "⚙️ Settings" in the navigation
   - Enter your OpenAI API key
   - Click "Save API Key"
   - Your key is stored locally and never sent to our servers

## 📖 Usage

### 1. **Setup (First Time Only)**
- Visit the Settings page (⚙️ Settings)
- Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Enter and save your API key (stored locally in your browser)

### 2. **Upload Files**
- Drag & drop your image files (SVG, PNG, AI) onto the upload area
- Files are displayed with preview thumbnails
- Click "Next: Generate Metadata" to proceed

### 3. **Generate Metadata**
- Review uploaded files with visual previews
- Select your target platform (Adobe Stock or Shutterstock)
- Click "✨ Generate Metadata" to start AI processing
- View real-time token usage and cost estimation

### 4. **Review & Edit**
- Review AI-generated metadata in the card-based interface
- Edit any field manually if needed
- Use "Re-Generate" buttons to regenerate specific fields
- Manage keywords with the interactive tag interface
- Monitor token usage and costs in real-time

### 5. **Export CSV**
- Navigate to the Export page
- Review the final metadata in table format
- Download platform-specific CSV file
- Upload to your chosen stock platform

## 🎨 Supported File Types

- **SVG** (.svg) - Vector graphics
- **PNG** (.png) - Raster images
- **AI** (.ai) - Adobe Illustrator files

## 💰 Pricing & Cost Control

### **Your API Key, Your Control**
- **Bring Your Own Key**: Use your personal OpenAI API key
- **Direct Billing**: Costs go directly to your OpenAI account
- **No Hidden Fees**: No markup or additional charges from us
- **Full Transparency**: Real-time token usage and cost tracking

### **GPT-4o-mini Pricing (2024)**
- **Input Tokens**: $0.15 per 1M tokens
- **Output Tokens**: $0.60 per 1M tokens
- **Typical Cost**: ~$0.0009 for 10 files (extremely affordable)
- **Real-time Calculation**: See exact costs before and after generation

## 🔒 Security & Privacy

### **Local Storage Only**
- **Browser Storage**: API key stored locally in your browser
- **No Server Storage**: We never store or see your API key
- **Domain Specific**: Key only accessible on this application
- **Full Control**: You can clear or change your key anytime

### **Data Privacy**
- **No Data Collection**: We don't collect or store your files or metadata
- **Client-Side Processing**: File previews generated in your browser
- **Direct API Calls**: Your requests go directly to OpenAI
- **Session Storage**: Generated metadata stored locally until export

## 📊 Platform Specifications

### Adobe Stock
- **Title**: Max 200 characters
- **Keywords**: Max 49 keywords
- **Category**: Numerical (1-21)
- **Releases**: Optional text field

### Shutterstock
- **Description**: Max 200 characters
- **Keywords**: Max 50 keywords
- **Categories**: Text-based categories
- **Editorial**: Yes/No flag
- **Mature Content**: Yes/No flag
- **Illustration**: Yes/No flag

## 🔧 Configuration

### API Key Management
- **Settings Page**: `/settings` - Configure your OpenAI API key
- **Local Storage**: API key stored in browser localStorage
- **Validation**: Real-time API key format validation
- **Security**: Keys never transmitted to our servers

### Category Mapping
- **Adobe Stock**: `src/lib/categoryMapping.json`
- **Shutterstock**: `src/lib/shutterstockCategoryMapping.json`

### OpenAI Integration
- **Model**: GPT-4o-mini (cost-efficient)
- **Dynamic Instances**: Created per-request with user's API key
- **Token Tracking**: Real-time usage and cost calculation
- **Error Handling**: Proper 401 responses for missing/invalid keys

## 📁 Project Structure

### **Pages**
- `/` - Home page with drag & drop upload
- `/generate` - Platform selection with file preview
- `/review` - Metadata review and editing
- `/export` - CSV download and final review
- `/settings` - API key configuration
- `/upload` - Alternative upload interface

### **API Routes**
- `/api/metadata` - Adobe Stock metadata generation
- `/api/shutterstock-metadata` - Shutterstock metadata generation

### **Key Features**
- **localStorage Integration**: Persistent API key and session data
- **Image Optimization**: Next.js Image component for previews
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live token usage and cost tracking

```
src/
├── app/
│   ├── api/
│   │   ├── metadata/                     # Adobe Stock API
│   │   └── shutterstock-metadata/        # Shutterstock API
│   ├── page.tsx                          # Home page with upload
│   ├── review/                           # Review & edit interface
│   └── export/                           # CSV export page
├── components/
│   ├── ui/                               # shadcn/ui components
│   └── uploader/                         # File upload components
└── lib/
    ├── openai.js                         # OpenAI integration
    ├── categoryMapping.json              # Adobe Stock categories
    └── shutterstockCategoryMapping.json  # Shutterstock categories
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build command `npm run build`
- **Railway**: Add environment variables and deploy
- **Self-hosted**: Build with `npm run build` and serve `out/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4o-mini API
- **shadcn/ui** for the beautiful component library
- **Vercel** for the Next.js framework
- **Adobe Stock** and **Shutterstock** for platform specifications

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/mmriz16/as-metadata-generator/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Made with ❤️ for the stock photography community**

*Streamline your workflow, maximize your earnings, and focus on what you do best - creating amazing content.*

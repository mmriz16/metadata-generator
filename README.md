# AS Metadata Generator

🚀 **AI-powered metadata generator for Adobe Stock and Shutterstock platforms**

Generate high-quality metadata (titles, descriptions, keywords, categories) for your stock images and icons using OpenAI's GPT-4o-mini. Streamline your stock photography workflow with intelligent automation.

## ✨ Features

### 🎯 **Dual Platform Support**
- **Adobe Stock**: Generate titles, keywords, categories (1-21), and releases
- **Shutterstock**: Generate descriptions, keywords, categories, editorial flags, mature content flags, and illustration flags

### 🤖 **AI-Powered Generation**
- **GPT-4o-mini Integration**: Advanced AI for contextual metadata generation
- **Smart Category Mapping**: Automatic category assignment based on filename and content
- **Individual Regeneration**: Regenerate specific fields without affecting others

### 🎨 **Modern User Interface**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Card-Based Layout**: Clean, organized interface for easy editing
- **Tag Interface**: Interactive keyword management with add/remove functionality
- **Real-time Counter**: Track keyword limits (49 for Adobe Stock, 50 for Shutterstock)

### 📊 **Workflow Management**
- **Integrated Upload**: Drag & drop file upload with platform selection
- **Review & Edit**: Comprehensive editing interface with field-specific regeneration
- **CSV Export**: Download platform-specific CSV files ready for upload
- **Progress Tracking**: Visual feedback throughout the generation process

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Integration**: OpenAI GPT-4o-mini
- **File Handling**: React Dropzone
- **CSV Generation**: Papa Parse
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- OpenAI API Key
- Modern web browser

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mmriz16/as-metadata-generator.git
   cd as-metadata-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key to `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 1. **Upload Files**
- Drag & drop your image files (SVG, PNG, AI) onto the upload area
- Select your target platform (Adobe Stock or Shutterstock)
- Click "Generate Metadata" to start AI processing

### 2. **Review & Edit**
- Review AI-generated metadata in the card-based interface
- Edit any field manually if needed
- Use "Re-Generate" buttons to regenerate specific fields
- Manage keywords with the interactive tag interface

### 3. **Export CSV**
- Navigate to the Export page
- Review the final metadata in table format
- Download platform-specific CSV file
- Upload to your chosen stock platform

## 🎨 Supported File Types

- **SVG** (.svg) - Vector graphics
- **PNG** (.png) - Raster images
- **AI** (.ai) - Adobe Illustrator files

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

### Category Mapping
- **Adobe Stock**: `src/lib/categoryMapping.json`
- **Shutterstock**: `src/lib/shutterstockCategoryMapping.json`

### OpenAI Settings
- Model: GPT-4o-mini
- Configuration: `src/lib/openai.js`

## 📁 Project Structure

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

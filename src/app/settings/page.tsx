'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, EyeOff, Key, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsValid(true);
      setIsSaved(true);
    }
  }, []);

  const validateApiKey = (key: string) => {
    // Basic validation for OpenAI API key format
    return key.startsWith('sk-') && key.length > 20;
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsValid(validateApiKey(value));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (isValid) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsSaved(true);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setIsValid(false);
    setIsSaved(false);
    localStorage.removeItem('openai_api_key');
  };

  return (
    <div className="bg-gray-50" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-600">
            Configure your OpenAI API key to use the metadata generator
          </p>
        </div>

        {/* API Key Configuration */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">OpenAI API Key</h2>
              <p className="text-sm text-gray-600">Enter your OpenAI API key to generate metadata</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="sk-proj-..."
                  className={`w-full px-4 py-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    apiKey
                      ? isValid
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Validation Messages */}
              {apiKey && (
                <div className="mt-2 flex items-center gap-2">
                  {isValid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Valid API key format</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Invalid API key format</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSave}
                disabled={!isValid}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaved ? 'Saved' : 'Save API Key'}
              </Button>
              
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex items-center gap-2"
              >
                Clear
              </Button>
            </div>

            {isSaved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-800">
                    API key saved successfully!
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  You can now use the metadata generator with your API key.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to get your OpenAI API Key</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">OpenAI API Keys page</a></p>
            <p>2. Sign in to your OpenAI account</p>
            <p>3. Click &quot;Create new secret key&quot;</p>
            <p>4. Copy the generated key and paste it above</p>
            <p>5. Make sure you have sufficient credits in your OpenAI account</p>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Security Note:</p>
                <p>Your API key is stored locally in your browser and never sent to our servers. Only you have access to it.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">← Back to Home</Link>
          </Button>
          
          {isSaved && (
            <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <Link href="/">Start Using Generator →</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
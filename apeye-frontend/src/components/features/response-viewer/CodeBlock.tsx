'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/utils/response';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
}

export default function CodeBlock({ 
  code, 
  language, 
  showLineNumbers = true,
  wrapLines = true 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = async () => {
    try {
      await copyToClipboard(code);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="relative group">
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </>
        )}
      </Button>
      
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? vscDarkPlus : vs}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            minWidth: '100%',
            background: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
          }}
          wrapLongLines={wrapLines}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
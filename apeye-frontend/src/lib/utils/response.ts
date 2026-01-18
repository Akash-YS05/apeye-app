export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
  
  export function formatTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }
  
  export function getContentType(headers: Record<string, string>): string {
    const contentType = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === 'content-type'
    );
    return contentType ? contentType[1] : 'text/plain';
  }
  
  export function isJSON(contentType: string): boolean {
    return contentType.includes('application/json') || contentType.includes('text/json');
  }
  
  export function isXML(contentType: string): boolean {
    return contentType.includes('application/xml') || contentType.includes('text/xml');
  }
  
  export function isHTML(contentType: string): boolean {
    return contentType.includes('text/html');
  }
  
  export function formatJSON(data: any): string {
    try {
      if (typeof data === 'string') {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
  }
  
  export function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }
  
  export function downloadFile(content: string, filename: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
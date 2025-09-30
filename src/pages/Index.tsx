// This project has been restructured - check the new architecture!

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="mb-6 text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          🏗️ Project Restructured!
        </h1>
        <div className="space-y-4 text-left bg-card border border-border rounded-lg p-6">
          <p className="text-lg font-semibold text-foreground">Your financial advisor platform has been reorganized with proper client-server architecture:</p>
          
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium text-foreground">📁 <code>/frontend</code> - React + Vite client application</p>
              <p className="text-sm text-muted-foreground">Modern React app with Tailwind CSS and professional design system</p>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium text-foreground">🔧 <code>/backend</code> - Next.js API server</p>
              <p className="text-sm text-muted-foreground">Clean API architecture with AI chatbot integration</p>
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mt-4">
            <p className="font-medium text-foreground">🚀 To run the new structure:</p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              npm run setup && npm run dev
            </code>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Check the <code>README.md</code> for complete setup instructions and architecture details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

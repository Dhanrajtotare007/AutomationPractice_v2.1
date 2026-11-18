import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  resetKey?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface the failure for developers without crashing the shell.
    console.error('[ui] render error', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="surface mx-auto max-w-xl p-6 text-center" role="alert" data-testid="error-boundary">
          <AlertOctagon className="mx-auto h-10 w-10 text-red-500" aria-hidden />
          <h1 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Something went wrong on this screen</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{this.state.error.message}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => this.setState({ error: null })} data-testid="error-retry">
              Try again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload the page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

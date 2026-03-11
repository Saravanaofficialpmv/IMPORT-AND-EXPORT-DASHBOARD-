import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge Component', () => {
    it('renders correctly with default variant', () => {
        const { container } = render(<Badge>Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('applies destructive variant styling correctly', () => {
        const { container } = render(<Badge variant="destructive">Destructive</Badge>);
        expect(container.firstChild).toHaveClass('bg-red-600/20 text-red-400');
    });

    it('applies outline variant styling correctly', () => {
        const { container } = render(<Badge variant="outline">Outline</Badge>);
        expect(container.firstChild).toHaveClass('text-slate-300 border-slate-600');
    });
});

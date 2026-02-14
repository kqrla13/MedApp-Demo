import { type ReactNode } from 'react';
import { Button } from '../UI/Button';
import { type ButtonProps } from '../UI/Button/Button.props';

interface PageHeaderProps {
    title: string;
    description?: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
    buttonVariant?: ButtonProps['variant'];
    buttonIcon?: ReactNode;
    className?: string;
}

export const PageHeader = ({
    title,
    description,
    buttonLabel,
    onButtonClick,
    buttonVariant = 'primary',
    buttonIcon,
    className = ''
}: PageHeaderProps) => {
    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-500 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {buttonLabel && (
                <Button
                    variant={buttonVariant}
                    size="md"
                    onClick={onButtonClick}
                    className="flex items-center gap-2"
                    leftIcon={buttonIcon}
                >
                    {buttonLabel}
                </Button>
            )}
        </div>
    );
};

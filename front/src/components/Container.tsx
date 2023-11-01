import { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode
}

function Container({ children }: ContainerProps) {
    const defaultStyle = {
        padding: '0',
        margin: '0',
        border: '0',
        boxSixing: 'border-box'
    }

    return (
        <div style={defaultStyle}>
            {children}
        </div>
    );
}

export default Container;
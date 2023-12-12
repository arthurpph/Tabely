import { useState, useEffect } from 'react';
import '../assets/styles/CustomMenu.css';

interface CustomMenuProps {
    contextMenuVisible: boolean;
    contextMenuPosition: { x: number, y: number };
    menuItems: Record<string, any>[];
}

function CustomMenu(props: CustomMenuProps) {
    const { contextMenuVisible, contextMenuPosition, menuItems } = props;

    const [hoveredMenuItem, setHoveredMenuItem] = useState<number>(-1);

    const handleMenuItemClick = (item: any) => {
        if(!item.subMenu && item.function) {
            item.function();
        }
    }

    useEffect(() => {
        setHoveredMenuItem(-1);
    }, [contextMenuVisible])

    return (
        <div>
            {contextMenuVisible && (
                <div className="custom-context-menu" id="customContextMenu" style={{ position: 'fixed', left: contextMenuPosition.x, top: contextMenuPosition.y, maxWidth: '10rem' }}>
                    {menuItems.map((item, index) => (
                        <div className={`custom-context-menu-item child ${item.subMenu ? 'has-submenu' : ''}`} key={index}>
                            <span onMouseEnter={() => setHoveredMenuItem(index)} onClick={() => handleMenuItemClick(item)} style={{ color: '#FFFFFF' }}>
                                {item.text}
                            </span>
                            {item.subMenu && hoveredMenuItem === index && (
                                <CustomMenu
                                    contextMenuVisible={true} 
                                    contextMenuPosition={{ x: contextMenuPosition.x + 140, y: contextMenuPosition.y }} 
                                    menuItems={item.subMenu}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomMenu;
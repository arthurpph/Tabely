import '../assets/styles/CustomMenu.css';

interface CustomMenuProps {
    contextMenuVisible: boolean;
    contextMenuPosition: { x: number, y: number }
    menuItems: Record<string, any>[]
}

function CustomMenu(props: CustomMenuProps) {
    const { contextMenuVisible, contextMenuPosition, menuItems } = props;

    return (
        <div>
            {contextMenuVisible && (
                <div className="custom-context-menu" id="customContextMenu" style={{ position: 'fixed', left: contextMenuPosition.x, top: contextMenuPosition.y }}>
                    {menuItems.map(item => (
                        <div className="custom-context-menu-item child" onClick={item.function}>{item.text}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomMenu;
import './SidebarCard.css';

const SidebarCard = ({sidebarCardData}) => {
    return ( 
        <div className="sidebar-card card-shadow">
            <header className="title-section">
                {sidebarCardData.title}
            </header>
            <main className="content-section">
                {sidebarCardData.content}
            </main>
        </div>
     );
}
 
export default SidebarCard;
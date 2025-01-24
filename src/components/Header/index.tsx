import logo  from "../../assets/logo.svg"
import "./styles.scss"

export function Header(){
    return (
    <header className="headerContainer">
        <div className="headerContent">
            <img src={logo} alt="" />
            <nav>
                <a href="">Documentação</a>
            </nav>
        </div>
    </header>
    )
}
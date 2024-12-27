function NavDisplay (props) {

    return(
        <>
            <img className={props.imageUrl} src={props.imageUrl} alt="" />
            <p>{props.textName}</p>
        </>
        )
        
}

export default NavDisplay
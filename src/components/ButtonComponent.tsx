const ButtonComponent = (name: string, action: Function) => {
    return (
        <button class='btn btn-outline-primary' onClick={action}>{name}</button>
    );
}
export default ButtonComponent;
